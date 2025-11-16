const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const pool = require("./config/database");

// Load environment variables
dotenv.config();

// Route imports
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacher");
const studentRoutes = require("./routes/student");
const taskRoutes = require("./routes/tasks");
const performanceRoutes = require("./routes/performance");

// App initialization
const app = express();
const server = http.createServer(app);

// CORS Configuration - Allow all origins in development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ CORS: Allowing origin: ${origin}`);
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
    
    // Also allow any local network IPs
    const isLocalNetwork = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?/.test(origin);
    
    if (allowedOrigins.includes(origin) || isLocalNetwork) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS: Blocked origin: ${origin}`);
      callback(null, true); // Still allow in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id']
};

const io = socketIO(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'no-origin'}`);
  
  // Log student route requests in detail
  if (req.path.includes('/student')) {
    console.log(`  → Student route accessed`);
    console.log(`  → Headers:`, JSON.stringify({
      authorization: req.headers.authorization ? 'present' : 'missing',
      origin: req.headers.origin
    }));
  }
  
  next();
});

// Active students tracking
global.activeStudents = {};

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`✅ [SOCKET] Client connected: ${socket.id}`);

  socket.on("student-update", async (data) => {
    try {
      console.log(`📊 [SOCKET] Student update received:`, {
        socketId: socket.id,
        studentId: data.studentId,
        taskId: data.taskId,
        currentQuestion: data.currentQuestion,
        codeLength: data.code?.length || 0,
        status: data.status
      });

      // Fetch student details from database
      let studentName = `Student ${data.studentId}`;
      let studentEmail = '';
      let rollNo = '';
      let section = '';
      
      try {
        const studentQuery = await pool.query(
          `SELECT s.*, u.email 
           FROM lms.students s 
           JOIN lms.users u ON s.user_id = u.id 
           WHERE s.user_id = $1`,
          [data.studentId]
        );
        
        console.log(`🔍 [SOCKET] Student query result for user_id ${data.studentId}:`, {
          rowCount: studentQuery.rows.length,
          firstRow: studentQuery.rows[0] || null
        });
        
        if (studentQuery.rows.length > 0) {
          const student = studentQuery.rows[0];
          // student.name is in students table (not users table)
          studentName = student.name || `Student ${data.studentId}`;
          studentEmail = student.email || '';
          rollNo = student.roll_no || '';
          section = student.section || '';
          console.log(`✅ [SOCKET] Fetched student details:`, {
            name: studentName,
            email: studentEmail,
            rollNo: rollNo,
            section: section
          });
        } else {
          console.warn(`⚠️ [SOCKET] No student found for user_id: ${data.studentId}`);
        }
      } catch (dbError) {
        console.error(`❌ [SOCKET] Error fetching student details:`, dbError.message);
      }

      // Fetch task details
      let taskTitle = `Task ${data.taskId}`;
      try {
        const taskQuery = await pool.query(
          'SELECT title FROM lms.tasks WHERE id = $1',
          [data.taskId]
        );
        if (taskQuery.rows.length > 0) {
          taskTitle = taskQuery.rows[0].title;
          console.log(`✅ [SOCKET] Fetched task: ${taskTitle}`);
        }
      } catch (dbError) {
        console.error(`❌ [SOCKET] Error fetching task details:`, dbError.message);
      }

      global.activeStudents[socket.id] = {
        studentId: data.studentId,
        studentName,
        studentEmail,
        rollNo,
        section,
        taskId: data.taskId,
        taskTitle,
        currentQuestion: data.currentQuestion,
        code: data.code || '',
        codeLength: data.code?.length || 0,
        status: data.status,
        timestamp: new Date().toISOString()
      };
      
      console.log(`� [SOCKET] Stored student data:`, {
        socketId: socket.id,
        studentId: data.studentId,
        studentName,
        rollNo,
        section,
        taskTitle
      });
      
      console.log(`�📡 [SOCKET] Broadcasting active students (${Object.keys(global.activeStudents).length} total)`);
      io.emit("active-students-update", global.activeStudents);
    } catch (error) {
      console.error("❌ [SOCKET] Error handling student update:", error);
      socket.emit("error", "Failed to update student status");
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 [SOCKET] Client disconnected: ${socket.id}`);
    delete global.activeStudents[socket.id];
    console.log(`📡 [SOCKET] Broadcasting active students (${Object.keys(global.activeStudents).length} remaining)`);
    io.emit("active-students-update", global.activeStudents);
  });

  socket.on("error", (error) => {
    console.error("❌ [SOCKET] Socket error:", error);
  });
});

// Health check endpoint
app.get("/health", (_, res) => res.json({ ok: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/performance", performanceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Get network IP addresses
const os = require('os');
function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

server.listen(PORT, HOST, () => {
  const networkIPs = getNetworkIPs();
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 SERVER STARTED SUCCESSFULLY`);
  console.log(`${'='.repeat(60)}\n`);
  
  console.log(`📍 Access URLs:`);
  console.log(`   Local:      http://localhost:${PORT}`);
  console.log(`   Local Alt:  http://127.0.0.1:${PORT}`);
  
  if (networkIPs.length > 0) {
    networkIPs.forEach(ip => {
      console.log(`   Network:    http://${ip}:${PORT}`);
    });
    console.log(`\n💡 Share network URL with other devices on same WiFi\n`);
  } else {
    console.log(`   Network:    Not available (check WiFi connection)\n`);
  }
  
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log(`📧 SMTP:     ${process.env.SMTP_USER}`);
  console.log(`🗄️  Database: NeonDB (Cloud PostgreSQL)`);
  console.log(`📂 Schema:   ${process.env.DB_SCHEMA || 'lms'}`);
  console.log(`\n${'='.repeat(60)}\n`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});
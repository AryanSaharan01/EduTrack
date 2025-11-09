const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");

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
const io = socketIO(server, {
  cors: { 
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Active students tracking
global.activeStudents = {};

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("student-update", (data) => {
    try {
      global.activeStudents[socket.id] = {
        studentId: data.studentId,
        taskId: data.taskId,
        currentQuestion: data.currentQuestion,
        codeLength: data.code?.length || 0,
        status: data.status,
        ts: new Date()
      };
      io.emit("active-students-update", global.activeStudents);
    } catch (error) {
      console.error("Error handling student update:", error);
      socket.emit("error", "Failed to update student status");
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    delete global.activeStudents[socket.id];
    io.emit("active-students-update", global.activeStudents);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 SMTP User: ${process.env.SMTP_USER}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}`);
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
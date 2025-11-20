/**
 * Production Error Handler Middleware
 * Handles errors gracefully in production environment
 */

const errorHandler = (err, req, res, next) => {
  // Log error for monitoring
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error status
  const statusCode = err.statusCode || err.status || 500;

  // Prepare error response
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse.error.message = 'Validation Error';
    errorResponse.error.details = err.details;
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    errorResponse.error.message = 'Unauthorized Access';
  } else if (err.name === 'DatabaseError') {
    errorResponse.error.message = 'Database Error';
    if (process.env.NODE_ENV === 'production') {
      // Don't expose database details in production
      errorResponse.error.message = 'An error occurred while processing your request';
    }
  }

  res.status(statusCode).json(errorResponse);
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.url,
      method: req.method,
      status: 404
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};

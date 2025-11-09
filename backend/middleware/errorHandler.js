const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error status and message
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Send different responses based on environment
  const response = {
    error: message,
    status,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      path: req.path,
      method: req.method
    })
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    response.status = 400;
    response.error = 'Validation Error';
    response.details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    response.status = 401;
    response.error = 'Authentication Error';
  }

  res.status(status).json(response);
};

module.exports = errorHandler;
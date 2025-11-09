const jwt = require('jsonwebtoken');

// Verify token middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    console.log('🔐 Auth Header:', authHeader);
    
    if (!authHeader) {
        return res.status(401).json({ 
            error: 'Authentication required',
            message: 'No token provided' 
        });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            error: 'Authentication required',
            message: 'Invalid token format' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified for user:', decoded.email);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return res.status(401).json({ 
            error: 'Authentication required',
            message: 'Invalid or expired token' 
        });
    }
};

// Authorize specific roles middleware
const authorize = (roles = []) => {
    return (req, res, next) => {
        // First verify token is present
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Authentication required',
                message: 'User not authenticated' 
            });
        }

        // Check if user has required role
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied',
                message: `This action requires ${roles.join(' or ')} role. You have ${req.user.role} role.` 
            });
        }

        next();
    };
};

module.exports = { 
    verifyToken, 
    authorize 
};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Sign a new JWT token
 * @param {Object} payload - Data to be encoded in the token
 * @returns {string} Signed JWT token
 */
const sign = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
  } catch (error) {
    console.error("JWT Sign Error:", error);
    throw new Error("Failed to generate token");
  }
};

/**
 * Verify and decode a JWT token
 * @param {string} token - Token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    return null;
  }
};

/**
 * Extract token from authorization header
 * @param {string} authHeader - Authorization header
 * @returns {string|null} Token or null if invalid
 */
const extractToken = (authHeader) => {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

module.exports = {
  sign,
  verify,
  extractToken
};
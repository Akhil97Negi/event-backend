const jwt = require('jsonwebtoken');

const Auth = (requiredRole) => async (req, res, next) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      console.log("Token not found in headers");
      return res.status(401).json("Token Not Found");
    }
    
    // Verify token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log("Token verification error:", err.message);
        return res.status(403).json('Token is Invalid!!');
      }
      
      req.user = decoded;
      console.log("Decoded token:", decoded);
      
      // Check if user role is permitted
      if (requiredRole && !requiredRole.includes(req.user.role)) {
        console.log("Authorization denied. User role:", req.user.role);
        return res.status(403).json('Authorization denied contact admin!!');
      }
      
      next();
    });
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = Auth;

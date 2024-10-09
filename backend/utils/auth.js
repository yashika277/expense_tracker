const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies["expense"] || req.headers.authorization?.split(" ")[1];

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is missing.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user linked to the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User associated with token not found",
      });
    }

    // Assign user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

exports.IsUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. User not authenticated.",
    });
  }

  // Proceed if the user has the 'user' role
  if (req.user.role_id === "user") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Permission denied for this resource.",
    });
  }
};

exports.IsAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Admin authentication required.",
    });
  }

  // Proceed if the user has the 'admin' role
  if (req.user.role_id === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access only for this resource.",
    });
  }
};

const jwt = require("jsonwebtoken");

exports.generateToken = (userId, res) => {
    // Generating the JWT token using the user's ID and a secret key
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
    );

    // Configuring the cookie to store the token, with security settings based on environment
    res.cookie("expense", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,  // Set to expire in 15 days
        httpOnly: true,  // Access restricted to HTTP(S) only
        sameSite: "strict",  // CSRF protection
        secure: process.env.NODE_ENV !== "development"  // Enable in non-dev environments
    });

    // Return the generated token
    return token;
};

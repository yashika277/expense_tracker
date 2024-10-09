const { compare } = require("../middleware/compare");
const { hash } = require("../middleware/hashpassword");
const User = require("../model/userModel");
const { generateToken } = require("../services/GenrateToken");

// Register a new user
exports.create = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        console.log(req.body);

        // Validate input fields
        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValidationRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // Check for existing users by email and username
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already taken",
            });
        }

        // Hash the password before saving
        const hashedPassword = await hash(password);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            res.status(200).json({
                success: true,
                message: "User registered successfully",
            });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// User login functionality
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not registered",
            });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate a token for the user
        generateToken(user._id, res);
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "", // Exclude password from response
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// User logout functionality
exports.logout = async (req, res) => {
    try {
        res.clearCookie("expense", {
            path: "/",
            httpOnly: true,
            sameSite: "Strict",
            secure: process.env.NODE_ENV !== "development",
        });

        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

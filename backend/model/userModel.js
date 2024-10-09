const { Schema, model } = require("mongoose");

// Define the user schema with the required fields
const userSchema = new Schema({
    username: {
        type: String,            // The user's username
        required: true,          // Username is mandatory
        unique: true,            // Ensure username uniqueness
        trim: true,              // Remove surrounding whitespace
    },
    email: {
        type: String,            // The user's email address
        required: true,          // Email is mandatory
        unique: true,            // Ensure email uniqueness
        trim: true,              // Remove surrounding whitespace
        lowercase: true,         // Convert email to lowercase
    },
    password: {
        type: String,            // The user's password
        required: true,          // Password is mandatory
    },
    role_id: {
        type: String,            // User's role identifier
        default: "user",         // Default role is user
        enum: ["user", "admin", "Sadmin"],  // Allowed roles
    },
}, {
    timestamps: true,           // Automatically add createdAt and updatedAt fields
});

// Create the User model based on the defined schema
const User = model("User", userSchema);

// Export the User model for use in other files
module.exports = User;

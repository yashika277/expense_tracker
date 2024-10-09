const bcrypt = require("bcryptjs");

exports.hash = async (plainPassword) => {
    try {
        // Generate a salt with a cost factor of 10
        const salt = await bcrypt.genSalt(10);
        // Hash the plain password using the generated salt
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword; // Return the hashed password
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Hashing failed'); // Optionally throw an error for handling
    }
};

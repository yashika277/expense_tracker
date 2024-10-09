const bcrypt = require("bcryptjs");

exports.compare = async (inputPassword, storedPassword) => {
    try {
        // Compare the plain password with the hashed password
        const isMatch = await bcrypt.compare(inputPassword, storedPassword);
        return isMatch; // Return the result of comparison
    } catch (error) {
        console.error('Error during password comparison:', error);
        throw new Error('Comparison failed'); // Optionally throw an error for handling
    }
};

const mongoose = require('mongoose');

// Define the schema for expense documents
const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is a mandatory field'],
    min: [0, 'Amount cannot be negative'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is necessary'],
    trim: true, // Remove extra spaces from the start and end
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Cash', 'Debit Card', 'Bank Transfer'], // Allowed values for payment method
    required: [true, 'Payment method must be specified'],
  },
  description: {
    type: String,
    trim: true, // Remove extra spaces
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

// Create the Expense model based on the defined schema
const Expense = mongoose.model('Expense', expenseSchema);

// Export the Expense model for use in other files
module.exports = Expense;

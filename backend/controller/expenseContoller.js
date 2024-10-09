const Expense = require("../model/expenseModel");
const fs = require("fs");
const csv = require("csv-parser");

// Create a single expense entry
exports.createExpense = async (req, res) => {
    try {
        const { amount, date, category, paymentMethod, description } = req.body;

        const expenseEntry = new Expense({
            amount,
            date,
            category,
            paymentMethod,
            description,
        });

        await expenseEntry.save();
        return res.status(201).json({ success: true, message: 'Expense added successfully' });
    } catch (error) {
        console.error('Error creating expense:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Handle bulk upload of expenses from a CSV file
exports.bulkUploadExpenses = async (req, res) => {
    try {
        const uploadedFile = req.file;

        if (!uploadedFile) {
            return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
        }

        const expenseList = [];
        fs.createReadStream(uploadedFile.path)
            .pipe(csv())
            .on('data', (row) => {
                expenseList.push(row);
            })
            .on('end', async () => {
                try {
                    const insertedRecords = await Expense.insertMany(expenseList);
                    return res.status(201).json({
                        success: true,
                        message: 'Expenses uploaded successfully',
                        insertedRecords,
                    });
                } catch (error) {
                    console.error('Error inserting expenses:', error);
                    return res.status(500).json({ success: false, message: 'Error inserting expenses' });
                }
            });
    } catch (error) {
        console.error('Error in bulk upload:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Retrieve all expenses without filtering or sorting
exports.GetAllData = async (req, res) => {
    try {
        const allExpenses = await Expense.find();
        return res.json({
            success: true,
            expenses: allExpenses,
        });
    } catch (error) {
        console.error('Error fetching all expenses:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Fetch expenses with filters, pagination, and sorting
exports.getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate, paymentMethod, sortBy, sortOrder, page, limit } = req.query;

        const filters = {};

        if (category) {
            filters.category = category;
        }

        if (startDate || endDate) {
            filters.date = {};
            if (startDate) filters.date.$gte = new Date(startDate);
            if (endDate) filters.date.$lte = new Date(endDate);
        }

        if (paymentMethod) {
            filters.paymentMethod = paymentMethod;
        }

        // Pagination defaults
        const currentPage = parseInt(page, 10) || 1;
        const itemsPerPage = parseInt(limit, 10) || 10;
        const skipCount = (currentPage - 1) * itemsPerPage;

        const sortField = sortBy || 'date';
        const sortOrderValue = sortOrder === 'desc' ? -1 : 1;

        // Fetch expenses with applied filters, sorting, and pagination
        const expensesList = await Expense.find(filters)
            .sort({ [sortField]: sortOrderValue })
            .skip(skipCount)
            .limit(itemsPerPage);

        const totalExpensesCount = await Expense.countDocuments(filters);

        return res.status(200).json({
            success: true,
            expenses: expensesList,
            pagination: {
                currentPage,
                itemsPerPage,
                totalItems: totalExpensesCount,
                totalPages: Math.ceil(totalExpensesCount / itemsPerPage),
            },
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const expenseToUpdate = await Expense.findById(id);
        if (!expenseToUpdate) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Update only provided fields
        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                expenseToUpdate[key] = updates[key];
            }
        });

        // Save the updated expense
        const updatedExpense = await expenseToUpdate.save();

        return res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            updatedExpense,
        });
    } catch (error) {
        console.error('Error updating expense:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Bulk delete expenses
exports.bulkDeleteExpenses = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide an array of expense IDs' });
        }

        const deletionResult = await Expense.deleteMany({ _id: { $in: ids } });

        return res.status(200).json({
            success: true,
            message: `${deletionResult.deletedCount} expenses deleted successfully`,
        });
    } catch (error) {
        console.error('Error deleting expenses:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Delete a single expense
exports.SingleDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({
                success: false,
                message: "No expense found with the provided ID",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
        });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

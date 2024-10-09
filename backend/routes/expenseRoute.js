const ExpenseController = require("../controller/expenseContoller");
const { auth, IsUser, IsAdmin } = require("../utils/auth");
const router = require("express").Router();
const upload = require("../utils/multer");

/**
 * @swagger
 * /expenses/createExpense:
 *   post:
 *     summary: Add a new expense entry
 *     description: Allows a user to create a new expense record
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *               date:
 *                 type: string
 *                 example: "2024-10-09"
 *               category:
 *                 type: string
 *                 example: "Groceries"
 *               paymentMethod:
 *                 type: string
 *                 enum: ['Credit Card', 'Cash', 'Debit Card', 'Bank Transfer']
 *                 example: "Credit Card"
 *               description:
 *                 type: string
 *                 example: "Shopping for groceries"
 *     responses:
 *       201:
 *         description: Expense successfully created
 *       400:
 *         description: Invalid request data
 */
router.post("/createExpense", auth, IsUser, ExpenseController.createExpense);

/**
 * @swagger
 * /expenses/bulk-upload:
 *   post:
 *     summary: Upload multiple expenses using CSV
 *     description: Allows uploading several expense records through a CSV file
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Expenses uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/bulk-upload",
  auth,
  IsUser,
  upload.single("file"),
  ExpenseController.bulkUploadExpenses
);

/**
 * @swagger
 * /expenses/getall:
 *   get:
 *     summary: Retrieve all expenses
 *     description: Fetches a list of all expenses without any filters or sorting applied
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Successfully retrieved all expenses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized access
 */
router.get("/getall", auth, IsUser, ExpenseController.GetAllData);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Fetch expenses with optional filtering and sorting
 *     description: Allows for filtering expenses by category, date range, and payment method, as well as sorting by amount or date.
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g., Groceries, Transport)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Starting date for filtering expenses
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ending date for filtering expenses
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *         description: Filter by payment method (e.g., Credit Card, Cash)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [amount, date]
 *         description: Sort expenses by amount or date
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Filtered and sorted expenses retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized access
 */
router.get("/", auth, IsUser, ExpenseController.getExpenses);

/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Modify an existing expense
 *     description: Allows updating an expense by its ID with partial or full data
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               paymentMethod:
 *                 type: string
 *                 enum: [Credit Card, Cash, Debit Card, Bank Transfer]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated successfully.
 *       400:
 *         description: Invalid data.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 */
router.patch("/:id", auth, IsUser, ExpenseController.updateExpense);

/**
 * @swagger
 * /expenses/bulk-delete:
 *   delete:
 *     summary: Delete multiple expenses by IDs
 *     description: Bulk delete of multiple expenses by providing an array of expense IDs
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of IDs of expenses to delete
 *     responses:
 *       200:
 *         description: Expenses deleted successfully.
 *       400:
 *         description: Invalid data.
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/expenses/bulk-delete",
  auth,
  IsUser,
  ExpenseController.bulkDeleteExpenses
);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Remove a specific expense
 *     description: Deletes an individual expense using its unique ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense to delete
 *     responses:
 *       200:
 *         description: Expense deleted successfully.
 *       404:
 *         description: Expense not found.
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", auth, IsUser, ExpenseController.SingleDelete);

module.exports = router;

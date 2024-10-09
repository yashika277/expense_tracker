const UserController = require("../controller/userController");
const router = require("express").Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new account
 *     description: Create a new user account using a username, email, and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 */
router.post("/signup", UserController.create);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in the user and provides a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *       401:
 *         description: Authentication failed
 */
router.post("/login", UserController.login);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out
 *     description: Logs out the currently authenticated user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", UserController.logout);

module.exports = router;

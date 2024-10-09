const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./config/db");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const UserRoutes = require("./routes/userRoute");
const ExpenseRoutes = require("./routes/expenseRoute");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT;

// Swagger setup
const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Expense Tracker API",
    version: "1.0.0",
    description: "API for managing and tracking expenses",
  },
  servers: [
    {
      url: "http://localhost:5000/api", // Update with your API base URL as necessary
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition: swaggerConfig,
  apis: ["./routes/userRoute.js", "./routes/expenseRoute.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route configuration
app.use("/api/v1", UserRoutes);
app.use("/api/v2/expense", ExpenseRoutes);

// Home route
app.get("/", (req, res) => {
  res.send(
    "<div style='text-align: center; padding-top: 20px;'><h1>Welcome to the Expense Tracker API</h1><p>Access the project and documentation on our <a href='https://github.com/sohamvirani/Expanse-Management' target='_blank'>GitHub Repository</a>.</p></div>"
  );
});


// Server setup
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

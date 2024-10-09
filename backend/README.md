<h1 align="center">MERN Backend for Expense Tracker</h1>

## Project Overview

-    **Technology Stack**: This application utilizes Node.js, Express.js, and MongoDB.
-    **CSV File Upload**: Functionality to upload CSV files using Multer.
-    **User Authentication**: Secure authentication implemented with JWT.
-    **Access Control**: Features for both authentication and authorization.
-    **JWT Token Validation**: Ensuring token integrity through verification.
-    **Expense Retrieval**: Ability to fetch expenses with sorting and searching capabilities.
-    **Data Entry**: Options to add both bulk data and individual expense entries.
-    **Expense Deletion**: Capabilities for both bulk and individual expense removal.
-    **Expense Modification**: Functionality to update existing expenses.
-    **Similar Expense API**: API for creating similar expense entries.

## Swagger UI for Expense Management

![Expense Dashboard](./images/swagger_docs.png)

This image showcases the dashboard of the Expense Tracker application, where users can efficiently manage and review their expenses, equipped with features for filtering, sorting, and bulk deletion.

### Configuration of .env File

```bash
MONGO_URL=Your_mongo_connection_string
PORT=Your_service_port
NODE_ENV=Your_environment_setting
JWT_SECRET=Your_jwt_secret_key


Running the Application Locally
npm run build

To Launch the Application
npm start
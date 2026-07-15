 # Backend
# VideoTube Backend 🎥🚀
 Model of the project
A robust, production-ready backend project built with Node.js, Express.js, MongoDB, and Cloudinary. This project serves as a full-featured API implementing complex user authentication workflows, profile management, video schemas, subscriptions, and user activity logging.
- **Eraser.io Architecture Model**: [Eraser.io Diagram & Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)
---
## 🛠️ Technology Stack
- **Core**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB & Mongoose (Object Data Modeling)
- **File Uploads**: Multer (Local disk storage) & Cloudinary (Cloud media management)
- **Security**: JWT (JSON Web Tokens) for authentication, bcrypt for password hashing
- **Development Tooling**: Nodemon (Hot-reloading), Prettier (Code formatting)
---
## ✨ Features
- **Robust Authentication**: JWT tokens (Access Token and Refresh Token) saved in secure, HTTP-only cookies.
- **User Account Management**: Register, login, logout, password change, password reset (via token), and profile deletion.
- **Media Uploading**: Integrated avatar and cover image uploading directly to Cloudinary.
- **Channels & Subscriptions**: Follow/subscribe mechanism for channels.
- **Watch History & Video Tracking**: Keep track of user-specific watch history and videos.
- **Activity Logger**: Track and record user login times, actions, IP addresses, and user-agent strings.
---
## 📂 Project Structure
```text
Backend-project-main/
├── public/                  # Static files & temporary file uploads
│   └── temp/                # Holds local files before uploading to Cloudinary
├── src/
│   ├── controllers/         # Express controllers (business logic)
│   │   └── user.controller.js
│   ├── db/                  # MongoDB connection setup
│   │   └── index.js
│   ├── middlewares/         # Custom Express middlewares
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/              # Mongoose schemas & models
│   │   ├── activity.models.js
│   │   ├── subscription.model.js
│   │   ├── user.models.js
│   │   └── video.models.js
│   ├── routes/              # Express API route configurations
│   │   └── user.router.js
│   ├── utils/               # Common helper classes and utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   └── recordActivityUtil.js
│   ├── app.js               # Express application config (CORS, cookies, parsers)
│   ├── constants.js         # Constant variables (e.g., DB name)
│   └── index.js             # Server entry point & DB connection init
├── .env.sample              # Example environment configuration
├── .gitignore
├── .prettierrc
└── package.json
```
---
## ⚙️ Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```env
PORT=8000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
ACCESS_TOKEN_SECRET=your-access-token-secret-key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
REFRESH_TOKEN_EXPIRY=10d
RESET_TOKEN_SECRET=your-reset-password-token-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```
---
## 🚀 Getting Started
### Prerequisites
Make sure you have Node.js (v16+) and MongoDB installed locally or access to a MongoDB Atlas cluster.
### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Backend-project-main
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Copy variables from the env template above and fill in your details into a new `.env` file in the root directory.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
---
## 🔌 API Endpoints Documentation
### User Routes (`/api/v1/users`)
|
 Method 
|
 Endpoint 
|
 Description 
|
 Auth Required 
|
 Payload / Form Data 
|
|
:---
|
:---
|
:---
|
:---:
|
:---
|
|
**
POST
**
|
`/register`
|
 Register a new user 
|
 ❌ 
|
 Form-data: 
`username`
, 
`email`
, 
`fullName`
, 
`password`
, 
`avatar`
 (file), 
`coverImage`
 (file, optional) 
|
|
**
POST
**
|
`/login`
|
 Log in a user 
|
 ❌ 
|
 JSON: 
`email`
 or 
`username`
, 
`password`
|
|
**
POST
**
|
`/logout`
|
 Log out a user & clear cookies 
|
|
 None 
|
|
**
POST
**
|
`/forgot-password`
|
 Request password reset token 
|
 ❌ 
|
 JSON: 
`email`
|
|
**
POST
**
|
`/reset-password/:token`
|
 Reset password using token 
|
 ❌ 
|
 JSON: 
`password`
|
|
**
GET
**
|
`/search`
|
 Search for users by keyword 
|
 ❌ 
|
 Query: 
`query`
|
|
**
POST
**
|
`/refresh-token`
|
 Generate new access & refresh tokens 
|
 ❌ 
|
 Cookie or JSON: 
`refreshToken`
|
|
**
POST
**
|
`/change-password`
|
 Change current password 
|
|
 JSON: 
`oldPassword`
, 
`newPassword`
|
|
**
GET
**
|
`/current-user`
|
 Retrieve details of current logged-in user 
|
|
 None 
|
|
**
PATCH
**
|
`/update-account`
|
 Update account details (name, email) 
|
|
 JSON: 
`fullName`
, 
`email`
|
|
**
PATCH
**
|
`/avatar`
|
 Update user avatar image 
|
|
 Form-data: 
`avatar`
 (file) 
|
|
**
PATCH
**
|
`/cover-image`
|
 Update user cover image 
|
|
 Form-data: 
`coverImage`
 (file) 
|
|
**
GET
**
|
`/c/:username`
|
 Retrieve channel details by username 
|
|
 Params: 
`username`
|
|
**
PATCH
**
|
`/update-profile`
|
 General profile updates 
|
|
 JSON data 
|
|
**
DELETE
**
|
`/delete-account`
|
 Delete user profile and account 
|
|
 None 
|
---
## 🛠️ Key Utilities and Architecture
### 1. Standardized API Classes
- **`asyncHandler.js`**: A wrapper to catch exceptions inside Express router handlers and forward them to the global error middleware, removing boilerplate `try-catch` blocks.
- **`ApiError.js`**: Extends the default `Error` class to format error messages, HTTP status codes, and trace errors cleanly.
- **`ApiResponse.js`**: Formats API responses with consistent structures: `{ statusCode, data, message, success }`.
### 2. Media Upload Pipeline
- **Multer Middleware (`multer.middleware.js`)**: Configured to temporarily store uploaded files onto the local disk (`public/temp`).
- **Cloudinary Helper (`cloudinary.js`)**: Uploads the locally saved file to Cloudinary and instantly deletes the local copy (`fs.unlinkSync`) once the upload succeeds or fails.
---
## 📜 License
This project is licensed under the **ISC License**. Developed with 💻 by Aman Kumar.
 -[Model link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

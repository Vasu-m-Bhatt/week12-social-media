# week12-social-media
# Real-Time Chat Application

A full-stack chat application built using modern web technologies. This project demonstrates real-time communication, authentication, database integration, and media sharing.

---

## Features

* Real-time chat using Socket.io
* User authentication (Signup/Login with JWT)
* Secure password hashing using bcrypt
* Private messaging between users
* Online users list
* Chat history stored in MongoDB
* Image sharing using Cloudinary
* Clean and modern user interface

---

## Tech Stack

### Frontend

* React.js
* Socket.io-client

### Backend

* Node.js
* Express.js
* Socket.io

### Database

* MongoDB (Mongoose)

### Other Tools

* Cloudinary (Image Upload)
* Multer (File handling)
* JWT (Authentication)
* bcrypt (Password hashing)

---

## Project Structure

```
project-root/

├── backend/
│   ├── models/
│   │   ├── Message.js
│   │   └── User.js
│   └── server.js

├── frontend/
│   └── src/
│       └── App.js

└── README.md
```

---

## Installation and Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Backend Setup

```
cd backend
npm install
node server.js
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm start
```

---

## Environment Variables

Create a `.env` file in the backend folder and add:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## How to Use

1. Create an account using signup
2. Login with your credentials
3. View online users
4. Select a user to start chatting
5. Send messages or images
6. Chat history will persist after refresh

---

## Screenshots

Add screenshots of:

* Login page
* Chat interface
* Image sharing

---

## Key Learnings

* Implementation of real-time communication using WebSockets
* Authentication and secure user handling
* Database integration for persistent storage
* Media upload handling using third-party services
* Structuring a full-stack application

---

## Future Improvements

* Typing indicator
* Online/offline status
* Message timestamps
* Mobile responsiveness
* Notification system

---

## Author

Aarav

---

## Conclusion

This project represents a complete full-stack application integrating frontend, backend, database, and real-time communication, similar to modern messaging platforms.

---

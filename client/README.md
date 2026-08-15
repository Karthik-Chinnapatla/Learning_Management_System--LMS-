# 🎓 LMS App — Learning Management System

## 📌 Overview

A full-stack Learning Management System (LMS) built using the MERN stack.

The application allows students to register, enroll in courses, access learning content, attend live classes, take quizzes, track their learning progress, and manage their profiles.

It also provides administrative features for managing courses, quizzes, live classes, and learning content.

---

## 🚀 Tech Stack

### Frontend
- React.js
- CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Tokens)
- Role-Based Access Control
- Protected Routes
- Password Authentication

### Cloud & Deployment
- Cloudinary
- MongoDB Atlas
- Vercel
- Render

---

## ✨ Key Features

### 👤 User Authentication
- User Registration
- User Login
- JWT-based authentication
- Protected routes
- Role-based access control

### 📚 Course Management
- Course listing
- Course enrollment
- Course content access
- Video and PDF learning materials
- Admin course upload

### 📝 Quiz & Assessment
- Quiz upload by admin
- Quiz access for students
- Assessment functionality

### 🎥 Live Classes
- Live class management
- Live class upload by admin
- Student access to live classes

### 👨‍💼 Admin Features
- Admin authentication
- Upload courses
- Upload quizzes
- Upload live classes
- Upload course content

### 👤 Profile Management
- View user profile
- Update profile information
- Profile picture support
- User information management

### 🌓 Dark Mode
- Light mode
- Dark mode
- Theme toggle from the navigation bar

### 📊 Learning Experience
- Course browsing
- Course enrollment
- Learning content access
- Progress tracking

---

## 📂 Project Structure

```text
lms-app/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       ├── assets/
│       ├── App.js
│       └── index.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── .gitignore
├── package.json
└── README.md
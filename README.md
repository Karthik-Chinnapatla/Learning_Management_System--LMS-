# 🎓 LMS App (Learning Management System)

## 📌 Overview

A full-stack Learning Management System (LMS) that allows users to enroll in courses, access learning content such as videos and PDFs, attend quizzes, track their learning progress, and earn certificates.

The application is built using a MERN-style architecture with JWT authentication, role-based access control, course enrollment, payments, live classes, file uploads, and AI-powered learning features.

---

## 🚀 Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Tokens)
- bcrypt
- Google Authentication

### File Storage
- Cloudinary
- Multer

### Payment
- Razorpay

### AI
- LangChain
- Gemini / LLM-based AI features
- RAG-based course assistance

### Other Technologies
- Jitsi
- JavaScript (ES6+)
- Git & GitHub

---

## ✨ Key Features

- 🔐 User Registration & Login
- 🔑 JWT Authentication
- 🔵 Google Login
- 👨‍💼 Role-Based Access Control
- 📚 Course Management
- 🛒 Course Enrollment
- 💳 Razorpay Payment Integration
- 🎥 Video Content Access
- 📄 PDF Content Access
- ☁️ Cloudinary File Uploads
- 📝 Quiz & Assessment Module
- 📊 Learning Progress Tracking
- 🏆 Certificate Generation
- 🎥 Live Classes using Jitsi
- 👤 User Profile Management
- 🌙 Dark Mode
- 🤖 AI-Powered Learning Assistant
- 📖 AI Course Assistance using RAG
- 🔒 Protected Routes

---

## 📂 Project Structure

```text
lms-app/
│
├── client/              → React frontend
│   ├── public/
│   └── src/
│
├── server/              → Node.js + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── uploads/
│
├── .gitignore
├── README.md
└── package.json
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import CourseUpload from "./pages/CourseUpload";
import UploadContent from "./pages/UploadContent";
import CourseList from "./pages/CourseList";

import QuizUpload from "./pages/QuizUpload";
import Quiz from "./pages/Quiz";

import Certificates from "./pages/Certificates";
import CourseViewer from "./pages/CourseViewer";

import LiveClasses from "./pages/LiveClasses";
import LiveClassUpload from "./pages/LiveClassUpload";
import LiveClassRoom from "./pages/LiveClassRoom";

import BuyCourse from "./pages/BuyCourse";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./styles/Navbar.css";
import "./styles/DarkMode.css";
import "./index.css";

function App() {
  // =====================================================
  // THEME STATE
  // =====================================================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // =====================================================
  // APPLY THEME
  // =====================================================

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (darkMode) {
      html.classList.add("dark-mode");
      body.classList.add("dark-mode");

      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark-mode");
      body.classList.remove("dark-mode");

      localStorage.setItem("theme", "light");
    }

    // Notify components that theme changed
    window.dispatchEvent(new Event("themeChanged"));
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Router>

        {/* =================================================
            TOAST
        ================================================= */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme={darkMode ? "dark" : "light"}
        />

        {/* =================================================
            NAVBAR
        ================================================= */}

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* =================================================
            ROUTES
        ================================================= */}

        <Routes>

          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN ROUTES
          ================================================= */}

          <Route
            path="/upload"
            element={
              <ProtectedRoute role="admin">
                <CourseUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz-upload"
            element={
              <ProtectedRoute role="admin">
                <QuizUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/liveclass-upload"
            element={
              <ProtectedRoute role="admin">
                <LiveClassUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload-content"
            element={
              <ProtectedRoute role="admin">
                <UploadContent />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              USER ROUTES
          ================================================= */}

          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:courseId"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/:id"
            element={
              <ProtectedRoute>
                <CourseViewer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/liveclasses"
            element={
              <ProtectedRoute>
                <LiveClasses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buy-course/:id"
            element={
              <ProtectedRoute>
                <BuyCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/liveclassroom/:roomId"
            element={
              <ProtectedRoute>
                <LiveClassRoom />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Router>
    </div>
  );
}

export default App;
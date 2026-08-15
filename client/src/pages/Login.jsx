import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

import { toast } from "react-toastify";

import signupImage from "../assets/signup-image.png";

import "../styles/Login.css";

// =====================================
// API URL
// =====================================

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  // =====================================
  // FORM STATE
  // =====================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // =====================================
  // NORMAL LOGIN
  // =====================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      // =================================
      // SAVE TOKEN
      // =================================

      localStorage.setItem(
        "token",
        response.data.token
      );

      // =================================
      // SAVE ROLE
      // =================================

      localStorage.setItem(
        "role",
        response.data.role
      );

      // =================================
      // SAVE USER
      // =================================

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // =================================
      // TELL NAVBAR
      // =================================

      window.dispatchEvent(
        new Event("authChanged")
      );

      console.log(
        "Logged in role:",
        response.data.role
      );

      // =================================
      // SUCCESS MESSAGE
      // =================================

      if (response.data.role === "admin") {
        toast.success("Admin login successful");
      } else {
        toast.success("Login successful");
      }

      // =================================
      // GO HOME
      // =================================

      navigate("/");
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      toast.error(
        error.response?.data?.msg ||
        "Login failed"
      );
    }
  };

  // =====================================
  // GOOGLE LOGIN
  // =====================================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      console.log(
        "Google credential received"
      );

      // =================================
      // SEND GOOGLE CREDENTIAL TO SERVER
      // =================================

      const response = await axios.post(
        `${API_URL}/api/auth/google-login`,
        {
          credential:
            credentialResponse.credential,
        }
      );

      console.log(
        "GOOGLE LOGIN RESPONSE:",
        response.data
      );

      // =================================
      // SAVE TOKEN
      // =================================

      localStorage.setItem(
        "token",
        response.data.token
      );

      // =================================
      // SAVE ROLE
      // =================================

      localStorage.setItem(
        "role",
        response.data.role
      );

      // =================================
      // SAVE USER
      // =================================

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      // =================================
      // DEBUG
      // =================================

      console.log(
        "Google user:",
        response.data.user
      );

      console.log(
        "Google user role:",
        response.data.role
      );

      // =================================
      // TELL NAVBAR
      // =================================

      window.dispatchEvent(
        new Event("authChanged")
      );

      // =================================
      // SUCCESS MESSAGE
      // =================================

      if (
        response.data.role === "admin"
      ) {
        toast.success(
          "Admin login successful"
        );
      } else {
        toast.success(
          "Google login successful"
        );
      }

      // =================================
      // GO HOME
      // =================================

      navigate("/");
    } catch (error) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );

      toast.error(
        error.response?.data?.msg ||
        "Google Login failed"
      );
    }
  };

  // =====================================
  // GOOGLE LOGIN ERROR
  // =====================================

  const handleGoogleError = () => {
    console.error(
      "Google Login Failed"
    );

    toast.error(
      "Google Login Failed"
    );
  };

  return (
    <div className="login-container">

      {/* =================================
          LEFT SIDE
      ================================= */}

      <div className="login-left">

        <div className="login-overlay">

          <h1>
            MyLMS
          </h1>

          <h2>
            Welcome Back
          </h2>

          <p>
            Continue your learning journey
            with interactive courses and
            live classes.
          </p>

        </div>

        {/* =================================
            STUDENT IMAGE
        ================================= */}

        <div className="login-image-container">

          <img
            src={signupImage}
            alt="Student learning with laptop"
            className="login-image"
          />

        </div>

      </div>


      {/* =================================
          RIGHT SIDE
      ================================= */}

      <div className="login-right">

        <div className="login-card">

          <h1>
            Login
          </h1>

          <p className="login-subtitle">
            Enter your credentials to continue
          </p>


          {/* =================================
              NORMAL LOGIN FORM
          ================================= */}

          <form
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              required
            />


            {/* PASSWORD */}

            <div className="login-password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                autoComplete="current-password"
                required
              />

              <span
                className="login-eye-icon"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </span>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-submit-button"
            >
              Login
            </button>

          </form>


          {/* =================================
              OR DIVIDER
          ================================= */}

          <div className="or-divider">

            <span>
              OR
            </span>

          </div>


          {/* =================================
              GOOGLE LOGIN
          ================================= */}

          <div className="google-login-wrapper">

            <GoogleLogin
              onSuccess={
                handleGoogleSuccess
              }
              onError={
                handleGoogleError
              }
              width="350"
            />

          </div>


          {/* =================================
              SIGNUP
          ================================= */}

          <p className="create-account-text">

            New here?{" "}

            <span
              onClick={() =>
                navigate("/signup")
              }
            >
              Create Account
            </span>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;
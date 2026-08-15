import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

import "../styles/Signup.css";
import signupImage from "../assets/signup-image.png";

const API_URL = process.env.REACT_APP_API_URL;

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // CHECK IF ALREADY LOGGED IN
  // =====================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/courses", { replace: true });
    }
  }, [navigate]);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // NORMAL SIGNUP
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        form
      );

      toast.success(res.data.msg);

      setForm({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log(err);

      if (err.response) {
        const message =
          err.response.data.msg || "Signup failed";

        setError(message);
        toast.error(message);
      } else {
        setError("Server Error");
        toast.error("Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GOOGLE SIGNUP / LOGIN
  // =====================================

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Google authentication failed");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/auth/google-login`,
        {
          credential: credentialResponse.credential,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.role
      );

      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }

      window.dispatchEvent(
        new Event("authChanged")
      );

      toast.success(
        res.data.role === "admin"
          ? "Admin login successful"
          : "Google Login Successful"
      );

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.msg ||
        "Google Login Failed"
      );
    }
  };

  // =====================================
  // GOOGLE ERROR
  // =====================================

  const handleGoogleError = () => {
    toast.error("Google Login Failed");
  };

  return (
    <div className="signup-container">

      {/* =====================================
          LEFT PURPLE SECTION
      ===================================== */}

      <div className="signup-left">

        <div className="signup-left-content">

          <div className="signup-brand">
            MyLMS
          </div>

          <h2>
            Start Your
            <br />
            Learning Journey
          </h2>

          <p className="signup-description">
            Join thousands of learners and explore
            courses anytime anywhere.
          </p>

          {/* =====================================
              LARGE BOY IMAGE
          ===================================== */}

          <div className="signup-image-container">

            <img
              src={signupImage}
              alt="Student learning with laptop"
              className="signup-image"
            />

          </div>

        </div>

      </div>


      {/* =====================================
          RIGHT SIDE
      ===================================== */}

      <div className="signup-right">

        <div className="signup-card">

          <h1>
            Create Account
          </h1>

          <p className="signup-subtitle">
            Fill your details to get started
          </p>


          {error && (
            <p className="signup-error">
              {error}
            </p>
          )}


          {/* =====================================
              SIGNUP FORM
          ===================================== */}

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />


            <div className="signup-password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <span
                className="signup-eye-icon"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>


            <button
              type="submit"
              disabled={loading}
              className="signup-submit-button"
            >
              {loading
                ? "Signing Up..."
                : "Sign Up"}
            </button>

          </form>


          {/* =====================================
              OR
          ===================================== */}

          <div className="signup-or-divider">

            <span></span>

            <p>
              OR
            </p>

            <span></span>

          </div>


          {/* =====================================
              GOOGLE SIGNUP
          ===================================== */}

          <div className="signup-google-wrapper">

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              width="350"
              text="signup_with"
              shape="rectangular"
              theme="outline"
            />

          </div>


          {/* =====================================
              LOGIN
          ===================================== */}

          <p className="signup-login-text">

            Already have an account?{" "}

            <span
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </span>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;
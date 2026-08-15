import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../styles/Home.css";


// ========================================
// API URL
// ========================================

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


// ========================================
// HOME COMPONENT
// ========================================

function Home() {

  // ========================================
  // LOGIN STATUS
  // ========================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );


  // ========================================
  // ADMIN STATUS
  // ========================================

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("role") === "admin"
  );


  // ========================================
  // STUDENTS
  // ========================================

  const [students, setStudents] = useState([]);

  const [showStudents, setShowStudents] = useState(false);

  const [loadingStudents, setLoadingStudents] = useState(false);

  const [studentError, setStudentError] = useState("");


  // ========================================
  // CHECK LOGIN AND ROLE
  // ========================================

  useEffect(() => {

    const updateAuthStatus = () => {

      const token = localStorage.getItem("token");

      const role = localStorage.getItem("role");

      setIsLoggedIn(!!token);

      setIsAdmin(role === "admin");

    };


    updateAuthStatus();


    window.addEventListener(
      "authChanged",
      updateAuthStatus
    );

    window.addEventListener(
      "focus",
      updateAuthStatus
    );


    return () => {

      window.removeEventListener(
        "authChanged",
        updateAuthStatus
      );

      window.removeEventListener(
        "focus",
        updateAuthStatus
      );

    };

  }, []);


  // ========================================
  // FETCH STUDENTS
  // ========================================

  const fetchStudents = async () => {

    try {

      setLoadingStudents(true);

      setStudentError("");


      const token =
        localStorage.getItem("token");


      if (!token) {

        setStudentError(
          "Please login first."
        );

        setLoadingStudents(false);

        return;
      }


      const response = await axios.get(
        `${API_URL}/api/auth/students`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      console.log(
        "STUDENTS RESPONSE:",
        response.data
      );


      // ====================================
      // ONLY STUDENTS
      // ====================================

      const allUsers =
        response.data.students || [];


      const onlyStudents =
        allUsers.filter(
          (user) =>
            user.role !== "admin"
        );


      setStudents(
        onlyStudents
      );

    } catch (error) {

      console.error(
        "FETCH STUDENTS ERROR:",
        error
      );


      setStudentError(
        error.response?.data?.msg ||
        "Unable to load students."
      );

    } finally {

      setLoadingStudents(false);

    }

  };


  // ========================================
  // STUDENTS INFO BUTTON
  // ========================================

  const handleStudentsInfo = () => {

    if (showStudents) {

      setShowStudents(false);

      return;

    }

    setShowStudents(true);

    fetchStudents();

  };


  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }


    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ========================================
  // GET STUDENT INITIAL
  // ========================================

  const getStudentInitial = (name) => {

    if (!name) {
      return "U";
    }


    return name
      .charAt(0)
      .toUpperCase();

  };


  // ========================================
  // RETURN
  // ========================================

  return (

    <main className="home-container">

      {/* ====================================
          HERO SECTION
      ==================================== */}

      <section className="hero-section">


        {/* BADGE */}

        <div className="hero-badge">

          ✨ Learn. Grow. Succeed.

        </div>


        {/* TITLE */}

        <h1 className="hero-title">

          Welcome to{" "}

          <span>
            MyLMS
          </span>

        </h1>


        {/* SUBTITLE */}

        <p className="hero-subtitle">

          Your all-in-one platform to learn new skills,
          track progress, and achieve your goals.

        </p>


        {/* BUTTONS */}

        <div className="hero-buttons">


          {/* ADMIN */}

          {isLoggedIn && isAdmin ? (

            <button
              type="button"
              className="primary-btn students-info-btn"
              onClick={handleStudentsInfo}
            >

              {showStudents
                ? "Hide Students ←"
                : "Students Info →"
              }

            </button>

          ) : isLoggedIn ? (

            /* NORMAL USER */

            <Link
              to="/courses"
              className="primary-btn"
            >

              Continue Learning →

            </Link>

          ) : (

            /* LOGGED OUT */

            <Link
              to="/signup"
              className="primary-btn"
            >

              Get Started →

            </Link>

          )}


          {/* BROWSE COURSES */}

          <Link
            to="/courses"
            className="secondary-btn"
          >

            Browse Courses →

          </Link>

        </div>


        {/* ==================================
            STUDENTS INFORMATION
        ================================== */}

        {isAdmin && showStudents && (

          <section className="students-section">


            {/* HEADER */}

            <div className="students-header">

              <div className="students-title-area">

                <div className="students-title-icon">
                  👥
                </div>

                <div>

                  <h2>
                    Students Information
                  </h2>

                  <p>
                    Registered students
                  </p>

                </div>

              </div>


              {/* COUNT */}

              <div className="student-count">

                <span className="count-icon">
                  👥
                </span>

                {students.length}

                <span>
                  Students
                </span>

              </div>

            </div>


            {/* LOADING */}

            {loadingStudents && (

              <div className="students-loading">

                <div className="loading-spinner"></div>

                Loading students...

              </div>

            )}


            {/* ERROR */}

            {!loadingStudents &&
              studentError && (

                <div className="students-error">

                  {studentError}

                </div>

              )}


            {/* TABLE */}

            {!loadingStudents &&
              !studentError &&
              students.length > 0 && (

                <div className="students-table-wrapper">

                  <table className="students-table">

                    <thead>

                      <tr>

                        <th className="number-column">
                          #
                        </th>

                        <th>
                          Name
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Role
                        </th>

                        <th>
                          Registered
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {students.map(
                        (student, index) => (

                          <tr
                            key={
                              student._id ||
                              student.id ||
                              index
                            }
                          >

                            <td className="number-cell">
                              {index + 1}
                            </td>


                            <td>

                              <div className="student-name">

                                <div className="student-avatar">

                                  {getStudentInitial(
                                    student.name
                                  )}

                                </div>

                                <span className="student-full-name">

                                  {student.name ||
                                    "N/A"}

                                </span>

                              </div>

                            </td>


                            <td className="email-cell">

                              {student.email ||
                                "N/A"}

                            </td>


                            <td>

                              <span className="role-badge student-role">

                                Student

                              </span>

                            </td>


                            <td className="registered-cell">

                              {formatDate(
                                student.createdAt
                              )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}


            {/* NO STUDENTS */}

            {!loadingStudents &&
              !studentError &&
              students.length === 0 && (

                <div className="no-students">

                  <div className="no-students-icon">
                    👥
                  </div>

                  <h3>
                    No Students Found
                  </h3>

                  <p>
                    There are no registered students yet.
                  </p>

                </div>

              )}

          </section>

        )}


        {/* ==================================
            STATS
        ================================== */}

        <div className="stats-container">


          {/* COURSES */}

          <div className="stat-box">

            <div className="stat-icon">
              📘
            </div>

            <div>

              <h2>
                100+
              </h2>

              <p>
                Courses
              </p>

            </div>

          </div>


          {/* STUDENTS */}

          <div className="stat-box">

            <div className="stat-icon">
              👨‍🎓
            </div>

            <div>

              <h2>
                10K+
              </h2>

              <p>
                Students
              </p>

            </div>

          </div>


          {/* RATING */}

          <div className="stat-box">

            <div className="stat-icon">
              ⭐
            </div>

            <div>

              <h2>
                4.8
              </h2>

              <p>
                Rating
              </p>

            </div>

          </div>

        </div>


      </section>

    </main>

  );

}

export default Home;
import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../styles/Navbar.css";


function Navbar({
  darkMode,
  setDarkMode,
}) {
  const navigate =
    useNavigate();

  const [
    isLoggedIn,
    setIsLoggedIn,
  ] = useState(
    !!localStorage.getItem(
      "token"
    )
  );

  const [
    isAdmin,
    setIsAdmin,
  ] = useState(
    localStorage.getItem(
      "role"
    ) === "admin"
  );

  const [
    showProfile,
    setShowProfile,
  ] = useState(false);

  const profileRef =
    useRef(null);


  // ========================================
  // GET USER
  // ========================================

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "user"
        ) || "null"
      );
    } catch {
      return null;
    }
  };


  const [
    userName,
    setUserName,
  ] = useState("");


  const [
    userEmail,
    setUserEmail,
  ] = useState("");


  const [
    profileImage,
    setProfileImage,
  ] = useState("");


  // ========================================
  // UPDATE USER DATA
  // ========================================

  const updateUserData =
    useCallback(() => {

      const token =
        localStorage.getItem(
          "token"
        );

      const role =
        localStorage.getItem(
          "role"
        );

      const user =
        getUser();

      setIsLoggedIn(
        !!token
      );

      setIsAdmin(
        role === "admin"
      );


      const name =
        user?.name ||
        localStorage.getItem(
          "userName"
        ) ||
        localStorage.getItem(
          "name"
        ) ||
        "";


      const email =
        user?.email ||
        localStorage.getItem(
          "userEmail"
        ) ||
        localStorage.getItem(
          "email"
        ) ||
        "";


      const image =
        user?.profileImage ||
        localStorage.getItem(
          "profileImage"
        ) ||
        localStorage.getItem(
          "profilePicture"
        ) ||
        "";


      setUserName(
        name ||
        (
          role === "admin"
            ? "Admin"
            : "Student"
        )
      );

      setUserEmail(
        email
      );

      setProfileImage(
        image
      );

    }, []);


  // ========================================
  // AUTH / PROFILE EVENTS
  // ========================================

  useEffect(() => {

    updateUserData();


    const updateAuthStatus =
      () => {
        updateUserData();
      };


    window.addEventListener(
      "authChanged",
      updateAuthStatus
    );


    window.addEventListener(
      "profileChanged",
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
        "profileChanged",
        updateAuthStatus
      );

      window.removeEventListener(
        "focus",
        updateAuthStatus
      );

    };

  }, [updateUserData]);


  // ========================================
  // CLOSE DROPDOWN
  // ========================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {
          setShowProfile(false);
        }

      };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "userName"
      );

      localStorage.removeItem(
        "name"
      );

      localStorage.removeItem(
        "userEmail"
      );

      localStorage.removeItem(
        "email"
      );

      // IMPORTANT:
      // profileImage is removed locally.
      // It is NOT removed from MongoDB.

      localStorage.removeItem(
        "profileImage"
      );

      localStorage.removeItem(
        "profilePicture"
      );


      setIsLoggedIn(false);

      setIsAdmin(false);

      setUserName("");

      setUserEmail("");

      setProfileImage("");

      setShowProfile(false);


      window.dispatchEvent(
        new Event(
          "authChanged"
        )
      );


      navigate("/login");

    };


  // ========================================
  // CONTACT US
  // ========================================

  const handleContactUs =
    () => {

      setShowProfile(false);

      const gmailComposeUrl =
        "https://mail.google.com/mail/?view=cm&fs=1&to=karthickchinnapatla@gmail.com";

      window.open(
        gmailComposeUrl,
        "_blank"
      );

    };


  // ========================================
  // CHANGE PROFILE
  // ========================================

  const handleChangeProfile =
    () => {

      setShowProfile(false);

      navigate("/profile");

    };


  // ========================================
  // DISPLAY NAME
  // ========================================

  const displayName =
    isAdmin
      ? userName || "Admin"
      : userName || "Student";


  // ========================================
  // INITIAL
  // ========================================

  const profileInitial =
    displayName
      .charAt(0)
      .toUpperCase();


  // ========================================
  // RETURN
  // ========================================

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="navbar-logo"
      >

        <span className="logo-icon">
          🎓
        </span>

        <span className="logo-text">
          MyLMS
        </span>

      </Link>


      {/* NAVIGATION */}

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>


        {isLoggedIn && (
          <>

            <Link to="/courses">
              Courses
            </Link>

            <Link to="/liveclasses">
              Live Classes
            </Link>

            {!isAdmin && (
              <Link to="/certificates">
                Certificates
              </Link>
            )}

          </>
        )}


        {isAdmin && (
          <>

            <Link to="/upload">
              Upload Course
            </Link>

            <Link to="/quiz-upload">
              Upload Quiz
            </Link>

            <Link to="/liveclass-upload">
              Upload Live Class
            </Link>

            <Link to="/upload-content">
              Upload Content
            </Link>

          </>
        )}

      </div>


      {/* RIGHT SIDE */}

      <div className="navbar-actions">

        {/* THEME */}

        <button
          type="button"
          className="theme-toggle"
          onClick={() =>
            setDarkMode(
              (previous) =>
                !previous
            )
          }
          aria-label="Toggle theme"
        >
          {darkMode
            ? "☀️"
            : "🌙"}
        </button>


        {/* LOGGED IN */}

        {isLoggedIn ? (

          <div
            className="profile-container"
            ref={profileRef}
          >

            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setShowProfile(
                  (previous) =>
                    !previous
                )
              }
            >

              {profileImage ? (

                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                />

              ) : (

                <span className="profile-initial">
                  {profileInitial}
                </span>

              )}

            </button>


            {/* DROPDOWN */}

            {showProfile && (

              <div className="profile-dropdown">

                {/* HEADER */}

                <div className="profile-header">

                  {profileImage ? (

                    <img
                      src={profileImage}
                      alt="Profile"
                      className="dropdown-profile-image"
                    />

                  ) : (

                    <div className="dropdown-profile-initial">
                      {profileInitial}
                    </div>

                  )}


                  <div className="profile-user-info">

                    <strong>
                      {displayName}
                    </strong>

                    <span className="profile-role">
                      {isAdmin
                        ? "Admin"
                        : "Student"}
                    </span>

                    {userEmail && (
                      <span className="profile-email">
                        {userEmail}
                      </span>
                    )}

                  </div>

                </div>


                <div className="profile-divider" />


                {/* CHANGE PROFILE */}

                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={
                    handleChangeProfile
                  }
                >

                  <span className="menu-icon">
                    👤
                  </span>

                  Change Profile

                </button>


                {/* ADMIN */}

                {isAdmin && (
                  <>

                    <Link
                      to="/upload"
                      className="profile-menu-item"
                      onClick={() =>
                        setShowProfile(false)
                      }
                    >

                      <span className="menu-icon">
                        📚
                      </span>

                      Upload Course

                    </Link>


                    <Link
                      to="/quiz-upload"
                      className="profile-menu-item"
                      onClick={() =>
                        setShowProfile(false)
                      }
                    >

                      <span className="menu-icon">
                        📝
                      </span>

                      Upload Quiz

                    </Link>


                    <Link
                      to="/liveclass-upload"
                      className="profile-menu-item"
                      onClick={() =>
                        setShowProfile(false)
                      }
                    >

                      <span className="menu-icon">
                        🎥
                      </span>

                      Upload Live Class

                    </Link>


                    <Link
                      to="/upload-content"
                      className="profile-menu-item"
                      onClick={() =>
                        setShowProfile(false)
                      }
                    >

                      <span className="menu-icon">
                        📄
                      </span>

                      Upload Content

                    </Link>

                  </>
                )}


                {/* STUDENT */}

                {!isAdmin && (
                  <>

                    <Link
                      to="/certificates"
                      className="profile-menu-item"
                      onClick={() =>
                        setShowProfile(false)
                      }
                    >

                      <span className="menu-icon">
                        🏆
                      </span>

                      Certificates

                    </Link>


                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={
                        handleContactUs
                      }
                    >

                      <span className="menu-icon">
                        ✉️
                      </span>

                      Contact Us

                    </button>

                  </>
                )}


                <div className="profile-divider" />


                {/* LOGOUT */}

                <button
                  type="button"
                  className="profile-menu-item logout-item"
                  onClick={
                    handleLogout
                  }
                >

                  <span className="menu-icon">
                    🚪
                  </span>

                  Logout

                </button>

              </div>

            )}

          </div>

        ) : (

          <>

            <Link
              to="/login"
              className="navbar-login"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="navbar-signup"
            >
              Sign Up
            </Link>

          </>

        )}

      </div>

    </nav>
  );
}

export default Navbar;
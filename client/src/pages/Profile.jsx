import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import "../styles/Profile.css";


const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


function Profile() {
  const navigate =
    useNavigate();


  // ========================================
  // STATE
  // ========================================

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    role,
    setRole,
  ] = useState("user");

  const [
    profileImage,
    setProfileImage,
  ] = useState("");

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);


  // ========================================
  // GET PROFILE
  // ========================================

  const fetchProfile =
    useCallback(async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate("/login");

          return;

        }


        const response =
          await fetch(
            `${API_URL}/api/auth/profile`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          toast.error(
            data.msg ||
              "Unable to load profile"
          );


          if (
            response.status === 401
          ) {

            localStorage.removeItem(
              "token"
            );

            navigate("/login");

          }

          return;

        }


        const user =
          data.user;


        setName(
          user.name || ""
        );

        setEmail(
          user.email || ""
        );

        setRole(
          user.role || "user"
        );

        setProfileImage(
          user.profileImage || ""
        );


        // Keep basic user information
        // synchronized locally

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        localStorage.setItem(
          "userName",
          user.name || ""
        );

        localStorage.setItem(
          "name",
          user.name || ""
        );

        localStorage.setItem(
          "userEmail",
          user.email || ""
        );

        localStorage.setItem(
          "email",
          user.email || ""
        );

        localStorage.setItem(
          "role",
          user.role || "user"
        );


      } catch (error) {

        console.error(
          "FETCH PROFILE ERROR:",
          error
        );

        toast.error(
          "Unable to connect to server."
        );


      } finally {

        setLoading(false);

      }

    }, [navigate]);


  useEffect(() => {

    fetchProfile();

  }, [fetchProfile]);


  // ========================================
  // PROFILE INITIAL
  // ========================================

  const profileInitial =
    name
      ? name
          .charAt(0)
          .toUpperCase()
      : role === "admin"
        ? "A"
        : "S";


  // ========================================
  // IMAGE CHANGE
  // ========================================

  const handleImageChange =
    (event) => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        toast.error(
          "Please select an image file."
        );

        return;

      }


      if (
        file.size >
        5 * 1024 * 1024
      ) {

        toast.error(
          "Profile image must be smaller than 5 MB."
        );

        return;

      }


      setSelectedFile(file);


      // Preview only

      const previewUrl =
        URL.createObjectURL(
          file
        );


      setProfileImage(
        previewUrl
      );

    };


  // ========================================
  // SAVE PROFILE
  // ========================================

  const handleSave =
    async () => {

      const trimmedName =
        name.trim();


      if (!trimmedName) {

        toast.error(
          "Please enter your full name."
        );

        return;

      }


      try {

        setSaving(true);


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          toast.error(
            "Please login again."
          );

          navigate("/login");

          return;

        }


        const formData =
          new FormData();


        formData.append(
          "name",
          trimmedName
        );


        if (selectedFile) {

          formData.append(
            "profileImage",
            selectedFile
          );

        }


        const response =
          await fetch(
            `${API_URL}/api/auth/profile`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body: formData,
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          if (
            response.status === 401
          ) {

            localStorage.removeItem(
              "token"
            );

            toast.error(
              "Session expired. Please login again."
            );

            navigate("/login");

            return;

          }


          toast.error(
            data.msg ||
              "Unable to update profile."
          );

          return;

        }


        // ==================================
        // UPDATED USER
        // ==================================

        const updatedUser =
          data.user;


        setName(
          updatedUser.name || ""
        );

        setEmail(
          updatedUser.email || ""
        );

        setRole(
          updatedUser.role || "user"
        );

        setProfileImage(
          updatedUser.profileImage || ""
        );

        setSelectedFile(null);


        // ==================================
        // UPDATE LOCAL STORAGE
        // ==================================

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        localStorage.setItem(
          "userName",
          updatedUser.name
        );

        localStorage.setItem(
          "name",
          updatedUser.name
        );

        localStorage.setItem(
          "userEmail",
          updatedUser.email
        );

        localStorage.setItem(
          "email",
          updatedUser.email
        );

        localStorage.setItem(
          "role",
          updatedUser.role
        );


        // ==================================
        // NOTIFY NAVBAR
        // ==================================

        window.dispatchEvent(
          new Event(
            "profileChanged"
          )
        );


        toast.success(
          "Profile updated successfully."
        );


        setTimeout(() => {

          navigate("/");

        }, 700);


      } catch (error) {

        console.error(
          "SAVE PROFILE ERROR:",
          error
        );

        toast.error(
          "Unable to save profile."
        );


      } finally {

        setSaving(false);

      }

    };


  // ========================================
  // CANCEL
  // ========================================

  const handleCancel =
    () => {

      navigate(-1);

    };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <main className="profile-page">

        <section className="profile-card">

          <p>
            Loading profile...
          </p>

        </section>

      </main>

    );

  }


  // ========================================
  // RETURN
  // ========================================

  return (

    <main className="profile-page">

      <section className="profile-card">

        {/* HEADER */}

        <div className="profile-page-header">

          <div>

            <span className="profile-page-label">
              ACCOUNT SETTINGS
            </span>

            <h1>
              Change Profile
            </h1>

            <p>
              Update your profile information
              and profile picture.
            </p>

          </div>

        </div>


        {/* PROFILE PICTURE */}

        <div className="profile-picture-section">

          <div className="profile-picture-wrapper">

            {profileImage ? (

              <img
                src={profileImage}
                alt="Profile"
                className="profile-picture"
              />

            ) : (

              <div className="profile-picture-initial">
                {profileInitial}
              </div>

            )}


            <label
              htmlFor="profile-image-input"
              className="profile-camera-button"
              title="Change profile picture"
            >
              📷
            </label>


            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              hidden
            />

          </div>


          <div className="profile-picture-text">

            <h2>
              {name || "Student"}
            </h2>


            <span
              className={`profile-role-badge ${
                role === "admin"
                  ? "admin"
                  : "student"
              }`}
            >

              {role === "admin"
                ? "Admin"
                : "Student"}

            </span>


            <p>
              Click the camera icon to
              change your profile picture.
            </p>

          </div>

        </div>


        {/* DIVIDER */}

        <div className="profile-page-divider" />


        {/* FORM */}

        <div className="profile-form">

          {/* NAME */}

          <div className="profile-field">

            <label htmlFor="profile-name">
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Enter your full name"
            />

          </div>


          {/* EMAIL */}

          <div className="profile-field">

            <label htmlFor="profile-email">
              Email Address
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              disabled
              placeholder="Email Address"
            />

            <span className="profile-field-note">
              Email address cannot be changed here.
            </span>

          </div>

        </div>


        {/* ACTIONS */}

        <div className="profile-actions">

          <button
            type="button"
            className="profile-cancel-button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>


          <button
            type="button"
            className="profile-save-button"
            onClick={handleSave}
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </section>

    </main>

  );

}

export default Profile;
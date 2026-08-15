import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/UploadContent.css";

function UploadContent() {
  const API_URL = process.env.REACT_APP_API_URL;

  const CLOUD_NAME =
    process.env.REACT_APP_CLOUD_NAME;

  const UPLOAD_PRESET =
    process.env.REACT_APP_UPLOAD_PRESET;

  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [video, setVideo] = useState(null);

  const [pdf, setPdf] = useState(null);

  const [videoProgress, setVideoProgress] =
    useState(0);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/courses`
        );

        setCourses(res.data);
      } catch (err) {
        console.log(err);

        setError(
          "Failed to load courses"
        );
      }
    };

    fetchCourses();
  }, [API_URL]);

  const uploadVideo = async () => {
    if (!selectedCourse || !video) {
      setError(
        "Select a course and video"
      );

      return;
    }

    try {
      setError("");
      setMessage("");
      setVideoProgress(0);

      const formData = new FormData();

      formData.append(
        "file",
        video
      );

      formData.append(
        "upload_preset",
        UPLOAD_PRESET
      );

      const cloudinaryRes =
        await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
          formData,
          {
            onUploadProgress: (event) => {
              const percent =
                Math.round(
                  (event.loaded * 100) /
                    event.total
                );

              setVideoProgress(
                percent
              );
            },
          }
        );

      const videoUrl =
        cloudinaryRes.data.secure_url;

      await axios.post(
        `${API_URL}/api/courses/${selectedCourse}/video-url`,
        {
          videoUrl,
          title: video.name,
        }
      );

      setMessage(
        "Video uploaded successfully"
      );

      setVideo(null);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Video upload failed"
      );
    }
  };

  const uploadPdf = async () => {
    if (!selectedCourse || !pdf) {
      setError(
        "Select a course and PDF"
      );

      return;
    }

    try {
      setError("");
      setMessage("");

      const formData =
        new FormData();

      formData.append(
        "pdf",
        pdf
      );

      const res =
        await axios.post(
          `${API_URL}/api/courses/${selectedCourse}/pdf`,
          formData
        );

      setMessage(
        res.data.message
      );

      setPdf(null);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "PDF upload failed"
      );
    }
  };

  return (
    <div className="page">

      <div className="upload-content-container">

        <h2>
          📚 Upload Course Content
        </h2>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {message && (
          <p className="success">
            {message}
          </p>
        )}

        <select
          value={selectedCourse}
          onChange={(e) =>
            setSelectedCourse(
              e.target.value
            )
          }
        >
          <option value="">
            Select Course
          </option>

          {courses.map(
            (course) => (
              <option
                key={course._id}
                value={course._id}
              >
                {course.title}
              </option>
            )
          )}
        </select>

        <h3>
          🎥 Upload Video
        </h3>

        <input
          type="file"
          accept="video/*"
          onChange={(e) =>
            setVideo(
              e.target.files[0]
            )
          }
        />

        <button
          className="upload-btn"
          onClick={uploadVideo}
        >
          Upload Video
        </button>

        {videoProgress > 0 && (
          <div className="upload-progress">

            <p>
              Uploading Video:{" "}
              {videoProgress}%
            </p>

            <progress
              value={videoProgress}
              max="100"
            />

          </div>
        )}

        <h3>
          📄 Upload PDF
        </h3>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            setPdf(
              e.target.files[0]
            )
          }
        />

        <button
          className="upload-btn"
          onClick={uploadPdf}
        >
          Upload PDF
        </button>

      </div>
    </div>
  );
}

export default UploadContent;
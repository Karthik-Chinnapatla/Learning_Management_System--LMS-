import { useState } from "react";
import axios from "axios";
import "../styles/CourseUpload.css";

function CourseUpload() {

  const API_URL =
    process.env.REACT_APP_API_URL;

  const CLOUD_NAME =
    process.env.REACT_APP_CLOUD_NAME;

  const UPLOAD_PRESET =
    process.env.REACT_APP_UPLOAD_PRESET;

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");
      setSuccess("");
      setUploadProgress(0);

      let imageUrl = "";

      if (image) {

        const formData =
          new FormData();

        formData.append(
          "file",
          image
        );

        formData.append(
          "upload_preset",
          UPLOAD_PRESET
        );

        const uploadRes =
          await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
            {
              onUploadProgress:
                (event) => {

                  const percent =
                    Math.round(
                      (event.loaded * 100) /
                      event.total
                    );

                  setUploadProgress(
                    percent
                  );
                },
            }
          );

        imageUrl =
          uploadRes.data.secure_url;
      }

      const response =
        await axios.post(
          `${API_URL}/api/courses/add`,
          {
            title,
            description,
            price,
            imageUrl,
          }
        );

      setSuccess(
        response.data.message
      );

      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setUploadProgress(0);

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Failed to create course"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="page">

      <div className="upload-container">

        <h2>
          📚 Create New Course
        </h2>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {success && (
          <p className="success">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            required
          />

          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            required
          />

          <input
            type="number"
            placeholder="Course Price (₹)"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
          />

          {uploadProgress > 0 && (
            <>
              <p>
                Uploading Image:
                {" "}
                {uploadProgress}%
              </p>

              <progress
                value={
                  uploadProgress
                }
                max="100"
                style={{
                  width: "100%",
                }}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {
              loading
                ? "Creating..."
                : "Create Course"
            }
          </button>

        </form>

      </div>

    </div>

  );
}

export default CourseUpload;
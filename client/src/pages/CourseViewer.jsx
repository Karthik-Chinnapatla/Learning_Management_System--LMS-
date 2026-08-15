import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/CourseViewer.css";

function CourseViewer() {
  const { id } = useParams();

  const [course, setCourse] =
    useState(null);

  const [activeSection, setActiveSection] =
    useState("video");

  const [hasAccess, setHasAccess] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  useEffect(() => {
    const fetchCourse =
      async () => {
        try {
          const API_URL =
            process.env.REACT_APP_API_URL;

          const user =
            JSON.parse(
              localStorage.getItem(
                "user"
              )
            );

          const courseRes =
            await axios.get(
              `${API_URL}/api/courses/${id}`
            );

          setCourse(
            courseRes.data
          );

          if (!user) {
            setChecking(false);
            return;
          }

          const enrollmentRes =
            await axios.get(
              `${API_URL}/api/enrollments/check/${id}/${user.id}`
            );

          setHasAccess(
            enrollmentRes.data
              .enrolled
          );
        } catch (err) {
          console.error(err);
        } finally {
          setChecking(false);
        }
      };

    fetchCourse();
  }, [id]);

  if (checking) {
    return (
      <h2
        style={{
          textAlign:
            "center",
          marginTop:
            "50px",
        }}
      >
        Checking Access...
      </h2>
    );
  }

  if (!course) {
    return <h1>Loading...</h1>;
  }

  if (!hasAccess) {
    return (
      <div
        style={{
          textAlign:
            "center",
          padding: "50px",
        }}
      >
        <h2>
          🔒 Paid Course
        </h2>

        <p>
          Purchase this
          course to access
          videos and PDFs.
        </p>

        <h3>
          ₹{course.price}
        </h3>
      </div>
    );
  }

  return (
    <div className="lms-layout">

      {/* SIDEBAR */}
      <div className="course-sidebar">

        <h2>
          LMS Course
        </h2>

        <div
          className={`lesson-item ${
            activeSection ===
            "video"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveSection(
              "video"
            )
          }
        >
          🎥 Videos
        </div>

        <div
          className={`lesson-item ${
            activeSection ===
            "pdf"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveSection(
              "pdf"
            )
          }
        >
          📄 PDF Notes
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="course-main">

        <h1>
          {course.title}
        </h1>

        <p className="course-description">
          {
            course.description
          }
        </p>

        {/* VIDEO SECTION */}
        {activeSection ===
          "video" && (
          <div>

            <h2 className="section-title">
              Course Videos
            </h2>

            {course.videoUrls
              ?.length > 0 ? (

              course.videoUrls.map(
                (
                  video,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="media-box"
                  >

                    <h3>
                      🎥{" "}
                      {video.title?.replace(
                        /\.[^/.]+$/,
                        ""
                      )}
                    </h3>

                    <video
                      controls
                      className="video-player"
                    >
                      <source
                        src={
                          video.url
                        }
                        type="video/mp4"
                      />
                    </video>

                    <div className="video-buttons">

                      <a
                        href={
                          video.url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="open-video-btn"
                      >
                        Open Video
                      </a>

                      <a
                        href={
                          video.url
                        }
                        download
                        className="download-video-btn"
                      >
                        Download Video
                      </a>

                    </div>

                  </div>
                )
              )

            ) : (

              <div className="empty-box">
                No videos
                uploaded.
              </div>

            )}

          </div>
        )}

        {/* PDF SECTION */}
        {activeSection ===
          "pdf" && (
          <div>

            <h2 className="section-title">
              PDF Notes
            </h2>

            {course.pdfUrls
              ?.length > 0 ? (

              course.pdfUrls.map(
                (
                  pdf,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="media-box"
                  >

                    <h3>
                      📄{" "}
                      {
                        pdf.title
                      }
                    </h3>

                    <div className="pdf-buttons">

                      <a
                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                          pdf.url
                        )}&embedded=true`}
                        target="_blank"
                        rel="noreferrer"
                        className="open-pdf-btn"
                      >
                        View PDF
                      </a>

                      <a
                        href={`${pdf.url}?fl_attachment=true`}
                        className="download-pdf-btn"
                      >
                        Download PDF
                      </a>

                    </div>

                  </div>
                )
              )

            ) : (

              <div className="empty-box">
                No PDFs
                uploaded.
              </div>

            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default CourseViewer;
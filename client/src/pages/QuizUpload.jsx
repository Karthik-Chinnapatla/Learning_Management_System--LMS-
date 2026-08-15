import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/QuizUpload.css";
import { toast } from "react-toastify";

function QuizUpload() {
  const [form, setForm] = useState({
    courseId: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ],
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/courses`
        );

        setCourses(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load courses");
      }
    };

    fetchCourses();
  }, [API_URL]);

  const handleCourseIdChange = (e) => {
    setForm({
      ...form,
      courseId: e.target.value,
    });
  };

  const handleQuestionChange = (
    index,
    field,
    value
  ) => {
    const updatedQuestions = [...form.questions];

    updatedQuestions[index][field] = value;

    setForm({
      ...form,
      questions: updatedQuestions,
    });
  };

  const handleOptionChange = (
    questionIndex,
    optionIndex,
    value
  ) => {
    const updatedQuestions = [...form.questions];

    updatedQuestions[questionIndex].options[
      optionIndex
    ] = value;

    setForm({
      ...form,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (form.questions.length === 1) {
      return;
    }

    const updatedQuestions = form.questions.filter(
      (_, i) => i !== index
    );

    setForm({
      ...form,
      questions: updatedQuestions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_URL}/api/quizzes/add`,
        form
      );

      toast.success(
        res.data.message ||
        "Questions uploaded successfully"
      );

      setForm({
        courseId: "",
        questions: [
          {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
          },
        ],
      });
    } catch (err) {
      console.error(err);

      if (err.response) {

        const msg =
          err.response.data.message ||
          "Failed to upload questions";

        setError(msg);
        toast.error(msg);

      } else {

        setError(
          "Server error / Network issue"
        );

        toast.error(
          "Server error / Network issue"
        );

      }
    } finally {
      setLoading(false);
    }
  };

    const generateAIQuiz = async () => {
    try {
      if (!form.courseId) {
        toast.error("Select a course first");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/quizzes/generate/${form.courseId}`
      );

      setForm((prev) => ({
        ...prev,
        questions: res.data.questions,
      }));

      toast.success("AI Quiz Generated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-upload-container">
      <h2>Upload Quiz</h2>

      {error && (
        <p className="error">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <select
          value={form.courseId}
          onChange={handleCourseIdChange}
          required
        >
          <option value="">
            Select Course
          </option>

          {courses.map((course) => (
            <option
              key={course._id}
              value={course._id}
            >
              {course.title}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="add-btn"
          onClick={generateAIQuiz}
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : "Generate AI Quiz"}
        </button>

        {form.questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="question-card"
          >
            <h3>
              Question {qIndex + 1}
            </h3>

            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(
                  qIndex,
                  "question",
                  e.target.value
                )
              }
              required
            />

            {q.options.map(
              (opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`Option ${
                    optIndex + 1
                  }`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(
                      qIndex,
                      optIndex,
                      e.target.value
                    )
                  }
                  required
                />
              )
            )}

            <input
              type="text"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(
                  qIndex,
                  "correctAnswer",
                  e.target.value
                )
              }
              required
            />

            <button
              type="button"
              className="remove-btn"
              onClick={() =>
                removeQuestion(qIndex)
              }
            >
              Remove Question
            </button>
          </div>
        ))}

        <button
          type="button"
          className="add-btn"
          onClick={addQuestion}
        >
          + Add Another Question
        </button>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading
            ? "Uploading..."
            : "Upload All Questions"}
        </button>

        

      </form>
    </div>
  );
}

export default QuizUpload;
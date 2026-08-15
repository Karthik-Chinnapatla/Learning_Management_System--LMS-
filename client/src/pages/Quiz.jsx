/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "../styles/Quiz.css";

function Quiz() {

  const { courseId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);

  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const API_URL =
    process.env.REACT_APP_API_URL;

  useEffect(() => {

    const fetchQuiz = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/quizzes/${courseId}`
        );

        setQuestions(res.data);

        if (res.data.length > 0) {

          const courseRes = await axios.get(
            `${API_URL}/api/courses/${courseId}`
          );

          setCourseTitle(
            courseRes.data.title
          );

        }

        setTimeLeft(
          res.data.length * 60
        );

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load quiz"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchQuiz();

  }, [courseId, API_URL]);

  useEffect(() => {

    if (
      loading ||
      timeLeft <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {

      setTimeLeft(
        (prev) => prev - 1
      );

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, loading]);

  useEffect(() => {

    if (
      !loading &&
      timeLeft <= 0 &&
      questions.length > 0 &&
      !quizCompleted
    ) {

      toast.warning(
        "⏰ Time Up! Quiz submitted automatically."
      );

      handleSubmit({
        preventDefault: () => {},
      });

    }

  }, [
    timeLeft,
    loading,
  ]);

  const handleSelect =
    (qId, answer) => {

      setAnswers({
        ...answers,
        [qId]: answer,
      });

    };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }

    if (quizCompleted) return;

    setSubmitting(true);

    let finalScore = 0;

    questions.forEach((q) => {

      if (
        answers[q._id] ===
        q.correctAnswer
      ) {
        finalScore++;
      }

    });

    setScore(finalScore);
    setShowResult(true);
    setQuizCompleted(true);

    toast.success(
      `Quiz Submitted! Score: ${finalScore}/${questions.length}`
    );

    if (
      finalScore >=
      Math.ceil(
        questions.length / 2
      )
    ) {

      try {

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        await axios.post(
          `${API_URL}/api/certificates/generate`,
          {
            userName: user?.name,
            userEmail: user?.email,
            courseTitle: courseTitle,
          }
        );

        toast.success(
          "Certificate Generated Successfully!"
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to generate certificate"
        );

      }

    }

    setSubmitting(false);

  };

  if (loading) {

    return (
      <div className="quiz-container">
        <h2>Loading Quiz...</h2>
      </div>
    );

  }

  if (error) {

    return (
      <div className="quiz-container">
        <h2>{error}</h2>
      </div>
    );

  }

  return (

    <div className="quiz-container">

      <h2>
        Quiz - {courseTitle}
      </h2>

      <div className="quiz-timer">

        Time Left :{" "}

        {Math.floor(timeLeft / 60)}
        :

        {String(timeLeft % 60)
          .padStart(2, "0")}

      </div>

      <form onSubmit={handleSubmit}>

        {questions.map(
          (q, index) => (

            <div
              className="quiz-question"
              key={q._id}
            >

              <p>

                {index + 1}. {q.question}

              </p>

              {q.options.map(
                (opt, i) => {

                  const labels = [
                    "A",
                    "B",
                    "C",
                    "D",
                  ];

                  return (

                    <label
                      key={i}
                      className="quiz-option"
                    >

                      <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      onChange={() =>
                        handleSelect(
                          q._id,
                          opt
                        )
                      }
                      disabled={quizCompleted}
                      required
                    />

                      <span className="option-label">

                        {labels[i]}.

                      </span>

                      {opt}

                    </label>

                  );

                }
              )}

              <hr />

            </div>

          )
        )}

        <button
          className="quiz-submit"
          type="submit"
          disabled={
            submitting ||
            quizCompleted
          }
        >

          {submitting
            ? "Submitting..."
            : "Submit Quiz"}

        </button>

      </form>

      {showResult && (

        <div className="result-overlay">

          <div className="result-modal">

            <h2>
              Quiz Completed 🎯
            </h2>

            <div className="score-circle">

              {score}/{questions.length}

            </div>

            <button
              onClick={() => {
                window.location.replace(
                  "/courses"
                );
              }}
            >
              Back to Courses
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default Quiz;
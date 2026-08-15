const Quiz = require("../models/Quiz");
const Course = require("../models/Course");

const axios = require("axios");
const pdfParse = require("pdf-parse");

const OpenAI = require("openai");

// ADD QUIZ
exports.addQuiz = async (req, res) => {
  try {
    const { courseId, questions } =
      req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID required",
      });
    }

    if (
      !questions ||
      questions.length === 0
    ) {
      return res.status(400).json({
        message: "No questions found",
      });
    }

    const quizDocs = questions.map(
      (q) => ({
        courseId,
        question: q.question,
        options: q.options,
        correctAnswer:
          q.correctAnswer,
      })
    );

    await Quiz.insertMany(quizDocs);

    res.status(201).json({
      message:
        "Quiz questions uploaded successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET QUIZ BY COURSE
exports.getQuizByCourse = async (
  req,
  res
) => {
  try {
    const courseId =
      req.params.courseId;

    const questions =
      await Quiz.find({
        courseId,
      });

    res.json(questions);
  } catch (err) {
    res.status(500).json({
      error: "Server error",
    });
  }
};

exports.generateQuizFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (
      !course.pdfUrls ||
      course.pdfUrls.length === 0
    ) {
      return res.status(400).json({
        message:
          "No PDFs found for this course",
      });
    }

    let courseText = "";

    for (const pdf of course.pdfUrls) {
      console.log(
        "READING PDF:",
        pdf.url
      );

      const response =
        await axios.get(pdf.url, {
          responseType:
            "arraybuffer",
        });

      const pdfData =
        await pdfParse(
          response.data
        );

      courseText +=
        pdfData.text + "\n";
    }

    console.log(
      "TEXT LENGTH:",
      courseText.length
    );

    courseText =
      courseText.substring(0, 3000);

    const client =
      new OpenAI({
        apiKey:
          process.env.OPENROUTER_API_KEY,
        baseURL:
          "https://openrouter.ai/api/v1",
      });

    const prompt = `
Generate 10 multiple choice questions.

Return ONLY valid JSON.

[
  {
    "question":"",
    "options":["","","",""],
    "correctAnswer":""
  }
]

Material:
${courseText}
`;

    const completion =
      await client.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    let responseText =
      completion.choices[0]
        .message.content;

    console.log(
      "AI RESPONSE:"
    );
    console.log(
      responseText
    );

    responseText =
      responseText
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    const questions =
      JSON.parse(
        responseText
      );

    res.json({
      questions,
    });

  } catch (err) {

    console.log(
      "ERROR:"
    );

    console.log(err);

    res.status(500).json({
      message:
        err.message,
    });
  }
};
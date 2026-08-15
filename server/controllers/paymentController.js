const Razorpay =
  require("razorpay");

const crypto =
  require("crypto");

const Course =
  require("../models/Course");

const Enrollment =
  require("../models/Enrollment");

exports.createOrder = async (req, res) => {
  try {

    console.log("REQ BODY:", req.body);


    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
    console.log(
      "KEY SECRET:",
      process.env.RAZORPAY_KEY_SECRET
    );

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    console.log("COURSE:", course);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    console.log("PRICE:", course.price);

    if (!course.price || course.price <= 0) {
      return res.status(400).json({
        message: "Invalid course price",
      });
    }

    const order = await razorpay.orders.create({
      amount: course.price * 100,
      currency: "INR",
    });

    console.log("ORDER:", order);

    res.json({
      success: true,
      order,
      course,
    });

  } catch (err) {

    console.log("CREATE ORDER ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {

    console.log("VERIFY PAYMENT HIT");
    console.log("REQ BODY:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
      amount,
    } = req.body;

    console.log("USER ID:", userId);
    console.log("COURSE ID:", courseId);
    console.log("PAYMENT ID:", razorpay_payment_id);

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
            "|" +
            razorpay_payment_id
        )
        .digest("hex");

    console.log(
      "GENERATED SIGNATURE:",
      generatedSignature
    );

    console.log(
      "RAZORPAY SIGNATURE:",
      razorpay_signature
    );

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      console.log(
        "SIGNATURE VERIFICATION FAILED"
      );

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    console.log(
      "SIGNATURE VERIFIED SUCCESSFULLY"
    );

    const enrollment =
      await Enrollment.create({
        userId,
        courseId,
        paymentId:
          razorpay_payment_id,
        amount,
      });

    console.log(
      "ENROLLMENT SAVED"
    );

    console.log(
      "ENROLLMENT:",
      enrollment
    );

    res.json({
      success: true,
      message:
        "Enrollment successful",
    });

  } catch (err) {

    console.log(
      "VERIFY PAYMENT ERROR:"
    );

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
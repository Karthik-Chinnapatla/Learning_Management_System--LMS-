import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import loadRazorpay from "../utils/loadRazorpay";
import { toast } from "react-toastify";

import "../styles/BuyCourse.css";

function BuyCourse() {
  const { id } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  const [course, setCourse] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/courses/${id}`
        );

        setCourse(res.data);
      } catch (err) {
        console.error(err);

        toast.error("Failed to load course");
      }
    };

    fetchCourse();
  }, [id, API_URL]);

  const handlePayment = async () => {
    setProcessing(true);

    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Razorpay failed to load");

      setProcessing(false);
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      toast.error("Please login again");

      setProcessing(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/payment/create-order`,
        {
          courseId: course._id,
        }
      );

      const options = {
        key: "rzp_test_TPhhKN7LVw2PZM",

        amount: data.order.amount,

        currency: data.order.currency,

        order_id: data.order.id,

        name: "LMS Platform",

        description: course.title,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API_URL}/api/payment/verify-payment`,
              {
                ...response,
                userId: user.id,
                courseId: course._id,
                amount: course.price,
              }
            );

            if (verifyRes.data.success) {
              toast.success(
                "Enrollment Activated! Start Learning 🚀"
              );

              setTimeout(() => {
                window.location.href =
                  `/course/${course._id}`;
              }, 1500);
            }
          } catch (err) {
            console.error(err);

            toast.error(
              "Payment succeeded but enrollment failed"
            );

            setProcessing(false);
          }
        },
      };

      const paymentObject =
        new window.Razorpay(options);

      paymentObject.open();
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to create payment order"
      );

      setProcessing(false);
    }
  };

  if (!course) {
    return (
      <h2 className="loading-text">
        Loading...
      </h2>
    );
  }

  return (
    <div className="buy-course-container">
      <div className="buy-course-card">

        <div className="buy-course-content">

          <h2 className="buy-course-title">
            {course.title}
          </h2>

          <p className="buy-course-description">
            {course.description}
          </p>

          <h3 className="buy-course-price">
            ₹{course.price}
          </h3>

          <button
            className="buy-course-btn"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing
              ? "Processing..."
              : "Buy Now"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default BuyCourse;
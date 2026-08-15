const express = require("express");

const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require(
  "../controllers/paymentController"
);

router.post(
  "/create-order",
  createOrder
);

router.post(
  "/verify-payment",
  verifyPayment
);

router.get(
  "/test",
  (req, res) => {
    res.json({
      message:
        "Payment route working",
    });
  }
);

module.exports = router;
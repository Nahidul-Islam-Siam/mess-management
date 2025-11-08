const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Member = require("../models/Member");

// GET payments for a specific month and year
router.get("/", async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ 
        success: false, 
        message: "Month and year are required" 
      });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    const payments = await Payment.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("memberId", "name")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new payment
router.post("/", async (req, res) => {
  try {
    const { memberId, amount, description } = req.body;

    if (!memberId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: "memberId and amount are required" 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Amount must be greater than 0" 
      });
    }

    // Verify member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    const payment = new Payment({
      memberId,
      amount: parseFloat(amount),
      description: description || "",
    });

    const savedPayment = await payment.save();
    res.status(201).json({ success: true, data: savedPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


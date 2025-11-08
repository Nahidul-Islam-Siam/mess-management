const express = require("express");
const router = express.Router();
const Bazar = require("../models/Bazar");
const Member = require("../models/Member");

// GET bazar entries for a specific month and year
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

    const bazars = await Bazar.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("paidById", "name")
      .sort({ createdAt: -1 });

    res.json(bazars);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new bazar entry
router.post("/", async (req, res) => {
  try {
    const { amount, description, paidById } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Valid amount is required" 
      });
    }

    // Verify member exists if paidById is provided
    if (paidById) {
      const member = await Member.findById(paidById);
      if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }
    }

    const bazar = new Bazar({
      amount: parseFloat(amount),
      description: description || "",
      paidById: paidById || undefined,
    });

    const savedBazar = await bazar.save();
    res.status(201).json({ success: true, data: savedBazar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

// GET bill for a specific month and year
router.get("/", async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ 
        success: false, 
        message: "Month and year are required" 
      });
    }

    const bill = await Bill.findOne({
      month: parseInt(month),
      year: parseInt(year),
    });

    if (!bill) {
      const emptyBill = {
        month: parseInt(month),
        year: parseInt(year),
        gas: 0,
        current: 0,
        wifi: 0,
      };
      return res.json(emptyBill);
    }

    res.json(bill.toObject());
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create or update bill
router.post("/", async (req, res) => {
  try {
    const { month, year, gas, current, wifi } = req.body;

    if (!month || !year) {
      return res.status(400).json({ 
        success: false, 
        message: "Month and year are required" 
      });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({ 
        success: false, 
        message: "Month must be between 1 and 12" 
      });
    }

    const bill = await Bill.findOneAndUpdate(
      { month: parseInt(month), year: parseInt(year) },
      {
        month: parseInt(month),
        year: parseInt(year),
        gas: parseFloat(gas) || 0,
        current: parseFloat(current) || 0,
        wifi: parseFloat(wifi) || 0,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


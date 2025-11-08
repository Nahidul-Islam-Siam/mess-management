const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");
const Member = require("../models/Member");

// GET meals for a specific month and year
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

    const meals = await Meal.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("memberId", "name")
      .sort({ date: 1, memberId: 1 });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create or update meal
router.post("/", async (req, res) => {
  try {
    const { memberId, date, breakfast, dinner } = req.body;

    if (!memberId || !date) {
      return res.status(400).json({ 
        success: false, 
        message: "memberId and date are required" 
      });
    }

    // Verify member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // Parse date and set to start of day
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);
    
    const startOfDay = new Date(mealDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(mealDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find existing meal or create new one
    const existingMeal = await Meal.findOne({
      memberId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    let meal;
    if (existingMeal) {
      // Update existing meal
      existingMeal.breakfast = breakfast !== undefined ? breakfast : existingMeal.breakfast;
      existingMeal.dinner = dinner !== undefined ? dinner : existingMeal.dinner;
      meal = await existingMeal.save();
    } else {
      // Create new meal
      meal = new Meal({
        memberId,
        date: startOfDay,
        breakfast: breakfast !== undefined ? breakfast : false,
        dinner: dinner !== undefined ? dinner : false,
      });
      meal = await meal.save();
    }
    
    // Populate member info
    await meal.populate("memberId", "name");

    res.status(201).json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


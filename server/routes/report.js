const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Meal = require("../models/Meal");
const Bazar = require("../models/Bazar");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");

// GET monthly report with calculations
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

    // Get all active members
    const members = await Member.find({ active: true });
    const totalMembers = members.length;

    if (totalMembers === 0) {
      return res.json({
        totalMealCount: 0,
        marketTotal: 0,
        mealRate: 0,
        billSum: 0,
        memberSummaries: [],
      });
    }

    // Get all meals for the month
    const meals = await Meal.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // Calculate total meals
    let totalMealCount = 0;
    const memberMealCounts = {};

    meals.forEach((meal) => {
      const memberId = meal.memberId.toString();
      if (!memberMealCounts[memberId]) {
        memberMealCounts[memberId] = 0;
      }
      const mealCount = (meal.breakfast ? 1 : 0) + (meal.dinner ? 1 : 0);
      memberMealCounts[memberId] += mealCount;
      totalMealCount += mealCount;
    });

    // Get total bazar (market total)
    const bazars = await Bazar.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const marketTotal = bazars.reduce((sum, bazar) => sum + (bazar.amount || 0), 0);

    // Calculate meal rate
    const mealRate = totalMealCount > 0 ? marketTotal / totalMealCount : 0;

    // Get bills
    const bill = await Bill.findOne({
      month: parseInt(month),
      year: parseInt(year),
    });

    const billSum = bill ? (bill.gas || 0) + (bill.current || 0) + (bill.wifi || 0) : 0;
    const billSharePerMember = billSum / totalMembers;

    // Get payments for the month
    const payments = await Payment.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const memberPayments = {};
    payments.forEach((payment) => {
      const memberId = payment.memberId.toString();
      if (!memberPayments[memberId]) {
        memberPayments[memberId] = 0;
      }
      memberPayments[memberId] += payment.amount || 0;
    });

    // Calculate member summaries
    const memberSummaries = members.map((member) => {
      const memberId = member._id.toString();
      const mealCount = memberMealCounts[memberId] || 0;
      const mealCost = mealCount * mealRate;
      const billShare = billSharePerMember;
      const khalakhaFee = member.khalakhaFee || 700;
      const payments = memberPayments[memberId] || 0;
      const totalDue = mealCost + billShare + khalakhaFee - payments;

      return {
        member: {
          _id: member._id,
          name: member.name,
          phone: member.phone,
        },
        mealCount,
        mealCost,
        billShare,
        khalakhaFee,
        payments,
        totalDue,
      };
    });

    res.json({
      success: true,
      data: {
        totalMealCount,
        marketTotal,
        mealRate,
        billSum,
        memberSummaries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// GET all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new member
router.post("/", async (req, res) => {
  try {
    const { name, phone, khalakhaFee, active } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const member = new Member({
      name,
      phone: phone || undefined,
      khalakhaFee: khalakhaFee || 700,
      active: active !== undefined ? active : true,
    });

    const savedMember = await member.save();
    res.status(201).json({ success: true, data: savedMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update member
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const member = await Member.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE member
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;


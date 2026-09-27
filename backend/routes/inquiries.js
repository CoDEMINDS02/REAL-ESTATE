const express = require("express");
const Inquiry = require("../models/Inquiry");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", protect, admin, async (req, res) => {
  const inquiries = await Inquiry.find().populate("property", "title").sort({ createdAt: -1 });
  res.json(inquiries);
});

router.put("/:id", protect, admin, async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(inquiry);
});

module.exports = router;

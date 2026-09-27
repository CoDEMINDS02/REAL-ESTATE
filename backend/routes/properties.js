const express = require("express");
const Property = require("../models/Property");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// GET /api/properties  (list + filters + search + pagination + sort)
router.get("/", async (req, res) => {
  try {
    const {
      city,
      type,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      search,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};
    if (city) query["location.city"] = new RegExp(`^${city}$`, "i");
    if (type) query.type = type;
    if (status) query.status = status;
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total] = await Promise.all([
      Property.find(query).sort(sortBy).skip(skip).limit(Number(limit)),
      Property.countDocuments(query),
    ]);

    res.json({ properties, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/properties/meta  (distinct cities + price bounds, for filter UI)
router.get("/meta", async (req, res) => {
  try {
    const [cities, priceStats] = await Promise.all([
      Property.distinct("location.city"),
      Property.aggregate([
        { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
      ]),
    ]);
    res.json({
      cities: cities.sort(),
      minPrice: priceStats[0]?.min || 0,
      maxPrice: priceStats[0]?.max || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/featured", async (req, res) => {
  const properties = await Property.find({ featured: true }).limit(6);
  res.json(properties);
});

router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("agent", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, admin, async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, agent: req.user._id });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

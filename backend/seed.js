// Run with: node seed.js
// Wipes existing properties and creates 1 admin user + 100 varied listings
// with real, high-quality photos across several Pakistani cities.
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Property = require("./models/Property");

dotenv.config();

// Curated real photos (exterior + interior), reused across listings the way
// most demo real-estate seeds do — swap these for real client photos later.
const IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200",
  "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200",
];

const CITY_AREAS = {
  Karachi: ["Clifton", "DHA Phase 8", "DHA Phase 6", "Bahria Town", "Gulshan-e-Iqbal", "PECHS"],
  Lahore: ["DHA Phase 5", "Gulberg", "Bahria Town", "Model Town", "Johar Town"],
  Islamabad: ["F-7", "F-8", "Bahria Enclave", "DHA Phase 2", "G-10"],
  Faisalabad: ["Susan Road", "Canal View", "Jinnah Colony"],
  Multan: ["Cantt", "Model Town", "Shah Rukn-e-Alam"],
};

const TYPES = ["house", "apartment", "villa", "plot", "commercial"];
const STATUSES = ["sale", "sale", "sale", "rent"]; // mostly sale, some rent
const ADJECTIVES = ["Sea-view", "Modern", "Sunlit", "Corner", "Contemporary", "Elegant", "Spacious", "Newly built", "Renovated", "Gated-community"];
const NOUNS = {
  house: "house",
  apartment: "apartment",
  villa: "villa",
  plot: "plot",
  commercial: "commercial plaza",
};

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const run = async () => {
  await connectDB();

  const adminEmail = "admin@meridian.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: "admin1234",
      role: "admin",
    });
    console.log("Created admin user -> email: admin@meridian.com | password: admin1234");
  }

  await Property.deleteMany({});
  console.log("Cleared existing properties");

  const cities = Object.keys(CITY_AREAS);
  const docs = [];

  for (let i = 0; i < 100; i++) {
    const city = rand(cities);
    const area = rand(CITY_AREAS[city]);
    const type = rand(TYPES);
    const status = rand(STATUSES);
    const isPlot = type === "plot";
    const isCommercial = type === "commercial";

    const bedrooms = isPlot || isCommercial ? 0 : randInt(2, 6);
    const bathrooms = isPlot ? 0 : randInt(1, bedrooms || 3) || 1;
    const areaSqft = isPlot ? randInt(1200, 6000) : randInt(900, 5500);

    const basePrice =
      status === "rent"
        ? randInt(60, 450) * 1000
        : randInt(1500, 18000) * 10000;

    const title = `${rand(ADJECTIVES)} ${bedrooms ? bedrooms + "-bed " : ""}${NOUNS[type]} in ${area}`;

    const imgSet = [rand(IMAGES), rand(IMAGES), rand(IMAGES)];

    docs.push({
      title,
      description: `A ${rand(ADJECTIVES).toLowerCase()} ${NOUNS[type]} located in ${area}, ${city}. ${
        isPlot
          ? "Ready for possession with all dues clear, on a wide road."
          : `Features ${bedrooms} bedroom${bedrooms !== 1 ? "s" : ""}, ${bathrooms} bathroom${bathrooms !== 1 ? "s" : ""}, and a well-planned layout with plenty of natural light.`
      } Verified and photographed by a Meridian agent.`,
      price: basePrice,
      type,
      status,
      location: { city, area },
      bedrooms,
      bathrooms,
      areaSqft,
      featured: i < 9, // first 9 show on homepage
      agent: admin._id,
      images: imgSet.map((url) => ({ url })),
      amenities: isPlot ? [] : rand([
        ["Parking", "Security", "Backup power"],
        ["Parking", "Gym", "Swimming pool"],
        ["Security", "Community park", "Backup power"],
        ["Parking", "Lift", "Backup power"],
      ]),
    });
  }

  await Property.insertMany(docs);
  console.log(`Inserted ${docs.length} properties across ${cities.length} cities`);

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

const mongoose = require("mongoose");
const Organizer = require("../models/Organizer");
require("dotenv").config(); // ✅ IMPORTANT

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected for Seeding");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
};

const organizers = [
  {
    name: "Elite Events Co.",
    location: "Delhi",
    description: "Premium corporate events",
    specialties: ["business"],
    rating: 4.8,
    reviews: 120,
    price: 5000,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Dream Weddings",
    location: "Mumbai",
    description: "Luxury wedding planners",
    specialties: ["wedding"],
    rating: 4.9,
    reviews: 200,
    price: 10000,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Food Fiesta",
    location: "Bangalore",
    description: "Food festivals",
    specialties: ["food"],
    rating: 4.6,
    reviews: 80,
    price: 3000,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Social Buzz",
    location: "Delhi",
    description: "Party organizers",
    specialties: ["social"],
    rating: 4.5,
    reviews: 60,
    price: 2500,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Corporate Hub",
    location: "Gurgaon",
    description: "Business meetups",
    specialties: ["business"],
    rating: 4.7,
    reviews: 90,
    price: 6000,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Event Masters",
    location: "Noida",
    description: "All events",
    specialties: ["other"],
    rating: 4.4,
    reviews: 50,
    price: 2000,
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const seedData = async () => {
  await connectDB(); // ✅ connect first

  try {
    await Organizer.deleteMany();
    await Organizer.insertMany(organizers);

    console.log("🔥 6 Organizers Inserted Successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

seedData();
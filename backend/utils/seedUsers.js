const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Organizer = require("../models/Organizer");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const seedUsers = async () => {
  await connectDB();

  try {
    const organizers = await Organizer.find();

    if (organizers.length === 0) {
      console.log("❌ No organizers found");
      process.exit();
    }

    await User.deleteMany({ role: "organizer" });

    const users = await Promise.all(
      organizers.map(async (org, index) => {
        const hashedPassword = await bcrypt.hash("123456", 10);

        return {
          name: org.name,
          email: `organizer${index + 1}@test.com`,
          password: hashedPassword,
          role: "organizer",
          organizerId: org._id,
        };
      })
    );

    await User.insertMany(users);

    console.log("🔥 Organizer Users Created");
    console.log("👉 Password for all: 123456");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
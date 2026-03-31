const mongoose = require("mongoose");
require("dotenv").config();

const Venue = require("../models/Venue");

// ✅ Connect DB
mongoose.connect(process.env.MONGO_URI);

const seedVenues = async () => {
  try {
    await Venue.deleteMany();

    const venues = [
      {
        name: "Grand Ballroom NYC",
        description: "Elegant ballroom perfect for weddings.",
        location: { city: "Mumbai", state: "Maharashtra", country: "India" },
        pricePerHour: 500,
        capacity: { min: 100, max: 800 },
        rating: 4.8,
        reviewsCount: 145,
        amenities: ["Stage", "Sound System", "Lighting", "Catering Kitchen"],
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
        category: "Ballroom",
      },

      {
        name: "Tech Hub Conference Center",
        description: "Modern venue for tech events.",
        location: { city: "Bangalore", state: "Karnataka", country: "India" },
        pricePerHour: 350,
        capacity: { min: 50, max: 500 },
        rating: 4.7,
        reviewsCount: 98,
        amenities: ["Projectors", "WiFi", "Screens"],
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        category: "Conference",
      },

      {
        name: "Sunset Beach Pavilion",
        description: "Beach venue for outdoor events.",
        location: { city: "Goa", state: "Goa", country: "India" },
        pricePerHour: 200,
        capacity: { min: 20, max: 200 },
        rating: 4.9,
        reviewsCount: 87,
        amenities: ["Ocean View", "Outdoor Space"],
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        category: "Beach",
      },

      {
        name: "Royal Palace Hall",
        description: "Luxury palace-style venue.",
        location: { city: "Jaipur", state: "Rajasthan", country: "India" },
        pricePerHour: 600,
        capacity: { min: 150, max: 1000 },
        rating: 4.6,
        reviewsCount: 120,
        amenities: ["Royal Decor", "Catering", "Lighting"],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        category: "Luxury",
      },

      {
        name: "Urban Rooftop Lounge",
        description: "Perfect rooftop for parties.",
        location: { city: "Delhi", state: "Delhi", country: "India" },
        pricePerHour: 250,
        capacity: { min: 30, max: 150 },
        rating: 4.5,
        reviewsCount: 60,
        amenities: ["City View", "DJ Setup"],
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        category: "Rooftop",
      },

      {
        name: "Green Garden Venue",
        description: "Open garden venue for weddings.",
        location: { city: "Pune", state: "Maharashtra", country: "India" },
        pricePerHour: 300,
        capacity: { min: 50, max: 400 },
        rating: 4.4,
        reviewsCount: 75,
        amenities: ["Garden", "Outdoor Seating"],
        image: "https://images.unsplash.com/photo-1505692794403-35c3e7e42b1b",
        category: "Garden",
      },

      {
        name: "Lakeview Resort Hall",
        description: "Scenic lake view venue.",
        location: { city: "Udaipur", state: "Rajasthan", country: "India" },
        pricePerHour: 450,
        capacity: { min: 80, max: 600 },
        rating: 4.7,
        reviewsCount: 90,
        amenities: ["Lake View", "Rooms"],
        image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210f8",
        category: "Resort",
      },

      {
        name: "Corporate Meeting Hub",
        description: "Professional meeting space.",
        location: { city: "Hyderabad", state: "Telangana", country: "India" },
        pricePerHour: 180,
        capacity: { min: 10, max: 100 },
        rating: 4.3,
        reviewsCount: 40,
        amenities: ["WiFi", "Projector"],
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
        category: "Corporate",
      },

      {
        name: "Mountain Retreat Center",
        description: "Peaceful mountain venue.",
        location: {
          city: "Manali",
          state: "Himachal Pradesh",
          country: "India",
        },
        pricePerHour: 220,
        capacity: { min: 20, max: 250 },
        rating: 4.8,
        reviewsCount: 110,
        amenities: ["Mountain View", "Bonfire"],
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        category: "Retreat",
      },
    ];

    await Venue.insertMany(venues);

    console.log("✅ Venues Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding venues:", error);
    process.exit(1);
  }
};

seedVenues();

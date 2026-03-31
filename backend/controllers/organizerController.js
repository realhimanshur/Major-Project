const Organizer = require("../models/Organizer");

// CREATE ORGANIZER
exports.createOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.create(req.body);
    res.status(201).json(organizer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ORGANIZERS
exports.getOrganizers = async (req, res) => {
  try {
    let organizers = await Organizer.find();

    // 🔥 AUTO INSERT IF EMPTY
    if (organizers.length === 0) {
      organizers = await Organizer.insertMany([
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
      ]);
    }

    res.json(organizers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ NEW: GET SINGLE ORGANIZER (DETAIL PAGE)
exports.getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id).populate("events");

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.json(organizer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// const Organizer = require("../models/Organizer");

// // CREATE ORGANIZER
// exports.createOrganizer = async (req, res) => {
//   try {
//     const organizer = await Organizer.create(req.body);
//     res.status(201).json(organizer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // GET ALL ORGANIZERS
// exports.getOrganizers = async (req, res) => {
//   try {
//     let organizers = await Organizer.find();

//     // 🔥 AUTO INSERT IF EMPTY
//     if (organizers.length === 0) {
//       organizers = await Organizer.insertMany([
//         {
//           name: "Elite Events Co.",
//           location: "Delhi",
//           description: "Premium corporate events",
//           specialties: ["business"],
//           rating: 4.8,
//           reviews: 120,
//           price: 5000,
//           image: "https://randomuser.me/api/portraits/men/1.jpg",
//         },
//         {
//           name: "Dream Weddings",
//           location: "Mumbai",
//           description: "Luxury wedding planners",
//           specialties: ["wedding"],
//           rating: 4.9,
//           reviews: 200,
//           price: 10000,
//           image: "https://randomuser.me/api/portraits/women/2.jpg",
//         },
//         {
//           name: "Food Fiesta",
//           location: "Bangalore",
//           description: "Food festivals",
//           specialties: ["food"],
//           rating: 4.6,
//           reviews: 80,
//           price: 3000,
//           image: "https://randomuser.me/api/portraits/men/3.jpg",
//         },
//         {
//           name: "Social Buzz",
//           location: "Delhi",
//           description: "Party organizers",
//           specialties: ["social"],
//           rating: 4.5,
//           reviews: 60,
//           price: 2500,
//           image: "https://randomuser.me/api/portraits/women/4.jpg",
//         },
//         {
//           name: "Corporate Hub",
//           location: "Gurgaon",
//           description: "Business meetups",
//           specialties: ["business"],
//           rating: 4.7,
//           reviews: 90,
//           price: 6000,
//           image: "https://randomuser.me/api/portraits/men/5.jpg",
//         },
//         {
//           name: "Event Masters",
//           location: "Noida",
//           description: "All events",
//           specialties: ["other"],
//           rating: 4.4,
//           reviews: 50,
//           price: 2000,
//           image: "https://randomuser.me/api/portraits/women/6.jpg",
//         },
//       ]);
//     }

//     res.json(organizers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
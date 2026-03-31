import axios from "axios";

const API_URL = "http://localhost:5000/api/organizers";

// ✅ GET ALL ORGANIZERS
export const getOrganizers = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching organizers:", error.message);
    return [];
  }
};

// ✅ GET SINGLE ORGANIZER (DETAIL PAGE)
export const getOrganizerById = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching organizer:", error.message);
    return null;
  }
};
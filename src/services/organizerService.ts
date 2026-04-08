import axios from "axios";

const API_URL = "http://localhost:5000/api/organizers";

interface OrganizerProfileData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  bio: string;
}

// ✅ GET ALL ORGANIZERS
export const getOrganizers = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching organizers:", error.message);
    }
    return [];
  }
};

// ✅ GET SINGLE ORGANIZER (DETAIL PAGE)
export const getOrganizerById = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching organizer:", error.message);
    }
    return null;
  }
};

// ✅ UPDATE ORGANIZER PROFILE
export const updateOrganizerProfile = async (
  data: OrganizerProfileData
) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${API_URL}/profile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating profile:", error.message);
    }
    throw error;
  }
};
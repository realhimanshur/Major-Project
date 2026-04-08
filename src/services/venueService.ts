export const getVenues = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/venues");
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
};

export const getVenueById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:5000/api/venues/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch venue");
    }

    const data = await res.json();

    return data.data; // ✅ MAIN FIX
  } catch (error) {
    console.error("Venue fetch error:", error);
    throw error;
  }
};
export const getVenues = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/venues");

    const data = await res.json();

    return data.data; // important (matches backend response)
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
};
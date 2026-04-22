import axios from "axios";

const API = "http://localhost:5000/api/bookings";

export const getSummary = (organizerId: string) =>
  axios.get(`${API}/summary?organizerId=${organizerId}`);

export const getRevenue = (organizerId: string) =>
  axios.get(`${API}/revenue?organizerId=${organizerId}`);

export const getDistribution = (organizerId: string) =>
  axios.get(`${API}/distribution?organizerId=${organizerId}`);

export const getInsights = (organizerId: string) =>
  axios.get(`${API}/insights?organizerId=${organizerId}`);
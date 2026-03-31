import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

// ✅ CREATE BOOKING
export const createBooking = async (bookingData: any) => {
  try {
    const res = await axios.post(API_URL, bookingData);
    return res.data;
  } catch (error: any) {
    console.error("Booking error:", error.response?.data || error.message);
    throw error;
  }
};
export const createPaymentOrder = async (amount: number) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/bookings/create-order",
      { amount }
    );
    return res.data;
  } catch (error: any) {
    console.error("Order creation error:", error.message);
    throw error;
  }
};
import axios, { AxiosError } from "axios";

// ✅ BASE URLs
const API_URL = "http://localhost:5000/api/bookings";
const FAV_API_URL = "http://localhost:5000/api/favorites";

// ✅ TYPES
interface BookingResponse {
  message: string;
  booking: unknown;
}

interface OrderResponse {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayKeyResponse {
  key: string;
}

// ✅ EVENT TYPE (for favorites)
export interface EventType {
  _id: string;
  title: string;
  location: string;
  price?: number;
  image?: string;
  date?: string;
}

// =======================
// ✅ BOOKING APIs
// =======================

// CREATE BOOKING
export const createBooking = async (
  bookingData: Record<string, unknown>
): Promise<BookingResponse> => {
  try {
    const res = await axios.post<BookingResponse>(API_URL, bookingData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    console.error(
      "Booking error:",
      err.response?.data?.message || err.message
    );
    throw err;
  }
};

// CREATE PAYMENT ORDER
export const createPaymentOrder = async (
  amount: number
): Promise<OrderResponse> => {
  try {
    const res = await axios.post<OrderResponse>(
      `${API_URL}/create-order`,
      { amount }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    console.error(
      "Order creation error:",
      err.response?.data?.message || err.message
    );
    throw err;
  }
};

// GET RAZORPAY KEY
export const getRazorpayKey = async (): Promise<string> => {
  try {
    const res = await fetch(`${API_URL}/razorpay-key`);

    if (!res.ok) {
      throw new Error("Failed to fetch Razorpay key");
    }

    const data: RazorpayKeyResponse = await res.json();
    return data.key;
  } catch (error) {
    console.error("Razorpay key error:", error);
    throw error;
  }
};

// =======================
// ❤️ FAVORITE APIs
// =======================

// GET USER FAVORITES
export const getFavorites = async (): Promise<EventType[]> => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get<EventType[]>(FAV_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    console.error(
      "Get favorites error:",
      err.response?.data?.message || err.message
    );
    throw err;
  }
};

// TOGGLE FAVORITE (ADD / REMOVE)
export const toggleFavorite = async (
  eventId: string
): Promise<string[]> => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post<{ favorites: string[] }>(
      `${FAV_API_URL}/${eventId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.favorites;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    console.error(
      "Toggle favorite error:",
      err.response?.data?.message || err.message
    );
    throw err;
  }
};
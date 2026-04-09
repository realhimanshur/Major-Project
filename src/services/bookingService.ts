import axios, { AxiosError } from "axios";

// ✅ BASE URLs
const API_URL = "http://localhost:5000/api/bookings";
const FAV_API_URL = "http://localhost:5000/api/favorites";

// =======================
// ✅ TYPES
// =======================

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

// ✅ COMMON FAVORITE TYPE (EVENT + VENUE)
export type FavoriteType = "event" | "venue";

export interface FavoriteItem {
  _id: string;
  title?: string;        // event
  name?: string;         // venue
  location?: string;
  price?: number;
  image?: string;
  images?: string[];
  type: FavoriteType;
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

// ✅ GET FAVORITES (EVENT + VENUE)
export const getFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get<FavoriteItem[]>(FAV_API_URL, {
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

// ✅ TOGGLE FAVORITE (EVENT + VENUE)
export const toggleFavorite = async (
  id: string,
  type: FavoriteType
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `${FAV_API_URL}/${type}/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    console.error(
      "Toggle favorite error:",
      err.response?.data?.message || err.message
    );
    throw err;
  }
};
import type { Event } from "@/types";

const API_URL = "http://localhost:5000/api/events";

const getToken = (): string | null => localStorage.getItem("token");

// 🔥 CREATE EVENT
export const createEvent = async (event: Event): Promise<Event> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    throw new Error("Failed to create event");
  }

  return res.json();
};

// 🔥 GET ALL EVENTS
export const getEvents = async (): Promise<Event[]> => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
};

// 🔥 GET EVENT BY ID
export const getEventById = async (id: string): Promise<Event> => {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }

  return res.json();
};

// 🔥 UPDATE EVENT (IMPORTANT FIX)
export const updateEvent = async (
  id: string,
  event: Event
): Promise<Event> => {
  const payload = {
    ...event,
    price: Number(event.price),
    capacity: Number(event.capacity),
  };

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Update failed");
  }

  return res.json();
};

// 🔥 DELETE EVENT
export const deleteEvent = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return res.json();
};

// 🔥 GET MY EVENTS (Organizer)
export const getMyEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${API_URL}/my-events`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch organizer events");
  }

  return res.json();
};
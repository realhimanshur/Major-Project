const API_URL = "http://localhost:5000/api/events";

const getToken = () => localStorage.getItem("token");

// 🔥 CREATE EVENT
export const createEvent = async (event: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(event),
  });

  return res.json();
};

// 🔥 GET ALL EVENTS
export const getEvents = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

// 🔥 GET EVENT BY ID
export const getEventById = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

// 🔥 UPDATE EVENT
export const updateEvent = async (id: string, event: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(event),
  });

  return res.json();
};

// 🔥 DELETE EVENT
export const deleteEvent = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
};
// 🔥 GET MY EVENTS (Organizer)
export const getMyEvents = async () => {
  const res = await fetch("http://localhost:5000/api/events/my-events", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.json();
};
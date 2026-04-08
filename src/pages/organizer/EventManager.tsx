import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "@/services/eventService";
import type { Event } from "@/types";

// ✅ Strong type for attendees (adjust later if backend differs)
interface Attendee {
  _id: string;
  name: string;
  email: string;
}

const EventManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const fetchEvent = async (): Promise<void> => {
      try {
        if (!id) return;

        const data = await getEventById(id);

        setEvent(data);

        // ✅ Safe attendee extraction
        if (data && typeof data === "object" && "attendees" in data) {
          const possibleAttendees = (data as { attendees?: unknown }).attendees;

          if (Array.isArray(possibleAttendees)) {
            const formatted: Attendee[] = possibleAttendees.map((a) => ({
              _id: (a as Attendee)._id || crypto.randomUUID(),
              name: (a as Attendee).name || "Unknown",
              email: (a as Attendee).email || "No email",
            }));

            setAttendees(formatted);
          }
        }
      } catch (error: unknown) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Event not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-white">

        {/* EVENT INFO */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{event.title}</h1>

          <p className="text-white/70 mb-2">
            📍 {event.location}
          </p>

          <p className="text-white/70 mb-2">
            📅{" "}
            {event.startDate
              ? new Date(event.startDate).toLocaleString()
              : "Date not available"}
          </p>

          <p className="text-white/80 mt-4">
            {event.description || "No description"}
          </p>
        </div>

        {/* ATTENDEES */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            Attendees ({attendees.length})
          </h2>

          {attendees.length === 0 ? (
            <p className="text-white/50">No attendees yet</p>
          ) : (
            <div className="space-y-2">
              {attendees.map((attendee) => (
                <div
                  key={attendee._id}
                  className="p-3 bg-white/5 rounded-lg flex justify-between"
                >
                  <span>{attendee.name}</span>
                  <span className="text-white/50">{attendee.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EventManager;
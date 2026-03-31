import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";

import { getEventById } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH EVENT
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const data = await getEventById(id);

        setEvent(
          data?.event || // if wrapped
            data?.data || // alternative
            data, // direct object
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // LOADING
  if (loading) {
    return <div className="text-white text-center mt-40">Loading...</div>;
  }

  // NOT FOUND
  if (!event) {
    return <div className="text-white text-center mt-40">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#161616] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="text-white mb-4 flex items-center gap-2"
        >
          <ArrowLeft /> Back
        </button>

        {/* IMAGE */}
        <img
          src={
            event?.image ||
            event?.images?.[0] ||
            "https://via.placeholder.com/800x400"
          }
          alt={event?.title || "Event"}
          className="w-full h-[350px] object-cover"
        />

        {/* DETAILS */}
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

          {/* LOCATION */}
          <p className="flex items-center gap-2 text-white/60 mb-2">
            <MapPin className="w-4 h-4" />
            {event.location}
          </p>

          {/* DATE */}
          <p className="flex items-center gap-2 text-white/60 mb-4">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString()}
          </p>

          {/* PRICE */}
          <h2 className="text-2xl font-semibold mb-4">
            {event.type === "free" ? "Free" : `₹${event.price}`}
          </h2>

          {/* CATEGORY */}
          <div className="mb-4">
            <Badge className="bg-white/10 text-white border-0">
              {event.category}
            </Badge>
          </div>

          {/* DESCRIPTION */}
          <p className="text-white/70 mb-6">{event.description}</p>

          {/* BUTTON */}
          <Button className="bg-[#633dc0] hover:bg-[#4f2fa8]">
            Book Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

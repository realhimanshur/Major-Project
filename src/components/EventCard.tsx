import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import type { Event } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
  variant?: "default" | "compact" | "featured";
}

// ✅ SAFE EXTENDED TYPE (NO any)
interface AdaptedEvent extends Event {
  id: string;
  date?: string;
  price: number;
  location: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = "default",
}) => {
  const navigate = useNavigate();

  // ✅ CLEAN SAFE ADAPTATION
  const adaptedEvent: AdaptedEvent = {
    ...event,
    id: event._id || event.id || "",
    price: event.price ?? 0,
    date: event.date || event.startDate,
    location: event.location || "Unknown Location",
  };

  // ✅ CLEAN ORGANIZER LOGIC (NO any)
  const organizer =
    typeof event.organizer === "object"
      ? event.organizer?.name || "Organizer"
      : typeof event.organizerId === "object"
      ? event.organizerId?.name || "Organizer"
      : event.organizerName || "Organizer";

  const formatDate = (date?: string): string => {
    if (!date) return "Invalid Date";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category?: string): string => {
    const colors: Record<string, string> = {
      music: "bg-[#ff2d53]/20 text-[#ff2d53]",
      business: "bg-[#1da1f2]/20 text-[#1da1f2]",
      wellness: "bg-[#00c853]/20 text-[#00c853]",
      food: "bg-[#ff6f00]/20 text-[#ff6f00]",
      arts: "bg-[#c385ff]/20 text-[#c385ff]",
      sports: "bg-[#ffea00]/20 text-[#ffea00]",
      education: "bg-[#633dc0]/20 text-[#633dc0]",
      social: "bg-[#ff6f00]/20 text-[#ff6f00]",
      other: "bg-white/10 text-white/60",
    };

    return colors[category || "other"] || colors.other;
  };

  const image =
    event.image && event.image.trim() !== ""
      ? event.image
      : "https://images.unsplash.com/photo-1511795409834-ef04bbd61622";

  /* ---------------- COMPACT ---------------- */
  if (variant === "compact") {
    return (
      <div
        onClick={() => navigate(`/events/${adaptedEvent.id}`)}
        className="glass-card rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.03]"
      >
        <div className="relative h-40 overflow-hidden">
          <img src={image} alt={event.title} className="w-full h-full object-cover" />

          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryColor(event.category)} border-0`}>
              {event.category}
            </Badge>
          </div>

          <div className="absolute top-3 right-3">
            <Badge className="bg-[#633dc0]/90 text-white border-0">
              {event.type === "free" ? "Free" : `₹${adaptedEvent.price}`}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold mb-2">{event.title}</h3>

          <div className="flex gap-4 text-white/60 text-sm">
            <span className="flex gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(adaptedEvent.date)}
            </span>

            <span className="flex gap-1">
              <MapPin className="w-4 h-4" />
              {adaptedEvent.location.split(",")[0]}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- FEATURED ---------------- */
  if (variant === "featured") {
    return (
      <div
        onClick={() => navigate(`/events/${adaptedEvent.id}`)}
        className="glass-card rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="relative h-64 overflow-hidden">
          <img src={image} alt={event.title} className="w-full h-full object-cover" />

          <div className="absolute top-4 right-4">
            <Badge className="bg-[#633dc0] text-white border-0">
              {event.type === "free" ? "Free" : `₹${adaptedEvent.price}`}
            </Badge>
          </div>

          <div className="absolute bottom-0 p-6">
            <h3 className="text-white text-xl">{event.title}</h3>

            <div className="flex gap-4 text-white/60 text-sm">
              <span>{formatDate(adaptedEvent.date)}</span>
              <span>{adaptedEvent.location}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- DEFAULT ---------------- */
  return (
    <div
      onClick={() => navigate(`/events/${adaptedEvent.id}`)}
      className="glass-card rounded-xl overflow-hidden cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={event.title} className="w-full h-full object-cover" />

        <div className="absolute top-3 right-3">
          <Badge className="bg-[#633dc0]/90 text-white border-0">
            {event.type === "free" ? "Free" : `₹${adaptedEvent.price}`}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-white text-lg mb-2">{event.title}</h3>

        <div className="flex justify-between text-white/60 text-sm">
          <span>{formatDate(adaptedEvent.date)}</span>
          <span>{adaptedEvent.location}</span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-white/60 text-sm">{organizer}</span>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${adaptedEvent.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
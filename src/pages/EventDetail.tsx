// ONLY CHANGE: added DB-based favorites + share

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, ArrowLeft, Heart, Share2 } from "lucide-react";

import { getEventById } from "@/services/eventService";
import {
  createPaymentOrder,
  getRazorpayKey,
  toggleFavorite,
  getFavorites,
} from "@/services/bookingService";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
  }) => void;
}

interface EventType {
  _id?: string;
  title: string;
  location: string;
  date?: string;
  startDate?: string;
  price?: number;
  type?: string;
  category?: string;
  description?: string;
  image?: string;
  images?: string[];
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  // ❤️ DB favorite state
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (!id) return;

        const data = await getEventById(id);
        setEvent(data);

        // ✅ LOAD FAVORITES FROM DB
        if (user) {
          const favs = await getFavorites();
          setIsFav(favs.some((f) => f._id === id));
        }
      } catch (error: unknown) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const displayDate = event?.startDate || event?.date;

  const formatDate = (date?: string): string => {
    if (!date) return "Date not available";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ❤️ TOGGLE FAVORITE (DB)
  const handleFavorite = async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      if (!id) return;

      await toggleFavorite(id);

      setIsFav((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("Failed to update favorite");
    }
  };

  // 🔗 SHARE
  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied 🔗");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🎯 BOOKING
  const handleBooking = async (): Promise<void> => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "attendee") {
      alert("Only attendees can book events ❌");
      return;
    }

    try {
      if (!event?.price && event?.type !== "free") {
        alert("Invalid event price");
        return;
      }

      const key = await getRazorpayKey();

      const data = await createPaymentOrder(
        event.type === "free" ? 0 : Number(event.price),
      );

      const options: RazorpayOptions = {
        key,
        amount: data.amount,
        currency: "INR",
        name: "Event Horizon",
        description: event.title,
        order_id: data.id,
        handler: function () {
          alert("Payment Successful ✅");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: unknown) {
      console.error("Booking error:", error);
      alert("Payment Failed ❌");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-40">Loading...</div>;
  }

  if (!event) {
    return <div className="text-white text-center mt-40">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#161616] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">

        <button
          onClick={() => navigate(-1)}
          className="text-white mb-4 flex items-center gap-2"
        >
          <ArrowLeft /> Back
        </button>

        <img
          src={
            event.image ||
            event.images?.[0] ||
            "https://via.placeholder.com/800x400"
          }
          alt={event.title}
          className="w-full h-[350px] object-cover"
        />

        {/* ❤️ + 🔗 */}
        <div className="flex gap-4 mt-4 mb-6">
          <Button variant="outline" onClick={handleFavorite}>
            <Heart
              className={`w-4 h-4 mr-2 ${
                isFav ? "fill-red-500 text-red-500" : ""
              }`}
            />
            {isFav ? "Saved" : "Save"}
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

          <p className="flex items-center gap-2 text-white/60 mb-2">
            <MapPin className="w-4 h-4" />
            {event.location}
          </p>

          <p className="flex items-center gap-2 text-white/60 mb-4">
            <Calendar className="w-4 h-4" />
            {formatDate(displayDate)}
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            {event.type === "free" ? "Free" : `₹${event.price}`}
          </h2>

          <div className="mb-4">
            <Badge className="bg-white/10 text-white border-0">
              {event.category}
            </Badge>
          </div>

          <p className="text-white/70 mb-6">{event.description}</p>

          <Button
            onClick={handleBooking}
            className="bg-[#633dc0] hover:bg-[#4f2fa8]"
          >
            Book Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
// ✅ FIXED VERSION (NO TS ERROR)

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, Heart, Share2, Users } from "lucide-react";

import { getVenueById } from "@/services/venueService";
import {
  createPaymentOrder,
  getRazorpayKey,
  toggleFavorite,
  getFavorites,
} from "@/services/bookingService";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import MapView from "@/components/ui/MapView";
import type { Venue } from "@/types";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: () => void;
}

interface Slot {
  start: string;
  end: string;
  available: boolean;
}

// ✅ EXTENDED TYPE (NO ANY USED)
type ExtendedVenue = Venue & {
  _id?: string;
  price?: number;
  organizer?: {
    _id?: string;
  };
};

const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [venue, setVenue] = useState<ExtendedVenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (!id) return;

        const data = await getVenueById(id);
        setVenue(data as ExtendedVenue);

        if (user) {
          const favs = await getFavorites();
          setIsFav(favs.some((f: { _id: string }) => f._id === id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // SLOT FETCH
  useEffect(() => {
    const fetchSlots = async (): Promise<void> => {
      if (!selectedDate || !id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/slots?venueId=${id}&date=${selectedDate}`,
        );
        const data: Slot[] = await res.json();
        setSlots(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSlots();
  }, [selectedDate, id]);

  const toggleFavoriteHandler = async (): Promise<void> => {
    if (!user) return navigate("/login");
    if (!id) return;

    await toggleFavorite(id, "venue");
    setIsFav((prev) => !prev);
  };

  const handleShare = async (): Promise<void> => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: venue?.name,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied 🔗");
      }
    } catch {
      alert("Share failed");
    }
  };

  // ✅ BOOKING FLOW FIXED
  const handleBooking = async (): Promise<void> => {
    if (!user) return navigate("/login");

    if (!selectedDate || !selectedSlot || !venue) {
      alert("Please select date & slot ❌");
      return;
    }

    try {
      const key = await getRazorpayKey();
      const order = await createPaymentOrder(venue.price || 100);

      const options: RazorpayOptions = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Event Horizon",
        description: venue.name,
        order_id: order.id,

        handler: async () => {
          try {
            await fetch("http://localhost:5000/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                organizerId: venue.organizer?._id || "", // ✅ SAFE
                venueId: venue._id,
                name: user.name,
                email: user.email,
                phone: user.phone || "9999999999",
                eventType: "venue-booking",
                eventDate: selectedDate,
                location: venue.location,
                budget: venue.price,
                startTime: selectedSlot.start,
                endTime: selectedSlot.end,
              }),
            });

            alert("Booking Successful 🎉");
          } catch (err) {
            console.error(err);
            alert("Booking save failed ❌");
          }
        },
      };

      new (
        window as unknown as {
          Razorpay: new (o: RazorpayOptions) => { open: () => void };
        }
      ).Razorpay(options).open();
    } catch {
      alert("Payment Failed ❌");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-40">Loading...</div>;
  }

  if (!venue) {
    return <div className="text-white text-center mt-40">Venue not found</div>;
  }

  const locationStr = typeof venue.location === "string" ? venue.location : "";

  const locationValue =
    locationStr.trim() !== "" ? locationStr : "Location not available";

  const capacityValue =
    typeof venue.capacity === "number" ? venue.capacity : "N/A";

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
          src={venue.images?.[0] || "https://via.placeholder.com/800x400"}
          alt={venue.name}
          className="w-full h-[350px] object-cover"
        />

        <div className="flex gap-4 mt-4 mb-6">
          <Button variant="outline" onClick={toggleFavoriteHandler}>
            <Heart
              className={`w-4 h-4 mr-2 ${isFav ? "fill-red-500 text-red-500" : ""}`}
            />
            {isFav ? "Saved" : "Save"}
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>

          <p className="flex items-center gap-2 text-white/60 mb-4">
            <MapPin className="w-4 h-4" />
            {locationValue}
          </p>

          <div className="mb-6">
            <MapView location={venue.location} />
          </div>

          <p className="flex items-center gap-2 text-white/60 mb-2">
            <Users className="w-4 h-4" />
            Capacity: {capacityValue}
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            ₹{venue.price ?? "N/A"}
          </h2>

          {/* SLOT UI */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Select Date</h3>
            <input
              type="date"
              className="bg-white/10 p-2 rounded"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            {slots.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-4 mb-2">Select Slot</h3>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.start}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2 rounded ${
                        slot.available
                          ? selectedSlot?.start === slot.start
                            ? "bg-purple-600"
                            : "bg-white/10"
                          : "bg-red-500/50 cursor-not-allowed"
                      }`}
                    >
                      {slot.start} - {slot.end}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Button
            onClick={handleBooking}
            className="bg-[#633dc0] hover:bg-[#4f2fa8] mt-6"
          >
            Book Venue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;

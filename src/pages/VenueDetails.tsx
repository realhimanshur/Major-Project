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
import { Badge } from "@/components/ui/badge";
import MapView from "@/components/ui/MapView"; // ✅ ADDED
import type { Venue } from "@/types";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: unknown) => void;
}

const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const data = await getVenueById(id);
        setVenue(data);

        if (user) {
          const favs = await getFavorites();
          setIsFav(favs.some((f) => f._id === id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const toggleFavoriteHandler = async () => {
    if (!user) return navigate("/login");
    if (!id) return;

    await toggleFavorite(id, "venue");
    setIsFav((prev) => !prev);
  };

  const handleShare = async () => {
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

  const handleBooking = async () => {
    if (!user) return navigate("/login");

    if (user.role !== "organizer") {
      alert("Only organizers can book venues ❌");
      return;
    }

    try {
      const key = await getRazorpayKey();
      const data = await createPaymentOrder(venue?.pricePerHour || 100);

      const options: RazorpayOptions = {
        key,
        amount: data.amount,
        currency: "INR",
        name: "Event Horizon",
        description: venue?.name || "Venue Booking",
        order_id: data.id,
        handler: () => alert("Payment Successful ✅"),
      };

      new window.Razorpay(options).open();
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

  const locationValue =
    venue.location?.city || venue.location?.state
      ? `${venue.location?.city || ""}, ${venue.location?.state || ""}`
      : "Location not available";

  const capacityValue =
    typeof venue.capacity?.max === "number"
      ? venue.capacity.max
      : "N/A";

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
          src={venue.images?.[0] || "https://via.placeholder.com/800x400"}
          alt={venue.name}
          className="w-full h-[350px] object-cover"
        />

        {/* ACTIONS */}
        <div className="flex gap-4 mt-4 mb-6">
          <Button variant="outline" onClick={toggleFavoriteHandler}>
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

        {/* DETAILS */}
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>

          <p className="flex items-center gap-2 text-white/60 mb-4">
            <MapPin className="w-4 h-4" />
            {locationValue}
          </p>

          {/* ✅ MAP ADDED HERE */}
          {venue.location && (
            <div className="mb-6">
              <MapView location={venue.location} />
            </div>
          )}

          <p className="flex items-center gap-2 text-white/60 mb-2">
            <Users className="w-4 h-4" />
            Capacity: {capacityValue}
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            ₹{venue.pricePerHour || "N/A"}
          </h2>

          <div className="mb-4">
            <Badge className="bg-white/10 text-white border-0">
              {venue.category}
            </Badge>
          </div>

          <p className="text-white/70 mb-6">{venue.description}</p>

          <Button
            onClick={handleBooking}
            className="bg-[#633dc0] hover:bg-[#4f2fa8]"
          >
            Book Venue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
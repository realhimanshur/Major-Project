// ✅ VenueDetail.tsx (FINAL FIXED — ORGANIZER ONLY BOOK + DATA FIX)

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, Heart, Share2 } from "lucide-react";

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

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: unknown) => void;
}

// ✅ FIXED TYPE FOR VENUE
interface VenueType {
  _id?: string;
  name?: string;
  title?: string;
  location?: string;
  price?: number;
  pricePerHour?: number;
  category?: string;
  description?: string;
  image?: string;
  images?: string[];
}

const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [venue, setVenue] = useState<VenueType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const data = await getVenueById(id);

        const normalizedVenue = {
          _id: data._id,

          title: data.name,

          // ✅ LOCATION FIX (handles object)
          location:
            typeof data.location === "object"
              ? `${data.location?.city || ""}, ${data.location?.state || ""}`
              : data.location || "Location not available",

          // ✅ PRICE FIX (handles both)
          price:
            data.price !== undefined
              ? data.price
              : data.pricePerHour !== undefined
                ? data.pricePerHour
                : 0,

          category: data.category || "Venue",

          description: data.description || "No description available",

          // ✅ IMAGE FIX (handles both)
          image: data.image || data.images?.[0] || "",

          images: data.images || (data.image ? [data.image] : []),
        };

        setVenue(normalizedVenue);

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

  // ❤️ FAVORITE
  const toggleFavoriteHandler = async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      if (!id) return;

      await toggleFavorite(id,"venue");
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
          title: venue?.title || venue?.name,
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

  // 🎯 BOOKING (🔥 FIXED ROLE)
  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // ✅ FIX: ONLY ORGANIZER
    if (user.role !== "organizer") {
      alert("Only organizers can book venues ❌");
      return;
    }

    try {
      const price =
        typeof venue?.price === "number" && venue.price > 0 ? venue.price : 100;

      if (!price) {
        alert("Invalid venue price");
        return;
      }

      const key = await getRazorpayKey();

      const data = await createPaymentOrder(Number(price));

      const options: RazorpayOptions = {
        key,
        amount: data.amount,
        currency: "INR",
        name: "Event Horizon",
        description: venue?.title || venue?.name || "Venue Booking",
        order_id: data.id,
        handler: function () {
          alert("Payment Successful ✅");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment Failed ❌");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-40">Loading...</div>;
  }

  if (!venue) {
    return <div className="text-white text-center mt-40">Venue not found</div>;
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
            venue.image ||
            venue.images?.[0] ||
            "https://via.placeholder.com/800x400"
          }
          alt={venue.title || venue.name}
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
          <h1 className="text-3xl font-bold mb-2">
            {venue.title || venue.name}
          </h1>

          <p className="flex items-center gap-2 text-white/60 mb-2">
            <MapPin className="w-4 h-4" />
            {venue.location || "Location not available"}
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            ₹{venue.price || venue.pricePerHour || "N/A"}
          </h2>

          <div className="mb-4">
            <Badge className="bg-white/10 text-white border-0">
              {venue.category || "Venue"}
            </Badge>
          </div>

          <p className="text-white/70 mb-6">
            {venue.description || "No description available"}
          </p>

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

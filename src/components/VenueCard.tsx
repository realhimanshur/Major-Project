import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Star, Phone } from "lucide-react";
import type { Venue } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VenueCardProps {
  venue: Venue;
  variant?: "default" | "compact";
}

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  variant = "default",
}) => {
  const navigate = useNavigate();

  const locationValue =
    venue.location?.city || venue.location?.state
      ? `${venue.location?.city || ""}, ${venue.location?.state || ""}`
      : "Location not available";

  const capacityValue =
    typeof venue.capacity?.max === "number"
      ? venue.capacity.max
      : "--";

  const priceValue =
    typeof venue.pricePerHour === "number"
      ? venue.pricePerHour
      : 0;

  const adaptedVenue = {
    ...venue,
    id: venue._id || venue.id,
    images: venue.images?.length ? venue.images : [""],
  };

  // 🔹 COMPACT
  if (variant === "compact") {
    return (
      <div
        onClick={() => navigate(`/venues/${adaptedVenue.id}`)}
        className="glass-card rounded-xl overflow-hidden cursor-pointer card-hover group"
      >
        <div className="relative h-40 overflow-hidden">
          <img
            src={adaptedVenue.images[0]}
            alt={adaptedVenue.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 right-3">
            <Badge className="bg-[#633dc0]/80 text-white border-0">
              ₹{priceValue}/hr
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold mb-1">
            {adaptedVenue.name}
          </h3>

          <div className="flex items-center gap-1 text-white/50 text-sm mb-2">
            <MapPin className="w-3 h-3" />
            {locationValue}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">
                {adaptedVenue.rating}
              </span>
            </div>

            <span className="text-white/50 text-sm flex items-center gap-1">
              <Users className="w-3 h-3" />
              {capacityValue}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 DEFAULT
  return (
    <div
      onClick={() => navigate(`/venues/${adaptedVenue.id}`)}
      className="glass-card rounded-xl overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={adaptedVenue.images[0]}
          alt={adaptedVenue.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3 left-3">
          <Badge className="bg-white/10 text-white border-0">
            {adaptedVenue.category}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge className="bg-purple-600 text-white border-0">
            ₹{priceValue}/hr
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2">
          {adaptedVenue.name}
        </h3>

        <p className="text-white/60 text-sm mb-4">
          {adaptedVenue.description}
        </p>

        <div className="flex items-center gap-4 text-sm mb-4">
          <span className="text-white/60 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {locationValue}
          </span>

          <span className="text-white/60 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {capacityValue}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/venues/${adaptedVenue.id}`);
            }}
          >
            View Details
          </Button>

          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (adaptedVenue.contactInfo?.phone) {
                window.location.href = `tel:${adaptedVenue.contactInfo.phone}`;
              }
            }}
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
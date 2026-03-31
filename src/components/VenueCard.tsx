import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Star, Check, Phone } from 'lucide-react';
import type { Venue } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VenueCardProps {
  venue: Venue;
  variant?: 'default' | 'compact';
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, variant = 'default' }) => {
  const navigate = useNavigate();

  // ✅ SAFE ADAPT (added, not replacing)
  const adaptedVenue = {
    ...venue,
    id: (venue as any)._id || venue.id,
    images: venue.images || [(venue as any).image],
    location:
      typeof venue.location === "string"
        ? venue.location
        : `${(venue as any).location?.city || ""}, ${(venue as any).location?.state || ""}`,
    reviewCount: (venue as any).reviewCount || (venue as any).reviewsCount || 0,
    contactInfo: (venue as any).contactInfo || { phone: "" },
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={() => navigate(`/venues/${adaptedVenue.id}`)}
        className="glass-card rounded-xl overflow-hidden cursor-pointer card-hover group"
      >
        <div className="relative h-40 overflow-hidden">
          <img
            src={adaptedVenue.images[0]}
            alt={adaptedVenue.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#633dc0]/80 text-white border-0">
              ₹{adaptedVenue.pricePerHour}/hr
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold mb-1 group-hover:text-[#c385ff] transition-colors line-clamp-1">
            {adaptedVenue.name}
          </h3>
          <div className="flex items-center gap-1 text-white/50 text-sm mb-2">
            <MapPin className="w-3 h-3" />
            {adaptedVenue.location}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#ffea00] fill-current" />
              <span className="text-white text-sm">{adaptedVenue.rating}</span>
            </div>
            <span className="text-white/50 text-sm flex items-center gap-1">
              <Users className="w-3 h-3" />
              {adaptedVenue.capacity?.max}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/venues/${adaptedVenue.id}`)}
      className="glass-card rounded-xl overflow-hidden cursor-pointer card-hover group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={adaptedVenue.images[0]}
          alt={adaptedVenue.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/80 to-transparent" />

        <div className="absolute top-3 left-3">
          <Badge className="bg-white/10 text-white border-0">
            {adaptedVenue.category}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge className="bg-[#633dc0] text-white border-0">
            ₹{adaptedVenue.pricePerHour}/hr
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <Star className="w-4 h-4 text-[#ffea00] fill-current" />
          <span className="text-white font-medium">{adaptedVenue.rating}</span>
          <span className="text-white/60 text-sm">
            ({adaptedVenue.reviewCount})
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#c385ff] transition-colors">
          {adaptedVenue.name}
        </h3>

        <p className="text-white/60 text-sm mb-4 line-clamp-2">
          {adaptedVenue.description}
        </p>

        <div className="flex items-center gap-4 text-sm mb-4">
          <span className="text-white/60 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {adaptedVenue.location}
          </span>
          <span className="text-white/60 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {adaptedVenue.capacity?.min}-{adaptedVenue.capacity?.max}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {adaptedVenue.amenities?.slice(0, 4).map((amenity: string) => (
            <span
              key={amenity}
              className="text-xs text-white/50 flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-[#00c853]" />
              {amenity}
            </span>
          ))}
          {adaptedVenue.amenities?.length > 4 && (
            <span className="text-xs text-white/40">
              +{adaptedVenue.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/venues/${adaptedVenue.id}`);
            }}
          >
            View Details
          </Button>

          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
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
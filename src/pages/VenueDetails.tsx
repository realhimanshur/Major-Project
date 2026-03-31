import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Users, Star, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

const VenueDetails: React.FC = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH SINGLE VENUE
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/venues/${id}`);
        const data = await res.json();
        setVenue(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVenue();
  }, [id]);

  if (loading) {
    return <p className="text-white p-10">Loading...</p>;
  }

  if (!venue) {
    return <p className="text-white p-10">Venue not found</p>;
  }

  // ✅ ADAPT DATA (same logic as card)
  const location =
    typeof venue.location === "string"
      ? venue.location
      : `${venue.location?.city || ""}, ${venue.location?.state || ""}`;

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* IMAGE */}
        <div className="rounded-xl overflow-hidden mb-6">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>

        {/* META */}
        <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {venue.capacity?.min}-{venue.capacity?.max} guests
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            {venue.rating} ({venue.reviewsCount})
          </span>
        </div>

        {/* PRICE */}
        <p className="text-xl font-semibold mb-6">
          ₹{venue.pricePerHour} / hour
        </p>

        {/* DESCRIPTION */}
        <p className="text-white/70 mb-6">{venue.description}</p>

        {/* AMENITIES */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {venue.amenities?.map((a: string) => (
              <span
                key={a}
                className="bg-white/10 px-3 py-1 rounded text-sm"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <Button className="btn-primary">Book Now</Button>
          <Button
            variant="outline"
            onClick={() => {
              if (venue.contactInfo?.phone) {
                window.location.href = `tel:${venue.contactInfo.phone}`;
              }
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
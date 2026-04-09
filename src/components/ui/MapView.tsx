import React, { useEffect, useState } from "react";

interface MapViewProps {
  location: {
    city: string;
    state: string;
  };
}

const MapView: React.FC<MapViewProps> = ({ location }) => {
  const [coords, setCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const query = `${location.city} ${location.state}`.trim();

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        if (!query) return;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        );

        const data = await res.json();

        if (data && data.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          });
        }
      } catch (err) {
        console.error("Map error:", err);
      }
    };

    fetchCoordinates();
  }, [query]);

  // 🔗 GOOGLE MAPS LINK
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
    window.open(url, "_blank");
  };

  if (!coords) {
    return (
      <div className="text-white/50 text-center py-10">
        Loading map...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 🗺 MAP (CLICKABLE) */}
      <div
        className="w-full h-[300px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
        onClick={openInGoogleMaps}
      >
        <iframe
          title="map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon -
            0.01},${coords.lat - 0.01},${coords.lon + 0.01},${coords.lat +
            0.01}&layer=mapnik&marker=${coords.lat},${coords.lon}`}
        />
      </div>

      {/* 📍 BUTTON */}
      <button
        onClick={openInGoogleMaps}
        className="w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded-lg transition"
      >
        Open in Google Maps 📍
      </button>
    </div>
  );
};

export default MapView;
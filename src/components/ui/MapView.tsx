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

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const query = `${location.city}, ${location.state}`;

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

    if (location.city || location.state) {
      fetchCoordinates();
    }
  }, [location]);

  if (!coords) {
    return (
      <div className="text-white/50 text-center py-10">
        Loading map...
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden">
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
  );
};

export default MapView;
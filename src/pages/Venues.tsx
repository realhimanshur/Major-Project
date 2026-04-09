import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, X, Building2 } from "lucide-react";
import type { Venue } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import VenueCard from "@/components/VenueCard";
import { getVenues } from "@/services/venueService";

const Venues: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVenues();
        console.log("API RESPONSE:", res);
        setVenues(res || []);
      } catch (err) {
        console.error(err);
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const locationValue = `${venue.location?.city || ""} ${venue.location?.state || ""}`.toLowerCase();

      // 🔍 SEARCH
      if (searchQuery) {
        const q = searchQuery.toLowerCase();

        if (
          !venue.name?.toLowerCase().includes(q) &&
          !locationValue.includes(q) &&
          !venue.category?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // 👥 CAPACITY (use max)
      if (selectedCapacity !== "all") {
        const cap =
          typeof venue.capacity?.max === "number"
            ? venue.capacity.max
            : 0;

        if (selectedCapacity === "small" && cap > 100) return false;
        if (selectedCapacity === "medium" && (cap < 100 || cap > 500))
          return false;
        if (selectedCapacity === "large" && cap < 500) return false;
      }

      // 💰 PRICE (use pricePerHour)
      if (selectedPriceRange !== "all") {
        const price =
          typeof venue.pricePerHour === "number"
            ? venue.pricePerHour
            : 0;

        if (selectedPriceRange === "budget" && price > 200) return false;
        if (selectedPriceRange === "standard" && (price < 200 || price > 500))
          return false;
        if (selectedPriceRange === "premium" && price < 500) return false;
      }

      return true;
    });
  }, [venues, searchQuery, selectedCapacity, selectedPriceRange]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCapacity("all");
    setSelectedPriceRange("all");
  };

  const hasActiveFilters =
    searchQuery || selectedCapacity !== "all" || selectedPriceRange !== "all";

  return (
    <div className="relative min-h-screen bg-[#0b0b0f] pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Discover{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
              Venues
            </span>
          </h1>
          <p className="text-white/60 text-sm">
            Find the perfect venue for your next event
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative mb-10 max-w-xl group">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search venues by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border border-white/10 text-white rounded-xl h-11"
          />
        </div>

        <div className="flex gap-8">
          {/* SIDEBAR */}
          <div className="w-72 hidden lg:block">
            <div className="sticky top-24 rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10">
              <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h2>

              {/* Capacity */}
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-3">Capacity</p>
                <div className="flex flex-wrap gap-2">
                  {["all", "small", "medium", "large"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCapacity(c)}
                      className={`px-3 py-1.5 text-xs rounded-full border ${
                        selectedCapacity === c
                          ? "bg-purple-500 text-white border-none"
                          : "bg-white/5 text-white/70 border-white/10"
                      }`}
                    >
                      {c === "all" ? "Any" : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-3">Price Range</p>
                <div className="flex flex-wrap gap-2">
                  {["all", "budget", "standard", "premium"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPriceRange(p)}
                      className={`px-3 py-1.5 rounded-full text-xs border ${
                        selectedPriceRange === p
                          ? "bg-yellow-400 text-black border-none"
                          : "bg-white/5 text-white/70 border-white/10"
                      }`}
                    >
                      {p === "all" ? "Any" : p}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button onClick={clearFilters} className="w-full mt-4">
                  <X className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {/* GRID */}
          <div className="flex-1">
            {!loading && (
              <p className="text-white/50 mb-6 text-sm">
                {filteredVenues.length} venues found
              </p>
            )}

            {loading ? (
              <p className="text-white">Loading...</p>
            ) : filteredVenues.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-10 h-10 text-white/30 mx-auto mb-4" />
                <p className="text-white/50">No venues found</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
                  <div
                    key={venue._id || venue.id}
                    className="transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03]"
                  >
                    <VenueCard venue={venue} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venues;
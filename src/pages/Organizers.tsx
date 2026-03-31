import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, Star, MapPin, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import OrganizerCard from "@/components/OrganizerCard";
import { eventCategories } from "@/data/mockData";
import { getOrganizers } from "@/services/organizerService";

import type { EventCategory, Organizer } from "@/types";

const Organizers: React.FC = () => {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<EventCategory | "all">("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [location, setLocation] = useState("");

  // Fetch
  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrganizers();
      setOrganizers(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter logic
  const filteredOrganizers = useMemo(() => {
    return organizers.filter((org) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          org.name?.toLowerCase().includes(q) ||
          org.bio?.toLowerCase().includes(q) ||
          org.location?.toLowerCase().includes(q);

        if (!match) return false;
      }

      if (
        selectedSpecialty !== "all" &&
        !org.specialties?.includes(selectedSpecialty)
      )
        return false;

      if (minRating > 0 && (org.rating || 0) < minRating) return false;

      if (
        location &&
        !org.location?.toLowerCase().includes(location.toLowerCase())
      )
        return false;

      return true;
    });
  }, [organizers, searchQuery, selectedSpecialty, minRating, location]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("all");
    setMinRating(0);
    setLocation("");
  };

  const hasActiveFilters =
    searchQuery || selectedSpecialty !== "all" || minRating > 0 || location;

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Find <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Organizers</span>
          </h1>
          <p className="text-white/60 text-sm">
            Discover top-rated professionals for your events
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white rounded-xl h-11 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-8">

          {/* FILTER SIDEBAR */}
          <div className="w-72 hidden lg:block">
            <div className="sticky top-24 rounded-2xl p-6 backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">

              <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h2>

              {/* Category */}
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {["all", ...eventCategories.slice(0, 6).map(c => c.id)].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedSpecialty(cat as any)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 border 
                      ${
                        selectedSpecialty === cat
                          ? "bg-purple-500 text-white border-purple-500 shadow-md"
                          : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {cat === "all"
                        ? "All"
                        : eventCategories.find((c) => c.id === cat)?.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-3">Minimum Rating</p>
                <div className="flex gap-2">
                  {[0, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition
                      ${
                        minRating === r
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      {r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-2">Location</p>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="Enter city..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {/* ORGANIZER GRID */}
          <div className="flex-1">

            {!loading && (
              <p className="text-white/50 mb-6 text-sm">
                {filteredOrganizers.length} organizers found
              </p>
            )}

            {loading ? (
              <p className="text-white">Loading...</p>
            ) : filteredOrganizers.length === 0 ? (
              <p className="text-white/50">No organizers found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOrganizers.map((org) => (
                  <div
                    key={org._id}
                    className="transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <OrganizerCard organizer={org} />
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

export default Organizers;

// import React, { useState, useMemo, useEffect } from "react";
// import { Search, Filter, Star, MapPin, X } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// import OrganizerCard from "@/components/OrganizerCard";
// import { eventCategories } from "@/data/mockData";
// import { getOrganizers } from "@/services/organizerService";

// import type { EventCategory, Organizer } from "@/types";

// const Organizers: React.FC = () => {
//   const [organizers, setOrganizers] = useState<Organizer[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Filters
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSpecialty, setSelectedSpecialty] =
//     useState<EventCategory | "all">("all");
//   const [minRating, setMinRating] = useState<number>(0);
//   const [location, setLocation] = useState("");

//   // Fetch
//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getOrganizers();
//       setOrganizers(data);
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   // Filter logic
//   const filteredOrganizers = useMemo(() => {
//     return organizers.filter((org) => {
//       if (searchQuery) {
//         const q = searchQuery.toLowerCase();
//         const match =
//           org.name?.toLowerCase().includes(q) ||
//           org.bio?.toLowerCase().includes(q) ||
//           org.location?.toLowerCase().includes(q);

//         if (!match) return false;
//       }

//       if (
//         selectedSpecialty !== "all" &&
//         !org.specialties?.includes(selectedSpecialty)
//       )
//         return false;

//       if (minRating > 0 && (org.rating || 0) < minRating) return false;

//       if (
//         location &&
//         !org.location?.toLowerCase().includes(location.toLowerCase())
//       )
//         return false;

//       return true;
//     });
//   }, [organizers, searchQuery, selectedSpecialty, minRating, location]);

//   const clearFilters = () => {
//     setSearchQuery("");
//     setSelectedSpecialty("all");
//     setMinRating(0);
//     setLocation("");
//   };

//   const hasActiveFilters =
//     searchQuery || selectedSpecialty !== "all" || minRating > 0 || location;

//   return (
//     <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-4">

//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="text-4xl font-bold text-white mb-2">
//             Find <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Organizers</span>
//           </h1>
//           <p className="text-white/60 text-sm">
//             Discover top-rated professionals for your events
//           </p>
//         </div>

//         {/* Search Bar */}
//         <div className="relative mb-8 max-w-xl">
//           <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
//           <Input
//             placeholder="Search by name, location..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 bg-white/5 border-white/10 text-white rounded-xl h-11 focus:ring-2 focus:ring-purple-500"
//           />
//         </div>

//         <div className="flex gap-8">

//           {/* FILTER SIDEBAR */}
//           <div className="w-72 hidden lg:block">
//             <div className="sticky top-24 rounded-2xl p-6 backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">

//               <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
//                 <Filter className="w-4 h-4" />
//                 Filters
//               </h2>

//               {/* Category */}
//               <div className="mb-6">
//                 <p className="text-white/70 text-sm mb-3">Category</p>
//                 <div className="flex flex-wrap gap-2">
//                   {["all", ...eventCategories.slice(0, 6).map(c => c.id)].map((cat) => (
//                     <button
//                       key={cat}
//                       onClick={() => setSelectedSpecialty(cat as any)}
//                       className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 border 
//                       ${
//                         selectedSpecialty === cat
//                           ? "bg-purple-500 text-white border-purple-500 shadow-md"
//                           : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
//                       }`}
//                     >
//                       {cat === "all"
//                         ? "All"
//                         : eventCategories.find((c) => c.id === cat)?.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Rating */}
//               <div className="mb-6">
//                 <p className="text-white/70 text-sm mb-3">Minimum Rating</p>
//                 <div className="flex gap-2">
//                   {[0, 4, 4.5].map((r) => (
//                     <button
//                       key={r}
//                       onClick={() => setMinRating(r)}
//                       className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition
//                       ${
//                         minRating === r
//                           ? "bg-yellow-400 text-black border-yellow-400"
//                           : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
//                       }`}
//                     >
//                       <Star className="w-3 h-3" />
//                       {r === 0 ? "Any" : `${r}+`}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Location */}
//               <div className="mb-6">
//                 <p className="text-white/70 text-sm mb-2">Location</p>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
//                   <Input
//                     placeholder="Enter city..."
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="pl-9 bg-white/5 border-white/10 text-white rounded-lg"
//                   />
//                 </div>
//               </div>

//               {/* Clear */}
//               {hasActiveFilters && (
//                 <Button
//                   onClick={clearFilters}
//                   className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Reset Filters
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* ORGANIZER GRID */}
//           <div className="flex-1">

//             {!loading && (
//               <p className="text-white/50 mb-6 text-sm">
//                 {filteredOrganizers.length} organizers found
//               </p>
//             )}

//             {loading ? (
//               <p className="text-white">Loading...</p>
//             ) : filteredOrganizers.length === 0 ? (
//               <p className="text-white/50">No organizers found.</p>
//             ) : (
//               <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {filteredOrganizers.map((org) => (
//                   <div
//                     key={org._id}
//                     className="transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
//                   >
//                     <OrganizerCard organizer={org} />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Organizers;
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import EventCard from "@/components/EventCard";
import { eventCategories } from "@/data/mockData";

import type { EventCategory, EventType } from "@/types";

const Events: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory | "all">(
      (searchParams.get("category") as EventCategory) || "all"
    );
  const [selectedType, setSelectedType] =
    useState<EventType | "all">("all");
  const [selectedDateRange, setSelectedDateRange] =
    useState<string>("all");
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  // FETCH EVENTS
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // FILTER LOGIC
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          event.title?.toLowerCase().includes(q) ||
          event.description?.toLowerCase().includes(q) ||
          event.location?.toLowerCase().includes(q) ||
          event.organizerName?.toLowerCase().includes(q);

        if (!match) return false;
      }

      if (selectedCategory !== "all" && event.category !== selectedCategory)
        return false;

      if (selectedType !== "all" && event.type !== selectedType)
        return false;

      if (selectedDateRange !== "all") {
        const eventDate = new Date(event.startDate || event.date);
        const today = new Date();

        switch (selectedDateRange) {
          case "today":
            if (eventDate.toDateString() !== today.toDateString())
              return false;
            break;

          case "this-week":
            const week = new Date(
              today.getTime() + 7 * 24 * 60 * 60 * 1000
            );
            if (eventDate > week || eventDate < today) return false;
            break;

          case "this-month":
            const month = new Date(
              today.getTime() + 30 * 24 * 60 * 60 * 1000
            );
            if (eventDate > month || eventDate < today) return false;
            break;
        }
      }

      if (priceRange) {
        if (
          event.price < priceRange.min ||
          event.price > priceRange.max
        )
          return false;
      }

      return true;
    });
  }, [
    events,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedDateRange,
    priceRange,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedDateRange("all");
    setPriceRange(null);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedType !== "all" ||
    selectedDateRange !== "all" ||
    priceRange !== null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Discover{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="text-white/60 text-sm">
            Find and book amazing events near you
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white rounded-xl h-11 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-8">

          {/* SIDEBAR FILTER */}
          <div className="w-72 hidden lg:block">
            <div className="sticky top-24 rounded-2xl p-6 backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">

              <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h2>

              {/* CATEGORY */}
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {["all", ...eventCategories.map((c) => c.id)].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setSelectedCategory(cat as EventCategory)
                        }
                        className={`px-3 py-1.5 text-xs rounded-full transition border ${
                          selectedCategory === cat
                            ? "bg-purple-500 text-white border-purple-500"
                            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {cat === "all"
                          ? "All"
                          : eventCategories.find((c) => c.id === cat)
                              ?.name}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* DATE */}
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-3">Date</p>
                <div className="flex gap-2 flex-wrap">
                  {["all", "today", "this-week", "this-month"].map(
                    (d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDateRange(d)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition ${
                          selectedDateRange === d
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {d.replace("-", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* CLEAR */}
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

          {/* EVENTS GRID */}
          <div className="flex-1">

            {!loading && (
              <p className="text-white/50 mb-6 text-sm">
                {filteredEvents.length} events found
              </p>
            )}

            {loading ? (
              <p className="text-white">Loading events...</p>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold">
                  No events found
                </h3>
                <p className="text-white/50 mb-4">
                  Try adjusting your filters
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event._id || event.id}
                    className="transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <EventCard event={event} />
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

export default Events;

// import React, { useState, useMemo, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { Search, Filter, Calendar, X } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import EventCard from '@/components/EventCard';
// import { eventCategories } from '@/data/mockData';
// import type { EventCategory, EventType } from '@/types';

// const Events: React.FC = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [events, setEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
//   const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>(
//     (searchParams.get('category') as EventCategory) || 'all'
//   );
//   const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
//   const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
//   const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {

//         const token = localStorage.getItem("token");

//         const res = await fetch('http://localhost:5000/api/events', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         const data = await res.json();
//         setEvents(data);

//       } catch (err) {
//         console.error('Error fetching events:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const filteredEvents = useMemo(() => {
//     return events.filter((event) => {

//       if (searchQuery) {
//         const query = searchQuery.toLowerCase();

//         const matchesSearch =
//           event.title?.toLowerCase().includes(query) ||
//           event.description?.toLowerCase().includes(query) ||
//           event.location?.toLowerCase().includes(query) ||
//           event.organizerName?.toLowerCase().includes(query);

//         if (!matchesSearch) return false;
//       }

//       if (selectedCategory !== 'all' && event.category !== selectedCategory) {
//         return false;
//       }

//       if (selectedType !== 'all' && event.type !== selectedType) {
//         return false;
//       }

//       if (selectedDateRange !== 'all') {

//         const eventDate = new Date(event.startDate || event.date);
//         const today = new Date();

//         switch (selectedDateRange) {

//           case 'today':
//             if (eventDate.toDateString() !== today.toDateString()) return false;
//             break;

//           case 'this-week':
//             const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
//             if (eventDate > weekFromNow || eventDate < today) return false;
//             break;

//           case 'this-month':
//             const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
//             if (eventDate > monthFromNow || eventDate < today) return false;
//             break;
//         }
//       }

//       if (priceRange) {
//         if (event.price < priceRange.min || event.price > priceRange.max) {
//           return false;
//         }
//       }

//       return true;

//     });
//   }, [events, searchQuery, selectedCategory, selectedType, selectedDateRange, priceRange]);

//   const clearFilters = () => {
//     setSearchQuery('');
//     setSelectedCategory('all');
//     setSelectedType('all');
//     setSelectedDateRange('all');
//     setPriceRange(null);
//     setSearchParams({});
//   };

//   const hasActiveFilters =
//     searchQuery ||
//     selectedCategory !== 'all' ||
//     selectedType !== 'all' ||
//     selectedDateRange !== 'all' ||
//     priceRange !== null;

//   const FilterContent = () => (
//     <div className="space-y-6">

//       <div>
//         <label className="text-white font-medium mb-3 block">Category</label>

//         <div className="flex flex-wrap gap-2">

//           <button
//             onClick={() => setSelectedCategory('all')}
//             className={`px-4 py-2 rounded-full text-sm transition-all ${
//               selectedCategory === 'all'
//                 ? 'bg-[#633dc0] text-white'
//                 : 'bg-white/5 text-white/70 hover:bg-white/10'
//             }`}
//           >
//             All
//           </button>

//           {eventCategories.map((cat) => (
//             <button
//               key={cat.id}
//               onClick={() => setSelectedCategory(cat.id as EventCategory)}
//               className={`px-4 py-2 rounded-full text-sm transition-all capitalize ${
//                 selectedCategory === cat.id
//                   ? 'bg-[#633dc0] text-white'
//                   : 'bg-white/5 text-white/70 hover:bg-white/10'
//               }`}
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {hasActiveFilters && (
//         <Button
//           onClick={clearFilters}
//           variant="outline"
//           className="w-full border-white/20 text-white hover:bg-white/10"
//         >
//           <X className="w-4 h-4 mr-2" />
//           Clear Filters
//         </Button>
//       )}

//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#161616] pt-24 pb-16">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         <div className="mb-8">

//           <h1 className="text-3xl sm:text-4xl font-bold font-['Montserrat'] text-white mb-4">
//             Discover <span className="gradient-text">Events</span>
//           </h1>

//           <p className="text-white/60">
//             Find and book amazing events happening near you
//           </p>

//         </div>

//         <div className="flex flex-col md:flex-row gap-4 mb-8">

//           <div className="relative flex-1">

//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

//             <Input
//               type="text"
//               placeholder="Search events..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-12 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/40"
//             />

//           </div>

//           <Sheet>

//             <SheetTrigger asChild>

//               <Button variant="outline" className="md:hidden border-white/20 text-white hover:bg-white/10">
//                 <Filter className="w-4 h-4 mr-2" />
//                 Filters
//               </Button>

//             </SheetTrigger>

//             <SheetContent side="right" className="bg-[#1e1e1e] border-white/10 w-full sm:max-w-md">

//               <SheetHeader>
//                 <SheetTitle className="text-white">Filters</SheetTitle>
//               </SheetHeader>

//               <div className="mt-6">
//                 <FilterContent />
//               </div>

//             </SheetContent>

//           </Sheet>

//         </div>

//         <div className="flex gap-8">

//           <div className="hidden md:block w-64 flex-shrink-0">

//             <div className="glass-card rounded-xl p-6 sticky top-24">

//               <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
//                 <Filter className="w-5 h-5" />
//                 Filters
//               </h3>

//               <FilterContent />

//             </div>

//           </div>

//           <div className="flex-1">

//             <div className="flex items-center justify-between mb-6"></div>

//             {loading ? (

//               <div className="text-center py-20 text-white/60">Loading events...</div>

//             ) : filteredEvents.length > 0 ? (

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//                 {filteredEvents.map((event) => (
//                   <EventCard key={event._id || event.id} event={event} />
//                 ))}

//               </div>

//             ) : (

//               <div className="text-center py-16">

//                 <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
//                   <Calendar className="w-10 h-10 text-white/30" />
//                 </div>

//                 <h3 className="text-xl font-semibold text-white mb-2">
//                   No events found
//                 </h3>

//                 <p className="text-white/60 mb-6">
//                   Try adjusting your filters
//                 </p>

//                 <Button onClick={clearFilters} className="btn-primary">
//                   Clear Filters
//                 </Button>

//               </div>

//             )}

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Events;
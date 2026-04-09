import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Ticket, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

import { getFavorites } from "@/services/bookingService";
import type { FavoriteItem } from "@/services/bookingService";

// ✅ BOOKING TYPE
interface BookingType {
  _id: string;
  tickets: number;
  eventId: {
    _id: string;
    title: string;
    startDate: string;
  };
}

const AttendeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("bookings");

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH BOOKINGS ---------------- */
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: BookingType[] = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH FAVORITES ---------------- */
  const fetchFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchFavorites();
  }, []);

  /* ---------------- FORMAT DATE ---------------- */
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ---------------- SPLIT FAVORITES ---------------- */
  const venueFavorites = favorites.filter((f) => f.type === "venue");
  const eventFavorites = favorites.filter((f) => f.type === "event");

  /* ---------------- UPCOMING COUNT ---------------- */
  const upcomingCount = bookings.filter(
    (b) => new Date(b.eventId?.startDate) > new Date(),
  ).length;

  return (
    <div className="min-h-screen bg-[#161616] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-white/60">Attendee Dashboard</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#633dc0]/20 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-[#c385ff]" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {bookings.length}
                </p>
                <p className="text-white/50 text-sm">Bookings</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00c853]/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#00c853]" />
              </div>

              <div>
                <p className="text-2xl font-bold text-white">{upcomingCount}</p>
                <p className="text-white/50 text-sm">Upcoming</p>
              </div>
            </div>
          </div>

          {/* ✅ FAVORITES COUNT */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{favorites.length}</p>
            <p className="text-white/50 text-sm">Favorites</p>
          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-white/50 text-sm">Reviews</p>
          </div>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border-b border-white/10 mb-6">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* BOOKINGS TAB (UNCHANGED) */}
          <TabsContent value="bookings">
            {loading ? (
              <div className="text-white/60">Loading bookings...</div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="glass-card rounded-xl p-6 flex flex-col md:flex-row gap-6"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {booking.eventId?.title}
                      </h3>

                      <div className="flex gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.eventId?.startDate)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Ticket className="w-4 h-4" />
                          {booking.tickets} Tickets
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/events/${booking.eventId?._id}`)
                        }
                      >
                        View Event
                      </Button>

                      <Button size="sm" className="btn-primary">
                        View Ticket
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/60">No bookings yet</div>
            )}
          </TabsContent>

          {/* ❤️ FAVORITES TAB */}
          <TabsContent value="favorites">
            {/* 🔹 VENUES */}
            <h2 className="text-lg font-semibold text-white mb-3">Venues</h2>
            {venueFavorites.length > 0 ? (
              <div className="space-y-4 mb-6">
                {venueFavorites.map((v) => (
                  <div
                    key={v._id}
                    className="glass-card rounded-xl p-6 flex flex-col md:flex-row gap-6"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {v.name}
                      </h3>

                      <p className="text-white/60">{v.location}</p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/venues/${v._id}`)}
                    >
                      View Venue
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 mb-6">No favorite venues</p>
            )}

            {/* 🔹 EVENTS */}
            <h2 className="text-lg font-semibold text-white mb-3">Events</h2>
            {eventFavorites.length > 0 ? (
              <div className="space-y-4">
                {eventFavorites.map((event) => (
                  <div
                    key={event._id}
                    className="glass-card rounded-xl p-6 flex flex-col md:flex-row gap-6"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {event.title}
                      </h3>

                      <p className="text-white/60 mb-2">{event.location}</p>

                      <p className="text-white/70">₹{event.price ?? "N/A"}</p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View Event
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/40">
                <Heart className="mx-auto mb-2" />
                No favorite events
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttendeeDashboard;

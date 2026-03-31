import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Ticket,
  // Heart,
  // User,
  // ChevronRight,
  // Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

const AttendeeDashboard: React.FC = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH BOOKINGS ---------------- */

  const fetchBookings = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setBookings(data);

    } catch (error) {

      console.error("Error fetching bookings:", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ---------------- FORMAT DATE ---------------- */

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  /* ---------------- UPCOMING COUNT ---------------- */

  const upcomingCount = bookings.filter(
    (b) => new Date(b.eventId?.startDate) > new Date()
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
                <p className="text-2xl font-bold text-white">
                  {upcomingCount}
                </p>
                <p className="text-white/50 text-sm">Upcoming</p>
              </div>

            </div>

          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-2xl font-bold text-white">0</p>
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

            <TabsTrigger value="bookings">
              My Bookings
            </TabsTrigger>

            <TabsTrigger value="favorites">
              Favorites
            </TabsTrigger>

            <TabsTrigger value="settings">
              Settings
            </TabsTrigger>

          </TabsList>

          {/* BOOKINGS TAB */}

          <TabsContent value="bookings">

            {loading ? (

              <div className="text-white/60">
                Loading bookings...
              </div>

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

                      <Button
                        size="sm"
                        className="btn-primary"
                      >
                        View Ticket
                      </Button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="text-center py-16">

                <Ticket className="w-10 h-10 text-white/30 mx-auto mb-4" />

                <h3 className="text-xl font-semibold text-white mb-2">
                  No bookings yet
                </h3>

                <p className="text-white/60 mb-6">
                  Start exploring events and book your first experience!
                </p>

                <Button
                  onClick={() => navigate("/events")}
                  className="btn-primary"
                >
                  Browse Events
                </Button>

              </div>

            )}

          </TabsContent>

        </Tabs>

      </div>

    </div>

  );

};

export default AttendeeDashboard;

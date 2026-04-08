import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyEvents } from "@/services/eventService";
import {
  Calendar,
  Plus,
  Users,
  Eye,
  Edit,
  MoreVertical,
  Lock,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import ProfileForm from "@/pages/organizer/ProfileForm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventType {
  _id: string;
  title: string;
  image?: string;
  visibility?: "public" | "private";
  startDate: string;
  registered?: number;
  capacity: number;
  price?: number;
}

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ADDED
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>("events");
  const [events, setEvents] = useState<EventType[]>([]);

  // ✅ UPDATED useEffect (refetch on navigation state change)
  useEffect(() => {
    const fetchEventsData = async (): Promise<void> => {
      try {
        const data = await getMyEvents();
        setEvents(data as EventType[]);
      } catch (error: unknown) {
        console.error("Fetch events error:", error);
      }
    };

    fetchEventsData();
  }, [location.state]); // ✅ KEY FIX

  const handleDelete = async (eventId: string): Promise<void> => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event deleted successfully ✅");

      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (error: unknown) {
      console.error("Delete error:", error);
      alert("Failed to delete event ❌");
    }
  };

  const totalAttendees = events.reduce(
    (sum, e) => sum + (e.registered || 0),
    0,
  );

  const totalRevenue = events.reduce(
    (sum, e) => sum + (e.price || 0) * (e.registered || 0),
    0,
  );

  // ✅ FIXED DATE HANDLING
  const formatDate = (date: string): string => {
    if (!date) return "Date not available";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#161616] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-white/60">Organizer Dashboard</p>
          </div>

          <Button
            className="btn-primary"
            onClick={() => navigate("/organizer/create-event")}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{events.length}</p>
            <p className="text-white/50 text-sm">Events</p>
          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{totalAttendees}</p>
            <p className="text-white/50 text-sm">Attendees</p>
          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-2xl font-bold text-white">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <p className="text-white/50 text-sm">Revenue</p>
          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-2xl font-bold text-white">4.8</p>
            <p className="text-white/50 text-sm">Rating</p>
          </div>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border-b border-white/10 mb-6">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* EVENTS */}
          <TabsContent value="events">
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => {
                  const image =
                    event.image && event.image.trim() !== ""
                      ? event.image
                      : "https://images.unsplash.com/photo-1511795409834-ef04bbd61622";

                  return (
                    <div
                      key={event._id}
                      className="glass-card rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center"
                    >
                      {/* IMAGE */}
                      <img
                        src={image}
                        alt={event.title}
                        className="w-full md:w-32 h-24 object-cover rounded-lg"
                      />

                      {/* CONTENT */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">
                            {event.title}
                          </h3>

                          {event.visibility === "private" ? (
                            <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Private
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              Public
                            </span>
                          )}
                        </div>

                        <div className="flex gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(event.startDate)}
                          </span>

                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.registered || 0}/{event.capacity}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/events/${event._id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/organizer/edit/${event._id}`)
                          }
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() =>
                            navigate(`/organizer/event/${event._id}`)
                          }
                        >
                          Manage
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleDelete(event._id)}
                              className="text-red-500"
                            >
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-10 h-10 text-white/30 mx-auto mb-4" />

                <h3 className="text-xl font-semibold text-white mb-2">
                  No events yet
                </h3>

                <p className="text-white/60 mb-6">
                  Create your first event
                </p>

                <Button
                  className="btn-primary"
                  onClick={() => navigate("/organizer/create-event")}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="glass-card p-6 rounded-xl text-white">
              Analytics coming soon
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
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
  // Lock,
  // Globe,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

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

/* ================= TYPES ================= */
interface UserType {
  _id: string;
  name: string;
}
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

interface BookingType {
  _id: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  paymentStatus: "pending" | "paid";
  budget: number;
  venue?: {
    name: string;
  };
}

interface RevenuePoint {
  date: string;
  revenue: number;
}

interface InsightsType {
  totalRegistrations: number;
  checkIns: number;
  noShowRate: number;
}

/* ================= COMPONENT ================= */

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
 const { user } = useAuth() as { user: UserType | null };

  const [activeTab, setActiveTab] = useState<string>("events");
  const [events, setEvents] = useState<EventType[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [insights, setInsights] = useState<InsightsType>({
  totalRegistrations: 0,
  checkIns: 0,
  noShowRate: 0,
});

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    getMyEvents().then((data) => setEvents(data as EventType[]));
  }, [location.state]);

  /* ================= FETCH BOOKINGS (FIXED) ================= */
  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:5000/api/bookings/my?organizerId=${user._id}`)
      .then((res) => res.json())
      .then(setBookings);
  }, [user]);

  /* ================= FETCH ANALYTICS ================= */
  useEffect(() => {
    if (!user?._id) return;

    // Revenue
    axios
      .get(
        `http://localhost:5000/api/bookings/analytics/revenue-trend?organizerId=${user._id}`
      )
      .then((res) => setRevenueData(res.data));

    // Insights
    axios
      .get(
        `http://localhost:5000/api/bookings/analytics/attendee-insights?organizerId=${user._id}`
      )
      .then((res) => setInsights(res.data));
  }, [user]);

  /* ================= CALCULATIONS ================= */

  const totalAttendees = bookings.length;

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.budget || 0), 0);

  const checkIns = insights?.checkIns || 0;
  const noShowRate = insights?.noShowRate || 0;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString();
  };

  const handleDelete = async (eventId: string) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    await axios.delete(`http://localhost:5000/api/events/${eventId}`);
    setEvents((prev) => prev.filter((e) => e._id !== eventId));
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#161616] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-white/60">Organizer Dashboard</p>
          </div>

          <Button onClick={() => navigate("/organizer/create-event")}>
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </div>

        {/* KPI (UPGRADED) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4">
            <p className="text-2xl text-white">{events.length}</p>
            <p className="text-white/50">Events</p>
          </div>

          <div className="glass-card p-4">
            <p className="text-2xl text-white">{totalAttendees}</p>
            <p className="text-white/50">Attendees</p>
          </div>

          <div className="glass-card p-4">
            <p className="text-2xl text-white">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <p className="text-white/50">Revenue</p>
          </div>

          <div className="glass-card p-4">
            <p className="text-2xl text-white">{checkIns}</p>
            <p className="text-white/50">Check-ins</p>
          </div>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* EVENTS */}
          <TabsContent value="events">
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="glass-card rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center"
                  >
                    <img
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
                      }
                      className="w-32 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {event.title}
                      </h3>

                      <div className="text-sm text-white/60 flex gap-4">
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

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => navigate(`/events/${event._id}`)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>

                      <Button size="sm" onClick={() => navigate(`/organizer/edit/${event._id}`)}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>

                      <Button size="sm" onClick={() => navigate(`/organizer/event/${event._id}`)}>
                        Manage
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm">
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleDelete(event._id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white text-center">No events</div>
            )}
          </TabsContent>

          {/* ANALYTICS (UPGRADED) */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6 text-white">

              {/* Revenue */}
              <div className="glass-card p-6">
                <h2 className="mb-4">Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="revenue" stroke="#a855f7" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Insights */}
              <div className="glass-card p-6">
                <h2 className="mb-4">Attendee Insights</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { name: "Total", value: totalAttendees },
                      { name: "Check-ins", value: checkIns },
                      { name: "No-show %", value: noShowRate },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </TabsContent>

          {/* BOOKINGS */}
          <TabsContent value="bookings">
            {bookings.map((b) => (
              <div key={b._id} className="glass-card p-4 mb-4 text-white">
                <p>{b.venue?.name || "Venue"}</p>
                <p>{formatDate(b.eventDate)}</p>
                <p>{b.paymentStatus}</p>
              </div>
            ))}
          </TabsContent>

          {/* PROFILE */}
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
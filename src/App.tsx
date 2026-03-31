import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Pages
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import Organizers from "@/pages/Organizers";
import Venues from "@/pages/Venues";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CreateEvent from "@/pages/organizer/createEvent";
import EventManager from "./pages/organizer/EventManager";
import VenueDetails from "./pages/VenueDetails";
import OrganizerDetail from "@/pages/OrganizerDetail";
import AIChatWidget from "@/components/ai-agent/AIChatWidget";
import { AIChatProvider } from "@/context/AIChatContext";


// Dashboards
import AttendeeDashboard from "@/dashboards/AttendeeDashboard";
import OrganizerDashboard from "@/dashboards/OrganizerDashboard";
import AdminDashboard from "@/dashboards/AdminDashboard";

// Protected Route
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "organizer") return <Navigate to="/organizer" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard Router
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "organizer":
      return <Navigate to="/organizer" replace />;
    case "attendee":
      return <AttendeeDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Main App Content
const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#161616]">
      <Navbar />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/organizers" element={<Organizers />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/organizer/create-event" element={<CreateEvent />} />
          <Route path="/organizers/:id" element={<OrganizerDetail />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer"
            element={
              <ProtectedRoute allowedRoles={["organizer"]}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/event/:id"
            element={
              <ProtectedRoute allowedRoles={["organizer"]}>
                <EventManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["organizer"]}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* ✅ FIX: AI Widget inside app */}
      <AIChatWidget />
    </div>
  );
};

// Main App
function App() {
  return (
    <AuthProvider>
      <AIChatProvider>
      <Router>
        <AppContent />
      </Router>
      </AIChatProvider>
    </AuthProvider>
  );
}

export default App;

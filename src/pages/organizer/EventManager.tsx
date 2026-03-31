import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const EventManager: React.FC = () => {

  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [attendees, setAttendees] = useState<any[]>([]);

  useEffect(() => {

    const fetchEvent = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/events/my-events`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const found = res.data.find((e: any) => e._id === id);
        setEvent(found);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchEvent();

  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading event manager...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Event not found
      </div>
    );
  }

  const revenue = (event.price || 0) * (event.registered || 0);

  return (

    <div className="min-h-screen bg-[#161616] pt-24 pb-16">

      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-white mb-2">
            {event.title}
          </h1>

          <p className="text-white/60">
            Manage your event
          </p>

        </div>

        {/* TABS */}

        <Tabs defaultValue="overview">

          <TabsList className="bg-white/5 mb-6">

            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>

            <TabsTrigger value="attendees">
              Attendees
            </TabsTrigger>

            <TabsTrigger value="analytics">
              Analytics
            </TabsTrigger>

            <TabsTrigger value="settings">
              Settings
            </TabsTrigger>

          </TabsList>

          {/* OVERVIEW */}

          <TabsContent value="overview">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="glass-card p-6 rounded-xl text-white">

                <p className="text-3xl font-bold">
                  {event.registered || 0}
                </p>

                <p className="text-white/60">
                  Total Attendees
                </p>

              </div>

              <div className="glass-card p-6 rounded-xl text-white">

                <p className="text-3xl font-bold">
                  ₹{revenue}
                </p>

                <p className="text-white/60">
                  Revenue
                </p>

              </div>

              <div className="glass-card p-6 rounded-xl text-white">

                <p className="text-3xl font-bold">
                  {event.capacity}
                </p>

                <p className="text-white/60">
                  Capacity
                </p>

              </div>

            </div>

          </TabsContent>

          {/* ATTENDEES */}

          <TabsContent value="attendees">

            <div className="glass-card p-6 rounded-xl text-white">

              <h2 className="text-xl font-semibold mb-4">
                Attendees
              </h2>

              <p className="text-white/60">
                Attendee list will appear here.
              </p>

              <Button className="mt-4">
                Export CSV
              </Button>

            </div>

          </TabsContent>

          {/* ANALYTICS */}

          <TabsContent value="analytics">

            <div className="glass-card p-6 rounded-xl text-white">

              <h2 className="text-xl font-semibold mb-4">
                Analytics
              </h2>

              <p className="text-white/60">
                Event analytics charts will appear here.
              </p>

            </div>

          </TabsContent>

          {/* SETTINGS */}

          <TabsContent value="settings">
  <div className="glass-card p-6 rounded-xl text-white space-y-4">

    <h2 className="text-xl font-semibold">Event Settings</h2>

    <Button
      onClick={() => window.location.href = `/organizer/edit/${event._id}`}
    >
      Edit Event
    </Button>

    <Button
      variant="destructive"
      onClick={async () => {
        if (confirm("Delete this event?")) {
          await fetch(`http://localhost:5000/api/events/${event._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });

          alert("Event Deleted");
          window.location.href = "/organizer";
        }
      }}
    >
      Delete Event
    </Button>

  </div>
</TabsContent>

        </Tabs>

      </div>

    </div>

  );

};

export default EventManager;
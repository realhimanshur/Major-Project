// ONLY CHANGE: added attendee role check

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, ArrowLeft, Phone } from "lucide-react";

import { getOrganizerById } from "@/services/organizerService";
import { createBooking, createPaymentOrder, getRazorpayKey } from "@/services/bookingService";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RazorpayResponse = {
  razorpay_payment_id: string;
};

const RazorpayConstructor = (window as unknown as {
  Razorpay: new (options: RazorpayOptions) => { open: () => void };
}).Razorpay;

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
};

interface Organizer {
  _id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  description: string;
  specialties: string[];
  phone?: string;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget: string;
  notes: string;
}

const OrganizerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);

  const [form, setForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    location: "",
    budget: "",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const data = await getOrganizerById(id);
        setOrganizer(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!organizer?._id) return;

      const bookingRes = await createBooking({
        organizerId: organizer._id,
        ...form,
        budget: Number(form.budget),
      });

      const booking = bookingRes.booking as { _id: string };

      const order = await createPaymentOrder(Number(form.budget));

      const key = await getRazorpayKey();

      const options: RazorpayOptions = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Event Horizon",
        description: "Organizer Booking Payment",
        order_id: order.id,

        handler: async (response: RazorpayResponse) => {
          await fetch(
            `http://localhost:5000/api/bookings/${booking._id}/payment`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
              }),
            },
          );

          alert("Payment successful 🎉");
          setOpen(false);
        },

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },

        theme: {
          color: "#633dc0",
        },
      };

      const rzp = new RazorpayConstructor(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-40">Loading...</div>;
  }

  if (!organizer) {
    return (
      <div className="text-white text-center mt-40">Organizer not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white mb-4 flex items-center gap-2"
        >
          <ArrowLeft /> Back
        </button>

        <div className="rounded-2xl overflow-hidden mb-6">
          <img
            src={organizer.image}
            alt={organizer.name}
            className="w-full h-[350px] object-cover"
          />
        </div>

        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">{organizer.name}</h1>

          <p className="flex items-center gap-2 text-white/60 mb-2">
            <MapPin className="w-4 h-4" />
            {organizer.location}
          </p>

          <p className="flex items-center gap-2 text-yellow-400 mb-4">
            <Star className="w-4 h-4 fill-current" />
            {organizer.rating} ({organizer.reviews})
          </p>

          <h2 className="text-2xl font-semibold mb-4">₹{organizer.price}</h2>

          <p className="text-white/70 mb-6">{organizer.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {organizer.specialties?.map((item) => (
                <Badge key={item} className="bg-white/10 text-white border-0">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }

                // ✅ NEW: ROLE CHECK (ONLY ATTENDEE)
                if (user.role !== "attendee") {
                  alert("Only attendees can hire organizers ❌");
                  return;
                }

                setOpen(true);
              }}
            >
              Hire Organizer
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                if (organizer.phone) {
                  window.location.href = `tel:${organizer.phone}`;
                }
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1e1e1e] text-white">
          <DialogHeader>
            <DialogTitle>Hire Organizer</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            {Object.keys(form).map((key) =>
              key === "notes" ? (
                <textarea
                  key={key}
                  name={key}
                  placeholder="Notes (optional)"
                  onChange={handleChange}
                  className="p-2 bg-white/10 rounded"
                />
              ) : (
                <input
                  key={key}
                  name={key}
                  placeholder={key}
                  onChange={handleChange}
                  className="p-2 bg-white/10 rounded"
                />
              ),
            )}

            <Button onClick={handleSubmit}>Confirm Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerDetail;
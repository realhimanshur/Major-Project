import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, ArrowLeft, Phone } from "lucide-react";

import { getOrganizerById } from "@/services/organizerService";
import { createBooking, createPaymentOrder } from "@/services/bookingService";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OrganizerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [organizer, setOrganizer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 MODAL STATE
  const [open, setOpen] = useState(false);

  // 🔥 FORM STATE
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    location: "",
    budget: "",
    notes: "",
  });

  // FETCH ORGANIZER
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

  // HANDLE INPUT
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT FORM
  const handleSubmit = async () => {
    try {
      if (!organizer?._id) return;

      // 1️⃣ Create booking first
      const bookingRes = await createBooking({
        organizerId: organizer._id,
        ...form,
        budget: Number(form.budget),
      });

      const booking = bookingRes.booking;

      // 2️⃣ Create Razorpay order
      const order = await createPaymentOrder(Number(form.budget));

      // 3️⃣ Razorpay options
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // 🔥 replace this
        amount: order.amount,
        currency: order.currency,
        name: "Event Horizon",
        description: "Organizer Booking Payment",
        order_id: order.id,

        handler: async function (response: any) {
          // 4️⃣ Update payment in backend
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

      const rzp = new (window as any).Razorpay(options);
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
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="text-white mb-4 flex items-center gap-2"
        >
          <ArrowLeft /> Back
        </button>

        {/* IMAGE */}
        <div className="rounded-2xl overflow-hidden mb-6">
          <img
            src={organizer.image}
            alt={organizer.name}
            className="w-full h-[350px] object-cover"
          />
        </div>

        {/* DETAILS */}
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

          {/* SPECIALTIES */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {organizer.specialties?.map((item: string) => (
                <Badge key={item} className="bg-white/10 text-white border-0">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <Button
              className="bg-[#633dc0] hover:bg-[#4f2fa8]"
              onClick={() => setOpen(true)}
            >
              Hire Organizer
            </Button>

            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
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

      {/* 🔥 BOOKING MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1e1e1e] text-white">
          <DialogHeader>
            <DialogTitle>Hire Organizer</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            <input
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
              className="p-2 bg-white/10 rounded"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="p-2 bg-white/10 rounded"
            />
            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="p-2 bg-white/10 rounded"
            />
            <input
              name="eventType"
              placeholder="Event Type"
              onChange={handleChange}
              className="p-2 bg-white/10 rounded"
            />
            <input
              type="date"
              name="eventDate"
              onChange={handleChange}
              className="p-2 bg-white/10 rounded"
            />
            <input
              name="location"
              placeholder="Event Location"
              onChange={handleChange}
              className="p-2 bg-white/10 rounded"
            />
            <input
              name="budget"
              placeholder="Budget"
              onChange={handleChange}
              className="p-2 bg-white/10 rounded"
            />
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              onChange={handleChange}
              className="p-2 bg-white/10 rounded"
            />

            <Button onClick={handleSubmit}>Confirm Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerDetail;

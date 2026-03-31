import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEvent,
  getEventById,
  updateEvent,
} from "@/services/eventService";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    price: "",
    capacity: "",
    category: "",
    ageGroup: "all",
    visibility: "public",
    accessCode: "",
    image: "",
  });

  useEffect(() => {
    if (isEdit) {
      getEventById(id!).then((data) => {
        setFormData({
          ...data,
          price: data.price || "",
          capacity: data.capacity || "",
        });
      });
    }
  }, [id]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* 🔥 VALIDATION */
  const validate = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.price ||
      !formData.capacity ||
      !formData.category
    ) {
      alert("Please fill all required fields ❌");
      return false;
    }

    if (formData.visibility === "private" && !formData.accessCode) {
      alert("Access code required for private event ❌");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      let res;

      if (isEdit) {
        res = await updateEvent(id!, formData);
      } else {
        res = await createEvent(formData);
      }

      console.log("API RESPONSE:", res);

      if (!res || res.message) {
        throw new Error(res?.message || "Something failed");
      }

      alert(isEdit ? "Event Updated ✅" : "Event Created 🚀");

      navigate("/organizer");
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl text-white mb-8">
          {isEdit ? "Edit Event" : "Create Event"}
        </h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl space-y-4">
              <Input
                name="title"
                placeholder="Title *"
                value={formData.title}
                onChange={handleChange}
              />

              <Textarea
                name="description"
                placeholder="Description *"
                value={formData.description}
                onChange={handleChange}
              />

              <Input
                name="location"
                placeholder="Location *"
                value={formData.location}
                onChange={handleChange}
              />

              <Input
                name="image"
                placeholder="Image URL (optional)"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div className="glass-card p-6 rounded-xl space-y-4">
              <Input
                type="datetime-local"
                name="startDate"
                value={formData.startDate?.slice(0, 16)}
                onChange={handleChange}
              />

              <Input
                type="datetime-local"
                name="endDate"
                value={formData.endDate?.slice(0, 16)}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl space-y-4">
              {/* PRICE */}
              <Input
                name="price"
                placeholder="Price *"
                value={formData.price}
                onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                onChange={handleChange}
              />

              {/* CAPACITY */}
              <Input
                name="capacity"
                placeholder="Capacity *"
                value={formData.capacity}
                onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                onChange={handleChange}
              />

              {/* CATEGORY */}
              <select
                className="w-full bg-[#111] border border-white/10 rounded-md p-2 text-white"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category *</option>

                <option value="music">Music</option>
                <option value="business">Business</option>
                <option value="wellness">Wellness</option>
                <option value="food">Food & Drink</option>
                <option value="arts">Arts</option>
                <option value="sports">Sports</option>
                <option value="education">Education</option>
                <option value="social">Social</option>
              </select>

              {/* VISIBILITY */}
              <select
                className="w-full bg-[#111] border border-white/10 rounded-md p-2 text-white"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              {/* ACCESS CODE */}
              {formData.visibility === "private" && (
                <Input
                  name="accessCode"
                  placeholder="Access Code *"
                  value={formData.accessCode}
                  onChange={handleChange}
                />
              )}
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              {isEdit ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

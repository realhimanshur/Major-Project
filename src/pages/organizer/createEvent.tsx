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

// ✅ FORM TYPE (UI ONLY)
interface FormDataType {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: string;
  capacity: string;
  category: string;
  ageGroup: string;
  visibility: "public" | "private";
  accessCode: string;
  image: string;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<FormDataType>({
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

  // 🔥 FETCH EVENT (EDIT MODE)
  useEffect(() => {
    if (isEdit && id) {
      getEventById(id).then((data) => {
        const d = data;

        setFormData({
          title: d.title || "",
          description: d.description || "",
          location: d.location || "",
          startDate: d.startDate || "",
          endDate: d.endDate || "",
          price: String(d.price ?? ""),
          capacity: String(d.capacity ?? ""),
          category: d.category || "",

          ageGroup: (d as unknown as { ageGroup?: string }).ageGroup || "all",
          visibility:
            (d as unknown as { visibility?: "public" | "private" })
              .visibility || "public",
          accessCode:
            (d as unknown as { accessCode?: string }).accessCode || "",

          image: d.image || "",
        });
      });
    }
  }, [id, isEdit]);

  // 🔥 HANDLE CHANGE
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 VALIDATION
  const validate = (): boolean => {
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

  // 🔥 MAP FORM → API PAYLOAD
  const mapToPayload = (): Record<string, unknown> => {
    return {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      category: formData.category,
      image: formData.image,
      ageGroup: formData.ageGroup,
      visibility: formData.visibility,
      accessCode: formData.accessCode,
    };
  };

  // 🔥 SUBMIT
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!validate()) return;

    try {
      let res;
      const payload = mapToPayload();

      if (isEdit && id) {
        res = await updateEvent(id, payload as never);
      } else {
        res = await createEvent(payload as never);
      }

      console.log("API RESPONSE:", res);

      alert(isEdit ? "Event Updated ✅" : "Event Created 🚀");

      // 🔥 REFRESH DASHBOARD
      navigate("/organizer", { state: { refresh: true } });
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        alert("Error: " + err.message);
      } else {
        alert("Something went wrong ❌");
      }
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
              <Input
                name="price"
                placeholder="Price *"
                value={formData.price}
                onChange={handleChange}
              />
              <Input
                name="capacity"
                placeholder="Capacity *"
                value={formData.capacity}
                onChange={handleChange}
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-md p-2 text-white"
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

              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-md p-2 text-white"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

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

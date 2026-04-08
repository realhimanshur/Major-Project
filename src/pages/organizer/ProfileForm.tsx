import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateOrganizerProfile } from "@/services/organizerService";
import axios from "axios"; // ✅ ADD

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  bio: string;
  image: string;
}

const ProfileForm = () => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false); // ✅ ADD
  const [successMsg, setSuccessMsg] = useState<string>("");

  const [form, setForm] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      organization: user.organization || "",
      bio: user.bio || "",
      image: user.image || "",
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!isEditing) return;

    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔥 CLOUDINARY UPLOAD
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64 = reader.result;

        const res = await axios.post(
          "http://localhost:5000/api/ai/upload",
          { image: base64 }
        );

        const imageUrl: string = res.data.imageUrl;

        setForm((prev) => ({
          ...prev,
          image: imageUrl, // ✅ REAL URL
        }));
      };
    } catch (error: unknown) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSuccessMsg("");

      const updatedUser = await updateOrganizerProfile(form);

      updateUser(updatedUser);

      setSuccessMsg("Profile updated successfully ✅");
      setIsEditing(false);
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Organizer Profile
        </h2>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm text-white"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="mb-4 text-green-400 text-sm">{successMsg}</div>
      )}

      {/* IMAGE */}
      <div className="mb-6 flex items-center gap-4">
        <img
          src={form.image || "https://via.placeholder.com/100"}
          alt="profile"
          className="w-20 h-20 rounded-full object-cover border border-gray-700"
        />

        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-300"
          />
        )}

        {uploading && (
          <span className="text-sm text-yellow-400">Uploading...</span>
        )}
      </div>

      {/* FORM */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          readOnly={!isEditing}
          onChange={handleChange}
          className={`input ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
        />

        <input
          name="email"
          value={form.email}
          readOnly
          className="input opacity-70 cursor-not-allowed"
        />

        <input
          name="phone"
          value={form.phone}
          readOnly={!isEditing}
          onChange={handleChange}
          className={`input ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
        />

        <input
          name="organization"
          value={form.organization}
          readOnly={!isEditing}
          onChange={handleChange}
          className={`input ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
        />

        <textarea
          name="bio"
          value={form.bio}
          readOnly={!isEditing}
          onChange={handleChange}
          className={`input md:col-span-2 h-24 ${
            !isEditing ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />
      </div>

      {/* SAVE */}
      {isEditing && (
        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      )}
    </div>
  );
};

export default ProfileForm;
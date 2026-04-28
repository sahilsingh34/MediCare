"use client";

import { useState, useRef, useEffect } from "react";
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Stethoscope, 
  IndianRupee, 
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  Camera,
  Upload,
  ChevronRight,
  Mail,
  Lock
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { updateDoctorProfile, uploadDoctorPhoto } from "@/actions/doctors";

export default function DoctorSettingsPage() {
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState("Professional Profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Professional State
  const [specialization, setSpecialization] = useState("");
  const [fees, setFees] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data (in a real app, fetch from DB, here we'll use placeholder or props)
  useEffect(() => {
    if (clerkUser) {
      setImageUrl(clerkUser.imageUrl);
      // We would normally fetch specialization/fees/bio from our DB here
      setSpecialization("Cardiologist");
      setFees("800");
      setBio("Senior specialist with over 15 years of experience in clinical medicine and healthcare management.");
    }
  }, [clerkUser]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadDoctorPhoto(formData);
      if (result.success && result.url) {
        setImageUrl(result.url);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err: any) {
      console.error("Settings upload error:", err);
      setError("Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const result = await updateDoctorProfile({
      specialization,
      fees: Number(fees),
      bio,
      image_url: imageUrl
    });

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || "Failed to update profile");
    }
    setIsSaving(false);
  };

  const tabs = [
    { name: "Professional Profile", icon: Stethoscope },
    { name: "Account Details", icon: User },
    { name: "Security", icon: Shield },
    { name: "Notifications", icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 text-sm">Manage your professional profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {tabs.map((item) => (
            <button 
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.name 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-500 hover:bg-white hover:text-gray-900 bg-transparent border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {item.name}
              </div>
              {activeTab === item.name && <ChevronRight size={14} />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
            
            {activeTab === "Professional Profile" && (
              <>
                {/* Profile Photo */}
                <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 relative border-4 border-gray-50 shadow-md">
                      <Image 
                        src={imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80"} 
                        alt="Profile"
                        fill
                        className={`object-cover ${isUploading ? 'opacity-50' : ''}`}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform"
                    >
                      <Upload size={14} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Professional Photo</h4>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Recommended: 400x400px</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-primary hover:underline">Update</button>
                      <span className="text-gray-300">•</span>
                      <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                    </div>
                  </div>
                </div>

                {/* Professional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                      <Stethoscope size={14} className="text-primary" />
                      Specialization
                    </label>
                    <input 
                      type="text" 
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-semibold text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                      <IndianRupee size={14} className="text-primary" />
                      Consultation Fee (₹)
                    </label>
                    <input 
                      type="number" 
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-semibold text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={14} className="text-primary" />
                      Professional Biography
                    </label>
                    <textarea 
                      rows={5}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-semibold resize-none text-gray-900"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "Account Details" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      First Name
                    </label>
                    <input type="text" defaultValue={clerkUser?.firstName || ""} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-semibold cursor-not-allowed" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      Last Name
                    </label>
                    <input type="text" defaultValue={clerkUser?.lastName || ""} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-semibold cursor-not-allowed" disabled />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Mail size={14} className="text-primary" />
                      Email Address
                    </label>
                    <input type="email" defaultValue={clerkUser?.primaryEmailAddress?.emailAddress || ""} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-semibold cursor-not-allowed" disabled />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                  <Lock className="text-blue-600 shrink-0" size={18} />
                  <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                    Basic account info is synced with your secure Clerk Auth account. Please visit your Clerk dashboard to change your email or name.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-6">
                {[
                  { title: "Appointment Requests", desc: "Receive email when a patient books a new slot.", active: true },
                  { title: "Weekly Summary", desc: "Get a performance report of your clinic every Monday.", active: false },
                  { title: "Direct Messages", desc: "Notification for patient queries and chat messages.", active: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.active} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="pt-6 border-t border-gray-50 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70 active:scale-95"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : saved ? (
                  <>
                    <CheckCircle2 size={18} />
                    Settings Saved
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

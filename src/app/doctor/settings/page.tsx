"use client";

import { useState } from "react";
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
  Camera
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function DoctorSettingsPage() {
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 text-sm">Manage your professional profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { name: "Professional Profile", icon: Stethoscope, active: true },
            { name: "Account Details", icon: User, active: false },
            { name: "Security", icon: Shield, active: false },
            { name: "Notifications", icon: Bell, active: false },
          ].map((item) => (
            <button 
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.active 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-500 hover:bg-white hover:text-gray-900"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
            {/* Profile Photo */}
            <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 relative border-4 border-gray-50">
                  <Image 
                    src={user?.imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80"} 
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Your Professional Photo</h4>
                <p className="text-xs text-gray-500 mt-1">This will be displayed on your public profile.</p>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs font-bold text-primary hover:underline">Update Photo</button>
                  <span className="text-gray-300">•</span>
                  <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Stethoscope size={14} />
                  Specialization
                </label>
                <input 
                  type="text" 
                  defaultValue="Cardiologist"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee size={14} />
                  Consultation Fee
                </label>
                <input 
                  type="number" 
                  defaultValue="800"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={14} />
                  Professional Biography
                </label>
                <textarea 
                  rows={5}
                  defaultValue="Senior specialist with over 15 years of experience in clinical medicine and healthcare management."
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium resize-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70 active:scale-95"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : saved ? (
                  <>
                    <CheckCircle2 size={18} />
                    Changes Saved
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
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

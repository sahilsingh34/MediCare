"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { convertToDoctor, uploadDoctorPhoto } from "@/actions/doctors";
import { 
  Stethoscope, 
  IndianRupee, 
  FileText, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  HeartPulse,
  Camera,
  Upload,
  X
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function DoctorRegisterPage() {
  const { user: clerkUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(clerkUser?.imageUrl || "");
  const [uploadedUrl, setUploadedUrl] = useState(clerkUser?.imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to Supabase
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadDoctorPhoto(formData);
    if (result.success && result.url) {
      setUploadedUrl(result.url);
    } else {
      setError(result.error || "Failed to upload photo.");
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const details = {
      specialization: formData.get("specialization") as string,
      fees: Number(formData.get("fees")),
      bio: formData.get("bio") as string,
      imageUrl: uploadedUrl
    };

    const result = await convertToDoctor(details);

    if (result.success) {
      router.push("/doctor/dashboard");
    } else {
      setError(result.error || "Failed to register as doctor.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-2 mb-10 group">
        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <HeartPulse size={24} />
        </div>
        <span className="text-xl font-bold text-gray-900">MediCare</span>
      </Link>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 relative z-50">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Professional Profile</h1>
          <p className="text-gray-600 font-medium text-sm">Join our network of world-class healthcare providers.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <X size={16} className="text-red-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-50">
          
          {/* Left Column: Photo & Basic Info */}
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-semibold text-gray-700 mb-4 self-start flex items-center gap-2">
                <Camera size={16} className="text-primary" />
                Professional Photo
              </label>
              
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-gray-50 shadow-lg relative bg-gray-100 flex items-center justify-center">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Doctor Preview" 
                      className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                    />
                  ) : (
                    <Upload className="text-gray-300" size={40} />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg border-2 border-white hover:scale-110 transition-transform">
                  <Upload size={20} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <p className="text-[10px] text-gray-400 mt-4 text-center px-4 italic font-medium">
                Tip: Use a clear professional headshot with a clean background.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Stethoscope size={16} className="text-primary" />
                Specialization
              </label>
              <input 
                name="specialization"
                type="text" 
                required
                autoFocus
                placeholder="e.g. Cardiologist, Dentist"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm bg-white text-gray-900 placeholder:text-gray-400 cursor-text"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <IndianRupee size={16} className="text-primary" />
                Consultation Fee (₹)
              </label>
              <input 
                name="fees"
                type="number" 
                required
                placeholder="e.g. 500"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm bg-white text-gray-900 placeholder:text-gray-400 cursor-text"
              />
            </div>
          </div>

          {/* Right Column: Bio & Submit */}
          <div className="flex flex-col">
            <div className="flex-1 mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Professional Bio
              </label>
              <textarea 
                name="bio"
                required
                placeholder="Briefly describe your experience, education, and clinical expertise. This will be shown to patients."
                className="w-full h-[320px] px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm resize-none bg-white text-gray-900 placeholder:text-gray-400 cursor-text"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || isUploading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-auto"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Complete Registration <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          By completing your registration, you confirm that all provided information is accurate and you agree to our professional terms.
        </p>
      </div>
    </div>
  );
}

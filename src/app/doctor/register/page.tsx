"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { convertToDoctor } from "@/actions/doctors";
import { 
  Stethoscope, 
  IndianRupee, 
  FileText, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  HeartPulse,
  Camera,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function DoctorRegisterPage() {
  const { user: clerkUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(clerkUser?.imageUrl || "");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const details = {
      specialization: formData.get("specialization") as string,
      fees: Number(formData.get("fees")),
      bio: formData.get("bio") as string,
      imageUrl: imageUrl
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
          <p className="text-gray-500 text-sm">Join our network of world-class healthcare providers.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} className="rotate-45" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-50">
          
          {/* Left Column: Photo & Basic Info */}
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-semibold text-gray-700 mb-4 self-start flex items-center gap-2">
                <Camera size={16} className="text-primary" />
                Profile Photo
              </label>
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-gray-50 shadow-inner bg-gray-100">
                  <img 
                    src={imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80"} 
                    alt="Doctor Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                  <Camera size={16} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-3 text-center">Using your Clerk profile photo by default</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <LinkIcon size={16} className="text-primary" />
                Custom Image URL (Optional)
              </label>
              <input 
                type="text" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm bg-white cursor-text"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Stethoscope size={16} className="text-primary" />
                Specialization
              </label>
              <input 
                name="specialization"
                type="text" 
                required
                autoFocus
                placeholder="e.g. Cardiologist, Dentist"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm bg-white cursor-text"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IndianRupee size={16} className="text-primary" />
                Consultation Fee (₹)
              </label>
              <input 
                name="fees"
                type="number" 
                required
                placeholder="e.g. 500"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm bg-white cursor-text"
              />
            </div>
          </div>

          {/* Right Column: Bio & Submit */}
          <div className="flex flex-col">
            <div className="flex-1 mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Professional Bio
              </label>
              <textarea 
                name="bio"
                required
                placeholder="Briefly describe your experience, education, and clinical expertise. This will be shown to patients."
                className="w-full h-[280px] px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm resize-none bg-white cursor-text"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
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

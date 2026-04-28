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
  HeartPulse
} from "lucide-react";
import Link from "next/link";

export default function DoctorRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 relative z-50">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join as a Doctor</h1>
          <p className="text-gray-500 text-sm">Fill in your professional details to access the doctor dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} className="rotate-45" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-50">
          <div className="relative">
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

          <div className="relative">
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

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              Professional Bio
            </label>
            <textarea 
              name="bio"
              required
              rows={4}
              placeholder="Briefly describe your experience and expertise..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm resize-none bg-white cursor-text"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Register as Doctor <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          By registering, you agree to our terms of professional conduct.
        </p>
      </div>
    </div>
  );
}

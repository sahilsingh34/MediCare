import { currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  MapPin, 
  Phone,
  Camera,
  Edit,
  Activity,
  Heart,
  FileText,
  Stethoscope,
  IndianRupee,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DoctorProfilePage() {
  const user = await currentUser();
  if (!user) return null;

  const supabase = getSupabaseAdmin();
  const { data: doctor } = await (supabase as any)
    .from("doctors")
    .select(`
      *,
      users (
        name,
        email,
        image_url
      )
    `)
    .eq("user_id", (await (supabase as any).from("users").select("id").eq("clerk_id", user.id).single()).data?.id)
    .single();

  const stats = [
    { label: "Total Patients", value: "1.2k+", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Experience", value: "12 Yrs", icon: Calendar, color: "text-green-500", bg: "bg-green-50" },
    { label: "Rating", value: "4.9", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Reviews", value: "850+", icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header / Banner */}
      <div className="relative h-32 md:h-48 bg-gradient-to-r from-primary to-blue-400 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg mx-2 md:mx-0">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      </div>

      {/* Profile Info Card */}
      <div className="relative -mt-16 md:-mt-24 px-4 md:px-8">
        <div className="bg-white rounded-[2rem] md:rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-center text-center md:text-left">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-3xl overflow-hidden border-4 border-white shadow-lg relative bg-gray-100">
              <Image 
                src={doctor?.image_url || user.imageUrl} 
                alt={doctor?.users?.name || user.fullName || "Doctor"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{doctor?.users?.name || user.fullName}</h1>
                <p className="text-primary font-bold flex items-center gap-2 mb-2 text-sm md:text-base">
                  <Stethoscope size={18} />
                  {doctor?.specialization || "General Physician"}
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium flex items-center gap-2 break-all justify-center md:justify-start">
                  <Mail size={16} className="shrink-0" />
                  {doctor?.users?.email || user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <Link href="/doctor/settings" className="w-full md:w-auto bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-gray-200 flex items-center justify-center gap-2">
                <Edit size={16} />
                Edit Profile
              </Link>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
              <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100 flex items-center gap-1.5 uppercase tracking-widest">
                <Shield size={12} />
                Verified Specialist
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100 flex items-center gap-1.5 uppercase tracking-widest">
                ₹{doctor?.fees || 0} Consultation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">{stat.label}</p>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bio & Professional Info */}
      <div className="space-y-6 px-2">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          Professional Biography
        </h3>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm leading-relaxed text-gray-600">
          {doctor?.bio || "No professional biography provided yet. Please update your profile in settings."}
        </div>
      </div>
    </div>
  );
}

function Users(props: any) {
  return <User {...props} />
}

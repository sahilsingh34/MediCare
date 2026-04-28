import { currentUser } from "@clerk/nextjs/server";
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
  FileText
} from "lucide-react";
import Image from "next/image";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) return null;

  const stats = [
    { label: "Blood Group", value: "B+", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
    { label: "Height", value: "175 cm", icon: User, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Weight", value: "72 kg", icon: Activity, color: "text-green-500", bg: "bg-green-50" },
    { label: "Last Checkup", value: "12 Oct", icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header / Banner */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-blue-400 rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
        <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md transition-all border border-white/20 flex items-center gap-2">
          <Camera size={18} />
          Change Cover
        </button>
      </div>

      {/* Profile Info Card */}
      <div className="relative -mt-24 px-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg relative bg-gray-100">
              <Image 
                src={user.imageUrl} 
                alt={user.fullName || "User"}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
              <Camera size={16} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.fullName}</h1>
                <p className="text-gray-500 font-medium flex items-center gap-2">
                  <Mail size={16} />
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-gray-200 flex items-center gap-2">
                <Edit size={16} />
                Edit Profile
              </button>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100 flex items-center gap-1.5">
                <Shield size={12} />
                VERIFIED PATIENT
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1.5">
                <Heart size={12} />
                PREMIUM MEMBER
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-medium text-gray-400 mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Detailed Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Personal Details
          </h3>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4 shadow-sm">
            {[
              { label: "Phone Number", value: "+91 98765-43210", icon: Phone },
              { label: "Location", value: "New Delhi, India", icon: MapPin },
              { label: "Date of Birth", value: "January 15, 1995", icon: Calendar },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-2 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            Medical Information
          </h3>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4 shadow-sm">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Allergies</h4>
              <p className="text-sm text-gray-700 font-medium">Penicillin, Peanuts</p>
            </div>
            <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100">
              <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Ongoing Medications</h4>
              <p className="text-sm text-gray-700 font-medium">Multivitamins, Omega-3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

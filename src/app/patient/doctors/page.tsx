import { Search, MapPin, Star, Heart, Calendar } from "lucide-react";
import { getDoctors } from "@/actions/doctors";
import { syncUserToDatabase } from "@/actions/user";
import BookAppointmentButton from "./BookAppointmentButton";

export default async function DoctorsPage() {
  // Ensure user is synced
  await syncUserToDatabase();

  const allDoctors = await getDoctors() as any[];

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Doctors</h2>
        <p className="text-gray-500">Browse and book appointments with top specialists.</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm border border-gray-100">
        <div className="flex-1 flex items-center gap-3 px-4 py-2 border border-gray-100 rounded-xl w-full bg-gray-50 focus-within:bg-white focus-within:border-primary/30 transition-colors">
          <Search size={18} className="text-gray-400" />
          <input type="text" placeholder="Search doctors, specialties..." className="w-full text-sm focus:outline-none bg-transparent text-gray-900" />
        </div>
        <div className="flex-1 flex items-center gap-3 px-4 py-2 border border-gray-100 rounded-xl w-full bg-gray-50 focus-within:bg-white focus-within:border-primary/30 transition-colors">
          <MapPin size={18} className="text-gray-400" />
          <input type="text" placeholder="Location" className="w-full text-sm focus:outline-none bg-transparent text-gray-900" />
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-8 py-2.5 rounded-xl text-sm font-medium transition-colors w-full md:w-auto">
          Search
        </button>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allDoctors.map((doc: any) => (
          <div key={doc.id} className="premium-card group hover:border-primary/20 border border-transparent overflow-hidden">
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img src={doc.users.image_url || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80'} alt={doc.users.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-white transition-colors">
                <Heart size={16} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900">{doc.users.name}</h4>
                <div className="flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-yellow-50 px-2 py-1 rounded-md">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  4.9
                </div>
              </div>
              <p className="text-xs text-primary font-medium mb-3">{doc.specialization}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                <div>
                  <p className="text-[10px] text-gray-500 mb-0.5">Consultation Fee</p>
                  <p className="text-sm font-bold text-gray-900">₹{doc.fees}</p>
                </div>
                <BookAppointmentButton doctorId={doc.id} doctorName={doc.users.name} fee={doc.fees} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

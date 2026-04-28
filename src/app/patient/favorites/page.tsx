import { getFavorites } from "@/actions/favorites";
import { 
  Heart, 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  ArrowRight,
  HeartPulse,
  Stethoscope
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function FavoritesPage() {
  const favorites = await getFavorites() as any[];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Favorite Doctors</h1>
          <p className="text-gray-500 text-sm">Quickly access the healthcare professionals you trust most.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
            <Heart size={40} fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
          <p className="text-gray-500 max-w-sm mb-8">You haven't saved any doctors yet. Heart your favorite profiles to see them here!</p>
          <Link href="/patient/doctors" className="bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/20 flex items-center gap-2">
            <Search size={18} />
            Explore Doctors
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((doctor) => (
            <div key={doctor.id} className="premium-card bg-white border border-gray-50 overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-48">
                <Image 
                  src={doctor.users?.image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"} 
                  alt={doctor.users?.name || "Doctor"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-light mb-1">{doctor.specialization}</p>
                  <h3 className="text-lg font-bold">Dr. {doctor.users?.name}</h3>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 text-red-500">
                    <Heart size={20} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold">4.9 (120+ Reviews)</span>
                  </div>
                  <p className="text-sm font-bold text-primary">₹{doctor.fees}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Clock size={14} />
                    <span>Next Available: Tomorrow, 10:00 AM</span>
                  </div>
                </div>

                <Link 
                  href={`/patient/doctors/${doctor.id}`}
                  className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Book Appointment
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

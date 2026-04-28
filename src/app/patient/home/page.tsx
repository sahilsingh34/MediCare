import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  Video, 
  Activity, 
  Star,
  ChevronRight,
  Heart,
  Smile
} from "lucide-react";
import { getDoctors } from "@/actions/doctors";

export default async function PatientHome() {
  const topDoctors = await getDoctors() as any[];

  const specialties = [
    { name: "Cardiologist", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
    { name: "Dermatologist", icon: Search, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Gynecologist", icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Pediatrician", icon: Smile, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Orthopedic", icon: Activity, color: "text-green-500", bg: "bg-green-50" },
    { name: "Neurologist", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Dentist", icon: Activity, color: "text-cyan-500", bg: "bg-cyan-50" },
  ];

  return (
    <div className="space-y-10 pb-20 md:pb-0">
      {/* Hero Search Banner */}
      <div className="relative rounded-[2rem] overflow-hidden bg-primary px-8 py-12 flex items-center justify-between shadow-lg shadow-primary/20">
        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Find the right doctor <br/> for your health
          </h2>
          <p className="text-primary-light mb-8 text-sm">
            Book appointments with top specialists in your area.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-xl shadow-black/5">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-gray-100 w-full">
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search by specialty, doctor..." className="w-full text-sm focus:outline-none text-gray-900" />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-gray-100 w-full">
              <MapPin size={18} className="text-gray-400" />
              <input type="text" placeholder="Location" defaultValue="New Delhi, India" className="w-full text-sm focus:outline-none text-gray-900" />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
              <Calendar size={18} className="text-gray-400" />
              <input type="text" placeholder="Select Date" className="w-full text-sm focus:outline-none text-gray-900" />
            </div>
            <Link href="/patient/doctors" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors w-full md:w-auto text-center">
              Search
            </Link>
          </div>
        </div>
        
        {/* Background Image/Graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block opacity-90 mix-blend-luminosity">
           <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80" alt="Doctor" className="w-full h-full object-cover object-top mask-image-gradient-l" />
        </div>
        {/* Decorative circle */}
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Find Doctors", desc: "Browse by specialty", icon: Stethoscope, color: "text-blue-600", link: "/patient/doctors" },
          { title: "Book Appointment", desc: "Choose date & time", icon: Calendar, color: "text-green-600", link: "/patient/doctors" },
          { title: "My Appointments", desc: "View status & history", icon: Video, color: "text-purple-600", link: "/patient/appointments" },
          { title: "My Profile", desc: "Manage your health details", icon: Heart, color: "text-rose-600", link: "/patient/profile" },
        ].map((item, idx) => (
          <Link href={item.link} key={idx} className="premium-card p-5 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer border border-gray-50">
            <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 ${item.color}`}>
              <item.icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
            <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Top Doctors */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-gray-900">Top Doctors</h3>
          <Link href="/patient/doctors" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all doctors <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {topDoctors.slice(0, 4).map((doc: any) => (
            <div key={doc.id} className="premium-card group hover:border-primary/20 border border-transparent overflow-hidden">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img src={doc.users.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'} alt={doc.users.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-white transition-colors">
                  <Heart size={16} />
                </button>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-gray-900 mb-1">{doc.users.name}</h4>
                <p className="text-xs text-gray-500 mb-3">{doc.specialization}</p>
                
                <div className="flex items-center gap-1 text-[11px] font-medium text-gray-700 mb-4">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  4.9 <span className="text-gray-400 font-normal">(124 reviews)</span>
                </div>
                
                <div className="text-xs font-medium text-gray-900 mb-4">
                  ₹{doc.fees} <span className="text-gray-500 font-normal">Consultation Fee</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                  <Link href="/patient/doctors" className="w-full text-center bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors px-3 py-1.5 rounded-lg font-medium">
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-gray-900">Browse by Specialties</h3>
          <Link href="/patient/specialties" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        
        <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {specialties.map((spec, idx) => (
            <Link href="/patient/specialties" key={idx} className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group">
              <div className={`w-16 h-16 rounded-2xl ${spec.bg} ${spec.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">
                  {idx === 0 ? '❤️' : idx === 1 ? '🧬' : idx === 2 ? '🤰' : idx === 3 ? '👶' : idx === 4 ? '🦴' : idx === 5 ? '🧠' : '🦷'}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-700">{spec.name}</span>
            </Link>
          ))}
          <Link href="/patient/specialties" className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group">
             <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-300">
                <span className="font-bold">More</span>
             </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

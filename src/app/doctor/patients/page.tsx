import { getDoctorAppointments } from "@/actions/appointments";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  MessageSquare
} from "lucide-react";
import Image from "next/image";

export default async function DoctorPatientsPage() {
  const appointments = await getDoctorAppointments();

  // Get unique patients from appointments
  const patientsMap = new Map();
  appointments.forEach(app => {
    if (app.users && !patientsMap.has(app.users.id)) {
      patientsMap.set(app.users.id, {
        ...app.users,
        lastVisit: app.date,
        totalVisits: appointments.filter(a => a.patient_id === app.users.id).length
      });
    }
  });

  const uniquePatients = Array.from(patientsMap.values());

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-500 text-sm">Manage your patient database and view their consultation history.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm w-64 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {uniquePatients.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
            <Users size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Patients Yet</h3>
          <p className="text-gray-500 max-w-sm">When patients book appointments with you, they will be automatically added to your list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniquePatients.map((patient: any) => (
            <div key={patient.id} className="premium-card bg-white p-6 border border-gray-50 hover:border-primary/20 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 relative border border-gray-100">
                    <Image 
                      src={patient.image_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} 
                      alt={patient.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{patient.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Mail size={12} /> {patient.email}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold border border-blue-100 uppercase">
                        {patient.totalVisits} {patient.totalVisits === 1 ? 'Visit' : 'Visits'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-900">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Last Visit</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Gender</p>
                  <p className="text-sm font-semibold text-gray-900">Male</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-primary/5 hover:bg-primary text-primary hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                  <Calendar size={14} />
                  Book Again
                </button>
                <button className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

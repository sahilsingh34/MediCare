import { getPatientAppointments } from "@/actions/appointments";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  MoreVertical,
  CheckCircle2,
  Clock3,
  XCircle,
  Stethoscope
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function AppointmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm">Manage your upcoming consultations and check their status.</p>
        </div>
        <Link href="/patient/doctors" className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2 w-fit active:scale-95">
          <Stethoscope size={18} />
          Book New Appointment
        </Link>
      </div>

      <Suspense fallback={<AppointmentsSkeleton />}>
        <AppointmentsList />
      </Suspense>
    </div>
  );
}

async function AppointmentsList() {
  const appointments = await getPatientAppointments() as any[];
  const upcomingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'accepted');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-50 text-green-600 border-green-100';
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 size={14} />;
      case 'pending': return <Clock3 size={14} />;
      case 'rejected': return <XCircle size={14} />;
      default: return null;
    }
  };

  if (upcomingAppointments.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center flex flex-col items-center animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
          <Calendar size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Appointments</h3>
        <p className="text-gray-500 max-w-sm mb-8">You don't have any appointments scheduled at the moment. Find a doctor and book your first visit!</p>
        <Link href="/patient/doctors" className="text-primary font-bold hover:underline">Find a Doctor Now</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      {upcomingAppointments.map((app) => (
        <div key={app.id} className="premium-card bg-white p-6 border border-gray-50 hover:border-primary/20 transition-all group active:scale-[0.99]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 relative shadow-sm">
                <Image 
                  src={app.doctors?.users?.image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80"} 
                  alt={app.doctors?.users?.name || "Doctor"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{app.doctors?.users?.name}</h3>
                <p className="text-sm text-gray-500">{app.doctors?.specialization}</p>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border mt-2 ${getStatusColor(app.status)}`}>
                  {getStatusIcon(app.status)}
                  {app.status.toUpperCase()}
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-900 p-1">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Date</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Time</p>
                <p className="text-sm font-semibold text-gray-900">{app.time}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95">
              Reschedule
            </button>
            <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95">
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-64 bg-gray-50 rounded-3xl border border-gray-100"></div>
      ))}
    </div>
  );
}

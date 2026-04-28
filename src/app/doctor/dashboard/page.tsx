import Image from "next/image";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  FileText, 
  CheckCircle, 
  CheckSquare,
  Plus,
  ArrowRight,
  Clock,
  Users,
  User,
  BarChart2
} from "lucide-react";
import { getDoctorAppointments } from "@/actions/appointments";
import AppointmentsTable from "./AppointmentsTable";
import { syncUserToDatabase } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function DoctorDashboard() {
  const user = await syncUserToDatabase();
  
  if (!user || user.role !== 'doctor') {
    redirect("/doctor/register");
  }

  const appointments = await getDoctorAppointments() as any[];

  // Real-time stat calculations
  const stats = [
    { 
      label: "Total Appointments", 
      value: appointments.length, 
      change: "+5% this week", 
      icon: CalendarIcon, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Pending Requests", 
      value: appointments.filter(a => a.status === 'pending').length, 
      change: "Action required", 
      icon: FileText, 
      color: "text-purple-500", 
      bg: "bg-purple-50" 
    },
    { 
      label: "Accepted", 
      value: appointments.filter(a => a.status === 'accepted').length, 
      change: "Upcoming visits", 
      icon: CheckCircle, 
      color: "text-green-500", 
      bg: "bg-green-50" 
    },
    { 
      label: "Completed", 
      value: appointments.filter(a => a.status === 'completed').length, 
      change: "Last 30 days", 
      icon: CheckSquare, 
      color: "text-orange-500", 
      bg: "bg-orange-50" 
    },
  ];

  const schedule = [
    { time: "09:00 AM - 10:00 AM", status: "Available" },
    { time: "10:00 AM - 11:00 AM", status: "Available" },
    { time: "11:00 AM - 12:00 PM", status: "Available" },
    { time: "01:00 PM - 02:00 PM", status: "Available" },
    { time: "02:00 PM - 03:00 PM", status: "Available" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main Left Column */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="premium-card p-5 border border-white">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{String(stat.value).padStart(2, '0')}</h3>
              <p className={`text-[10px] font-medium ${stat.label === 'Pending Requests' && stat.value > 0 ? 'text-rose-500' : 'text-green-600'}`}>
                 {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="premium-card bg-white overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">Upcoming Appointments</h3>
            <Link href="/doctor/appointments" className="text-xs font-bold text-primary hover:underline">
              Manage All
            </Link>
          </div>
          
          <div className="p-2">
             <AppointmentsTable initialAppointments={appointments} />
          </div>
          
          <div className="p-4 border-t border-gray-50 text-center flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span>Live data from MediCare Sync</span>
            <Link href="/doctor/appointments" className="text-primary hover:underline flex items-center gap-1">
              FULL HISTORY <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        
        {/* Today's Schedule */}
        <div className="premium-card bg-white p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Today&apos;s Availability</h3>
            <Link href="/doctor/schedule" className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1">
              <Plus size={14} /> Add Slot
            </Link>
          </div>
          
          <div className="space-y-3">
            {schedule.map((slot, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-primary" />
                  <span className="text-sm font-medium text-gray-700">{slot.time}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                  slot.status === 'Available' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
          
          <Link href="/doctor/schedule" className="w-full mt-4 py-2 text-xs font-bold text-primary hover:underline flex justify-center items-center gap-1 uppercase tracking-wider">
            Edit Full Schedule <ArrowRight size={14} />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="premium-card bg-white p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarIcon, label: "My Schedule", bg: "bg-blue-50", color: "text-blue-600", link: "/doctor/schedule" },
              { icon: Users, label: "View Patients", bg: "bg-purple-50", color: "text-purple-600", link: "/doctor/patients" },
              { icon: User, label: "My Profile", bg: "bg-green-50", color: "text-green-600", link: "/doctor/settings" },
              { icon: BarChart2, label: "Settings", bg: "bg-orange-50", color: "text-orange-600", link: "/doctor/settings" },
            ].map((action, idx) => (
              <Link href={action.link} key={idx} className={`${action.bg} rounded-xl p-4 flex flex-col items-center justify-center text-center hover:opacity-80 transition-opacity border border-transparent hover:border-primary/20`}>
                <action.icon size={20} className={`${action.color} mb-2`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${action.color}`}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

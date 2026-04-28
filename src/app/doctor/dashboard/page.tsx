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

export default async function DoctorDashboard() {
  const appointments = await getDoctorAppointments();

  const stats = [
    { label: "Total Appointments", value: appointments.length, change: "+12% from yesterday", icon: CalendarIcon, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Pending Requests", value: appointments.filter(a => a.status === 'pending').length, change: "+8% from yesterday", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Confirmed", value: appointments.filter(a => a.status === 'confirmed').length, change: "+15% from yesterday", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { label: "Completed", value: appointments.filter(a => a.status === 'completed').length, change: "+20% from yesterday", icon: CheckSquare, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const schedule = [
    { time: "09:00 AM - 10:00 AM", status: "Available" },
    { time: "10:00 AM - 11:00 AM", status: "Booked" },
    { time: "11:00 AM - 12:00 PM", status: "Booked" },
    { time: "01:00 PM - 02:00 PM", status: "Booked" },
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
              <p className="text-gray-500 text-xs font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{String(stat.value).padStart(2, '0')}</h3>
              <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                ↑ {stat.change.split(' ')[0]} <span className="text-gray-400 font-normal">{stat.change.split(' ').slice(1).join(' ')}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="premium-card bg-white overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">Upcoming Appointments</h3>
            <button className="text-sm font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              View All
            </button>
          </div>
          
          <div className="px-5 pt-4">
            <div className="flex gap-6 border-b border-gray-100">
              <div className="pb-3 text-sm font-medium transition-colors relative text-primary">
                All
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
              </div>
            </div>
          </div>

          <div className="p-2">
             <AppointmentsTable initialAppointments={appointments} />
          </div>
          
          <div className="p-4 border-t border-gray-50 text-center flex justify-between items-center text-xs text-gray-500">
            <span>Showing all latest appointments</span>
            <Link href="/doctor/appointments" className="font-medium text-primary hover:underline flex items-center gap-1">
              View History <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        
        {/* Today's Schedule */}
        <div className="premium-card bg-white p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Today&apos;s Schedule</h3>
            <Link href="/doctor/schedule" className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-sm">
              <Plus size={14} /> Add Slot
            </Link>
          </div>
          
          <div className="space-y-3">
            {schedule.map((slot, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
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
          
          <Link href="/doctor/schedule" className="w-full mt-4 py-2 text-sm font-medium text-primary hover:underline flex justify-center items-center gap-1">
            View Full Schedule <ArrowRight size={14} />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="premium-card bg-white p-5">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarIcon, label: "My Schedule", bg: "bg-blue-50", color: "text-blue-600", link: "/doctor/schedule" },
              { icon: Users, label: "View Patients", bg: "bg-purple-50", color: "text-purple-600", link: "/doctor/patients" },
              { icon: User, label: "My Profile", bg: "bg-green-50", color: "text-green-600", link: "/doctor/profile" },
              { icon: BarChart2, label: "Settings", bg: "bg-orange-50", color: "text-orange-600", link: "/doctor/settings" },
            ].map((action, idx) => (
              <Link href={action.link} key={idx} className={`${action.bg} rounded-xl p-4 flex flex-col items-center justify-center text-center hover:opacity-80 transition-opacity border border-transparent hover:border-${action.color.split('-')[1]}-200`}>
                <action.icon size={20} className={`${action.color} mb-2`} />
                <span className={`text-[11px] font-semibold ${action.color}`}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import { getDoctorAppointments } from "@/actions/appointments";
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  Clock3,
  MoreVertical,
  Check,
  X,
  Stethoscope
} from "lucide-react";
import AppointmentsTable from "../dashboard/AppointmentsTable";

export default async function DoctorAppointmentsPage() {
  const appointments = await getDoctorAppointments() as any[];

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
          <p className="text-gray-500 text-sm">Accept, reject, or complete your patient consultations.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm text-sm font-medium text-gray-600 flex items-center gap-2">
            <Calendar size={16} />
            Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
            <Calendar size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Appointments Yet</h3>
          <p className="text-gray-500 max-w-sm">When patients book consultations with you, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm p-4 md:p-6">
          <AppointmentsTable initialAppointments={appointments} />
        </div>
      )}
    </div>
  );
}

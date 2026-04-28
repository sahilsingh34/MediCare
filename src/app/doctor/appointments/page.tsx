import { getDoctorAppointments, updateAppointmentStatus } from "@/actions/appointments";
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
import Image from "next/image";
import { revalidatePath } from "next/cache";

export default async function DoctorAppointmentsPage() {
  const appointments = await getDoctorAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50 border-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
          <p className="text-gray-500 text-sm">Accept, reject, or complete your patient consultations.</p>
        </div>
        <div className="flex gap-2">
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
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative border border-gray-100">
                          <Image 
                            src={app.users?.image_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
                            alt={app.users?.name || "Patient"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{app.users?.name}</p>
                          <p className="text-[10px] text-gray-500">{app.users?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {app.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(app.status)}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <form action={async () => {
                            "use server";
                            await updateAppointmentStatus(app.id, 'accepted');
                            revalidatePath("/doctor/appointments");
                          }}>
                            <button className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                              <Check size={16} />
                            </button>
                          </form>
                          <form action={async () => {
                            "use server";
                            await updateAppointmentStatus(app.id, 'rejected');
                            revalidatePath("/doctor/appointments");
                          }}>
                            <button className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                              <X size={16} />
                            </button>
                          </form>
                        </div>
                      ) : app.status === 'accepted' ? (
                        <form action={async () => {
                          "use server";
                          await updateAppointmentStatus(app.id, 'completed');
                          revalidatePath("/doctor/appointments");
                        }}>
                          <button className="text-xs font-bold text-primary hover:underline">Mark as Completed</button>
                        </form>
                      ) : (
                        <button className="text-gray-400">
                          <MoreVertical size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

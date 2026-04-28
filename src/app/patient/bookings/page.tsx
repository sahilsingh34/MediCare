import { getPatientAppointments } from "@/actions/appointments";
import { 
  Calendar, 
  Clock, 
  CheckCircle2,
  Clock3,
  XCircle,
  Stethoscope,
  ChevronRight,
  History
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function BookingsPage() {
  const appointments = await getPatientAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Booking History</h1>
          <p className="text-gray-500 text-sm">Review your previous requests and consultation history.</p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
            <History size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No History Yet</h3>
          <p className="text-gray-500 max-w-sm mb-8">You haven't made any booking requests yet. Your journey to better health starts here!</p>
          <Link href="/patient/doctors" className="bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/20">Book Your First Doctor</Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fees</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative">
                          <Image 
                            src={app.doctors?.users?.image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80"} 
                            alt={app.doctors?.users?.name || "Doctor"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">Dr. {app.doctors?.users?.name}</p>
                          <p className="text-[10px] text-gray-500">{app.doctors?.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-xs text-gray-400">{app.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(app.status)}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ₹{app.doctors?.fees}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-primary transition-colors">
                        <ChevronRight size={20} />
                      </button>
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

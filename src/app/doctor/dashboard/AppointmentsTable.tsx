"use client";

import { useState } from "react";
import { Check, X, Clock, Loader2, Mail, Calendar } from "lucide-react";
import { updateAppointmentStatus } from "@/actions/appointments";

export default function AppointmentsTable({ initialAppointments }: { initialAppointments: any[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: "accepted" | "rejected" | "completed") => {
    setLoadingId(id);
    const result = await updateAppointmentStatus(id, status);
    
    if (result.success) {
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: result.data.status } : app
      ));
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-400">
              <th className="pb-4 font-medium pl-2">Patient</th>
              <th className="pb-4 font-medium">Date & Time</th>
              <th className="pb-4 font-medium">Reason</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <img src={apt.users.image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} alt={apt.users.name} className="w-8 h-8 rounded-full bg-gray-100 object-cover" />
                      <div>
                        <p className="font-semibold text-gray-900">{apt.users.name}</p>
                        <p className="text-xs text-gray-500">{apt.users.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{apt.date}</span>
                      <span className="text-xs flex items-center gap-1 text-primary mt-0.5"><Clock size={12}/> {apt.time}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600 truncate max-w-[150px]">
                    Consultation
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex inline-flex items-center gap-1 w-fit
                      ${apt.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                        apt.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'}`}
                    >
                      {apt.status === 'accepted' ? <Check size={12}/> : 
                       apt.status === 'rejected' ? <X size={12}/> : 
                       <Clock size={12}/>}
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-2">
                    <div className="flex justify-end gap-2">
                      {loadingId === apt.id ? (
                        <Loader2 size={18} className="animate-spin text-gray-400" />
                      ) : apt.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(apt.id, 'accepted')}
                            className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                            title="Accept"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(apt.id, 'rejected')}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : apt.status === 'accepted' ? (
                         <button 
                            onClick={() => handleStatusUpdate(apt.id, 'completed')}
                            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                          >
                            Mark Complete
                          </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {appointments.length === 0 ? (
          <div className="py-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
            No appointments found.
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={apt.users.image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} alt={apt.users.name} className="w-12 h-12 rounded-xl bg-gray-100 object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{apt.users.name}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-wider font-bold">
                    <Mail size={10} className="text-primary"/> {apt.users.email}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1
                  ${apt.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                    apt.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'}`}
                >
                  {apt.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Date</p>
                    <p className="text-xs font-bold text-gray-900">{apt.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Time</p>
                    <p className="text-xs font-bold text-gray-900">{apt.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {loadingId === apt.id ? (
                  <div className="flex-1 py-2 flex justify-center"><Loader2 size={18} className="animate-spin text-primary" /></div>
                ) : apt.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(apt.id, 'accepted')}
                      className="flex-1 py-2.5 rounded-xl bg-green-50 text-green-600 font-bold text-xs hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(apt.id, 'rejected')}
                      className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <X size={14} /> Reject
                    </button>
                  </>
                ) : apt.status === 'accepted' ? (
                   <button 
                      onClick={() => handleStatusUpdate(apt.id, 'completed')}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      Mark as Completed
                    </button>
                ) : (
                  <button disabled className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-400 font-bold text-xs">
                    Appointment Closed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

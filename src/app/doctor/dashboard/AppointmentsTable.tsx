"use client";

import { useState } from "react";
import { Check, X, Clock, Loader2 } from "lucide-react";
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
    <div className="overflow-x-auto">
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
  );
}

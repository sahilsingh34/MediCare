"use client";

import { useState, useTransition } from "react";
import { cancelAppointment, rescheduleAppointment } from "@/actions/appointments";
import { Loader2, Calendar, Clock, X } from "lucide-react";

interface AppointmentActionsProps {
  appointmentId: string;
}

export default function AppointmentActions({ appointmentId }: AppointmentActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      startTransition(async () => {
        const result = await cancelAppointment(appointmentId);
        if (!result.success) {
          alert(result.error);
        }
      });
    }
  };

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      alert("Please select a new date and time.");
      return;
    }
    
    startTransition(async () => {
      const result = await rescheduleAppointment(appointmentId, newDate, newTime);
      if (result.success) {
        setShowReschedule(false);
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <div className="w-full">
      <div className="mt-6 flex gap-3">
        <button 
          onClick={() => setShowReschedule(true)}
          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Reschedule
        </button>
        <button 
          onClick={handleCancel}
          disabled={isPending}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : "Cancel"}
        </button>
      </div>

      {showReschedule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Reschedule</h3>
              <button onClick={() => setShowReschedule(false)} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">New Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">New Time</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => {
                       // Simple conversion or keep as 24h
                       setNewTime(e.target.value);
                    }}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowReschedule(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl text-sm font-bold transition-all"
                >
                  Go Back
                </button>
                <button 
                  onClick={handleReschedule}
                  disabled={isPending}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, X, CheckCircle2, Loader2 } from "lucide-react";
import { bookAppointment } from "@/actions/appointments";

export default function BookAppointmentButton({ doctorId, doctorName, fee }: { doctorId: string, doctorName: string, fee: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleBook = async () => {
    if (!date || !time) {
      setError("Please select both a date and time.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    const result = await bookAppointment(doctorId, date, time, reason || "General Checkup");
    
    setIsSubmitting(false);
    
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setDate("");
        setTime("");
        setReason("");
      }, 3000);
    } else {
      setError(result.error || "Failed to book appointment.");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary/10 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
      >
        Book Appointment
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Book Appointment</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:bg-gray-100 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h4>
                  <p className="text-sm text-gray-500">Your appointment with {doctorName} has been requested successfully.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-sm">{doctorName}</h5>
                      <p className="text-xs text-gray-500">Consultation Fee: ₹{fee}</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Select Date</label>
                    <input 
                      type="date" 
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
                            time === t 
                              ? "bg-primary text-white border-primary" 
                              : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Reason for visit (Optional)</label>
                    <textarea 
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. General checkup, fever, etc."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {!isSuccess && (
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBook}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex justify-center items-center gap-2 active:scale-95"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

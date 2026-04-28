"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X as CloseIcon, Calendar as CalendarIcon, Clock as ClockIcon, CheckCircle2 as SuccessIcon, Loader2 as SpinnerIcon, Stethoscope } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMinDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20 active:scale-95"
      >
        Book Appointment
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">New Appointment</h3>
                <p className="text-xs text-gray-500 font-medium">Request a consultation slot</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-2xl flex items-center justify-center transition-all active:scale-90"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-90 duration-500">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                    <SuccessIcon size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Confirmed!</h4>
                  <p className="text-sm text-gray-500 leading-relaxed px-4">
                    Your appointment with <strong>{doctorName}</strong> has been scheduled successfully.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-primary/5 p-5 rounded-3xl border border-primary/10 flex items-center gap-4">
                    <div className="w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center shadow-sm">
                      <CalendarIcon size={28} />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900">{doctorName}</h5>
                      <p className="text-xs text-primary font-bold tracking-wider uppercase mt-0.5">₹{fee} Consultation</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 animate-in shake-in">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <CalendarIcon size={14} className="text-primary" />
                      Select Date
                    </label>
                    <input 
                      type="date" 
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ClockIcon size={14} className="text-primary" />
                      Available Slots
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                            time === t 
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                              : "bg-white text-gray-600 border-gray-100 hover:border-primary/30 hover:bg-primary/5"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <SpinnerIcon size={14} className="text-primary" />
                      Note for Doctor
                    </label>
                    <textarea 
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Symptoms or reason for visit..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            {!isSuccess && (
              <div className="p-6 border-t border-gray-50 bg-white flex gap-4">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBook}
                  disabled={isSubmitting}
                  className="flex-[2] bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-4 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-primary/25 flex justify-center items-center gap-2 active:scale-95"
                >
                  {isSubmitting ? <SpinnerIcon size={18} className="animate-spin" /> : "Confirm Slot"}
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

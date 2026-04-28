"use client";

import { useState, useEffect } from "react";
import { 
  Clock, 
  Plus, 
  Trash2, 
  Calendar,
  AlertCircle,
  Save,
  Check,
  Loader2,
  X
} from "lucide-react";

export default function DoctorSchedulePage() {
  const [slots, setSlots] = useState([
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ]);

  const [activeDays, setActiveDays] = useState([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSlot, setNewSlot] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day: string) => {
    setActiveDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const removeSlot = (slot: string) => {
    setSlots(prev => prev.filter(s => s !== slot));
  };

  const addSlot = () => {
    if (newSlot && !slots.includes(newSlot)) {
      // Sort slots after adding (rough sort)
      const updated = [...slots, newSlot].sort((a, b) => {
        const timeA = new Date(`2000/01/01 ${a}`).getTime();
        const timeB = new Date(`2000/01/01 ${b}`).getTime();
        return timeA - timeB;
      });
      setSlots(updated);
      setNewSlot("");
      setIsAdding(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
          <p className="text-gray-500 text-sm">Set your available hours for patient appointments.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : saved ? (
            <Check size={18} />
          ) : (
            <Save size={18} />
          )}
          {saved ? "Schedule Saved!" : "Save Schedule"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Days Column */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            Working Days
          </h3>
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-3">
            {days.map((day) => (
              <label 
                key={day} 
                onClick={() => toggleDay(day)}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                  activeDays.includes(day) 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-transparent border-transparent hover:bg-gray-50"
                } group`}
              >
                <span className={`text-sm font-bold ${activeDays.includes(day) ? "text-primary" : "text-gray-600"}`}>{day}</span>
                <div className="relative inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={activeDays.includes(day)} 
                    onChange={() => {}} // Controlled by label click
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
            ))}
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex gap-3">
            <AlertCircle className="text-yellow-600 shrink-0" size={20} />
            <p className="text-xs text-yellow-700 leading-relaxed font-medium">
              Changes will apply to all future weeks. Patients can only book during these active days.
            </p>
          </div>
        </div>

        {/* Time Slots Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            Active Time Slots
          </h3>
          <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-sm min-h-[400px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {slots.map((slot) => (
                <div key={slot} className="relative group animate-in zoom-in-95 duration-200">
                  <div className="p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                    <span className="text-sm font-extrabold text-gray-900 group-hover:text-primary">{slot}</span>
                    <span className="text-[9px] text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                      <Check size={8} /> ACTIVE
                    </span>
                  </div>
                  <button 
                    onClick={() => removeSlot(slot)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-xl flex items-center justify-center border border-gray-100 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-500 hover:text-white active:scale-90"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              {isAdding ? (
                <div className="p-4 border-2 border-primary border-dashed rounded-[1.5rem] flex flex-col gap-2 animate-in slide-in-from-top-2">
                  <input 
                    type="time" 
                    value={newSlot}
                    onChange={(e) => {
                      // Convert 24h to 12h for consistency
                      const [h, m] = e.target.value.split(':');
                      const hh = parseInt(h);
                      const ampm = hh >= 12 ? 'PM' : 'AM';
                      const hour = hh % 12 || 12;
                      const formatted = `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
                      setNewSlot(formatted);
                    }}
                    className="w-full text-xs font-bold p-1 rounded-lg border-none focus:ring-0 bg-transparent"
                  />
                  <div className="flex gap-1">
                    <button onClick={addSlot} className="flex-1 bg-primary text-white p-1 rounded-lg text-[10px] font-bold">Add</button>
                    <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 text-gray-400 p-1 rounded-lg text-[10px] font-bold">
                      <X size={12} className="mx-auto" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="p-5 border-2 border-dashed border-gray-100 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all text-gray-400 hover:text-primary group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Plus size={20} />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Add Slot</span>
                </button>
              )}
            </div>

            {slots.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[2rem] flex items-center justify-center mb-6">
                  <Clock size={40} />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">No Active Slots</h4>
                <p className="text-sm text-gray-500 max-w-xs">Add time slots to let patients know when you're available for consultations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

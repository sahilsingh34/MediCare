import { 
  Clock, 
  Plus, 
  Trash2, 
  Calendar,
  AlertCircle,
  Save,
  Check
} from "lucide-react";

export default function DoctorSchedulePage() {
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
          <p className="text-gray-500 text-sm">Set your available hours for patient appointments.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Save size={18} />
          Save Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Days Column */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            Working Days
          </h3>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            {days.map((day) => (
              <label key={day} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{day}</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={day !== "Saturday"} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
            ))}
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex gap-3">
            <AlertCircle className="text-yellow-600 shrink-0" size={20} />
            <p className="text-xs text-yellow-700 leading-relaxed">
              Patients can only book during these days. Changes will apply to all future weeks.
            </p>
          </div>
        </div>

        {/* Time Slots Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            Active Time Slots
          </h3>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeSlots.map((slot) => (
                <div key={slot} className="relative group">
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary">{slot}</span>
                    <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                      <Check size={10} /> ACTIVE
                    </span>
                  </div>
                  <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-lg flex items-center justify-center border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button className="p-4 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all text-gray-400 hover:text-primary">
                <Plus size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Add Slot</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

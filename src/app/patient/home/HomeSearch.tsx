"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar } from "lucide-react";

export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("New Delhi, India");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (location) params.append("location", location);
    router.push(`/patient/doctors?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 flex flex-col lg:flex-row items-center gap-1 md:gap-2 shadow-2xl shadow-black/10 border border-white/50 backdrop-blur-sm mt-8 max-w-[95%] sm:max-w-none">
      <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-gray-100 w-full group">
        <Search size={20} className="text-primary/40 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Specialty, doctor..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-sm font-semibold focus:outline-none text-gray-900 placeholder:text-gray-400 placeholder:font-normal" 
        />
      </div>
      
      <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-gray-100 w-full group">
        <MapPin size={20} className="text-primary/40 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Location" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full text-sm font-semibold focus:outline-none text-gray-900 placeholder:text-gray-400 placeholder:font-normal" 
        />
      </div>
      
      <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full group">
        <Calendar size={20} className="text-primary/40 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Any Date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onFocus={(e) => e.target.type = 'date'}
          onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }}
          className="w-full text-sm font-semibold focus:outline-none text-gray-900 placeholder:text-gray-400 placeholder:font-normal" 
        />
      </div>
      
      <button 
        onClick={handleSearch}
        className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-2xl text-sm font-extrabold transition-all w-full lg:w-auto shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95"
      >
        Search
      </button>
    </div>
  );
}

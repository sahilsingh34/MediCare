"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.push(`/patient/doctors?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm border border-gray-100">
      <div className="flex-1 flex items-center gap-3 px-4 py-2 border border-gray-100 rounded-xl w-full bg-gray-50 focus-within:bg-white focus-within:border-primary/30 transition-colors">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search doctors, specialties..." 
          className="w-full text-sm focus:outline-none bg-transparent text-gray-900" 
        />
      </div>
      <div className="flex-1 flex items-center gap-3 px-4 py-2 border border-gray-100 rounded-xl w-full bg-gray-50 focus-within:bg-white focus-within:border-primary/30 transition-colors">
        <MapPin size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Location" 
          className="w-full text-sm focus:outline-none bg-transparent text-gray-900" 
        />
      </div>
      <button className="bg-primary hover:bg-primary-hover text-white px-8 py-2.5 rounded-xl text-sm font-medium transition-colors w-full md:w-auto">
        Search
      </button>
    </div>
  );
}

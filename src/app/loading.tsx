"use client";

import { Loader2, HeartPulse } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center animate-pulse">
          <HeartPulse size={40} className="text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2">
          <Loader2 size={24} className="text-primary animate-spin" />
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-1">MediCare</h2>
        <p className="text-sm text-gray-500 font-medium animate-pulse">Optimizing your health experience...</p>
      </div>
    </div>
  );
}

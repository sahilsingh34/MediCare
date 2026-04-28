"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toggleFavorite } from "@/actions/favorites";

export default function FavoriteButton({ 
  doctorId, 
  initialIsFavorite 
}: { 
  doctorId: string, 
  initialIsFavorite: boolean 
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    setIsPending(true);
    const result = await toggleFavorite(doctorId);
    if (result.success) {
      setIsFavorite(result.isFavorite || false);
    }
    setIsPending(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`absolute top-3 right-3 w-10 h-10 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all shadow-lg border ${
        isFavorite 
          ? "bg-rose-500 text-white border-rose-400" 
          : "bg-white/80 text-gray-400 border-white/50 hover:text-rose-500 hover:bg-white"
      } active:scale-90 disabled:opacity-70`}
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
      )}
    </button>
  );
}

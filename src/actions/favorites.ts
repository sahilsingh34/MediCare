"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { syncUserToDatabase } from "./user";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(doctorId: string) {
  const user = await syncUserToDatabase();
  if (!user) return { success: false, error: "User not authenticated." };

  const supabase = getSupabaseAdmin();

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("doctor_id", doctorId)
    .single();

  if (existing) {
    // Remove if exists
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);
    
    if (error) return { success: false, error: error.message };
  } else {
    // Add if doesn't exist
    const { error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        doctor_id: doctorId
      });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/patient/doctors");
  revalidatePath("/patient/favorites");
  return { success: true, isFavorite: !existing };
}

export async function getFavorites() {
  const user = await syncUserToDatabase();
  if (!user) return [];

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("favorites")
    .select(`
      id,
      doctor_id,
      doctors (
        *,
        users (name, image_url)
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error("Fetch favorites error:", error);
    return [];
  }

  return data.map(f => f.doctors);
}

"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { syncUserToDatabase } from "./user";

export async function bookAppointment(doctorId: string, date: string, time: string, reason: string) {
  const user = await syncUserToDatabase();
  if (!user) return { success: false, error: "User not authenticated or synced." };

  const supabase = getSupabaseAdmin();

  const { data, error } = await (supabase as any)
    .from("appointments")
    .insert({
      patient_id: user.id,
      doctor_id: doctorId,
      date: date,
      time: time,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    console.error("Booking error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getPatientAppointments() {
  const user = await syncUserToDatabase();
  if (!user) return [];

  const supabase = getSupabaseAdmin();
  
  const { data, error } = await (supabase as any)
    .from("appointments")
    .select(`
      *,
      doctors (
        *,
        users (name, image_url)
      )
    `)
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch patient appointments error:", error);
    return [];
  }

  return data;
}

export async function getDoctorAppointments() {
  const user = await syncUserToDatabase();
  if (!user) return [];

  const supabase = getSupabaseAdmin();
  
  // First, get the doctor ID for this user
  const { data: doctor } = await (supabase as any)
    .from("doctors")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!doctor) return [];

  const { data, error } = await (supabase as any)
    .from("appointments")
    .select(`
      *,
      users!appointments_patient_id_fkey (name, image_url, email)
    `)
    .eq("doctor_id", doctor.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch doctor appointments error:", error);
    return [];
  }

  return data;
}

export async function updateAppointmentStatus(appointmentId: string, status: "accepted" | "rejected" | "completed") {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await (supabase as any)
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)
    .select()
    .single();

  if (error) {
    console.error("Update appointment error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

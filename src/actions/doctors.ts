"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export async function getDoctors() {
  const supabase = getSupabaseAdmin();
  
  // Try to seed if empty
  const { data: check } = await supabase.from("doctors").select("id").limit(1);
  if (!check || check.length === 0) {
    await seedDoctorsIfEmpty(supabase);
  }

  const { data: doctors, error } = await supabase
    .from("doctors")
    .select(`
      *,
      users (
        name,
        image_url,
        email
      )
    `);

  if (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }

  return doctors;
}

async function seedDoctorsIfEmpty(supabase: any) {
  const dummyDoctors = [
    { clerk_id: "dummy_doc_1", role: "doctor", name: "Dr. Ananya Sharma", email: "ananya@medicare.local", image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80" },
    { clerk_id: "dummy_doc_2", role: "doctor", name: "Dr. Rohan Verma", email: "rohan@medicare.local", image_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80" },
    { clerk_id: "dummy_doc_3", role: "doctor", name: "Dr. Neha Kapoor", email: "neha@medicare.local", image_url: "https://images.unsplash.com/photo-1594824436998-d40df9f00028?auto=format&fit=crop&w=300&q=80" },
    { clerk_id: "dummy_doc_4", role: "doctor", name: "Dr. Amit Desai", email: "amit@medicare.local", image_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80" }
  ];

  for (const doc of dummyDoctors) {
    const { data: user } = await supabase.from("users").insert(doc).select().single();
    if (user) {
      const specialties = ["Cardiologist", "Dermatologist", "Gynecologist", "General Physician"];
      const fees = [800, 700, 800, 500];
      const locations = ["New Delhi, India", "Mumbai, India", "New Delhi, India", "Bangalore, India"];
      const index = dummyDoctors.indexOf(doc);

      await supabase.from("doctors").insert({
        user_id: user.id,
        specialization: specialties[index],
        fees: fees[index],
        bio: `Experienced specialist dedicated to providing the best care.`
      });
    }
  }
}
export async function convertToDoctor(details: { specialization: string; fees: number; bio: string; imageUrl?: string }) {
  const user = await syncUserToDatabase();
  if (!user) return { success: false, error: "User not authenticated." };

  const supabase = getSupabaseAdmin();

  // 1. Update user role in 'users' table
  const { error: userError } = await supabase
    .from("users")
    .update({ role: "doctor" })
    .eq("id", user.id);

  if (userError) return { success: false, error: userError.message };

  // 2. Create doctor profile in 'doctors' table
  const { error: doctorError } = await supabase
    .from("doctors")
    .upsert({
      user_id: user.id,
      specialization: details.specialization,
      fees: details.fees,
      bio: details.bio,
      image_url: details.imageUrl
    });

  if (doctorError) return { success: false, error: doctorError.message };

  return { success: true };
}

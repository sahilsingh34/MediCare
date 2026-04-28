"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { syncUserToDatabase } from "./user";
import { revalidatePath } from "next/cache";

export async function uploadDoctorPhoto(formData: FormData) {
  try {
    const user = await syncUserToDatabase();
    if (!user) return { success: false, error: "User not authenticated. Please log in again." };

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided." };

    const supabase = getSupabaseAdmin();
    
    // Ensure bucket exists
    console.log("Checking storage bucket 'doctor-profiles'...");
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("doctor-profiles");
    
    if (bucketError && bucketError.message.includes("not found")) {
      console.log("Bucket not found, creating 'doctor-profiles'...");
      const { error: createError } = await supabase.storage.createBucket("doctor-profiles", {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      if (createError) throw new Error(`Bucket creation failed: ${createError.message}`);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Uploading file to Supabase:", filePath);
    const { data, error } = await (supabase as any).storage
      .from("doctor-profiles")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return { success: false, error: `Storage upload failed: ${error.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("doctor-profiles")
      .getPublicUrl(filePath);

    console.log("Upload successful:", publicUrl);
    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error("Global upload action error:", err);
    return { success: false, error: err.message || "An unexpected server error occurred during upload." };
  }
}


export async function getDoctors(query?: string) {
  const supabase = getSupabaseAdmin();
  
  let fetcher = (supabase as any)
    .from("doctors")
    .select(`
      *,
      users (
        name,
        image_url,
        email
      )
    `);

  if (query) {
    fetcher = fetcher.or(`specialization.ilike.%${query}%,users.name.ilike.%${query}%`);
  }

  const { data: doctors, error } = await fetcher.order('created_at', { ascending: false });

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
    const { data: user } = await (supabase as any).from("users").insert(doc).select().single();
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

  // 1. Update user role and prepend 'Dr.' to name in 'users' table
  let doctorName = user.name;
  if (!doctorName.startsWith("Dr.")) {
    doctorName = `Dr. ${doctorName}`;
  }

  const { error: userError } = await (supabase as any)
    .from("users")
    .update({ 
      role: "doctor",
      name: doctorName,
      image_url: details.imageUrl
    })
    .eq("id", user.id);

  if (userError) return { success: false, error: userError.message };

  // 2. Create doctor profile in 'doctors' table
  const { error: doctorError } = await (supabase as any)
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

export async function updateDoctorProfile(details: { specialization?: string; fees?: number; bio?: string; image_url?: string }) {
  const user = await syncUserToDatabase();
  if (!user) return { success: false, error: "User not authenticated." };

  const supabase = getSupabaseAdmin();

  const { error } = await (supabase as any)
    .from("doctors")
    .update(details)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  // Also update the main users table if image_url changed
  if (details.image_url) {
    await (supabase as any)
      .from("users")
      .update({ image_url: details.image_url })
      .eq("id", user.id);
  }

  revalidatePath("/doctor/profile");
  revalidatePath("/doctor/settings");
  revalidatePath("/patient/doctors");
  
  return { success: true };
}


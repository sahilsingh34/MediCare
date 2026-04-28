"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUserToDatabase() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const supabase = getSupabaseAdmin();

  // Check if user exists
  const { data: existingUser } = await (supabase as any)
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  if (!existingUser) {
    // Check if email matches our hardcoded doctors, otherwise default to patient
    // For MVP, we'll let people become doctors by updating publicMetadata or manually
    const role = clerkUser.publicMetadata?.role === "doctor" ? "doctor" : "patient";
    
    // Insert user
    const { data: newUser, error } = await (supabase as any)
      .from("users")
      .insert({
        clerk_id: clerkUser.id,
        role: role,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown User',
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        image_url: clerkUser.imageUrl
      })
      .select()
      .single();

    if (error) {
      console.error("Error syncing user:", error);
      return null;
    }
    return newUser as any;
  }

  return existingUser as any;
}

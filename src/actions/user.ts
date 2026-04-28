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

  // Upsert user (Insert if new, Update if exists)
  const role = clerkUser.publicMetadata?.role === "doctor" ? "doctor" : "patient";
  
  const { data: user, error } = await (supabase as any)
    .from("users")
    .upsert({
      clerk_id: clerkUser.id,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown User',
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      image_url: clerkUser.imageUrl,
      // We only set role on initial creation or if it's already set to doctor
      role: existingUser?.role || role
    }, {
      onConflict: 'clerk_id'
    })
    .select()
    .single();

  if (error) {
    console.error("Error syncing user:", error);
    return existingUser || null;
  }

  return user as any;
}

import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import type { Member, Registration } from "./AppContext";

const BUCKET = "hackspirit";

export type CloudReg = Registration; // shape matches

function rowToReg(r: Database["public"]["Tables"]["registrations"]["Row"]): Registration {
  return {
    id: r.id,
    timestamp: r.created_at,
    teamName: r.team_name,
    teamSize: r.team_size,
    totalFee: r.total_fee,
    members: r.members as Member[],
    paymentScreenshotBase64: r.payment_screenshot_url || "",
    transactionId: r.transaction_id || "",
    status: r.status as "pending" | "verified",
  };
}

export async function uploadToBucket(file: Blob | File, path: string): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: (file as File).type || "application/octet-stream",
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createRegistration(input: {
  teamName: string;
  teamSize: number;
  totalFee: number;
  members: Member[];
  screenshotUrl: string;
  transactionId: string;
}): Promise<Registration> {
  const { data, error } = await supabase
    .from("registrations")
    .insert({
      team_name: input.teamName,
      team_size: input.teamSize,
      total_fee: input.totalFee,
      members: input.members as unknown as Json,
      payment_screenshot_url: input.screenshotUrl,
      transaction_id: input.transactionId,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return rowToReg(data);
}

export async function fetchAllRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToReg);
}

export async function toggleRegistrationStatus(id: string, next: "pending" | "verified") {
  const { error } = await supabase.from("registrations").update({ status: next }).eq("id", id);
  if (error) throw error;
}

export async function deleteAllRegistrations() {
  const { error } = await supabase
    .from("registrations")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw error;
}

export async function teamNameExists(name: string): Promise<boolean> {
  const { data } = await supabase
    .from("registrations")
    .select("id")
    .ilike("team_name", name.trim())
    .limit(1);
  return !!(data && data.length);
}

export type EventSettings = {
  problem_statement_url: string | null;
  problem_statement_uploaded_at: string | null;
  gallery_urls: (string | null)[];
  registration_open: boolean;
};

export async function fetchSettings(): Promise<EventSettings> {
  const { data } = await supabase.from("event_settings").select("*").eq("id", 1).maybeSingle();
  return {
    problem_statement_url: data?.problem_statement_url ?? null,
    problem_statement_uploaded_at: data?.problem_statement_uploaded_at ?? null,
    gallery_urls: Array.isArray(data?.gallery_urls)
      ? data.gallery_urls.map((item) => (typeof item === "string" ? item : null))
      : [null, null, null],
    registration_open: data?.registration_open ?? true,
  };
}

export async function saveProblemStatement(url: string | null) {
  const { error } = await supabase.from("event_settings").upsert({
    id: 1,
    problem_statement_url: url,
    problem_statement_uploaded_at: url ? new Date().toISOString() : null,
  });
  if (error) throw error;
}

export async function saveGalleryUrls(urls: (string | null)[]) {
  const { error } = await supabase.from("event_settings").upsert({
    id: 1,
    gallery_urls: urls as Json,
  });
  if (error) throw error;
}

export async function toggleLiveRegistration(open: boolean) {
  const { error } = await supabase.from("event_settings").upsert({
    id: 1,
    registration_open: open,
  });
  if (error) throw error;
}

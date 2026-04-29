import { supabase } from "@/integrations/supabase/client";

export async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("חובה להיות מחובר כדי לבצע פעולה זו");
  return { Authorization: `Bearer ${token}` };
}
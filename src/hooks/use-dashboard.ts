import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listMyDocuments } from "@/server/documents.functions";
import { supabase } from "@/integrations/supabase/client";
import { getAuthHeaders } from "@/lib/auth-headers";

export function useDashboard() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      try {
        return await listMyDocuments({ headers: await getAuthHeaders() });
      } catch (error) {
        console.error("DASHBOARD_LOAD_FAILED", error);
        return {
          documents: [],
          stats: { total: 0, signed: 0, pending: 0, cancelled: 0 },
          profile: null,
        };
      }
    },
  });

  useEffect(() => {
    const channelName = `dashboard-realtime-${Math.random().toString(36).slice(2)}`;
    const channel = supabase.channel(channelName);
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "documents" },
      () => qc.invalidateQueries({ queryKey: ["dashboard"] }),
    );
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "recipients" },
      () => qc.invalidateQueries({ queryKey: ["dashboard"] }),
    );
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return query;
}
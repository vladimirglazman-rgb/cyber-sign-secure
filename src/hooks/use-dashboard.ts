import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listMyDocuments } from "@/server/documents.functions";
import { supabase } from "@/integrations/supabase/client";

export function useDashboard() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => listMyDocuments(),
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
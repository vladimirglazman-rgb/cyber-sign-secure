import { useQuery } from "@tanstack/react-query";
import { listMyDocuments } from "@/server/documents.functions";
import { getAuthHeaders } from "@/lib/auth-headers";

export function useDashboard() {
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
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  return query;
}
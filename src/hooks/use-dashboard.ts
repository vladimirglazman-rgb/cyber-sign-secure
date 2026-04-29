import { useQuery } from "@tanstack/react-query";
import { listMyDocuments } from "@/server/documents.functions";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => listMyDocuments(),
  });
}
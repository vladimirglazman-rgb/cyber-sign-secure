import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/mnit/TopBar";
import { Workspace } from "@/components/mnit/Workspace";
export const Route = createFileRoute("/_authenticated/")({ component: Dashboard });
function Dashboard() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mt-4"><Workspace /></main>
    </div>
  );
}

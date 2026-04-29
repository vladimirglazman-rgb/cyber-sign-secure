import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/_authenticated")({ component: AuthenticatedLayout });
function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
      if (!session) navigate({ to: "/auth" });
    });
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session); setReady(true);
      if (!data.session) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);
  if (!ready || !authed) {
    return <div className="flex min-h-screen items-center justify-center"><div className="font-display text-xs uppercase tracking-[0.3em] text-primary text-glow">טוען…</div></div>;
  }
  return <Outlet />;
}

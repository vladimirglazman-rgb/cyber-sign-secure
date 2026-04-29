import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MNIT Sign — חתימה דיגיטלית מאובטחת" },
      { name: "description", content: "פלטפורמת חתימה דיגיטלית עתידנית לפרילנסרים — מאובטחת, מהירה ומקצועית." },
      { name: "author", content: "MNIT" },
      { property: "og:title", content: "MNIT Sign — חתימה דיגיטלית מאובטחת" },
      { property: "og:description", content: "פלטפורמת חתימה דיגיטלית עתידנית לפרילנסרים — מאובטחת, מהירה ומקצועית." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@MNITSign" },
      { name: "twitter:title", content: "MNIT Sign — חתימה דיגיטלית מאובטחת" },
      { name: "twitter:description", content: "פלטפורמת חתימה דיגיטלית עתידנית לפרילנסרים — מאובטחת, מהירה ומקצועית." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/10edd029-b9b8-40ab-9e01-17fbc7a1ccf2/id-preview-fac2c980--a6ced882-7d67-405c-9a37-beedfecb62c6.lovable.app-1777498354934.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/10edd029-b9b8-40ab-9e01-17fbc7a1ccf2/id-preview-fac2c980--a6ced882-7d67-405c-9a37-beedfecb62c6.lovable.app-1777498354934.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="font-body">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

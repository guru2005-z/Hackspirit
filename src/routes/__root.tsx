import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProvider } from "../lib/AppContext";
import { IntroAnimation } from "../components/hackspirit/IntroAnimation";
import { AnimatedBackground } from "../components/hackspirit/AnimatedBackground";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted">Something went wrong.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn-outline">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HACKSPIRIT 2K26 — IEEE Student Branch Hackathon" },
      {
        name: "description",
        content:
          "HACKSPIRIT 2K26 — 6-hour college hackathon by IEEE Student Branch, NBKRIST. Code. Create. Elevate.",
      },
      { property: "og:title", content: "HACKSPIRIT 2K26" },
      {
        property: "og:description",
        content: "IEEE Student Branch Hackathon — Code. Create. Elevate.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("hackspirit_intro_seen")) {
      setShowIntro(true);
      sessionStorage.setItem("hackspirit_intro_seen", "true");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AnimatedBackground />
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <AnimatePresence>
          {showIntro && <IntroAnimation onDone={() => setShowIntro(false)} />}
        </AnimatePresence>
        <div id="app-content">
          <Outlet />
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#12121A",
              color: "#fff",
              border: "1px solid rgba(124,58,237,0.3)",
            },
          }}
        />
      </AppProvider>
    </QueryClientProvider>
  );
}
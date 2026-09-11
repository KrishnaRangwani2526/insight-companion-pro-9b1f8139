import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProvider } from "@/lib/store";
import { registerPwa } from "@/lib/register-pwa";
import { TranslationProvider } from "@/lib/translation";

function NotFoundComponent() {
  return (
    <div className="page-glow flex min-h-screen items-center justify-center bg-background px-5">
      <div className="frost-card w-full max-w-md p-8 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-warn-soft text-3xl">⏳</span>
        <h1 className="mt-4 text-[22px] leading-tight font-bold">Upcoming feature</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          This part of Kalaa Setu is still being built. It will arrive in a coming update — everything else in the app
          works today.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground"
          >
            Go to my dashboard
          </Link>
          <Link
            to="/products"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-surface-2 px-5 text-[15px] font-semibold ring-1 ring-line"
          >
            My products
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
    <div className="page-glow flex min-h-screen items-center justify-center bg-background px-4">
      <div className="frost-card max-w-md p-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-surface-2 px-5 text-sm font-semibold ring-1 ring-line"
          >
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
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Kalaa Setu — Digital business partner for rural artisans" },
      {
        name: "description",
        content:
          "AI-powered app for rural artisans and micro-businesses: catalogue, pricing, finance, marketing and a one-tap online store.",
      },
      { name: "theme-color", content: "#eef4fa" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Kalaa Setu" },
      { property: "og:title", content: "Kalaa Setu — Digital business partner for rural artisans" },
      {
        property: "og:description",
        content: "Catalogue, pricing, finance, marketing and your own online store — in your language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
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

  useEffect(() => {
    registerPwa().catch(() => {});
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TranslationProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <Toaster position="top-center" />
        </TranslationProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

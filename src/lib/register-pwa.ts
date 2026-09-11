import { registerSW } from "virtual:pwa-register";

const APP_WORKER_PATH = "/sw.js";

function isAppWorker(registration: ServiceWorkerRegistration) {
  return [registration.active, registration.installing, registration.waiting].some((worker) =>
    worker?.scriptURL.endsWith(APP_WORKER_PATH),
  );
}

async function unregisterAppWorker() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.filter(isAppWorker).map((registration) => registration.unregister()));
}

export async function registerPwa() {
  if (!("serviceWorker" in navigator)) return;

  const { hostname, search } = window.location;
  const isPreview =
    window.self !== window.top ||
    hostname.startsWith("id-preview--") ||
    hostname.startsWith("preview--") ||
    hostname === "lovableproject.com" ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "lovableproject-dev.com" ||
    hostname.endsWith(".lovableproject-dev.com") ||
    hostname === "beta.lovable.dev" ||
    hostname.endsWith(".beta.lovable.dev");

  if (!import.meta.env.PROD || isPreview || new URLSearchParams(search).get("sw") === "off") {
    await unregisterAppWorker();
    return;
  }

  registerSW({ immediate: true });
}
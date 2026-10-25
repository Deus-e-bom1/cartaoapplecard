// UTMify tracking (Meta Ads attribution). Browser-only: call loadUtmifyScripts()
// from a useEffect. No-banner consent route: scripts are blocked for visitors
// in regions that require tracking consent (EEA, UK, Switzerland) and whenever
// the visitor's region cannot be determined.

const UTMIFY_PIXEL_ID = "6adbfa6c4fbb219edb316dac";

declare global {
  interface Window {
    pixelId?: string;
  }
}

const CONSENT_REGIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE", "GB", "CH",
]);

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

async function detectCountry(): Promise<string | null> {
  // Cloudflare (Lovable) exposes the country via /cdn-cgi/trace.
  const trace = await fetchWithTimeout("/cdn-cgi/trace", 2000);
  if (trace) {
    const text = await trace.text();
    const match = text.match(/^loc=([A-Z0-9]{2})$/m);
    if (match?.[1]) return match[1];
  }
  // Other hosts (e.g. Vercel) expose it through the app's own region route.
  const region = await fetchWithTimeout("/api/region", 2000);
  if (region) {
    const data = (await region.json().catch(() => null)) as { country?: unknown } | null;
    if (typeof data?.country === "string" && /^[A-Z0-9]{2}$/.test(data.country)) {
      return data.country;
    }
  }
  return null;
}

function injectScript(src: string, attributes: Record<string, string> = {}) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.defer = true;
  for (const [name, value] of Object.entries(attributes)) {
    script.setAttribute(name, value);
  }
  (document.head || document.documentElement).appendChild(script);
}

export async function loadUtmifyScripts() {
  if (typeof window === "undefined") return;

  const country = await detectCountry();
  // Unknown region (null), Tor (T1), or a consent region: do not load tracking.
  if (!country || country === "T1" || CONSENT_REGIONS.has(country)) return;

  window.pixelId = UTMIFY_PIXEL_ID;
  injectScript("https://cdn.utmify.com.br/scripts/pixel/pixel.js");
  injectScript("https://cdn.utmify.com.br/scripts/utms/latest.js", {
    "data-utmify-prevent-xcod-sck": "",
    "data-utmify-prevent-subids": "",
  });
}

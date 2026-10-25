import { createFileRoute } from "@tanstack/react-router";

// Returns the visitor's country code from the hosting platform's geo headers
// (Vercel: x-vercel-ip-country, Cloudflare: cf-ipcountry). Used by the UTMify
// loader to apply the no-banner consent route when /cdn-cgi/trace is not
// available (e.g. when deployed on Vercel).
export const Route = createFileRoute("/api/region")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const country =
          request.headers.get("x-vercel-ip-country") ??
          request.headers.get("cf-ipcountry") ??
          null;
        return Response.json({ country });
      },
    },
  },
});

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  // Remote image patterns — only allow expected trusted origins
  // ---------------------------------------------------------------------------
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Security headers applied to every response
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ----------------------------------------------------------------
          // Content-Security-Policy
          // Notes on choices:
          //  - script-src 'unsafe-inline': required for Next.js inline scripts
          //    and Tailwind CSS-in-JS. Remove and add nonces once Next supports
          //    per-request nonces end-to-end.
          //  - style-src 'unsafe-inline': required by Tailwind and inline
          //    style props used throughout the app.
          //  - img-src: allows Unsplash, Supabase storage, and data: URIs
          //    (used by Three.js textures / SVG grain).
          //  - connect-src: allows Stripe JS, Supabase REST/Realtime, and
          //    same-origin API calls.
          //  - frame-src: Stripe 3DS iframe hosted on js.stripe.com.
          //  - worker-src blob:: required by Three.js / R3F WebGL workers.
          // ----------------------------------------------------------------
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
              "font-src 'self' data:",
              "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },

          // Prevent clickjacking — deny all framing
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // Prevent MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Limit referrer information sent to third parties
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // HSTS — enforce HTTPS for 1 year, include subdomains
          // (only effective once the site is on HTTPS; harmless in dev)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },

          // Restrict browser feature access
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=(self)",
            ].join(", "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

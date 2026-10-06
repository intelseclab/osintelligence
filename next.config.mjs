/** @type {import('next').NextConfig} */

// Security headers.
//
// These are declared here rather than in public/_headers because the Cloudflare
// Pages deploy ships a _worker.js (OpenNext). In that "advanced mode" Pages does
// not process _headers at all — the worker owns every response — so the rules
// have to come from Next's own routing, which the worker executes.
//
// CSP caveat: Next inlines its hydration payload (self.__next_f.push) and
// component styles, so script-src/style-src need 'unsafe-inline'. A nonce policy
// would require request-time HTML rewriting that this deploy path does not do.
// The value here is constraining where data may be sent and who may frame the
// site, not blocking injected inline script.
//
// If AdSense is enabled later (public/ads.txt already declares the publisher),
// script-src and frame-src will need pagead2.googlesyndication.com and
// googleads.g.doubleclick.net.
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join('; ')

const securityHeaders = [
  // The catalog links to breach-lookup, dark-web and people-search sites.
  // Sending the originating tool page as a Referer would disclose a visitor's
  // investigative intent to those destinations; same-origin keeps the path.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  },
  { key: 'Content-Security-Policy', value: CSP },
]

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig

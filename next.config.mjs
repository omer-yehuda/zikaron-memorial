/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Block clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // XSS filter (legacy browsers)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Control referrer info sent to external sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restrict browser feature APIs
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  // Strict Transport Security (HTTPS only, 1 year)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-eval in dev; unsafe-inline for inline styles
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Leaflet loads map tiles as images; soldier photos may come from izkor.gov.il
      "img-src 'self' data: blob: https://tiles.stadiamaps.com https://izkor.gov.il",
      // Leaflet XHR for tiles
      "connect-src 'self' https://tiles.stadiamaps.com",
      // Disallow embedding this site in iframes
      "frame-ancestors 'none'",
      // Only allow form submissions to this origin
      "form-action 'self'",
      // Prevent base-tag hijacking
      "base-uri 'self'",
    ]
      .filter(Boolean)
      .join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

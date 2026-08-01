/** @type {import('next').NextConfig} */
const nextConfig = {
  // Embedded Pages run inside a Salla dashboard iframe — allow framing from Salla.
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors https://s.salla.sa https://*.salla.sa;" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

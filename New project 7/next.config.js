/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/timer.html", destination: "/reset", permanent: true },
      { source: "/leaderboard.html", destination: "/leaderboard", permanent: true },
      { source: "/success.html", destination: "/success", permanent: true },
      { source: "/dashboard.html", destination: "/dashboard", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/terms.html", destination: "/terms", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
    ];
  },
};

module.exports = nextConfig;

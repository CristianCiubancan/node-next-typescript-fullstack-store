/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", disallow: "/order-complete" },
      { userAgent: "*", allow: "/" },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/server-sitemap.xml`,
    ],
  },
  exclude: ["/order-complete"],
};

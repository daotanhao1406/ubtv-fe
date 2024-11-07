/**
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  // !STARTERCONF Change the siteUrl
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  siteUrl: 'https://ubtv-production.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
}

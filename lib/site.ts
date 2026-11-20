/** Absolute origin that works on Vercel previews/production and locally, with no env vars to set. */
export function siteUrl(): URL {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return new URL(host ? `https://${host}` : "http://localhost:3000");
}

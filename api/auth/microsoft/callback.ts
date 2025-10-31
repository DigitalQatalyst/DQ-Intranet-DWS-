import type { VercelRequest, VercelResponse } from "@vercel/node";

function parseCookies(header?: string) {
  if (!header) return {} as Record<string, string>;
  return header.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (!key) return acc;
    const value = rest.join("=");
    try {
      acc[key] = decodeURIComponent(value);
    } catch {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, state: _state, error, error_description } = req.query as Record<string, string | undefined>;
  if (error) return res.status(400).send(`Microsoft OAuth error: ${error_description || error}`);

  const tenant = process.env.AZURE_AD_TENANT_ID!;
  const clientId = process.env.AZURE_AD_CLIENT_ID!;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET!;
  const redirectUri = process.env.OAUTH_REDIRECT_URL!;

  // Exchange code for tokens
  const tokenEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code: code || "",
    redirect_uri: redirectUri,
  });

  const tokenRes = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!tokenRes.ok) return res.status(500).send(`Token exchange failed: ${await tokenRes.text()}`);

  const tokens = await tokenRes.json() as { access_token: string };

  // Fetch user info
  const userRes = await fetch("https://graph.microsoft.com/oidc/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userRes.ok) return res.status(500).send(`Fetching userinfo failed: ${await userRes.text()}`);
  await userRes.json();

  // TODO: create/find user + set session cookie (JWT). For now, just continue.
  const cookies = parseCookies(req.headers.cookie);
  const redirectCookie = cookies["ms_redirect"];
  const redirectQuery = Array.isArray(req.query.redirect) ? req.query.redirect[0] : req.query.redirect;
  const preferredRedirect = redirectCookie || redirectQuery;
  const target =
    typeof preferredRedirect === "string" && preferredRedirect.startsWith("/")
      ? preferredRedirect
      : "/onboarding/start";

  res.setHeader("Set-Cookie", [
    "ms_state=; Path=/; Max-Age=0",
    "ms_nonce=; Path=/; Max-Age=0",
    "ms_redirect=; Path=/; Max-Age=0",
  ]);

  res.status(302).setHeader("Location", target).end();
}

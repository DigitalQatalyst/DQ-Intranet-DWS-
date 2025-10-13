import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, state, error, error_description } = req.query as Record<string, string | undefined>;
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
  const user = await userRes.json();

  // TODO: create/find user + set session cookie (JWT). For now, just continue.
  res.status(302).setHeader("Location", "/onboarding/start").end();
}

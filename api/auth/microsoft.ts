import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const tenant = process.env.AZURE_AD_TENANT_ID!;
  const clientId = process.env.AZURE_AD_CLIENT_ID!;
  const redirectUri = process.env.OAUTH_REDIRECT_URL!;
  const authorize = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;

  const state = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");
  const redirectQuery = req.query.redirect;
  const redirectTargetRaw = Array.isArray(redirectQuery) ? redirectQuery[0] : redirectQuery;
  const redirectTarget =
    typeof redirectTargetRaw === "string" && redirectTargetRaw.startsWith("/")
      ? redirectTargetRaw
      : undefined;

  const cookieHeaders = [
    `ms_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    `ms_nonce=${nonce}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  ];
  if (redirectTarget) {
    cookieHeaders.push(
      `ms_redirect=${encodeURIComponent(redirectTarget)}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );
  }

  res.setHeader("Set-Cookie", cookieHeaders);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    response_mode: "query",
    scope: "openid profile email offline_access",
    state,
    nonce,
  });

  res.status(302).setHeader("Location", `${authorize}?${params}`).end();
}

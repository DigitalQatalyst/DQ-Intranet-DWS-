type AnyRequest = {
  method?: string;
  body?: Record<string, unknown>;
  [key: string]: unknown;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: unknown) => void;
  setHeader?: (name: string, value: string) => void;
  end?: (body?: unknown) => void;
  [key: string]: unknown;
};

export default async function handler(req: AnyRequest, res: AnyResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader?.("Allow", "POST");
    res.status?.(405);
    res.json?.({ error: "Method not allowed" });
    return;
  }

  // Stub implementation: respond success so the frontend flow can progress
  res.status?.(200);
  res.json?.({ ok: true });
}

import { NextResponse } from "next/server";

interface ServiceStatus {
  name: string;
  url: string;
  ok: boolean;
  latencyMs: number;
  error?: string;
}

async function checkService(
  name: string,
  url: string
): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timeout);
    const latencyMs = Date.now() - start;

    if (!res.ok) {
      return {
        name,
        url,
        ok: false,
        latencyMs,
        error: `HTTP ${res.status} ${res.statusText}`,
      };
    }

    // Consume body to confirm full response works
    await res.json();
    return { name, url, ok: true, latencyMs };
  } catch (err) {
    return {
      name,
      url,
      ok: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export const dynamic = "force-dynamic";

export async function GET() {
  const [backend, fakeLlm] = await Promise.all([
    checkService("Backend", "http://localhost:3001/health"),
    checkService("Fake LLM", "http://localhost:3002/v1/models"),
  ]);

  const allOk = backend.ok && fakeLlm.ok;

  return NextResponse.json({
    allOk,
    services: [backend, fakeLlm],
  });
}

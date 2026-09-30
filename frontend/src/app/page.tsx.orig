"use client";

import { useEffect, useState } from "react";

interface ServiceStatus {
  name: string;
  url: string;
  ok: boolean;
  latencyMs: number;
  error?: string;
}

interface StatusResponse {
  allOk: boolean;
  services: ServiceStatus[];
}

export default function Home() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const res = await fetch("/api/status");
        if (!active) return;
        if (!res.ok) {
          setError(`Status endpoint returned ${res.status}`);
          return;
        }
        const data: StatusResponse = await res.json();
        setStatus(data);
        setError(null);
        setPollCount((c) => c + 1);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    check();
    const id = setInterval(check, 2000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const allOk = status?.allOk ?? false;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">
        Elicit Interview — Environment Check
      </h1>
      <p className="mt-2 text-gray-600">
        This checks that all services are running and ready for the interview.
      </p>

      {/* Overall banner */}
      <div
        className={`mt-6 rounded-lg p-6 text-center text-lg font-semibold ${
          allOk
            ? "border border-green-300 bg-green-100 text-green-800"
            : "border border-yellow-300 bg-yellow-50 text-yellow-800"
        }`}
      >
        {allOk
          ? "Everything is working — you're ready for the interview!"
          : "Waiting for all services to come online..."}
      </div>

      {/* Per-service status */}
      <div className="mt-6 space-y-3">
        {/* Frontend is always green if you can see this page */}
        <ServiceRow
          name="Frontend (Next.js)"
          url="http://localhost:3000"
          ok={true}
          latencyMs={null}
        />

        {(status?.services ?? []).map((svc) => (
          <ServiceRow
            key={svc.name}
            name={svc.name}
            url={svc.url}
            ok={svc.ok}
            latencyMs={svc.latencyMs}
            error={svc.error}
          />
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Fetch error: {error}
        </div>
      )}

      {/* Troubleshooting tips after a few failed polls */}
      {!allOk && pollCount > 3 && (
        <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-medium">Troubleshooting:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Make sure you ran{" "}
              <code className="rounded bg-gray-200 px-1">./build.sh</code>{" "}
              first
            </li>
            <li>
              Check the terminal running{" "}
              <code className="rounded bg-gray-200 px-1">./start.sh</code> for
              errors
            </li>
            <li>Backend should be on port 3001, Fake LLM on port 3002</li>
            <li>
              If you see &quot;ECONNREFUSED&quot;, a service hasn&apos;t started
              yet — give it a few more seconds
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}

function ServiceRow({
  name,
  url,
  ok,
  latencyMs,
  error: errorMsg,
}: {
  name: string;
  url: string;
  ok: boolean;
  latencyMs: number | null;
  error?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-md border p-4 ${
        ok ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{ok ? "\u2705" : "\u274C"}</span>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">{url}</div>
        </div>
      </div>
      <div className="text-right text-sm">
        {ok ? (
          <span className="text-green-700">
            {latencyMs !== null ? `${latencyMs}ms` : "Running"}
          </span>
        ) : (
          <span className="text-red-600">{errorMsg ?? "Not reachable"}</span>
        )}
      </div>
    </div>
  );
}

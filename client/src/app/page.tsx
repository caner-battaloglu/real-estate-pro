'use client';
import { useEffect, useState } from 'react';

// 1) Define the expected shape of the API response
type PingResponse = { message: string };

export default function Home() {
  // 2) Local UI state: what the page should display
  const [msg, setMsg] = useState<string>('Loading…');
  const [error, setError] = useState<string | null>(null);

  // 3) Side-effect: run once on mount to call the API
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/ping`;

    // 4) Fire the request, parse JSON, update UI state
    fetch(url, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<PingResponse>;
      })
      .then((data) => setMsg(data.message))
      .catch((e) => setError(e.message));
  }, []);

  // 5) Render: show error if any, else the message
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="text-center">
        {error ? (
          <p className="text-red-600 font-semibold">Error: {error}</p>
        ) : (
          <h1 className="text-3xl font-bold">{msg}</h1>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Source: {process.env.NEXT_PUBLIC_API_URL}/api/ping
        </p>
      </div>
    </main>
  );
}

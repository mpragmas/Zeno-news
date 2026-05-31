import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://newssummaryapp-api.onrender.com/api/v1';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const encoder = new TextEncoder();
  let lastKnownCount = 0;
  let isActive = true;

  const stream = new ReadableStream({
    async start(controller) {
      async function checkForUpdates() {
        if (!isActive) return;

        try {
          const res = await fetch(`${API_BASE}/stories?page=1&limit=1`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(10000),
          });

          if (res.ok) {
            const json = await res.json() as { data: { meta: { total: number } } };
            const total = json?.data?.meta?.total ?? 0;

            if (lastKnownCount === 0) {
              lastKnownCount = total;
            } else if (total > lastKnownCount) {
              const newCount = total - lastKnownCount;
              lastKnownCount = total;

              const event = `data: ${JSON.stringify({ type: 'new_stories', count: newCount })}\n\n`;
              controller.enqueue(encoder.encode(event));
            }
          }
        } catch {
          // silently ignore fetch errors in SSE
        }

        if (isActive) {
          setTimeout(checkForUpdates, 30000);
        }
      }

      // Send initial connected event
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

      // Start polling
      await checkForUpdates();
    },
    cancel() {
      isActive = false;
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

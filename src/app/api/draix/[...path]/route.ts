import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}

async function proxyRequest(req: NextRequest, pathParts: string[]) {
  const path = pathParts.join('/');
  
  // Try Hermes (8000) first, then Anzaro (3000)
  for (const port of [8000, 3000]) {
    try {
      const url = `http://localhost:${port}/${path}${req.nextUrl.search}`;
      const headers = new Headers(req.headers);
      headers.delete('host');
      const body = req.method !== 'GET' ? await req.text() : undefined;
      
      const response = await fetch(url, { method: req.method, headers, body, signal: AbortSignal.timeout(10000) });
      if (response.ok || response.status === 404) {
        const data = await response.text();
        return new NextResponse(data, { status: response.status, headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' } });
      }
    } catch {}
  }
  
  return NextResponse.json({ error: 'Backend not available' }, { status: 502 });
}

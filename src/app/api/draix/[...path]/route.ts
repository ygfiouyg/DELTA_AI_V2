import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HERMES_API = 'http://localhost:8000';

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
  const url = `${HERMES_API}/${path}${req.nextUrl.search}`;
  
  try {
    const headers = new Headers(req.headers);
    headers.delete('host');
    
    const body = req.method !== 'GET' ? await req.text() : undefined;
    
    const response = await fetch(url, {
      method: req.method,
      headers,
      body,
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Failed to connect to Hermes API', message: e.message },
      { status: 502 }
    );
  }
}

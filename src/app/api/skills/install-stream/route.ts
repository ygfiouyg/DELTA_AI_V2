import { NextRequest } from 'next/server';
import { installSkillDeep, type InstallProgress } from '@/lib/deep-skill-installer';

/**
 * POST /api/skills/install-stream
 *
 * SSE endpoint for real-time installation progress.
 * The user sees every step the backend is doing.
 *
 * Body: { search_query: string, github_url?: string }
 *
 * Returns: Server-Sent Events stream
 *   data: {"step":"init","message":"Starting...","progress":5}
 *   data: {"step":"fetch","message":"Fetching repo tree","progress":15}
 *   ...
 *   data: {"step":"done","message":"Complete","progress":100,"result":{...}}
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { search_query, github_url } = body;

    if (!search_query && !github_url) {
      return new Response(
        JSON.stringify({ error: 'search_query or github_url is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          const result = await installSkillDeep(
            search_query || '',
            github_url,
            (progress: InstallProgress) => {
              send(progress);
            }
          );

          // Send final result
          send({
            step: 'complete',
            message: result.message,
            progress: 100,
            result: {
              success: result.success,
              skillName: result.skillName,
              filesDownloaded: result.files.length,
              scriptsRegistered: result.scripts.length,
              files: result.files,
              scripts: result.scripts,
            },
          });
        } catch (error) {
          send({
            step: 'error',
            message: error instanceof Error ? error.message : 'Installation failed',
            progress: 0,
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

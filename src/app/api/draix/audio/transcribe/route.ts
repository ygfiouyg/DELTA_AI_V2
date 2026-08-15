import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const HERMES_API = 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file' }, { status: 400 });
    }

    // محاولة استخدام Hermes API للـ transcription
    try {
      const hermesFormData = new FormData();
      hermesFormData.append('audio', audioFile);

      const res = await fetch(`${HERMES_API}/api/audio/transcribe`, {
        method: 'POST',
        body: hermesFormData,
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ text: data.text || data.transcript || '' });
      }
    } catch (e: any) {
      console.log('[DrAix] Hermes transcription failed:', e.message);
    }

    // Fallback: استخدام whisper محلياً
    const tmpDir = '/tmp/draix-audio';
    await mkdir(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, `recording_${Date.now()}.webm`);

    const bytes = await audioFile.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // محاولة استخدام whisper
    try {
      const { stdout } = await execAsync(`python3 -c "
import sys
sys.path.insert(0, '/usr/local/lib/python3.11/dist-packages')
try:
    from faster_whisper import WhisperModel
    model = WhisperModel('base', device='cpu', compute_type='int8')
    segments, info = model.transcribe('${filePath}')
    text = ' '.join([seg.text for seg in segments])
    print(text)
except:
    print('')
"`, { timeout: 30000 });

      const text = stdout.trim();
      if (text) {
        return NextResponse.json({ text });
      }
    } catch (e: any) {
      console.log('[DrAix] Whisper failed:', e.message);
    }

    return NextResponse.json({ text: '', error: 'Transcription failed' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

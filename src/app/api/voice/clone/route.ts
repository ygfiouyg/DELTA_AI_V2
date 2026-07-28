/**
 * POST /api/voice/clone
 * V.102: رفع عينة صوت للمستخدم للاستنساخ (voice cloning).
 *
 * المستخدم يرفع ملف صوتي (10-30 ثانية) وبنحفظه.
 * لما يطلب TTS بصوته، بنستخدم Coqui XTTS مع العينة دي.
 *
 * GET /api/voice/clone — بيرجع معلومات العينة الصوتية (لو موجودة)
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, extractBearerToken } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VOICE_SAMPLES_DIR = path.join(process.cwd(), "voice_samples");

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request.headers.get("Authorization"));
    const user = token ? await getUserFromToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "مطلوب تسجيل الدخول" }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "ملف الصوت مطلوب" }, { status: 400 });
    }

    // اقبل صيغ مختلفة
    const allowedTypes = ["audio/webm", "audio/wav", "audio/mp3", "audio/mp4", "audio/m4a", "audio/ogg", "audio/aac"];
    const ext = audioFile.name?.split(".").pop()?.toLowerCase() || "webm";
    if (!allowedTypes.includes(audioFile.type) && !["webm", "wav", "mp3", "m4a", "ogg", "aac"].includes(ext)) {
      return NextResponse.json({ error: "صيغة الملف غير مدعومة. استخدم: webm, wav, mp3, m4a" }, { status: 400 });
    }

    // حجم الملف (حد 10MB)
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الملف كبير جداً (الحد 10MB)" }, { status: 400 });
    }

    // احفظ العينة
    await fs.mkdir(VOICE_SAMPLES_DIR, { recursive: true });
    const samplePath = path.join(VOICE_SAMPLES_DIR, `${user.id}_voice_sample.${ext}`);
    const arrayBuffer = await audioFile.arrayBuffer();
    await fs.writeFile(samplePath, Buffer.from(arrayBuffer));

    console.log(`[Voice Clone] Sample saved for user ${user.id}: ${samplePath} (${audioFile.size} bytes)`);

    return NextResponse.json({
      success: true,
      message: "تم حفظ عينة صوتك بنجاح! دلوقتي تقدر تطلب تحويل النص لصوت بصوتك.",
      samplePath,
      fileSize: audioFile.size,
      format: ext,
      instructions: "لاستخدام صوتك: اطلب 'حول النص ده لصوت بصوتي' وسيستخدم النظام عينتك.",
    });
  } catch (error: any) {
    console.error("[Voice Clone] Error:", error);
    return NextResponse.json({ error: error?.message || "خطأ" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request.headers.get("Authorization"));
    const user = token ? await getUserFromToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "مطلوب تسجيل الدخول" }, { status: 401 });
    }

    // اتأكد لو فيه عينة محفوظة
    const files = await fs.readdir(VOICE_SAMPLES_DIR).catch(() => []);
    const userSample = files.find((f) => f.startsWith(`${user.id}_voice_sample.`));

    return NextResponse.json({
      hasVoiceSample: !!userSample,
      sampleFile: userSample || null,
      instructions: userSample
        ? "عندك عينة صوتية محفوظة. اطلب 'حول النص لصوت بصوتي'"
        : "ارفع عينة صوتية (10-30 ثانية) عبر POST /api/voice/clone",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

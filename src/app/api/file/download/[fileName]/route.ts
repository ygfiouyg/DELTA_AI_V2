/**
 * GET /api/file/download/[fileName]
 * ===============================
 * V.92: ينزّل ملف من الـ DOWNLOAD_DIR.
 * بيـ serve أي ملف اتعمل من تنفيذ Python code (PDF, MP3, CSV, إلخ).
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOWNLOAD_DIR = path.join(process.cwd(), "download");

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  mp4: "video/mp4",
  webm: "video/webm",
  csv: "text/csv",
  txt: "text/plain",
  json: "application/json",
  html: "text/html",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;

    // أمان: اشيل أي ../ أو أحرف خطيرة
    const safeName = path.basename(decodeURIComponent(fileName));
    if (!safeName || safeName.includes("..") || safeName.includes("/")) {
      return NextResponse.json({ error: "اسم الملف غير صحيح" }, { status: 400 });
    }

    const filePath = path.join(DOWNLOAD_DIR, safeName);

    // اتأكد إن الملف جوه الـ DOWNLOAD_DIR (مش بره)
    if (!filePath.startsWith(DOWNLOAD_DIR)) {
      return NextResponse.json({ error: "مسار غير مسموح" }, { status: 403 });
    }

    // اقرا الملف
    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch {
      return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
    }

    // حدد الـ MIME type
    const ext = path.extname(safeName).toLowerCase().slice(1);
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";

    // رجّع الملف كـ download
    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": fileBuffer.length.toString(),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeName)}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error: any) {
    console.error("[File Download] Error:", error);
    return NextResponse.json({ error: error?.message || "خطأ في تحميل الملف" }, { status: 500 });
  }
}

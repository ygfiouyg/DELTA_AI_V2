/**
 * Local Tool Executor — V.67
 * ═══════════════════════════════════════════════════════════════════════
 *
 * بينفذ أدوات حقيقية محلياً (python-pptx, openpyxl, docx) بدل ما يعتمد
 * على HF Document Service اللي مش متاح.
 *
 * لما الـ AI يحتاج يعمل PPTX/XLSX/DOCX:
 * 1. الـ AI بيكتب المحتوى (slide titles, text, etc.)
 * 2. الـ executor بياخد المحتوى وبيعمل ملف فعللي
 * 3. بيرجع URL للمستخدم
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);
const DOWNLOAD_DIR = path.join(process.cwd(), 'download');

export interface PPTXSlide {
  title: string;
  content: string;
}

export interface ToolExecutionResult {
  success: boolean;
  message: string;
  fileUrl?: string;
  fileName?: string;
  filePath?: string;
}

/**
 * Generate a PPTX file locally using python-pptx
 */
export async function generatePPTX(
  title: string,
  slides: PPTXSlide[],
  language: 'ar' | 'en' = 'ar'
): Promise<ToolExecutionResult> {
  try {
    await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

    const fileId = randomUUID();
    const fileName = `${title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_').substring(0, 40) || 'presentation'}_${fileId.substring(0, 8)}.pptx`;
    const filePath = path.join(DOWNLOAD_DIR, fileName);

    // Build Python script
    const slidesJson = JSON.stringify(slides);
    const script = `
import json
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

slides = json.loads('''${slidesJson.replace(/'/g, "\\'")}''')
title = "${title.replace(/"/g, '\\"').replace(/'/g, "\\'")}"
lang = "${language}"

prs = Presentation()
prs.slide_width = Inches(10)
prs.slide_height = Inches(7.5)

# Title slide
title_slide_layout = prs.slide_layouts[0]
title_slide = prs.slides.add_slide(title_slide_layout)
title_shape = title_slide.shapes.title
subtitle_shape = title_slide.placeholders[1]
title_shape.text = title
if subtitle_shape:
    subtitle_shape.text = "DeltaAI" if lang == "en" else "دلتا AI"

# Content slides
for slide_data in slides:
    slide_layout = prs.slide_layouts[1]
    slide = prs.slides.add_slide(slide_layout)
    
    # Title
    title_shape = slide.shapes.title
    title_shape.text = slide_data['title']
    
    # Content
    if slide.shapes.placeholders:
        body_shape = slide.shapes.placeholders[1]
        tf = body_shape.text_frame
        tf.text = slide_data['content']
        
        # Format text
        for paragraph in tf.paragraphs:
            paragraph.alignment = PP_ALIGN.RIGHT if lang == 'ar' else PP_ALIGN.LEFT
            for run in paragraph.runs:
                run.font.size = Pt(18)
                run.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

output_path = "${filePath}"
prs.save(output_path)
print(f"SUCCESS:{output_path}")
`;

    // Write and execute the script
    const scriptPath = path.join(DOWNLOAD_DIR, `gen_pptx_${fileId}.py`);
    await fs.writeFile(scriptPath, script, 'utf-8');

    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}"`, { timeout: 30_000 });

    // Cleanup script
    await fs.unlink(scriptPath).catch(() => {});

    if (stdout.includes('SUCCESS:')) {
      const fileUrl = `/api/pdf/serve/${fileName}`;
      console.log(`[ToolExecutor] ✅ PPTX generated: ${fileName}`);
      return {
        success: true,
        message: `تم إنشاء عرض تقديمي PowerPoint بنجاح (${slides.length} شرائح)`,
        fileUrl,
        fileName,
        filePath,
      };
    } else {
      console.error('[ToolExecutor] PPTX generation failed:', stderr);
      return {
        success: false,
        message: `فشل في إنشاء PPTX: ${stderr.substring(0, 200)}`,
      };
    }
  } catch (error) {
    console.error('[ToolExecutor] PPTX error:', error);
    return {
      success: false,
      message: `خطأ في إنشاء PPTX: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Generate an XLSX file locally using openpyxl
 */
export async function generateXLSX(
  title: string,
  data: string[][],
  language: 'ar' | 'en' = 'ar'
): Promise<ToolExecutionResult> {
  try {
    await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

    const fileId = randomUUID();
    const fileName = `${title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_').substring(0, 40) || 'spreadsheet'}_${fileId.substring(0, 8)}.xlsx`;
    const filePath = path.join(DOWNLOAD_DIR, fileName);

    // Build Python script
    const dataJson = JSON.stringify(data);
    const script = `
import json
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

data = json.loads('''${dataJson.replace(/'/g, "\\'")}''')
title = "${title.replace(/"/g, '\\"').replace(/'/g, "\\'")}"
lang = "${language}"

wb = Workbook()
ws = wb.active
ws.title = title[:31]  # Excel sheet name max 31 chars

# Header style
header_font = Font(bold=True, size=12, color="FFFFFF")
header_fill = PatternFill(start_color="2563EB", end_color="2563EB", fill_type="solid")
header_alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
border = Border(
    left=Side(style='thin'),
    right=Side(style='thin'),
    top=Side(style='thin'),
    bottom=Side(style='thin')
)

# Write data
for row_idx, row in enumerate(data, 1):
    for col_idx, value in enumerate(row, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=str(value))
        cell.border = border
        if row_idx == 1:
            # Header row
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = header_alignment
        else:
            cell.alignment = Alignment(horizontal="right" if lang == "ar" else "left", vertical="center")

# Auto-fit column widths
for col in ws.columns:
    max_length = 0
    column = col[0].column_letter
    for cell in col:
        try:
            if len(str(cell.value)) > max_length:
                max_length = len(str(cell.value))
        except:
            pass
    adjusted_width = min(max_length + 2, 50)
    ws.column_dimensions[column].width = adjusted_width

# Freeze header row
ws.freeze_panes = 'A2'

output_path = "${filePath}"
wb.save(output_path)
print(f"SUCCESS:{output_path}")
`;

    const scriptPath = path.join(DOWNLOAD_DIR, `gen_xlsx_${fileId}.py`);
    await fs.writeFile(scriptPath, script, 'utf-8');

    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}"`, { timeout: 30_000 });

    await fs.unlink(scriptPath).catch(() => {});

    if (stdout.includes('SUCCESS:')) {
      const fileUrl = `/api/pdf/serve/${fileName}`;
      console.log(`[ToolExecutor] ✅ XLSX generated: ${fileName}`);
      return {
        success: true,
        message: `تم إنشاء ملف Excel بنجاح (${data.length} صف)`,
        fileUrl,
        fileName,
        filePath,
      };
    } else {
      console.error('[ToolExecutor] XLSX generation failed:', stderr);
      return {
        success: false,
        message: `فشل في إنشاء XLSX: ${stderr.substring(0, 200)}`,
      };
    }
  } catch (error) {
    console.error('[ToolExecutor] XLSX error:', error);
    return {
      success: false,
      message: `خطأ في إنشاء XLSX: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Parse PPTX content from AI response
 * Extracts slide titles and content from text like:
 * "1️⃣ العنوان: X\nالنص: Y\n2️⃣ العنوان: Z..."
 */
export function parsePPTXFromAIResponse(content: string): { title: string; slides: PPTXSlide[] } {
  const slides: PPTXSlide[] = [];
  let title = 'عرض تقديمي';

  // Try to extract title from first line
  const lines = content.split('\n');
  for (const line of lines) {
    const titleMatch = line.match(/(?:العنوان|Title)[:：]\s*(.+)/i);
    if (titleMatch && slides.length === 0) {
      title = titleMatch[1].trim();
      break;
    }
  }

  // Parse slides - look for patterns like:
  // 1️⃣ or 1. or الشريحة الأولى
  const slidePatterns = [
    /(?:1️⃣|1[\.\)]|الشريحة\s*الأول[يى]|الشريحة\s*1)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:2️⃣|2[\.\)]|الشريحة\s*الثاني[ةه]|الشريحة\s*2)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:3️⃣|3[\.\)]|الشريحة\s*الثالث[ةه]|الشريحة\s*3)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:4️⃣|4[\.\)]|الشريحة\s*الرابع[ةه]|الشريحة\s*4)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:5️⃣|5[\.\)]|الشريحة\s*الخامس[ةه]|الشريحة\s*5)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:6️⃣|6[\.\)]|الشريحة\s*السادس[ةه]|الشريحة\s*6)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:7️⃣|7[\.\)]|الشريحة\s*السابع[ةه]|الشريحة\s*7)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:8️⃣|8[\.\)]|الشريحة\s*الثامن[ةه]|الشريحة\s*8)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:9️⃣|9[\.\)]|الشريحة\s*التاسع[ةه]|الشريحة\s*9)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
    /(?:🔟|10[\.\)]|الشريحة\s*العاشر[ةه]|الشريحة\s*10)[:：\s]*(?:العنوان[:：]\s*)?(.+?)(?:\n|$)/i,
  ];

  for (const pattern of slidePatterns) {
    const match = content.match(pattern);
    if (match) {
      const slideTitle = match[1].trim().replace(/["""']/g, '');
      
      // Look for content after this slide title
      const matchIndex = content.indexOf(match[0]);
      const afterMatch = content.substring(matchIndex + match[0].length);
      
      // Find content pattern: "النص:" or "Content:"
      const contentMatch = afterMatch.match(/(?:النص|Content|المحتوى)[:：]\s*([\s\S]+?)(?=(?:\d️⃣|\d[\.\)]|الشريحة|$))/i);
      const slideContent = contentMatch ? contentMatch[1].trim().replace(/["""']/g, '') : '';
      
      slides.push({ title: slideTitle, content: slideContent });
    }
  }

  // If no slides parsed, try a simpler approach - split by lines
  if (slides.length === 0) {
    const slideRegex = /(?:العنوان|Title)[:：]\s*(.+)/gi;
    let slideMatch;
    while ((slideMatch = slideRegex.exec(content)) !== null) {
      const slideTitle = slideMatch[1].trim();
      const afterTitle = content.substring(slideMatch.index + slideMatch[0].length);
      const contentMatch = afterTitle.match(/(?:النص|Content|المحتوى)[:：]\s*([\s\S]+?)(?=(?:العنوان|Title|$))/i);
      const slideContent = contentMatch ? contentMatch[1].trim() : '';
      slides.push({ title: slideTitle, content: slideContent });
    }
  }

  return { title, slides };
}

/**
 * Parse table data from AI response for XLSX
 */
export function parseTableFromAIResponse(content: string): string[][] {
  const rows: string[][] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Look for table rows (pipe-separated or tab-separated)
    if (line.includes('|') && line.trim().startsWith('|')) {
      const cells = line.split('|')
        .map(c => c.trim())
        .filter(c => c && !c.match(/^[-:]+$/)); // Skip separator rows
      if (cells.length > 0) {
        rows.push(cells);
      }
    } else if (line.includes('\t')) {
      const cells = line.split('\t').map(c => c.trim()).filter(c => c);
      if (cells.length > 1) {
        rows.push(cells);
      }
    }
  }

  return rows;
}

/**
 * V.68c: Generate a QR code locally using python qrcode
 */
export async function generateQRCode(
  data: string,
  title: string = 'qr_code'
): Promise<ToolExecutionResult> {
  try {
    await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

    const fileId = randomUUID();
    const fileName = `${title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_').substring(0, 30) || 'qr_code'}_${fileId.substring(0, 8)}.png`;
    const filePath = path.join(DOWNLOAD_DIR, fileName);

    // Escape the data for Python
    const escapedData = data.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');

    const script = `
import qrcode
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data('''${escapedData}''')
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save("${filePath}")
print("SUCCESS:${filePath}")
`;

    const scriptPath = path.join(DOWNLOAD_DIR, `gen_qr_${fileId}.py`);
    await fs.writeFile(scriptPath, script, 'utf-8');

    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}"`, { timeout: 15_000 });
    await fs.unlink(scriptPath).catch(() => {});

    if (stdout.includes('SUCCESS:')) {
      const fileUrl = `/api/pdf/serve/${fileName}`;
      console.log(`[ToolExecutor] ✅ QR code generated: ${fileName}`);
      return {
        success: true,
        message: `تم إنشاء كود QR بنجاح`,
        fileUrl,
        fileName,
        filePath,
      };
    } else {
      console.error('[ToolExecutor] QR generation failed:', stderr);
      return { success: false, message: `فشل في إنشاء QR: ${stderr.substring(0, 200)}` };
    }
  } catch (error) {
    return { success: false, message: `خطأ في إنشاء QR: ${error instanceof Error ? error.message : String(error)}` };
  }
}

/**
 * V.68c: Parse vCard data from user message
 * Extracts name, phone, email, url from Arabic/English messages
 */
export function parseVCardFromMessage(message: string): string | null {
  let name = '';
  let phone = '';
  let email = '';
  let url = '';

  // Extract name (اسمي / name / اسم)
  const nameMatch = message.match(/(?:اسمي|اسم|name)[:：\s]+(.+?)(?=\s*(?:ورقم|وبريد|وإيميل|ورابط|و|tel|phone|email|$))/i);
  if (nameMatch) name = nameMatch[1].trim();

  // Extract phone (رقم تليفوني / phone / tel)
  const phoneMatch = message.match(/(?:رقم\s*تليفوني|رقم|تليفون|phone|tel|mobile)[:：\s]*([+\d\s()-]{8,})/i);
  if (phoneMatch) phone = phoneMatch[1].trim();

  // Extract email (إيميلي / بريد / email)
  const emailMatch = message.match(/(?:إيميلي|ايميلي|بريدي|إيميل|email|mail)[:：\s]*([^\s]+@[^\s]+)/i);
  if (emailMatch) email = emailMatch[1].trim();

  // Extract URL (رابط قناتي / youtube / url)
  const urlMatch = message.match(/(?:رابط\s*قناتي|رابط|قناتي|youtube|url|website)[:：\s]*(https?:\/\/[^\s]+)/i);
  if (urlMatch) url = urlMatch[1].trim();

  // If no name found, try to extract from context
  if (!name) {
    const fallbackName = message.match(/اسمي\s+(\S+)/);
    if (fallbackName) name = fallbackName[1];
  }

  // Build vCard
  if (!name && !phone && !email && !url) return null;

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    name ? `FN:${name}` : '',
    name ? `N:${name};;;;` : '',
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    email ? `EMAIL:${email}` : '',
    url ? `URL:${url}` : '',
    'END:VCARD',
  ].filter(line => line).join('\n');

  return vcard;
}

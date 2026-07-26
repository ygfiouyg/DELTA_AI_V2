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

/**
 * V.74: Execute Python code on the server and return the result
 * This is the REAL execution — not just writing code as text
 */
export async function executePythonCode(
  code: string,
  timeoutMs: number = 30_000
): Promise<{ success: boolean; output: string; error: string; images?: string[] }> {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    // Write code to a temp file
    const fileId = randomUUID();
    const scriptPath = path.join(DOWNLOAD_DIR, `exec_${fileId}.py`);
    await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

    // V.91: استخدم DOWNLOAD_DIR الصحيح (مش hardcoded /app/download)
    // V.83: Wrap code — auto-save matplotlib figures + capture output
    // V.91: كل صورة بـ UUID عشان ما تتعارضش
    const figuresDir = DOWNLOAD_DIR.replace(/\\/g, '\\\\');
    const fullCode = `
import sys
import io
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

_figures_saved = []
_original_show = plt.show
def _save_show(*args, **kwargs):
    import uuid as _uuid
    _fname = f'fig_${fileId}_{len(_figures_saved)+1}.png'
    _fpath = os.path.join('${figuresDir}', _fname)
    # استخدم الـ original savefig عشان ما نـ triggerش الـ wrapper
    _original_savefig(_fpath, dpi=100, bbox_inches='tight')
    _figures_saved.append(_fpath)
    print(f"[Figure saved: {_fname}]")
    plt.close()
plt.show = _save_show

# V.91: كمان اخترق savefig عشان نـ collect أي صورة بـ savefig مباشرة
# بس نتأكد إننا ما نضيفش نفس الصورة مرتين
_original_savefig = plt.savefig
def _wrapped_savefig(fname, *a, **kw):
    _original_savefig(fname, *a, **kw)
    if isinstance(fname, str) and fname not in _figures_saved:
        _figures_saved.append(fname)
        print(f"[Figure saved: {os.path.basename(fname)}]")
plt.savefig = _wrapped_savefig

_old_stdout = sys.stdout
_capture = io.StringIO()
sys.stdout = _capture
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception as e:
    print(f"Error: {e}")
finally:
    sys.stdout = _old_stdout
_captured = _capture.getvalue()
if _captured:
    print(_captured, end='')
# V.76b: Try to evaluate the last line as an expression
import traceback
_last_lines = """${code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""".strip().split('\\n')
_last = _last_lines[-1].strip() if _last_lines else ''
if _last and not _captured and not _last.startswith(('print', 'import', 'from', '#', 'def', 'class', 'if', 'for', 'while', 'try', 'except')):
    try:
        _result = eval(_last)
        if _result is not None:
            print(_result)
    except:
        pass
# V.91: Print list of saved figures for the executor to pick up
if _figures_saved:
    print("[FIGURES_LIST]" + "|".join(_figures_saved) + "[/FIGURES_LIST]")
sys.stdout.flush()
`;
    await fs.writeFile(scriptPath, fullCode, 'utf-8');

    // Execute with timeout
    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}"`, {
      timeout: timeoutMs,
      cwd: DOWNLOAD_DIR,
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
    });

    // Cleanup script
    await fs.unlink(scriptPath).catch(() => {});

    const output = stdout.trim();
    const error = stderr.trim();

    // V.91: استخرج قائمة الصور المولّدة من الـ output
    const images: string[] = [];
    const figListMatch = output.match(/\[FIGURES_LIST\](.*?)\[\/FIGURES_LIST\]/);
    if (figListMatch) {
      const figPaths = figListMatch[1].split('|').filter(Boolean);
      for (const figPath of figPaths) {
        try {
          await fs.access(figPath);
          images.push(figPath);
        } catch {}
      }
    }

    if (error && !output) {
      return { success: false, output: '', error: error.substring(0, 500), images };
    }

    // V.91: شيل الـ FIGURES_LIST من الـ output قبل ما نرجعه
    const cleanOutput = output.replace(/\[FIGURES_LIST\].*?\[\/FIGURES_LIST\]/, '').trim();
    return { success: true, output: cleanOutput.substring(0, 2000), error: error.substring(0, 500), images };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return { success: false, output: '', error: errMsg.substring(0, 500) };
  }
}

/**
 * V.84: Extract Python code from AI response — multiple formats
 */
export function extractPythonCode(text: string): string | null {
  // 1. Look for ```python ... ``` blocks
  const match1 = text.match(/```python\s*\n([\s\S]*?)```/);
  if (match1) return match1[1].trim();

  // 2. Look for ``` ... ``` blocks (without language specifier)
  const match2 = text.match(/```\s*\n([\s\S]*?)```/);
  if (match2 && (match2[1].includes('import ') || match2[1].includes('print('))) {
    return match2[1].trim();
  }

  // V.84: 3. Look for "python" followed by code (no backticks — GLM sometimes does this)
  // Pattern: "python\nimport ..." or "python import ..."
  const match3 = text.match(/(?:^|\n)python\s*\n((?:import |from |print|#|def |class |if |for |while |try |x |y |plt|np|pd|fig|ax|data|df)\n?[\s\S]*?)(?:\n\n(?:⚙️|✅|❌|توصية|$))/);
  if (match3 && match3[1].length > 20) {
    return match3[1].trim();
  }

  // V.84: 4. Find ANY block that starts with "import " and contains Python-like code
  const lines = text.split('\n');
  let codeStart = -1;
  let codeEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^\s*(import |from |plt\.|np\.|pd\.|fig|ax\.|data\s*=|df\s*=|x\s*=|y\s*=)/)) {
      if (codeStart === -1) codeStart = i;
      codeEnd = i;
    } else if (codeStart !== -1 && lines[i].trim() === '') {
      // Empty line — might be end of code
    } else if (codeStart !== -1 && !lines[i].match(/^\s*(import |from |plt\.|np\.|pd\.|fig|ax\.|data\s*=|df\s*=|x\s*=|y\s*=|#|print|plt|np|pd|fig|ax|data|df|if |for |while |def |class |try |except|return|with |assert|raise|lambda|global|nonlocal|yield|break|continue|pass|del|in |not |and |or |is |None|True|False|[0-9\.\+\-\*\/\(\)\[\]\{\}:=<>!,\s\\'"])/)) {
      // Non-code line after code block — end it
      break;
    } else if (codeStart !== -1) {
      codeEnd = i;
    }
  }
  if (codeStart !== -1 && codeEnd !== -1 && codeEnd > codeStart) {
    const code = lines.slice(codeStart, codeEnd + 1).join('\n').trim();
    if (code.length > 20 && code.includes('import ')) {
      return code;
    }
  }

  return null;
}

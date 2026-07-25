import { NextRequest, NextResponse } from 'next/server';
import { generatePPTX, generateXLSX, parsePPTXFromAIResponse, parseTableFromAIResponse } from '@/lib/local-tool-executor';

/**
 * POST /api/tools/generate
 * 
 * Generate files locally using python-pptx / openpyxl.
 * This replaces the broken HF Document Service approach.
 *
 * Body: { type: 'pptx'|'xlsx', content: string, title?: string, language?: 'ar'|'en' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, title, language = 'ar' } = body;

    if (!type || !content) {
      return NextResponse.json(
        { success: false, error: 'type and content are required' },
        { status: 400 }
      );
    }

    console.log(`[ToolsGenerate] Generating ${type} file...`);

    if (type === 'pptx') {
      // Parse slides from AI content
      const { title: parsedTitle, slides } = parsePPTXFromAIResponse(content);
      const finalTitle = title || parsedTitle;

      if (slides.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No slides detected in content. Expected format: 1️⃣ العنوان: X\\nالنص: Y' },
          { status: 400 }
        );
      }

      const result = await generatePPTX(finalTitle, slides, language);
      return NextResponse.json(result);
    }

    if (type === 'xlsx') {
      // Parse table data from AI content
      let data = parseTableFromAIResponse(content);

      // If no table found, try to parse as simple rows
      if (data.length === 0) {
        const lines = content.split('\n').filter(l => l.trim());
        // Use first line as headers, rest as data
        if (lines.length > 0) {
          data = [lines[0].split(/[,،\t]/).map(c => c.trim())];
          for (let i = 1; i < lines.length; i++) {
            data.push(lines[i].split(/[,،\t]/).map(c => c.trim()));
          }
        }
      }

      if (data.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No table data detected in content' },
          { status: 400 }
        );
      }

      const result = await generateXLSX(title || 'جدول بيانات', data, language);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: `Unsupported type: ${type}. Supported: pptx, xlsx` },
      { status: 400 }
    );
  } catch (error) {
    console.error('[ToolsGenerate] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}

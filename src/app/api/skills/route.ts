import { NextRequest, NextResponse } from 'next/server';
import { getSkillsMetadata, findMatchingSkills } from '@/lib/skill-discovery';

/**
 * GET /api/skills - List all available skills
 * POST /api/skills - Search for matching skills
 */
export async function GET() {
  try {
    const skills = await getSkillsMetadata();
    return NextResponse.json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const matched = await findMatchingSkills(query, 5);
    return NextResponse.json({
      success: true,
      query,
      matchedCount: matched.length,
      skills: matched.map(s => ({
        name: s.name,
        description: s.description,
        category: s.category,
        priority: s.priority,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}

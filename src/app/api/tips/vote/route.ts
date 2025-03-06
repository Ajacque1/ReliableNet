import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { tipId, voteType } = await request.json();

    if (!tipId || !['helpful', 'unhelpful'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const tip = await prisma.tip.update({
      where: { id: tipId },
      data: {
        helpfulCount: {
          increment: voteType === 'helpful' ? 1 : 0
        },
        unhelpfulCount: {
          increment: voteType === 'unhelpful' ? 1 : 0
        }
      }
    });

    return NextResponse.json({ tip });
  } catch (error) {
    console.error('Error processing tip vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
} 
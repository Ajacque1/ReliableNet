import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { faqId, voteType } = await request.json();

    if (!faqId || !['helpful', 'unhelpful'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const faq = await prisma.fAQ.update({
      where: { id: faqId },
      data: {
        helpfulCount: {
          increment: voteType === 'helpful' ? 1 : 0
        },
        unhelpfulCount: {
          increment: voteType === 'unhelpful' ? 1 : 0
        }
      }
    });

    return NextResponse.json({ faq });
  } catch (error) {
    console.error('Error processing FAQ vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
} 
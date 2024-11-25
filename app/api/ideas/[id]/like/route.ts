import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const ideaId = parseInt(params.id)
    
    const like = await prisma.ideaLike.create({
      data: {
        idea_id: ideaId,
        user_id: userId
      }
    })

    await prisma.idea.update({
      where: { id: ideaId },
      data: {
        likes: {
          increment: 1
        }
      }
    })

    return NextResponse.json(like)
  } catch (error) {
    console.error('Failed to like idea:', error)
    return NextResponse.json({ error: 'Failed to like idea' }, { status: 500 })
  }
} 
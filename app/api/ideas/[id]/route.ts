import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const idea = await prisma.idea.findUnique({
      where: { id: parseInt(params.id) },
      select: { author_id: true }
    })

    if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    if (idea.author_id !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    await prisma.idea.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete idea:', error)
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const idea = await prisma.idea.findUnique({
      where: { id: parseInt(params.id) },
      select: { author_id: true }
    })

    if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    if (idea.author_id !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const updatedIdea = await prisma.idea.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
        category: body.category
      }
    })

    return NextResponse.json(updatedIdea)
  } catch (error) {
    console.error('Failed to update idea:', error)
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        likes_by: true,
        comments: {
          orderBy: {
            created_at: "desc"
          },
          select: {
            id: true,
            content: true,
            user_id: true,
            created_at: true
          }
        }
      }
    });

    if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 });

    return NextResponse.json(idea);
  } catch (error) {
    console.error('Failed to fetch idea:', error);
    return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 });
  }
} 
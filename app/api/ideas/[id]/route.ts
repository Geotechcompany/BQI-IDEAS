import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '../../../lib/prisma'
import { DEPARTMENTS } from "@/lib/constants"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Delete all related records first
    await prisma.$transaction([
      // Delete likes
      prisma.ideaLike.deleteMany({
        where: { idea_id: parseInt(params.id) }
      }),
      // Delete comments
      prisma.comment.deleteMany({
        where: { idea_id: parseInt(params.id) }
      }),
      // Delete notifications
      prisma.notification.deleteMany({
        where: { idea_id: parseInt(params.id) }
      }),
      // Delete notes
      prisma.note.deleteMany({
        where: { idea_id: parseInt(params.id) }
      }),
      // Finally delete the idea
      prisma.idea.delete({
        where: { id: parseInt(params.id) }
      })
    ])

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
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    
    // Validate department
    if (body.department && !DEPARTMENTS.includes(body.department)) {
      return NextResponse.json(
        { error: "Invalid department" },
        { status: 400 }
      )
    }

    const updatedIdea = await prisma.idea.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
        department: body.department,
        category: body.category,
        updated_at: new Date()
      }
    })

    return NextResponse.json(updatedIdea)
  } catch (error) {
    console.error("Failed to update idea:", error)
    return NextResponse.json(
      { error: "Failed to update idea" },
      { status: 500 }
    )
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
        _count: {
          select: {
            likes_by: true,
            comments: true
          }
        },
        likes_by: true,
        comments: {
          orderBy: { created_at: "desc" },
          include: {
            replies: {
              orderBy: { created_at: "asc" }
            }
          }
        },
        notes: {
          orderBy: { order: "asc" }
        }
      }
    })

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Failed to fetch idea:', error)
    return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 })
  }
} 
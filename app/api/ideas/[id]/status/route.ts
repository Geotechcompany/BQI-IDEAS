import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { status } = body

    const updatedIdea = await prisma.idea.update({
      where: { id: parseInt(params.id) },
      data: { 
        status,
        updated_at: new Date()
      },
      include: {
        _count: {
          select: {
            likes_by: true,
            comments: true
          }
        }
      }
    })

    // Create notification for idea status change
    await prisma.notification.create({
      data: {
        user_id: updatedIdea.author_id,
        type: "status_change",
        message: `Your idea "${updatedIdea.title}" has been ${status}`,
        idea_id: updatedIdea.id
      }
    })

    return NextResponse.json(updatedIdea)
  } catch (error) {
    console.error("Failed to update idea status:", error)
    return NextResponse.json(
      { error: "Failed to update idea status" },
      { status: 500 }
    )
  }
} 
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const ideas = await prisma.idea.findMany({
      where: status ? { status } : {},
      include: {
        _count: {
          select: {
            likes_by: true,
            comments: true
          }
        }
      },
      orderBy: {
        created_at: "desc"
      }
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error("Failed to fetch approvals:", error)
    return NextResponse.json(
      { error: "Failed to fetch approvals" },
      { status: 500 }
    )
  }
} 
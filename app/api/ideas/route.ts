import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
 
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
 
    const ideas = await prisma.idea.findMany({
      where: department
        ? {
            department: department,
          }
        : undefined,
      orderBy: {
        created_at: "desc",
      },
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
        },
        notes: {
          orderBy: {
            order: 'asc'
          },
          select: {
            id: true,
            content: true,
            color: true,
            order: true
          }
        },
        _count: {
          select: {
            likes_by: true,
            comments: true,
          },
        },
      },
    });
 
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}
 
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
    const body = await req.json();
    const idea = await prisma.idea.create({
      data: {
        ...body,
        author_id: userId,
      },
    });
 
    return NextResponse.json(idea);
  } catch (error) {
    console.error("Failed to create idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
 
 
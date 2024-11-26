import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const notes = await prisma.note.findMany({
      where: { idea_id: parseInt(params.id) },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const idea = await prisma.idea.findUnique({
      where: { id: parseInt(params.id) },
      select: { author_id: true },
    });

    if (!idea)
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    if (idea.author_id !== userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { notes } = await req.json();

    // Use transaction to ensure atomic operation
    await prisma.$transaction(async (tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => {
      // Delete existing notes
      await tx.note.deleteMany({
        where: { idea_id: parseInt(params.id) },
      });

      // Create new notes
      if (notes.length > 0) {
        await tx.note.createMany({
          data: notes.map((note: any, index: number) => ({
            id: note.id,
            idea_id: parseInt(params.id),
            content: note.content,
            color: note.color,
            order: index,
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update notes:", error);
    return NextResponse.json(
      { error: "Failed to update notes" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");

    const [monthlyIdeas, departmentStats, totals] = await Promise.all([
      // Monthly ideas query
      prisma.idea.groupBy({
        by: ["created_at"],
        _count: {
          _all: true,
        },
        where: department ? { department } : {},
      }),

      // Department stats query
      prisma.idea.groupBy({
        by: ["department"],
        _count: {
          _all: true,
        },
      }),

      // Totals query
      prisma.idea.aggregate({
        where: department ? { department } : {},
        _count: {
          _all: true,
        },
        _sum: {
          likes: true,
        },
      }),
    ]);

    // Process monthly data
    const processedMonthlyData = monthlyIdeas.map(
      (item: { created_at: Date; _count: { _all: number } }) => ({
        month: item.created_at,
        submitted: item._count._all,
        implemented: 0, // You'll need to adjust this based on your schema
      })
    );

    const response = {
      monthlyIdeas: processedMonthlyData,
      departmentStats,
      totals: {
        total: totals._count._all,
        implemented: totals._sum.likes || 0,
        successRate: totals._count._all
          ? Math.round(((totals._sum.likes || 0) * 100) / totals._count._all)
          : 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

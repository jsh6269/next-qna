import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // 질문과 연결되지 않은 모든 태그 삭제
    const { count } = await prisma.tag.deleteMany({
      where: {
        questions: {
          none: {}, // 연결된 질문이 하나도 없는 태그
        },
      },
    });

    return NextResponse.json({ deletedCount: count });
  } catch (error) {
    console.error("Failed to cleanup tags:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

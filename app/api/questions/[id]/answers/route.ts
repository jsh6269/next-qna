import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from "zod";

const answerSchema = z.object({
  content: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const body = answerSchema.parse(json);

    const answer = await prisma.answer.create({
      data: {
        content: body.content,
        question: {
          connect: {
            id: params.id,
          },
        },
        author: {
          connect: {
            email: session.user.email,
          },
        },
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "입력값이 올바르지 않습니다" },
        { status: 400 }
      );
    }

    console.error("Failed to create answer:", error);
    return NextResponse.json(
      { message: "답변 작성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const answers = await prisma.answer.findMany({
      where: {
        questionId: params.id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(answers);
  } catch (error) {
    console.error("Failed to fetch answers:", error);
    return NextResponse.json(
      { message: "답변 목록을 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

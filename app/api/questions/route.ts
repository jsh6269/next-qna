import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import * as z from "zod";

const questionSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().min(1).max(10000),
  tags: z.array(z.string()),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const body = questionSchema.parse(json);

    const question = await prisma.question.create({
      data: {
        title: body.title,
        content: body.content,
        author: {
          connect: {
            email: session.user.email,
          },
        },
        tags: {
          connectOrCreate: body.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "입력값이 올바르지 않습니다" },
        { status: 400 }
      );
    }

    console.error("Failed to create question:", error);
    return NextResponse.json(
      { message: "질문 작성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");

  try {
    const questions = await prisma.question.findMany({
      where: tag
        ? {
            tags: {
              some: {
                name: tag,
              },
            },
          }
        : undefined,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            answers: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

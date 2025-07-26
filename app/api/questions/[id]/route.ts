import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const updateQuestionSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  tags: z
    .array(z.string())
    .min(1, "태그를 1개 이상 입력해주세요.")
    .max(5, "태그는 최대 5개까지 입력할 수 있습니다."),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!question) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (question.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateQuestionSchema.parse(body);

    const updatedQuestion = await prisma.question.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        tags: {
          set: [], // 기존 태그 모두 제거
          connectOrCreate: validatedData.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
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
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!question) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (question.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.question.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

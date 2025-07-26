import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const answerSchema = z.object({
  content: z.string().min(1, "내용을 입력해주세요."),
});

export async function POST(request: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const questionId = context.params.id;
    const body = await request.json();
    const validatedData = answerSchema.parse(body);

    const answer = await prisma.answer.create({
      data: {
        content: validatedData.content,
        question: {
          connect: {
            id: questionId,
          },
        },
        author: {
          connect: {
            id: session.user.id,
          },
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
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(answer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: NextRequest, context: any) {
  try {
    const answers = await prisma.answer.findMany({
      where: {
        questionId: context.params.id,
      },
      include: {
        author: {
          select: {
            id: true,
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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

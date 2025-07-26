import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const updateAnswerSchema = z.object({
  content: z.string().min(1, "내용을 입력해주세요."),
});

export async function PATCH(request: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const answer = await prisma.answer.findUnique({
      where: { id: context.params.id },
      select: { authorId: true },
    });

    if (!answer) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (answer.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateAnswerSchema.parse(body);

    const updatedAnswer = await prisma.answer.update({
      where: { id: context.params.id },
      data: {
        content: validatedData.content,
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

    return NextResponse.json(updatedAnswer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const answer = await prisma.answer.findUnique({
      where: { id: context.params.id },
      select: { authorId: true },
    });

    if (!answer) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (answer.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.answer.delete({
      where: { id: context.params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

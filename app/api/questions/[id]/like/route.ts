import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId: String(context.params?.id),
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { message: "이미 좋아요를 눌렀습니다" },
        { status: 400 }
      );
    }

    await prisma.like.create({
      data: {
        question: {
          connect: {
            id: String(context.params?.id),
          },
        },
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    return NextResponse.json({ message: "좋아요!" }, { status: 201 });
  } catch (error) {
    console.error("Failed to like question:", error);
    return NextResponse.json(
      { message: "좋아요 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    await prisma.like.delete({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId: String(context.params?.id),
        },
      },
    });

    return NextResponse.json({ message: "좋아요 취소" });
  } catch (error) {
    console.error("Failed to unlike question:", error);
    return NextResponse.json(
      { message: "좋아요 취소 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const answerId = context.params.id;
    const userId = session.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId,
        },
      },
    });

    if (existingLike) {
      return new NextResponse("Already liked", { status: 400 });
    }

    await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        answer: { connect: { id: answerId } },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to like answer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const answerId = context.params.id;
    const userId = session.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId,
        },
      },
    });

    if (!existingLike) {
      return new NextResponse("Like not found", { status: 404 });
    }

    await prisma.like.delete({
      where: { id: existingLike.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to unlike answer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

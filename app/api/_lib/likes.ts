import { prisma } from "@/lib/prisma";

export async function getLikeStatus({
  userId,
  questionId,
  answerId,
}: {
  userId: string;
  questionId?: string;
  answerId?: string;
}) {
  if (questionId) {
    return prisma.like.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });
  }

  if (answerId) {
    return prisma.like.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId,
        },
      },
    });
  }

  return null;
}

export async function toggleLike({
  userId,
  questionId,
  answerId,
}: {
  userId: string;
  questionId?: string;
  answerId?: string;
}) {
  const existingLike = await getLikeStatus({ userId, questionId, answerId });

  if (existingLike) {
    return prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  }

  return prisma.like.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      ...(questionId
        ? {
            question: {
              connect: {
                id: questionId,
              },
            },
          }
        : {}),
      ...(answerId
        ? {
            answer: {
              connect: {
                id: answerId,
              },
            },
          }
        : {}),
    },
  });
}

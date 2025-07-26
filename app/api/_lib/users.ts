import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
          answers: true,
        },
      },
    },
  });
}

export async function getUserQuestions(userId: string) {
  return prisma.question.findMany({
    where: { authorId: userId },
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
          id: true,
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
}

export async function getUserAnswers(userId: string) {
  return prisma.answer.findMany({
    where: { authorId: userId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      question: {
        select: {
          id: true,
          title: true,
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
}

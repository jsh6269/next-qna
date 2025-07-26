import { prisma } from "@/lib/prisma";
import type { Question, Answer } from "@/types";

export async function getQuestion(id: string) {
  return prisma.question.findUnique({
    where: { id },
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
  });
}

export async function getQuestions(options?: {
  tag?: string;
  take?: number;
  skip?: number;
}) {
  return prisma.question.findMany({
    where: options?.tag
      ? {
          tags: {
            some: {
              name: options.tag,
            },
          },
        }
      : undefined,
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
    orderBy: {
      createdAt: "desc",
    },
    take: options?.take,
    skip: options?.skip,
  });
}

export async function getQuestionAnswers(questionId: string) {
  return prisma.answer.findMany({
    where: { questionId },
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
}

export async function createQuestion(data: {
  title: string;
  content: string;
  tags: string[];
  authorEmail: string;
}) {
  return prisma.question.create({
    data: {
      title: data.title,
      content: data.content,
      author: {
        connect: {
          email: data.authorEmail,
        },
      },
      tags: {
        connectOrCreate: data.tags.map((tag) => ({
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
}

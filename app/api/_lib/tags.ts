import { prisma } from "@/lib/prisma";

export async function getPopularTags(limit = 10) {
  return prisma.tag.findMany({
    where: {
      questions: {
        some: {}, // 최소 1개 이상의 질문이 있는 태그만 선택
      },
    },
    select: {
      name: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
    orderBy: {
      questions: {
        _count: "desc",
      },
    },
    take: limit,
  });
}

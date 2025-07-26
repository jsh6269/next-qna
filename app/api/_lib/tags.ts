import { prisma } from "@/lib/prisma";

export async function getPopularTags(limit = 10) {
  return prisma.tag.findMany({
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

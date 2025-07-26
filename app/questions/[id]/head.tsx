import { prisma } from "@/lib/prisma";

async function getQuestionMetadata(questionId: string) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        title: true,
        content: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    if (!question) {
      return {
        title: "질문을 찾을 수 없습니다",
        description: "요청하신 질문을 찾을 수 없습니다.",
      };
    }

    const authorName = question.author.name || question.author.email;
    const answerCount = question._count.answers;
    const description =
      question.content.length > 160
        ? `${question.content.slice(0, 157)}...`
        : question.content;

    return {
      title: `${question.title} - Q&A 플랫폼`,
      description,
      author: authorName,
      answerCount,
    };
  } catch (error) {
    console.error("Failed to fetch question metadata:", error);
    return {
      title: "오류가 발생했습니다",
      description: "질문 정보를 불러오는 중 오류가 발생했습니다.",
    };
  }
}

export default async function Head({ params }: { params: { id: string } }) {
  const metadata = await getQuestionMetadata(params.id);

  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      {metadata.author && (
        <meta property="article:author" content={metadata.author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />

      {/* Additional Metadata */}
      {metadata.answerCount !== undefined && (
        <meta
          name="keywords"
          content={`Q&A, 질문, 답변, ${metadata.answerCount}개의 답변`}
        />
      )}
      <meta name="robots" content="index, follow" />
    </>
  );
}

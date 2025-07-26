import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getQuestion, getQuestionAnswers } from "@/app/api/_lib/questions";
import { getBulkLikeStatus } from "@/app/api/_lib/likes";
import { QuestionDetail } from "@/components/questions/question-detail";
import { headers } from "next/headers";

// 모든 요청에서 페이지를 동적으로 렌더링
export const dynamic = "force-dynamic";
// 캐시를 사용하지 않음
export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function QuestionPage({ params }: PageProps) {
  // 요청 헤더를 읽어서 캐시를 방지
  headers();

  const [rawQuestion, rawAnswers, session] = await Promise.all([
    getQuestion(params.id),
    getQuestionAnswers(params.id),
    getServerSession(authOptions),
  ]);

  if (!rawQuestion) {
    notFound();
  }

  const question = {
    ...rawQuestion,
    createdAt: new Date(rawQuestion.createdAt),
  };

  const answers = rawAnswers.map((answer) => ({
    ...answer,
    createdAt: new Date(answer.createdAt),
  }));

  let likedQuestionIds = new Set<string>();
  let likedAnswerIds = new Set<string>();

  if (session?.user?.id) {
    const likedItems = await getBulkLikeStatus({
      userId: session.user.id,
      questionIds: [question.id],
      answerIds: answers.map((answer) => answer.id),
    });
    likedQuestionIds = likedItems.questions as Set<string>;
    likedAnswerIds = likedItems.answers as Set<string>;
  }

  return (
    <QuestionDetail
      question={question}
      answers={answers}
      isOwner={session?.user?.id === question.author.id}
      isLoggedIn={!!session}
      likedQuestionIds={likedQuestionIds}
      likedAnswerIds={likedAnswerIds}
    />
  );
}

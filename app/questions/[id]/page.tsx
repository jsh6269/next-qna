import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQuestion, getQuestionAnswers } from "@/app/api/_lib/questions";
import { getBulkLikeStatus } from "@/app/api/_lib/likes";
import { QuestionDetail } from "@/components/questions/question-detail";

export const dynamic = "force-dynamic";

async function getQuestionData(questionId: string) {
  const [rawQuestion, rawAnswers, session] = await Promise.all([
    getQuestion(questionId),
    getQuestionAnswers(questionId),
    getServerSession(authOptions),
  ]);

  if (!rawQuestion) {
    return { question: null, answers: [], session, likedItems: null };
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

  return {
    question,
    answers,
    session,
    likedItems: { questions: likedQuestionIds, answers: likedAnswerIds },
  };
}

export default async function QuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const { question, answers, session, likedItems } = await getQuestionData(
    resolvedParams.id
  );

  if (!question) {
    notFound();
  }

  return (
    <QuestionDetail
      question={question}
      answers={answers}
      isOwner={session?.user?.id === question.author.id}
      isLoggedIn={!!session}
      likedQuestionIds={likedItems?.questions ?? new Set()}
      likedAnswerIds={likedItems?.answers ?? new Set()}
    />
  );
}

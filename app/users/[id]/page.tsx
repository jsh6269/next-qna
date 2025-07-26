import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getUserProfile,
  getUserQuestions,
  getUserAnswers,
} from "@/app/api/_lib/users";
import { formatRelativeTime } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function UserProfilePage({ params }: PageProps) {
  const [profile, questions, answers, session] = await Promise.all([
    getUserProfile(params.id),
    getUserQuestions(params.id),
    getUserAnswers(params.id),
    getServerSession(authOptions),
  ]);

  if (!profile) {
    notFound();
  }

  const isOwner = session?.user?.id === profile.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {profile.name || profile.email}
              </h1>
              {isOwner && (
                <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              가입일: {formatRelativeTime(new Date(profile.createdAt))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold">
                {profile._count.questions}
              </div>
              <div className="text-sm text-gray-500">작성한 질문</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold">{profile._count.answers}</div>
              <div className="text-sm text-gray-500">작성한 답변</div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">작성한 질문</h2>
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                  >
                    <Link
                      href={`/questions/${question.id}`}
                      className="text-lg font-medium hover:text-blue-500"
                    >
                      {question.title}
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {question.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>답변 {question._count.answers}개</span>
                      <span>좋아요 {question._count.likes}개</span>
                      <time dateTime={question.createdAt.toISOString()}>
                        {formatRelativeTime(new Date(question.createdAt))}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                아직 작성한 질문이 없습니다.
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">작성한 답변</h2>
            {answers.length > 0 ? (
              <div className="space-y-4">
                {answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                  >
                    <Link
                      href={`/questions/${answer.question.id}`}
                      className="text-lg font-medium hover:text-blue-500"
                    >
                      {answer.question.title}
                    </Link>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {answer.content}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>좋아요 {answer._count.likes}개</span>
                      <time dateTime={answer.createdAt.toISOString()}>
                        {formatRelativeTime(new Date(answer.createdAt))}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                아직 작성한 답변이 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Answer {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
  _count: {
    likes: number;
  };
}

interface AnswerListProps {
  answers: Answer[];
}

export function AnswerList({ answers }: AnswerListProps) {
  if (answers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {answers.map((answer) => (
        <div
          key={answer.id}
          className="rounded-lg border bg-card p-4 shadow-sm"
        >
          <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
            {answer.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>{answer.author.name || answer.author.email}</span>
              <span>•</span>
              <time dateTime={answer.createdAt.toISOString()}>
                {formatDistanceToNow(answer.createdAt, {
                  addSuffix: true,
                  locale: ko,
                })}
              </time>
            </div>

            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{answer._count.likes}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

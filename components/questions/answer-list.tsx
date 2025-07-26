import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { LikeButton } from "@/components/like-button";

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

            <LikeButton
              itemId={answer.id}
              itemType="answer"
              initialLikeCount={answer._count.likes}
              initialIsLiked={false} // TODO: Add isLiked check
            />
          </div>
        </div>
      ))}
    </div>
  );
}

import { formatRelativeTime } from "@/lib/utils/date";
import { LikeButton } from "@/components/like-button";
import type { Answer } from "@/types";

interface AnswerListProps {
  answers: Answer[];
  likedAnswerIds: Set<string>;
}

export function AnswerList({ answers, likedAnswerIds }: AnswerListProps) {
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
                {formatRelativeTime(answer.createdAt)}
              </time>
            </div>

            <LikeButton
              itemId={answer.id}
              itemType="answer"
              initialLikeCount={answer._count.likes}
              initialIsLiked={likedAnswerIds.has(answer.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

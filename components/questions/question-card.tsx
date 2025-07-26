import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Question } from "@/types/question";

type QuestionCardProps = Pick<
  Question,
  "id" | "title" | "content" | "author" | "createdAt" | "_count" | "tags"
>;

export function QuestionCard({
  id,
  title,
  content,
  author,
  createdAt,
  _count,
  tags,
}: QuestionCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/questions/${id}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </Link>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
        {content}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/questions?tag=${tag.name}`}
            className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {tag.name}
          </Link>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {_count.answers}
          </span>
          <span className="flex items-center gap-1">
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
            {_count.likes}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{author.name || author.email}</span>
          <span>•</span>
          <time dateTime={createdAt.toISOString()}>
            {formatDistanceToNow(createdAt, { addSuffix: true, locale: ko })}
          </time>
        </div>
      </div>
    </div>
  );
}

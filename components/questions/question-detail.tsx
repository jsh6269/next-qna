"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils/date";
import { QuestionEditForm } from "@/components/questions/question-edit-form";
import { AnswerForm } from "@/components/questions/answer-form";
import { AnswerList } from "@/components/questions/answer-list";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";
import type { Question, Answer } from "@/types";

interface QuestionDetailProps {
  question: Question;
  answers: Answer[];
  isOwner: boolean;
  isLoggedIn: boolean;
  likedQuestionIds: Set<string>;
  likedAnswerIds: Set<string>;
}

export function QuestionDetail({
  question,
  answers,
  isOwner,
  isLoggedIn,
  likedQuestionIds,
  likedAnswerIds,
}: QuestionDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?") || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/questions/${question.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      router.push("/questions");
    } catch (error) {
      console.error("Failed to delete question:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {isEditing ? (
          <QuestionEditForm
            questionId={question.id}
            initialTitle={question.title}
            initialContent={question.content}
            initialTags={question.tags.map((tag) => tag.name)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{question.title}</h1>
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsEditing(true)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>{question.author.name || question.author.email}</span>
              <span className="mx-2">•</span>
              <time dateTime={question.createdAt.toISOString()}>
                {formatRelativeTime(question.createdAt)}
              </time>
            </div>

            <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none mb-8">
              {question.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {question.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-12">
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
                답변 {question._count.answers}개
              </span>
              <LikeButton
                itemId={question.id}
                itemType="question"
                initialLikeCount={question._count.likes}
                initialIsLiked={likedQuestionIds.has(question.id)}
              />
            </div>
          </>
        )}

        <div className="space-y-8">
          <h2 className="text-xl font-semibold">
            {question._count.answers}개의 답변
          </h2>
          <AnswerList answers={answers} likedAnswerIds={likedAnswerIds} />
          {isLoggedIn ? (
            <AnswerForm questionId={question.id} />
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                답변을 작성하려면 로그인이 필요합니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatRelativeTime } from "@/lib/utils/date";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";
import { AnswerEditForm } from "@/components/questions/answer-edit-form";
import type { Answer } from "@/types";

interface AnswerListProps {
  answers: Answer[];
  likedAnswerIds: Set<string>;
}

export function AnswerList({ answers, likedAnswerIds }: AnswerListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (answerId: string) => {
    if (!confirm("정말 삭제하시겠습니까?") || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/answers/${answerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete answer");
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete answer:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {answers.map((answer) => {
        const isOwner = session?.user?.id === answer.author.id;
        const isEditing = editingAnswerId === answer.id;

        return (
          <div
            key={answer.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            {isEditing ? (
              <AnswerEditForm
                answerId={answer.id}
                initialContent={answer.content}
                onCancel={() => setEditingAnswerId(null)}
              />
            ) : (
              <>
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

                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => setEditingAnswerId(answer.id)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(answer.id)}
                          disabled={isDeleting}
                        >
                          삭제
                        </Button>
                      </>
                    )}
                    <LikeButton
                      itemId={answer.id}
                      itemType="answer"
                      initialLikeCount={answer._count.likes}
                      initialIsLiked={likedAnswerIds.has(answer.id)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

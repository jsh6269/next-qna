"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  itemId: string;
  itemType: "question" | "answer";
  initialLikeCount: number;
  initialIsLiked?: boolean;
}

export function LikeButton({
  itemId,
  itemType,
  initialLikeCount,
  initialIsLiked = false,
}: LikeButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLike = async () => {
    if (status !== "authenticated") {
      router.push("/auth/signin");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/${itemType}s/${itemId}/like`, {
        method: isLiked ? "DELETE" : "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to like");
      }

      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={handleLike}
      disabled={isLoading}
    >
      <svg
        className={`h-4 w-4 ${
          isLiked ? "fill-current" : "fill-none"
        } transition-colors`}
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
      <span>{likeCount}</span>
    </Button>
  );
}

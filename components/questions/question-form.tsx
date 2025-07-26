"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const questionFormSchema = z.object({
  title: z
    .string()
    .min(2, "제목은 최소 2자 이상이어야 합니다")
    .max(100, "제목은 100자를 넘을 수 없습니다"),
  content: z
    .string()
    .min(1, "내용을 입력해주세요")
    .max(10000, "내용은 10000자를 넘을 수 없습니다"),
  tags: z.string().min(0),
});

type FormValues = z.infer<typeof questionFormSchema>;

export function QuestionForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(questionFormSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (tags.length > 5) {
        setError("태그는 최대 5개까지만 입력할 수 있습니다");
        return;
      }

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          tags,
        }),
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const question = await response.json();
      router.push(`/questions/${question.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "질문 작성 중 오류가 발생했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register("title")}
          placeholder="제목"
          error={errors.title?.message}
        />
      </div>
      <div>
        <textarea
          {...register("content")}
          className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="질문 내용을 자세히 작성해주세요"
        />
        {errors.content?.message && (
          <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
        )}
      </div>
      <div>
        <Input
          {...register("tags")}
          placeholder="태그 (쉼표로 구분)"
          error={errors.tags?.message}
        />
        <p className="text-sm text-gray-500 mt-1">예: react, nextjs, prisma</p>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <Button type="submit" className="w-full" isLoading={isLoading}>
        질문 작성
      </Button>
    </form>
  );
}

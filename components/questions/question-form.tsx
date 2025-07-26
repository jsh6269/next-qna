"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  tags: z.string().min(1, "태그를 입력해주세요."),
});

type FormData = z.infer<typeof schema>;

export function QuestionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tags.length === 0) {
        alert("태그를 1개 이상 입력해주세요.");
        return;
      }

      if (tags.length > 5) {
        alert("태그는 최대 5개까지 입력할 수 있습니다.");
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
      });

      if (!response.ok) {
        throw new Error("Failed to create question");
      }

      const question = await response.json();
      router.push(`/questions/${question.id}`);
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="text"
          {...register("title")}
          className="w-full rounded-lg border p-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          placeholder="제목을 입력하세요"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("content")}
          className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          rows={8}
          placeholder="내용을 입력하세요"
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          {...register("tags")}
          className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          placeholder="태그를 입력하세요 (쉼표로 구분)"
          disabled={isSubmitting}
        />
        {errors.tags && (
          <p className="mt-1 text-sm text-red-500">{errors.tags.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "작성 중..." : "질문 작성"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QuestionCard } from "@/components/questions/question-card";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
  tags: {
    name: string;
  }[];
  _count: {
    answers: number;
    likes: number;
  };
}

interface Tag {
  name: string;
  _count: {
    questions: number;
  };
}

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const questionsRes = await fetch(
          selectedTag ? `/api/questions?tag=${selectedTag}` : "/api/questions"
        );
        const tagsRes = await fetch("/api/tags");

        const [questionsData, tagsData] = await Promise.all([
          questionsRes.json(),
          tagsRes.json(),
        ]);

        setQuestions(questionsData);
        setTags(tagsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [selectedTag]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          {selectedTag ? `'${selectedTag}' 태그의 질문들` : "모든 질문"}
        </h1>
        <Link href="/questions/ask">
          <Button>질문하기</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              title={question.title}
              content={question.content}
              author={question.author}
              createdAt={new Date(question.createdAt)}
              _count={question._count}
              tags={question.tags}
            />
          ))}
          {questions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              아직 질문이 없습니다.
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold mb-4">인기 태그</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/questions?tag=${tag.name}`}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedTag === tag.name
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {tag.name} ({tag._count.questions})
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

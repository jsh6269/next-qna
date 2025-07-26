import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          당신의 궁금증을 해결하세요
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          개발자들과 함께 문제를 해결하고 지식을 공유하세요. 질문하고, 답변하고,
          배우면서 함께 성장합니다.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/questions">
            <Button size="lg" className="text-base">
              질문 보기
            </Button>
          </Link>
          <Link href="/questions/ask">
            <Button variant="outline" size="lg" className="text-base">
              질문하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

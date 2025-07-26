import { Suspense } from "react";
import { QuestionList } from "@/components/questions/question-list";

export default function QuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
        </div>
      }
    >
      <QuestionList />
    </Suspense>
  );
}

import { QuestionForm } from "@/components/questions/question-form";

export default function AskQuestionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">질문하기</h1>
        <QuestionForm />
      </div>
    </div>
  );
}

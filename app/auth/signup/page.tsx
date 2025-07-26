import SignUpForm from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">계정 만들기</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            이메일로 새 계정을 만드세요
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}

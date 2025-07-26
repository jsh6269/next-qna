import SignInForm from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-start pt-24 sm:pt-32 justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            이메일과 비밀번호를 입력하세요
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}

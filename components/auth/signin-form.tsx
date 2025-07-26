"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 주소를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <Input
            {...register("email")}
            type="email"
            placeholder="이메일"
            error={errors.email?.message}
            className="rounded-t-md"
          />
        </div>
        <div>
          <Input
            {...register("password")}
            type="password"
            placeholder="비밀번호"
            error={errors.password?.message}
            className="rounded-b-md"
          />
        </div>
      </div>
      {error && <div className="text-sm text-red-500 text-center">{error}</div>}
      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white"
          isLoading={isLoading}
        >
          로그인
        </Button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          계정이 없으신가요?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            회원가입
          </Link>
        </p>
      </div>
    </form>
  );
}

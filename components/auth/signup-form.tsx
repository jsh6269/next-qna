"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signUpSchema = z
  .object({
    name: z.string().min(2, "이름은 2글자 이상이어야 합니다"),
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 주소를 입력해주세요"),
    password: z
      .string()
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다")
      .max(100, "비밀번호가 너무 깁니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      router.push("/auth/signin");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <Input
            {...register("name")}
            placeholder="이름"
            error={errors.name?.message}
            className="rounded-t-md"
          />
        </div>
        <div>
          <Input
            {...register("email")}
            type="email"
            placeholder="이메일"
            error={errors.email?.message}
          />
        </div>
        <div>
          <Input
            {...register("password")}
            type="password"
            placeholder="비밀번호"
            error={errors.password?.message}
          />
        </div>
        <div>
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="비밀번호 확인"
            error={errors.confirmPassword?.message}
            className="rounded-b-md"
          />
        </div>
      </div>
      {error && <div className="text-sm text-red-500 text-center">{error}</div>}
      <Button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white"
        isLoading={isLoading}
      >
        회원가입
      </Button>
    </form>
  );
}

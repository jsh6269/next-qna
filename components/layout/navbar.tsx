"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Q&A
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/questions"
                className={`text-sm ${
                  pathname === "/questions"
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                질문 목록
              </Link>
              <Link
                href="/questions/ask"
                className={`text-sm ${
                  pathname === "/questions/ask"
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                질문하기
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className={`text-sm ${
                    pathname === "/profile"
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {session.user.name || session.user.email}
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">로그인</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>회원가입</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

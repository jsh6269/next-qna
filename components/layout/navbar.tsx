"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => {
    return pathname === path
      ? "text-blue-600 dark:text-blue-400"
      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100";
  };

  return (
    <nav className="border-b bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 text-gray-900 dark:text-white font-semibold"
            >
              Q&A 플랫폼
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(
                  "/"
                )}`}
              >
                홈
              </Link>
              <Link
                href="/questions"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(
                  "/questions"
                )}`}
              >
                질문 목록
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {status === "loading" ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className={`text-sm font-medium ${isActive("/profile")}`}
                >
                  {session.user.name || session.user.email}
                </Link>
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="outline"
                  className="text-sm"
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="outline" className="text-sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="text-sm">회원가입</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

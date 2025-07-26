import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = signUpSchema.parse(json);

    const exists = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (exists) {
      return NextResponse.json(
        { message: "이미 가입된 이메일입니다" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "입력값이 올바르지 않습니다" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "회원가입 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

import prisma from "@/libs/prisma/prismaClient";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  title: z.string(),
  message: z.string().optional(),
  status: z.enum(["IN_PROGRESS", "PROCEDING", "NOT_PROCEDING", "DONE"]),
});

export async function POST(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json(
      {
        message: "Missing token",
      },
      { status: 401 }
    );
  }

  const user = session.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user?.email },
      })
    : null;
  if (user == null) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      { status: 401 }
    );
  }

  const data = messageSchema.parse(await request.json());
  console.log(data);

  if (data.message) {
    await prisma.occurenceMessages.create({
      data: {
        title: data.title,
        text: data.message,
        occurrenceId: id,
        userId: user.id,
      },
    });
  }
  if (data.status) {
    await prisma.occurrence.update({
      where: { id },
      data: { status: data.status },
    });
  }
  return NextResponse.json({ message: "updated" });
}

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  const occurrence = await prisma.occurrence.findUnique({
    where: { id },
    include: {
      OccurenceMessages: { include: { user: { select: { name: true } } } },
    },
  });

  if (occurrence == null) {
    return NextResponse.json(
      { message: "occurrence not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(occurrence);
}

export async function DELETE(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  await getServerSession(authOptions);

  await prisma.occurrence.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({ message: "Deleted" });
}

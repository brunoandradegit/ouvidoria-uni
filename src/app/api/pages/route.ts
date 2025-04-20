import schemas from "@/app/admin/(home)/pages/[page]/schemas";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return NextResponse.json({ message: "not logged in" }, { status: 401 });
  }

  const { page, values } = (await request.json()) as {
    page: string;
    values: { [key: string]: string };
  };

  const schema = schemas[page];
  if (schema == null) {
    return NextResponse.json({ message: "schema not found" }, { status: 400 });
  }

  for (const { identifier, type } of schema) {
    const value = values[identifier];

    if (value == null) continue;

    if (type == "image") {
      await prisma.siteImage.upsert({
        where: { page_identifier: { identifier, page } },
        create: { identifier, page, imageUrl: value },
        update: { imageUrl: value },
      });
    } else {
      await prisma.text.upsert({
        where: { page_identifier: { identifier, page } },
        create: { identifier, page, text: value },
        update: { text: value },
      });
    }
  }

  return NextResponse.json({ message: "success" });
}

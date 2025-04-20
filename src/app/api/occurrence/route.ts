import prisma from "@/libs/prisma/prismaClient";
import { Occurrence } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const occurrenceSchema = z.object({
  title: z.string(),
  description: z.string(),
  categoryId: z.number(),
  itemId: z.number(),
  pictures: z.string().array().nullable(),
  student: z
    .object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
    })
    .nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

    const data = occurrenceSchema.parse(body);
    let created: Occurrence;
    console.log(data);
    if (data.student) {
      const student = await prisma.student.upsert({
        where: {
          email: data.student.email,
        },
        create: {
          name: data.student.name,
          email: data.student.email,
          phone: data.student.phone,
        },
        update: {
          name: data.student.name,
          email: data.student.email,
        },
      });

      created = await prisma.occurrence.create({
        data: {
          categoryId: data.categoryId,
          title: data.title,
          description: data.description,
          studentId: student.id,
          itemId: data.itemId,
          ImagesOnOccurrence: {
            create: body.pictures.map((url: string) => ({
              image: { connect: { url } },
            })),
          },
        },
      });
    } else {
      created = await prisma.occurrence.create({
        data: {
          categoryId: data.categoryId,
          title: data.title,
          description: data.description,
          itemId: data.itemId,
          ImagesOnOccurrence: {
            create: body.pictures.map((url: string) => ({
              image: { connect: { url } },
            })),
          },
        },
      });
    }

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.error;
  }
}

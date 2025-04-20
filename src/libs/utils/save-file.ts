import prisma from "@/libs/prisma/prismaClient";
import { Image } from "@prisma/client";
import { writeFileSync } from "fs";
import { extname } from "path";
import sharp from "sharp";
import { v4 } from "uuid";

const siteUrl = process.env.SITE_URL;

export default async function saveFile(file: File): Promise<[string, Image?]> {
  const output = "/uploads/";
  const filePath = output + v4() + extname(file.name);
  const url = siteUrl + filePath;

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(process.cwd() + "/public" + filePath, buffer);

  if (imageMimes.includes(file.type)) {
    const { width, height } = await sharp(buffer).metadata();
    const created = await prisma.image.create({
      data: { url, mime: file.type, width, height },
    });

    return [url, created];
  }

  return [url];
}
const imageMimes = ["image/gif", "image/jpeg", "image/png", "image/svg+xml"];

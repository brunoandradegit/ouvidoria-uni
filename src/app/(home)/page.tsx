import Spinner from "@/app/components/Spinner";
import prisma from "@/libs/prisma/prismaClient";
import HomePage from "../components/home";

export default async function Home() {
  const items = await prisma.item.findMany();
  const categories = await prisma.category.findMany();

  if (!items || !categories) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center justify-between py-12 px-8 subpixel-antialiased md:w-1/3 md:m-auto md:py-12 md:px-8">
      <HomePage items={items} categories={categories} />
    </div>
  );
}

import DataTable from "@/app/components/Admin/Datatable";
import Spinner from "@/app/components/Spinner";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/libs/prisma/prismaClient";
import { Category, Occurrence, User } from "@prisma/client";
import { intlFormat } from "date-fns";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const statuses = {
  IN_PROGRESS: (
    <span className="bg-yellow-100 text-yellow-500 px-3 py-2 rounded">
      Em progresso
    </span>
  ),
  WAITING: (
    <span className="bg-red-100 text-red-500 px-3 py-2 rounded">
      Aguardando
    </span>
  ),
  PROCEDING: (
    <span className="bg-cyan-100 text-cyan-500 px-3 py-2 rounded">
      Procedente
    </span>
  ),
  NOT_PROCEDING: (
    <span className="bg-red-100 text-red-500 px-3 py-2 rounded">
      Não procede
    </span>
  ),
  DONE: (
    <span className="bg-green-100 text-green-500 px-3 py-2 rounded">
      Finalizado
    </span>
  ),
};

type OccurrenceAndCategory = Occurrence & {
  category: Category;
  user: User | null;
};

export default async function home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const user = session.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user?.email },
      })
    : null;
  if (user == null) {
    redirect("/admin/login");
  }

  let data: OccurrenceAndCategory[];

  switch (user.role) {
    case "admin":
      data = await prisma.occurrence.findMany({
        orderBy: {
          created_at: "desc",
        },
        include: {
          category: true,
          user: true,
        },
      });
      break;
    default:
      if (user.categoryId == null) {
        return;
      }
      data = await prisma.occurrence.findMany({
        orderBy: {
          created_at: "desc",
        },
        where: {
          categoryId: user.categoryId,
        },
        include: {
          category: true,
          user: true,
        },
      });

      break;
  }

  if (!data) {
    return <Spinner />;
  }

  return (
    <DataTable
      data={data}
      idExtractor={(data) => data.id}
      titles={["Título", "Status", "Categoria", "Data", "Responsavel", "Abrir"]}
      rowGenerator={(row) => [
        row.title,
        statuses[row.status],
        row.category.name,
        <>
          {intlFormat(
            row.created_at,
            {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            },
            {
              locale: "pt-BR",
            }
          )}
        </>,
        <>
          {row.userId === null ? (
            <span className="bg-red-100 text-red-500 px-3 py-2 rounded">
              Não atribuido
            </span>
          ) : (
            <span className="bg-green-100 text-green-500 px-3 py-2 rounded">
              {row.user?.name}
            </span>
          )}
        </>,
        <Link
          key="link"
          href={`/admin/${row.id}`}
          className="bg-green-300 py-2 px-4 rounded"
        >
          Abrir
        </Link>,
      ]}
    />
  );
}

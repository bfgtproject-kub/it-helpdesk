import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import RoleForm from "./RoleForm";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold">จัดการสิทธิ์ผู้ใช้</h1>
        <p className="text-sm text-zinc-500">ผู้ใช้ทั้งหมด {users.length} คน</p>
      </div>

      <ul className="flex flex-col gap-3">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800"
          >
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-zinc-500">{u.email}</p>
            </div>
            <RoleForm
              userId={u.id}
              currentRole={u.role}
              disabled={u.id === session.user.id}
            />
          </li>
        ))}
      </ul>

      <Link href="/dashboard" className="text-sm text-zinc-500 underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}

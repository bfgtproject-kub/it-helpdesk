import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
import RoleForm from "./RoleForm";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">จัดการสิทธิ์ผู้ใช้</h1>
          <p className="text-sm text-muted">ผู้ใช้ทั้งหมด {users.length} คน</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <ul className="flex flex-col gap-3">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gold/25 bg-card p-4 text-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{u.name}</p>
                  <p className="truncate text-muted">{u.email}</p>
                </div>
              </div>
              <RoleForm
                userId={u.id}
                currentRole={u.role}
                disabled={u.id === session.user.id}
              />
            </li>
          ))}
        </ul>
      </FadeIn>

      <Link href="/dashboard" className="text-sm text-muted underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}

import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";
import SearchFilterBar from "@/components/SearchFilterBar";
import Pagination from "@/components/Pagination";
import RoleForm from "./RoleForm";

const ROLE_LABEL: Record<string, string> = {
  USER: "ผู้ใช้งานทั่วไป",
  IT_STAFF: "เจ้าหน้าที่ IT",
  ADMIN: "ผู้ดูแลระบบ",
};

const PAGE_SIZE = 10;

export default async function AdminUsersPage(props: PageProps<"/admin/users">) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const role = typeof sp.role === "string" ? sp.role : "";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.UserWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(role && Object.values(Role).includes(role as Role) ? { role: role as Role } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltered = q !== "" || role !== "";

  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <Mascot variant="admin" className="pointer-events-none fixed bottom-4 right-4 hidden h-16 w-16 sm:block sm:bottom-6 sm:right-6" />

      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">จัดการสิทธิ์ผู้ใช้</h1>
          <p className="text-sm text-muted">ผู้ใช้ทั้งหมด {total} คน</p>
        </div>
      </FadeIn>

      <Suspense fallback={null}>
        <SearchFilterBar
          searchPlaceholder="ค้นหาชื่อหรืออีเมล..."
          filters={[
            {
              param: "role",
              label: "สิทธิ์",
              options: Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label })),
            },
          ]}
        />
      </Suspense>

      {users.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Mascot variant="admin" className="h-20 w-20" />
          <p className="text-sm text-muted">
            {isFiltered ? "ไม่พบผู้ใช้ที่ตรงกับการค้นหา" : "ยังไม่มีผู้ใช้ในระบบ"}
          </p>
        </div>
      ) : (
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
      )}

      <Suspense fallback={null}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>

      <Link href="/dashboard" className="text-sm text-muted underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}

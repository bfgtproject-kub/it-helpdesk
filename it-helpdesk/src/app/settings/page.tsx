import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";
import SettingsForm from "./SettingsForm";

const ROLE_LABEL: Record<string, string> = {
  USER: "ผู้ใช้งานทั่วไป",
  IT_STAFF: "เจ้าหน้าที่ IT",
  ADMIN: "ผู้ดูแลระบบ",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col gap-6 px-4 py-12">
      <Mascot variant="admin" className="pointer-events-none fixed bottom-4 right-4 hidden h-16 w-16 sm:block sm:bottom-6 sm:right-6" />

      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <Settings className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">ตั้งค่าบัญชี</h1>
          <p className="text-sm text-muted">{ROLE_LABEL[user.role]}</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <SettingsForm
          name={user.name}
          email={user.email}
          image={user.image}
        />
      </FadeIn>

      <Link href="/dashboard" className="text-sm text-muted underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}

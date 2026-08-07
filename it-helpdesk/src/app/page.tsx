import Link from "next/link";
import Hero3D from "@/components/Hero3D";
import TiltCard from "@/components/TiltCard";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4">
      <TiltCard className="flex w-full flex-col items-center gap-6 rounded-2xl border border-gold/25 bg-card px-8 py-12 text-center shadow-[0_25px_70px_-20px_rgba(176,141,87,0.35)]">
        <Hero3D className="h-28 w-28" />

        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-wide text-foreground">
            IT Helpdesk
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            AI-Powered Automated IT Help Desk
            <br />
            and Asset Management System
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-gold/50 px-6 py-2.5 text-sm font-medium text-gold transition hover:bg-gold-wash"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </TiltCard>
    </main>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <div>
        <h1 className="text-3xl font-semibold">IT Helpdesk</h1>
        <p className="mt-2 text-zinc-500">
          AI-Powered Automated IT Help Desk and Asset Management System
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/login"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          เข้าสู่ระบบ
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
        >
          สมัครสมาชิก
        </Link>
      </div>
    </main>
  );
}

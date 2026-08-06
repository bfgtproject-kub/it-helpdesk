import { auth, signOut } from "@/auth";

const ROLE_LABEL: Record<string, string> = {
  USER: "ผู้ใช้งานทั่วไป",
  IT_STAFF: "เจ้าหน้าที่ IT",
  ADMIN: "ผู้ดูแลระบบ",
};

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">แดชบอร์ด</h1>
        <p className="text-sm text-zinc-500">IT Helpdesk & Asset Management</p>
      </div>

      <div className="rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
        <p>
          <span className="text-zinc-500">ชื่อ: </span>
          {user?.name}
        </p>
        <p>
          <span className="text-zinc-500">อีเมล: </span>
          {user?.email}
        </p>
        <p>
          <span className="text-zinc-500">สิทธิ์: </span>
          {user?.role ? ROLE_LABEL[user.role] : "-"}
        </p>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        >
          ออกจากระบบ
        </button>
      </form>
    </main>
  );
}

# IT Helpdesk & Asset Management

ระบบแจ้งซ่อม IT และจัดการทรัพย์สิน พร้อมฟีเจอร์ AI — โปรเจกต์จบ

## Tech stack

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend + Backend | Next.js 16.3 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config, ไม่มี `tailwind.config`) |
| Database | PostgreSQL ผ่าน Supabase |
| ORM | Prisma 7.9 (`prisma-client` generator → `src/generated/prisma`) |
| Auth | NextAuth v5 (Auth.js), credentials + JWT session |
| AI | Anthropic Claude — จัดหมวดหมู่/ประเมินความรุนแรง ticket, chatbot (RAG จาก FAQ), OCR ป้ายทรัพย์สิน, สรุปเทรนด์ |
| Animation | GSAP (ScrollTrigger, SplitText) + Framer Motion |

## ฟีเจอร์หลัก

- **Ticket** — แจ้งปัญหา, AI จัดหมวดหมู่+ความรุนแรงอัตโนมัติ (มี fallback ถ้า AI ล่ม), staff รับงาน/เปลี่ยนสถานะ/บันทึกวิธีแก้
- **ทรัพย์สิน** — CRUD, QR code อัตโนมัติ, OCR อ่านป้ายเก่าด้วย Claude Vision, ยืม-คืน
- **AI Chatbot** — ตอบจากฐานความรู้ FAQ ที่แอดมินดูแล
- **Dashboard** — สรุปสถานะ ticket + ปุ่มสรุปเทรนด์ด้วย AI
- **จัดการผู้ใช้** — เปลี่ยนสิทธิ์ (USER / IT_STAFF / ADMIN), รีเซ็ตรหัสผ่านให้ผู้ใช้ที่ลืมรหัส
- **ตั้งค่าบัญชี** — แก้ชื่อ, รูปโปรไฟล์ (ใส่ลิงก์), เปลี่ยนรหัสผ่าน
- ค้นหา/กรอง/แบ่งหน้าในทุกหน้ารายการ, toast แจ้งผล, skip-link + focus ring ตามมาตรฐาน WCAG AA

## รันในเครื่อง

```bash
cd it-helpdesk
npm install          # postinstall จะรัน prisma generate ให้เอง
npm run dev
```

สร้างไฟล์ `.env` (ดูตัวอย่างจาก `.env.example`):

```
DATABASE_URL="postgresql://..."   # ใช้ Session pooler ของ Supabase
AUTH_SECRET="..."                 # สร้างด้วย: npx auth secret
ANTHROPIC_API_KEY="sk-ant-..."
```

> **DATABASE_URL ต้องใช้ Session pooler เท่านั้น** — connection string แบบ Direct ของ Supabase resolve เป็น IPv6 อย่างเดียว ซึ่งเครื่องที่ไม่มี route IPv6 จะต่อไม่ติด (Prisma error P1001)

รัน migration:

```bash
npx prisma migrate dev
```

## Deploy ขึ้น Vercel

วิธีที่ง่ายที่สุดคือเชื่อม GitHub repo ผ่านหน้าเว็บ Vercel (deploy อัตโนมัติทุกครั้งที่ push)

1. ไปที่ [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → เลือก `bfgtproject-kub/it-helpdesk`
2. **ตั้ง Root Directory เป็น `it-helpdesk`** ⚠️ สำคัญมาก — โค้ด Next.js อยู่ในโฟลเดอร์ย่อย ไม่ได้อยู่ที่ root ของ repo ถ้าไม่ตั้ง Vercel จะหา `package.json` ไม่เจอ
3. ใส่ Environment Variables ทั้ง 3 ตัว (`DATABASE_URL`, `AUTH_SECRET`, `ANTHROPIC_API_KEY`) — ใช้ค่าเดียวกับ `.env` ได้ แต่ **ควรสร้าง `AUTH_SECRET` ใหม่สำหรับ production**
4. กด Deploy

Framework preset (Next.js), build command และ output directory ปล่อยเป็นค่า default ได้

> **หมายเหตุเรื่อง Prisma:** `build` script คือ `prisma generate && next build` โดยตั้งใจ — Prisma client ถูก generate ไปที่ `src/generated/prisma` ซึ่ง **ไม่ได้ commit ลง git** (อยู่ใน `.gitignore`) ถ้าไม่มี `prisma generate` นำหน้า build บน Vercel จะพังทันทีเพราะหา client ไม่เจอ

> **ก่อน deploy เช็คว่า Supabase project ไม่ได้ pause** — free tier จะ pause เองเมื่อไม่มีการใช้งานสักพัก อาการคือ pooler ตอบว่า `XX000 (ENOTFOUND) tenant/user ... not found` แก้ด้วยการกด resume ใน Supabase dashboard

### ถ้า login ไม่ได้หลัง deploy

Auth.js v5 ตรวจจับ host บน Vercel ให้อัตโนมัติ ถ้าเจอปัญหา redirect/CSRF ให้ลองเพิ่ม `AUTH_TRUST_HOST=true` ใน environment variables

## โครงสร้างโปรเจกต์

```
src/
  app/
    actions/        Server Actions (auth, tickets, assets, faq, chatbot, ocr, settings, ...)
    admin/          หน้าแอดมิน (assets, faq, users)
    staff/          หน้าเจ้าหน้าที่ IT
    ...             หน้าผู้ใช้ทั่วไป (tickets, assets, chatbot, settings, dashboard)
  components/       component ที่ใช้ร่วมกัน (Mascot, Toast, SearchFilterBar, ...)
  lib/              prisma client, ticket classifier
  generated/prisma/ Prisma client (generate อัตโนมัติ ไม่ commit)
prisma/
  schema.prisma
  migrations/
```

## หมายเหตุสำหรับผู้พัฒนา

- **ฟอร์มที่เรียก Server Action ต้องไม่ใช้ `<form action={fn}>`** — React 19 จะ reset ค่าในฟอร์มหลัง action ทำงานเสร็จ ทำให้ข้อมูลที่ผู้ใช้พิมพ์หายเวลา validation error ให้ใช้ `useState` + `onSubmit` แล้วเรียก action ตรงๆ ใน `startTransition` แทน (ดูตัวอย่างได้ทุกฟอร์มในโปรเจกต์)
- **ห้ามใส่ class `transition` เปล่าๆ บน element ที่ GSAP animate** — Tailwind's `transition` ครอบคลุม `opacity`/`transform` ซึ่งจะชนกับ GSAP จนบาง element ค้างหายไปเลย ให้ใช้แบบเจาะจงเช่น `transition-shadow`, `transition-colors`
- สิทธิ์ผู้ใช้ถูกเก็บใน JWT ตอน login — เปลี่ยนสิทธิ์แล้วผู้ใช้ต้อง logout/login ใหม่ถึงจะมีผล

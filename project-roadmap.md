# แผนพัฒนาโปรเจ็คจบ
## AI-Powered Automated IT Help Desk and Asset Management System

> เอกสารนี้ทำไว้ให้เปิดตามไปทีละขั้น ไม่ต้องอ่านรวดเดียวจบ — ทำ Phase ไหนเสร็จค่อยติ๊กแล้วไป Phase ถัดไป

---

## ภาพรวม

- ทีม 2 คน → แนะนำแบ่งงานคร่าวๆ: คนหนึ่งเน้น Backend/Database/AI integration, อีกคนเน้น Frontend/UI — แต่ควรเข้าใจทั้งระบบร่วมกัน เพราะตอนสอบกรรมการถามได้ทุกส่วน
- แบ่งงานเป็น **5 Phase** ทำเรียงลำดับ ห้ามข้าม เพราะ Phase หลังพึ่งพา Phase ก่อนหน้า
- หลักการสำคัญ: **ทำให้ระบบ "รันได้จริงแบบไม่มี AI" ให้เสร็จก่อน** แล้วค่อยเพิ่ม AI เข้าไปทีหลัง เพื่อกันเหตุ AI ใช้งานไม่ได้ตอน demo

---

## Tech Stack ที่แนะนำ

| ส่วน | เทคโนโลยี | เหตุผล |
|---|---|---|
| Frontend + Backend | Next.js (App Router) + TypeScript | ทำ frontend/API รวมโปรเจ็คเดียว จัดการง่ายสำหรับทีมเล็ก |
| Styling | Tailwind CSS | ปรับดีไซน์ทันสมัยได้เร็ว |
| Database | PostgreSQL (ผ่าน Supabase) | ฟรี, มี storage เก็บรูปภาพในตัว |
| ORM | Prisma | จัดการ schema/migration ง่าย มี type safety |
| Auth | NextAuth.js | รองรับ role-based (user / it staff / admin) |
| AI (classification, chatbot) | Anthropic API (Claude) | ใช้ตอบ/จัดหมวดหมู่ ticket, ทำ chatbot |
| OCR | Google Cloud Vision API (ฟรี 1,000 ครั้ง/เดือน) | แม่นกว่า OCR ฟรีทั่วไป |
| Deploy | Vercel (app) + Supabase (DB) | ฟรีสำหรับโปรเจ็คนักศึกษา |

---

## Phase 0: เตรียมเครื่องมือ (ก่อนเริ่ม 1 วัน)

- [ ] ติดตั้ง Node.js (LTS version)
- [ ] ติดตั้ง VS Code (มีอยู่แล้วจากรูปที่ส่งมา)
- [ ] ติดตั้ง Claude Code extension ใน VS Code + login ด้วยบัญชี Claude
- [ ] สมัคร Supabase (ฟรี) → สร้าง project ไว้ 1 อัน
- [ ] สมัคร Anthropic API key (console.anthropic.com) ไว้ใช้ตอน Phase 2
- [ ] สร้าง repo บน GitHub ไว้เก็บโค้ด (สำคัญมาก กันงานหาย)

**Prompt แรกที่ใช้กับ Claude Code:**
> "สร้างโปรเจ็ค Next.js (App Router, TypeScript, Tailwind) ชื่อ it-helpdesk พร้อม setup Prisma ต่อกับ PostgreSQL"

---

## Phase 1: โครงสร้างพื้นฐาน (Foundation)

เป้าหมาย: ระบบ CRUD ครบ ใช้งานได้จริงแม้ยังไม่มี AI

- [ ] ออกแบบ Database schema (User, Ticket, Asset, AssetLoan, Category)
- [ ] ระบบ Login/Register + แบ่ง role (User / IT Staff / Admin)
- [ ] User: แจ้งปัญหา (สร้าง ticket) + ดูสถานะของตัวเอง
- [ ] IT Staff: ดู ticket ทั้งหมด, รับงาน, เปลี่ยนสถานะ, บันทึกวิธีแก้
- [ ] Admin: จัดการ Asset (เพิ่ม/แก้/ลบ), จัดการสิทธิ์ผู้ใช้
- [ ] ระบบยืม-คืน Asset แบบพื้นฐาน (เลือกจาก list ก่อน ยังไม่ต้องใช้ OCR)
- [ ] Dashboard เบื้องต้น (นับจำนวน ticket ตามสถานะ, กราฟง่ายๆ)

**Milestone Phase 1:** เดินสาธิตได้ครบ flow ตั้งแต่ login → แจ้งปัญหา → staff รับงาน → ปิดงาน โดยไม่มี error

---

## Phase 2: ใส่ฟีเจอร์ AI

เป้าหมาย: เสริม "ความฉลาด" เข้าไปในระบบที่รันได้อยู่แล้ว

- [ ] **AI จัดหมวดหมู่ + ประเมินความรุนแรง:** ส่งข้อความ ticket ไป Claude API ให้ตอบกลับเป็น JSON (หมวดหมู่ + severity) — เขียน fallback ไว้ด้วย ถ้า AI เรียกไม่ได้ให้ default เป็น "รอตรวจสอบ"
- [ ] **AI Chatbot:** ทำฐานความรู้ FAQ ปัญหาที่พบบ่อย (เก็บใน DB) แล้วให้ Claude ตอบโดยอ้างอิงจากฐานนั้น (RAG แบบง่าย — ดึงข้อความที่เกี่ยวข้องมาใส่ prompt)
- [ ] **QR Code สำหรับ Asset ใหม่:** generate QR ตอนเพิ่มทรัพย์สินเข้าระบบ (สแกนง่าย แม่นยำกว่า OCR)
- [ ] **OCR สำหรับป้ายเก่า:** อัปโหลดรูป → Google Vision API อ่านตัวอักษร → จับคู่กับข้อมูลในระบบ
- [ ] **Trend summary บน Dashboard:** สรุปสถิติ (จำนวน ticket ต่อหมวด/เดือน) แล้วให้ Claude เขียนสรุป insight สั้นๆ ต่อท้ายกราฟ

**Milestone Phase 2:** ฟีเจอร์ AI ทุกตัวมี fallback ถ้า API ล่มหรือ error ระบบหลักต้องไม่พัง

---

## Phase 3: ปรับ UI/UX ให้สวยทันสมัย

- [ ] เลือกธีมสี + font ให้เป็นเอกลักษณ์ (ดูตัวอย่างสไตล์ dark/futuristic ที่คุยกันไว้ก่อนหน้าได้)
- [ ] ทำ responsive ให้ใช้ได้ทั้งมือถือ/จอใหญ่
- [ ] เพิ่ม loading state, error handling ให้ดูเป็นระบบมืออาชีพ
- [ ] ทดสอบกับผู้ใช้จริง (เพื่อน/อาจารย์) หา bug

---

## Phase 4: เอกสาร + เตรียมสอบ

- [ ] Deploy ขึ้นจริง (Vercel + Supabase)
- [ ] เขียนเล่มโครงงานฉบับเต็ม (บทที่ 1-5 ตามรูปแบบมหาลัย)
- [ ] ทำ slide นำเสนอ + สคริปต์ demo
- [ ] เตรียมคำตอบสำหรับคำถามที่กรรมการมักถาม: ทำไมเลือก tech นี้, ข้อจำกัดของระบบ, แนวทางพัฒนาต่อ (future work)

---

## วิธีใช้ Claude Code ทำงานแต่ละขั้น (สำหรับมือใหม่)

1. เปิดโฟลเดอร์โปรเจ็คใน VS Code แล้วเปิด panel Claude Code (ไอคอนด้านซ้าย ตามรูปที่ส่งมา)
2. **สั่งทีละฟีเจอร์เล็กๆ** อย่าสั่งให้ทำทั้งระบบในทีเดียว เช่น สั่งทำแค่ "ระบบ login" ก่อน ตรวจสอบว่าใช้ได้ค่อยสั่งฟีเจอร์ถัดไป
3. ถ้างานซับซ้อน ให้ลองใช้ **Plan mode** ก่อน (ให้ Claude คิดแผนไฟล์/โครงสร้างมาให้ดูก่อน ค่อยกด approve ให้ลงมือทำจริง)
4. **Commit code บ่อยๆ** หลังแต่ละฟีเจอร์เสร็จและทดสอบผ่านแล้ว (`git commit`) กันโค้ดพังแล้วย้อนกลับไม่ได้
5. ถ้า Claude Code แก้โค้ดแล้วพัง ให้บอกตรงๆ ว่า error อะไร (copy ข้อความ error มาวางให้ดู) จะแก้ได้ตรงจุดกว่าบอกลอยๆ

---

## หมายเหตุ

ปรับสัดส่วนเวลาแต่ละ Phase ตามกำหนดส่งจริงของอาจารย์ได้เลย — โครงสร้างลำดับ Phase คือสิ่งที่ควรคงไว้ (Foundation ก่อน AI เสมอ)

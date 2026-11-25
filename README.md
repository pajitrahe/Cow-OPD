# Mastitis Herd Analytics

แอปมือถือ (PWA) สำหรับบันทึกและสรุปข้อมูลโคเต้านมอักเสบของ One Stop Dairy Farm ข้อมูลทั้งหมดเก็บใน Firebase (Firestore + Authentication) ส่วน repository นี้เก็บเฉพาะไฟล์ตัวแอป ไม่มีข้อมูลฟาร์ม

## ไฟล์ใน repository

| ไฟล์ | หน้าที่ |
| --- | --- |
| `index.html` | ตัวแอปทั้งหมด |
| `firebase-config.js` | ค่าเชื่อมต่อโปรเจกต์ Firebase `mastitis-analyticstool` (ไม่ใช่ความลับ) |
| `manifest.webmanifest`, `icons/` | ข้อมูลและไอคอนสำหรับติดตั้งลงมือถือ |
| `sw.js` | service worker ให้แอปเปิดได้แม้ไม่มีสัญญาณ |
| `firestore.rules` | กฎความปลอดภัยของฐานข้อมูล (วางใน Firebase Console > Firestore > Rules) |
| `.nojekyll` | บอก GitHub Pages ให้เผยแพร่ไฟล์ตามที่เป็น |

## เผยแพร่ด้วย GitHub Pages

1. Settings > Pages > Build and deployment > Source = **Deploy from a branch**
2. Branch = `main`, โฟลเดอร์ = `/ (root)` แล้วกด Save
3. รอประมาณ 1–2 นาที จะได้ลิงก์ `https://<ชื่อผู้ใช้>.github.io/<ชื่อ repository>/`
4. Firebase Console > Authentication > Settings > Authorized domains > Add domain ใส่ `<ชื่อผู้ใช้>.github.io`
5. เปิดลิงก์ใหม่บนมือถือ แล้วติดตั้งลงหน้าจอ (Android: Chrome > ⋮ > ติดตั้งแอป · iPhone: Safari > แชร์ > เพิ่มไปยังหน้าจอโฮม)

ถ้าเปลี่ยนจาก Netlify ผู้ใช้ต้องติดตั้งแอปใหม่จากลิงก์ GitHub และเข้าสู่ระบบใหม่ ข้อมูลไม่หาย เพราะอยู่ใน Firebase

## อัปเดตแอป

1. Add file > Upload files แล้วลากไฟล์เวอร์ชันใหม่ทับ
2. กด Commit changes แล้ว GitHub Pages จะอัปเดตเองภายใน 1–2 นาที
3. ถ้าแก้ `sw.js` ให้เปลี่ยนค่า `VERSION` ทุกครั้ง มือถือจะได้เวอร์ชันใหม่เมื่อเปิดแอปตอนออนไลน์

## ข้อควรระวัง

- **ห้ามอัปโหลดไฟล์ข้อมูลฟาร์ม** เช่น `seed/seed.json` ไฟล์ Excel รายชื่อโค หรือผลเพาะเชื้อ เพราะเว็บ GitHub Pages เปิดให้ทุกคนเข้าถึงได้
- ผู้ใช้และสิทธิ์จัดการในแอป แท็บ ⚙ ผู้ใช้ (เฉพาะบัญชีที่ `role` = `admin`)
- คู่มือการใช้งานฉบับสัตวแพทย์และสัตวบาลอยู่ในเอกสารคู่มือแยกต่างหาก

## อัปเกรดเป็นเวอร์ชัน 2.0

1. อัปโหลดไฟล์ทั้งหมดในชุดนี้ทับของเดิม รวมถึงไฟล์ฟอนต์ `THSarabunNew*.ttf` (ใช้ในรายงาน PDF/Excel/PowerPoint)
2. เปิด Firebase Console > Firestore Database > Rules แล้ววางเนื้อหา `firestore.rules` ชุดใหม่ กด Publish
   - สมาชิกทุกคนนำเข้ารายชื่อโค ผลเพาะเชื้อ ผล SCC แก้ฐานข้อมูลยา สำรอง/กู้คืน และบันทึกเคสได้
   - บทบาท `admin` ใช้จัดการรายชื่อผู้ใช้ (แท็บผู้ใช้) เท่านั้น
   - ประวัติการแก้ไข (`audit`) เพิ่มได้อย่างเดียว ลบหรือแก้ย้อนหลังไม่ได้
3. เคสเดิมทั้งหมดใช้ต่อได้ทันที ไม่ต้องนำเข้าใหม่ ฐานข้อมูลยาเริ่มต้นจะถูกสร้างให้เมื่อผู้ดูแลกด "โหลดข้อมูลฟาร์ม" หรือเพิ่มยาในแท็บฐานข้อมูลโค&เพาะเชื้อ > ฐานข้อมูลยา

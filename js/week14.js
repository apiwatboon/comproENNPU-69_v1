/* ============================================================
   week14.js — สัปดาห์ที่ 14: นำเสนอโปรเจกต์ + ทบทวนปลายภาค
   (เช็คลิสต์ก่อนขึ้นเวที จำค่าใน localStorage,
    ข้อสอบจำลองปลายภาคเน้นบท 9–12)
   ============================================================ */

// ---------- เช็คลิสต์ก่อนขึ้นเวทีนำเสนอ ----------
(function stageChecklist() {
  const list = document.getElementById('stageChecklist');
  const fill = document.getElementById('stFill');
  const text = document.getElementById('stText');
  if (!list) return;

  const KEY = 'cp-week14-stage';
  const boxes = list.querySelectorAll('input[type="checkbox"]');

  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { saved = []; }

  function render() {
    let done = 0;
    boxes.forEach((box) => {
      box.closest('.check-item').classList.toggle('done', box.checked);
      if (box.checked) done++;
    });
    fill.style.width = Math.round((done / boxes.length) * 100) + '%';
    text.textContent = done === boxes.length
      ? '🎤 ครบ ' + boxes.length + ' ข้อ — ขึ้นเวทีได้อย่างมั่นใจ!'
      : 'พร้อม ' + done + ' จาก ' + boxes.length + ' ข้อ';
  }

  boxes.forEach((box) => {
    const id = parseInt(box.dataset.ck, 10);
    box.checked = saved.indexOf(id) !== -1;
    box.addEventListener('change', () => {
      const checked = [];
      boxes.forEach((b) => { if (b.checked) checked.push(parseInt(b.dataset.ck, 10)); });
      try { localStorage.setItem(KEY, JSON.stringify(checked)); } catch (e) { /* โหมดไม่เก็บข้อมูลก็ใช้ต่อได้ */ }
      render();
      if (box.checked && typeof gsap !== 'undefined') {
        gsap.fromTo(box.closest('.check-item'), { scale: 0.98 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      }
    });
  });

  render();
})();

// ---------- ข้อสอบจำลองปลายภาค: เน้นบท 9–12 + บูรณาการ (ภาษาซี) ----------
window.QUIZ_QUESTIONS = [
  {
    q: '[บทที่ 9] int area(int w, int h) { return w * h; } — printf("%d", area(3, 4)); แสดงค่าใด?',
    opts: ['7', '12', 'w * h', '0'],
    ans: 1,
    explain: 'อาร์กิวเมนต์ 3, 4 ถูกส่งเข้า w, h ตามลำดับ → return 3 × 4 = 12 กลับมาให้ printf — ค่าที่ return เอาไปใช้ต่อในนิพจน์ได้ทันที'
  },
  {
    q: '[บทที่ 9] ฟังก์ชันคำนวณภาษีประกาศตัวแปร vat ข้างใน — โค้ดใน main เรียก printf ค่า vat ตรง ๆ จะเกิดอะไร?',
    opts: ['แสดงค่า vat ล่าสุด', 'แสดง 0', "คอมไพล์ไม่ผ่าน: error 'vat' undeclared", 'แสดงค่าขยะ'],
    ans: 2,
    explain: 'ตัวแปรที่ประกาศในฟังก์ชันเป็น local — โลกภายนอกไม่รู้จักเลย คอมไพเลอร์ฟ้อง undeclared ทันที ต้องการค่าต้องส่งออกทาง return เท่านั้น'
  },
  {
    q: '[บทที่ 10] int L[4] = {5, 10, 15, 20}; — ค่าของ L[1] และดัชนีของ "ตัวสุดท้าย" คือข้อใด?',
    opts: ['5 และ 4', '10 และ 3', '10 และ 4', '5 และ 3'],
    ans: 1,
    explain: 'ดัชนีเริ่ม 0: L[1] = 10 และ 4 ช่องมีดัชนี 0–3 ตัวสุดท้ายคือ L[3] — สองกับดักรวมในข้อเดียว'
  },
  {
    q: '[บทที่ 10] temps มี n ค่า — ค่าเฉลี่ยที่ "ถูกต้อง" เขียนอย่างไร?',
    opts: [
      'avg = sum / n; (ทั้งคู่เป็น int)',
      'avg = (float) sum / n;',
      'avg = average(temps);',
      'avg = temps.mean();'
    ],
    ans: 1,
    explain: 'ภาษาซีไม่มีฟังก์ชันเฉลี่ยสำเร็จรูป และ sum / n ที่เป็น int ทั้งคู่จะตัดเศษทิ้ง! ต้องแปลงเป็น (float) ก่อนหาร — กับดักบทที่ 5 ที่ตามมาหลอกถึงบทอาร์เรย์'
  },
  {
    q: '[บทที่ 11] จะเก็บคำว่า "ROBOT" (5 ตัวอักษร) อาร์เรย์ char ต้องมีอย่างน้อยกี่ช่อง เพราะอะไร?',
    opts: [
      '5 ช่อง — เท่าจำนวนตัวอักษรพอดี',
      '6 ช่อง — ต้องเผื่อที่ให้ \\0 ปิดท้ายหนึ่งช่อง',
      '10 ช่อง — ต้องเผื่อสองเท่าเสมอ',
      '4 ช่อง — ดัชนีเริ่มที่ศูนย์'
    ],
    ans: 1,
    explain: 'สตริงซีต้องมี \\0 ปิดท้ายเสมอ: 5 ตัวอักษร + \\0 = อย่างน้อย char s[6] — ลืมเผื่อช่อง \\0 คือบั๊กสตริงอันดับหนึ่ง'
  },
  {
    q: '[บทที่ 11] การตรวจว่าข้อความ user ตรงกับ "admin" หรือไม่ ข้อใดถูกต้อง?',
    opts: [
      'if (user == "admin")',
      'if (strcmp(user, "admin") == 0)',
      'if (strcmp(user, "admin") == 1)',
      'if (strlen(user) == strlen("admin"))'
    ],
    ans: 1,
    explain: 'strcmp คืน 0 เมื่อเนื้อหาเท่ากัน (จุดสวนความรู้สึกที่ข้อสอบรัก!) — ส่วน == เทียบตำแหน่งหน่วยความจำ ไม่ใช่เนื้อหา และความยาวเท่ากันไม่ได้แปลว่าข้อความเดียวกัน'
  },
  {
    q: '[บทที่ 12] โปรแกรมบันทึกผล QC ต่อท้ายไฟล์เดิมทุกวัน ควรเปิดไฟล์ด้วยข้อใด?',
    opts: [
      'fopen("qc.txt", "r")',
      'fopen("qc.txt", "w")',
      'fopen("qc.txt", "a")',
      'fopen("qc.txt")'
    ],
    ans: 2,
    explain: 'โหมด "a" (append) เขียนต่อท้ายโดยเก็บของเดิมครบ — ถ้าเผลอใช้ "w" ข้อมูล QC ทั้งเดือนหายเหลือแค่วันล่าสุด (และ fopen ต้องระบุโหมดเสมอ)'
  },
  {
    q: '[บทที่ 12] หลัง FILE *fp = fopen("data.csv", "r"); บรรทัดถัดไปที่ "ขาดไม่ได้" คือข้อใด?',
    opts: [
      'fclose(fp);',
      'if (fp == NULL) { แจ้งเตือนและออก }',
      'fprintf(fp, "เริ่ม");',
      'free(fp);'
    ],
    ans: 1,
    explain: 'ไฟล์อาจไม่มีอยู่ → fopen คืน NULL — ใช้ fp ที่เป็น NULL ต่อคือโปรแกรมพังทันที ตรวจก่อนเสมอ (ส่วน fclose คือตอน "จบ" การใช้งาน ไม่ใช่บรรทัดถัดไป)'
  },
  {
    q: '[บูรณาการ] int count_pass(int s[], int n) { int c = 0; for (int i = 0; i < n; i++) if (s[i] >= 60) c++; return c; } — เรียก count_pass กับ {70, 50, 80, 60} จะคืนค่าใด?',
    opts: ['2', '3', '4', '210'],
    ans: 1,
    explain: 'ไล่ทีละตัว: 70 ≥ 60 นับ ✓ · 50 ✗ · 80 ✓ · 60 ≥ 60 นับ ✓ (>= รวมค่าเท่า!) = 3 — ฟังก์ชัน + อาร์เรย์ + ลูป + เงื่อนไข + ตัวสะสม ครบห้าบทในข้อเดียว แบบฉบับข้อสอบปลายภาค'
  },
  {
    q: '[บูรณาการ] ลูปเมนูของโปรเจกต์ใช้ do { ... scanf เมนู ... } while (choice != 0); — ทำไมใช้ do-while แทน while?',
    opts: [
      'เพราะ do-while เร็วกว่า',
      'เพราะต้องแสดงเมนูและถามผู้ใช้ "อย่างน้อยหนึ่งครั้ง" ก่อนจะรู้ว่าเขาเลือกออกหรือไม่',
      'เพราะ while ใช้กับ scanf ไม่ได้',
      'ไม่มีเหตุผล ใช้แทนกันได้เหมือนกันทุกกรณี'
    ],
    ans: 1,
    explain: 'เมนูต้องโชว์ก่อนถึงจะรู้ว่าผู้ใช้เลือกอะไร — do-while การันตีทำรอบแรกเสมอแล้วค่อยตรวจเงื่อนไข จึงเป็นโครงมาตรฐานของโปรแกรมเมนูแทบทุกตัว รวมถึงโปรเจกต์ของคุณ'
  }
];


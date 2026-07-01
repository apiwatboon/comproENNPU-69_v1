/* ============================================================
   week07.js — คาบที่ 9: ฟังก์ชัน (ภาษาซี)
   (ปุ่มรันโค้ด, ตัวไล่เส้นทางการเรียกฟังก์ชัน, เครื่องจักรฟังก์ชัน,
    คำถามแบบทดสอบ)
   ============================================================ */

// ---------- ปุ่ม "▶ คอมไพล์และรัน" : แสดงผลลัพธ์ที่ฝังไว้ใน data-output ----------
(function runButtons() {
  document.querySelectorAll('.run-btn[data-output]').forEach((btn) => {
    const out = btn.parentElement.querySelector('.code-output');
    if (!out) return;
    btn.addEventListener('click', () => {
      out.textContent = '';
      out.classList.add('show');
      btn.textContent = '✓ รันแล้ว — กดอีกครั้งเพื่อรันซ้ำ';
      const text = btn.dataset.output;
      let i = 0;
      const timer = setInterval(() => {
        out.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(timer);
      }, 14);
    });
  });
})();

// ---------- ตัวไล่เส้นทางการเรียกฟังก์ชัน: เห็นโปรแกรม "กระโดด" ----------
(function callFlowStepper() {
  const code = document.getElementById('flowCode');
  const btnStep = document.getElementById('flowStep');
  const btnReset = document.getElementById('flowReset');
  if (!code || !btnStep) return;

  const out = document.getElementById('flowOut');
  const desc = document.getElementById('flowDesc');
  const lines = {};
  code.querySelectorAll('.pyline').forEach((el) => (lines[el.dataset.line] = el));

  // ลำดับจริง: คอมไพเลอร์จำนิยาม → main เริ่ม → เรียก → กระโดดเข้า → กลับมา → ...
  const steps = [
    { line: 1, desc: 'คอมไพเลอร์อ่านนิยาม greet: "จำสูตร" ไว้เฉย ๆ — บรรทัด 2 ยังไม่ทำงาน!' },
    { line: 3, desc: 'โปรแกรมเริ่มทำงานที่ main() เสมอ — ไม่ใช่บรรทัดแรกของไฟล์' },
    { line: 4, desc: 'เรียก greet("ฝน"); → กำลังจะกระโดดขึ้นไปทำในฟังก์ชัน โดยพารามิเตอร์ name รับค่า "ฝน"' },
    { line: 2, out: 'สวัสดีคุณฝน ยินดีต้อนรับ', desc: 'กระโดดเข้าฟังก์ชัน! printf ทำงานด้วย name = "ฝน" — เสร็จแล้วจะ "กลับไปที่จุดเรียก"' },
    { line: 5, desc: 'กลับมาทำต่อบรรทัดถัดไปใน main: เรียก greet("เมฆ"); → กระโดดขึ้นไปอีกรอบ คราวนี้ name = "เมฆ"' },
    { line: 2, out: 'สวัสดีคุณเมฆ ยินดีต้อนรับ', desc: 'บรรทัด 2 ทำงานรอบที่สอง ด้วยค่าใหม่ — โค้ดบรรทัดเดียว ใช้ซ้ำได้ไม่จำกัด นี่คือพลังของฟังก์ชัน' },
    { line: 6, out: 'จบโปรแกรม', desc: 'กลับมาจบที่บรรทัด 6 — สรุปลำดับที่ทำงานจริง: 1 → 3 → 4 → 2 → 5 → 2 → 6 ไม่ใช่บนลงล่างเฉย ๆ!' },
  ];

  let pos = -1;
  const printed = [];

  btnStep.addEventListener('click', () => {
    if (pos >= steps.length - 1) return;
    pos++;
    const s = steps[pos];
    Object.keys(lines).forEach((k) => lines[k].classList.remove('active'));
    lines[s.line].classList.add('active');
    if (typeof gsap !== 'undefined') gsap.fromTo(lines[s.line], { x: -6 }, { x: 0, duration: 0.25, ease: 'power2.out' });
    if (s.out) {
      printed.push(s.out);
      out.textContent = printed.join('\n');
    }
    desc.textContent = s.desc;
    if (pos >= steps.length - 1) {
      btnStep.disabled = true;
      btnStep.textContent = 'จบโปรแกรม ✓';
    }
  });

  btnReset.addEventListener('click', () => {
    pos = -1;
    printed.length = 0;
    btnStep.disabled = false;
    btnStep.textContent = 'รันทีละขั้น ▶';
    Object.keys(lines).forEach((k) => lines[k].classList.remove('active'));
    out.textContent = '— หน้าจอผลลัพธ์ (Console) —';
    desc.textContent = 'เริ่มกันเลย — เดาก่อนไหมว่าบรรทัดไหนทำงานเป็นลำดับแรก?';
  });
})();

// ---------- เครื่องจักรฟังก์ชัน: พารามิเตอร์เข้า → return ออก ----------
(function functionMachine() {
  const select = document.getElementById('fnSelect');
  const input = document.getElementById('fnInput');
  const btnRun = document.getElementById('fnRun');
  if (!select || !btnRun) return;

  const inBox = document.getElementById('fnIn');
  const box = document.getElementById('fnBox');
  const outBox = document.getElementById('fnOut');
  const codeEl = document.getElementById('fnCode');

  const MACHINES = {
    c_to_f: {
      sig: 'c_to_f(c)',
      code: 'float c_to_f(float c) {\n    return c * 9 / 5 + 32;\n}',
      run: (x) => Math.round((x * 9 / 5 + 32) * 100) / 100,
      hint: 'แปลงอุณหภูมิ คืน float',
    },
    square_area: {
      sig: 'square_area(side)',
      code: 'int square_area(int side) {\n    return side * side;\n}',
      run: (x) => Math.trunc(x) * Math.trunc(x),
      hint: 'คำนวณพื้นที่ คืน int',
    },
    is_even: {
      sig: 'is_even(n)',
      code: 'int is_even(int n) {\n    return n % 2 == 0;\n}',
      run: (x) => (Math.trunc(x) % 2 === 0 ? '1 (จริง)' : '0 (เท็จ)'),
      hint: 'ตรวจเลขคู่ คืน 1/0',
    },
  };

  function updateMachine() {
    const m = MACHINES[select.value];
    box.innerHTML = m.sig + '<small>' + m.hint + '</small>';
    codeEl.textContent = m.code;
    outBox.textContent = '?';
  }

  btnRun.addEventListener('click', () => {
    const m = MACHINES[select.value];
    const x = parseFloat(input.value) || 0;
    inBox.textContent = x;
    outBox.textContent = '...';
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      tl.fromTo(inBox.parentElement, { scale: 1 }, { scale: 1.1, yoyo: true, repeat: 1, duration: 0.2 })
        .fromTo(box, { scale: 1 }, { scale: 1.08, yoyo: true, repeat: 1, duration: 0.25 })
        .call(() => { outBox.textContent = m.run(x); })
        .fromTo(outBox.parentElement, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: 'back.out(2.5)' });
    } else {
      outBox.textContent = m.run(x);
    }
  });

  select.addEventListener('change', updateMachine);
  updateMachine();
})();

// ---------- คำถามแบบทดสอบท้ายคาบ (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'รูปแบบการนิยามฟังก์ชันภาษาซีที่ถูกต้องคือข้อใด?',
    opts: [
      'function add(a, b) { ... }',
      'int add(int a, int b) { ... }',
      'def add(a, b):',
      'add(int a, int b) returns int'
    ],
    ans: 1,
    explain: 'ภาษาซีต้องระบุ "ชนิดค่าที่คืน" นำหน้า ตามด้วยชื่อและพารามิเตอร์ที่ระบุชนิดทุกตัว: int add(int a, int b) — ไม่มีคำว่า function หรือ def'
  },
  {
    q: 'คำว่า void หน้าชื่อฟังก์ชัน เช่น void show_menu() หมายความว่าอะไร?',
    opts: [
      'ฟังก์ชันนี้ว่างเปล่า ไม่มีโค้ด',
      'ฟังก์ชันนี้ทำงานแต่ "ไม่คืนค่า" กลับมา',
      'ฟังก์ชันนี้รับพารามิเตอร์ไม่ได้',
      'ฟังก์ชันนี้เรียกได้ครั้งเดียว'
    ],
    ans: 1,
    explain: 'void = ไม่คืนค่า — เหมาะกับฟังก์ชันที่ "ทำงาน" อย่างเดียว เช่น แสดงเมนู พิมพ์หัวรายงาน — เอาผลไปเก็บใส่ตัวแปรไม่ได้เพราะไม่มีอะไรส่งกลับมา'
  },
  {
    q: 'จาก float shipping_fee(float weight) การเรียก shipping_fee(3.5) — ข้อใดถูกต้อง?',
    opts: [
      'weight คืออาร์กิวเมนต์, 3.5 คือพารามิเตอร์',
      'weight คือพารามิเตอร์, 3.5 คืออาร์กิวเมนต์',
      'ทั้งคู่เรียกว่าพารามิเตอร์',
      'ทั้งคู่เรียกว่าอาร์กิวเมนต์'
    ],
    ans: 1,
    explain: 'พารามิเตอร์คือ "ช่องรับ" ในนิยาม (weight) ส่วนอาร์กิวเมนต์คือ "ค่าจริง" ที่ส่งตอนเรียก (3.5) — จำ: Parameter อยู่กับนิยาม, Argument อยู่กับการเรียก'
  },
  {
    q: 'ความแตกต่างสำคัญที่สุดระหว่าง return กับ printf ในฟังก์ชันคือข้อใด?',
    opts: [
      'return แสดงผลสวยกว่า printf',
      'printf เร็วกว่า return',
      'return ส่งค่ากลับให้โค้ดที่เรียกเอาไปใช้ต่อได้ ส่วน printf แค่แสดงขึ้นจอ',
      'ใช้แทนกันได้ทุกกรณี'
    ],
    ans: 2,
    explain: 'return คือการส่งมอบผลลัพธ์ให้โปรแกรม (เก็บใส่ตัวแปร คำนวณต่อได้) ส่วน printf ส่งให้ "ตาคน" เท่านั้น — ฟังก์ชันคำนวณที่ดีควร return แล้วให้ผู้เรียกตัดสินใจเองว่าจะแสดงหรือไม่'
  },
  {
    q: 'ทำไมธรรมเนียมเริ่มต้นจึงเขียนนิยามฟังก์ชันไว้ "เหนือ" main()?',
    opts: [
      'เพื่อความสวยงามเท่านั้น',
      'เพราะคอมไพเลอร์อ่านบนลงล่าง ต้องรู้จักฟังก์ชันก่อนถึงจุดที่ถูกเรียก',
      'เพราะ main ต้องอยู่บรรทัดสุดท้ายของไฟล์เสมอ',
      'เพราะฟังก์ชันที่อยู่ใต้ main จะรันก่อน'
    ],
    ans: 1,
    explain: 'คอมไพเลอร์อ่านไฟล์จากบนลงล่าง — เจอการเรียกฟังก์ชันที่ยังไม่รู้จักจะฟ้องหรือเตือนทันที จึงนิยามไว้ก่อน main (ภายหลังจะได้เรียนการประกาศโครงหรือ prototype เพื่อแก้ข้อจำกัดนี้)'
  },
  {
    q: 'ไล่โค้ด: int twice(int x) { return x * 2; } แล้วรัน printf("%d", twice(3) + 1); จะแสดงค่าใด?',
    opts: ['6', '7', '61', 'คอมไพล์ไม่ผ่าน'],
    ans: 1,
    explain: 'twice(3) คืนค่า 6 กลับมา แล้วบวก 1 ได้ 7 — เห็นพลังของ return ไหม? ค่าที่คืนมาเอาไปคำนวณต่อในนิพจน์ได้เลย ถ้าข้างในเป็น printf จะทำแบบนี้ไม่ได้'
  },
  {
    q: 'ตัวแปรที่ประกาศ "ภายในฟังก์ชัน" มีคุณสมบัติอย่างไร?',
    opts: [
      'ใช้ได้ทุกที่ในโปรแกรม',
      'เป็น local — ใช้ได้เฉพาะในฟังก์ชันนั้น และหายไปเมื่อฟังก์ชันจบ',
      'ถูกเก็บถาวรจนปิดเครื่อง',
      'ใช้ได้ในฟังก์ชันอื่นที่นิยามไฟล์เดียวกัน'
    ],
    ans: 1,
    explain: 'ตัวแปร local เกิดเมื่อฟังก์ชันถูกเรียกและตายเมื่อฟังก์ชันจบ — อ้างถึงจากข้างนอกจะคอมไพล์ไม่ผ่าน (undeclared) อยากได้ค่าต้องส่งออกทาง return เท่านั้น'
  },
  {
    q: 'จาก greet.c ในบทเรียน (นิยาม greet บรรทัด 1–2, main บรรทัด 3, เรียก 2 ครั้งบรรทัด 4–5) ลำดับบรรทัดที่ "ทำงานจริง" คือข้อใด?',
    opts: ['1 → 2 → 3 → 4 → 5 → 6', '1 → 3 → 4 → 2 → 5 → 2 → 6', '3 → 4 → 5 → 6 → 1 → 2', '2 → 2 → 4 → 5 → 6'],
    ans: 1,
    explain: 'นิยามแค่ถูกจำ (บรรทัด 2 ยังไม่ทำ) → main เริ่ม → เรียกครั้งแรกกระโดดเข้าบรรทัด 2 → กลับมาเรียกครั้งสอง → บรรทัด 2 อีกรอบ → จบ — ลองกดตัวไล่เส้นทางในบทเรียนดูอีกครั้งได้'
  },
  {
    q: 'เหตุผลข้อใด "ไม่ใช่" ประโยชน์ของการแบ่งโปรแกรมเป็นฟังก์ชัน?',
    opts: [
      'ลดการเขียนโค้ดซ้ำ แก้ที่เดียวมีผลทุกจุด',
      'อ่านและแบ่งงานในทีมง่ายขึ้น',
      'ทดสอบแยกทีละชิ้นได้',
      'ทำให้โปรแกรมรันเร็วขึ้นเสมอ'
    ],
    ans: 3,
    explain: 'ฟังก์ชันไม่ได้ทำให้โปรแกรมเร็วขึ้น (จริง ๆ มีต้นทุนการเรียกนิดหน่อยด้วยซ้ำ) — ประโยชน์ของมันคือเรื่อง "คน": ลดซ้ำ อ่านง่าย แบ่งงานได้ ทดสอบเป็นชิ้น'
  },
  {
    q: 'ไล่โค้ด: int add(int a, int b) { return a + b; } แล้ว int x = add(2, 3); int y = add(x, 4); สุดท้าย y มีค่าใด?',
    opts: ['5', '7', '9', '24'],
    ans: 2,
    explain: 'add(2, 3) คืน 5 เก็บใน x → add(x, 4) = add(5, 4) คืน 9 — การส่ง "ผลของฟังก์ชัน" ต่อเป็นอาร์กิวเมนต์ของรอบถัดไป คือท่าประกอบร่างที่ใช้ทุกวันในงานจริง'
  }
];

/* ============================================================
   week06.js — บทที่ 6: โครงสร้างควบคุมแบบเลือกทำ
   (ปุ่มรันโค้ด, เครื่องตัดเกรดไล่เงื่อนไข, เครื่องคิดค่าไฟขั้นบันได,
    คำถามแบบทดสอบ)
   ============================================================ */

// ---------- ปุ่ม "▶ รันโค้ด" : แสดงผลลัพธ์ที่ฝังไว้ใน data-output ----------
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

// ---------- เครื่องตัดเกรด: ไล่เงื่อนไข if–else if–else แบบเห็นภาพ ----------
(function gradeSimulator() {
  const input = document.getElementById('gradeScore');
  const btn = document.getElementById('gradeCheck');
  const display = document.getElementById('gradeDisplay');
  const desc = document.getElementById('gradeDesc');
  const items = document.querySelectorAll('.cond-item');
  if (!input || !btn || !items.length) return;

  // เกณฑ์ตรงกับบรรทัดโค้ดบนจอ เรียงสูง → ต่ำ (else คือ threshold = null)
  const TIERS = [
    { grade: 'A', min: 80 },
    { grade: 'B', min: 70 },
    { grade: 'C', min: 60 },
    { grade: 'D', min: 50 },
    { grade: 'F', min: null },
  ];
  const STEP_MS = 650;

  btn.addEventListener('click', () => {
    let score = parseInt(input.value, 10);
    if (isNaN(score)) score = 0;
    score = Math.max(0, Math.min(100, score));
    input.value = score;

    items.forEach((el) => el.classList.remove('checking', 'matched', 'skipped'));
    display.textContent = '?';
    btn.disabled = true;
    const trace = [];

    let i = 0;
    function checkNext() {
      const tier = TIERS[i];
      const el = items[i];
      el.classList.add('checking');
      desc.textContent = tier.min === null
        ? 'ทุกเงื่อนไขข้างบนเป็นเท็จหมด → เข้า else โดยไม่ต้องตรวจอะไรอีก'
        : 'กำลังตรวจ: ' + score + ' >= ' + tier.min + ' ?';

      setTimeout(() => {
        el.classList.remove('checking');
        const matched = tier.min === null || score >= tier.min;
        if (matched) {
          el.classList.add('matched');
          // เงื่อนไขที่อยู่ถัดลงไปไม่ถูกตรวจเลย — นี่คือหัวใจของ else if
          for (let k = i + 1; k < items.length; k++) items[k].classList.add('skipped');
          display.textContent = tier.grade;
          if (typeof gsap !== 'undefined') gsap.fromTo(display, { scale: 0.4 }, { scale: 1, duration: 0.6, ease: 'back.out(2.2)' });
          trace.push(tier.min === null ? 'เข้า else' : score + ' >= ' + tier.min + ' จริง ✓');
          desc.textContent = 'คะแนน ' + score + ' → ' + trace.join(' · ') + ' → ได้เกรด ' + tier.grade +
            ' แล้วออกจากโครงสร้างทันที (บรรทัดที่จางลงไม่ถูกตรวจเลย)';
          btn.disabled = false;
        } else {
          el.classList.add('skipped');
          trace.push(score + ' >= ' + tier.min + ' เท็จ ✗');
          i++;
          checkNext();
        }
      }, STEP_MS);
    }
    checkNext();
  });
})();

// ---------- เครื่องคิดค่าไฟขั้นบันได 3 ขั้น (อัปเกรดโจทย์บทที่ 3) ----------
(function electricBill() {
  const input = document.getElementById('billUnits');
  const slider = document.getElementById('billSlider');
  const result = document.getElementById('billResult');
  if (!input || !result) return;

  const R1 = 3.25, R2 = 4.22, R3 = 4.42;

  function baht(x) { return x.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function render() {
    let units = parseInt(input.value, 10);
    if (isNaN(units) || units < 0) units = 0;
    let branch, lines, bill;
    if (units <= 150) {
      branch = 'if (units <= 150)';
      bill = units * R1;
      lines = ['bill = ' + units + ' × 3.25 = <b style="color:#a7f3d0">' + baht(bill) + '</b>'];
    } else if (units <= 400) {
      branch = 'else if (units <= 400)';
      bill = 150 * R1 + (units - 150) * R2;
      lines = [
        '150 หน่วยแรก × 3.25 = ' + baht(150 * R1),
        'อีก ' + (units - 150) + ' หน่วย × 4.22 = ' + baht((units - 150) * R2),
        'bill = <b style="color:#a7f3d0">' + baht(bill) + '</b>',
      ];
    } else {
      branch = 'else';
      bill = 150 * R1 + 250 * R2 + (units - 400) * R3;
      lines = [
        '150 หน่วยแรก × 3.25 = ' + baht(150 * R1),
        '250 หน่วยถัดมา × 4.22 = ' + baht(250 * R2),
        'อีก ' + (units - 400) + ' หน่วย × 4.42 = ' + baht((units - 400) * R3),
        'bill = <b style="color:#a7f3d0">' + baht(bill) + '</b>',
      ];
    }
    result.innerHTML =
      'units = ' + units + '<br>เข้าเงื่อนไข → <b style="color:#22d3ee">' + branch + '</b><br>' +
      lines.join('<br>') +
      '<br><br>→ <b style="color:#a7f3d0">ค่าไฟ ' + baht(bill) + ' บาท</b>';
  }

  input.addEventListener('input', () => { slider.value = Math.min(600, input.value || 0); render(); });
  slider.addEventListener('input', () => { input.value = slider.value; render(); });
  render();
})();

// ---------- คำถามแบบทดสอบท้ายบท (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'ภาษาซีใช้สิ่งใดกำหนดว่า "คำสั่งไหนอยู่ในบล็อกของ if"?',
    opts: ['การย่อหน้า (indentation)', 'วงเล็บปีกกา { }', 'เครื่องหมาย : ท้ายบรรทัด', 'คำสั่ง end if'],
    ans: 1,
    explain: 'ภาษาซีใช้ { } ครอบบล็อก — การย่อหน้าเป็นแค่ความสวยงามช่วยให้อ่านง่าย คอมไพเลอร์ไม่สนใจ (แต่มนุษย์สนมาก จัดย่อหน้าให้สวยเสมอ!)'
  },
  {
    q: 'โค้ด if (speed > 90); { printf("ใบสั่ง"); } มีปัญหาอะไร?',
    opts: [
      'คอมไพล์ไม่ผ่านเพราะ ; เกิน',
      '; ท้าย if ทำให้เงื่อนไขจบเปล่า — printf ทำงานเสมอไม่ว่า speed เท่าไร',
      'ไม่มีปัญหา ทำงานถูกต้อง',
      'printf ถูกข้ามตลอดไป'
    ],
    ans: 1,
    explain: '; หลังวงเล็บ if คือ "คำสั่งว่าง" — if จบที่ตรงนั้นทันที บล็อก { } ที่ตามมากลายเป็นบล็อกอิสระที่ทำงานเสมอ คอมไพล์ผ่านฉลุย จึงเป็นบั๊กเงียบสุดอันตรายของภาษาซี'
  },
  {
    q: 'int x = 3; if (x > 5) { printf("A"); } else { printf("B"); } — หน้าจอแสดงอะไร?',
    opts: ['A', 'B', 'A และ B', 'ไม่แสดงอะไรเลย'],
    ans: 1,
    explain: '3 > 5 ได้ 0 (เท็จ) จึงเข้าบล็อก else แสดง B — และจำไว้ว่า if–else เลือกทำ "ทางเดียวเท่านั้น" ไม่มีทางแสดงทั้ง A และ B'
  },
  {
    q: 'คำสั่ง else if ทำงานเมื่อใด?',
    opts: [
      'ทำงานทุกครั้งไม่ว่าเงื่อนไขบนจะจริงหรือเท็จ',
      'ทำงานเมื่อเงื่อนไขก่อนหน้าเป็นเท็จทั้งหมด และเงื่อนไขของตัวเองเป็นจริง',
      'ทำงานพร้อมกับ if เสมอ',
      'ทำงานเมื่อเงื่อนไขของ if เป็นจริง'
    ],
    ans: 1,
    explain: 'else if ถูกตรวจก็ต่อเมื่อทุกเงื่อนไขข้างบนเป็นเท็จ และทำงานเมื่อเงื่อนไขตัวเองเป็นจริง — เจอจริงตัวแรกแล้วโปรแกรมออกจากโครงสร้างทันที ไม่ตรวจต่อ'
  },
  {
    q: 'ใช้เกณฑ์เครื่องตัดเกรดในบทเรียน (A≥80, B≥70, C≥60, D≥50) คะแนน 68 ได้เกรดอะไร?',
    opts: ['B', 'C', 'D', 'F'],
    ans: 1,
    explain: 'ไล่จากบน: 68 ≥ 80 เท็จ → 68 ≥ 70 เท็จ → 68 ≥ 60 จริง ✓ ได้เกรด C แล้วหยุดทันที — ลองใส่ 68 ในเครื่องตัดเกรดเพื่อดูการไล่แบบสด ๆ ได้'
  },
  {
    q: 'ถ้าสลับเอา if (score >= 50) เกรด D ขึ้นบรรทัด "แรก" คนได้ 95 คะแนนจะได้เกรดอะไร?',
    opts: ['A เพราะ 95 ≥ 80 ด้วย', 'D เพราะโปรแกรมเจอเงื่อนไขจริงตัวแรกแล้วหยุดเลย', 'คอมไพล์ไม่ผ่านเพราะเงื่อนไขขัดแย้งกัน', 'F'],
    ans: 1,
    explain: '95 ≥ 50 เป็นจริง โปรแกรมทำบล็อกนั้น (เกรด D) แล้วออกจากโครงสร้างทันที ไม่ตรวจต่อว่ามีเงื่อนไขที่เหมาะกว่า — บทเรียนสำคัญ: เรียงเงื่อนไขจากสูงสุดลงต่ำสุดเสมอ'
  },
  {
    q: 'ใน switch–case ถ้า "ลืมเขียน break;" ท้าย case จะเกิดอะไรขึ้น?',
    opts: [
      'คอมไพล์ไม่ผ่าน',
      'โปรแกรมไหลทะลุลงไปทำ case ถัดไปด้วย โดยไม่ตรวจค่าอีก',
      'ออกจาก switch ทันทีเหมือนมี break',
      'ทำเฉพาะ default'
    ],
    ans: 1,
    explain: 'อาการ "fall-through": จบ case โดยไม่มี break โปรแกรมจะไหลลงไปทำคำสั่งของ case ถัดไปต่อเนื่อง — กด 1 แต่ได้กาแฟ+ชา+โกโก้ครบทุกเมนู! ข้อสอบเรื่อง switch ชอบหลอกจุดนี้ที่สุด'
  },
  {
    q: 'สถานการณ์ใดเหมาะกับ switch มากกว่า else if?',
    opts: [
      'ตรวจช่วงคะแนน score >= 80',
      'เมนูตัวเลือก 1, 2, 3, 4 จากผู้ใช้',
      'ตรวจค่าทศนิยม price == 99.5',
      'เงื่อนไขซับซ้อน a > 0 && b > 0'
    ],
    ans: 1,
    explain: 'switch เหมาะกับ "ค่าตายตัว" ของ int/char เช่นเมนู 1 2 3 — ใช้กับช่วงค่า ทศนิยม หรือเงื่อนไขซับซ้อนไม่ได้ พวกนั้นเป็นงานของ else if'
  },
  {
    q: 'จาก rental.c ถ้า age = 16 และ has_license = 1 โปรแกรมแสดงอะไร?',
    opts: ['เช่ารถได้', 'อายุถึง แต่ต้องมีใบขับขี่', 'อายุไม่ถึง 18 ปี', 'ไม่แสดงอะไรเลย'],
    ans: 2,
    explain: 'เงื่อนไขชั้นนอก age >= 18 ได้ 0 (เท็จ) จึงเข้า else ชั้นนอกทันที — if ชั้นในเรื่องใบขับขี่ "ไม่ถูกตรวจเลย" แม้ has_license จะเป็น 1 ก็ตาม'
  },
  {
    q: 'โครงสร้าง if–else if–else if–else หนึ่งชุด เมื่อรันหนึ่งครั้งจะมีบล็อกถูกทำงาน "กี่บล็อก"?',
    opts: ['ทุกบล็อกที่เงื่อนไขเป็นจริง', '1 บล็อกเสมอ', 'อย่างน้อย 2 บล็อก', '0 หรือ 1 บล็อก แล้วแต่กรณี'],
    ans: 1,
    explain: 'โครงสร้างที่มี else ปิดท้าย การันตีทำงาน "1 บล็อกพอดีเสมอ" — เจอเงื่อนไขจริงตัวแรกทำแล้วออก ถ้าเท็จหมดก็เข้า else (ถ้าไม่มี else จึงจะเป็นไปได้ที่ 0 บล็อก)'
  }
];

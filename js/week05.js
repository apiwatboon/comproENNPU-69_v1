/* ============================================================
   week05.js — คาบที่ 7: โครงสร้างควบคุมแบบวนซ้ำ (ภาษาซี)
   (ปุ่มรันโค้ด, ตัวเดินลูปผลรวม, เครื่องวาดลวดลายดาว,
    ตัวสแกนหาอุณหภูมิสูงสุด, คำถามแบบทดสอบ)
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

// ---------- ตัวเดินลูปผลรวม 1–5 ทีละขั้น (ท่าตัวสะสม ฉบับ for ภาษาซี) ----------
(function sumStepper() {
  const code = document.getElementById('sumCode');
  const btnStep = document.getElementById('sumStep');
  const btnReset = document.getElementById('sumReset');
  if (!code || !btnStep) return;

  const trace = document.getElementById('sumTrace');
  const out = document.getElementById('sumOut');
  const desc = document.getElementById('sumDesc');
  const lines = {};
  code.querySelectorAll('.pyline').forEach((el) => (lines[el.dataset.line] = el));

  // สร้างลำดับขั้นทั้งหมดล่วงหน้า — เห็นชัดว่าหัวลูปบรรทัด 2 ถูกแวะซ้ำทุกรอบ
  const steps = [{ line: 1, i: '—', total: 0, desc: 'สร้างตัวสะสม total = 0 — เหมือนแก้วเปล่าที่รอเติมน้ำทีละรอบ' }];
  let total = 0;
  for (let i = 1; i <= 5; i++) {
    steps.push({ line: 2, i: i, total: total, desc: (i === 1 ? 'เข้าหัวลูป: ตั้ง i = 1 (ทำครั้งเดียว) แล้วตรวจ 1 <= 5 จริง → เข้าบล็อก' : 'จบรอบก่อน: i++ ทำให้ i = ' + i + ' แล้วตรวจ ' + i + ' <= 5 จริง → วนต่อ') });
    const prev = total;
    total += i;
    steps.push({ line: 3, i: i, total: total, desc: 'total = ' + prev + ' + ' + i + ' = ' + total + ' (ค่าเก่าถูกทับด้วยค่าใหม่)' });
  }
  steps.push({ line: 2, i: 6, total: 15, desc: 'i++ ทำให้ i = 6 → ตรวจ 6 <= 5 ได้ 0 (เท็จ) → ออกจากลูปทันที' });
  steps.push({ line: 5, i: 6, total: 15, desc: 'พ้นบล็อก { } ของลูปแล้ว: printf แสดงค่า total ออกหน้าจอ', out: '15' });

  let pos = -1;

  btnStep.addEventListener('click', () => {
    if (pos >= steps.length - 1) return;
    if (pos === -1) trace.innerHTML = '';
    pos++;
    const s = steps[pos];

    Object.keys(lines).forEach((k) => lines[k].classList.remove('active'));
    lines[s.line].classList.add('active');
    if (typeof gsap !== 'undefined') gsap.fromTo(lines[s.line], { x: -6 }, { x: 0, duration: 0.25, ease: 'power2.out' });

    trace.querySelectorAll('tr').forEach((r) => r.classList.remove('current'));
    const row = document.createElement('tr');
    row.className = 'current';
    row.innerHTML = '<td>' + (pos + 1) + '</td><td>' + s.line + '</td><td>' + s.i + '</td><td>' + s.total + '</td>';
    trace.appendChild(row);

    if (s.out) out.textContent = s.out;
    desc.textContent = s.desc;

    if (pos >= steps.length - 1) {
      btnStep.disabled = true;
      btnStep.textContent = 'จบโปรแกรม ✓';
    }
  });

  btnReset.addEventListener('click', () => {
    pos = -1;
    btnStep.disabled = false;
    btnStep.textContent = 'รันทีละขั้น ▶';
    Object.keys(lines).forEach((k) => lines[k].classList.remove('active'));
    trace.innerHTML = '<tr><td colspan="4">— กดรันทีละขั้นเพื่อเริ่ม —</td></tr>';
    out.textContent = '— หน้าจอผลลัพธ์ (Console) —';
    desc.textContent = 'สังเกตว่าบรรทัด 2 จะถูกแวะซ้ำทุกรอบ — มันคือ "ด่านเช็ค" เงื่อนไข i <= 5 และจุดปรับค่า i++';
  });
})();

// ---------- เครื่องวาดลวดลายดาว (ลูปซ้อนภาษาซี) ----------
(function patternPrinter() {
  const select = document.getElementById('patSelect');
  const rowsInput = document.getElementById('patRows');
  const btn = document.getElementById('patDraw');
  const out = document.getElementById('patOut');
  const codeEl = document.getElementById('patCode');
  if (!select || !btn) return;

  const PATTERNS = {
    triangle: {
      row: (i, n) => '*'.repeat(i),
      code: (n) => 'int n = ' + n + ';\nfor (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= i; j++)\n        printf("*");\n    printf("\\n");\n}',
    },
    square: {
      row: (i, n) => '*'.repeat(n),
      code: (n) => 'int n = ' + n + ';\nfor (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n; j++)\n        printf("*");\n    printf("\\n");\n}',
    },
    pyramid: {
      row: (i, n) => ' '.repeat(n - i) + '*'.repeat(2 * i - 1),
      code: (n) => 'int n = ' + n + ';\nfor (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= n - i; j++)\n        printf(" ");\n    for (int j = 1; j <= 2*i - 1; j++)\n        printf("*");\n    printf("\\n");\n}',
    },
  };

  function clampRows() {
    let n = parseInt(rowsInput.value, 10);
    if (isNaN(n)) n = 5;
    n = Math.max(1, Math.min(10, n));
    rowsInput.value = n;
    return n;
  }

  function updateCode() {
    codeEl.textContent = PATTERNS[select.value].code(clampRows());
  }

  let timer = null;
  btn.addEventListener('click', () => {
    const n = clampRows();
    const pat = PATTERNS[select.value];
    updateCode();
    if (timer) clearInterval(timer);
    const wrap = document.createElement('div');
    wrap.style.whiteSpace = 'pre';
    out.innerHTML = '';
    out.appendChild(wrap);
    let i = 0;
    timer = setInterval(() => {
      i++;
      wrap.textContent += (i > 1 ? '\n' : '') + pat.row(i, n);
      if (i >= n) { clearInterval(timer); timer = null; }
    }, 130);
  });

  select.addEventListener('change', updateCode);
  rowsInput.addEventListener('input', updateCode);
})();

// ---------- ตัวสแกนหาอุณหภูมิสูงสุด (ลูป + ตัวจำแชมป์) ----------
(function maxFinder() {
  const barsBox = document.getElementById('tempBars');
  const btnStep = document.getElementById('maxStep');
  const btnReset = document.getElementById('maxReset');
  if (!barsBox || !btnStep) return;

  const vars = document.getElementById('maxVars');
  const desc = document.getElementById('maxDesc');
  const TEMPS = [62, 71, 58, 84, 66, 79, 73]; // °C รายชั่วโมง

  const bars = TEMPS.map((t, idx) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = ((t - 50) * 4 + 40) + 'px';
    bar.textContent = t + '°';
    bar.title = 'temps[' + idx + '] = ' + t + '°C';
    barsBox.appendChild(bar);
    return bar;
  });

  let pos = -1;
  let maxIdx = 0;

  btnStep.addEventListener('click', () => {
    pos++;
    bars.forEach((b) => b.classList.remove('compare'));

    if (pos === 0) {
      maxIdx = 0;
      bars[0].classList.add('found');
      vars.textContent = 'max_t = ' + TEMPS[0] + '° | ตั้งต้น: ให้ตัวแรกเป็นแชมป์ไปก่อน';
      desc.textContent = 'max_t = temps[0]; ได้ ' + TEMPS[0] + '° — ยังไม่ต้องเทียบกับใคร เพราะเพิ่งเจอค่าเดียว';
      return;
    }

    const t = TEMPS[pos];
    bars[pos].classList.add('compare');
    if (t > TEMPS[maxIdx]) {
      bars[maxIdx].classList.remove('found');
      const old = TEMPS[maxIdx];
      maxIdx = pos;
      bars[pos].classList.remove('compare');
      bars[pos].classList.add('found');
      vars.textContent = 'max_t = ' + t + '° | ชั่วโมงที่ ' + pos + ' ขึ้นแชมป์ใหม่!';
      desc.textContent = 'if (temps[' + pos + '] > max_t) → ' + t + ' > ' + old + ' จริง → อัปเดต max_t = ' + t + '° 👑';
    } else {
      vars.textContent = 'max_t = ' + TEMPS[maxIdx] + '° | กำลังเทียบชั่วโมงที่ ' + pos;
      desc.textContent = 'if (temps[' + pos + '] > max_t) → ' + t + ' > ' + TEMPS[maxIdx] + ' ได้ 0 (เท็จ) → แชมป์เดิมอยู่ต่อ';
    }

    if (pos >= TEMPS.length - 1) {
      btnStep.disabled = true;
      btnStep.textContent = 'สแกนครบ ✓';
      bars.forEach((b) => b.classList.remove('compare'));
      desc.textContent = 'สแกนครบ 7 ค่า — อุณหภูมิสูงสุดคือ ' + TEMPS[maxIdx] + '°C (ชั่วโมงที่ ' + maxIdx + ') ลูปเดียวกันนี้ใช้กับข้อมูลล้านค่าก็ได้ โค้ดยาวเท่าเดิม!';
    }
  });

  btnReset.addEventListener('click', () => {
    pos = -1;
    maxIdx = 0;
    btnStep.disabled = false;
    btnStep.textContent = 'เทียบตัวถัดไป ▶';
    bars.forEach((b) => b.classList.remove('compare', 'found', 'sorted'));
    vars.textContent = 'max_t = — | กำลังเทียบชั่วโมงที่ —';
    desc.textContent = 'โค้ดเบื้องหลัง: max_t = temps[0]; แล้ววน for เทียบ — if (temps[i] > max_t) ก็อัปเดตแชมป์ (สีชมพู = แชมป์ปัจจุบัน, สีเหลือง = ตัวที่กำลังเทียบ)';
  });
})();

// ---------- คำถามแบบทดสอบท้ายคาบ (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'for (int i = 0; i < 5; i++) — ลูปนี้ทำงานกี่รอบ และ i มีค่าใดบ้าง?',
    opts: ['5 รอบ: 0, 1, 2, 3, 4', '5 รอบ: 1, 2, 3, 4, 5', '6 รอบ: 0 ถึง 5', '4 รอบ: 1, 2, 3, 4'],
    ans: 0,
    explain: 'เริ่ม 0 วนตราบใดที่ i < 5 → ได้ 0–4 รวม 5 รอบ (ไม่รวม 5 เพราะเงื่อนไขเป็น "น้อยกว่า") — ถ้าอยากได้ 1–5 เขียน for (i = 1; i <= 5; i++)'
  },
  {
    q: 'for (int i = 2; i <= 8; i += 2) printf("%d ", i); แสดงผลว่าอะไร?',
    opts: ['2 4 6 8', '2 4 6', '2 3 4 5 6 7 8', '4 6 8'],
    ans: 0,
    explain: 'เริ่ม 2 ก้าวทีละ 2 และเงื่อนไข <= 8 "รวม" 8 ด้วย → 2 4 6 8 — เทียบกับข้อบน: < ไม่รวมขอบ, <= รวมขอบ อ่านเครื่องหมายให้ดีทุกครั้ง'
  },
  {
    q: 'ไล่โค้ด: int total = 0; for (int i = 1; i <= 3; i++) { total = total + i; } สุดท้าย total เป็นเท่าใด?',
    opts: ['3', '6', '10', '0'],
    ans: 1,
    explain: 'i = 1, 2, 3 → total สะสม 0+1 = 1 → 1+2 = 3 → 3+3 = 6 — ท่าตัวสะสมแบบเดียวกับตัวเดินลูปในบทเรียน'
  },
  {
    q: 'สถานการณ์ใดเหมาะกับ while มากกว่า for?',
    opts: [
      'พิมพ์สูตรคูณแม่ 3 ครบ 12 บรรทัด',
      'อ่านข้อมูลเซ็นเซอร์ 1,000 ค่า',
      'วนถามรหัสผ่านซ้ำจนกว่าผู้ใช้จะตอบถูก',
      'แสดงรายชื่อนักศึกษา 40 คน'
    ],
    ans: 2,
    explain: 'ถามรหัสจนถูก "ไม่รู้ล่วงหน้าว่ากี่รอบ" รู้แค่เงื่อนไขหยุด จึงเหมาะกับ while (หรือ do-while ยิ่งเหมาะ เพราะต้องถามก่อนอย่างน้อยหนึ่งครั้ง) — อีกสามข้อรู้จำนวนรอบแน่นอน ใช้ for'
  },
  {
    q: 'int x = 3; while (x > 0) { printf("%d", x); } — โค้ดนี้ "ไม่มีบรรทัดแก้ค่า x" จะเกิดอะไรขึ้น?',
    opts: [
      'พิมพ์ 3 2 1 แล้วจบ',
      'พิมพ์ 3 ครั้งเดียวแล้วจบ',
      'พิมพ์ 3 ซ้ำไม่รู้จบ โปรแกรมไม่มีวันหยุด',
      'คอมไพล์ไม่ผ่าน'
    ],
    ans: 2,
    explain: 'x ค้างที่ 3 ตลอด เงื่อนไข 3 > 0 จริงชั่วนิรันดร์ = ลูปไม่รู้จบ ขัดคุณสมบัติ Finiteness จากคาบที่ 3 — ทุกลูปต้องมีบรรทัดขยับค่าเข้าใกล้จุดจบ เช่น x--; (กด Ctrl+C บังคับหยุด)'
  },
  {
    q: 'do { ... } while (เงื่อนไข); ต่างจาก while ธรรมดาอย่างไร?',
    opts: [
      'do-while เร็วกว่า',
      'do-while ทำบล็อกก่อนหนึ่งรอบเสมอ แล้วค่อยตรวจเงื่อนไข',
      'do-while วนได้ไม่เกิน 1 รอบ',
      'ไม่ต่างกันเลย'
    ],
    ans: 1,
    explain: 'while ตรวจ "ก่อนทำ" (อาจไม่ทำเลยสักรอบ) ส่วน do-while ทำ "ก่อนตรวจ" จึงการันตีอย่างน้อย 1 รอบ — เหมาะกับเมนูและการถามรหัส เพราะต้องถามก่อนถึงจะรู้ว่าผิด (อย่าลืม ; หลัง while ปิดท้าย!)'
  },
  {
    q: 'ลูปซ้อน for (i = 0; i < 3; i++) for (j = 0; j < 4; j++) printf("ตรวจ"); จะพิมพ์คำว่า "ตรวจ" ทั้งหมดกี่ครั้ง?',
    opts: ['3 ครั้ง', '4 ครั้ง', '7 ครั้ง', '12 ครั้ง'],
    ans: 3,
    explain: 'ลูปนอก 3 รอบ × ลูปใน 4 รอบ = 12 ครั้ง — ลูปนอกหมุน 1 ครั้ง ลูปในต้องหมุนจนครบชุดของมันก่อนเสมอ เหมือนเข็มชั่วโมงกับเข็มนาที'
  },
  {
    q: 'int count = 10; while (count > 7) { printf("%d ", count); count--; } แสดงผลว่าอะไร?',
    opts: ['10 9 8 7', '10 9 8', '9 8 7', '10 9 8 7 6'],
    ans: 1,
    explain: 'เช็คก่อนทำ: 10 > 7 พิมพ์ 10 → 9 > 7 พิมพ์ 9 → 8 > 7 พิมพ์ 8 → ลดเหลือ 7 แล้ว 7 > 7 ได้ 0 ออกจากลูป — 7 จึงไม่ถูกพิมพ์'
  },
  {
    q: 'คำสั่ง i++; มีความหมายเหมือนข้อใด?',
    opts: ['i = i + 1;', 'i = 1;', 'i = i * 2;', 'printf("%d", i);'],
    ans: 0,
    explain: 'i++ คือตัวย่อของ i = i + 1 (และ i-- คือลบหนึ่ง) — เป็นเอกลักษณ์ภาษาซีที่เจอทุกหัวลูป for ชื่อภาษา C++ ก็มาจากตัวดำเนินการนี้!'
  },
  {
    q: 'จากตัวสแกนหาค่าสูงสุดในบทเรียน ทำไมต้องตั้ง max_t = temps[0]; ก่อนเริ่มลูป?',
    opts: [
      'เพราะ temps[0] เป็นค่ามากที่สุดเสมอ',
      'เพื่อให้มี "แชมป์ตั้งต้น" ไว้เปรียบเทียบกับค่าถัด ๆ ไป',
      'เพราะภาษาซีบังคับให้ทำ',
      'เพื่อให้ลูปวนเร็วขึ้น'
    ],
    ans: 1,
    explain: 'การเปรียบเทียบต้องมีคู่เทียบ — ให้ตัวแรกเป็นแชมป์ชั่วคราว แล้ววนเทียบตัวที่เหลือ ใครมากกว่าก็ขึ้นแทน ครบลูปแชมป์คือค่าสูงสุดจริง (ถ้าตั้ง max_t = 0 จะพังทันทีเมื่อข้อมูลติดลบทั้งชุด!)'
  }
];

/* ============================================================
   week03.js — คาบที่ 4: เริ่มต้นเขียนโปรแกรมแรกด้วยภาษาซี
   (ปุ่มรันโค้ด, เครื่องตรวจชื่อตัวแปร, เครื่องเลือกตัวกำหนดรูปแบบ,
    ตัวรันโปรแกรม BMI ทีละบรรทัด, คำถามแบบทดสอบ)
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

// ---------- เครื่องตรวจชื่อตัวแปรภาษาซี ----------
(function nameChecker() {
  const input = document.getElementById('nameInput');
  const result = document.getElementById('nameResult');
  if (!input || !result) return;

  const KEYWORDS = ['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
    'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long',
    'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch',
    'typedef', 'union', 'unsigned', 'void', 'volatile', 'while', 'main', 'printf', 'scanf'];

  input.addEventListener('input', () => {
    const name = input.value;
    if (!name) {
      result.textContent = '— พิมพ์ชื่อตัวแปรเพื่อตรวจสอบ —';
      result.style.color = '#d1fae5';
      return;
    }
    let verdict;
    if (/\s/.test(name)) {
      verdict = '❌ ใช้ไม่ได้: มีช่องว่าง\n💡 ใช้ _ คั่นแทน เช่น ' + name.trim().replace(/\s+/g, '_');
    } else if (/^[0-9]/.test(name)) {
      verdict = '❌ ใช้ไม่ได้: ขึ้นต้นด้วยตัวเลข\n💡 ย้ายเลขไปท้ายแทน เช่น ' + name.replace(/^([0-9]+)(.*)$/, '$2$1');
    } else if (/-/.test(name)) {
      verdict = '❌ ใช้ไม่ได้: มีเครื่องหมาย - (คอมไพเลอร์คิดว่าเป็นการลบ!)\n💡 ใช้ _ แทน: ' + name.replace(/-/g, '_');
    } else if (/[฀-๿]/.test(name)) {
      verdict = '❌ ใช้ไม่ได้: ภาษาซีไม่อนุญาตตัวอักษรไทยในชื่อตัวแปร\n💡 ตั้งเป็นอังกฤษสื่อความหมายแทน เช่น total_price';
    } else if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      verdict = '❌ ใช้ไม่ได้: มีอักขระพิเศษที่ภาษาซีไม่ยอมรับ';
    } else if (KEYWORDS.indexOf(name) !== -1) {
      verdict = '❌ ใช้ไม่ได้: "' + name + '" เป็นคำสงวน/ชื่อฟังก์ชันมาตรฐานของภาษาซี\n💡 คอมไพเลอร์จองชื่อนี้ไว้แล้ว ตั้งชื่ออื่นเถอะ';
    } else if (/^[a-z][a-z0-9_]*$/.test(name)) {
      verdict = '✅ ใช้ได้ และตรงธรรมเนียมนิยม (ตัวเล็กคั่นด้วย _) เป๊ะ!';
    } else {
      verdict = '✅ คอมไพล์ผ่าน แต่ธรรมเนียมภาษาซีนิยมตัวเล็กทั้งหมด\n💡 เช่น ' + name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '').replace(/__+/g, '_');
    }
    result.textContent = verdict;
    result.style.color = verdict.indexOf('✅') === 0 ? '#a7f3d0' : '#fca5a5';
  });
})();

// ---------- เครื่องเลือกชนิดข้อมูล + ตัวกำหนดรูปแบบ (%d %f %c %s) ----------
(function typeInspector() {
  const input = document.getElementById('typeInput');
  const result = document.getElementById('typeResult');
  if (!input || !result) return;

  input.addEventListener('input', () => {
    const v = input.value.trim();
    if (!v) {
      result.textContent = '— พิมพ์ค่าเพื่อตรวจ —';
      result.style.color = '#d1fae5';
      return;
    }
    let answer, ok = true;
    if (/^[+-]?[0-9]+$/.test(v)) {
      answer = 'ชนิด: int (จำนวนเต็ม)\nประกาศ: int x = ' + v + ';\nแสดงผล: printf("%d", x);';
    } else if (/^[+-]?([0-9]+\.[0-9]*|\.[0-9]+)$/.test(v)) {
      answer = 'ชนิด: float (หรือ double ถ้าต้องละเอียดสูง)\nประกาศ: float x = ' + v + ';\nแสดงผล: printf("%f", x);  — คุมทศนิยมด้วย %.2f';
    } else if (/^'.'$/.test(v) || /^'\\.'$/.test(v)) {
      answer = "ชนิด: char (ตัวอักษรเดี่ยวใน ' ')\nประกาศ: char c = " + v + ';\nแสดงผล: printf("%c", c);';
    } else if (/^'.+'$/.test(v)) {
      ok = false;
      answer = '❌ char เก็บได้ "ทีละ 1 ตัวอักษร" เท่านั้น!\n' + v + ' มีหลายตัว — ถ้าเป็นข้อความต้องใช้ " " (เรียนเต็ม ๆ ในบทสตริง)';
    } else if (/^".*"$/.test(v)) {
      answer = 'ชนิด: ข้อความ (สตริง = อาร์เรย์ของ char)\nตัวอย่าง: printf("%s", ' + v + ');\nจะเจาะลึกในคาบที่ 11 — ตอนนี้รู้ไว้ว่าใช้ %s';
    } else if (v === 'true' || v === 'false' || v === 'True' || v === 'False') {
      answer = 'ภาษาซีมาตรฐาน "ไม่มีชนิด bool ในตัว"!\nใช้ int แทน: 0 = เท็จ, ค่าอื่น = จริง\n(หรือ #include <stdbool.h> ในซียุคใหม่)';
    } else {
      ok = false;
      answer = '❌ ไม่มีเครื่องหมายคำพูด คอมไพเลอร์จะมองว่า "' + v + '" คือชื่อตัวแปร\nถ้ายังไม่เคยประกาศ → คอมไพล์ไม่ผ่านทันที\n💡 ตัวอักษรเดี่ยวใช้ \'' + v.charAt(0) + '\' ข้อความใช้ "' + v + '"';
    }
    result.textContent = answer;
    result.style.color = ok ? '#a7f3d0' : '#fca5a5';
  });
})();

// ---------- ตัวรันโปรแกรม BMI ทีละบรรทัด (สานต่อผังงานคาบที่ 3) ----------
(function bmiStepper() {
  const code = document.getElementById('bmiCode');
  const btnStep = document.getElementById('bmiStep');
  const btnReset = document.getElementById('bmiReset');
  if (!code || !btnStep) return;

  const inputW = document.getElementById('bmiW');
  const inputH = document.getElementById('bmiH');
  const varsRow = document.getElementById('bmiVars');
  const consoleBox = document.getElementById('bmiConsole');
  const desc = document.getElementById('bmiDesc');
  const lines = {};
  code.querySelectorAll('.pyline').forEach((el) => (lines[el.dataset.line] = el));

  let path = [];
  let pos = -1;
  let w = 0, h = 0, bmi = null;
  let out = [];

  function round2(x) { return Math.round(x * 100) / 100; }
  function fmt2(x) { return round2(x).toFixed(2); }

  function stepDesc(line) {
    switch (line) {
      case 1: return 'ประกาศตัวแปร float สามตัวรวด — จองกล่องในหน่วยความจำ ยังไม่มีค่า (ค่าขยะ!)';
      case 2: return 'scanf รับค่าจากผู้ใช้เก็บลง weight = ' + w + ' — สังเกตเครื่องหมาย & หน้าชื่อตัวแปร (บอกตำแหน่งกล่อง)';
      case 3: return 'รับส่วนสูงแบบเดียวกัน → height = ' + h + ' (หน่วยเป็นเมตร)';
      case 4: return 'คำนวณ: bmi = ' + w + ' / (' + h + ' × ' + h + ') = ' + round2(bmi) + ' — float หาร float ได้ทศนิยมตามคาด';
      case 5: return 'printf แสดงค่า ใช้ %.2f ปัดทศนิยม 2 ตำแหน่ง';
      case 6: return 'ข้าวหลามตัดของผังงาน! ตรวจ (bmi >= 25) → ' + round2(bmi) + ' >= 25 ' + (bmi >= 25 ? 'เป็นจริง (ค่า 1) → ทำบรรทัด 7' : 'เป็นเท็จ (ค่า 0) → ข้ามไป else บรรทัด 8');
      case 7: return 'เงื่อนไขจริง: พิมพ์คำเตือน (ฝั่ง else ถูกข้าม) — โปรแกรมจบ ครบทุกกล่องของผังงาน!';
      case 8: return 'เข้าทาง else เพราะเงื่อนไขเป็นเท็จ — พิมพ์ข้อความปกติ โปรแกรมจบ ครบทุกกล่องของผังงาน!';
    }
    return '';
  }

  function render(line) {
    Object.keys(lines).forEach((k) => lines[k].classList.remove('active'));
    lines[line].classList.add('active');

    varsRow.innerHTML = '<tr><td>ค่า</td><td>' + (line >= 2 ? w : '—') + '</td><td>' + (line >= 3 ? h : '—') + '</td><td>' + (bmi !== null ? round2(bmi) : '—') + '</td></tr>';
    consoleBox.textContent = out.length ? out.join('\n') : '— หน้าจอผลลัพธ์ (Console) —';
    desc.textContent = stepDesc(line);
  }

  function markSkipped() {
    Object.keys(lines).forEach((k) => {
      lines[k].classList.toggle('skipped', path.indexOf(parseInt(k, 10)) === -1);
    });
  }

  btnStep.addEventListener('click', () => {
    if (pos === -1) {
      w = parseFloat(inputW.value) || 0;
      h = parseFloat(inputH.value) || 0;
      if (h <= 0) {
        desc.textContent = '⚠️ ส่วนสูงต้องมากกว่า 0 — ไม่งั้นบรรทัด 4 จะหารด้วยศูนย์!';
        return;
      }
      bmi = null;
      out = [];
      path = [1, 2, 3, 4, 5, 6].concat(w / (h * h) >= 25 ? [7] : [8]);
      pos = 0;
      inputW.disabled = inputH.disabled = true;
    } else if (pos >= path.length - 1) {
      return;
    } else {
      pos++;
    }
    const line = path[pos];
    if (line === 4) bmi = w / (h * h);
    if (line === 5) out.push('BMI = ' + fmt2(bmi));
    if (line === 7) out.push('น้ำหนักเกิน');
    if (line === 8) out.push('น้ำหนักปกติ');
    if (line >= 6) markSkipped();
    render(line);
    if (typeof gsap !== 'undefined') gsap.fromTo(lines[line], { x: -6 }, { x: 0, duration: 0.3, ease: 'power2.out' });
    if (pos >= path.length - 1) {
      btnStep.disabled = true;
      btnStep.textContent = 'จบโปรแกรม ✓';
    }
  });

  btnReset.addEventListener('click', () => {
    pos = -1;
    bmi = null;
    out = [];
    inputW.disabled = inputH.disabled = false;
    btnStep.disabled = false;
    btnStep.textContent = 'รันทีละบรรทัด ▶';
    Object.keys(lines).forEach((k) => lines[k].classList.remove('active', 'skipped'));
    varsRow.innerHTML = '<tr><td>ค่า</td><td>—</td><td>—</td><td>—</td></tr>';
    consoleBox.textContent = '— หน้าจอผลลัพธ์ (Console) —';
    desc.textContent = 'พร้อมรันโปรแกรม — บรรทัดที่กำลังทำงานจะสว่างขึ้นทางซ้าย';
  });

  [inputW, inputH].forEach((inp) => inp.addEventListener('input', () => {
    if (pos !== -1) btnReset.click();
  }));
})();

// ---------- WOW: ประกาศตัวแปร → เห็นกล่อง+ไบต์ในหน่วยความจำ ----------
(function memDemo() {
  const types = document.getElementById('memTypes');
  const nameIn = document.getElementById('memName');
  const valIn = document.getElementById('memVal');
  const declareBtn = document.getElementById('memDeclare');
  const clearBtn = document.getElementById('memClear');
  const codeEl = document.getElementById('memCode');
  const ram = document.getElementById('memRam');
  if (!types || !ram || !declareBtn) return;

  const BYTES = { int: 4, float: 4, double: 8, char: 1 };
  const order = [];
  const cells = {};
  let curType = 'int';

  function hint() { return curType === 'char' ? "ค่า เช่น 'A'" : (curType === 'int' ? 'ค่า เช่น 20' : 'ค่า เช่น 3.14'); }

  types.querySelectorAll('.mem-type').forEach((b) => b.addEventListener('click', () => {
    types.querySelectorAll('.mem-type').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    curType = b.dataset.type;
    valIn.placeholder = hint();
  }));

  function validName(n) { return /^[A-Za-z_][A-Za-z0-9_]*$/.test(n); }
  function fmtVal(type, raw) {
    raw = raw.trim();
    if (!raw) return { err: 'ยังไม่ได้ใส่ค่า' };
    if (type === 'char') {
      const ch = raw.replace(/^'(.*)'$/, '$1');
      if ([...ch].length !== 1) return { err: "char เก็บได้ทีละ 1 ตัวอักษรใน ' '" };
      return { code: "'" + ch + "'", disp: "'" + ch + "'" };
    }
    if (type === 'int') {
      if (!/^[+-]?\d+$/.test(raw)) return { err: 'int รับเฉพาะจำนวนเต็ม (ทศนิยมจะถูกตัดเศษทิ้ง!)' };
      return { code: raw, disp: raw };
    }
    if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(raw)) return { err: 'ต้องเป็นตัวเลข' };
    return { code: raw, disp: raw };
  }

  function render() {
    if (!order.length) { ram.innerHTML = '<span class="mem-empty">หน่วยความจำว่าง — ยังไม่มีตัวแปร</span>'; return; }
    ram.innerHTML = order.map((n) => {
      const c = cells[n];
      const bytes = Array.from({ length: BYTES[c.type] }, () => '<span class="mem-b"></span>').join('');
      return '<div class="mem-cell ' + c.type + '" data-n="' + n + '">'
        + '<div class="mem-cell-top"><span class="mem-cell-type">' + c.type + '</span><span class="mem-cell-name">' + n + '</span></div>'
        + '<div class="mem-bytes" title="' + BYTES[c.type] + ' ไบต์">' + bytes + '</div>'
        + '<div class="mem-cell-val">' + c.disp + '</div></div>';
    }).join('');
  }

  declareBtn.addEventListener('click', () => {
    const name = nameIn.value.trim();
    if (!validName(name)) { codeEl.textContent = '// ชื่อไม่ถูกกฎ: ต้องขึ้นต้นด้วยตัวอักษรหรือ _ และห้ามมีเว้นวรรค/อักษรไทย'; codeEl.classList.add('err'); return; }
    const v = fmtVal(curType, valIn.value);
    if (v.err) { codeEl.textContent = '// ' + v.err; codeEl.classList.add('err'); return; }
    codeEl.classList.remove('err');
    const reassign = !!cells[name];
    if (!reassign) order.push(name);
    cells[name] = { type: reassign ? cells[name].type : curType, disp: v.disp };
    codeEl.textContent = reassign
      ? name + ' = ' + v.code + ';   // กำหนดค่าใหม่ทับกล่องเดิม (ไม่สร้างกล่องใหม่)'
      : curType + ' ' + name + ' = ' + v.code + ';';
    render();
    const el = ram.querySelector('[data-n="' + name + '"]');
    if (el && typeof gsap !== 'undefined') gsap.fromTo(el, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' });
    nameIn.value = ''; valIn.value = ''; nameIn.focus();
  });

  clearBtn.addEventListener('click', () => {
    order.length = 0;
    for (const k in cells) delete cells[k];
    codeEl.textContent = '// เลือกชนิด พิมพ์ชื่อและค่า แล้วกด “ประกาศ”';
    codeEl.classList.remove('err');
    render();
  });
})();

// ---------- WOW: เครื่องคำนวณนิพจน์ + กับดักหารจำนวนเต็ม ----------
(function opDemo() {
  const a = document.getElementById('opA');
  const b = document.getElementById('opB');
  const ops = document.getElementById('opOps');
  const res = document.getElementById('opResult');
  const exp = document.getElementById('opExplain');
  if (!a || !ops || !res) return;
  let op = '/', mode = 'int';
  const sym = () => (op === '*' ? '×' : op === '/' ? '÷' : op);

  function calc() {
    let x = parseFloat(a.value) || 0, y = parseFloat(b.value) || 0;
    const xi = Math.trunc(x), yi = Math.trunc(y);
    if (op === '%') {
      if (mode === 'float') { res.textContent = 'ใช้ไม่ได้'; exp.innerHTML = '<b style="color:var(--pink)">%</b> (โมดูโล) ใช้กับ <b>จำนวนเต็มเท่านั้น</b> — ใส่ float แล้วคอมไพล์ไม่ผ่าน'; return; }
      if (yi === 0) { res.textContent = 'error'; exp.textContent = 'หารด้วยศูนย์ไม่ได้'; return; }
      res.textContent = xi % yi;
      exp.innerHTML = xi + ' % ' + yi + ' = <b>' + (xi % yi) + '</b> — “เศษ” ที่เหลือจากการหาร (ใช้เช็คหารลงตัว/เลขคู่-คี่ ในคาบถัด ๆ ไป)';
      return;
    }
    let out;
    if (mode === 'int') {
      x = xi; y = yi;
      if (op === '+') out = x + y; else if (op === '-') out = x - y; else if (op === '*') out = x * y;
      else { if (y === 0) { res.textContent = 'error'; exp.textContent = 'หารด้วยศูนย์ไม่ได้'; return; } out = Math.trunc(x / y); }
      res.textContent = out;
      if (op === '/') {
        const real = Math.round((x / y) * 100) / 100;
        if (x % y !== 0) exp.innerHTML = 'int ' + x + ' / ' + y + ' = <b style="color:var(--pink)">' + out + '</b> ไม่ใช่ ' + real + '! <b>เศษ ' + (x % y) + ' หายไป</b> — จำนวนเต็มหารจำนวนเต็ม ผลลัพธ์ถูกตัดเศษทิ้งเสมอ';
        else exp.innerHTML = 'int ' + x + ' / ' + y + ' = <b>' + out + '</b> (หารลงตัว เศษเป็น 0)';
      } else exp.innerHTML = x + ' ' + sym() + ' ' + y + ' = <b>' + out + '</b>';
    } else {
      if (op === '+') out = x + y; else if (op === '-') out = x - y; else if (op === '*') out = x * y;
      else { if (y === 0) { res.textContent = 'error'; exp.textContent = 'หารด้วยศูนย์ไม่ได้'; return; } out = x / y; }
      out = Math.round(out * 1000) / 1000;
      res.textContent = out;
      if (op === '/') exp.innerHTML = 'float ' + x + ' / ' + y + ' = <b style="color:var(--green)">' + out + '</b> — มีตัวใดเป็นทศนิยม ผลลัพธ์ก็เก็บเศษได้ครบ';
      else exp.innerHTML = x + ' ' + sym() + ' ' + y + ' = <b>' + out + '</b>';
    }
  }

  ops.querySelectorAll('.op-op').forEach((btn) => btn.addEventListener('click', () => {
    ops.querySelectorAll('.op-op').forEach((x) => x.classList.remove('active'));
    btn.classList.add('active'); op = btn.dataset.op; calc();
  }));
  document.querySelectorAll('.op-modebtn').forEach((btn) => btn.addEventListener('click', () => {
    document.querySelectorAll('.op-modebtn').forEach((x) => x.classList.remove('active'));
    btn.classList.add('active'); mode = btn.dataset.mode; calc();
  }));
  [a, b].forEach((i) => i.addEventListener('input', calc));
  calc();
})();

// ---------- ลำดับการคำนวณ: 2 + 3 * 4 (× ก่อน +) ----------
(function precDemo() {
  const expr = document.getElementById('precExpr');
  const run = document.getElementById('precRun');
  const reset = document.getElementById('precReset');
  const desc = document.getElementById('precDesc');
  if (!expr || !run) return;
  let step = 0;
  function draw() {
    if (step === 0) {
      expr.innerHTML = '<span class="pt">2</span> <span class="po">+</span> <span class="pt">3</span> <span class="po hl">×</span> <span class="pt">4</span>';
      desc.innerHTML = 'โจทย์: <b class="mono">2 + 3 * 4</b> — เดาก่อนว่าได้เท่าไร แล้วกด “เล่นทีละขั้น”';
    } else if (step === 1) {
      expr.innerHTML = '<span class="pt">2</span> <span class="po">+</span> <span class="pt done">12</span>';
      desc.innerHTML = 'ขั้น 1: ทำ <b style="color:var(--amber)">3 × 4 = 12</b> ก่อน (คูณ/หาร มาก่อนบวก/ลบ)';
    } else {
      expr.innerHTML = '<span class="pt done">14</span>';
      desc.innerHTML = 'ขั้น 2: <b style="color:var(--green)">2 + 12 = 14</b> — ถ้าเผลอทำซ้ายไปขวา (2+3)×4 จะได้ 20 ซึ่งผิด! อยากให้บวกก่อนต้องใส่วงเล็บ (2+3)*4';
    }
  }
  run.addEventListener('click', () => { if (step < 2) step++; draw(); });
  reset.addEventListener('click', () => { step = 0; draw(); });
  draw();
})();

// ---------- คำถามแบบทดสอบท้ายคาบ (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'โปรแกรมภาษาซีทุกโปรแกรม "เริ่มทำงาน" ที่จุดใด?',
    opts: ['บรรทัดแรกสุดของไฟล์', 'ฟังก์ชัน main()', 'คำสั่ง #include', 'คำสั่ง printf ตัวแรก'],
    ans: 1,
    explain: 'ไม่ว่าไฟล์จะยาวแค่ไหน โปรแกรมเริ่มที่ int main() เสมอ — #include เป็นเพียงการเรียกคลังคำสั่งมาเตรียมไว้ก่อนเริ่ม'
  },
  {
    q: 'บรรทัด #include <stdio.h> มีหน้าที่อะไร?',
    opts: [
      'ประกาศตัวแปรอัตโนมัติ',
      'เรียกคลังคำสั่งมาตรฐานเข้ามา ทำให้ใช้ printf และ scanf ได้',
      'สั่งให้โปรแกรมเริ่มทำงาน',
      'แสดงข้อความบนหน้าจอ'
    ],
    ans: 1,
    explain: 'stdio.h = Standard Input/Output header คลังคำสั่งรับ-แสดงผลมาตรฐาน — ลบบรรทัดนี้แล้วเรียก printf คอมไพเลอร์จะไม่รู้จักทันที'
  },
  {
    q: 'เขียน printf("Hello") โดย "ลืมเซมิโคลอน ;" ท้ายคำสั่ง จะเกิดอะไรขึ้น?',
    opts: [
      'รันได้ปกติ เพราะ ; ไม่บังคับ',
      'คอมไพเลอร์เติม ; ให้อัตโนมัติ',
      'คอมไพล์ไม่ผ่าน — โปรแกรมทั้งไฟล์ไม่ได้รันเลย',
      'รันได้แต่ข้ามบรรทัดนั้นไป'
    ],
    ans: 2,
    explain: 'ภาษาซีเข้มงวด: ทุกคำสั่งต้องจบด้วย ; ขาดตัวเดียวคอมไพล์ล้มทั้งไฟล์ — ข่าวดีคือ error จะบอกบรรทัดให้ ฝึกอ่าน error แล้วจะหาเจอเร็วขึ้นเรื่อย ๆ'
  },
  {
    q: 'ต้องการเก็บเกรดเฉลี่ย 3.45 ควรประกาศตัวแปรอย่างไร?',
    opts: ['int gpa = 3.45;', 'float gpa = 3.45;', 'char gpa = 3.45;', 'gpa = 3.45;'],
    ans: 1,
    explain: 'ค่ามีทศนิยมต้องใช้ float (หรือ double) — ถ้าใช้ int ค่าจะถูกตัดเหลือ 3 เฉย ๆ! และภาษาซีต้องระบุชนิดเสมอ ประกาศแบบไม่มีชนิด (ข้อสุดท้าย) คอมไพล์ไม่ผ่าน'
  },
  {
    q: 'ข้อใดประกาศตัวแปร char ได้ถูกต้อง?',
    opts: ['char grade = "A";', "char grade = 'A';", 'char grade = A;', "char grade = 'AB';"],
    ans: 1,
    explain: "char เก็บตัวอักษร 1 ตัวในเครื่องหมายคำพูดเดี่ยว 'A' — ส่วน \"A\" คือสตริง (คนละชนิด!) และ 'AB' มี 2 ตัวอักษรใส่ char ไม่ได้"
  },
  {
    q: 'ในภาษาซี int a = 7, b = 2; แล้ว printf("%d", a / b); แสดงค่าใด?',
    opts: ['3.5', '3', '4', '3.0'],
    ans: 1,
    explain: 'กับดักคลาสสิก! จำนวนเต็มหารจำนวนเต็ม ได้จำนวนเต็ม — 7 / 2 = 3 (เศษ 0.5 ถูกตัดทิ้งเงียบ ๆ ไม่มี error) ถ้าอยากได้ 3.5 ต้องให้ตัวใดตัวหนึ่งเป็นทศนิยม เช่น 7.0 / 2'
  },
  {
    q: 'ผลของนิพจน์ 2 + 3 * 4 ในภาษาซีคือเท่าใด?',
    opts: ['20', '14', '24', '9'],
    ans: 1,
    explain: 'คูณ/หาร ทำก่อนบวก/ลบ เสมอ: 3 * 4 = 12 ก่อน แล้วจึง 2 + 12 = 14 — ถ้าอยากให้บวกก่อนต้องใส่วงเล็บ (2 + 3) * 4 = 20'
  },
  {
    q: 'ชื่อตัวแปรใดต่อไปนี้ "ถูกต้อง" ตามกฎภาษาซี?',
    opts: ['2nd_score', 'total-price', 'box_width', 'ราคารวม'],
    ans: 2,
    explain: 'box_width ขึ้นต้นด้วยตัวอักษร ใช้ _ คั่น ถูกธรรมเนียม — ส่วน 2nd_score ขึ้นต้นด้วยเลข, total-price มีเครื่องหมายลบ, และภาษาซีไม่อนุญาตชื่อตัวแปรภาษาไทย'
  },
  {
    q: 'ไล่โค้ด: int a = 7; a = a + 3; printf("%d", a); — หน้าจอแสดงค่าใด?',
    opts: ['7', '10', 'a + 3', '73'],
    ans: 1,
    explain: '= คือกำหนดค่า: คำนวณฝั่งขวาก่อน (7 + 3 = 10) แล้วเก็บทับใน a — printf จึงแสดง 10 ท่าเดียวกับ age = age + 1 ในบทเรียน'
  },
  {
    q: 'การทำงานแบบ "คอมไพล์" ของภาษาซี ต่างจากแบบแปลทีละบรรทัดอย่างไร?',
    opts: [
      'คอมไพล์คือรันบนเว็บเท่านั้น',
      'คอมไพล์แปลโค้ดทั้งโปรแกรมเป็นภาษาเครื่องก่อน แล้วจึงรันไฟล์ที่แปลแล้ว',
      'คอมไพล์ไม่ตรวจไวยากรณ์',
      'ไม่ต่างกัน เป็นคำเรียกคนละแบบ'
    ],
    ans: 1,
    explain: 'คอมไพเลอร์ตรวจและแปลทั้งไฟล์เป็นภาษาเครื่องก่อนรัน (ผิดแม้จุดเดียว = ไม่ได้ไฟล์รัน) — ข้อดีคือทำงานเร็วมาก จึงครองงานระบบฝังตัวและเครื่องจักรมาห้าทศวรรษ'
  }
];


// ---------- WOW: เจาะลึกชนิดตัวแปรถึงระดับบิต — signed/unsigned + sign bit ----------
(function bitsDemo() {
  const strip = document.getElementById('bitsStrip');
  const valEl = document.getElementById('bitsVal');
  const exp = document.getElementById('bitsExplain');
  if (!strip || !valEl) return;
  const types = document.getElementById('bitsTypes');
  const signs = document.getElementById('bitsSign');
  let nbits = 8, sign = 'signed';
  let bits = new Array(nbits).fill(0);

  function fmt(n) { return n.toLocaleString('en-US'); }
  function unsignedVal() { let v = 0; for (let i = 0; i < nbits; i++) v = v * 2 + bits[i]; return v; }
  function value() {
    const u = unsignedVal();
    if (sign === 'unsigned') return u;
    return bits[0] === 1 ? u - Math.pow(2, nbits) : u;
  }

  function render() {
    let h = '';
    for (let g = 0; g < nbits / 8; g++) {
      h += '<div class="bits-byte">';
      for (let b = 0; b < 8; b++) {
        const i = g * 8 + b;
        const isMSB = (i === 0);
        const cls = 'bit-cell' + (bits[i] ? ' on' : '') + ((isMSB && sign === 'signed') ? ' signbit' : '');
        h += '<button type="button" class="' + cls + '" data-i="' + i + '">' + bits[i] + '</button>';
      }
      h += '</div>';
    }
    strip.innerHTML = h;

    valEl.textContent = fmt(value());
    let signTxt, rangeTxt;
    if (sign === 'unsigned') {
      rangeTxt = '0 ถึง ' + fmt(Math.pow(2, nbits) - 1);
      signTxt = 'โหมด <b>unsigned</b>: ทุกบิตใช้เก็บ “ขนาด” ไม่มี sign bit &rarr; เก็บค่าบวกได้มากขึ้นเป็นเท่าตัว (แต่เก็บค่าลบไม่ได้เลย)';
    } else {
      rangeTxt = '−' + fmt(Math.pow(2, nbits - 1)) + ' ถึง +' + fmt(Math.pow(2, nbits - 1) - 1);
      signTxt = 'บิตซ้ายสุด (MSB) = <span class="sb">sign bit</span> &rarr; '
        + (bits[0]
          ? 'ตอนนี้เป็น <b>1</b> ค่าจึง <b style="color:var(--pink)">ติดลบ</b> (ระบบ two’s complement: เอาค่า unsigned ' + fmt(unsignedVal()) + ' ลบด้วย 2^' + nbits + ')'
          : 'ตอนนี้เป็น <b>0</b> ค่าจึง <b style="color:var(--green)">เป็นบวก</b> (อ่านบิตที่เหลือตรง ๆ)');
    }
    exp.innerHTML = '<div>' + signTxt + '</div><div class="bits-range">ชนิดนี้ (' + nbits + ' บิต) เก็บได้: <b>' + rangeTxt + '</b></div>';
  }

  strip.addEventListener('click', function (e) {
    const b = e.target.closest('.bit-cell');
    if (!b) return;
    const i = +b.dataset.i;
    bits[i] ^= 1;
    render();
    if (typeof gsap !== 'undefined') gsap.fromTo(b, { scale: 0.7 }, { scale: 1, duration: 0.25, ease: 'back.out(3)' });
  });
  types.querySelectorAll('.bits-type').forEach(function (btn) {
    btn.addEventListener('click', function () {
      types.querySelectorAll('.bits-type').forEach(function (x) { x.classList.remove('active'); });
      btn.classList.add('active');
      nbits = +btn.dataset.bits;
      bits = new Array(nbits).fill(0);
      render();
    });
  });
  signs.querySelectorAll('.bits-signbtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      signs.querySelectorAll('.bits-signbtn').forEach(function (x) { x.classList.remove('active'); });
      btn.classList.add('active');
      sign = btn.dataset.sign;
      render();
    });
  });
  document.getElementById('bitsZero').addEventListener('click', function () { bits.fill(0); render(); });
  document.getElementById('bitsMax').addEventListener('click', function () {
    if (sign === 'unsigned') { bits.fill(1); }
    else { bits[0] = 0; for (let i = 1; i < nbits; i++) bits[i] = 1; }
    render();
  });
  document.getElementById('bitsMin').addEventListener('click', function () {
    if (sign === 'unsigned') { bits.fill(0); }
    else { bits[0] = 1; for (let i = 1; i < nbits; i++) bits[i] = 0; }
    render();
  });

  render();
})();


// ---------- WOW: การประกาศตัวแปร — ค่าทางขวา วิ่งไปเก็บในตัวแปรทางซ้าย ----------
(function assignDemo() {
  const codeEl = document.getElementById('asgnCode');
  const box = document.getElementById('asgnBox');
  const boxName = document.getElementById('asgnBoxName');
  const boxVal = document.getElementById('asgnBoxVal');
  const fly = document.getElementById('asgnFly');
  const track = document.querySelector('.asgn-track');
  const note = document.getElementById('asgnNote');
  const runBtn = document.getElementById('asgnRun');
  const presets = document.querySelectorAll('.asgn-p');
  if (!codeEl || !box || !fly) return;
  let state = { type: 'int', name: 'a', val: '10' };

  function renderCode() {
    codeEl.innerHTML =
      '<span class="tok type">' + state.type + '</span>' +
      '<span class="tok name">' + state.name + '</span>' +
      '<span class="tok eq">=</span>' +
      '<span class="tok val">' + state.val + '</span>' +
      '<span class="tok semi">;</span>';
    boxName.textContent = state.name;
    boxVal.textContent = '?';
    box.classList.remove('filled');
    fly.style.opacity = '0';
  }
  function run() {
    fly.textContent = state.val;
    fly.style.transition = 'none';
    fly.style.opacity = '1';
    fly.style.left = (track.clientWidth - fly.offsetWidth - 4) + 'px';   // เริ่มทางขวา
    void fly.offsetWidth;                                                 // reflow
    fly.style.transition = '';
    fly.style.left = '-42px';                                             // วิ่งไปทางกล่องซ้าย
    boxVal.textContent = '?';
    box.classList.remove('filled');
    note.innerHTML = '<b style="color:var(--amber)">' + state.val + '</b> กำลังวิ่งไปเก็บในตัวแปร <b style="color:var(--cyan)">' + state.name + '</b> ...';
    setTimeout(function () {
      boxVal.textContent = state.val;
      box.classList.add('filled');
      fly.style.opacity = '0';
      note.innerHTML = 'เก็บเรียบร้อย! ตัวแปร <b style="color:var(--cyan)">' + state.name + '</b> (ชนิด ' + state.type + ') มีค่า <b style="color:var(--green)">' + state.val + '</b> แล้ว — จำไว้: <b>=</b> คือ “เอาค่าทางขวาไปเก็บในตัวแปรทางซ้าย” เสมอ';
      if (typeof gsap !== 'undefined') gsap.fromTo(box, { scale: 0.88 }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
    }, 640);
  }
  presets.forEach(function (p) {
    p.addEventListener('click', function () {
      presets.forEach(function (x) { x.classList.remove('active'); });
      p.classList.add('active');
      state = { type: p.dataset.type, name: p.dataset.name, val: p.dataset.val };
      renderCode();
      note.textContent = 'กด “รัน” เพื่อดูค่าทางขวาวิ่งไปเก็บในกล่องตัวแปรทางซ้าย';
    });
  });
  runBtn.addEventListener('click', run);
  renderCode();
})();


// ---------- WOW: อาร์เรย์ 3 ชุด (1/2/3 มิติ) — ลูกบาศก์ 3D + index มาตรฐาน C ----------
(function arrayDemos() {
  const MAX = 10, MIN = 1;
  document.querySelectorAll('.arr-demo[data-dim]').forEach(function (root) {
    buildArray(root, +root.dataset.dim);
  });

  function buildArray(root, dim) {
    const axesEl = root.querySelector('.arr-axes');
    const declEl = root.querySelector('.arr-decl');
    const stage = root.querySelector('.arr-stage');
    const info = root.querySelector('.arr-info');
    if (!stage) return;
    const size = { x: 5, y: 3, z: 2 };

    function renderAxes() {
      function step(label, k) {
        return '<div class="arr-axis"><span>' + label + '</span>' +
          '<button type="button" class="arr-step" data-k="' + k + '" data-dir="-1">−</button>' +
          '<b class="arr-num">' + size[k] + '</b>' +
          '<button type="button" class="arr-step" data-k="' + k + '" data-dir="1">+</button></div>';
      }
      let h = '';
      if (dim === 1) h = step('จำนวนช่อง (คอลัมน์)', 'x');
      else if (dim === 2) h = step('แถว (row) — วงเล็บ 1', 'y') + step('คอลัมน์ (col) — วงเล็บ 2', 'x');
      else h = step('ชั้น (layer) — วงเล็บ 1', 'z') + step('แถว (row) — วงเล็บ 2', 'y') + step('คอลัมน์ (col) — วงเล็บ 3', 'x');
      axesEl.innerHTML = h;
      axesEl.querySelectorAll('.arr-step').forEach(function (b) {
        b.addEventListener('click', function () {
          const k = b.dataset.k, dir = +b.dataset.dir;
          const cap = (dim === 3) ? 5 : MAX;                   // 3 มิติจำกัด 5/แกน
          const nv = Math.max(MIN, Math.min(cap, size[k] + dir));
          if (nv !== size[k]) { size[k] = nv; render(); }
        });
      });
    }
    function decl() {
      if (dim === 1) declEl.textContent = 'int box[' + size.x + '];';
      else if (dim === 2) declEl.textContent = 'int box[' + size.y + '][' + size.x + '];';
      else declEl.textContent = 'int box[' + size.z + '][' + size.y + '][' + size.x + '];';
    }
    function bindBoxes() {
      stage.querySelectorAll('.arr-box').forEach(function (b) {
        b.addEventListener('mouseenter', function () { b.classList.add('hi'); info.innerHTML = 'กล่องนี้คือ <b class="mono" style="color:var(--cyan)">' + b.dataset.idx + '</b>'; });
        b.addEventListener('mouseleave', function () { b.classList.remove('hi'); });
        b.addEventListener('click', function () {
          stage.querySelectorAll('.arr-box.sel').forEach(function (x) { x.classList.remove('sel'); });
          b.classList.add('sel');
          info.innerHTML = 'เลือกกล่อง <b class="mono" style="color:var(--green)">' + b.dataset.idx + '</b> — เข้าถึงค่าด้วย ' + b.dataset.idx + ' (index เริ่มที่ 0)';
        });
      });
    }
    function popAll() {
      stage.querySelectorAll('.arr-box').forEach(function (b, i) { b.classList.add('pop'); b.style.animationDelay = (Math.min(i, 26) * 0.02) + 's'; });
    }
    function render() {
      decl(); renderAxes();
      const nz = (dim === 3) ? size.z : 1;
      const ny = (dim === 1) ? 1 : size.y;
      const nx = size.x;
      stage.className = 'arr-stage d3';
      const gap = 42;
      const cx0 = (nx - 1) * gap / 2, cy0 = (ny - 1) * gap / 2;
      let h = '<div class="arr-scene"><div class="arr-world">';
      for (let k = 0; k < nz; k++) for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) {
        const tx = j * gap - cx0, ty = i * gap - cy0, tz = k * gap;
        const idx = (dim === 1) ? 'box[' + j + ']' : ((dim === 2) ? 'box[' + i + '][' + j + ']' : 'box[' + k + '][' + i + '][' + j + ']');
        h += '<div class="arr-box arr-cube" data-idx="' + idx + '" style="transform:translate3d(' + tx + 'px,' + ty + 'px,' + tz + 'px)">' +
          '<span class="cf fx"></span><span class="cf bk"></span><span class="cf rt"></span><span class="cf lf"></span><span class="cf tp"></span><span class="cf bt"></span></div>';
      }
      h += '</div></div>';
      stage.innerHTML = h;
      bindBoxes(); popAll();
    }
    render();
  }
})();


// ---------- WOW: อ่านวงเล็บอาร์เรย์ทีละชั้น (drill-down: ชั้น -> แถว -> ช่อง) ----------
(function bracketDrill() {
  const stage = document.getElementById('bdrillStage');
  const exprEl = document.getElementById('bdrillExpr');
  const axesEl = document.getElementById('bdrillAxes');
  const note = document.getElementById('bdrillNote');
  if (!stage || !exprEl) return;
  const L = 2, R = 3, C = 4;                 // box[2][3][4]
  const t = { k: 1, i: 1, j: 2 };            // ดัชนีเป้าหมาย
  let step = 0;                              // 0..3

  function renderStage() {
    const gap = 42;
    const cx0 = (C - 1) * gap / 2, cy0 = (R - 1) * gap / 2;
    let h = '<div class="arr-scene"><div class="arr-world">';
    for (let k = 0; k < L; k++) for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) {
      const tx = j * gap - cx0, ty = i * gap - cy0, tz = k * gap;
      h += '<div class="arr-cube" data-k="' + k + '" data-i="' + i + '" data-j="' + j + '" style="transform:translate3d(' + tx + 'px,' + ty + 'px,' + tz + 'px)">' +
        '<span class="cf fx"></span><span class="cf bk"></span><span class="cf rt"></span><span class="cf lf"></span><span class="cf tp"></span><span class="cf bt"></span></div>';
    }
    h += '</div></div>';
    stage.innerHTML = h;
    applyStep();
  }
  function applyStep() {
    stage.querySelectorAll('.arr-cube').forEach(function (c) {
      const k = +c.dataset.k, i = +c.dataset.i, j = +c.dataset.j;
      c.className = 'arr-cube';
      if (step === 0) return;
      if (k !== t.k) { c.classList.add('dim'); return; }
      if (step === 1) { c.classList.add('hl-layer'); return; }
      if (i !== t.i) { c.classList.add('dim'); return; }
      if (step === 2) { c.classList.add('hl-row'); return; }
      if (j !== t.j) { c.classList.add('dim'); return; }
      c.classList.add('hl-cell');
    });
    renderExpr(); renderNote();
  }
  function renderExpr() {
    exprEl.innerHTML = '<span class="bname">box</span>' +
      '<span class="bk layer' + (step >= 1 ? ' on' : '') + '">[' + t.k + ']</span>' +
      '<span class="bk row' + (step >= 2 ? ' on' : '') + '">[' + t.i + ']</span>' +
      '<span class="bk col' + (step >= 3 ? ' on' : '') + '">[' + t.j + ']</span>';
  }
  function renderNote() {
    const msgs = [
      'อาร์เรย์ <b class="mono">int box[' + L + '][' + R + '][' + C + ']</b> = ' + L + ' ชั้น · แต่ละชั้น ' + R + ' แถว · แต่ละแถว ' + C + ' ช่อง — กด “ถัดไป” เพื่อไล่วงเล็บ',
      '<b style="color:var(--amber)">วงเล็บที่ 1 [' + t.k + ']</b> เลือก “ชั้น” (layer) — ได้ทั้งแผ่น ' + R + '×' + C + ' = ' + (R * C) + ' ช่อง',
      '<b style="color:var(--green)">วงเล็บที่ 2 [' + t.i + ']</b> เลือก “แถว” (row) ในชั้นนั้น — เหลือ ' + C + ' ช่อง',
      '<b style="color:var(--cyan)">วงเล็บที่ 3 [' + t.j + ']</b> เลือก “คอลัมน์” (col) — เหลือ <b>1 ช่องเดียว</b> = ค่าที่ต้องการ <span class="mono">box[' + t.k + '][' + t.i + '][' + t.j + ']</span>'
    ];
    note.innerHTML = msgs[step];
  }
  function renderAxes() {
    function stp(label, key, color) {
      return '<div class="arr-axis"><span style="color:' + color + '">' + label + '</span>' +
        '<button type="button" class="arr-step" data-t="' + key + '" data-dir="-1">−</button>' +
        '<b class="arr-num">' + t[key] + '</b>' +
        '<button type="button" class="arr-step" data-t="' + key + '" data-dir="1">+</button></div>';
    }
    axesEl.innerHTML = stp('ชั้น k (0–' + (L - 1) + ')', 'k', 'var(--amber)') +
      stp('แถว i (0–' + (R - 1) + ')', 'i', 'var(--green)') +
      stp('คอลัมน์ j (0–' + (C - 1) + ')', 'j', 'var(--cyan)');
    axesEl.querySelectorAll('.arr-step').forEach(function (b) {
      b.addEventListener('click', function () {
        const key = b.dataset.t, dir = +b.dataset.dir;
        const max = { k: L, i: R, j: C }[key];
        const nv = Math.max(0, Math.min(max - 1, t[key] + dir));
        if (nv !== t[key]) { t[key] = nv; renderAxes(); applyStep(); }
      });
    });
  }
  document.getElementById('bdrillNext').addEventListener('click', function () { if (step < 3) { step++; applyStep(); } });
  document.getElementById('bdrillPrev').addEventListener('click', function () { if (step > 0) { step--; applyStep(); } });
  document.getElementById('bdrillReset').addEventListener('click', function () { step = 0; applyStep(); });
  renderAxes(); renderStage();
})();

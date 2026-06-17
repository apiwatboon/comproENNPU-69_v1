/* ============================================================
   week04.js — บทที่ 4: เริ่มต้นเขียนโปรแกรมแรกด้วยภาษาซี
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
      answer = 'ชนิด: ข้อความ (สตริง = อาร์เรย์ของ char)\nตัวอย่าง: printf("%s", ' + v + ');\nจะเจาะลึกในบทที่ 11 — ตอนนี้รู้ไว้ว่าใช้ %s';
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

// ---------- ตัวรันโปรแกรม BMI ทีละบรรทัด (สานต่อผังงานบทที่ 3) ----------
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

// ---------- คำถามแบบทดสอบท้ายบท (quiz.js เป็นผู้วาดหน้าจอ) ----------
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
    q: 'ตัวกำหนดรูปแบบข้อมูล %d ใช้แสดงค่าชนิดใด?',
    opts: ['float', 'char', 'int', 'ข้อความ'],
    ans: 2,
    explain: '%d (decimal) คู่กับ int — จำชุดหลักให้แม่น: int→%d · float→%f · char→%c · ข้อความ→%s ใช้ผิดคู่โปรแกรมไม่พังแต่แสดงค่ามั่ว!'
  },
  {
    q: 'float price = 49.987; แล้ว printf("%.2f", price); จะแสดงอะไร?',
    opts: ['49.987000', '49.98', '49.99', '50'],
    ans: 2,
    explain: '%.2f แสดงทศนิยม 2 ตำแหน่งแบบ "ปัดเศษ": 49.987 → 49.99 — ถ้าใช้ %f เฉย ๆ จะได้ 49.987000 (6 ตำแหน่งเต็ม) รายงานวิศวกรรมจริงจึงใช้ %.2f กันเป็นมาตรฐาน'
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

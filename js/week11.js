/* ============================================================
   week11.js — บทที่ 11: สตริงและการประมวลผลข้อความ (ภาษาซี)
   (ปุ่มรันโค้ด, เครื่องส่อง char array + \0, เครื่องตรวจรหัสสินค้า,
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

// ---------- เครื่องส่อง char array: เห็นดัชนี + \0 ปิดท้าย ----------
(function charArrayInspector() {
  const textInput = document.getElementById('slText');
  const boxes = document.getElementById('slBoxes');
  const result = document.getElementById('slResult');
  if (!textInput || !boxes) return;

  function render() {
    const s = [...textInput.value];
    const n = s.length;

    boxes.innerHTML = '';
    s.forEach((ch, i) => {
      const box = document.createElement('div');
      box.className = 'machine-io';
      box.style.minWidth = '52px';
      box.style.padding = '10px 12px';
      box.innerHTML = '<span class="label">[' + i + ']</span>\'' + ch + '\'';
      boxes.appendChild(box);
    });
    // โบกี้ \0 ปิดท้าย — พระเอกของบทนี้
    const nul = document.createElement('div');
    nul.className = 'machine-io';
    nul.style.minWidth = '52px';
    nul.style.padding = '10px 12px';
    nul.style.outline = '2px solid var(--amber)';
    nul.innerHTML = '<span class="label">[' + n + ']</span>\\0';
    nul.title = 'อักขระ null ที่คอมไพเลอร์เติมให้ — บอกว่าข้อความจบตรงนี้';
    boxes.appendChild(nul);

    result.innerHTML = 'strlen(s) = <b style="color:#a7f3d0">' + n + '</b>' +
      '<span style="color:#94a3b8"> (ไม่นับ \\0)</span> &nbsp;·&nbsp; ' +
      'ต้องจองอย่างน้อย char s[<b style="color:#fbbf24">' + (n + 1) + '</b>]' +
      '<span style="color:#94a3b8"> (เผื่อ \\0 หนึ่งช่องเสมอ)</span>';
  }

  textInput.addEventListener('input', render);
  render();
})();

// ---------- เครื่องตรวจรหัสสินค้า XX-9999 (strlen + isupper + isdigit) ----------
(function productCodeValidator() {
  const input = document.getElementById('pcInput');
  const verdict = document.getElementById('pcVerdict');
  if (!input) return;

  const rules = document.querySelectorAll('#pcRules .cond-item');

  // กฎทั้งสี่ ตรวจตามนิยามใน validate_code.c บนหน้า
  const CHECKS = [
    (c) => c.length === 7,
    (c) => c.length >= 2 && /^[A-Z]{2}$/.test(c.slice(0, 2)),
    (c) => c.length >= 3 && c[2] === '-',
    (c) => c.length >= 7 && /^[0-9]{4}$/.test(c.slice(3, 7)),
  ];

  function render() {
    const code = input.value;
    let passAll = true;
    rules.forEach((el, i) => {
      const ok = CHECKS[i](code);
      el.classList.remove('checking', 'matched', 'skipped');
      if (ok) {
        el.classList.add('matched');
        el.style.borderColor = '';
        el.style.color = '';
      } else {
        passAll = false;
        el.style.borderColor = 'rgba(248, 113, 113, 0.5)';
        el.style.color = '#fca5a5';
      }
    });
    verdict.textContent = code === ''
      ? '— พิมพ์รหัสเพื่อตรวจ —'
      : passAll
        ? '✅ is_valid("' + code + '") → 1 (จริง) — รหัสถูกต้องตามรูปแบบ XX-9999 รับเข้าคลังได้'
        : '❌ is_valid("' + code + '") → 0 (เท็จ) — แก้ตามกฎข้อที่เป็นสีแดงด้านบน';
  }

  input.addEventListener('input', render);
  render();
})();

// ---------- คำถามแบบทดสอบท้ายบท (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'สตริงในภาษาซีคืออะไรกันแน่?',
    opts: [
      'ชนิดข้อมูล string เหมือนภาษาอื่น',
      'อาร์เรย์ของ char ที่ปิดท้ายด้วยอักขระ \\0',
      'ตัวแปร char ตัวเดียวที่เก็บได้หลายอักษร',
      'ลิสต์ของตัวเลขรหัส ASCII ที่ไม่มีจุดจบ'
    ],
    ans: 1,
    explain: 'ภาษาซีไม่มีชนิด string ในตัว — ข้อความคือ char array ธรรมดาที่มีกติกาว่า \\0 ปิดท้ายเพื่อบอกว่าจบตรงไหน ทุกฟังก์ชันสตริงทำงานบนกติกานี้'
  },
  {
    q: 'จะเก็บคำว่า "ENGINE" (6 ตัวอักษร) ต้องประกาศอาร์เรย์อย่างน้อยกี่ช่อง?',
    opts: ['5', '6', '7', '8'],
    ans: 2,
    explain: '6 ตัวอักษร + \\0 อีก 1 = อย่างน้อย char s[7] — ลืมเผื่อช่อง \\0 คือบั๊กสตริงคลาสสิกอันดับหนึ่ง ข้อความจะ "ไม่มีจุดจบ" แล้วลามไปอ่านหน่วยความจำข้างเคียง'
  },
  {
    q: 'strlen("MOTOR-01") มีค่าเท่าใด?',
    opts: ['7', '8', '9', 'ขึ้นกับขนาดอาร์เรย์ที่ประกาศ'],
    ans: 1,
    explain: 'นับตัวอักษรจริง M-O-T-O-R-(-)-0-1 = 8 ตัว — strlen นับถึงก่อน \\0 และไม่สนใจว่าอาร์เรย์จองไว้ใหญ่แค่ไหน (จอง 100 ช่องก็ได้ 8 เท่าเดิม)'
  },
  {
    q: 'char name[20] = "PUMP"; แล้วต้องการเปลี่ยนเป็น "MIXER" — ข้อใดถูกต้อง?',
    opts: ['name = "MIXER";', 'strcpy(name, "MIXER");', 'name == "MIXER";', 'name[] = "MIXER";'],
    ans: 1,
    explain: 'อาร์เรย์กำหนดค่าใหม่ทั้งก้อนด้วย = ไม่ได้ (คอมไพล์ไม่ผ่าน!) ต้องใช้ strcpy คัดลอกเนื้อหาลงไป — = ใช้ได้เฉพาะตอนประกาศครั้งแรกเท่านั้น'
  },
  {
    q: 'การตรวจว่ารหัสผ่านที่ผู้ใช้พิมพ์ (pass) ตรงกับ "eng1234" หรือไม่ ข้อใดถูกต้อง?',
    opts: [
      'if (pass == "eng1234")',
      'if (strcmp(pass, "eng1234") == 0)',
      'if (strcmp(pass, "eng1234") == 1)',
      'if (pass.equals("eng1234"))'
    ],
    ans: 1,
    explain: 'strcmp คืน 0 เมื่อเนื้อหา "เท่ากัน" (สวนความรู้สึกแต่ต้องจำ!) — ส่วน == เทียบตำแหน่งกล่องในหน่วยความจำ ไม่ใช่เนื้อหา ได้ผลผิดแบบเงียบ ๆ'
  },
  {
    q: 'การรับข้อความด้วย scanf ข้อใดถูกต้อง?',
    opts: ['scanf("%s", &name);', 'scanf("%s", name);', 'scanf("%c", name);', 'scanf(name);'],
    ans: 1,
    explain: 'อาร์เรย์ "เป็นตำแหน่ง" อยู่แล้ว จึงไม่ใส่ & — ข้อยกเว้นของกฎ scanf จากบทที่ 5! (และจำไว้ว่า %s หยุดรับที่ช่องว่างแรก)'
  },
  {
    q: 'char s[10] = "ROBOT"; s[0] = \'L\'; printf("%s", s); — แสดงอะไร?',
    opts: ['ROBOT', 'LOBOT', 'L', 'คอมไพล์ไม่ผ่าน เพราะสตริงแก้ไม่ได้'],
    ans: 1,
    explain: 'สตริงซีคืออาร์เรย์ — แก้ "ทีละช่อง" ได้เสมอ: s[0] = \'L\' ทับตัวแรก ได้ LOBOT (ที่ทำไม่ได้คือกำหนดใหม่ทั้งก้อนด้วย =)'
  },
  {
    q: 'ฟังก์ชัน isdigit(c) และ isupper(c) มาจากคลังใด และคืนค่าแบบไหน?',
    opts: [
      'string.h — คืนข้อความ',
      'ctype.h — คืนค่าจริง/เท็จแบบ int (ไม่ใช่ 0 = จริง)',
      'stdio.h — คืน char',
      'math.h — คืน float'
    ],
    ans: 1,
    explain: 'ctype.h คือคลังตรวจชนิดอักขระทีละตัว — ใช้คู่กับลูปไล่สตริงเพื่อตรวจรูปแบบ เช่น "สี่ตัวท้ายเป็นเลขหมดไหม" แบบเครื่องตรวจรหัสสินค้าในบทเรียน'
  },
  {
    q: 'วนนับว่าในสตริง s มีตัวอักษร \'A\' กี่ตัว — หัวลูปที่ถูกต้องคือข้อใด?',
    opts: [
      'for (int i = 0; i < strlen(s); i++)',
      'for (int i = 1; i <= strlen(s); i++)',
      'for (int i = 0; s[i] == \'A\'; i++)',
      'while (s != \'\\0\')'
    ],
    ans: 0,
    explain: 'ดัชนีสตริงเริ่ม 0 และตัวสุดท้ายอยู่ที่ strlen-1 → i < strlen(s) พอดีเป๊ะ — แบบ i <= strlen จะไปแตะช่อง \\0 เกินมาหนึ่ง'
  },
  {
    q: 'จากเครื่องตรวจรหัสสินค้า XX-9999 ในบทเรียน รหัส "ab-1234" จะผ่านหรือไม่ เพราะอะไร?',
    opts: [
      'ผ่าน เพราะครบ 7 ตัวอักษร',
      'ไม่ผ่าน เพราะ isupper(\'a\') ได้เท็จ — สองตัวแรกต้องพิมพ์ใหญ่',
      'ไม่ผ่าน เพราะมีเครื่องหมายขีด',
      'ผ่าน เพราะภาษาซีไม่สนตัวพิมพ์เล็ก-ใหญ่'
    ],
    ans: 1,
    explain: 'ความยาว 7 ✓ ขีด ✓ ท้ายเป็นเลข ✓ แต่กฎข้อสอง isupper ไม่ผ่านเพราะ a, b เป็นตัวพิมพ์เล็ก — ภาษาซีจริงจังกับตัวพิมพ์เสมอ (ลองพิมพ์ในเครื่องตรวจดูได้)'
  }
];

/* ============================================================
   week14.js — คาบที่ 5: ตัวดำเนินการและการรับค่า (ภาษาซี)
   (ปุ่มรันโค้ด, ตัวคำนวณนิพจน์ทีละขั้น, สนามทดลองตรรกะ,
    เครื่องแปลงวินาที, คำถามแบบทดสอบ)
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

// ---------- ตัวคำนวณนิพจน์ทีละขั้น (ทุกตัวแปรเป็น int ตามกติกาภาษาซี) ----------
(function exprStepper() {
  const select = document.getElementById('exprSelect');
  const btnStep = document.getElementById('exprStep');
  const btnReset = document.getElementById('exprReset');
  const stepsBox = document.getElementById('exprSteps');
  const note = document.getElementById('exprNote');
  if (!select || !btnStep) return;

  const HINT = 'ส่วนที่สีเหลืองคือก้อนที่จะถูกคำนวณในขั้นถัดไป (ตัวแปรทุกตัวเป็น int) — กดปุ่มเพื่อเริ่ม';

  const EXPRESSIONS = [
    [
      { expr: '2 + <b>3 * 4</b>', note: 'คูณ (*) สำคัญกว่าบวก (+) — คอมไพเลอร์จึงเล็ง 3 * 4 ก่อน' },
      { expr: '2 + <b>12</b>', note: '3 * 4 = 12 แทนค่ากลับเข้านิพจน์' },
      { expr: '= 14', note: 'เหลือบวกขั้นเดียว: 2 + 12 = 14 — ถ้าคิดซ้ายไปขวาจะได้ 20 ซึ่งผิด!' },
    ],
    [
      { expr: '<b>(8 + 4)</b> / 5', note: 'วงเล็บมาก่อนทุกสิ่ง: คำนวณ 8 + 4 ก่อน' },
      { expr: '<b>12 / 5</b>', note: 'ถึงคิวการหาร — แต่ทั้งคู่เป็น int!' },
      { expr: '= 2', note: '⚠️ int หาร int ตัดเศษทิ้ง: 12 / 5 = 2 ไม่ใช่ 2.4! อยากได้ทศนิยมต้องเขียน 12.0 / 5' },
    ],
    [
      { expr: '<b>17 % 5</b> + 17 / 5 * 2', note: '% / * อยู่ระดับเดียวกัน ทำจากซ้ายไปขวา: เริ่มที่ 17 % 5' },
      { expr: '2 + <b>17 / 5</b> * 2', note: '17 % 5 = เศษ 2 · ถัดไป 17 / 5 ซึ่งเป็น int หาร int' },
      { expr: '2 + <b>3 * 2</b>', note: '17 / 5 = 3 (ตัดเศษทิ้ง) · คูณยังสำคัญกว่าบวก จึงทำ 3 * 2 ก่อน' },
      { expr: '<b>2 + 6</b>', note: 'เหลือบวกขั้นสุดท้าย' },
      { expr: '= 8', note: 'ครบ! การหารแบบตัดเศษ + มอดุลัส คือคู่เครื่องมือเด่นของภาษาซี' },
    ],
    [
      { expr: '<b>10 &gt; 3</b> &amp;&amp; 2 &gt; 5', note: 'ตัวเปรียบเทียบสำคัญกว่า && — คำนวณ 10 > 3 ก่อน' },
      { expr: '1 &amp;&amp; <b>2 &gt; 5</b>', note: '10 > 3 ได้ 1 (จริง — ภาษาซีไม่มี True ใช้เลข 1!) · ถัดไป 2 > 5' },
      { expr: '<b>1 &amp;&amp; 0</b>', note: '2 > 5 ได้ 0 (เท็จ) · && จะได้ 1 ก็ต่อเมื่อจริง "ทั้งคู่"' },
      { expr: '= 0', note: 'ผลคือ 0 (เท็จ) — นี่คือค่าที่จะถูกส่งเข้า if ในคาบหน้า' },
    ],
  ];

  let pos = -1;

  function reset() {
    pos = -1;
    stepsBox.innerHTML = '';
    btnStep.disabled = false;
    btnStep.textContent = 'คำนวณทีละขั้น ▶';
    note.textContent = HINT;
  }

  btnStep.addEventListener('click', () => {
    const steps = EXPRESSIONS[parseInt(select.value, 10)];
    pos++;
    stepsBox.querySelectorAll('.expr-step').forEach((el) => el.classList.add('done'));
    const div = document.createElement('div');
    div.className = 'expr-step';
    div.innerHTML = steps[pos].expr;
    stepsBox.appendChild(div);
    if (typeof gsap !== 'undefined') gsap.from(div, { opacity: 0, y: 14, duration: 0.4, ease: 'power2.out' });
    note.textContent = steps[pos].note;
    if (pos >= steps.length - 1) {
      div.classList.add('done');
      btnStep.disabled = true;
      btnStep.textContent = 'ครบทุกขั้น ✓';
    }
  });

  btnReset.addEventListener('click', reset);
  select.addEventListener('change', reset);
})();

// ---------- สนามทดลองตรรกะ: ผลเป็น 1/0 ตามภาษาซี ----------
(function logicPlayground() {
  const inputA = document.getElementById('logicA');
  const inputB = document.getElementById('logicB');
  const result = document.getElementById('logicResult');
  if (!inputA || !result) return;

  const ROWS = [
    { code: 'a == b', fn: (a, b) => a === b },
    { code: 'a != b', fn: (a, b) => a !== b },
    { code: 'a > b', fn: (a, b) => a > b },
    { code: 'a <= b', fn: (a, b) => a <= b },
    { code: 'a % 2 == 0', fn: (a) => a % 2 === 0, hint: 'a เป็นเลขคู่?' },
    { code: 'a > 0 && b > 0', fn: (a, b) => a > 0 && b > 0 },
    { code: 'a > 0 || b > 0', fn: (a, b) => a > 0 || b > 0 },
    { code: '!(a > b)', fn: (a, b) => !(a > b) },
  ];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function render() {
    const a = parseInt(inputA.value, 10) || 0;
    const b = parseInt(inputB.value, 10) || 0;
    result.innerHTML = ROWS.map((row) => {
      const val = row.fn(a, b);
      return '<span style="color:#94a3b8">' + esc(row.code) + '</span>' +
        (row.hint ? ' <span style="color:#64748b;font-size:0.8em">(' + row.hint + ')</span>' : '') +
        ' → <b style="color:' + (val ? '#a7f3d0' : '#fca5a5') + '">' + (val ? '1 (จริง)' : '0 (เท็จ)') + '</b>';
    }).join('<br>');
  }

  inputA.addEventListener('input', render);
  inputB.addEventListener('input', render);
  render();
})();

// ---------- เครื่องแปลงวินาที → ชม./นาที/วิ (การหารตัดเศษของ int) ----------
(function timeConverter() {
  const input = document.getElementById('timeInput');
  const result = document.getElementById('timeResult');
  if (!input || !result) return;

  function render() {
    let total = parseInt(input.value, 10);
    if (isNaN(total) || total < 0) total = 0;
    const hours = Math.floor(total / 3600);
    const remain = total % 3600;
    const minutes = Math.floor(remain / 60);
    const seconds = remain % 60;
    result.innerHTML =
      'hours   = ' + total + ' / 3600 = <b style="color:#22d3ee">' + hours + '</b>  (int ตัดเศษให้เอง)<br>' +
      'remain  = ' + total + ' % 3600 = <b style="color:#a78bfa">' + remain + '</b><br>' +
      'minutes = ' + remain + ' / 60   = <b style="color:#22d3ee">' + minutes + '</b><br>' +
      'seconds = ' + remain + ' % 60   = <b style="color:#a78bfa">' + seconds + '</b><br><br>' +
      '→ <b style="color:#a7f3d0">' + hours + ' ชม. ' + minutes + ' นาที ' + seconds + ' วิ</b>';
  }

  input.addEventListener('input', render);
  render();
})();

// ---------- คำถามแบบทดสอบท้ายคาบ (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'ในภาษาซี int a = 7, b = 2; ค่าของ a / b คือข้อใด?',
    opts: ['3.5', '3', '4', 'คอมไพล์ไม่ผ่าน'],
    ans: 1,
    explain: 'int หาร int ได้ int — เศษถูกตัดทิ้ง: 7 / 2 = 3 ไม่ใช่ 3.5! อยากได้ทศนิยมต้องมี float ปนอย่างน้อยหนึ่งตัว เช่น 7.0 / 2'
  },
  {
    q: 'ค่าของ 17 / 5 และ 17 % 5 (ทั้งคู่ int) ตามลำดับคือข้อใด?',
    opts: ['3 และ 2', '3.4 และ 2', '2 และ 3', '3 และ 0.4'],
    ans: 0,
    explain: '17 / 5 = 3 (ตัดเศษ) และ 17 % 5 = เศษ 2 — สองตัวนี้เป็นคู่หูกัน: / ได้กี่กลุ่ม, % เหลือเศษเท่าไร'
  },
  {
    q: 'นิพจน์ใดใช้ตรวจว่าตัวแปร n เป็น "เลขคู่"?',
    opts: ['n / 2 == 0', 'n % 2 == 0', 'n == 2', 'n %% 2'],
    ans: 1,
    explain: 'เลขคู่คือหาร 2 ลงตัว = เศษเป็น 0 จึงใช้ n % 2 == 0 — ส่วน n / 2 == 0 จะจริงเฉพาะ n ที่เป็น 0 หรือ 1 (เพราะ int ตัดเศษ)'
  },
  {
    q: 'ผลลัพธ์ของ 2 + 3 * 4 คือข้อใด?',
    opts: ['20', '14', '24', '9'],
    ans: 1,
    explain: 'คูณก่อนบวก: 3 * 4 = 12 แล้ว 2 + 12 = 14 — ลำดับ ( ) → * / % → + − ระดับเดียวกันทำซ้ายไปขวา'
  },
  {
    q: 'โค้ด float c; c = 5 / 9 * (212 - 32); ทำไม c ได้ 0.000000?',
    opts: [
      'เพราะลืม return 0;',
      'เพราะ 5 / 9 เป็น int หาร int ได้ 0 ก่อนคูณอะไรทั้งนั้น',
      'เพราะ printf ใช้ %d',
      'เพราะวงเล็บผิดตำแหน่ง'
    ],
    ans: 1,
    explain: 'กับดักระดับตำนาน: 5 / 9 ถูกคำนวณก่อนเป็น int = 0 → 0 คูณอะไรก็ได้ 0 แม้ c จะเป็น float ก็สายไปแล้ว — ต้องเขียน 5.0 / 9.0 ตั้งแต่ต้น'
  },
  {
    q: 'การรับค่าจำนวนเต็มเข้าตัวแปร age ด้วย scanf ข้อใดถูกต้อง?',
    opts: ['scanf("%d", age);', 'scanf("%d", &age);', 'scanf(age, "%d");', 'scanf("%f", &age);'],
    ans: 1,
    explain: 'scanf ต้องการ "ตำแหน่งกล่อง" จึงต้องมี & หน้าตัวแปรเสมอ และ int คู่กับ %d — แบบไม่มี & คอมไพล์ผ่านแต่รันพัง เป็นบั๊กยอดฮิตอันดับหนึ่งของคาบนี้'
  },
  {
    q: 'จุดต่างสำคัญระหว่าง printf กับ scanf ในการใช้ตัวแปรคือข้อใด?',
    opts: [
      'printf ใช้ %d ส่วน scanf ใช้ %i เท่านั้น',
      'printf ส่งค่าตัวแปรตรง ๆ ส่วน scanf ต้องใส่ & หน้าตัวแปร',
      'scanf แสดงผลได้เหมือน printf',
      'ไม่มีความต่าง ใช้แทนกันได้'
    ],
    ans: 1,
    explain: 'printf แค่ "อ่านค่า" จึงส่งตัวแปรตรง ๆ แต่ scanf ต้อง "เขียนค่าลงกล่อง" จึงต้องรู้ตำแหน่งผ่าน & — จำ: printf ไม่ใส่ & · scanf ใส่ & เสมอ'
  },
  {
    q: 'ในภาษาซี นิพจน์ 8 > 3 มี "ค่า" เป็นอะไร?',
    opts: ['True', 'จริง', '1', 'YES'],
    ans: 2,
    explain: 'ภาษาซีไม่มีชนิด bool ในตัว — การเปรียบเทียบคืนค่า int: 1 = จริง, 0 = เท็จ ลอง printf("%d", 8 > 3); จะเห็นเลข 1 โผล่มาจริง ๆ'
  },
  {
    q: 'กำหนด int score = 65; นิพจน์ score >= 50 && score >= 80 ให้ผลเป็นอะไร?',
    opts: ['1', '0', '65', 'คอมไพล์ไม่ผ่าน'],
    ans: 1,
    explain: 'score >= 50 ได้ 1 แต่ score >= 80 ได้ 0 — && ต้องการจริง "ทั้งคู่" จึงได้ 0 (ถ้าเปลี่ยนเป็น || จะได้ 1 เพราะจริงตัวเดียวก็พอ)'
  },
  {
    q: 'กำหนด int x = 9; คำสั่ง printf("%d %d", x / 4, x % 4); แสดงผลว่าอะไร?',
    opts: ['2 1', '2.25 1', '1 2', '2 0'],
    ans: 0,
    explain: '9 / 4 = 2 (int ตัดเศษ) และ 9 % 4 = 1 (เพราะ 9 = 4×2 + 1) — จึงเห็น "2 1" — ท่าแยกกลุ่ม/เศษที่ใช้ทั้งคอร์สและทั้งชีวิตวิศวกร'
  }
];

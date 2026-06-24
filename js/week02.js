/* ============================================================
   week02.js — บทที่ 2: องค์ประกอบของระบบคอมพิวเตอร์
   (เครื่องแปลงเลขฐานแบบโต้ตอบ, คำถามแบบทดสอบ)
   ============================================================ */

// ---------- เครื่องแปลงเลขฐาน 8 บิต: คลิกบิตหรือพิมพ์เลขฐานสิบได้สองทาง ----------
(function binaryConverter() {
  const bitRow = document.getElementById('bitRow');
  const decInput = document.getElementById('convDecimal');
  if (!bitRow || !decInput) return;

  const BITS = 8;
  let value = 42; // ค่าเริ่มต้นชวนคุย: คำตอบของทุกสิ่งในจักรวาล

  // สร้างปุ่มบิต 8 ช่อง พร้อมค่าประจำหลัก 128..1
  const cells = [];
  for (let i = BITS - 1; i >= 0; i--) {
    const place = 2 ** i;
    const cell = document.createElement('div');
    cell.className = 'bit-cell';
    cell.innerHTML = '<div class="bit-place">' + place + '</div>';
    const btn = document.createElement('button');
    btn.className = 'bit-btn';
    btn.textContent = '0';
    btn.title = 'คลิกเพื่อสลับบิตค่า ' + place;
    btn.addEventListener('click', () => {
      value ^= place;
      render();
      if (typeof gsap !== 'undefined') gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
    });
    cell.appendChild(btn);
    bitRow.appendChild(cell);
    cells.push({ btn, place });
  }

  decInput.addEventListener('input', () => {
    let v = parseInt(decInput.value, 10);
    if (isNaN(v)) v = 0;
    value = Math.max(0, Math.min(255, v));
    render(true);
  });

  function render(skipInput) {
    cells.forEach(({ btn, place }) => {
      const on = (value & place) !== 0;
      btn.textContent = on ? '1' : '0';
      btn.classList.toggle('on', on);
    });
    if (!skipInput) decInput.value = value;
    document.getElementById('convBin').textContent = value.toString(2).padStart(8, '0');
    document.getElementById('convHex').textContent = '0x' + value.toString(16).toUpperCase().padStart(2, '0');
    document.getElementById('convOct').textContent = value.toString(8);

    // แสดงวิธีคิด: ผลบวกของค่าประจำหลักที่บิตเป็น 1
    const parts = cells.filter(({ place }) => (value & place) !== 0).map(({ place }) => place);
    const sumEl = document.getElementById('convSum');
    sumEl.innerHTML = parts.length
      ? parts.join(' + ') + ' = <b>' + value + '</b>'
      : 'ทุกบิตเป็น 0 = <b>0</b>';

    renderSteps();
  }

  // ---------- ค่าประจำหลัก + วิธีแปลง (อัปเดตตามค่าปัจจุบัน) ----------
  function renderSteps() {
    const places = [128, 64, 32, 16, 8, 4, 2, 1];

    // แถบค่าประจำหลัก: 8 หลัก ไฮไลต์หลักที่เป็น 1
    const pvBar = document.getElementById('pvBar');
    if (pvBar) {
      let h = '';
      places.forEach((pl) => {
        const on = (value & pl) !== 0;
        h += '<div class="pv-col' + (on ? ' on' : '') + '">'
          + '<span class="pv-place">' + pl + '</span>'
          + '<span class="pv-bit">' + (on ? 1 : 0) + '</span>'
          + '</div>';
      });
      pvBar.innerHTML = h;
    }

    // ผลรวม: นับค่าหลักที่เป็น 1 มารวมกัน (ไม่ใช้สูตรยกกำลัง)
    const pvSum = document.getElementById('pvSum');
    if (pvSum) {
      const on = places.filter((pl) => value & pl);
      pvSum.innerHTML = on.length
        ? 'นับค่าหลักที่เป็น <b>1</b> มารวมกัน: <span class="pv-terms">' + on.join(' + ') + '</span> = <b class="pv-total">' + value + '</b>'
        : 'ไม่มีหลักที่เป็น 1 → ค่าเท่ากับ <b class="pv-total">0</b>';
    }

    // ฐานสอง → ฐานสิบ : บวกเฉพาะหลักที่เป็น 1 (วิธีค่าประจำหลัก ไม่ใช้สูตรยกกำลัง)
    const bd = document.getElementById('csBinDec');
    if (bd) {
      const onp = places.filter((pl) => value & pl);
      bd.innerHTML = onp.length
        ? '<div class="cs-bd-row">หลักที่เป็น <b>1</b>: ' + onp.map((pl) => '<span class="cs-pv">' + pl + '</span>').join(' ') + '</div>'
          + '<div class="cs-res">' + onp.join(' + ') + ' = <b>' + value + '</b><sub>10</sub></div>'
        : '<div class="cs-res">ไม่มีหลักเป็น 1 → <b>0</b><sub>10</sub></div>';
    }

    // ฐานสิบ → ฐานสอง : หาร 2 เก็บเศษ อ่านล่างขึ้นบน
    const db = document.getElementById('csDecBin');
    if (db) {
      let h = '';
      if (value === 0) {
        h = '<div class="cs-divrow">0 ÷ 2 = 0 เศษ <b>0</b></div><div class="cs-res">= <b>00000000</b><sub>2</sub></div>';
      } else {
        let n = value;
        const rem = [];
        while (n > 0) {
          const q = Math.floor(n / 2);
          const r = n % 2;
          h += '<div class="cs-divrow">' + n + ' ÷ 2 = ' + q + ' เศษ <b>' + r + '</b></div>';
          rem.push(r);
          n = q;
        }
        const bin = rem.slice().reverse().join('');
        h += '<div class="cs-res">อ่านเศษล่าง→บน = ' + bin + ' → <b>' + bin.padStart(8, '0') + '</b><sub>2</sub></div>';
      }
      db.innerHTML = h;
    }

    // ฐานสอง → ฐานสิบหก : จับกลุ่ม 4 บิต
    const bh = document.getElementById('csBinHex');
    if (bh) {
      const bin = value.toString(2).padStart(8, '0');
      const hi = bin.slice(0, 4);
      const lo = bin.slice(4);
      const hx = (s) => parseInt(s, 2).toString(16).toUpperCase();
      bh.innerHTML =
        '<div class="cs-groups"><span class="cs-nib">' + hi + '</span><span class="cs-nib">' + lo + '</span></div>' +
        '<div class="cs-maprow"><span>' + hi + ' = <b>' + hx(hi) + '</b></span><span>' + lo + ' = <b>' + hx(lo) + '</b></span></div>' +
        '<div class="cs-res">→ <b>0x' + hx(hi) + hx(lo) + '</b><sub>16</sub></div>';
    }
  }

  render();
})();

// ---------- ASCII: พิมพ์ข้อความ → เลขฐานสอง + สร้างตารางรหัส ----------
(function asciiTool() {
  const input = document.getElementById('asciiInput');
  const out = document.getElementById('asciiOut');
  const table = document.getElementById('asciiTable');
  if (!input || !out) return;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderOut() {
    const text = input.value;
    if (!text) { out.innerHTML = '<span class="ac-empty">พิมพ์ข้อความด้านบนเพื่อดูเลขฐานสอง...</span>'; return; }
    let h = '';
    for (const ch of text) {
      const code = ch.codePointAt(0);
      if (code > 127) {
        h += '<span class="ac-char bad"><b>' + esc(ch) + '</b><span class="ac-dec">นอก ASCII</span></span>';
        continue;
      }
      const disp = ch === ' ' ? '␣' : esc(ch);
      h += '<span class="ac-char"><b>' + disp + '</b><span class="ac-dec">' + code + '</span><span class="ac-bin">' + code.toString(2).padStart(8, '0') + '</span></span>';
    }
    out.innerHTML = h;
  }

  // สร้างตารางรหัส ASCII อักขระที่พิมพ์ได้ (32–126)
  if (table) {
    let rows = '';
    for (let c = 32; c <= 126; c++) {
      const ch = c === 32 ? '␣ (เว้นวรรค)' : esc(String.fromCharCode(c));
      rows += '<tr><td class="ac-t-char">' + ch + '</td><td>' + c + '</td>'
        + '<td class="mono">' + c.toString(2).padStart(8, '0') + '</td>'
        + '<td class="mono">' + c.toString(16).toUpperCase().padStart(2, '0') + '</td></tr>';
    }
    const tb = table.querySelector('tbody');
    if (tb) tb.innerHTML = rows;
  }

  input.addEventListener('input', renderOut);
  renderOut();
})();

// ---------- การบวกเลขฐานสอง: บวกทีละหลัก + ตัวทด ----------
(function binaryAdder() {
  const baA = document.getElementById('baA');
  const baB = document.getElementById('baB');
  const work = document.getElementById('baWork');
  const check = document.getElementById('baCheck');
  if (!baA || !baB || !work) return;

  const W = 5; // 4 บิต + เผื่อทดอีก 1 บิต (สูงสุด 15+15 = 30)

  function clamp(el) {
    let v = parseInt(el.value, 10);
    if (isNaN(v)) v = 0;
    return Math.max(0, Math.min(15, v));
  }

  function cellRow(arr, isCarry) {
    let h = '';
    for (let i = W - 1; i >= 0; i--) {
      const v = arr[i];
      if (isCarry) h += '<span class="ba-cell carry">' + (v ? '1' : '') + '</span>';
      else h += '<span class="ba-cell">' + v + '</span>';
    }
    return h;
  }

  function render() {
    const a = clamp(baA);
    const b = clamp(baB);
    const carries = [];
    const abits = [];
    const bbits = [];
    const res = [];
    let carry = 0;
    for (let i = 0; i < W; i++) {
      const ab = (a >> i) & 1;
      const bb = (b >> i) & 1;
      carries[i] = carry; // ตัวทดที่เข้าหลักนี้
      const total = ab + bb + carry;
      res[i] = total & 1;
      carry = total >> 1;
      abits[i] = ab;
      bbits[i] = bb;
    }
    work.innerHTML =
      '<div class="ba-row"><span class="ba-tag">ตัวทด</span><span class="ba-cells">' + cellRow(carries, true) + '</span></div>' +
      '<div class="ba-row"><span class="ba-tag"></span><span class="ba-cells">' + cellRow(abits) + '</span></div>' +
      '<div class="ba-row"><span class="ba-tag">+</span><span class="ba-cells">' + cellRow(bbits) + '</span></div>' +
      '<div class="ba-row"><span class="ba-tag"></span><span class="ba-hr"></span></div>' +
      '<div class="ba-row res"><span class="ba-tag">=</span><span class="ba-cells">' + cellRow(res) + '</span></div>';
    if (check) {
      check.innerHTML = 'ตรวจด้วยฐานสิบ: ' + a + ' + ' + b + ' = <b>' + (a + b) + '</b> · ฐานสอง = ' + res.slice().reverse().join('');
    }
  }

  baA.addEventListener('input', render);
  baB.addEventListener('input', render);
  render();
})();

// ---------- 4 องค์ประกอบ: แตะ/คลิกเพื่อสลับแผงรายละเอียด ----------
(function coreSelector() {
  const group = document.querySelector('[data-core-group]');
  if (!group) return;
  const tabs = Array.from(group.querySelectorAll('.core-tab'));
  const panels = Array.from(group.querySelectorAll('.core-panel'));
  if (!tabs.length || tabs.length !== panels.length) return;

  function select(i) {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach((p, k) => p.classList.toggle('active', k === i));
    const panel = panels[i];
    if (panel && typeof gsap !== 'undefined') {
      gsap.fromTo(panel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      select(next);
    });
  });
})();

// ---------- ฮาร์ดแวร์ 5 หน่วย: แตะหน่วยเพื่อดูรายละเอียด + เล่นการไหลของข้อมูล ----------
(function hwUnitSelector() {
  const board = document.querySelector('[data-hw5]');
  if (!board) return;
  const nodes = Array.from(board.querySelectorAll('.hw5-node')); // 0=input 1=cpu 2=mem 3=store 4=output
  const infos = Array.from(board.querySelectorAll('.hw5-info'));
  if (!nodes.length || nodes.length !== infos.length) return;

  const parts = {
    cu: board.querySelector('.p-cu'),
    alu: board.querySelector('.p-alu'),
    reg: board.querySelector('.p-reg'),
  };

  function select(i) {
    nodes.forEach((n, k) => {
      const on = k === i;
      n.classList.toggle('active', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    infos.forEach((info, k) => info.classList.toggle('active', k === i));
    const info = infos[i];
    if (info && typeof gsap !== 'undefined') {
      gsap.fromTo(info, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
  }

  function flashCard(part) {
    const card = board.querySelector('.part-card[data-part="' + part + '"]');
    if (!card) return;
    card.classList.remove('flash');
    void card.offsetWidth;
    card.classList.add('flash');
  }

  nodes.forEach((node, i) => node.addEventListener('click', () => select(i)));

  // กดป้าย CU / ALU / Register บนการ์ด CPU → เปิดแผง CPU แล้วไฮไลต์คำอธิบายตัวนั้น
  Object.entries(parts).forEach(([key, pill]) => {
    if (!pill) return;
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      select(1);
      flashCard(key);
    });
  });
})();

// ---------- ห้องจำลองการทำงานภายใน (ระดับบิต): เล่นสถานการณ์ทีละขั้น ----------
(function bitSim() {
  const root = document.querySelector('[data-bitsim]');
  if (!root) return;
  const packet = root.querySelector('[data-packet]');
  const bits = Array.from(packet.querySelectorAll('.bit'));
  const plabel = packet.querySelector('.packet-label');
  const ptag = packet.querySelector('.packet-tag');
  const caption = root.querySelector('.sim-caption');
  const playBtn = root.querySelector('.sim-play');
  const stepsEl = root.querySelector('[data-steps]');
  const scnBtns = Array.from(root.querySelectorAll('.sim-scn'));

  // ตำแหน่ง (% ของเวที) ของแต่ละจุดที่ข้อมูลแวะ
  const POS = {
    input: { x: 15, y: 50 }, output: { x: 85, y: 50 }, ram: { x: 50, y: 10 }, store: { x: 50, y: 79 },
    cu: { x: 50, y: 38 }, reg: { x: 39, y: 60 }, alu: { x: 61, y: 60 }, cache: { x: 50, y: 26 },
  };

  let timers = [];
  const clearT = () => { timers.forEach(clearTimeout); timers = []; };
  let cur = 0;

  const SCN = [
    {
      hint: 'อ่าน Storage[0001]=0110 → Register A → เขียนลง RAM[0011] ผ่าน Cache',
      init: {}, mem: { store: ['0110', '----', '----', '----'] },
      done: 'เสร็จ! อ่าน Storage[0001] → Reg A → เขียนผ่าน Cache → RAM[0011]',
      steps: [
        { cap: '① CU ส่ง address 0001 ไปอ่าน Storage', from: 'cu', to: 'store', bits: '0001', type: 'addr', active: ['cu', 'store'], row: { u: 'store', i: 0 } },
        { cap: '② Storage ส่ง data 0110 (จากช่อง 0001) เข้า Register A', from: 'store', to: 'reg', bits: '0110', type: 'data', active: ['store', 'reg'], row: { u: 'store', i: 0 }, setReg: { a: '0110' }, regAct: 'a' },
        { cap: '③ จะเขียน RAM — CU ส่ง address 0011 (ข้อมูลจะผ่าน Cache)', from: 'cu', to: 'ram', bits: '0011', type: 'addr', active: ['cu', 'ram'], row: { u: 'ram', i: 2 } },
        { cap: '④ Register A เขียน data 0110 ลง Cache (จำคู่ addr 0011)', from: 'reg', to: 'cache', bits: '0110', type: 'data', active: ['reg', 'cache'], regAct: 'a', write: { u: 'cache', i: 0, d: '0110', a: '0011' } },
        { cap: '⑤ Cache เขียนต่อลง RAM ช่อง 0011 (write-through)', from: 'cache', to: 'ram', bits: '0110', type: 'data', active: ['cache', 'ram'], write: { u: 'ram', i: 2, d: '0110' } },
      ],
    },
    {
      hint: 'อ่าน RAM[0001]=1010 ผ่าน Cache → Register A → เขียนลง Storage[0011]',
      init: {}, mem: { ram: ['1010', '----', '----', '----'] },
      done: 'เสร็จ! อ่าน RAM[0001] ผ่าน Cache → Reg A → เขียน Storage[0011]',
      steps: [
        { cap: '① CU ส่ง address 0001 อ่าน RAM — เช็ค Cache (ยังว่าง = miss)', from: 'cu', to: 'ram', bits: '0001', type: 'addr', active: ['cu', 'cache', 'ram'], row: { u: 'ram', i: 0 } },
        { cap: '② RAM ส่ง data 1010 มาพักที่ Cache (จำคู่ addr 0001)', from: 'ram', to: 'cache', bits: '1010', type: 'data', active: ['ram', 'cache'], row: { u: 'ram', i: 0 }, write: { u: 'cache', i: 0, d: '1010', a: '0001' } },
        { cap: '③ Cache ส่ง data 1010 เข้า Register A', from: 'cache', to: 'reg', bits: '1010', type: 'data', active: ['cache', 'reg'], row: { u: 'cache', i: 0 }, setReg: { a: '1010' }, regAct: 'a' },
        { cap: '④ CU ส่ง address 0011 ปลายทางไป Storage', from: 'cu', to: 'store', bits: '0011', type: 'addr', active: ['cu', 'store'], row: { u: 'store', i: 2 } },
        { cap: '⑤ Register A เขียน data 1010 ลง Storage ช่อง 0011', from: 'reg', to: 'store', bits: '1010', type: 'data', active: ['reg', 'store'], regAct: 'a', write: { u: 'store', i: 2, d: '1010' } },
      ],
    },
    {
      hint: 'รับ Input → เขียน RAM[0010] ผ่าน Cache → อ่านกลับเป็น Cache hit → แสดงผล',
      init: { input: '0011' }, mem: {},
      done: 'เสร็จ! เขียน RAM[0010] ผ่าน Cache → อ่านกลับเป็น Cache hit → แสดงผล',
      steps: [
        { cap: '① หน่วยรับข้อมูลส่งค่า 0011 เข้า Register A', from: 'input', to: 'reg', bits: '0011', type: 'data', active: ['input', 'reg'], setReg: { a: '0011' }, regAct: 'a' },
        { cap: '② CU ส่ง address 0010 ไป RAM (เตรียมเขียน ผ่าน Cache)', from: 'cu', to: 'ram', bits: '0010', type: 'addr', active: ['cu', 'ram'], row: { u: 'ram', i: 1 } },
        { cap: '③ Register A เขียน data 0011 ลง Cache (addr 0010)', from: 'reg', to: 'cache', bits: '0011', type: 'data', active: ['reg', 'cache'], regAct: 'a', write: { u: 'cache', i: 0, d: '0011', a: '0010' } },
        { cap: '④ Cache เขียนต่อลง RAM ช่อง 0010 (write-through)', from: 'cache', to: 'ram', bits: '0011', type: 'data', active: ['cache', 'ram'], write: { u: 'ram', i: 1, d: '0011' } },
        { cap: '⑤ จะแสดงผล → เช็ค Cache addr 0010 → เจอ! (Cache hit)', from: 'cu', to: 'cache', bits: '0010', type: 'addr', active: ['cu', 'cache'], row: { u: 'cache', i: 0 } },
        { cap: '⑥ ดึงจาก Cache เข้า Register ทันที (ไม่ต้องไป RAM)', from: 'cache', to: 'reg', bits: '0011', type: 'data', active: ['cache', 'reg'], row: { u: 'cache', i: 0 }, setReg: { a: '0011' }, regAct: 'a' },
        { cap: '⑦ Register A ส่งข้อมูลออกหน่วยแสดงผล (จอภาพ)', from: 'reg', to: 'output', bits: '0011', type: 'data', active: ['reg', 'output'], regAct: 'a', onArrive: { output: '0011' } },
      ],
    },
    {
      hint: 'โหลด RAM[0001],RAM[0010] ผ่าน Cache → ALU บวก → เขียน RAM[0011] ผ่าน Cache',
      init: {}, mem: { ram: ['0010', '0011', '----', '----'] },
      done: 'เสร็จ! A=0010, B=0011 → ALU = 0101 → เขียน RAM[0011] ผ่าน Cache',
      steps: [
        { cap: '① CU ส่ง address 0001 อ่านค่าที่ 1 — เช็ค Cache (miss)', from: 'cu', to: 'ram', bits: '0001', type: 'addr', active: ['cu', 'cache', 'ram'], row: { u: 'ram', i: 0 } },
        { cap: '② RAM ส่ง 0010 มาพักที่ Cache', from: 'ram', to: 'cache', bits: '0010', type: 'data', active: ['ram', 'cache'], row: { u: 'ram', i: 0 }, write: { u: 'cache', i: 0, d: '0010', a: '0001' } },
        { cap: '③ Cache ส่ง 0010 เข้า Register A', from: 'cache', to: 'reg', bits: '0010', type: 'data', active: ['cache', 'reg'], row: { u: 'cache', i: 0 }, setReg: { a: '0010' }, regAct: 'a' },
        { cap: '④ CU ส่ง address 0010 อ่านค่าที่ 2 — เช็ค Cache (miss)', from: 'cu', to: 'ram', bits: '0010', type: 'addr', active: ['cu', 'cache', 'ram'], row: { u: 'ram', i: 1 } },
        { cap: '⑤ RAM ส่ง 0011 มาพักที่ Cache', from: 'ram', to: 'cache', bits: '0011', type: 'data', active: ['ram', 'cache'], row: { u: 'ram', i: 1 }, write: { u: 'cache', i: 1, d: '0011', a: '0010' } },
        { cap: '⑥ Cache ส่ง 0011 เข้า Register B', from: 'cache', to: 'reg', bits: '0011', type: 'data', active: ['cache', 'reg'], row: { u: 'cache', i: 1 }, setReg: { b: '0011' }, regAct: 'b' },
        { cap: '⑦ CU สั่ง ALU บวกค่าใน Register A + B', from: 'reg', to: 'alu', bits: '0011', type: 'data', active: ['cu', 'reg', 'alu'], regAct: 'b' },
        { cap: '⑧ ALU = 0010 + 0011 = 0101 เก็บที่ Register C', from: 'alu', to: 'reg', bits: '0101', type: 'data', active: ['alu', 'reg'], setReg: { c: '0101' }, regAct: 'c' },
        { cap: '⑨ CU ส่ง address 0011 เขียนผลลัพธ์ (ผ่าน Cache)', from: 'cu', to: 'ram', bits: '0011', type: 'addr', active: ['cu', 'ram'], row: { u: 'ram', i: 2 } },
        { cap: '⑩ Register C เขียน 0101 ลง Cache (addr 0011)', from: 'reg', to: 'cache', bits: '0101', type: 'data', active: ['reg', 'cache'], regAct: 'c', write: { u: 'cache', i: 0, d: '0101', a: '0011' } },
        { cap: '⑪ Cache เขียนต่อลง RAM ช่อง 0011', from: 'cache', to: 'ram', bits: '0101', type: 'data', active: ['cache', 'ram'], write: { u: 'ram', i: 2, d: '0101' } },
      ],
    },
    {
      hint: 'ดู Cache miss กับ hit ต่างกันอย่างไร (ข้อมูลรออยู่ที่ RAM[0011])',
      init: {}, mem: { ram: ['----', '----', '0110', '----'] },
      done: 'ครั้งแรก miss ต้องไป RAM (ช้า) · ครั้งสอง hit ดึงจาก Cache ได้เลย (เร็ว)',
      steps: [
        { cap: '① เช็ค Cache addr 0011 — ยังว่าง = ไม่เจอ (Cache miss)', from: 'cu', to: 'cache', bits: '0011', type: 'addr', active: ['cu', 'cache'] },
        { cap: '② miss → ส่ง address 0011 ไปอ่าน RAM', from: 'cu', to: 'ram', bits: '0011', type: 'addr', active: ['cu', 'ram'], row: { u: 'ram', i: 2 } },
        { cap: '③ RAM ส่ง 0110 มา เก็บสำเนาไว้ใน Cache', from: 'ram', to: 'cache', bits: '0110', type: 'data', active: ['ram', 'cache'], row: { u: 'ram', i: 2 }, write: { u: 'cache', i: 0, d: '0110', a: '0011' } },
        { cap: '④ Cache ส่ง 0110 เข้า Register A', from: 'cache', to: 'reg', bits: '0110', type: 'data', active: ['cache', 'reg'], row: { u: 'cache', i: 0 }, setReg: { a: '0110' }, regAct: 'a' },
        { cap: '⑤ ขอ addr 0011 อีกครั้ง → เช็ค Cache → เจอ! (Cache hit)', from: 'cu', to: 'cache', bits: '0011', type: 'addr', active: ['cu', 'cache'], row: { u: 'cache', i: 0 } },
        { cap: '⑥ ดึงจาก Cache ได้ทันที ไม่ต้องไป RAM — เร็วกว่ามาก', from: 'cache', to: 'reg', bits: '0110', type: 'data', active: ['cache', 'reg'], row: { u: 'cache', i: 0 }, setReg: { b: '0110' }, regAct: 'b' },
      ],
    },
  ];

  function setVal(u, v) {
    const el = root.querySelector('[data-val="' + u + '"]');
    if (!el) return;
    el.textContent = v;
    el.classList.toggle('has', !!v && v !== '—');
  }
  function resetVals() {
    root.querySelectorAll('.u-val').forEach((e) => { e.textContent = '—'; e.classList.remove('has'); });
  }
  // ---- ตารางหน่วยความจำ (RAM/Storage/Cache) ----
  function setCell(u, i, data, addr) {
    const row = root.querySelector('.u-' + u + ' .mem-row[data-row="' + i + '"]');
    if (!row) return;
    const d = row.querySelector('.m-data');
    if (d) { d.textContent = data; d.classList.toggle('empty', !data || /^-+$/.test(data)); }
    if (addr !== undefined) { const a = row.querySelector('.m-addr'); if (a) a.textContent = addr; }
  }
  function hiRow(u, i) { const row = root.querySelector('.u-' + u + ' .mem-row[data-row="' + i + '"]'); if (row) row.classList.add('act'); }
  function clearRows() { root.querySelectorAll('.mem-row').forEach((r) => r.classList.remove('act')); }
  function resetMem() {
    root.querySelectorAll('.u-cache .m-addr').forEach((a) => { a.textContent = '--'; });
    root.querySelectorAll('.mem-row .m-data').forEach((d) => { d.textContent = '----'; d.classList.add('empty'); });
    clearRows();
  }
  function applyMem(mem) {
    if (!mem) return;
    Object.entries(mem).forEach(([u, rows]) => rows.forEach((v, i) => { if (v && !/^-+$/.test(v)) setCell(u, i, v); }));
  }
  function setReg(which, val) {
    const row = root.querySelector('.reg-row[data-reg="' + which + '"]');
    if (!row) return;
    row.querySelectorAll('.rbit').forEach((d, i) => d.classList.toggle('on', val[i] === '1'));
  }
  function resetRegs() {
    root.querySelectorAll('.reg-row').forEach((row) => {
      row.classList.remove('act');
      row.querySelectorAll('.rbit').forEach((d) => d.classList.remove('on'));
    });
  }
  function actReg(which) {
    root.querySelectorAll('.reg-row').forEach((r) => r.classList.toggle('act', !!which && r.dataset.reg === which));
  }
  function setBits(str, type) {
    bits.forEach((b, i) => b.classList.toggle('on', str[i] === '1'));
    plabel.textContent = str;
    packet.classList.toggle('addr', type === 'addr');
    if (ptag) ptag.textContent = type === 'addr' ? 'address' : 'data';
  }
  function highlight(ids) {
    root.querySelectorAll('.sim-unit, .sim-part').forEach((el) => el.classList.remove('act'));
    (ids || []).forEach((id) => { const el = root.querySelector('[data-u="' + id + '"]'); if (el) el.classList.add('act'); });
  }
  function placePacket(p) { packet.style.transition = 'none'; packet.style.left = p.x + '%'; packet.style.top = p.y + '%'; }
  function movePacket(p) {
    void packet.offsetWidth;
    packet.style.transition = 'left 2.5s ease, top 2.5s ease, opacity .4s';
    packet.style.left = p.x + '%'; packet.style.top = p.y + '%';
  }
  function renderSteps(n) {
    stepsEl.innerHTML = '';
    for (let i = 0; i < n; i++) stepsEl.appendChild(document.createElement('i'));
  }

  function setScenario(i) {
    stop();
    cur = i;
    scnBtns.forEach((b, k) => b.classList.toggle('active', k === i));
    resetVals();
    resetRegs();
    resetMem();
    const sc = SCN[i];
    Object.entries(sc.init || {}).forEach(([u, v]) => setVal(u, v));
    applyMem(sc.mem);
    renderSteps(sc.steps.length);
    highlight([]);
    packet.style.opacity = '0';
    caption.textContent = sc.hint;
  }

  function runStep(step, idx) {
    highlight(step.active);
    actReg(step.regAct);
    clearRows();
    if (step.row) hiRow(step.row.u, step.row.i);
    caption.textContent = step.cap;
    stepsEl.querySelectorAll('i').forEach((d, k) => { d.classList.toggle('cur', k === idx); d.classList.toggle('done', k < idx); });
    packet.style.opacity = '0';
    placePacket(POS[step.from]);
    setBits(step.bits, step.type);
    // โผล่ที่ต้นทาง แล้วค้างไว้ ~2 วินาที
    timers.push(setTimeout(() => { packet.style.opacity = '1'; }, 80));
    // หลังค้าง 2 วินาที ค่อยเลื่อนไปยังปลายทาง
    timers.push(setTimeout(() => { movePacket(POS[step.to]); }, 2000));
    // ถึงปลายทาง (2000 + 2500 travel) → อัปเดตค่า แล้วค้างต่ออีก ~2 วินาที (คุมโดย interval)
    timers.push(setTimeout(() => {
      if (step.onArrive) Object.entries(step.onArrive).forEach(([u, v]) => setVal(u, v));
      if (step.setReg) Object.entries(step.setReg).forEach(([r, v]) => setReg(r, v));
      if (step.write) { setCell(step.write.u, step.write.i, step.write.d, step.write.a); hiRow(step.write.u, step.write.i); }
    }, 2000 + 2500));
  }

  function play() {
    setScenario(cur);
    playBtn.disabled = true;
    const sc = SCN[cur];
    let t = 500;
    sc.steps.forEach((step, idx) => { timers.push(setTimeout(() => runStep(step, idx), t)); t += 6500; });
    timers.push(setTimeout(() => {
      packet.style.opacity = '0';
      highlight([]);
      actReg(null);
      stepsEl.querySelectorAll('i').forEach((d) => { d.classList.remove('cur'); d.classList.add('done'); });
      caption.textContent = sc.done;
      playBtn.disabled = false;
    }, t));
  }

  function stop() { clearT(); if (playBtn) playBtn.disabled = false; }

  // วางบัสให้อยู่เฉพาะช่องว่างระหว่างกล่อง (วัดจากขอบกล่องจริง)
  function layoutBuses() {
    const stage = root.querySelector('.sim-stage');
    if (!stage) return;
    const S = stage.getBoundingClientRect();
    if (!S.width) return;
    const pct = (sel) => {
      const el = root.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        l: (r.left - S.left) / S.width * 100, r: (r.right - S.left) / S.width * 100,
        t: (r.top - S.top) / S.height * 100, b: (r.bottom - S.top) / S.height * 100,
      };
    };
    const ram = pct('.u-ram'), cache = pct('.u-cache'), cpu = pct('.sim-cpu'),
      input = pct('.u-input'), output = pct('.u-output'), store = pct('.u-store');
    if (!ram || !cache || !cpu || !input || !output || !store) return;
    const setV = (sel, top, bot) => { const e = root.querySelector(sel); if (e) { e.style.top = top + '%'; e.style.height = Math.max(0, bot - top) + '%'; } };
    const setH = (sel, left, right) => { const e = root.querySelector(sel); if (e) { e.style.left = left + '%'; e.style.width = Math.max(0, right - left) + '%'; } };
    setV('.b-ram1', ram.b, cache.t);
    setV('.b-ram2', cache.b, cpu.t);
    setV('.b-store', cpu.b, store.t);
    setH('.b-in', input.r, cpu.l);
    setH('.b-out', cpu.r, output.l);
  }

  scnBtns.forEach((b, i) => b.addEventListener('click', () => setScenario(i)));
  playBtn.addEventListener('click', play);
  setScenario(0);
  layoutBuses();
  window.addEventListener('resize', layoutBuses);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutBuses);
  setTimeout(layoutBuses, 500);
})();

// ---------- คำถามแบบทดสอบท้ายบท (เรนเดอร์โดย quiz.js) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'องค์ประกอบของ "ระบบคอมพิวเตอร์" ที่ครบถ้วน ประกอบด้วยอะไรบ้าง?',
    opts: [
      'ฮาร์ดแวร์ และซอฟต์แวร์',
      'ฮาร์ดแวร์ ซอฟต์แวร์ บุคลากร และข้อมูล',
      'CPU จอภาพ และคีย์บอร์ด',
      'ระบบปฏิบัติการ และโปรแกรมประยุกต์',
    ],
    ans: 1,
    explain: 'ระบบคอมพิวเตอร์ที่ทำงานได้จริงต้องมีครบ 4 ส่วน: ฮาร์ดแวร์ (ตัวเครื่อง) ซอฟต์แวร์ (ชุดคำสั่ง) บุคลากร (ผู้ใช้/ผู้พัฒนา) และข้อมูล (สิ่งที่ถูกประมวลผล) — ขาดส่วนใดส่วนหนึ่ง ระบบก็ไร้ความหมาย',
  },
  {
    q: 'หน่วยย่อยใดของ CPU ทำหน้าที่ "คำนวณทางคณิตศาสตร์และเปรียบเทียบทางตรรกะ"?',
    opts: ['Control Unit (CU)', 'Register', 'Arithmetic & Logic Unit (ALU)', 'Cache'],
    ans: 2,
    explain: 'ALU คือหน่วยคำนวณและตรรกะ — บวก ลบ คูณ หาร และเปรียบเทียบ (มากกว่า/น้อยกว่า/เท่ากับ) ส่วน CU ทำหน้าที่ควบคุมลำดับการทำงาน และ Register คือที่พักข้อมูลความเร็วสูงสุดใน CPU',
  },
  {
    q: 'ข้อใดอธิบายความแตกต่างระหว่าง RAM กับ ROM ได้ถูกต้อง?',
    opts: [
      'RAM อ่านได้อย่างเดียว ส่วน ROM เขียนได้',
      'RAM เก็บข้อมูลถาวร ส่วน ROM ลบเลือนเมื่อปิดเครื่อง',
      'RAM ลบเลือนเมื่อไฟดับ (volatile) ส่วน ROM เก็บข้อมูลถาวร',
      'ไม่มีความแตกต่าง ใช้แทนกันได้',
    ],
    ans: 2,
    explain: 'RAM (Random Access Memory) เป็นหน่วยความจำชั่วคราว ข้อมูลหายเมื่อปิดเครื่อง ส่วน ROM (Read-Only Memory) เก็บโปรแกรมถาวร เช่น เฟิร์มแวร์สำหรับบูตเครื่อง (BIOS/UEFI)',
  },
  {
    q: 'ข้อใดอธิบาย "Compiler" ต่างจาก "Interpreter" ได้ถูกต้อง (และภาษา C ใช้แบบใด)?',
    opts: [
      'Compiler แปลทั้งโปรแกรมทีเดียวได้ไฟล์ภาษาเครื่อง (.exe) — ภาษา C ใช้ Compiler',
      'Interpreter แปลทั้งโปรแกรมทีเดียว ส่วน Compiler แปลทีละบรรทัด',
      'ทั้งคู่ทำงานเหมือนกันทุกอย่าง',
      'ภาษา C ใช้ Interpreter แปลทีละบรรทัด',
    ],
    ans: 0,
    explain: 'Compiler แปล "ทั้งโปรแกรมทีเดียว" ได้ไฟล์ภาษาเครื่อง (เช่น .exe) แล้วรันเร็ว · Interpreter แปล+รัน "ทีละบรรทัด" (เช่น Python) · ภาษา C ในวิชานี้ใช้ Compiler (เช่น GCC) · ส่วน Assembler ใช้แปลภาษาแอสเซมบลี',
  },
  {
    q: 'ภาษาใดเป็น "ภาษาระดับสูง (High-level)" ที่เขียน/อ่านใกล้ภาษามนุษย์ที่สุด?',
    opts: ['ภาษาเครื่อง (10110001)', 'แอสเซมบลี (MOV AX, 5)', 'ภาษา C / Python', 'รหัสฐานสิบหก (B8 05)'],
    ans: 2,
    explain: 'ภาษาระดับสูง (C, Python, Java) ใกล้ภาษามนุษย์ ไม่ผูกกับ CPU · แอสเซมบลีเป็นภาษาระดับต่ำ (ใกล้เครื่อง ใช้คำย่อ MOV/ADD) · ภาษาเครื่องคือ 0/1 ที่ CPU เข้าใจตรง ๆ',
  },
  {
    q: 'รหัส ASCII ของตัวอักษร "A" คือ 65 (ฐานสิบ) ตรงกับเลขฐานสอง 8 บิตข้อใด?',
    opts: ['01000001', '00111111', '01100101', '10000001'],
    ans: 0,
    explain: '65 = 64 + 1 → หลัก 64 และหลัก 1 เป็น 1 ที่เหลือเป็น 0 = 01000001 · ASCII คือรหัสที่กำหนดเลขประจำตัวให้อักขระแต่ละตัว เพื่อเก็บ "ตัวอักษร" เป็นเลขฐานสองได้',
  },
  {
    q: 'ข้อใดถูกต้องเกี่ยวกับ "ขนาดไฟล์" กับ "ความเร็วเน็ต"?',
    opts: [
      'ขนาดไฟล์วัดเป็น Byte (MB) · ความเร็วเน็ตวัดเป็น bit/วินาที (Mbps) — เน็ต 100 Mbps โหลดได้จริง ~12.5 MB/s',
      'ทั้งขนาดไฟล์และความเร็วเน็ตวัดเป็น Byte เหมือนกัน',
      'เน็ต 100 Mbps โหลดไฟล์ได้ 100 MB ต่อวินาที',
      '1 Byte = 4 bit',
    ],
    ans: 0,
    explain: 'ขนาดข้อมูล/ไฟล์วัดเป็น Byte (KB, MB) · ความเร็วเน็ตวัดเป็น bit ต่อวินาที (kbps, Mbps) · เพราะ 8 bit = 1 byte เน็ต 100 Mbps จึงโหลดได้จริง 100÷8 ≈ 12.5 MB/วินาที ไม่ใช่ 100',
  },
  {
    q: 'เลขฐานสอง 0111 มีค่าเท่ากับเลขฐานสิบเท่าใด (บวกค่าประจำหลักที่เป็น 1)?',
    opts: ['5', '7', '11', '14'],
    ans: 1,
    explain: 'หลักที่เป็น 1 มีค่าประจำหลัก 4, 2, 1 → 4 + 2 + 1 = 7 · แค่บวกค่าของหลักที่เป็น 1 เข้าด้วยกัน (ตั้งหลักไว้ 1·2·4·8… จาก LSB)',
  },
  {
    q: 'เลขฐานสิบ 10 เขียนเป็นเลขฐานสิบหก (Hexadecimal) ได้อย่างไร?',
    opts: ['10', '9', 'A', 'B'],
    ans: 2,
    explain: 'เลขฐานสิบหกพอถึง 10 จะใช้ตัวอักษร A แทน (A=10, B=11, … F=15) · และ 10 = 1010 ในฐานสอง = A ในฐานสิบหกพอดี (4 บิต = 1 หลักฐานสิบหก)',
  },
  {
    q: 'การบวกเลขฐานสอง 1 + 1 ได้ผลลัพธ์อย่างไร?',
    opts: ['1', '2', '10 (เขียน 0 ทด 1)', '11'],
    ans: 2,
    explain: 'ในฐานสอง 1 + 1 = 10 คือได้ 0 แล้ว "ทด" 1 ขึ้นหลักหน้า — เหมือนฐานสิบที่ 9 + 1 = 10 · การบวกแบบนี้คืองานหลักของ ALU ใน CPU',
  },
];

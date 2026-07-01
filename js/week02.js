/* ============================================================
   week02.js — คาบที่ 2: องค์ประกอบของระบบคอมพิวเตอร์
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


// ---------- กิจกรรม: encode ข้อความ (A-Z + วรรค) -> ฐาน 2 / ฐาน 16 ----------
(function encodeTool() {
  const input = document.getElementById('encInput');
  const binOut = document.getElementById('encBin');
  const hexOut = document.getElementById('encHex');
  const hint = document.getElementById('encHint');
  const clearBtn = document.getElementById('encClear');
  if (!input || !binOut || !hexOut) return;
  const HINT_DEFAULT = 'พิมพ์ได้เฉพาะ A-Z และเว้นวรรค (พิมพ์เล็กจะแปลงเป็นตัวใหญ่ให้อัตโนมัติ)';
  const EMPTY_MSG = 'ผลลัพธ์จะขึ้นที่นี่เมื่อพิมพ์ข้อความ...';
  function setEmpty() {
    binOut.textContent = EMPTY_MSG; hexOut.textContent = EMPTY_MSG;
    binOut.classList.add('empty'); hexOut.classList.add('empty');
  }
  function render() {
    const raw = input.value;
    const cleaned = raw.toUpperCase().replace(/[^A-Z ]/g, '');
    if (cleaned !== raw) {
      const pos = input.selectionStart;
      input.value = cleaned;
      const removed = raw.length - cleaned.length;
      try { input.setSelectionRange(pos - removed, pos - removed); } catch (e) {}
      if (removed > 0 && hint) { hint.textContent = 'ตัดอักขระที่ไม่ใช่ A-Z หรือเว้นวรรคออกให้แล้ว'; hint.classList.add('warn'); }
    } else if (hint) { hint.textContent = HINT_DEFAULT; hint.classList.remove('warn'); }
    if (!cleaned) { setEmpty(); return; }
    const bins = [], hexes = [];
    for (const ch of cleaned) {
      const code = ch.charCodeAt(0);
      bins.push(code.toString(2).padStart(8, '0'));
      hexes.push(code.toString(16).toUpperCase().padStart(2, '0'));
    }
    binOut.textContent = bins.join(' '); hexOut.textContent = hexes.join(' ');
    binOut.classList.remove('empty'); hexOut.classList.remove('empty');
  }
  document.querySelectorAll('.enc-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = document.getElementById(btn.dataset.target);
      if (!target || target.classList.contains('empty')) return;
      const text = target.textContent;
      const label = btn.querySelector('span');
      const original = label ? label.textContent : '';
      const flashDone = function () {
        btn.classList.add('done');
        if (label) label.textContent = 'คัดลอกแล้ว!';
        setTimeout(function () { btn.classList.remove('done'); if (label) label.textContent = original; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flashDone).catch(function () { fallbackCopy(text); flashDone(); });
      } else { fallbackCopy(text); flashDone(); }
    });
  });
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      if (hint) { hint.textContent = HINT_DEFAULT; hint.classList.remove('warn'); }
      setEmpty(); input.focus();
    });
  }
  input.addEventListener('input', render);
  setEmpty();
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

// ---------- คำถามแบบทดสอบท้ายคาบ (เรนเดอร์โดย quiz.js) ----------
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


// ---------- อนิเมชัน bandwidth: บิต (1 จุด = 1 bit) วิ่งจากเสาสัญญาณเข้ามือถือ + ถังข้อมูลที่ใช้ ----------
(function bandwidthDemo() {
  const canvas = document.getElementById('bwCanvas');
  const tank = document.getElementById('bwTank');
  const input = document.getElementById('bwInput');
  if (!canvas || !tank || !input) return;
  const rateEl = document.getElementById('bwRate');
  const usedEl = document.getElementById('bwUsed');
  const perSecEl = document.getElementById('bwPerSec');
  const noteEl = document.getElementById('bwNote');
  const clearBtn = document.getElementById('bwClear');
  const toggleBtn = document.getElementById('bwToggle');
  const presets = document.querySelectorAll('.bw-preset');
  const ctx = canvas.getContext('2d');

  const TRAVEL = 1.15, MAX_DOTS = 170, SPAWN_CAP = 110, EYE_COUNT = 15, STREAM = 60, TANK_CAP = 320;
  let rate = 8, dots = [], spawnAcc = 0, realBits = 0, shownDots = 0, overflowEl = null;
  let running = false, raf = null, last = performance.now();
  let dpr = 1, W = 0, H = 0, sprite = null, spriteR = 0;

  function makeSprite() {
    const r = Math.round(6 * dpr); spriteR = r;
    const c = document.createElement('canvas'); c.width = c.height = r * 2;
    const cx = c.getContext('2d');
    const g = cx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, 'rgba(150,240,255,1)');
    g.addColorStop(0.35, 'rgba(34,211,238,0.95)');
    g.addColorStop(1, 'rgba(34,211,238,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(r, r, r, 0, Math.PI * 2); cx.fill();
    sprite = c;
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width * dpr));
    H = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = W; canvas.height = H; makeSprite();
  }
  function fmtInt(n) { return Math.floor(n).toLocaleString('en-US'); }
  function fmtData(bits) {
    const B = bits / 8; let big;
    if (B < 1024) big = (B < 10 ? B.toFixed(1) : Math.round(B)) + ' B';
    else if (B < 1048576) big = (B / 1024).toFixed(1) + ' KB';
    else if (B < 1073741824) big = (B / 1048576).toFixed(2) + ' MB';
    else big = (B / 1073741824).toFixed(2) + ' GB';
    return (bits < 100000 ? fmtInt(bits) + ' bit = ' : '') + big;
  }
  function setNote() {
    let msg = '';
    if (rate <= 0) msg = 'ความเร็ว 0 - ไม่มีบิตวิ่งเข้ามา';
    else if (rate > STREAM) {
      msg = 'เร็วเกิน ~' + STREAM + ' จุด/วินาที - ตาแยกจุดไม่ออก เห็นเป็นสายต่อเนื่อง';
      if (rate > SPAWN_CAP) msg += ' · ของจริง ' + fmtInt(rate) + ' bps เร็วกว่าที่ตาเห็นมาก (สาธิตแค่พอเห็นภาพ แต่ตัวเลขวิ่งจริง)';
    } else if (rate > EYE_COUNT) msg = '~' + rate + ' จุด/วินาที เริ่มเร็วจนนับตามแทบไม่ทัน';
    else msg = 'ส่งทีละบิต ' + rate + ' จุด/วินาที - นับตามได้สบาย';
    noteEl.textContent = msg;
  }
  function setRate(v) {
    rate = Math.max(0, Math.min(1e9, Math.round(v) || 0));
    rateEl.textContent = fmtInt(rate);
    perSecEl.textContent = rate > 0 ? fmtData(rate) + '/วินาที' : '-';
    setNote();
    presets.forEach((b) => b.classList.toggle('active', +b.dataset.bps === rate));
  }
  function syncTank() {
    const target = Math.min(Math.floor(realBits), TANK_CAP);
    while (shownDots < target) {
      const d = document.createElement('span');
      d.className = 'bw-bit' + (shownDots % 8 === 7 ? ' byte' : '');
      if (overflowEl) tank.insertBefore(d, overflowEl); else tank.appendChild(d);
      shownDots++;
    }
    if (realBits > TANK_CAP && !overflowEl) {
      overflowEl = document.createElement('span');
      overflowEl.className = 'bw-tank-more';
      overflowEl.textContent = '... เต็มจอ';
      tank.appendChild(overflowEl);
    }
  }
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (running) {
      realBits += rate * dt;
      const vRate = Math.min(rate, SPAWN_CAP);
      spawnAcc += vRate * dt;
      while (spawnAcc >= 1) { spawnAcc -= 1; if (dots.length < MAX_DOTS) dots.push({ p: 0, lane: Math.random() * 2 - 1 }); }
      if (dots.length >= MAX_DOTS) spawnAcc = 0;
    }
    const step = dt / TRAVEL;
    for (let i = dots.length - 1; i >= 0; i--) { dots[i].p += step; if (dots[i].p >= 1) dots.splice(i, 1); }
    syncTank();
    usedEl.textContent = fmtData(realBits);
    perSecEl.textContent = rate > 0 ? fmtData(rate) + '/วินาที' : '-';
    ctx.clearRect(0, 0, W, H);
    const stream = rate > STREAM;
    if (stream) {
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, 'rgba(34,211,238,0)');
      grad.addColorStop(0.5, 'rgba(34,211,238,0.5)');
      grad.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2 * dpr;
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    }
    const amp = H * 0.2;
    for (const d of dots) { const x = d.p * W; const y = H / 2 + d.lane * amp; ctx.drawImage(sprite, x - spriteR, y - spriteR); }
    if (running || dots.length > 0) raf = requestAnimationFrame(frame); else raf = null;
  }
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>';
  const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  function setToggle() {
    toggleBtn.classList.toggle('running', running);
    toggleBtn.innerHTML = running ? PAUSE : PLAY;
    toggleBtn.setAttribute('aria-label', running ? 'หยุด' : 'เริ่ม');
    toggleBtn.title = running ? 'หยุด' : 'เริ่ม';
  }
  function start() { if (running) return; running = true; last = performance.now(); setToggle(); if (!raf) raf = requestAnimationFrame(frame); }
  function stop() { running = false; setToggle(); }
  toggleBtn.addEventListener('click', function () { running ? stop() : start(); });
  clearBtn.addEventListener('click', function () {
    realBits = 0; shownDots = 0; dots = []; spawnAcc = 0; overflowEl = null;
    tank.innerHTML = ''; usedEl.textContent = '0 bit = 0 B'; ctx.clearRect(0, 0, W, H);
  });
  input.addEventListener('input', function () { setRate(parseInt(input.value, 10)); });
  presets.forEach(function (b) { b.addEventListener('click', function () { const v = parseInt(b.dataset.bps, 10); input.value = v; setRate(v); }); });
  window.addEventListener('resize', resize);
  resize(); setRate(8); setToggle();
})();


// ---------- WOW: เครื่องนับหลายฐาน — จุดบิต + เปรียบเทียบ ฐาน 2/10/16 + การทดขึ้นหลัก ----------
(function multiBaseCounter() {
  const dotsEl = document.getElementById('mbaseDots');
  const countEl = document.getElementById('mbaseCount');
  const binEl = document.getElementById('mbaseBin');
  const decEl = document.getElementById('mbaseDec');
  const hexEl = document.getElementById('mbaseHex');
  const note = document.getElementById('mbaseNote');
  if (!dotsEl || !binEl) return;
  let count = 0;
  let prev = { 2: '', 10: '', 16: '' };
  const CAP = 64;

  function digitsHtml(str, prevStr) {
    let h = '';
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      const pj = prevStr.length - (str.length - i);
      const pch = (pj >= 0) ? prevStr[pj] : null;
      let cls = 'mbd';
      if (pch === null) cls += ' neww';                              // หลักใหม่ที่เพิ่งเกิด
      else if (pch !== ch) cls += (ch === '0' && pch !== '0') ? ' carried' : ' changed'; // พลิกเป็น 0 (ทดออก) vs เปลี่ยนค่า
      h += '<span class="' + cls + '">' + ch + '</span>';
    }
    return h;
  }
  // ---- จุดบิตแบบ incremental: จุดเดิมค้างนิ่ง เพิ่ม=เด้งเข้า ลด=หายออก ----
  function countDots() { return dotsEl.querySelectorAll('.mbase-dot:not(.leaving)').length; }
  function addDot() {
    const groups = dotsEl.querySelectorAll('.mbase-dot-group');
    let g = groups.length ? groups[groups.length - 1] : null;
    if (!g || g.querySelectorAll('.mbase-dot:not(.leaving)').length >= 5) {   // กลุ่มละ 5
      g = document.createElement('span'); g.className = 'mbase-dot-group'; dotsEl.appendChild(g);
    }
    const d = document.createElement('span'); d.className = 'mbase-dot'; g.appendChild(d);
  }
  function removeDot() {
    const dots = dotsEl.querySelectorAll('.mbase-dot:not(.leaving)');
    if (!dots.length) return;
    const d = dots[dots.length - 1], g = d.parentElement;
    d.classList.add('leaving');
    setTimeout(function () { d.remove(); if (g && !g.querySelector('.mbase-dot')) g.remove(); }, 200);
  }
  function updateDots() {
    let empty = dotsEl.querySelector('.mbase-empty');
    if (count === 0) {
      dotsEl.querySelectorAll('.mbase-dot-group, .mbase-more').forEach(function (e) { e.remove(); });
      if (!empty) { empty = document.createElement('span'); empty.className = 'mbase-empty'; empty.textContent = '0 จุด — กด + 1 เพื่อเริ่มนับ'; dotsEl.appendChild(empty); }
      return;
    }
    if (empty) empty.remove();
    const target = Math.min(count, CAP);
    let cur = countDots();
    while (cur < target) { addDot(); cur++; }
    while (cur > target) { removeDot(); cur--; }
    let more = dotsEl.querySelector('.mbase-more');
    if (count > CAP) {
      if (!more) { more = document.createElement('span'); more.className = 'mbase-more'; dotsEl.appendChild(more); }
      more.textContent = '+ อีก ' + (count - CAP) + ' จุด';
    } else if (more) more.remove();
  }
  const timers = { 2: null, 10: null, 16: null };
  function clearTimers() {
    [2, 10, 16].forEach(function (b) { if (timers[b]) { clearTimeout(timers[b]); timers[b] = null; } });
    [binEl, decEl, hexEl].forEach(function (el) { el.querySelectorAll('.mbase-carry').forEach(function (t) { t.remove(); }); });
  }
  function baseStr(b) { return b === 10 ? String(count) : count.toString(b).toUpperCase(); }

  function renderInstant() {
    binEl.innerHTML = digitsHtml(baseStr(2), prev[2]);
    decEl.innerHTML = digitsHtml(baseStr(10), prev[10]);
    hexEl.innerHTML = digitsHtml(baseStr(16), prev[16]);
    prev = { 2: baseStr(2), 10: baseStr(10), 16: baseStr(16) };
  }
  function draw() { clearTimers(); updateDots(); countEl.textContent = count; renderInstant(); }

  // ---- การทดวิ่งไปหลักหน้า: หลักเต็ม→0, "1" วิ่งไปซ้าย, แล้วหลักหน้าค่อยเพิ่ม ----
  function oldCharAt(oldStr, newLen, i) { const pj = oldStr.length - (newLen - i); return pj >= 0 ? oldStr[pj] : null; }
  function intermediateHtml(oldStr, newStr, landingIdx, hasNewLead) {
    let h = '';
    for (let i = 0; i < newStr.length; i++) {
      if (i > landingIdx) h += '<span class="mbd carried">0</span>';                         // หลักที่พลิกเป็น 0
      else if (i === landingIdx) h += '<span class="mbd hold">' + ((hasNewLead && i === 0) ? '' : (oldCharAt(oldStr, newStr.length, i) || '0')) + '</span>';  // ยังเป็นค่าเดิม/ยังไม่โผล่
      else h += '<span class="mbd">' + newStr[i] + '</span>';                                 // หลักที่ไม่เปลี่ยน
    }
    return h;
  }
  function spawnCarryToken(el, landingIdx) {
    const cells = el.querySelectorAll('.mbd');
    if (cells.length < 2) return;
    const last = cells[cells.length - 1], land = cells[landingIdx] || cells[0];
    el.style.position = 'relative';
    const token = document.createElement('span');
    token.className = 'mbase-carry'; token.textContent = '1';
    el.appendChild(token);
    token.style.left = (last.offsetLeft + last.offsetWidth / 2) + 'px';
    void token.offsetWidth;
    token.style.left = (land.offsetLeft + land.offsetWidth / 2) + 'px';
    setTimeout(function () { token.remove(); }, 480);
  }
  function animateCarryBase(el, b, oldStr, newStr) {
    let tz = 0; for (let i = newStr.length - 1; i >= 0 && newStr[i] === '0'; i--) tz++;
    const hasNewLead = newStr.length > oldStr.length;
    const landingIdx = newStr.length - 1 - tz;
    el.innerHTML = intermediateHtml(oldStr, newStr, landingIdx, hasNewLead);
    requestAnimationFrame(function () { spawnCarryToken(el, landingIdx); });
    timers[b] = setTimeout(function () { el.innerHTML = digitsHtml(newStr, oldStr); timers[b] = null; }, 430);
  }
  function carryNote(v) {
    const rolled = [];
    [[2, 'ฐาน 2', '1'], [10, 'ฐาน 10', '9'], [16, 'ฐาน 16', 'F']].forEach(function (t) {
      if (v % t[0] === t[0] - 1) rolled.push('<b>' + t[1] + '</b> เต็มหลัก (' + t[2] + ') &rarr; หลักนี้เป็น 0 แล้วทด 1 วิ่งไปหลักหน้า');
    });
    if (!rolled.length) note.innerHTML = 'เพิ่มอีก 1 จุด &rarr; ทุกฐานเพิ่มหลักขวาทีละ 1 (ยังไม่เต็ม เลยไม่ต้องทดหลัก)';
    else note.innerHTML = '<b style="color:var(--amber)">ทดขึ้นหลัก!</b> ' + rolled.join(' · ');
  }

  document.getElementById('mbasePlus1').addEventListener('click', function () {
    clearTimers();
    const v = count; count++;
    updateDots(); countEl.textContent = count;
    [[binEl, 2], [decEl, 10], [hexEl, 16]].forEach(function (t) {
      const el = t[0], b = t[1], oldStr = prev[b], newStr = baseStr(b);
      if (v % b === b - 1) animateCarryBase(el, b, oldStr, newStr);
      else el.innerHTML = digitsHtml(newStr, oldStr);
      prev[b] = newStr;
    });
    carryNote(v);
  });
  document.getElementById('mbaseMinus1').addEventListener('click', function () { if (count > 0) { count--; draw(); note.textContent = 'ลบ 1 จุด (ทำย้อนกลับการนับ)'; } });
  document.getElementById('mbasePlus8').addEventListener('click', function () { count += 8; draw(); note.innerHTML = 'เพิ่มทีเดียว 8 จุด — ในฐาน 2 คือทด 1 ขึ้นไปหลักที่ 4 (2×2×2 = 8 = <b class="mono">1000</b>)'; });
  document.getElementById('mbaseReset').addEventListener('click', function () { count = 0; prev = { 2: '', 10: '', 16: '' }; draw(); note.textContent = 'รีเซ็ตกลับเป็น 0'; });
  draw();
})();


// ---------- WOW: บวกเลขฐานสอง (วงจรบวกของ ALU) — ทดทีละหลัก ----------
(function binAdder() {
  const grid = document.getElementById('baddGrid');
  const note = document.getElementById('baddNote');
  const aEl = document.getElementById('baddAval'), bEl = document.getElementById('baddBval');
  const stepBtn = document.getElementById('baddStep'), resetBtn = document.getElementById('baddReset');
  if (!grid || !stepBtn) return;
  const N = 4, W = 5;                 // 4 บิตอินพุต, แสดง 5 หลัก (เผื่อทดขึ้น MSB)
  let A = 6, B = 5;
  let carry, sum, col, done;

  function bits(v) { return [0].concat(v.toString(2).padStart(N, '0').split('').map(Number)); }
  function cell(txt, cls) { return '<span class="badd-cell ' + cls + '">' + txt + '</span>'; }
  function reset() {
    carry = [0, 0, 0, 0, 0]; sum = [null, null, null, null, null]; col = -1; done = false;
    aEl.textContent = A; bEl.textContent = B;
    stepBtn.textContent = 'ทดทีละหลัก ›';
    note.innerHTML = 'A = ' + A + ' , B = ' + B + ' — กด “ทดทีละหลัก” เพื่อบวกจากหลักขวาสุด (LSB) ไปซ้าย เหมือนที่ ALU ทำ';
    render();
  }
  function render() {
    const a = bits(A), b = bits(B);
    let cr = '', ar = '', br = '', sr = '';
    for (let p = 0; p < W; p++) {
      const cur = (p === col) ? ' cur' : '';
      cr += cell(carry[p] ? '1' : '', 'carry' + (carry[p] ? ' has' : '') + cur);
      ar += cell(p === 0 ? '' : a[p], (p === 0 ? 'ghost' : '') + cur);
      br += cell(p === 0 ? '' : b[p], (p === 0 ? 'ghost' : '') + cur);
      sr += cell(sum[p] === null ? '' : sum[p], 'sum' + (sum[p] !== null ? ' filled' : '') + cur);
    }
    grid.innerHTML =
      '<div class="badd-row carryrow"><span class="badd-label">ตัวทด →</span>' + cr + '</div>' +
      '<div class="badd-row arow"><span class="badd-label">A = ' + A + '</span>' + ar + '</div>' +
      '<div class="badd-row brow"><span class="badd-label">+ B = ' + B + '</span>' + br + '</div>' +
      '<div class="badd-sep"></div>' +
      '<div class="badd-row sumrow"><span class="badd-label">ผลรวม</span>' + sr + '</div>';
  }
  function step() {
    if (done) return;
    if (col < 0) col = W - 1;
    const a = bits(A), b = bits(B);
    const cin = carry[col];
    const s = a[col] + b[col] + cin;
    sum[col] = s % 2;
    if (col > 0) carry[col - 1] = (s >= 2) ? 1 : 0;
    let msg = 'หลักนี้: ' + a[col] + ' + ' + b[col] + ' + ทด ' + cin + ' = ' + s + ' → ';
    if (s >= 2) msg += 'เขียน <b style="color:var(--green)">' + (s % 2) + '</b> แล้ว<b style="color:var(--amber)">ทด 1</b> ขึ้นหลักหน้า';
    else msg += 'เขียน <b style="color:var(--green)">' + s + '</b> (ไม่ต้องทด)';
    if (col === 0) { done = true; msg += ' · <b style="color:var(--green)">เสร็จ! ' + A + ' + ' + B + ' = ' + (A + B) + '</b>'; stepBtn.textContent = '✓ เสร็จ'; }
    render();
    if (col > 0) col--;
    note.innerHTML = msg;
  }
  document.querySelectorAll('.badd-sbtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const v = btn.dataset.v, d = +btn.dataset.d;
      if (v === 'A') A = Math.max(0, Math.min(15, A + d)); else B = Math.max(0, Math.min(15, B + d));
      reset();
    });
  });
  stepBtn.addEventListener('click', step);
  resetBtn.addEventListener('click', reset);
  reset();
})();


// ---------- WOW: ประกอบบิตเป็นไบต์ — 1 -> 2 -> 4 -> 8 บิต ----------
(function byteBuilder() {
  const tabs = document.getElementById('bybTabs');
  const bitsEl = document.getElementById('bybBits');
  const statEl = document.getElementById('bybStat');
  const note = document.getElementById('bybNote');
  if (!tabs || !bitsEl) return;
  let n = 1, val = [];

  function render(pop) {
    let h = '';
    for (let i = 0; i < n; i++) {
      const pv = Math.pow(2, n - 1 - i);
      if (n === 8 && i === 4) h += '<span class="byb-gap"></span>';
      h += '<div class="byb-cell' + (pop ? ' pop' : '') + '" data-i="' + i + '" style="animation-delay:' + (i * 0.04) + 's">' +
        '<div class="byb-pv">' + pv + '</div>' +
        '<div class="byb-box' + (val[i] ? ' on' : '') + '">' + val[i] + '</div></div>';
    }
    bitsEl.innerHTML = h;
    bitsEl.querySelectorAll('.byb-box').forEach(function (box) {
      box.addEventListener('click', function () {
        const i = +box.parentElement.dataset.i;
        val[i] = val[i] ? 0 : 1;
        box.classList.toggle('on', !!val[i]);
        box.textContent = val[i];
        updateStat();
      });
    });
    updateStat();
  }
  function updateStat() {
    const count = Math.pow(2, n);
    let dec = 0;
    for (let i = 0; i < n; i++) dec += val[i] * Math.pow(2, n - 1 - i);
    const signedVal = (n >= 2 && val[0] === 1) ? dec - count : dec;
    const signedTxt = (n >= 2) ? ' · <b style="color:var(--pink)">signed = ' + signedVal + '</b>' : '';
    statEl.innerHTML = n + ' บิต · <span class="big">2^' + n + ' = ' + count + '</span> ค่า · <b style="color:var(--cyan)">unsigned = ' + dec + '</b>' + signedTxt;
    let msg;
    if (n === 1) msg = '1 บิต = สวิตช์ไฟ 1 ดวง — เก็บได้แค่ <b>2 ค่า</b> (0 หรือ 1)';
    else if (n === 2) msg = '2 บิต → 2×2 = <b>4 ค่า</b> (00, 01, 10, 11) — <b style="color:var(--violet)">เพิ่มทุก 1 บิต ค่าที่เก็บได้ ×2</b>';
    else if (n === 4) msg = '4 บิต = 1 “นิบเบิล” → <b style="color:var(--cyan)">unsigned 0–15</b> · <b style="color:var(--pink)">signed −8 ถึง 7</b> (บิตซ้ายสุด = 1 → ค่าติดลบ แบบ two’s complement) · เท่ากับเลข<b>ฐานสิบหก 1 หลัก</b> (0–F)';
    else msg = '<b style="color:var(--violet)">8 บิต = 1 ไบต์</b> → <b style="color:var(--cyan)">unsigned 0–255</b> · <b style="color:var(--pink)">signed −128 ถึง 127</b> — เก็บ 1 ตัวอักษร ASCII (เช่น \'A\' = 65) หรือจำนวนเต็มเล็ก ๆ';
    note.innerHTML = msg;
  }
  function setN(nn) { n = nn; val = new Array(n).fill(0); render(true); }
  tabs.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active'); setN(+b.dataset.n);
    });
  });
  setN(1);
})();

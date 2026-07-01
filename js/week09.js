/* ============================================================
   week09.js — คาบที่ 3: อัลกอริทึมและผังงาน
   (ตัวจำลองเดินผังงานหาค่ามากที่สุด, คำถามแบบทดสอบ)
   ============================================================ */

// ---------- ตัวจำลองเดินผังงาน: หาค่ามากที่สุดของ 2 จำนวน ----------
(function flowSimulator() {
  const diagram = document.getElementById('flowDiagram');
  const inputA = document.getElementById('simA');
  const inputB = document.getElementById('simB');
  const btnStep = document.getElementById('simStep');
  const btnReset = document.getElementById('simReset');
  const traceBody = document.getElementById('traceBody');
  const desc = document.getElementById('simDesc');
  if (!diagram || !btnStep) return;

  const nodes = {};
  diagram.querySelectorAll('[data-step]').forEach((el) => {
    nodes[el.dataset.step] = el;
  });

  let path = [];   // ลำดับขั้นที่จะเดิน คำนวณใหม่ทุกครั้งที่เริ่ม
  let pos = -1;    // ตำแหน่งปัจจุบันใน path (-1 = ยังไม่เริ่ม)
  let a = 0, b = 0, max = null;

  function readInputs() {
    a = parseInt(inputA.value, 10);
    b = parseInt(inputB.value, 10);
    if (isNaN(a)) a = 0;
    if (isNaN(b)) b = 0;
  }

  function stepDesc(step) {
    switch (step) {
      case 0: return '🟢 START — เริ่มต้นผังงาน ยังไม่มีค่าตัวแปรใด ๆ';
      case 1: return '📥 รับค่า a = ' + a + ', b = ' + b + ' เข้าสู่หน่วยความจำ';
      case 2: return '🔶 ตรวจเงื่อนไข a > b → ' + a + ' > ' + b + ' เป็น' +
        (a > b ? 'จริง (True) เดินลงทาง "จริง"' : 'เท็จ (False) เดินไปทาง "เท็จ"');
      case 3: return '⬜ ประมวลผล max = a → max ได้ค่า ' + max;
      case 4: return '⬜ ประมวลผล max = b → max ได้ค่า ' + max;
      case 5: return '📤 แสดงผลลัพธ์: ค่ามากที่สุดคือ ' + max;
      case 6: return '🔴 END — จบผังงาน ลองเปลี่ยนค่า a, b แล้วกด "↺ เริ่มใหม่" ดูเส้นทางอื่น';
    }
    return '';
  }

  function addTraceRow(step) {
    if (pos === 0) traceBody.innerHTML = ''; // ล้างแถว "กดก้าวถัดไปเพื่อเริ่ม"
    traceBody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('current'));
    const tr = document.createElement('tr');
    tr.className = 'current';
    const aShow = step >= 1 ? a : '—';
    const bShow = step >= 1 ? b : '—';
    const maxShow = max !== null ? max : '—';
    tr.innerHTML = '<td>' + step + '</td><td>' + aShow + '</td><td>' + bShow + '</td><td>' + maxShow + '</td>';
    traceBody.appendChild(tr);
  }

  function highlight(step) {
    Object.keys(nodes).forEach((k) => nodes[k].classList.remove('active'));
    const node = nodes[step];
    node.classList.add('active');
    if (typeof gsap !== 'undefined') gsap.fromTo(node, { scale: 0.95 }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
  }

  btnStep.addEventListener('click', () => {
    if (pos === -1) {
      // เริ่มเดิน: อ่านค่าแล้ววางเส้นทางตามเงื่อนไข a > b
      readInputs();
      max = null;
      path = [0, 1, 2, a > b ? 3 : 4, 5, 6];
      pos = 0;
    } else if (pos >= path.length - 1) {
      return; // ถึง END แล้ว ต้องกดเริ่มใหม่
    } else {
      pos++;
    }
    const step = path[pos];
    if (step === 3) max = a;
    if (step === 4) max = b;
    highlight(step);
    addTraceRow(step);
    desc.textContent = stepDesc(step);
    if (pos >= path.length - 1) btnStep.disabled = true;
  });

  btnReset.addEventListener('click', () => {
    pos = -1;
    max = null;
    btnStep.disabled = false;
    Object.keys(nodes).forEach((k) => nodes[k].classList.remove('active'));
    traceBody.innerHTML = '<tr><td colspan="4">— กดก้าวถัดไปเพื่อเริ่ม —</td></tr>';
    desc.textContent = 'พร้อมเริ่มเดินผังงาน — ลองตั้งค่า a ให้มากกว่า b แล้วดูว่าเส้นทางเปลี่ยนไหม';
  });

  // เปลี่ยนค่า input ระหว่างเดิน = เริ่มรอบใหม่ เพื่อไม่ให้ trace สับสน
  [inputA, inputB].forEach((inp) => inp.addEventListener('input', () => {
    if (pos !== -1) btnReset.click();
  }));
})();

// ---------- คำถามแบบทดสอบท้ายคาบ (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'ข้อใดคือความหมายของ "อัลกอริทึม" ที่ถูกต้องที่สุด?',
    opts: [
      'โปรแกรมคอมพิวเตอร์ที่เขียนด้วยภาษาระดับสูง',
      'ลำดับขั้นตอนการแก้ปัญหาที่ชัดเจน มีจุดเริ่มต้นและจุดสิ้นสุด',
      'แผนภาพที่ใช้สัญลักษณ์รูปทรงต่าง ๆ',
      'ภาษาที่คอมพิวเตอร์เข้าใจได้โดยตรง'
    ],
    ans: 1,
    explain: 'อัลกอริทึมคือ "แนวคิด" ลำดับขั้นแก้ปัญหา — ยังไม่ใช่โค้ดหรือแผนภาพ ส่วนผังงานเป็นเพียงเครื่องมือหนึ่งที่ใช้ถ่ายทอดอัลกอริทึม'
  },
  {
    q: 'คุณสมบัติข้อใด "ไม่ใช่" คุณสมบัติที่ดีของอัลกอริทึม?',
    opts: [
      'ทุกขั้นตอนชัดเจนไม่กำกวม',
      'ต้องทำงานจบได้ในเวลาจำกัด',
      'ต้องเขียนด้วยภาษาซีเท่านั้น',
      'มีลำดับขั้นตอนที่แน่นอน'
    ],
    ans: 2,
    explain: 'อัลกอริทึมไม่ผูกกับภาษาใดภาษาหนึ่ง — เขียนเป็นภาษาไทย, Pseudocode หรือผังงานก็ได้ แล้วค่อยแปลงเป็นภาษาโปรแกรมใดก็ได้ทีหลัง'
  },
  {
    q: 'สัญลักษณ์ "สี่เหลี่ยมข้าวหลามตัด" ในผังงานใช้แทนอะไร?',
    opts: ['การเริ่มต้น/สิ้นสุด', 'การรับข้อมูล/แสดงผล', 'การประมวลผลหรือคำนวณ', 'การตัดสินใจหรือตรวจสอบเงื่อนไข'],
    ans: 3,
    explain: 'ข้าวหลามตัด (Decision) ใช้ตรวจเงื่อนไข มีทางออก 2 ทางคือ จริง/เท็จ — ส่วนวงรีคือเริ่ม/จบ, ด้านขนานคือรับ/แสดงผล, สี่เหลี่ยมผืนผ้าคือประมวลผล'
  },
  {
    q: 'ขั้นตอน "รับค่าน้ำหนักจากผู้ใช้" ควรใช้สัญลักษณ์รูปใด?',
    opts: ['สี่เหลี่ยมด้านขนาน', 'วงรี', 'สี่เหลี่ยมผืนผ้า', 'วงกลม'],
    ans: 0,
    explain: 'สี่เหลี่ยมด้านขนาน (Input/Output) ใช้ทั้งการรับข้อมูลเข้าและแสดงผลออก — จำง่าย ๆ ว่าข้อมูล "ไหลเข้า-ไหลออก" ใช้รูปเดียวกัน'
  },
  {
    q: 'โครงสร้างควบคุมพื้นฐานของอัลกอริทึมมี 3 แบบ ได้แก่ข้อใด?',
    opts: [
      'รับค่า, คำนวณ, แสดงผล',
      'ลำดับ (Sequence), เงื่อนไข (Selection), วนซ้ำ (Iteration)',
      'เริ่มต้น, ประมวลผล, สิ้นสุด',
      'Input, Process, Output'
    ],
    ans: 1,
    explain: 'ทุกโปรแกรมในโลกประกอบขึ้นจาก 3 โครงสร้างนี้: ทำตามลำดับ, เลือกทางตามเงื่อนไข และวนซ้ำจนกว่าเงื่อนไขจะเปลี่ยน'
  },
  {
    q: 'จากตัวจำลองในบทเรียน ถ้า a = 7, b = 12 ผังงานจะเดินผ่านกล่องใด?',
    opts: ['max = a เพราะ a มาก่อน b', 'max = b เพราะเงื่อนไข a > b เป็นเท็จ', 'ทั้ง max = a และ max = b', 'ไม่ผ่านกล่องใดเลยเพราะค่าเท่ากัน'],
    ans: 1,
    explain: 'ตรวจเงื่อนไข 7 > 12 ได้ "เท็จ" จึงเดินไปทางเท็จ → max = b = 12 — เงื่อนไขเดียวเลือกได้ทางเดียวเสมอ'
  },
  {
    q: 'Trace ตามลำดับนี้: x = 5 → x = x + 3 → x = x × 2 สุดท้าย x มีค่าเท่าใด?',
    opts: ['10', '13', '16', '11'],
    ans: 2,
    explain: 'ไล่ทีละขั้นเหมือนในตาราง Trace: เริ่ม x = 5 → บวก 3 ได้ 8 → คูณ 2 ได้ 16 — ค่าตัวแปร "ทับ" ค่าเดิมทุกครั้งที่กำหนดใหม่'
  },
  {
    q: 'Pseudocode ต่างจากภาษาโปรแกรมจริงอย่างไร?',
    opts: [
      'Pseudocode รันบนคอมพิวเตอร์ได้เร็วกว่า',
      'Pseudocode เขียนเป็นภาษากึ่งธรรมชาติ ไม่ต้องถูกไวยากรณ์ของภาษาใด',
      'Pseudocode ใช้ได้เฉพาะกับงานคำนวณตัวเลข',
      'ไม่ต่างกัน เพราะคอมไพเลอร์อ่าน Pseudocode ได้'
    ],
    ans: 1,
    explain: 'Pseudocode เป็น "รหัสเทียม" สำหรับคนอ่าน ไม่ใช่เครื่อง — เน้นสื่อสารลำดับความคิด จึงไม่ต้องกังวลเรื่องไวยากรณ์ของภาษาจริง'
  },
  {
    q: 'ผังงานคำนวณค่าไฟ "ถ้าหน่วย ≤ 150 คิดหน่วยละ 3.25 ไม่เช่นนั้นคิดหน่วยละ 4.22" ต้องมีสัญลักษณ์ข้าวหลามตัดอย่างน้อยกี่จุด?',
    opts: ['ไม่ต้องมีเลย', '1 จุด', '2 จุด', '3 จุด'],
    ans: 1,
    explain: 'มีการตัดสินใจเพียงครั้งเดียวคือ "หน่วย ≤ 150 ?" แตกเป็น 2 ทาง (คิดอัตราถูก/อัตราแพง) จึงใช้ข้าวหลามตัด 1 จุดพอ'
  },
  {
    q: 'ขั้นตอนแรกที่ควรทำก่อนเขียนอัลกอริทึมคือข้อใด?',
    opts: [
      'เปิดโปรแกรมเขียนโค้ดทันที',
      'วิเคราะห์ปัญหา: ระบุ Input, Process, Output ให้ชัด',
      'วาดผังงานให้สวยที่สุด',
      'เลือกภาษาโปรแกรมที่จะใช้'
    ],
    ans: 1,
    explain: 'ตามตัวอย่าง BMI ในบทเรียน — ต้องรู้ก่อนว่ารับอะไรเข้า (Input) ทำอะไร (Process) ได้อะไรออก (Output) แล้วจึงเขียน Pseudocode และวาดผังงาน'
  }
];

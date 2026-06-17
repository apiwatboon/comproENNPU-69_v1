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
  }

  render();
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
    q: 'อุปกรณ์ใดต่อไปนี้จัดเป็น "หน่วยเก็บข้อมูลสำรอง" (Secondary Storage)?',
    opts: ['Cache', 'SSD', 'Register', 'RAM'],
    ans: 1,
    explain: 'SSD (รวมถึง HDD, Flash Drive) เก็บข้อมูลถาวรแม้ปิดเครื่อง จึงเป็นหน่วยเก็บข้อมูลสำรอง ส่วน Register, Cache และ RAM เป็นหน่วยความจำชั่วคราวที่ทำงานร่วมกับ CPU โดยตรง',
  },
  {
    q: 'ข้อใดเป็น "ซอฟต์แวร์ระบบ" (System Software)?',
    opts: ['Microsoft Word', 'เกม ROV', 'Windows 11', 'Google Chrome'],
    ans: 2,
    explain: 'Windows 11 คือระบบปฏิบัติการ (OS) ซึ่งเป็นซอฟต์แวร์ระบบ — ทำหน้าที่จัดการฮาร์ดแวร์และเป็นตัวกลางให้โปรแกรมประยุกต์ (Word, เกม, เบราว์เซอร์) ทำงานได้',
  },
  {
    q: '1 ไบต์ (Byte) มีกี่บิต (bit)?',
    opts: ['4 บิต', '8 บิต', '16 บิต', '1,024 บิต'],
    ans: 1,
    explain: '1 Byte = 8 bit เก็บค่าได้ 2⁸ = 256 แบบ (0–255) เพียงพอสำหรับตัวอักษรภาษาอังกฤษ 1 ตัว — ลองนับช่องในเครื่องแปลงเลขฐานด้านบนดูสิ มี 8 ช่องพอดี!',
  },
  {
    q: 'เลขฐานสอง 1011₂ มีค่าเท่ากับเลขฐานสิบเท่าใด?',
    opts: ['9', '10', '11', '13'],
    ans: 2,
    explain: '1011₂ = (1×8) + (0×4) + (1×2) + (1×1) = 8 + 0 + 2 + 1 = 11 — ลองกดบิตในเครื่องแปลงด้านบนให้เป็น 00001011 เพื่อพิสูจน์ได้เลย',
  },
  {
    q: 'เลขฐานสิบ 200 เขียนเป็นเลขฐานสองได้อย่างไร?',
    opts: ['11001000', '10101010', '11110000', '10011001'],
    ans: 0,
    explain: '200 = 128 + 64 + 8 = 11001000₂ (บิต 128, 64 และ 8 เป็น 1) — พิมพ์ 200 ในเครื่องแปลงด้านบนเพื่อดูคำตอบ',
  },
  {
    q: 'ขั้นตอน "แรก" ของการพัฒนาโปรแกรมคอมพิวเตอร์คือข้อใด?',
    opts: ['เขียนโค้ดทันที', 'วิเคราะห์ปัญหาและความต้องการ', 'ทดสอบโปรแกรม', 'จัดทำเอกสารคู่มือ'],
    ans: 1,
    explain: 'ต้อง "เข้าใจปัญหา" ก่อนเสมอ: ต้องรู้ว่าข้อมูลเข้าคืออะไร ผลลัพธ์ที่ต้องการคืออะไร แล้วจึงออกแบบอัลกอริทึม เขียนโค้ด ทดสอบ และบำรุงรักษา — การรีบเขียนโค้ดโดยไม่วิเคราะห์คือสาเหตุอันดับหนึ่งของโปรแกรมที่ล้มเหลว',
  },
  {
    q: 'หน่วยความจำ Cache มีหน้าที่อะไร?',
    opts: [
      'เก็บไฟล์งานถาวรของผู้ใช้',
      'เป็นหน่วยความจำความเร็วสูง คั่นกลางระหว่าง CPU กับ RAM เพื่อลดเวลารอข้อมูล',
      'สำรองข้อมูลเมื่อไฟดับ',
      'แสดงผลภาพบนจอ',
    ],
    ans: 1,
    explain: 'CPU เร็วกว่า RAM มาก ถ้าต้องรอข้อมูลจาก RAM ทุกครั้งจะเสียเวลา Cache จึงเก็บข้อมูลที่ใช้บ่อยไว้ใกล้ CPU — หลักการเดียวกับการวางของที่หยิบบ่อยไว้บนโต๊ะแทนที่จะเก็บในตู้',
  },
];

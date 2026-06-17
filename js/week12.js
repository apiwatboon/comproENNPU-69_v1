/* ============================================================
   week12.js — บทที่ 12: ไฟล์และการจัดการข้อมูล
   (ปุ่มรันโค้ด, โรงงานรายงาน CSV, คำถามแบบทดสอบ)
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

// ---------- โรงงานรายงาน: อ่าน CSV → สรุปรายงาน (ข้ามบรรทัดเสียอย่างสุภาพ) ----------
(function csvReportFactory() {
  const textarea = document.getElementById('csvData');
  const btnRun = document.getElementById('csvRun');
  const btnReset = document.getElementById('csvReset');
  const report = document.getElementById('csvReport');
  const desc = document.getElementById('csvDesc');
  if (!textarea || !btnRun) return;

  const DEFAULT_DATA = 'machine,hours,temp\nPUMP-01,8,72.5\nPUMP-02,6,68.0\nMIXER-01,9,84.2\nCONV-01,7,61.8\nPRESS-01,5,79.4';

  function fmt(x, d) { return x.toLocaleString('th-TH', { minimumFractionDigits: d, maximumFractionDigits: d }); }

  btnRun.addEventListener('click', () => {
    const lines = textarea.value.split('\n');
    let count = 0, hoursSum = 0, tempSum = 0, skipped = 0;
    let maxTemp = -Infinity, maxName = '-';
    let minTemp = Infinity, minName = '-';

    // เริ่มที่ดัชนี 1 เพื่อข้ามหัวตาราง — แบบเดียวกับโค้ดภาษาซีในบทเรียน
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();           // ตัด \n ท้ายบรรทัดแบบที่ต้องทำหลัง fgets
      if (!line) continue;                    // ข้ามบรรทัดว่าง
      const parts = line.split(',');          // จำลอง sscanf("%[^,],%d,%f")
      if (parts.length !== 3) { skipped++; continue; }   // sscanf แกะได้ไม่ครบ 3 = บรรทัดเสีย
      const name = parts[0].trim();
      const hours = parseInt(parts[1], 10);
      const temp = parseFloat(parts[2]);
      if (!name || isNaN(hours) || isNaN(temp)) { skipped++; continue; }

      count++;
      hoursSum += hours;
      tempSum += temp;
      if (temp > maxTemp) { maxTemp = temp; maxName = name; }
      if (temp < minTemp) { minTemp = temp; minName = name; }
    }

    if (!count) {
      report.textContent = 'ไม่พบข้อมูลที่ใช้ได้เลย — ตรวจรูปแบบ: ชื่อ,ชั่วโมง,อุณหภูมิ';
      desc.textContent = skipped ? '⚠️ พบบรรทัดเสีย ' + skipped + ' บรรทัด และไม่มีบรรทัดดีเหลือเลย' : 'ใส่ข้อมูลอย่างน้อย 1 แถวใต้หัวตาราง';
      return;
    }

    report.innerHTML =
      '========================================<br>' +
      '  รายงานสรุปเครื่องจักรประจำวัน<br>' +
      '========================================<br>' +
      'จำนวนเครื่องจักร : <b style="color:#22d3ee">' + count + '</b> เครื่อง<br>' +
      'ชั่วโมงทำงานรวม  : <b style="color:#22d3ee">' + hoursSum + '</b> ชม.<br>' +
      'อุณหภูมิเฉลี่ย    : <b style="color:#a78bfa">' + fmt(tempSum / count, 2) + '</b> °C<br>' +
      'ร้อนสุด          : <b style="color:#fca5a5">' + fmt(maxTemp, 1) + '°C (' + maxName + ')</b>' + (maxTemp >= 80 ? ' ⚠️ เกิน 80 ควรตรวจสอบ!' : '') + '<br>' +
      'เย็นสุด          : <b style="color:#a7f3d0">' + fmt(minTemp, 1) + '°C (' + minName + ')</b><br>' +
      '========================================';
    desc.textContent = skipped
      ? '⚠️ ประมวลผล ' + count + ' บรรทัด และข้ามบรรทัดที่ข้อมูลเสีย ' + skipped + ' บรรทัด — โปรแกรมจริงต้องไม่ล้มเพราะข้อมูลสกปรกแค่บรรทัดเดียว'
      : '✅ ประมวลผลครบ ' + count + ' บรรทัด ไม่มีบรรทัดเสีย — ลองพิมพ์บรรทัดข้อมูลไม่ครบ 3 คอลัมน์ดูว่าโปรแกรมรับมืออย่างไร';
    if (typeof gsap !== 'undefined') gsap.from(report, { opacity: 0, y: 10, duration: 0.4 });
  });

  btnReset.addEventListener('click', () => {
    textarea.value = DEFAULT_DATA;
    report.textContent = '— กดประมวลผลเพื่อสร้างรายงาน —';
    desc.textContent = 'โปรแกรมจะข้ามบรรทัดหัวตาราง และข้ามบรรทัดที่ sscanf แกะได้ไม่ครบ 3 คอลัมน์ (พร้อมรายงานว่าข้ามไปกี่บรรทัด) — นี่คือนิสัยของโปรแกรมระดับใช้งานจริง';
  });
})();

// ---------- คำถามแบบทดสอบท้ายบท (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'ทำไมโปรแกรมจึงต้องบันทึกข้อมูลลง "ไฟล์" แทนที่จะเก็บในตัวแปรอย่างเดียว?',
    opts: [
      'ไฟล์คำนวณได้เร็วกว่าตัวแปร',
      'ตัวแปรอยู่ใน RAM ซึ่งหายหมดเมื่อโปรแกรมจบ ไฟล์อยู่ในดิสก์จึงคงอยู่ถาวร',
      'ตัวแปรเก็บข้อความไม่ได้',
      'ภาษาซีบังคับให้ใช้ไฟล์เสมอ'
    ],
    ans: 1,
    explain: 'ย้อนไปบทที่ 2: RAM เป็นหน่วยความจำชั่วคราว (volatile) — ตัวแปรทุกตัวตายตอนโปรแกรมจบ ไฟล์อยู่ในหน่วยเก็บข้อมูลถาวร (SSD/HDD) จึงอยู่รอดข้ามการรันได้'
  },
  {
    q: 'เปิดไฟล์รายงานเก่าด้วย fopen("report.txt", "w") จะเกิดอะไรขึ้นกับเนื้อหาเดิม?',
    opts: [
      'เนื้อหาเดิมอยู่ครบ เขียนต่อท้ายให้',
      'เนื้อหาเดิมถูกลบทิ้งทันทีที่เปิด',
      'ระบบถามยืนยันก่อนลบ',
      'fopen คืน NULL ห้ามเปิดไฟล์ที่มีอยู่แล้ว'
    ],
    ans: 1,
    explain: 'โหมด "w" ล้างไฟล์เกลี้ยงตั้งแต่วินาทีที่เปิด — ก่อนจะ fprintf อะไรเลยด้วยซ้ำ! ถ้าต้องการเก็บของเดิมแล้วเขียนต่อท้าย ต้องใช้โหมด "a" (append)'
  },
  {
    q: 'ทำไมต้องตรวจ if (fp == NULL) ทุกครั้งหลัง fopen?',
    opts: [
      'เพื่อให้โปรแกรมรันเร็วขึ้น',
      'เพราะถ้าเปิดไฟล์ไม่สำเร็จ fopen คืน NULL — ใช้ fp ต่อโดยไม่ตรวจ โปรแกรมพังทันที',
      'เพราะคอมไพเลอร์บังคับ ไม่ตรวจแล้วคอมไพล์ไม่ผ่าน',
      'ไม่จำเป็นต้องตรวจ fopen สำเร็จเสมอ'
    ],
    ans: 1,
    explain: 'ไฟล์ไม่มีอยู่ / ไม่มีสิทธิ์ / ดิสก์เต็ม — fopen คืน NULL ได้หลายสาเหตุ ใช้ตัวจับไฟล์ที่เป็น NULL ต่อคือ crash ทันที จึงต้องตรวจเสมอ เป็นมารยาทพื้นฐานของโปรแกรมไฟล์'
  },
  {
    q: 'โหมดใดเหมาะที่สุดสำหรับโปรแกรม "บันทึก log เหตุการณ์ประจำวัน" ที่รันซ้ำหลายครั้ง?',
    opts: ['"r"', '"w"', '"a"', 'โหมดไหนก็ได้เหมือนกัน'],
    ans: 2,
    explain: 'log ต้องสะสมต่อท้ายเรื่อย ๆ → โหมด "a" (append) — ถ้าใช้ "w" ทุกครั้งที่รัน log เก่าทั้งหมดจะหายเหลือแค่รอบล่าสุด'
  },
  {
    q: 'อ่านไฟล์ด้วย fgets แล้วบรรทัดในไฟล์คือ "END" — ทำไม strcmp(line, "END") จึงไม่เท่ากับ 0?',
    opts: [
      'เพราะไฟล์เก็บเป็นตัวพิมพ์เล็กเสมอ',
      'เพราะ fgets เก็บ \\n ท้ายบรรทัดมาด้วย เป็น "END\\n" ต้องตัดทิ้งก่อน',
      'เพราะ strcmp ใช้กับค่าคงที่ไม่ได้',
      'เพราะ fgets อ่านทีละตัวอักษร ไม่ใช่ทีละบรรทัด'
    ],
    ans: 1,
    explain: 'fgets เก็บอักขระขึ้นบรรทัดใหม่มาด้วย — "END\\n" ไม่เท่ากับ "END" จึงต้องตัด \\n ทิ้งก่อนเปรียบเทียบ บั๊กล่องหนตัวจริงของบทนี้'
  },
  {
    q: 'CSV ย่อมาจากอะไร และใช้อักขระใดคั่นคอลัมน์?',
    opts: [
      'Computer System Values — คั่นด้วยช่องว่าง',
      'Comma-Separated Values — คั่นด้วยจุลภาค (,)',
      'Central Storage Vault — คั่นด้วย ;',
      'Code Source Version — คั่นด้วย :'
    ],
    ans: 1,
    explain: 'Comma-Separated Values: ข้อความธรรมดาที่คั่นคอลัมน์ด้วยจุลภาค — เรียบง่ายจนทุกโปรแกรมในโลกอ่านได้ จึงเป็นภาษากลางของการแลกเปลี่ยนข้อมูล'
  },
  {
    q: 'sscanf ต่างจาก scanf อย่างไร?',
    opts: [
      'sscanf เร็วกว่าเท่านั้น',
      'sscanf อ่านข้อมูลจาก "สตริง" แทนที่จะอ่านจากคีย์บอร์ด',
      'sscanf ใช้ตัวกำหนดรูปแบบคนละชุดกับ scanf',
      'ไม่ต่างกันเลย'
    ],
    ans: 1,
    explain: 'สามพี่น้อง: scanf อ่านจากคีย์บอร์ด / fscanf อ่านจากไฟล์ / sscanf อ่านจากสตริง — ตัวกำหนดรูปแบบชุดเดียวกันหมด ท่าอ่าน CSV มาตรฐานคือ fgets ทั้งบรรทัด แล้ว sscanf แกะคอลัมน์'
  },
  {
    q: 'ในรูปแบบ sscanf(line, "%29[^,],%d,%f", ...) — ส่วน %[^,] หมายความว่าอะไร?',
    opts: [
      'อ่านเฉพาะจุลภาค',
      'อ่านตัวอักษรไปเรื่อย ๆ จนกว่าจะเจอจุลภาค',
      'ข้ามจุลภาคทุกตัว',
      'อ่านตัวเลขฐานสอง'
    ],
    ans: 1,
    explain: '%[^,] = "กินทุกอักขระจนกว่าจะเจอจุลภาค" จึงใช้แกะคอลัมน์ข้อความของ CSV ได้พอดี (เลข 29 คือกันเกินขนาดอาร์เรย์ 30 ช่อง — เผื่อ \\0 หนึ่งช่องเสมอ!)'
  },
  {
    q: 'ไฟล์ CSV มี 6 บรรทัด (บรรทัดแรกเป็นหัวตาราง) — โปรแกรมนับข้อมูลที่ถูกต้องควรได้กี่แถว?',
    opts: ['6', '5', '7', 'ขึ้นกับจำนวนคอลัมน์'],
    ans: 1,
    explain: 'หัวตาราง "machine,hours,temp" ไม่ใช่ข้อมูล! ต้องข้ามบรรทัดแรกเสมอ เหลือข้อมูลจริง 5 แถว — ลืมข้าม header แล้วเอาคำว่า hours ไปแกะเป็นตัวเลข คือบั๊กคลาสสิกของมือใหม่'
  },
  {
    q: 'โปรแกรมอ่าน CSV ระดับใช้งานจริง ควรทำอย่างไรเมื่อ sscanf แกะบรรทัดได้ไม่ครบ 3 คอลัมน์?',
    opts: [
      'หยุดโปรแกรมทันที',
      'ใส่ค่า 0 แทนทุกช่องที่หาย',
      'ข้ามบรรทัดนั้น นับจำนวนที่ข้าม แล้วรายงานให้ผู้ใช้ทราบ',
      'ลบบรรทัดนั้นออกจากไฟล์ต้นฉบับเลย'
    ],
    ans: 2,
    explain: 'ข้อมูลจริงสกปรกเสมอ — โปรแกรมที่ดีต้องไม่ล้มเพราะบรรทัดเดียว แต่ก็ต้องไม่เงียบ: ข้าม + นับ + รายงาน ให้มนุษย์ตัดสินใจต่อ (sscanf คืนจำนวนช่องที่แกะสำเร็จ ใช้ตรวจได้พอดี)'
  }
];


/* ============================================================
   week01.js — คาบที่ 1: ประวัติความเป็นมาของคอมพิวเตอร์
   (แท็บยุคคอมพิวเตอร์, กราฟกฎของมัวร์, คำถามแบบทดสอบ)
   ============================================================ */

// ---------- แท็บ "คอมพิวเตอร์ 5 ยุค" ----------
(function genTabs() {
  const tabs = document.querySelectorAll('.gen-tab');
  const panels = document.querySelectorAll('.gen-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
})();

// ---------- กราฟกฎของมัวร์ (Chart.js, แกน log) ----------
(function mooreChart() {
  const el = document.getElementById('mooreChart');
  if (!el || typeof Chart === 'undefined') return;

  const data = [
    { year: 1971, chip: 'Intel 4004', count: 2300 },
    { year: 1974, chip: 'Intel 8080', count: 6000 },
    { year: 1978, chip: 'Intel 8086', count: 29000 },
    { year: 1985, chip: 'Intel 386', count: 275000 },
    { year: 1993, chip: 'Pentium', count: 3100000 },
    { year: 2000, chip: 'Pentium 4', count: 42000000 },
    { year: 2006, chip: 'Core 2 Duo', count: 291000000 },
    { year: 2012, chip: 'Core i7 (Ivy Bridge)', count: 1400000000 },
    { year: 2020, chip: 'Apple M1', count: 16000000000 },
    { year: 2023, chip: 'Apple M2 Ultra', count: 134000000000 },
  ];

  const chart = new Chart(el, {
    type: 'line',
    data: {
      labels: data.map((d) => d.year),
      datasets: [{
        label: 'จำนวนทรานซิสเตอร์ต่อชิป',
        data: data.map((d) => d.count),
        borderColor: '#22d3ee',
        borderWidth: 3,
        pointBackgroundColor: '#a78bfa',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 9,
        tension: 0.35,
        fill: true,
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          g.addColorStop(0, 'rgba(34, 211, 238, 0.28)');
          g.addColorStop(1, 'rgba(167, 139, 250, 0.02)');
          return g;
        },
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 2000, easing: 'easeOutQuart' },
      plugins: {
        legend: { labels: { color: '#9aa7bd', font: { family: 'Kanit', size: 13 } } },
        tooltip: {
          backgroundColor: '#0d1322',
          borderColor: 'rgba(34,211,238,0.4)',
          borderWidth: 1,
          padding: 14,
          titleFont: { family: 'Kanit', size: 14 },
          bodyFont: { family: 'Sarabun', size: 13 },
          callbacks: {
            title: (items) => {
              const d = data[items[0].dataIndex];
              return d.chip + ' (' + d.year + ')';
            },
            label: (item) => ' ' + Number(item.raw).toLocaleString('th-TH') + ' ทรานซิสเตอร์',
          },
        },
      },
      scales: {
        y: {
          type: 'logarithmic',
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: {
            color: '#9aa7bd',
            font: { family: 'Sarabun' },
            callback: (v) => {
              const log = Math.log10(v);
              if (!Number.isInteger(log)) return null;
              if (v >= 1e9) return (v / 1e9) + ' พันล้าน';
              if (v >= 1e6) return (v / 1e6) + ' ล้าน';
              if (v >= 1e3) return (v / 1e3) + ' พัน';
              return v;
            },
          },
        },
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#9aa7bd', font: { family: 'Kanit' } },
        },
      },
    },
  });

  // เริ่มวาดกราฟเมื่อเลื่อนมาถึง
  if (typeof gsap !== 'undefined') {
    chart.options.animation = false;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        chart.options.animation = { duration: 2000, easing: 'easeOutQuart' };
        chart.reset();
        chart.update();
      },
    });
  }
})();

// ---------- คำถามแบบทดสอบท้ายคาบ (เรนเดอร์โดย quiz.js) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'อุปกรณ์ช่วยคำนวณที่เก่าแก่ที่สุดของมนุษย์ ซึ่งถือเป็นจุดเริ่มต้นของประวัติศาสตร์คอมพิวเตอร์ คืออะไร?',
    opts: ['เครื่อง Pascaline', 'ลูกคิด (Abacus)', 'แท่งเนเปียร์ (Napier\'s Bones)', 'นาฬิกาแดด'],
    ans: 1,
    explain: 'ลูกคิด (Abacus) ถูกใช้มานานกว่า 4,000–5,000 ปี ในอารยธรรมเมโสโปเตเมียและจีน ถือเป็นเครื่องมือช่วยคำนวณชิ้นแรกของมนุษยชาติ',
  },
  {
    q: 'ใครได้รับการยกย่องว่าเป็น "บิดาแห่งคอมพิวเตอร์" จากการออกแบบ Analytical Engine?',
    opts: ['Alan Turing', 'John von Neumann', 'Charles Babbage', 'Blaise Pascal'],
    ans: 2,
    explain: 'Charles Babbage ออกแบบ Analytical Engine (ค.ศ. 1837) ซึ่งมีองค์ประกอบครบเหมือนคอมพิวเตอร์ยุคใหม่ ทั้งหน่วยคำนวณ (Mill) หน่วยความจำ (Store) และรับโปรแกรมผ่านบัตรเจาะรู',
  },
  {
    q: 'บุคคลใดได้รับการยกย่องว่าเป็น "โปรแกรมเมอร์คนแรกของโลก"?',
    opts: ['Ada Lovelace', 'Grace Hopper', 'Bill Gates', 'Dennis Ritchie'],
    ans: 0,
    explain: 'Ada Lovelace เขียนอัลกอริทึมสำหรับคำนวณจำนวนแบร์นูลลีบน Analytical Engine ของ Babbage ในปี ค.ศ. 1843 — ก่อนจะมีคอมพิวเตอร์จริงเกือบ 100 ปี! ภาษา Ada ถูกตั้งชื่อเพื่อเป็นเกียรติแก่เธอ',
  },
  {
    q: 'คอมพิวเตอร์อิเล็กทรอนิกส์อเนกประสงค์ (general-purpose) เครื่องแรกของโลกคือเครื่องใด?',
    opts: ['UNIVAC I', 'Z3', 'Harvard Mark I', 'ENIAC'],
    ans: 3,
    explain: 'ENIAC (ค.ศ. 1945–1946) สร้างที่มหาวิทยาลัยเพนซิลเวเนีย ใช้หลอดสุญญากาศ ~18,000 หลอด หนัก 27 ตัน เป็นคอมพิวเตอร์อิเล็กทรอนิกส์แบบโปรแกรมได้อเนกประสงค์เครื่องแรก',
  },
  {
    q: 'คอมพิวเตอร์ "ยุคที่ 1" ใช้อุปกรณ์ใดเป็นส่วนประกอบหลักในการประมวลผล?',
    opts: ['ทรานซิสเตอร์', 'หลอดสุญญากาศ (Vacuum Tube)', 'วงจรรวม (IC)', 'ไมโครโพรเซสเซอร์'],
    ans: 1,
    explain: 'ยุคที่ 1 (ค.ศ. 1946–1957) ใช้หลอดสุญญากาศ ทำให้เครื่องมีขนาดใหญ่มาก ร้อนจัด กินไฟสูง และเสียบ่อย ต้องเขียนโปรแกรมด้วยภาษาเครื่อง (Machine Language)',
  },
  {
    q: 'สถาปัตยกรรม "Stored-Program Concept" ที่คอมพิวเตอร์ทุกเครื่องในปัจจุบันใช้ เป็นแนวคิดของใคร?',
    opts: ['John von Neumann', 'Konrad Zuse', 'Steve Wozniak', 'Herman Hollerith'],
    ans: 0,
    explain: 'John von Neumann เสนอแนวคิดเก็บทั้ง "โปรแกรม" และ "ข้อมูล" ไว้ในหน่วยความจำเดียวกัน (ค.ศ. 1945) ซึ่งเป็นรากฐานของสถาปัตยกรรมคอมพิวเตอร์จนถึงทุกวันนี้',
  },
  {
    q: 'การเปลี่ยนจากหลอดสุญญากาศมาใช้ "ทรานซิสเตอร์" เกิดขึ้นในคอมพิวเตอร์ยุคที่เท่าใด?',
    opts: ['ยุคที่ 1', 'ยุคที่ 2', 'ยุคที่ 3', 'ยุคที่ 4'],
    ans: 1,
    explain: 'ยุคที่ 2 (ค.ศ. 1958–1963) ใช้ทรานซิสเตอร์ ซึ่งเล็กกว่า เร็วกว่า ทนทานกว่า และประหยัดไฟกว่าหลอดสุญญากาศมาก ยุคนี้เริ่มมีภาษาระดับสูงอย่าง FORTRAN และ COBOL',
  },
  {
    q: 'ไมโครโพรเซสเซอร์ตัวแรกของโลก ซึ่งเปิดศักราชคอมพิวเตอร์ยุคที่ 4 คือชิปรุ่นใด?',
    opts: ['Intel 8086', 'Motorola 68000', 'Intel 4004', 'Zilog Z80'],
    ans: 2,
    explain: 'Intel 4004 (ค.ศ. 1971) รวมหน่วยประมวลผลทั้งหมดไว้บนชิปเดียว มีทรานซิสเตอร์เพียง 2,300 ตัว — จุดเริ่มต้นของยุคไมโครคอมพิวเตอร์และ PC',
  },
  {
    q: '"กฎของมัวร์" (Moore\'s Law) กล่าวไว้ว่าอย่างไร?',
    opts: [
      'ความเร็ว CPU เพิ่มขึ้น 10 เท่าทุกปี',
      'จำนวนทรานซิสเตอร์บนชิปเพิ่มขึ้นประมาณ 2 เท่าทุก ๆ 2 ปี',
      'ราคาคอมพิวเตอร์ลดลงครึ่งหนึ่งทุก 5 ปี',
      'หน่วยความจำเพิ่มขึ้น 4 เท่าทุก 3 ปี',
    ],
    ans: 1,
    explain: 'Gordon Moore (ผู้ร่วมก่อตั้ง Intel) สังเกตในปี ค.ศ. 1965 ว่าจำนวนทรานซิสเตอร์บนชิปเพิ่มขึ้น ~2 เท่าทุก 2 ปี ซึ่งเป็นจริงมาหลายทศวรรษ และอธิบายว่าทำไมคอมพิวเตอร์จึงเร็วขึ้นและถูกลงอย่างต่อเนื่อง',
  },
  {
    q: 'ภาษาโปรแกรมระดับสูง (High-level Language) ภาษาแรกที่ถูกใช้งานอย่างแพร่หลาย คือภาษาใด?',
    opts: ['C', 'Python', 'FORTRAN', 'Java'],
    ans: 2,
    explain: 'FORTRAN (FORmula TRANslation) พัฒนาโดยทีมของ John Backus ที่ IBM ในปี ค.ศ. 1957 สำหรับงานคำนวณทางวิทยาศาสตร์และวิศวกรรม — และยังถูกใช้ในงานคำนวณสมรรถนะสูงจนถึงปัจจุบัน',
  },
];

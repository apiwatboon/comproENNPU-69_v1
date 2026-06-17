/* ============================================================
   main.js — สคริปต์ส่วนกลาง: binary rain, navbar, reveal, fallback รูป
   ============================================================ */

// ---------- Binary rain บนพื้นหลัง hero ----------
(function binaryRain() {
  const canvas = document.getElementById('binary-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let cols, drops;
  const fontSize = 16;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(7, 11, 20, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px Consolas, monospace';
    for (let i = 0; i < cols; i++) {
      const char = Math.random() > 0.5 ? '1' : '0';
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      // ไล่สีระหว่าง cyan กับ violet ตามตำแหน่งคอลัมน์
      ctx.fillStyle = i % 7 === 0 ? 'rgba(167, 139, 250, 0.8)' : 'rgba(34, 211, 238, 0.55)';
      ctx.fillText(char, x, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 55);
})();

// ---------- แถบกระโดดข้ามบท: เลข 1–14 ใต้ navbar ทุกหน้า (ยกเว้นหน้าแรก) ----------
(function chapterStrip() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html') return; // หน้าแรกมีการ์ด 14 บทครบอยู่แล้ว

  const TITLES = [
    'ประวัติความเป็นมาของคอมพิวเตอร์',
    'องค์ประกอบของระบบคอมพิวเตอร์',
    'อัลกอริทึมและผังงาน',
    'เริ่มต้นเขียนโปรแกรมแรก',
    'ตัวดำเนินการและนิพจน์',
    'โครงสร้างควบคุมแบบเลือกทำ',
    'โครงสร้างควบคุมแบบวนซ้ำ',
    'สอบกลางภาค',
    'ฟังก์ชัน',
    'อาร์เรย์และลิสต์',
    'สตริงและการประมวลผลข้อความ',
    'ไฟล์และการจัดการข้อมูล',
    'โปรเจกต์ประยุกต์ทางวิศวกรรม',
    'นำเสนอโปรเจกต์ + ทบทวนปลายภาค',
  ];

  // บท 1–3 รวมสอนในสัปดาห์ที่ 1 (คาบ 1-1/1-2/1-3) จากนั้นเลื่อนนับ: บท 4 = สัปดาห์ที่ 2 ...
  const WEEK_LABEL = ['1-1', '1-2', '1-3'];          // ป้ายบนปุ่ม (index 0–2 = บท 1–3)
  const WEEK_TITLE = ['สัปดาห์ที่ 1 · คาบที่ 1', 'สัปดาห์ที่ 1 · คาบที่ 2', 'สัปดาห์ที่ 1 · คาบที่ 3'];
  const label = (i) => i <= 3 ? WEEK_LABEL[i - 1] : String(i - 2);
  const weekText = (i) => i <= 3 ? WEEK_TITLE[i - 1] : 'สัปดาห์ที่ ' + (i - 2);

  const row = document.createElement('div');
  row.className = 'container chapter-strip';
  let html = '<span class="cs-label">ไปบทที่:</span>';
  for (let i = 1; i <= 14; i++) {
    const file = 'week' + String(i).padStart(2, '0') + '.html';
    const wide = i <= 3 ? ' wide' : '';
    html += '<a class="cs-link' + wide + (file === page ? ' active' : '') + '" href="' + file + '" title="' + weekText(i) + ': ' + TITLES[i - 1] + '">' + label(i) + '</a>';
  }
  html += '<a class="cs-link wide' + (page === 'exercises.html' ? ' active' : '') + '" href="exercises.html" title="คลังแบบฝึกหัด 110 ข้อ">📚 แบบฝึกหัด</a>';
  row.innerHTML = html;
  nav.appendChild(row);
})();

// ---------- Navbar เปลี่ยนพื้นหลังเมื่อ scroll + ปุ่มกลับขึ้นบน ----------
(function navScroll() {
  const nav = document.querySelector('.navbar');
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 700);
  }, { passive: true });
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ---------- Reveal ทุก element ที่มี class .reveal ด้วย GSAP ScrollTrigger ----------
(function revealAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });

  // timeline dots: เด้งเข้าเมื่อเลื่อนถึง
  document.querySelectorAll('.tl-dot').forEach((dot) => {
    gsap.from(dot, {
      scale: 0,
      duration: 0.6,
      ease: 'back.out(2.5)',
      scrollTrigger: { trigger: dot, start: 'top 88%' },
    });
  });
})();

// ---------- ตัวเลขนับ (counter) สำหรับ element ที่มี data-count ----------
(function counters() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate() {
        el.textContent = obj.val.toLocaleString('th-TH', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) + suffix;
      },
    });
  });
})();

// ---------- Fallback เมื่อรูปจากอินเทอร์เน็ตโหลดไม่สำเร็จ ----------
(function imageFallback() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const div = document.createElement('div');
      div.className = 'img-fallback';
      div.style.height = (img.getAttribute('height') || 230) + 'px';
      div.textContent = '🖼️ ' + (img.alt || 'รูปภาพ') + ' (ต้องเชื่อมต่ออินเทอร์เน็ต)';
      img.replaceWith(div);
    });
  });
})();

// ---------- Active nav link ตาม section ที่กำลังดู ----------
(function spyNav() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;
  const sections = [...links].map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 140;
    let current = null;
    sections.forEach((sec) => { if (sec.offsetTop <= y) current = sec.id; });
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }, { passive: true });
})();

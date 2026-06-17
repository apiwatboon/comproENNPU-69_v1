/* ============================================================
   week13.js — สัปดาห์ที่ 13: โปรเจกต์ประยุกต์ทางวิศวกรรม
   (เช็คลิสต์แผนงานกลุ่ม จำค่าใน localStorage)
   ============================================================ */

// ---------- เช็คลิสต์แผนงาน 2 สัปดาห์ของกลุ่ม ----------
(function projectMilestones() {
  const list = document.getElementById('projChecklist');
  const fill = document.getElementById('pjFill');
  const text = document.getElementById('pjText');
  if (!list) return;

  const KEY = 'cp-week13-milestones';
  const boxes = list.querySelectorAll('input[type="checkbox"]');

  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { saved = []; }

  function render() {
    let done = 0;
    boxes.forEach((box) => {
      box.closest('.check-item').classList.toggle('done', box.checked);
      if (box.checked) done++;
    });
    const pct = Math.round((done / boxes.length) * 100);
    fill.style.width = pct + '%';
    if (done === boxes.length) {
      text.textContent = '🚀 ครบ ' + boxes.length + ' ขั้น — พร้อมขึ้นเวทีนำเสนอสัปดาห์ที่ 14!';
    } else if (done >= 4) {
      text.textContent = 'คืบหน้า ' + done + ' จาก ' + boxes.length + ' ขั้น — ผ่านเป้าของคาบนี้แล้ว เดินหน้าต่อตามแผน';
    } else {
      text.textContent = 'คืบหน้า ' + done + ' จาก ' + boxes.length + ' ขั้น (เป้าของคาบนี้คือ 4 ขั้นแรก)';
    }
  }

  boxes.forEach((box) => {
    const id = parseInt(box.dataset.ck, 10);
    box.checked = saved.indexOf(id) !== -1;
    box.addEventListener('change', () => {
      const checked = [];
      boxes.forEach((b) => { if (b.checked) checked.push(parseInt(b.dataset.ck, 10)); });
      try { localStorage.setItem(KEY, JSON.stringify(checked)); } catch (e) { /* โหมดไม่เก็บข้อมูลก็ใช้ต่อได้ */ }
      render();
      if (box.checked && typeof gsap !== 'undefined') {
        gsap.fromTo(box.closest('.check-item'), { scale: 0.98 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      }
    });
  });

  render();
})();

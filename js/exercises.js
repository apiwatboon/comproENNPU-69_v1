/* ============================================================
   exercises.js — คลังแบบฝึกหัด 110 ข้อ
   (ติ๊ก "ทำแล้ว" จำค่าใน localStorage, ตัวกรองระดับความยาก,
    ตัวนับความคืบหน้ารวมและรายบท)
   ============================================================ */

(function exerciseBank() {
  const items = document.querySelectorAll('.check-item[data-d]');
  if (!items.length) return;

  const fill = document.getElementById('exFill');
  const text = document.getElementById('exText');
  const KEY = 'cp-exercise-done';

  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { saved = []; }

  // ---------- ติ๊กแล้วจำ + อัปเดตตัวนับ ----------
  function render() {
    let done = 0;
    const perSection = {}; // เช่น { w01: 3 }

    items.forEach((item) => {
      const box = item.querySelector('input');
      item.classList.toggle('done', box.checked);
      const section = box.dataset.ex.split('-')[0];
      if (!(section in perSection)) perSection[section] = 0;
      if (box.checked) {
        done++;
        perSection[section]++;
      }
    });

    const total = items.length;
    fill.style.width = Math.round((done / total) * 100) + '%';
    text.textContent = done === total
      ? '🏆 ครบทั้ง ' + total + ' ข้อ — สุดยอดมาก!'
      : 'ทำแล้ว ' + done + ' จาก ' + total + ' ข้อ';

    Object.keys(perSection).forEach((sec) => {
      const badge = document.getElementById('cnt-' + sec);
      if (badge) badge.textContent = perSection[sec] + '/10';
    });
  }

  items.forEach((item) => {
    const box = item.querySelector('input');
    box.checked = saved.indexOf(box.dataset.ex) !== -1;
    box.addEventListener('change', () => {
      const checked = [];
      items.forEach((it) => {
        const b = it.querySelector('input');
        if (b.checked) checked.push(b.dataset.ex);
      });
      try { localStorage.setItem(KEY, JSON.stringify(checked)); } catch (e) { /* โหมดไม่เก็บข้อมูลก็ใช้ต่อได้ */ }
      render();
      if (box.checked && typeof gsap !== 'undefined') {
        gsap.fromTo(item, { scale: 0.99 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
      }
    });
  });

  // ---------- ตัวกรองระดับความยาก ----------
  const filterBtns = document.querySelectorAll('#exFilter button');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => { b.classList.remove('btn-primary'); b.classList.add('btn-ghost'); });
      btn.classList.remove('btn-ghost');
      btn.classList.add('btn-primary');
      const f = btn.dataset.f;
      items.forEach((item) => {
        item.style.display = (f === 'all' || item.dataset.d === f) ? '' : 'none';
      });
    });
  });

  render();
})();

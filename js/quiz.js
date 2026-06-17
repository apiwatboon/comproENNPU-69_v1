/* ============================================================
   quiz.js — ตัวสร้างแบบทดสอบท้ายบท (ใช้ร่วมกันทุกสัปดาห์)
   หน้าที่ใช้ต้องกำหนด window.QUIZ_QUESTIONS = [{q, opts, ans, explain}, ...]
   และมี <div id="quizWrap"></div> กับ <div id="quizScore"></div>
   ============================================================ */

(function quiz() {
  const questions = window.QUIZ_QUESTIONS;
  const wrap = document.getElementById('quizWrap');
  if (!wrap || !questions || !questions.length) return;

  let answered = 0;
  let correct = 0;
  const thaiLabels = ['ก', 'ข', 'ค', 'ง'];

  questions.forEach((item, qi) => {
    const card = document.createElement('div');
    card.className = 'quiz-card';

    card.innerHTML =
      '<div class="quiz-q"><span class="qnum">ข้อ ' + (qi + 1) + '.</span>' + item.q + '</div>' +
      '<div class="quiz-opts">' +
      item.opts.map((opt, oi) =>
        '<button class="quiz-opt" data-oi="' + oi + '">' + thaiLabels[oi] + '. ' + opt + '</button>'
      ).join('') +
      '</div>' +
      '<div class="quiz-explain">💡 ' + item.explain + '</div>';

    const opts = card.querySelectorAll('.quiz-opt');
    opts.forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.dataset.oi, 10);
        opts.forEach((b) => (b.disabled = true));
        opts[item.ans].classList.add('correct');
        if (chosen === item.ans) {
          correct++;
          if (typeof gsap !== 'undefined') gsap.fromTo(btn, { scale: 1 }, { scale: 1.03, yoyo: true, repeat: 1, duration: 0.15 });
        } else {
          btn.classList.add('wrong');
          if (typeof gsap !== 'undefined') gsap.fromTo(card, { x: 0 }, { x: 8, yoyo: true, repeat: 3, duration: 0.07 });
        }
        card.querySelector('.quiz-explain').classList.add('show');
        answered++;
        if (answered === questions.length) showScore();
      });
    });

    wrap.appendChild(card);
  });

  function showScore() {
    const box = document.getElementById('quizScore');
    const pct = Math.round((correct / questions.length) * 100);
    let msg, emoji;
    if (pct >= 80) { msg = 'ยอดเยี่ยม! คุณเข้าใจเนื้อหาบทนี้เป็นอย่างดี'; emoji = '🏆'; }
    else if (pct >= 60) { msg = 'ดีมาก! ทบทวนอีกนิดจะสมบูรณ์แบบ'; emoji = '👍'; }
    else if (pct >= 40) { msg = 'พอใช้ ลองกลับไปทบทวนเนื้อหาอีกครั้งนะ'; emoji = '📖'; }
    else { msg = 'อย่าเพิ่งท้อ! เลื่อนกลับขึ้นไปทบทวนเนื้อหาแล้วลองใหม่'; emoji = '💪'; }
    box.innerHTML =
      '<div style="font-size:3rem">' + emoji + '</div>' +
      '<div class="score-big grad-text">' + correct + ' / ' + questions.length + '</div>' +
      '<p style="color:var(--text-dim);margin-top:8px">' + msg + '</p>' +
      '<button class="btn btn-ghost" style="margin-top:22px" onclick="location.reload()">🔄 ทำแบบทดสอบอีกครั้ง</button>';
    box.classList.add('show');
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();

/* ============================================================
   week10.js — บทที่ 10: อาร์เรย์ (ภาษาซี)
   (ปุ่มรันโค้ด, สนามทดลองอาร์เรย์, เครื่องจัดเรียง Bubble Sort,
    คำถามแบบทดสอบ)
   ============================================================ */

// ---------- ปุ่ม "▶ คอมไพล์และรัน" : แสดงผลลัพธ์ที่ฝังไว้ใน data-output ----------
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

// ---------- สนามทดลองอาร์เรย์: arr[n] = x; n++; / n--; / arr[i] ----------
(function arrayPlayground() {
  const boxesEl = document.getElementById('listBoxes');
  if (!boxesEl) return;

  const valueInput = document.getElementById('lpValue');
  const indexInput = document.getElementById('lpIndex');
  const lenEl = document.getElementById('lpLen');
  const desc = document.getElementById('lpDesc');
  const CAP = 8;                 // ความจุของ int arr[8]
  let arr = [12, 7, 25];         // ค่าที่ใช้จริง n ตัวแรก

  function render(highlightIdx) {
    boxesEl.innerHTML = '';
    for (let i = 0; i < CAP; i++) {
      const box = document.createElement('div');
      box.className = 'machine-io';
      if (i < arr.length) {
        box.innerHTML = '<span class="label">[' + i + ']</span>' + arr[i];
      } else {
        box.innerHTML = '<span class="label">[' + i + ']</span>?';
        box.style.opacity = '0.35';
        box.title = 'ช่องว่างที่ยังไม่ถูกใช้ — ค่าข้างในคือ "ค่าขยะ" ไม่ใช่ศูนย์!';
      }
      if (i === highlightIdx) box.style.outline = '2px solid var(--amber)';
      boxesEl.appendChild(box);
    }
    lenEl.textContent = 'arr = {' + arr.join(', ') + '}   |   n = ' + arr.length + '   |   ความจุ 8 ช่อง';
  }

  document.getElementById('lpAppend').addEventListener('click', () => {
    if (arr.length >= CAP) {
      desc.textContent = '💥 อาร์เรย์เต็มแล้ว! arr[8] ไม่มีอยู่จริง — เขียนต่อคือทับหน่วยความจำข้างเคียง (undefined behavior) โปรแกรมจริงต้องตรวจ n < ความจุ ก่อนเสมอ';
      return;
    }
    const v = parseInt(valueInput.value, 10) || 0;
    arr.push(v);
    render(arr.length - 1);
    desc.textContent = 'arr[' + (arr.length - 1) + '] = ' + v + '; n++; → เติมช่องถัดไปแล้วขยับตัวนับ — ท่ามาตรฐานของการ "เพิ่มท้าย" ในภาษาซี';
    if (typeof gsap !== 'undefined') gsap.from(boxesEl.children[arr.length - 1], { scale: 0.4, duration: 0.4, ease: 'back.out(2.2)' });
  });

  document.getElementById('lpPop').addEventListener('click', () => {
    if (!arr.length) {
      desc.textContent = '⚠️ n เป็น 0 อยู่แล้ว — ลดต่อจะติดลบ แล้วทุกการอ้าง arr[n-1] จะพังหมด ต้องตรวจ n > 0 ก่อน';
      return;
    }
    const v = arr.pop();
    render();
    desc.textContent = 'n--; → ตัวนับลดลง ช่องที่เคยเก็บ ' + v + ' ยังอยู่ในหน่วยความจำ แต่ถือว่า "ไม่ใช้แล้ว" — ลบของอาร์เรย์คือแค่เลิกนับ';
  });

  document.getElementById('lpGet').addEventListener('click', () => {
    const i = parseInt(indexInput.value, 10);
    if (isNaN(i)) return;
    if (i < 0) {
      render();
      desc.textContent = '💥 arr[' + i + '] — ภาษาซีไม่มีดัชนีติดลบ! มันจะไปอ่านหน่วยความจำ "ก่อนหน้า" อาร์เรย์ = undefined behavior ได้ค่าขยะหรือพังแบบสุ่ม';
      return;
    }
    if (i >= arr.length) {
      render(i < CAP ? i : undefined);
      desc.textContent = '💥 arr[' + i + '] ' + (i < CAP ? 'อยู่ในความจุแต่ยังไม่ถูกใช้ (i >= n) — ได้ "ค่าขยะ" ที่ค้างในหน่วยความจำ' : 'เกินความจุ 8 ช่อง — อ่านล้ำแดนหน่วยความจำคนอื่น') + ' โดยไม่มี error เตือนเลย นี่คือความอันตรายอันดับหนึ่งของอาร์เรย์ซี';
      return;
    }
    render(i);
    desc.textContent = 'arr[' + i + '] = ' + arr[i] + ' — นับจากหัวโดยเริ่มที่ศูนย์ ช่องที่ใช้ได้ตอนนี้คือ 0 ถึง ' + (arr.length - 1);
  });

  render();
})();

// ---------- เครื่องจัดเรียง Bubble Sort ทีละขั้น ----------
(function bubbleSortViz() {
  const barsBox = document.getElementById('sortBars');
  const btnStep = document.getElementById('sortStep');
  const btnAuto = document.getElementById('sortAuto');
  const btnReset = document.getElementById('sortReset');
  if (!barsBox || !btnStep) return;

  const desc = document.getElementById('sortDesc');
  const START = [5, 2, 8, 3, 7, 1];
  let data, bars, i, j, finished, autoTimer = null;

  function makeBars() {
    barsBox.innerHTML = '';
    bars = data.map((v) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      setBar(bar, v);
      barsBox.appendChild(bar);
      return bar;
    });
  }

  function setBar(bar, v) {
    bar.style.height = (v * 24 + 28) + 'px';
    bar.textContent = v;
  }

  function init() {
    data = START.slice();
    i = 0;
    j = 0;
    finished = false;
    stopAuto();
    btnStep.disabled = false;
    btnAuto.disabled = false;
    btnAuto.textContent = '⏩ เล่นอัตโนมัติ';
    makeBars();
    desc.textContent = 'ข้อมูลตั้งต้น: {' + data.join(', ') + '} — สีเหลือง = คู่ที่กำลังเทียบ, สีเขียว = เข้าที่แล้ว';
  }

  function step() {
    if (finished) return;
    const n = data.length;
    bars.forEach((b) => b.classList.remove('compare'));

    bars[j].classList.add('compare');
    bars[j + 1].classList.add('compare');

    let msg = 'รอบที่ ' + (i + 1) + ': if (arr[' + j + '] > arr[' + (j + 1) + ']) → เทียบ ' + data[j] + ' กับ ' + data[j + 1];
    if (data[j] > data[j + 1]) {
      const temp = data[j];           // สลับ 3 จังหวะด้วย temp แบบเดียวกับโค้ดซีบนหน้า
      data[j] = data[j + 1];
      data[j + 1] = temp;
      setBar(bars[j], data[j]);
      setBar(bars[j + 1], data[j + 1]);
      msg += ' → จริง สลับด้วย temp! ตอนนี้: {' + data.join(', ') + '}';
    } else {
      msg += ' → เท็จ (0) ไม่สลับ';
    }

    j++;
    if (j >= n - i - 1) {
      bars[n - i - 1].classList.add('sorted');
      msg += ' — จบรอบที่ ' + (i + 1) + ': ตัวใหญ่สุดของรอบ "ลอย" ไปเข้าที่ทางขวาแล้ว';
      i++;
      j = 0;
      if (i >= n - 1) {
        finished = true;
        bars.forEach((b) => { b.classList.remove('compare'); b.classList.add('sorted'); });
        msg = '🎉 เรียงเสร็จ: {' + data.join(', ') + '} — รวมการเทียบทั้งหมด ' + (n * (n - 1) / 2) + ' ครั้ง นี่คือเหตุผลที่ข้อมูลใหญ่ ๆ ต้องใช้อัลกอริทึมฉลาดกว่านี้';
        btnStep.disabled = true;
        btnAuto.disabled = true;
        stopAuto();
      }
    }
    desc.textContent = msg;
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    btnAuto.textContent = '⏩ เล่นอัตโนมัติ';
  }

  btnStep.addEventListener('click', () => { stopAuto(); step(); });
  btnAuto.addEventListener('click', () => {
    if (autoTimer) { stopAuto(); return; }
    btnAuto.textContent = '⏸ หยุดชั่วคราว';
    autoTimer = setInterval(() => { step(); if (finished) stopAuto(); }, 480);
  });
  btnReset.addEventListener('click', init);

  init();
})();

// ---------- คำถามแบบทดสอบท้ายบท (quiz.js เป็นผู้วาดหน้าจอ) ----------
window.QUIZ_QUESTIONS = [
  {
    q: 'int items[3] = {10, 20, 30}; — items[1] คือค่าใด?',
    opts: ['10', '20', '30', 'คอมไพล์ไม่ผ่าน'],
    ans: 1,
    explain: 'ดัชนีเริ่มนับที่ 0: items[0] = 10, items[1] = 20 — กฎข้อแรกของอาร์เรย์ที่ทุกคนเคยพลาดอย่างน้อยหนึ่งครั้ง'
  },
  {
    q: 'อาร์เรย์ int scores[5]; สมาชิก "ตัวสุดท้าย" อ้างถึงด้วยข้อใด?',
    opts: ['scores[5]', 'scores[4]', 'scores[-1]', 'scores[last]'],
    ans: 1,
    explain: '5 ช่องมีดัชนี 0–4 ตัวสุดท้ายคือ scores[4] — scores[5] เกินขอบเขต และภาษาซีไม่มีดัชนีติดลบแบบภาษาอื่น'
  },
  {
    q: 'อ้างถึง scores[10] ทั้งที่อาร์เรย์มีแค่ 5 ช่อง ภาษาซีจะทำอย่างไร?',
    opts: [
      'ฟ้อง IndexError แล้วหยุดโปรแกรม',
      'คืนค่า 0 ให้เสมอ',
      'ไม่เตือนอะไร — อ่าน/เขียนหน่วยความจำข้างเคียง ได้ค่าขยะหรือพังแบบสุ่ม',
      'ขยายอาร์เรย์ให้อัตโนมัติ'
    ],
    ans: 2,
    explain: 'ภาษาซีไม่ตรวจขอบเขตให้ — มันทำตามสั่งตรง ๆ คือไปแตะหน่วยความจำตำแหน่งนั้น (undefined behavior) ผู้เขียนต้องคุมขอบเขตเองด้วยเงื่อนไข i < n เสมอ'
  },
  {
    q: 'ท่ามาตรฐานของการ "เพิ่มข้อมูลต่อท้าย" อาร์เรย์ (มีตัวนับ n) คือข้อใด?',
    opts: ['arr.append(x);', 'arr[n] = x; n++;', 'arr += x;', 'push(arr, x);'],
    ans: 1,
    explain: 'ภาษาซีไม่มี append สำเร็จรูป — วางค่าลงช่องถัดไป arr[n] = x; แล้วขยับตัวนับ n++; (และต้องตรวจก่อนว่า n ยังไม่เกินความจุ!)'
  },
  {
    q: 'ไล่โค้ด: int a[4] = {3, 1, 2, 9}; a[1] = a[3]; printf("%d", a[0] + a[1]); — ได้ค่าใด?',
    opts: ['4', '12', '11', '10'],
    ans: 1,
    explain: 'a[1] = a[3] คัดลอก 9 ทับช่อง 1 → {3, 9, 2, 9} แล้ว a[0] + a[1] = 3 + 9 = 12 — การอ้างดัชนีคือหัวใจของทุกข้อสอบอาร์เรย์'
  },
  {
    q: 'ทำไมภาษาซีต้องเขียนลูปหาผลรวมของอาร์เรย์เอง?',
    opts: [
      'เพราะ sum() ของซีช้ามาก',
      'เพราะภาษาซีไม่มีฟังก์ชัน sum/max/len สำเร็จรูปสำหรับอาร์เรย์',
      'ไม่จริง — ภาษาซีมี sum() ในตัว',
      'เพราะอาร์เรย์ซีเก็บตัวเลขไม่ได้'
    ],
    ans: 1,
    explain: 'ภาษาซีให้เครื่องมือพื้นฐานแล้วให้เราประกอบเอง: for + ตัวสะสม — ข้อดีคือเข้าใจไส้ในที่ภาษาอื่นซ่อนไว้ และโค้ดเร็วเพราะไม่มีอะไรแอบทำงานเบื้องหลัง'
  },
  {
    q: 'ฟังก์ชัน float average(int scores[], int n) — ทำไมต้องส่งจำนวนสมาชิก n เข้าไปด้วย?',
    opts: [
      'เพื่อความสวยงามของโค้ด',
      'เพราะอาร์เรย์ที่ส่งเข้าฟังก์ชันไม่ได้พกขนาดของตัวเองไปด้วย',
      'เพราะภาษาซีห้ามฟังก์ชันรับพารามิเตอร์ตัวเดียว',
      'เพื่อให้ลูปวนเร็วขึ้น'
    ],
    ans: 1,
    explain: 'อาร์เรย์ซีไม่เก็บขนาดไว้ในตัว — ฟังก์ชันรับมาแค่ "ตำแหน่งเริ่มต้น" จึงต้องบอกจำนวนแยกเสมอ ไม่งั้นไม่รู้จะวนถึงไหน — แบบแผนมาตรฐานที่เจอทุกโปรแกรมซี'
  },
  {
    q: 'การสลับค่า arr[j] กับ arr[j+1] ที่ถูกต้องคือข้อใด?',
    opts: [
      'arr[j] = arr[j+1]; arr[j+1] = arr[j];',
      'int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;',
      'swap(arr[j], arr[j+1]);',
      'arr[j] <=> arr[j+1];'
    ],
    ans: 1,
    explain: 'ต้องมีแก้วพัก temp เสมอ — แบบแรกค่า arr[j] ถูกทับหายก่อนจะย้าย ได้ค่าซ้ำสองช่อง! (ภาษาซีมาตรฐานไม่มี swap สำเร็จรูป) นี่คือสามบรรทัดหัวใจของ Bubble Sort'
  },
  {
    q: 'Bubble Sort กับอาร์เรย์ {5, 2, 8} การเทียบ "ครั้งแรก" คือคู่ใด และผลคืออะไร?',
    opts: [
      'เทียบ 5 กับ 8 → ไม่สลับ',
      'เทียบ 5 กับ 2 → สลับ ได้ {2, 5, 8}',
      'เทียบ 2 กับ 8 → สลับ ได้ {5, 8, 2}',
      'เทียบ 5 กับ 2 → ไม่สลับ'
    ],
    ans: 1,
    explain: 'Bubble Sort เทียบคู่ติดกันจากซ้าย: คู่แรกคือดัชนี 0–1 (5 กับ 2) → 5 ใหญ่กว่า สลับ ได้ {2, 5, 8} — รอบนี้เทียบต่อ 5 กับ 8 ไม่สลับ ก็เรียงเสร็จเลย'
  },
  {
    q: 'ประกาศ int arr[100]; แล้วใช้จริงแค่ 7 ค่า — ตัวแปร n ในโปรแกรมมีหน้าที่อะไร?',
    opts: [
      'เก็บความจุสูงสุด (100)',
      'นับว่าใช้จริงกี่ช่อง (7) — ทุกลูปวนถึง n ไม่ใช่ 100',
      'เก็บค่าสูงสุดในอาร์เรย์',
      'ไม่จำเป็นต้องมี'
    ],
    ans: 1,
    explain: 'ขนาดอาร์เรย์ตายตัว จึงประกาศเผื่อแล้วใช้ n นับของจริง — ลูปทุกตัววน i < n เพื่อไม่ไปอ่าน "ค่าขยะ" ในช่องที่ยังไม่ใช้ (8–99) — คู่หู arr + n คือหัวใจของโปรเจกต์สัปดาห์ที่ 13'
  }
];

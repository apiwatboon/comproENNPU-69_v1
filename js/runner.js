/* ============================================================
   runner.js — เปลี่ยนการ์ดโค้ดทุกใบเป็น "แก้ไขได้ + คอมไพล์รันจริง"
   ใช้ Piston API (GCC จริง) — ออฟไลน์เมื่อไรถอยไปแสดงผลที่บันทึกไว้
   ข้ามให้อัตโนมัติ: การ์ดที่มี data-norun="1", โค้ดที่มี "..." (โครงให้เติม),
   โค้ดที่สร้างแบบไดนามิก (มี id) และเนื้อหาที่ไม่ใช่ภาษาซี
   ============================================================ */

(function liveRunner() {
  const API = 'https://wandbox.org/api/compile.json'; // GCC จริงบนคลาวด์ ไม่ต้องสมัครสมาชิก

  // ---------- ประกอบโค้ดชิ้นส่วนให้เป็นโปรแกรมเต็มที่คอมไพล์ได้ ----------
  function buildProgram(code) {
    // ดึง #include ทั้งหมดขึ้นไปไว้หัวไฟล์ (กันกรณีถูกห่อเข้า main)
    const incs = [];
    const body = code.split('\n').filter(function (l) {
      if (/^\s*#include/.test(l)) { incs.push(l.trim()); return false; }
      return true;
    }).join('\n').trim();
    ['#include <stdio.h>', '#include <string.h>', '#include <ctype.h>', '#include <math.h>'].forEach(function (h) {
      if (incs.indexOf(h) === -1) incs.push(h);
    });
    const head = incs.join('\n') + '\n\n';

    if (/\bint\s+main\s*\(/.test(body)) return head + body + '\n';
    // มีนิยามฟังก์ชัน (ที่ไม่ใช่ main) → วางระดับไฟล์ แล้วเติม main ให้เรียกเอง
    if (/^(int|float|double|void|char|long|unsigned)\s+\w+\s*\([^)]*\)\s*\{/m.test(body)) {
      return head + body + '\n\nint main() {\n    // เรียกใช้ฟังก์ชันด้านบนได้ที่นี่\n    return 0;\n}\n';
    }
    // คำสั่งล้วน ๆ → ห่อใน main
    return head + 'int main() {\n' + body.split('\n').map(function (l) { return '    ' + l; }).join('\n') + '\n    return 0;\n}\n';
  }

  // ---------- ส่งให้ Wandbox (GCC 13) คอมไพล์และรัน ----------
  async function execute(src, stdin) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compiler: 'gcc-13.2.0', code: src, stdin: stdin || '' }),
    });
    if (!res.ok) throw new Error('เซิร์ฟเวอร์ตอบ ' + res.status + (res.status === 429 ? ' (คิวเต็ม รอสักครู่แล้วลองใหม่)' : ''));
    return res.json();
  }

  // ---------- อัปเกรดการ์ดโค้ดทีละใบ ----------
  document.querySelectorAll('.code-card').forEach(function (card) {
    if (card.dataset.norun === '1') return;
    const codeEl = card.querySelector('pre > code');
    if (!codeEl || codeEl.id) return;
    const original = codeEl.textContent;
    if (/^\s*\.\.\.\s*$/m.test(original) || original.indexOf(';') === -1) return; // โครงที่เว้น ... ให้เติม / ไม่ใช่โค้ดซี

    const pre = card.querySelector('pre');
    let runBtn = card.querySelector('.run-btn');
    let out = card.querySelector('.code-output');

    if (runBtn) {
      const clone = runBtn.cloneNode(true); // ปลดตัวจัดการเดิม (พิมพ์ผลที่อัดไว้)
      runBtn.replaceWith(clone);
      runBtn = clone;
    } else {
      runBtn = document.createElement('button');
      runBtn.className = 'run-btn';
      card.appendChild(runBtn);
    }
    runBtn.textContent = '▶ คอมไพล์และรันจริง (GCC)';
    if (!out) {
      out = document.createElement('div');
      out.className = 'code-output';
    }
    card.appendChild(out); // ให้ลำดับเป็น ...โค้ด → เครื่องมือ → ปุ่มรัน → ผลลัพธ์ เสมอ

    // ช่องแก้ไขโค้ด (สลับกับมุมมองสีสวย)
    const editor = document.createElement('textarea');
    editor.className = 'code-edit';
    editor.spellcheck = false;
    editor.value = original;
    editor.style.display = 'none';
    editor.rows = Math.min(22, original.split('\n').length + 2);
    pre.after(editor);

    // แถบเครื่องมือ
    const tools = document.createElement('div');
    tools.className = 'run-tools';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = '✏️ แก้ไขโค้ด';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = '↺ คืนโค้ดต้นฉบับ';
    resetBtn.style.display = 'none';
    tools.appendChild(editBtn);
    tools.appendChild(resetBtn);
    card.insertBefore(tools, runBtn);

    // ช่องอินพุตของ scanf
    let stdinArea = null;
    function ensureStdin() {
      if (stdinArea) return;
      const box = document.createElement('div');
      box.className = 'stdin-box';
      const label = document.createElement('label');
      label.textContent = '⌨️ อินพุตที่ scanf จะอ่าน (บรรทัดละชุด):';
      stdinArea = document.createElement('textarea');
      stdinArea.spellcheck = false;
      stdinArea.value = runBtn.dataset.stdin || '';
      stdinArea.placeholder = 'เช่น 70 แล้วขึ้นบรรทัดใหม่ 1.65';
      box.appendChild(label);
      box.appendChild(stdinArea);
      tools.before(box);
    }
    if (/\bscanf\s*\(|\bgetchar\s*\(/.test(original) || runBtn.dataset.stdin) ensureStdin();

    editBtn.addEventListener('click', function () {
      pre.style.display = 'none';
      editor.style.display = 'block';
      editBtn.style.display = 'none';
      resetBtn.style.display = '';
      ensureStdin(); // เผื่อผู้เรียนเติม scanf เอง
      editor.focus();
    });
    resetBtn.addEventListener('click', function () { editor.value = original; });

    function currentCode() {
      return editor.style.display === 'none' ? original : editor.value;
    }

    let running = false;
    runBtn.addEventListener('click', async function () {
      if (running) return;
      running = true;
      const code = currentCode();
      out.classList.add('show');
      out.textContent = '⏳ กำลังส่งให้คอมไพเลอร์ GCC บนคลาวด์...';
      runBtn.textContent = '⏳ กำลังคอมไพล์และรัน...';
      try {
        const data = await execute(buildProgram(code), stdinArea ? stdinArea.value : '');
        let txt = '';
        if (String(data.status) !== '0' && data.compiler_error && data.compiler_error.trim()) {
          txt = '❌ คอมไพล์ไม่ผ่าน — อ่านบรรทัดที่ GCC ชี้แล้วลองแก้ดู:\n\n' + data.compiler_error.trim();
        } else {
          txt = data.program_output || '';
          if (data.program_error && data.program_error.trim() && data.program_error !== data.program_output) {
            txt += (txt ? '\n' : '') + '⚠️ ' + data.program_error.trim();
          }
          if (data.signal) txt += (txt ? '\n' : '') + '💥 โปรแกรมพังกลางทาง (' + data.signal + ') — มักเกิดจากอ้างเกินขอบเขตอาร์เรย์ หรือ scanf ที่ไม่มี &';
          if (data.compiler_error && data.compiler_error.trim()) txt += '\n\n🟡 คำเตือนจากคอมไพเลอร์:\n' + data.compiler_error.trim();
          if (!txt.trim()) txt = '(โปรแกรมทำงานจบ แต่ไม่มีข้อความออกทางจอ — ลองเติม printf ดู)';
        }
        out.textContent = txt;
      } catch (e) {
        const canned = runBtn.dataset.output;
        out.textContent = (canned && code === original)
          ? canned + '\n\n📡 (ติดต่อเซิร์ฟเวอร์คอมไพล์ไม่ได้ — นี่คือผลที่บันทึกไว้ของโค้ดต้นฉบับ: ' + e.message + ')'
          : '📡 ติดต่อเซิร์ฟเวอร์คอมไพล์ไม่ได้ (ฟีเจอร์รันจริงต้องใช้อินเทอร์เน็ต): ' + e.message;
      }
      runBtn.textContent = '▶ คอมไพล์และรันจริง (GCC)';
      running = false;
    });
  });
})();

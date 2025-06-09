// test.js
// 예시 데이터
// const tests = [ ... ];  // 이거 삭제
// let currentTestIdx = null; // 삭제
// let currentQuestionIdx = 0; // 삭제
// let userAnswers = []; // 삭제

let crossoutMode = false; // 전역 crossout 모드
let selectedRange = null;
let timerInterval;
let userAnnotations = {}; // { [testIdx]: { [questionIdx]: annotatedHTML } }

function showTestIntro(idx) {
  // currentTestIdx = idx;
  // currentQuestionIdx = 0;
  // userAnswers = [];
  const test = tests[idx];
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <h2 style="text-align:center; font-size:2em; margin-bottom:32px;">Digital SAT® Practice Test</h2>
    <div class="test-info" style="max-width:540px; margin:0 auto;">
      <div style="display:flex;align-items:flex-start;margin-bottom:18px;">
        <span class="material-icons" style="font-size:2em;margin-right:16px;color:#1bb184;">schedule</span>
        <div>
          <b>Timing</b><br>
          이 모의고사는 실제 SAT와 동일하게 타이머가 작동합니다.<br>
          언제든 <b>일시정지</b>가 가능하며, 각 섹션별로 제한 시간이 있습니다.
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;margin-bottom:18px;">
        <span class="material-icons" style="font-size:2em;margin-right:16px;color:#1bb184;">score</span>
        <div>
          <b>Scores</b><br>
          시험이 끝나면 점수와 해설, 분석 리포트가 제공됩니다.
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;margin-bottom:18px;">
        <span class="material-icons" style="font-size:2em;margin-right:16px;color:#1bb184;">accessibility_new</span>
        <div>
          <b>Assistive Technology</b><br>
          시험 중 문의가 필요하면 언제든 도움을 요청할 수 있습니다.
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;">
        <span class="material-icons" style="font-size:2em;margin-right:16px;color:#1bb184;">lock_open</span>
        <div>
          <b>No Device Lock</b><br>
          연습 중에는 기기 락이 없으며, 실제 시험에서는 외부 프로그램 사용이 제한됩니다.
        </div>
      </div>
    </div>
    <div style="text-align:center;margin-top:40px;">
      <button id="test-intro-next" style="font-size:1.1em;padding:14px 48px;">Next</button>
    </div>
  `;

  document.getElementById('test-intro-next').onclick = () => {
    if (typeof window.startTest !== "function") {
      alert("startTest가 아직 준비되지 않았습니다!");
      console.log(window.startTest);
      return;
    }
    window.startTest(idx);
  };
}

function startTest(idx) {
  currentTestIdx = idx;
  currentQuestionIdx = 0;
  userAnswers = [];
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('main-content').classList.add('fullscreen');
  setTimeout(() => {
    const footer = document.querySelector('.sat-footer-bar');
    if (footer) footer.classList.add('fullscreen');
  }, 0);

  // 섹션별 시간(초)
  let sectionTime = 0;
  const sectionTitle = tests[idx].sectionTitle || "";
  if (sectionTitle.includes("Reading")) {
    sectionTime = 27 * 60; // 64분
  } else if (sectionTitle.includes("Math")) {
    sectionTime = 70 * 60; // 70분
  } else {
    sectionTime = 10 * 60; // 기본값
  }
  
  // 기존 타이머 정지 및 초기화
  stopTimer();
  window.sectionTimerRemain = sectionTime;
  window.sectionTimerStarted = false;

  loadTestPage();
}

async function loadTestPage() {
  const test = tests[currentTestIdx];
  const q = test.questions[currentQuestionIdx];
  const main = document.getElementById('main-content');
  const res = await fetch('components/testPage.html');
  const html = await res.text();
  main.innerHTML = html;

  console.log("Annotate 버튼:", document.getElementById('annotate-btn'));

  // sectionTitle 동적 표시
  document.getElementById('sat-section-title').innerText = test.sectionTitle || "Section";

  // passage가 있으면 본문/문제 분할, 없으면 문제만 전체
  const passageDiv = document.getElementById('test-passage');
  const questionArea = document.getElementById('sat-question-area');
  if (q.passage && q.passage.trim()) {
    passageDiv.style.display = '';
    if (userAnnotations[currentTestIdx] && userAnnotations[currentTestIdx][currentQuestionIdx]) {
      passageDiv.innerHTML = userAnnotations[currentTestIdx][currentQuestionIdx];
    } else {
      passageDiv.innerHTML = q.passage;
    }
    questionArea.style.flex = '1.2';
    passageDiv.style.flex = '1.1';
    questionArea.classList.remove('math-single');
  } else {
    passageDiv.style.display = 'none';
    questionArea.style.flex = '1 1 100%';
    questionArea.classList.add('math-single');
  }

  // 문제 이미지 (수학 등)
  const imgDiv = document.getElementById('sat-question-image');
  if (q.image) {
    imgDiv.innerHTML = `<img src="${q.image}" alt="문제 이미지" style="max-width:320px;display:block;margin:0 auto 18px auto;">`;
  } else {
    imgDiv.innerHTML = '';
  }

  // 문제 번호/텍스트
  document.getElementById('sat-question-num').innerHTML = `${currentQuestionIdx + 1}`;
  document.getElementById('sat-question-text').innerHTML = q.text;

  // Mark for Review 체크박스
  const markReview = document.getElementById('mark-review-checkbox');
  markReview.checked = !!q.marked;
  markReview.onchange = () => {
    q.marked = markReview.checked;
  };

  // ABC 버튼 클릭 시 crossout 모드 토글
  const abcBtn = document.querySelector('.sat-abc-icon');
  abcBtn.style.cursor = "pointer";
  abcBtn.onclick = () => {
    crossoutMode = !crossoutMode;
    loadTestPage();
  };
  if (crossoutMode) {
    abcBtn.style.background = "#1bb184";
    abcBtn.style.color = "#fff";
  } else {
    abcBtn.style.background = "#e0e0e0";
    abcBtn.style.color = "#222";
  }

  // 보기 렌더링
  const choicesForm = document.getElementById('sat-choices');
  choicesForm.innerHTML = q.choices.map((c, i) => `
    <div class="sat-choice-wrap${q.crossed && q.crossed[i] ? ' crossed' : ''}" data-idx="${i}">
      <input type="radio" class="sat-choice-input" name="choice" id="c${i}" value="${i}" ${userAnswers[currentQuestionIdx] == i ? "checked" : ""} ${q.crossed && q.crossed[i] ? 'disabled' : ''}>
      <label for="c${i}" class="sat-choice-label">
        <span class="sat-choice-letter">${String.fromCharCode(65 + i)}</span>
        <span class="sat-choice-text">${c}</span>
      </label>
      ${
        crossoutMode
          ? (q.crossed && q.crossed[i]
              ? `<button class="sat-choice-undo" type="button">Undo</button>`
              : `<button class="sat-choice-cross" type="button">&#9682;</button>`)
          : ''
      }
    </div>
  `).join('');

  // Cross-out/Undo 기능
  if (crossoutMode) {
    document.querySelectorAll('.sat-choice-cross').forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(btn.parentElement.getAttribute('data-idx'));
        if (!q.crossed) q.crossed = [];
        q.crossed[idx] = true;
        loadTestPage();
      };
    });
    document.querySelectorAll('.sat-choice-undo').forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(btn.parentElement.getAttribute('data-idx'));
        if (q.crossed) q.crossed[idx] = false;
        loadTestPage();
      };
    });
  }

  // 답안 저장
  document.querySelectorAll('.sat-choice-input').forEach(input => {
    input.addEventListener('change', (e) => {
      userAnswers[currentQuestionIdx] = parseInt(e.target.value);
    });
  });

  // 문제 번호 중앙 표시
  document.getElementById('sat-footer-question').innerText = `Question ${currentQuestionIdx + 1} of ${test.questions.length}`;

  // 버튼 이벤트 연결 (전역 상태 갱신!)
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');
  backBtn.onclick = () => {
    saveCurrentAnnotation();
    if (currentQuestionIdx > 0) {
      currentQuestionIdx--;
      loadTestPage();
    }
  };
  if (currentQuestionIdx < test.questions.length - 1) {
    nextBtn.disabled = false;
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => {
      saveCurrentAnnotation();
      currentQuestionIdx++;
      loadTestPage();
    };
  } else {
    // 마지막 문제: Next는 "Finish"로 표시하고 다음 섹션 처리
    nextBtn.disabled = false;
    nextBtn.textContent = "Finish";
    nextBtn.onclick = () => {
      saveCurrentAnnotation();
      // 다음 섹션이 있는지 확인하고 없으면 결과 페이지로
      if (window.nextSection && !window.nextSection()) {
        stopTimer();
        showResult();
      }
    };
  }
  backBtn.disabled = currentQuestionIdx === 0;

  // 타이머 중앙 배치 (sat-header-center)
  const timerDiv = document.getElementById('timer');
  if (timerDiv) {
    if (!window.sectionTimerStarted) {
      window.sectionTimerStarted = true;
      startTimer(window.sectionTimerRemain, () => {
        alert("섹션 시간이 종료되었습니다!");
        showResult();
      });
    } else {
      // 이미 시작된 타이머면 시간만 업데이트
      timerDiv.textContent = formatTime(window.sectionTimerRemain || 0);
    }
  }

  // 하단 문제 번호 클릭 시 네비게이터 팝업
  document.getElementById('sat-footer-question').onclick = () => {
    renderNavigatorPopup();
    document.getElementById('sat-navigator-popup').style.display = "block";
  };

  // 팝업 외부 클릭 시 닫기
  document.addEventListener('mousedown', function handler(e) {
    const popup = document.getElementById('sat-navigator-popup');
    if (popup.style.display === "block" && !popup.contains(e.target) && e.target.id !== 'sat-footer-question') {
      popup.style.display = "none";
      document.removeEventListener('mousedown', handler);
    }
  });

  // Annotate 버튼 이벤트 연결
  const annotateBtn = document.getElementById('annotate-btn');
  if (annotateBtn) {
    annotateBtn.onmousedown = (e) => {
      e.preventDefault(); // 버튼 포커스 이동 방지
      console.log("selectedRange:", selectedRange);
      if (!selectedRange) {
        alert("본문에서 텍스트를 먼저 드래그하세요!");
        return;
      }
      showAnnotationPopup(selectedRange);
    };
  }

  // Calculator/Reference 버튼도 동일하게
  const calculatorBtn = document.getElementById('calculator-btn');
  if (calculatorBtn) calculatorBtn.onclick = showCalculatorPopup;
  const referenceBtn = document.getElementById('reference-btn');
  if (referenceBtn) referenceBtn.onclick = showReferencePopup;
}

function renderNavigatorPopup() {
  const popup = document.getElementById('sat-navigator-popup');
  const test = tests[currentTestIdx];
  let html = `
    <div style="position:relative;">
      <span class="sat-navigator-close" onclick="document.getElementById('sat-navigator-popup').style.display='none'">&times;</span>
      <div style="font-size:1.18em;font-weight:700;margin-bottom:8px;">Section 1, Module 2: Reading and Writing</div>
      <div class="sat-navigator-legend">
        <span><span class="sat-dot-pin">&#128205;</span>Current</span>
        <span><span class="sat-navigator-dot"></span>Unanswered</span>
        <span><span class="sat-dot-flag">&#128278;</span>For Review</span>
      </div>
      <hr>
      <div class="sat-navigator-row">
  `;
  for (let i = 0; i < test.questions.length; i++) {
    const isCurrent = i === currentQuestionIdx;
    const isAnswered = typeof userAnswers[i] === "number";
    const isReview = test.questions[i].marked;
    html += `
      <div class="sat-navigator-dot${isCurrent ? ' current' : ''}${isAnswered ? ' answered' : ''}${isReview ? ' review' : ''}" tabindex="0" onclick="window.gotoQuestion(${i})">
        ${isCurrent ? '<span class="sat-dot-pin">&#128205;</span>' : ''}
        ${isReview ? '<span class="sat-dot-flag">&#128278;</span>' : ''}
        ${i + 1}
      </div>
    `;
  }
  html += `
      </div>
      <button class="sat-navigator-review-btn" onclick="alert('리뷰 페이지로 이동! (구현 필요)')">Go to Review Page</button>
    </div>
  `;
  popup.innerHTML = html;
}

// 전역 함수로 등록
window.gotoQuestion = function(idx) {
  currentQuestionIdx = idx;
  document.getElementById('sat-navigator-popup').style.display = "none";
  loadTestPage();
};

window.startTest = startTest;
window.loadTestPage = loadTestPage;

function showTestList() {
  stopTimer();
  document.getElementById('sidebar').style.display = '';
  document.getElementById('main-content').classList.remove('fullscreen');
  setTimeout(() => {
    const footer = document.querySelector('.sat-footer-bar');
    if (footer) footer.classList.remove('fullscreen');
  }, 0);
  // ... 기존 코드 ...
}

function showResult() {
  stopTimer();
  document.getElementById('sidebar').style.display = '';
  document.getElementById('main-content').classList.remove('fullscreen');
  setTimeout(() => {
    const footer = document.querySelector('.sat-footer-bar');
    if (footer) footer.classList.remove('fullscreen');
  }, 0);

  const test = tests[currentTestIdx];
  let correct = 0;
  let html = `
    <h2 style="text-align:center; font-size:2em; margin-bottom:24px;">시험 결과</h2>
    <div style="text-align:center; font-size:1.3em; margin-bottom:32px;">
      총 ${test.questions.length}문제 중 <b style="color:#1bb184;">${userAnswers.filter((a, i) => a === test.questions[i].answer).length}</b>개 정답!
    </div>
    <div class="result-table">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#eafaf3;">
            <th style="padding:8px;">번호</th>
            <th style="padding:8px;">내 답</th>
            <th style="padding:8px;">정답</th>
            <th style="padding:8px;">정오</th>
            <th style="padding:8px;">Annotate</th>
          </tr>
        </thead>
        <tbody>
  `;

  test.questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    const isCorrect = userAns === q.answer;
    // Annotate 표시 (userAnnotations 구조 사용)
    let annotation = "";
    if (window.userAnnotations && window.userAnnotations[currentTestIdx] && window.userAnnotations[currentTestIdx][i]) {
      annotation = `<span style="background:#fff8c6;border-bottom:1.5px solid #e6c200;">주석 있음</span>`;
    }
    html += `
      <tr style="background:${isCorrect ? '#eafaf3' : '#ffeaea'};">
        <td style="padding:8px;text-align:center;">${i + 1}</td>
        <td style="padding:8px;text-align:center;">${userAns !== undefined ? String.fromCharCode(65 + userAns) : '-'}</td>
        <td style="padding:8px;text-align:center;">${String.fromCharCode(65 + q.answer)}</td>
        <td style="padding:8px;text-align:center;">${isCorrect ? 'O' : 'X'}</td>
        <td style="padding:8px;text-align:center;">${annotation}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
    <div style="text-align:center;margin-top:36px;">
      <button onclick="showTestList()" class="sat-footer-btn" style="font-size:1.1em;padding:14px 48px;">시험 목록으로</button>
    </div>
  `;

  document.getElementById('main-content').innerHTML = html;

  // 결과 페이지 렌더링 후, 사이드바 버튼 이벤트 다시 연결!
  setTimeout(() => {
    const btnSelect = document.querySelector('button[onclick="showTestList()"]');
    if (btnSelect) btnSelect.onclick = showTestList;

    const btnUpload = document.querySelector('button[onclick="showUpload()"]');
    if (btnUpload) btnUpload.onclick = showUpload;

    // 내 정보 버튼도 필요하다면 연결
    // const btnInfo = document.querySelector('button[onclick="showUserInfo()"]');
    // if (btnInfo) btnInfo.onclick = showUserInfo;
  }, 0);
}

function showCalculatorPopup() {
  let popup = document.createElement('div');
  popup.className = 'sat-popup';
  popup.innerHTML = `
    <div class="sat-popup-header">
      Calculator
      <span class="sat-popup-close" onclick="this.parentElement.parentElement.remove()">×</span>
    </div>
    <iframe src="https://www.desmos.com/scientific?lang=en" width="400" height="400" style="border:0;"></iframe>
  `;
  document.body.appendChild(popup);
}

function showReferencePopup() {
  let popup = document.createElement('div');
  popup.className = 'sat-popup';
  popup.innerHTML = `
    <div class="sat-popup-header">
      SAT Math Reference Sheet
      <span class="sat-popup-close" onclick="this.parentElement.parentElement.remove()">×</span>
    </div>
    <img src="images/sat_reference.png" alt="SAT Math Reference" style="max-width:700px;display:block;margin:0 auto;">
  `;
  document.body.appendChild(popup);
}

function isInsidePassage(node) {
  const passage = document.querySelector('.sat-passage');
  while (node) {
    if (node === passage) return true;
    node = node.parentNode;
  }
  return false;
}

function cloneRange(range) {
  // Range 객체를 복사해서 반환
  return range ? range.cloneRange() : null;
}

document.addEventListener('selectionchange', () => {
  const sel = window.getSelection();
  if (
    sel.rangeCount > 0 &&
    sel.toString().length > 0 &&
    isInsidePassage(sel.anchorNode) &&
    isInsidePassage(sel.focusNode)
  ) {
    selectedRange = cloneRange(sel.getRangeAt(0));
    const btn = document.getElementById('annotate-btn');
    if (btn) btn.classList.add('active');
  } else {
    selectedRange = null;
    const btn = document.getElementById('annotate-btn');
    if (btn) btn.classList.remove('active');
  }
});

function showAnnotationPopup(range) {
  let popup = document.createElement('div');
  popup.className = 'sat-popup';
  popup.innerHTML = `
    <div class="sat-popup-header">
      New Annotation
      <span class="sat-popup-close" onclick="this.parentElement.parentElement.remove()">×</span>
    </div>
    <div style="padding:18px;">
      <div style="margin-bottom:10px;">선택한 텍스트: "<span style="background:#fff8c6">${range.toString()}</span>"</div>
      <textarea id="annotation-note" rows="3" style="width:100%;"></textarea>
      <div style="margin-top:12px;text-align:right;">
        <button id="annotation-save" class="sat-footer-btn">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('annotation-save').onclick = () => {
    const note = document.getElementById('annotation-note').value;
    applyAnnotation(range, note);
    popup.remove();
    window.getSelection().removeAllRanges();
  };
}

function applyAnnotation(range, note) {
  const span = document.createElement('span');
  span.className = 'sat-annotation';
  span.setAttribute('data-note', note);
  span.textContent = range.toString();
  range.deleteContents();
  range.insertNode(span);
}

function startTimer(seconds, onEnd) {
  let remain = seconds;
  window.sectionTimerRemain = remain;
  const timerDiv = document.getElementById('timer');
  
  // 타이머 엘리먼트 확인
  if (!timerDiv) {
    console.error("타이머 엘리먼트를 찾을 수 없습니다!");
    return;
  }
  
  // 기존 타이머가 있으면 제거
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerDiv.textContent = formatTime(remain);
  timerInterval = setInterval(() => {
    remain--;
    window.sectionTimerRemain = remain;
    
    // 타이머 엘리먼트가 여전히 존재하는지 확인
    const currentTimerDiv = document.getElementById('timer');
    if (currentTimerDiv) {
      currentTimerDiv.textContent = formatTime(remain);
    } else {
      // 타이머 엘리먼트가 없으면 인터벌 정지
      clearInterval(timerInterval);
      return;
    }
    
    if (remain <= 0) {
      clearInterval(timerInterval);
      onEnd();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function saveCurrentAnnotation() {
  if (!userAnnotations[currentTestIdx]) userAnnotations[currentTestIdx] = {};
  const passageDiv = document.getElementById('test-passage');
  if (passageDiv) {
    userAnnotations[currentTestIdx][currentQuestionIdx] = passageDiv.innerHTML;
  }
}

function formatTime(sec) {
  const m = String(Math.floor(sec/60)).padStart(2, '0');
  const s = String(sec%60).padStart(2, '0');
  return `${m}:${s}`;
}

window.startTest = startTest;
window.loadTestPage = loadTestPage;
window.gotoQuestion = gotoQuestion;

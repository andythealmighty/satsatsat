// 시험 데이터 저장용
let tests = [
    {
      sectionTitle: "Section 1, Module 1: Reading and Writing",
      title: "Digital SAT Practice Test 1",
      description: "Reading & Writing - 10문제",
      questions: [
        {
          passage: `
            <ul>
              <li>Marie Tharp was an American <b>geologist and oceanographic</b> cartographer.</li>
              <li>Oceanographic cartographers create maps of the ocean floor.</li>
              <li>The Mid-Atlantic Ridge is one of the most important geological features of the ocean floor.</li>
              <li>Tharp is best known for her work mapping the Mid-Atlantic Ridge, which helped confirm the theory of plate tectonics.</li>
            </ul>
          `,
          text: "Which choice most effectively uses information from the given sentences to specify what type of mapping work Tharp is known for?",
          choices: [
            "Oceanographic cartographers like Marie Tharp have significantly contributed to our understanding of the ocean floor.",
            "The Mid-Atlantic Ridge, a key geological feature of the ocean floor, has been studied by scientists like Marie Tharp.",
            "In the field of ocean mapping, Marie Tharp is best known for her work mapping the Mid-Atlantic Ridge, which provided critical evidence for the theory of plate tectonics.",
            "One geologist who made remarkable contributions to ocean mapping is Marie Tharp, known for her detailed maps of the ocean floor."
          ],
          answer: 2
        },
        {
          passage: "",
          text: "Which of the following best replaces the underlined portion in the sentence: 'The committee was divided in their opinions.'",
          choices: [
            "its",
            "their",
            "his or her",
            "her"
          ],
          answer: 0
        },
        {
          passage: "",
          text: "Choose the best version: 'Running quickly, the finish line was crossed by the athlete.'",
          choices: [
            "Running quickly, the finish line was crossed by the athlete.",
            "The athlete, running quickly, crossed the finish line.",
            "The finish line, running quickly, was crossed by the athlete.",
            "Quickly, the finish line was crossed by the athlete."
          ],
          answer: 1
        },
        {
          passage: "",
          text: "Which word best completes the sentence? 'Despite the rain, the event was a great ____.'",
          choices: [
            "success",
            "successful",
            "succeed",
            "successes"
          ],
          answer: 0
        },
        {
          passage: "",
          text: "Which of the following sentences is grammatically correct?",
          choices: [
            "Neither of the boys have done their homework.",
            "Neither of the boys has done his homework.",
            "Neither of the boys have done his homework.",
            "Neither of the boys has done their homework."
          ],
          answer: 1
        },
        {
          passage: "",
          text: "Which choice best maintains the tone and style of the passage?",
          choices: [
            "The scientist did a bunch of experiments.",
            "The scientist conducted several experiments.",
            "The scientist tried out some stuff.",
            "The scientist did some things."
          ],
          answer: 1
        },
        {
          passage: "",
          text: "Which of the following best combines the two sentences? 'The sun set. The sky turned orange.'",
          choices: [
            "The sun set, and the sky turned orange.",
            "The sun set the sky turned orange.",
            "The sun set; the sky turned orange.",
            "The sun set, the sky turned orange."
          ],
          answer: 0
        },
        {
          passage: "",
          text: "Which word or phrase best completes the sentence? 'She is not only talented ____ hardworking.'",
          choices: [
            "and",
            "but also",
            "or",
            "nor"
          ],
          answer: 1
        },
        {
          passage: "",
          text: "Which of the following sentences uses the correct form of 'affect' or 'effect'?",
          choices: [
            "The movie effected me deeply.",
            "The movie had a strong affect on me.",
            "The movie affected me deeply.",
            "The movie was affect by the director."
          ],
          answer: 2
        },
        {
          passage: "",
          text: "Which sentence is punctuated correctly?",
          choices: [
            "After dinner we went to the movies.",
            "After dinner, we went to the movies.",
            "After, dinner we went to the movies.",
            "After dinner we, went to the movies."
          ],
          answer: 1
        }
      ]
    },
    {
      sectionTitle: "Section 2, Module 1: Math",
      title: "Digital SAT Practice Test 2",
      description: "Math - 10문제",
      questions: [
        {
          passage: "",
          text: "If x + 2 = 7, what is the value of x?",
          choices: [
            "3",
            "5",
            "7",
            "9"
          ],
          answer: 1
        },
        {
          passage: "",
          text: "What is the value of 2x when x = 4?",
          choices: [
            "2",
            "4",
            "6",
            "8"
          ],
          answer: 3
        },
        {
          passage: "",
          text: "If 3x = 12, what is x?",
          choices: [
            "2",
            "3",
            "4",
            "6"
          ],
          answer: 2
        },
        {
          passage: "",
          text: "What is the slope of the line y = 5x + 2?",
          choices: [
            "2",
            "5",
            "1",
            "0"
          ],
          answer: 1
        },
        {
          passage: "",
          text: "If f(x) = x^2, what is f(3)?",
          choices: [
            "6",
            "9",
            "3",
            "8"
          ],
          answer: 1
        },
        {
          passage: "",
          text: "What is the solution to the equation 2x - 4 = 10?",
          choices: [
            "3",
            "5",
            "7",
            "10"
          ],
          answer: 2
        },
        {
          passage: "",
          text: "If the area of a square is 16, what is the length of one side?",
          choices: [
            "2",
            "4",
            "8",
            "16"
          ],
          answer: 1
        },
        {
          passage: "",
          text: "What is the value of 3^2 + 4^2?",
          choices: [
            "12",
            "25",
            "49",
            "7"
          ],
          answer: 1
        },
        {
          passage: "",
          text: "If y = 2x and x = 5, what is y?",
          choices: [
            "7",
            "10",
            "12",
            "15"
          ],
          answer: 1
        },
        {
          passage: "",
          text: "What is the value of (10 - 3) × 2?",
          choices: [
            "7",
            "14",
            "20",
            "17"
          ],
          answer: 1
        }
      ]
    }
  ];
  
  let currentTestIdx = null;
  let currentQuestionIdx = 0;
  let userAnswers = [];
  
  // 시험 리스트 화면
  function showTestList() {
    const main = document.getElementById('main-content');
    let html = `<h2 style="font-weight:700;font-size:2em;">Digital SAT® Prep</h2>
      <div class="test-card-list">`;
    tests.forEach((test, idx) => {
      html += `
        <div class="test-card" onclick="showTestIntro(${idx})">
          <div class="test-title">${test.title}</div>
          <div class="test-desc">${test.description || ""}</div>
          <div class="test-num">${test.questions ? test.questions.length : ""}</div>
        </div>
      `;
    });
    html += `</div>`;
    main.innerHTML = html;
  }
  
  // 시험 업로드 화면
  function showUpload() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div style="background:#f8f8f8;padding:15px;border-radius:8px;margin-bottom:20px;">
        <b>문제 파일(CSV) 예시:</b><br>
        문제번호,문제내용,선택지1,선택지2,선택지3,선택지4,정답,이미지파일명<br>
        1,Marie Tharp는 어떤 분야의 지도 제작으로 유명합니까?,지질학 지도,해양 지도,기상 지도,도시 지도,2,tharp.jpg<br>
        2,Mid-Atlantic Ridge의 지도화가 중요한 이유는?,기후 변화 연구,판 구조론 증거 제공,해양 생물 다양성,지진 예측,2,<br>
        <br>
        <b>이미지 zip 파일:</b> 문제에 첨부할 이미지를 zip으로 압축하여 업로드 (파일명은 CSV의 이미지파일명과 일치해야 함)
      </div>
      <h2>시험 업로드</h2>
      <form id="upload-form">
        <label>문제 파일 (CSV/TXT): <input type="file" id="test-file" accept=".csv,.txt"></label><br><br>
        <label>이미지 ZIP 파일: <input type="file" id="img-zip" accept=".zip"></label><br><br>
        <button type="submit">업로드</button>
      </form>
      <div id="upload-result"></div>
    `;
    document.getElementById('upload-form').onsubmit = handleUpload;
  }
  
  // 업로드 처리 (기본 구조)
  async function handleUpload(e) {
    e.preventDefault();
    const testFile = document.getElementById('test-file').files[0];
    const imgZip = document.getElementById('img-zip').files[0];
    const resultDiv = document.getElementById('upload-result');
  
    if (!testFile) {
      resultDiv.innerText = "문제 파일을 선택하세요.";
      return;
    }
    if (!imgZip) {
      resultDiv.innerText = "이미지 ZIP 파일을 선택하세요.";
      return;
    }
  
    // 1. 이미지 zip 해제
    let imgMap = {};
    try {
      const zipData = await imgZip.arrayBuffer();
      const zip = await JSZip.loadAsync(zipData);
      const files = Object.keys(zip.files);
      for (const filename of files) {
        if (!zip.files[filename].dir) {
          const blob = await zip.files[filename].async("blob");
          imgMap[filename] = URL.createObjectURL(blob);
        }
      }
    } catch (err) {
      resultDiv.innerText = "이미지 zip 파일 해제 실패: " + err;
      return;
    }
  
    // 2. CSV 파싱
    Papa.parse(testFile, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        // 문제 데이터 생성
        const rows = results.data;
        if (!rows.length) {
          resultDiv.innerText = "문제 파일에 데이터가 없습니다.";
          return;
        }
        // 시험 데이터 구조 생성
        const newTest = {
          sectionTitle: testFile.name.replace(/\.[^/.]+$/, ""),
          title: testFile.name.replace(/\.[^/.]+$/, ""),
          description: "업로드된 시험",
          questions: []
        };
        for (const row of rows) {
          newTest.questions.push({
            text: row["문제내용"],
            choices: [row["선택지1"], row["선택지2"], row["선택지3"], row["선택지4"]],
            answer: parseInt(row["정답"], 10) - 1, // 1~4 → 0~3
            image: row["이미지파일명"] && imgMap[row["이미지파일명"]] ? imgMap[row["이미지파일명"]] : null
          });
        }
        tests.push(newTest);
        resultDiv.innerText = "시험 업로드 성공! 시험 목록에서 확인하세요.";
        showTestList();
      },
      error: function(err) {
        resultDiv.innerText = "CSV 파싱 오류: " + err;
      }
    });
  }
  
  // 시험 안내 화면
  async function showTestIntro(idx) {
    currentTestIdx = idx;
    currentQuestionIdx = 0;
    userAnswers = [];
    const main = document.getElementById('main-content');
    const res = await fetch('components/testIntro.html');
    const html = await res.text();
    main.innerHTML = html;
    // 반드시 window.startTest로 호출!
    document.getElementById('test-intro-next').onclick = () => window.startTest(idx);
  }
  
  
  function showResult() {
    const test = tests[currentTestIdx];
    let correct = 0;
    test.questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) correct++;
    });
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <h2>결과</h2>
      <div>총 ${test.questions.length}문제 중 ${correct}개 정답!</div>
      <button style="margin-top:30px;" onclick="showTestList()">시험 목록으로</button>
    `;
  }
  
  // 초기화
  showTestList();
  
  window.startTest = startTest;
  window.loadTestPage = loadTestPage;
  window.prevQuestion = prevQuestion;
  window.nextQuestion = nextQuestion;
  
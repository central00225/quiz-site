function getQuizFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('quiz')) {
    try {
      const decoded = atob(decodeURIComponent(params.get('quiz')));
      const payload = JSON.parse(decoded);
      if (payload.creator && payload.quiz) {
        creator = payload.creator;
        return payload.quiz;
      } else if (Array.isArray(payload)) {
        return payload;
      }
    } catch (e) {
      alert('Quiz invalide ou corrompu.');
    }
  }
  return null;
}

let questions = getQuizFromURL() || [
  {
    question: "Quelle est la capitale de la France ?",
    answers: ["Paris", "Londres", "Berlin", "Madrid"],
    correct: 0
  },
  {
    question: "Combien font 2 + 2 ?",
    answers: ["3", "4", "5", "2"],
    correct: 1
  },
  {
    question: "Quel est le plus grand océan du monde ?",
    answers: ["Atlantique", "Indien", "Arctique", "Pacifique"],
    correct: 3
  }
];

let currentQuestion = 0;
let score = 0;
let creator = '';

const quizEl = document.getElementById('quiz');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');

function showQuestion() {
  resultEl.textContent = '';
  nextBtn.style.display = 'none';
  if (currentQuestion === 0 && creator) {
    quizEl.innerHTML = `<div style='margin-bottom:12px;color:#2d3a4b;font-weight:bold;'>Quiz créé par : ${creator}</div>`;
  } else {
    quizEl.innerHTML = '';
  }
  const q = questions[currentQuestion];
  quizEl.innerHTML += `<div class="question">${q.question}</div>` +
    q.answers.map((ans, i) => `<button class="btn" onclick="selectAnswer(${i})">${ans}</button>`).join('');
}

window.selectAnswer = function(index) {
  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.style.background = '#4caf50';
    if (i === index && i !== q.correct) btn.style.background = '#e57373';
  });
  if (index === q.correct) score++;
  nextBtn.style.display = 'inline-block';
}

nextBtn.onclick = function() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    quizEl.innerHTML = '';
    nextBtn.style.display = 'none';
    resultEl.innerHTML = `Votre score : ${score} / ${questions.length}` + (creator ? `<br><span style='font-size:1rem;'>Quiz créé par : <b>${creator}</b></span>` : '');
  }
};

showQuestion();

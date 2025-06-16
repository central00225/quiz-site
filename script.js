const questions = [
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

const quizEl = document.getElementById('quiz');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');

function showQuestion() {
  resultEl.textContent = '';
  nextBtn.style.display = 'none';
  const q = questions[currentQuestion];
  quizEl.innerHTML = `<div class="question">${q.question}</div>` +
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
    resultEl.textContent = `Votre score : ${score} / ${questions.length}`;
  }
};

showQuestion();

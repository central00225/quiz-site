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

function getUserQuizFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('userquiz')) {
    try {
      const decoded = atob(decodeURIComponent(params.get('userquiz')));
      return JSON.parse(decoded);
    } catch (e) {
      alert('Quiz utilisateur invalide ou corrompu.');
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

const userQuiz = getUserQuizFromURL();
if (userQuiz) {
  // Mode "devine les réponses de ton ami"
  let current = 0;
  let score = 0;
  quizEl.innerHTML = `<div style='margin-bottom:12px;color:#2d3a4b;font-weight:bold;'>Devine les réponses de : ${userQuiz.creator}</div>`;
  showUserQuizQuestion();
  function showUserQuizQuestion() {
    resultEl.textContent = '';
    nextBtn.style.display = 'none';
    let q = userQuiz.questions[current];
    quizEl.innerHTML = `<div style='margin-bottom:12px;color:#2d3a4b;font-weight:bold;'>Devine les réponses de : ${userQuiz.creator}</div>`;
    if(q.img) quizEl.innerHTML += `<img src='${q.img}' alt='' style='max-width:100%;border-radius:8px;margin:8px 0;'>`;
    quizEl.innerHTML += `<div class='question'>${q.q}</div>`;
    quizEl.innerHTML += `<input type='text' id='guess' placeholder='Ta réponse...' style='width:100%;margin-bottom:12px;'>`;
    quizEl.innerHTML += `<div id='feedback'></div>`;
    nextBtn.style.display = 'inline-block';
    nextBtn.textContent = current < userQuiz.questions.length-1 ? 'Suivant' : 'Voir le score';
    nextBtn.onclick = function() {
      const guess = document.getElementById('guess').value.trim().toLowerCase();
      const correct = userQuiz.answers[current].trim().toLowerCase();
      if(guess === correct) score++;
      current++;
      if(current < userQuiz.questions.length) {
        showUserQuizQuestion();
      } else {
        quizEl.innerHTML = '';
        nextBtn.style.display = 'none';
        resultEl.innerHTML = `Tu as trouvé ${score} / ${userQuiz.questions.length} réponses de ${userQuiz.creator} !`;
      }
    }
  }
  // Empêche l'ancien quiz de s'afficher
  window.selectAnswer = () => {};
  showQuestion = () => {};
  nextBtn.style.display = 'inline-block';
  return;
}

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

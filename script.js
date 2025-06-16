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
  let current = 0;
  let score = 0;
  quizEl.innerHTML = `<div style='margin-bottom:12px;color:#2d3a4b;font-weight:bold;'>Quiz de ${userQuiz.creator} : Tente de deviner ses réponses !</div>`;
  showUserQuizQuestion();
  function showUserQuizQuestion() {
    resultEl.textContent = '';
    nextBtn.style.display = 'none';
    let q = userQuiz.questions[current];
    quizEl.innerHTML = `<div class='card'><b>Question ${current+1} :</b><br>${q.q}</div>`;
    q.options.forEach((opt, i) => {
      quizEl.innerHTML += `<button class='btn' style='margin-bottom:8px;' onclick='window.selectUserQuizAnswer(${i})'>${opt}</button>`;
    });
  }
  window.selectUserQuizAnswer = function(index) {
    let correct = userQuiz.answers[current];
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correct) btn.style.background = '#4caf50';
      if (i === index && i !== correct) btn.style.background = '#e57373';
    });
    if (index === correct) score++;
    nextBtn.style.display = 'inline-block';
    nextBtn.textContent = current < userQuiz.questions.length-1 ? 'Suivant' : 'Voir le score';
    nextBtn.onclick = function() {
      current++;
      if(current < userQuiz.questions.length) {
        showUserQuizQuestion();
      } else {
        quizEl.innerHTML = '';
        nextBtn.style.display = 'none';
        resultEl.innerHTML = `Tu as obtenu ${score} / ${userQuiz.questions.length} bonnes réponses sur le quiz de ${userQuiz.creator} !<br><br><a href='monquiz.html' class='btn' style='margin-top:18px;'>Crée ton propre quiz</a>`;
      }
    }
  }
  // Empêche l'ancien quiz de s'afficher
  window.selectAnswer = () => {};
  showQuestion = () => {};
  nextBtn.style.display = 'inline-block';
  return;
}

const quizFromFriend = getQuizFromURL();
if (quizFromFriend) {
  let current = 0;
  let score = 0;
  quizEl.innerHTML = `<div style='margin-bottom:12px;color:#2d3a4b;font-weight:bold;'>Quiz de ${creator ? creator : 'ton ami'} : Trouve ses réponses !</div>`;
  showFriendQuizQuestion();
  function showFriendQuizQuestion() {
    resultEl.textContent = '';
    nextBtn.style.display = 'none';
    let q = quizFromFriend[current];
    quizEl.innerHTML = `<div class='card'><b>Question ${current+1} :</b><br>${q.question}</div>`;
    q.answers.forEach((ans, i) => {
      quizEl.innerHTML += `<button class='btn' style='margin-bottom:8px;' onclick='window.selectFriendAnswer(${i})'>${ans}</button>`;
    });
  }
  window.selectFriendAnswer = function(index) {
    let q = quizFromFriend[current];
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) btn.style.background = '#4caf50';
      if (i === index && i !== q.correct) btn.style.background = '#e57373';
    });
    if (index === q.correct) score++;
    nextBtn.style.display = 'inline-block';
    nextBtn.textContent = current < quizFromFriend.length-1 ? 'Suivant' : 'Voir le score';
    nextBtn.onclick = function() {
      current++;
      if(current < quizFromFriend.length) {
        showFriendQuizQuestion();
      } else {
        quizEl.innerHTML = '';
        nextBtn.style.display = 'none';
        resultEl.innerHTML = `Tu as obtenu ${score} / ${quizFromFriend.length} !<br><br><a href='create.html' class='btn' style='margin-top:18px;'>Crée ton propre quiz</a>`;
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

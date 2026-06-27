(function () {
  const studySets = window.STUDY_SETS || [];
  const flattenedQuestions = studySets.flatMap((set) =>
    set.questions.map((question) => ({
      id: question.id,
      month: set.month,
      sessionLabel: set.sessionLabel,
      title: set.title,
      scripture: set.scripture,
      type: question.type,
      prompt: question.prompt,
      answer: question.answer,
      hint: question.hint,
    })),
  );

  const screens = {
    start: document.getElementById("start-screen"),
    quiz: document.getElementById("quiz-screen"),
    done: document.getElementById("done-screen"),
  };

  const elements = {
    setCount: document.getElementById("set-count"),
    questionCount: document.getElementById("question-count"),
    startButton: document.getElementById("start-button"),
    homeButton: document.getElementById("home-button"),
    progressBar: document.getElementById("progress-bar"),
    progressText: document.getElementById("progress-text"),
    monthPill: document.getElementById("month-pill"),
    sessionPill: document.getElementById("session-pill"),
    setTitle: document.getElementById("set-title"),
    scripture: document.getElementById("scripture"),
    questionType: document.getElementById("question-type"),
    questionText: document.getElementById("question-text"),
    revealButton: document.getElementById("reveal-button"),
    answerPanel: document.getElementById("answer-panel"),
    answerText: document.getElementById("answer-text"),
    hintText: document.getElementById("hint-text"),
    prevButton: document.getElementById("prev-button"),
    nextButton: document.getElementById("next-button"),
    shuffleButton: document.getElementById("shuffle-button"),
    restartButton: document.getElementById("restart-button"),
    restartShuffleButton: document.getElementById("restart-shuffle-button"),
  };

  let currentIndex = 0;
  let shuffledQuestions = [...flattenedQuestions];

  elements.setCount.textContent = String(studySets.length);
  elements.questionCount.textContent = String(flattenedQuestions.length);

  function setActiveScreen(screenKey) {
    Object.values(screens).forEach((screen) => {
      screen.classList.remove("screen-active");
    });
    screens[screenKey].classList.add("screen-active");
  }

  function renderQuestion() {
    const question = shuffledQuestions[currentIndex];
    const progressPercent = ((currentIndex + 1) / shuffledQuestions.length) * 100;

    elements.progressBar.style.width = `${progressPercent}%`;
    elements.progressText.textContent = `${currentIndex + 1} / ${shuffledQuestions.length}`;
    elements.monthPill.textContent = question.month;
    elements.sessionPill.textContent = question.sessionLabel;
    elements.setTitle.textContent = question.title;
    elements.scripture.textContent = question.scripture;
    elements.questionType.textContent = `${question.type} 문제`;
    elements.questionText.textContent = question.prompt;
    elements.answerText.textContent = question.answer;
    elements.hintText.textContent = question.hint;
    elements.answerPanel.hidden = true;
    elements.revealButton.hidden = false;
    elements.prevButton.disabled = currentIndex === 0;
  }

  function startQuiz(useShuffle) {
    shuffledQuestions = [...flattenedQuestions];
    if (useShuffle) {
      for (let index = shuffledQuestions.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const currentQuestion = shuffledQuestions[index];
        shuffledQuestions[index] = shuffledQuestions[randomIndex];
        shuffledQuestions[randomIndex] = currentQuestion;
      }
    }

    currentIndex = 0;
    renderQuestion();
    setActiveScreen("quiz");
  }

  function revealAnswer() {
    elements.answerPanel.hidden = false;
    elements.revealButton.hidden = true;
  }

  function moveQuestion(direction) {
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      return;
    }

    if (nextIndex >= shuffledQuestions.length) {
      setActiveScreen("done");
      return;
    }

    currentIndex = nextIndex;
    renderQuestion();
  }

  elements.startButton.addEventListener("click", function () {
    startQuiz(false);
  });

  elements.homeButton.addEventListener("click", function () {
    setActiveScreen("start");
  });

  elements.revealButton.addEventListener("click", revealAnswer);
  elements.questionText.addEventListener("click", revealAnswer);
  elements.prevButton.addEventListener("click", function () {
    moveQuestion(-1);
  });
  elements.nextButton.addEventListener("click", function () {
    moveQuestion(1);
  });
  elements.shuffleButton.addEventListener("click", function () {
    startQuiz(true);
  });
  elements.restartButton.addEventListener("click", function () {
    startQuiz(false);
  });
  elements.restartShuffleButton.addEventListener("click", function () {
    startQuiz(true);
  });
})();

const contentDiv = document.getElementById('content');
let flashcards = [];
let currentCardIndex = 0;
let cardElement;

async function loadTopics() {
  const res = await fetch('data/topics.json');
  const topics = await res.json();
  const nav = document.querySelector('nav');
  nav.innerHTML = ''; 

  topics.forEach(topic => {
    const btn = document.createElement('button');
    btn.textContent = topic.name;
    btn.dataset.topic = topic.id;
    btn.addEventListener('click', () => loadTopic(topic.id));
    nav.appendChild(btn);
  });
}

async function loadTopic(topicId) {
  const res = await fetch(`data/${topicId}.json`);
  flashcards = await res.json();
  currentCardIndex = 0;
  renderFlashcard();
}

function renderFlashcard() {
  contentDiv.innerHTML = `
    <div class="flashcard-wrapper">
      <div class="card-container">
        <div class="card">
          <div class="card-front">
            <p id="question"></p>
            <p>Nhấn để lật thẻ</p>
          </div>
          <div class="card-back">
            <h2>Đáp án</h2>
            <p id="answer"></p>
          </div>
        </div>
      </div>
      <div class="nav-buttons">
        <button class="prev-card">Thẻ trước</button>
        <button class="next-card">Thẻ tiếp theo</button>
      </div>
    </div>
  `;

  cardElement = contentDiv.querySelector('.card');
  const questionElement = contentDiv.querySelector('#question');
  const answerElement = contentDiv.querySelector('#answer');
  const prevBtn = contentDiv.querySelector('.prev-card');
  const nextBtn = contentDiv.querySelector('.next-card');

  function updateCardContent() {
    const card = flashcards[currentCardIndex];
    questionElement.textContent = card.question;
    answerElement.textContent = card.answer;
    cardElement.style.transform = 'rotateY(0deg)';
  }

  cardElement.addEventListener('click', () => {
    cardElement.style.transform =
      cardElement.style.transform === 'rotateY(180deg)' 
        ? 'rotateY(0deg)' 
        : 'rotateY(180deg)';
  });

  prevBtn.addEventListener('click', () => {
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    updateCardContent();
  });

  nextBtn.addEventListener('click', () => {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    updateCardContent();
  });

  updateCardContent();
}

loadTopics();

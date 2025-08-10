let countries = [];
let currentCountry = null;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

async function loadCountries() {
  const res = await fetch(DATA_PATH);
  countries = await res.json();
  loadRandomCountry();
}

function loadRandomCountry() {
  const correct = countries[Math.floor(Math.random() * countries.length)];
  currentCountry = correct;

  const otherChoices = countries
    .filter(c => c.code !== correct.code)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const allChoices = [...otherChoices, correct].sort(() => 0.5 - Math.random());

  const container = document.getElementById('display-container');
  container.innerHTML = '';

  if (MODE === 'map') {
    container.innerHTML = `
      <div class="image-wrapper">
        <img src="/static/data/${correct.code}.svg" class="main-image" alt="Map of ${correct.name}">
      </div>
    `;
  } else if (MODE === 'flag') {
    container.innerHTML = `
      <div class="image-wrapper">
        <img src="/static/flags/${correct.code}.svg" class="main-image" alt="Flag of ${correct.name}">
      </div>
    `;
  }


  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';
  allChoices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary btn-lg';
    btn.innerText = choice.name;
    btn.onclick = () => checkAnswer(choice);
    choicesDiv.appendChild(btn);
  });
}


function checkAnswer(selected) {
  const result = document.getElementById('result');
  if (selected.code === currentCountry.code) {
    score++;
    result.innerText = `✅ Точно! Сегашен скор: ${score}`;
    result.className = 'show correct';


    setTimeout(() => {
      result.innerText = '';
      loadRandomCountry();
    }, 1200);
  } else {
    result.innerText = `❌ Неточно! Тоа беше ${currentCountry.name}.\nФинален скор: ${score}`;
    result.className = 'show incorrect';


    if (score > highScore) {
      localStorage.setItem("highScore", score);
      result.innerText += `\n🥇 Нов највисок скор!`;
    } else {
      result.innerText += `\n🏆 Највисок скор: ${highScore}`;
    }

    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-warning btn-lg retry-btn';
    retryBtn.innerText = 'Пробај пак';
    retryBtn.onclick = () => {
      score = 0;
      result.innerText = '';
      loadRandomCountry();
    };

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    choicesDiv.appendChild(retryBtn);
  }
}

window.onload = loadCountries;

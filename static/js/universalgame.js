let countries = [];
let currentCountry = null;
let score = 0;

// --- robust localStorage helpers (work even if storage is blocked) ---
const LS_KEY = "gwc_highScore";
function lsGet(key, fallback = "0") {
  try {
    const v = window.localStorage.getItem(key);
    return v !== null ? v : fallback;
  } catch { return fallback; }
}
function lsSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch {}
}

let highScore = parseInt(lsGet(LS_KEY, "0"), 10) || 0;

async function loadCountries() {
  const res = await fetch(DATA_PATH, { cache: "no-store" });
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
        <img src="/static/data/${correct.code}.svg" class="main-image" alt="meow">
      </div>
    `;
  } else if (MODE === 'flag') {
    container.innerHTML = `
      <div class="image-wrapper">
        <img src="/static/flags/${correct.code}.svg" class="main-image" alt="mjau">
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

    // >>> FIX: update in-memory HS AND saved HS
    if (score > highScore) {
      highScore = score;
      lsSet(LS_KEY, String(highScore));
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

// 1. Find the HTML elements we want to read or update.
const answerButtons = document.querySelectorAll('.answer');
const feedback = document.querySelector('#feedback');
const explanation = document.querySelector('#explanation');
const resetButton = document.querySelector('#reset');
const hint = document.querySelector('.hint');
const correctAnswer = 'Frank Lloyd Wright';

// Each architect's name is a key that retrieves one comparison object.
// Keeping content here makes it easy to edit without changing the click logic.
const comparisons = {
  "Zaha Hadid": {
    "building": "Heydar Aliyev Center · Baku",
    "architect": "Zaha Hadid Architects",
    "image": "hadid.jpg",
    "alt": "Heydar Aliyev Center with a continuous white surface rising into a sweeping wave above a glass facade.",
    "summary": "Hadid is a useful comparison: both buildings connect architecture with landscape. At the Heydar Aliyev Center, that connection takes the form of flowing, continuous surfaces. Fallingwater’s stacked horizontal terraces and rough stone core point to Frank Lloyd Wright.",
    "look": "Follow the white surface as it sweeps up from the plaza into a wave. These flowing curves are characteristic of this project by Zaha Hadid Architects.",
    "difference": "At Fallingwater, separate flat terraces project outward like rock ledges. Its stonework and position over a waterfall express Wright’s organic architecture: a close relationship between a building and its natural site.",
    "prompt": "Trace each silhouette: one flowing wave versus a stack of horizontal ledges.",
    "credit": "Avisadehh",
    "source": "https://commons.wikimedia.org/wiki/File:HEIDAR_ALIYEV_CENTER_WIDE_ANGLE.%D7%96%D7%95%D7%95%D7%99%D7%AA_%D7%A8%D7%97%D7%91%D7%94_%D7%9E%D7%A8%D7%9B%D7%96_%D7%94%D7%99%D7%99%D7%93%D7%A8_%D7%90%D7%9C%D7%99%D7%99%D7%91.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "learn": "https://www.zhfoundation.com/collections/heydar-aliyev-centre/"
  },
  "Le Corbusier": {
    "building": "Villa Savoye · Poissy",
    "architect": "Le Corbusier and Pierre Jeanneret",
    "image": "corbusier.jpg",
    "alt": "Villa Savoye: a white rectangular upper story with ribbon windows raised above the lawn on slender columns.",
    "summary": "The horizontal lines make Le Corbusier a plausible choice. But Villa Savoye’s white box stands on slender columns called pilotis. Fallingwater’s projecting terraces, rough stonework, and integration with the rocky waterfall site point to Frank Lloyd Wright.",
    "look": "Look under the white upper story: slender pilotis lift it above the lawn. Long ribbon windows and clear geometric forms illustrate Le Corbusier’s approach at Villa Savoye.",
    "difference": "Fallingwater also uses horizontal lines, but combines projecting concrete terraces with textured stone and the waterfall beneath. Read the materials and relationship to the site together, rather than relying on flat roofs alone.",
    "prompt": "Compare how each house meets the ground: slender columns over a lawn versus stone and terraces above rock and water.",
    "credit": "Valueyou",
    "source": "https://en.wikipedia.org/wiki/File:VillaSavoye.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "learn": "https://www.villa-savoye.fr/en/discover/le-corbusier-s-5-points-of-modern-architecture"
  },
  "Frank Gehry": {
    "building": "Guggenheim Museum Bilbao · Bilbao",
    "architect": "Frank Gehry",
    "image": "gehry.jpg",
    "alt": "Guggenheim Museum Bilbao with curved reflective titanium forms beside pale stone volumes.",
    "summary": "Gehry’s Guggenheim Museum Bilbao uses curved, reflective titanium forms to create a sculptural composition. Fallingwater’s flat, layered terraces and textured stone anchored to a waterfall site point to Frank Lloyd Wright.",
    "look": "Look at the curved silver forms on the left: their titanium surfaces catch the light. The museum combines these sculptural volumes with limestone and glass.",
    "difference": "At Fallingwater, the main visual rhythm comes from long, flat concrete terraces and rough stone. Both buildings respond to their sites, but this combination of ledge-like layers, rock, and water is the clue to Wright here.",
    "prompt": "Compare the edges and surfaces: curved reflective metal versus flat terraces and textured stone.",
    "credit": "Zarateman",
    "source": "https://commons.wikimedia.org/wiki/File:Bilbao_-_Guggenheim_40.jpg",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "learn": "https://www.guggenheim-bilbao.eus/en/about-the-museum/the-museum"
  }
};
const comparison = document.querySelector('#comparison');

function showComparison(architect) {
  const example = comparisons[architect];
  document.querySelector('#comparison-title').textContent = `Compare with ${architect}`;
  document.querySelector('#comparison-building').textContent = `${example.building} — ${example.architect}`;
  document.querySelector('#comparison-image').src = example.image;
  document.querySelector('#comparison-image').alt = example.alt;
  document.querySelector('#comparison-full').href = example.image;
  document.querySelector('#comparison-look').textContent = example.look;
  document.querySelector('#comparison-difference').textContent = example.difference;
  document.querySelector('#comparison-prompt').textContent = example.prompt;
  document.querySelector('#comparison-credit').textContent = `Photo: ${example.credit} · Source`;
  document.querySelector('#comparison-credit').href = example.source;
  document.querySelector('#comparison-license').textContent = example.license;
  document.querySelector('#comparison-license').href = example.licenseUrl;
  document.querySelector('#comparison-learn').href = example.learn;
  comparison.hidden = false;
}

// Add real text so the result is visible and included in the button's accessible name.
function addAnswerLabel(button, label) {
  const result = document.createElement('span');
  result.className = 'answer-result';
  result.textContent = label;
  button.appendChild(result);
}

// 2. Run this function immediately when someone clicks an answer.
function checkAnswer(event) {
  // currentTarget is the button, even if its letter inside was clicked.
  const selectedButton = event.currentTarget;
  const selectedAnswer = selectedButton.dataset.architect;
  const isCorrect = selectedAnswer === correctAnswer;

  // 3. Show clear written feedback, not just a color change.
  if (isCorrect) {
    feedback.textContent = 'Correct! Frank Lloyd Wright designed Fallingwater.';
    feedback.className = 'correct';
    comparison.hidden = true;
  } else {
    feedback.textContent = `Not quite. ${comparisons[selectedAnswer].summary}`;
    showComparison(selectedAnswer);
    feedback.className = 'incorrect';
    selectedButton.classList.add('incorrect');
    addAnswerLabel(selectedButton, 'Incorrect');
  }

  // 4. Highlight the right answer and lock this attempt until reset.
  answerButtons.forEach(function (button) {
    button.disabled = true;
    if (button.dataset.architect === correctAnswer) {
      button.classList.add('correct');
      addAnswerLabel(button, 'Correct');
    }
  });
  explanation.hidden = false;
  hint.hidden = true;
}

// 5. Attach one click listener to each answer button.
answerButtons.forEach(function (button) {
  button.addEventListener('click', checkAnswer);
});

// 6. Reset the page state without reloading the browser.
resetButton.addEventListener('click', function () {
  answerButtons.forEach(function (button) {
    button.disabled = false;
    button.classList.remove('correct', 'incorrect');
    const result = button.querySelector('.answer-result');
    if (result) result.remove();
  });
  comparison.hidden = true;
  document.querySelector('#comparison-image').removeAttribute('src');
  feedback.textContent = '';
  feedback.className = '';
  explanation.hidden = true;
  hint.hidden = false;
  answerButtons[0].focus();
});

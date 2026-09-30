# Architecture Quiz — Who Designed This Building?

## Original idea

Create a simple, one-question browser quiz for architecture students learning to recognize famous architects and elements of their signature design styles. Students identify the architect of Fallingwater from a multiple-choice list and receive immediate feedback explaining the architectural clues behind the correct answer.

The finished quiz includes a real photograph of Fallingwater, visual comparisons for incorrect choices, explicit Correct/Incorrect labels, and a minimalist architecture-portfolio design.

## Opening and running the project

1. Download this repository using **Code → Download ZIP** on GitHub, then unzip it. Alternatively, clone it with `git clone https://github.com/kate07203/architecture-quiz.git`.
2. Open the extracted project folder.
3. Double-click `index.html` to open it in a modern browser.
4. Select an architect to see immediate feedback. If your answer is incorrect, a photograph and explanation compare that architect’s work with Fallingwater. Select **Try again** to reset the quiz.

Keep the HTML, CSS, JavaScript, and four JPG files together in the same folder. No installation, build command, or server is required. The quiz and photographs work offline; external reference and credit links require internet access. The GitHub repository contains the source files; it is not a hosted version of the quiz.

## AI tool used

**OpenAI Codex (desktop app)** helped generate and revise the HTML, CSS, and JavaScript, explain how the code works, and check the interaction. I supplied the concept, tested the experience, and directed the content and visual revisions. The building photographs are real photographs from the credited sources below, not AI-generated images.

## Selected prompts

The following excerpts are from my prompts to Codex, in the order of the main revisions.

### 1. Build the first version

> I want to create a one question quiz for architecture students that are trying to learn famous architects and their signature design styles using HTML, CSS, and JavaScript. The user should identify the architect of a famous building from a multiple choice list and receive feedback if right or wrong -- explaining the architectural clues behind the right answer.

> Keep the code beginner-friendly and help me understand the happenings in the code.

### 2. Use a real photograph

> The current illustration of Fallingwater feels too generic and hard for students to actually learn what the architectural elements look in actuality. Can we please change it to be an actual real life image of Fallingwater?

### 3. Make incorrect answers educational

> Can we make the feedback explain how the wrong architect chosen is different from the correct architect? Include an image of the wrong architect's style so it is clear to see the differences. Show me what needs to change and explain why.

### 4. Refine the visual design

> Make sure there is a lot of white space, make the typography, be very simple, keep the colors to be black/white/gray, and have a clear hierarchy. Do not change anything else of the interaction/keep the interaction the main focus. Show me what changes in the code and explain why.

### 5. Clarify the instructions

> So, please change "Choose an architect to reveal the story" to "Chose the correct architect that designed this building."

### 6. Label the answers explicitly

> While the bottom description helps understand why, to more easily show that the answer is wrong, please add "incorrect" next to each architect that is wrong when you click on it. And please add "correct" to the right architect's name.

## My reflection

My original intention was to create a simple one-question quiz to help architecture students learn about famous architects and be able to recognize elements of their signature design styles. The first change I made was to change the illustration of Fallingwater to an actual picture of the building so students knew what it looked like in real life. After this edit, the first version was complete and successfully allowed users to identify the architect of Fallingwater and provided immediate feedback. But after testing it, I realized that simply telling a student that their answer was wrong did not actually help them understand why it was wrong. So I asked Codex to help me revise the quiz so that when a user selects an incorrect architect, they see an example of that architect's work alongside an explanation comparing their design style to Frank Lloyd Wright's. Finally, I changed the visual design of the quiz to be more true to architecture → it now resembles a minimalist architecture portfolio and I also revised some of the language and answer feedback after noticing that parts of the interface could be clearer for a student using the quiz.

In this assignment AI helped me translate my ideas into HTML, CSS, and JavaScript and helped explain how changes to the code affected the interaction. I still had to decide what the experience should teach and evaluate whether the AI-generated result actually accomplished that goal. For example, AI initially created generic incorrect-answer feedback, but I decided that comparing the selected architect's work visually with Fallingwater would make the mistake itself part of the learning experience. I also noticed through testing that the phrase "Choose an architect to reveal the story" did not accurately communicate the purpose of the quiz, so I changed it to give the user clearer instructions. One thing I learned through this process is that AI is magical!!! and can create and revise the code quickly, but it ultimately cannot decide for me whether the experience was effective for my intended user. I had to continue testing the quiz from the perspective of an architecture student and direct the AI toward changes that better matched my original intention.

### Space for additional reflection

_Add future observations, student feedback, or changes you would make next here._

---

## How the files work together

- `index.html` supplies the content: the building photograph, question, four buttons, and explanation. The `link` loads the CSS; the deferred `script` loads JavaScript after the HTML has been read.
- `style.css` controls colors, type, spacing, and layout. Grid creates two columns. The media query stacks them on narrow screens. `.correct` and `.incorrect` style answer states.
- `script.js` makes the quiz respond. Its numbered comments walk through the process.

## Follow a click through the code

1. `querySelectorAll('.answer')` collects all four answer buttons.
2. `addEventListener('click', checkAnswer)` tells each button which function to run when clicked. Native buttons also work with Enter and Space.
3. `event.currentTarget` identifies the button. `dataset.architect` reads its HTML `data-architect` value.
4. `===` compares that value with `correctAnswer`, producing `true` or `false`.
5. `if / else` chooses the feedback. `textContent` updates the message; `classList.add` changes the appearance.
6. `explanation.hidden = false` reveals the architectural clues for either outcome. Buttons are disabled to preserve the attempt.
7. Try again clears the message, removes the colors, enables the buttons, and returns keyboard focus to the first answer.

The feedback region uses `role="status"` so assistive technology can announce the result. Written feedback communicates correctness independently of color.

## Try a small edit

Change `--paper` in the CSS to update the page background. Edit the heading in HTML to change the question's wording. To use a different building, update the photograph, building details, answer labels AND their `data-architect` values, the `correctAnswer` constant, feedback messages, explanation, and source link together.

The photograph is stored locally as `fallingwater.jpg`. HTML's `<img src="fallingwater.jpg">` loads it, and `alt` supplies a written description for screen readers. CSS's `width: 100%` and `height: auto` scale the full photograph proportionally without cropping. Clicking the photograph opens the full-resolution image in a new tab.

Photo: Lykantrop, April 4, 2007, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Frank_Lloyd_Wright_-_Fallingwater_exterior_1.JPG). The source permits unrestricted use, redistribution, and modification (Copyrighted free use). The downloaded version includes Steve Morgan's leveling and highlight adjustments; no additional image edits were made for this quiz.

Sources: [Designing Fallingwater](https://fallingwater.org/history/the-kaufmanns-fallingwater/designing-fallingwater/) and [Preservation history](https://fallingwater.org/preservation-history/).


## Answer-specific visual feedback

Previously, the `else` branch gave the same correction for every wrong choice. It now uses `comparisons[selectedAnswer]` to retrieve content matched to that choice. For example, `comparisons['Zaha Hadid']` returns the Heydar Aliyev Center comparison.

- **HTML:** `#comparison` is a hidden section with empty text elements and an image. This gives all three comparisons the same readable structure.
- **JavaScript:** `comparisons` stores a building name, image filename, alt text, explanation, photo credit, license, and source links for each wrong architect. `showComparison()` fills the HTML using `textContent`, `src`, `alt`, and `href`, then sets `hidden = false`. The live feedback also includes a concise comparison so screen-reader users hear the educational correction immediately.
- **CSS:** `#comparison` styles the card. `width: 100%` and `height: auto` display the complete photograph at the available width.
- **Reset:** hides the comparison and removes its image source. The next wrong answer populates the same card with fresh content; a correct answer keeps it hidden.

The comparison photos are local, so they work offline. Click any photo for a full-size view. The comparisons teach visible features of these specific projects, rather than implying each architect uses only one style.

### Comparison photo credits

- hadid.jpg: Heydar Aliyev Center · Baku. Photo by Avisadehh, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). [Image source](https://commons.wikimedia.org/wiki/File:HEIDAR_ALIYEV_CENTER_WIDE_ANGLE.%D7%96%D7%95%D7%95%D7%99%D7%AA_%D7%A8%D7%97%D7%91%D7%94_%D7%9E%D7%A8%D7%9B%D7%96_%D7%94%D7%99%D7%99%D7%93%D7%A8_%D7%90%D7%9C%D7%99%D7%99%D7%91.jpg). Unmodified. [Architecture reference](https://www.zhfoundation.com/collections/heydar-aliyev-centre/).

- corbusier.jpg: Villa Savoye · Poissy. Photo by Valueyou, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). [Image source](https://en.wikipedia.org/wiki/File:VillaSavoye.jpg). Unmodified. [Architecture reference](https://www.villa-savoye.fr/en/discover/le-corbusier-s-5-points-of-modern-architecture).

- gehry.jpg: Guggenheim Museum Bilbao · Bilbao. Photo by Zarateman, [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). [Image source](https://commons.wikimedia.org/wiki/File:Bilbao_-_Guggenheim_40.jpg). Unmodified. [Architecture reference](https://www.guggenheim-bilbao.eus/en/about-the-museum/the-museum).

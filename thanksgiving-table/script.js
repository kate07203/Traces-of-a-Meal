// A scripted dinner: every drawing is calculated from the slider's minute.
// This makes rewinding reliable: no objects or crumbs accumulate by accident.
const svg = document.querySelector('#table-drawing');
const slider = document.querySelector('#time-slider');
const playButton = document.querySelector('#play');
const pathToggle = document.querySelector('#show-paths');
const seats = [{ x: 240, y: 150 }, { x: 720, y: 150 }, { x: 240, y: 430 }, { x: 720, y: 430 }];
const foods = [
  { name: 'Turkey', color: '#ba854d', start: { x: 320, y: 288 }, rx: 55, ry: 29 },
  { name: 'Potatoes', color: '#ddc58b', start: { x: 480, y: 288 }, rx: 37, ry: 32 },
  { name: 'Cranberry', color: '#984553', start: { x: 640, y: 288 }, rx: 50, ry: 22 }
];
// Pass events move the whole dish. Take events move only a small food dot.
const passes = [
  { food: 0, start: 10, end: 15, to: { x: 230, y: 260 } },
  { food: 1, start: 18, end: 24, to: { x: 710, y: 260 } },
  { food: 2, start: 28, end: 34, to: { x: 720, y: 325 } },
  { food: 0, start: 36, end: 43, to: { x: 240, y: 330 } },
  { food: 1, start: 48, end: 55, to: { x: 460, y: 325 } },
  { food: 2, start: 59, end: 66, to: { x: 605, y: 260 } },
  { food: 0, start: 69, end: 77, to: { x: 340, y: 280 } }
];
const takes = [
  { food: 0, seat: 0, start: 16, end: 19 }, { food: 1, seat: 1, start: 25, end: 28 },
  { food: 2, seat: 1, start: 35, end: 38 }, { food: 0, seat: 2, start: 44, end: 47 },
  { food: 1, seat: 3, start: 56, end: 59 }, { food: 2, seat: 2, start: 67, end: 70 },
  { food: 0, seat: 3, start: 78, end: 81 }, { food: 1, seat: 0, start: 82, end: 85 }
];
const clamp = value => Math.max(0, Math.min(1, value));
const progress = (minute, start, end) => clamp((minute - start) / (end - start));
const mix = (a, b, amount) => a + (b - a) * amount;
const ease = amount => amount * amount * (3 - 2 * amount);

function curve(from, to, amount, bend = 22) {
  const control = { x: (from.x + to.x) / 2 + bend, y: (from.y + to.y) / 2 - bend };
  return { x: (1 - amount) ** 2 * from.x + 2 * (1 - amount) * amount * control.x + amount ** 2 * to.x,
    y: (1 - amount) ** 2 * from.y + 2 * (1 - amount) * amount * control.y + amount ** 2 * to.y };
}
function dishPosition(food, minute) {
  let position = { ...foods[food].start };
  for (const event of passes.filter(event => event.food === food)) {
    if (minute < event.start) break;
    position = curve(position, event.to, ease(progress(minute, event.start, event.end)));
    if (minute < event.end) break;
  }
  return position;
}
// Save the departure coordinates once, so every path describes the same story.
passes.forEach(event => { event.from = dishPosition(event.food, event.start); });
takes.forEach(event => { event.from = dishPosition(event.food, event.start); });

function settingPosition(index, minute) {
  const amount = ease(progress(minute, 5 + index * 3, 88));
  const shifts = [{ x: -18, y: 13 }, { x: 14, y: -9 }, { x: 20, y: 6 }, { x: -14, y: -17 }];
  return { x: seats[index].x + shifts[index].x * amount, y: seats[index].y + shifts[index].y * amount, amount };
}
function pathDrawing(from, to, amount, type, bend = 22) {
  // Sample only the traveled portion of the curve; future paths stay hidden.
  const points = Array.from({ length: 25 }, (_, index) => curve(from, to, amount * index / 24, bend));
  return `<path class="${type}-line" d="M${points.map(point => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' L')}" ${type === 'object' ? '' : `marker-end="url(#${type}-arrow)"`} />`;
}
function timeLabel(minute) {
  const total = 20 * 60 + Math.floor(minute);
  return `${total % 720 < 60 ? 12 : Math.floor(total / 60) % 12}:${String(total % 60).padStart(2, '0')} PM`;
}

function render() {
  const minute = Number(slider.value);
  const allPaths = pathToggle.checked;
  const label = timeLabel(minute);
  document.querySelector('#clock').textContent = label;
  slider.setAttribute('aria-valuetext', label);
  const phase = minute < 10 ? 'Before' : minute < 80 ? 'During' : 'After';
  const captions = { Before: 'A quiet table, before the first gesture.', During: 'Food circulates. Objects drift. The table gathers a memory.', After: 'The movement settles. Crumbs, folds, and paths remain.' };
  document.querySelector('#drawing-title').textContent = `Abstract dinner at ${label}`;
  document.querySelector('#drawing-description').textContent = `Four place settings, three abstract serving dishes. ${captions[phase]} ${allPaths ? 'All movement paths from the whole dinner are visible.' : 'Paths follow the current time.'}`;

  document.querySelector('#place-settings').innerHTML = seats.map((seat, index) => {
    const position = settingPosition(index, minute);
    const drift = position.amount;
    const portions = takes.filter(event => event.seat === index && minute >= event.end).map((event, portion) =>
      `<circle cx="${-16 + portion * 17}" cy="${portion % 2 ? 9 : -6}" r="${minute > 80 ? 3 : 6}" fill="${foods[event.food].color}" />`).join('');
    return `<g transform="translate(${position.x} ${position.y})">
      <circle class="plate" r="45" /><circle class="plate-ring" r="37" />${portions}
      <path class="utensil" transform="rotate(${-12 * drift} -66 0)" d="M-66 -28 V28 M-72 -28 V-13 H-60 V-28 M-66 -28 V-13" />
      <path class="utensil" transform="rotate(${16 * drift} 65 0)" d="M65 -28 V28 M65 -28 Q77 -12 65 0" />
      <g transform="translate(${8 * drift} ${-6 * drift})"><circle class="cup" cx="101" cy="-29" r="15" /><circle class="plate-ring" cx="101" cy="-29" r="10" /></g>

    </g>`;
  }).join('');
  document.querySelector('#shared-dishes').innerHTML = foods.map((food, index) => {
    const position = dishPosition(index, minute);
    const depletion = 1 - .5 * progress(minute, 15, 85);
    return `<g transform="translate(${position.x} ${position.y})"><ellipse class="dish" rx="${food.rx}" ry="${food.ry}" /><ellipse rx="${food.rx * .78 * depletion}" ry="${food.ry * .7 * depletion}" fill="${food.color}" /></g>`;
  }).join('');

  let paths = '';
  passes.forEach(event => {
    const amount = allPaths ? 1 : progress(minute, event.start, event.end);
    if (amount > 0) paths += pathDrawing(event.from, event.to, ease(amount), 'pass');
  });
  let moving = '';
  takes.forEach(event => {
    const to = settingPosition(event.seat, event.end);
    const amount = progress(minute, event.start, event.end);
    if (allPaths || amount > 0) paths += pathDrawing(event.from, to, allPaths ? 1 : ease(amount), 'take', -30);
    if (amount > 0 && amount < 1) {
      const position = curve(event.from, to, ease(amount), -30);
      moving += `<circle cx="${position.x}" cy="${position.y}" r="7" fill="${foods[event.food].color}" stroke="#352f28" />`;
    }
  });
  // Gray trajectories record the quieter drift of place settings, separately from food sharing.
  seats.forEach((seat, index) => {
    const to = settingPosition(index, allPaths ? 90 : minute);
    if (allPaths || minute > 5 + index * 3) {
      [{ x: 0, y: 0 }, { x: 101, y: -29 }, { x: -66, y: 0 }, { x: 65, y: 0 }].forEach(offset => {
        paths += pathDrawing({ x: seat.x + offset.x, y: seat.y + offset.y }, { x: to.x + offset.x, y: to.y + offset.y }, 1, 'object', 0);
      });
    }
  });
  document.querySelector('#movement-history').innerHTML = paths;
  document.querySelector('#moving-portions').innerHTML = moving;
  const crumbs = Array.from({ length: 42 }, (_, index) => {
    const born = 23 + index * 1.45;
    const amount = progress(minute, born, born + 8);
    if (!amount) return '';
    const x = 120 + index * 97 % 720;
    const y = 235 + index * 37 % 120;
    return `<circle cx="${x + amount * (index % 7 - 3)}" cy="${y + amount * 9}" r="${1 + index % 2}" fill="#8c7150" opacity="${amount}" />`;
  }).join('');
  const napkins = [[120, 190], [490, 420], [860, 365]].map(([x, y], index) => {
    const amount = ease(progress(minute, 62 + index * 5, 85 + index * 2));
    return `<path transform="translate(${x + amount * 15} ${y - amount * 12}) rotate(${amount * 25})" opacity="${amount}" d="M0 0 l12 -9 9 7 -2 10 9 8 -12 8 -15 -4 -7 -11Z" fill="#fffaf0" stroke="#352f28" stroke-width="1.5" />`;
  }).join('');
  document.querySelector('#after-traces').innerHTML = crumbs + napkins;
  svg.classList.toggle('path-view', allPaths);
}

let playing = false;
let frame;
let previousTime;
let playbackMinute = 0;
function stop() {
  playing = false;
  cancelAnimationFrame(frame);
  previousTime = undefined;
  playButton.textContent = 'Play dinner';
}
function tick(now) {
  if (!playing) return;
  if (previousTime !== undefined) playbackMinute = Math.min(90, playbackMinute + (now - previousTime) / 1000 * 2);
  slider.value = playbackMinute;
  previousTime = now;
  render();
  if (Number(slider.value) >= 90) { stop(); return; }
  frame = requestAnimationFrame(tick);
}
playButton.addEventListener('click', () => {
  if (playing) { stop(); return; }
  if (Number(slider.value) >= 90) slider.value = 0;
  playbackMinute = Number(slider.value);
  playing = true;
  playButton.textContent = 'Pause dinner';
  frame = requestAnimationFrame(tick);
});
slider.addEventListener('input', () => { stop(); render(); });
pathToggle.addEventListener('change', render);
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
render();

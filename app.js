const canvas = document.getElementById('cosmos');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zoom y pan
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStart.x = e.clientX - offsetX;
  dragStart.y = e.clientY - offsetY;
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    offsetX = e.clientX - dragStart.x;
    offsetY = e.clientY - dragStart.y;
  }
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomAmount = -e.deltaY * 0.001;
  scale += zoomAmount;
  scale = Math.min(Math.max(0.2, scale), 5);
});

// Soles y planetas
let suns = [
  { x: -200, y: -100, r: 40, name: "Proyecto 1" },
  { x: 300, y: 150, r: 50, name: "Proyecto 2" }
];

let planets = [
  { x: -220, y: -120, r: 15, name: "Tarea A" },
  { x: -180, y: -80, r: 15, name: "Tarea B" },
  { x: 320, y: 170, r: 20, name: "Tarea C" }
];

// Ventana de tareas
const taskWindow = document.getElementById('taskWindow');
const taskName = document.getElementById('taskName');
const taskNotes = document.getElementById('taskNotes');

canvas.addEventListener('dblclick', (e) => {
  const x = (e.clientX - offsetX) / scale;
  const y = (e.clientY - offsetY) / scale;

  for (let sun of suns) {
    const dx = x - sun.x;
    const dy = y - sun.y;
    if (Math.sqrt(dx*dx + dy*dy) < sun.r) {
      const newName = prompt("Nombre del proyecto:", sun.name);
      if (newName) sun.name = newName;
    }
  }
});

canvas.addEventListener('click', (e) => {
  const x = (e.clientX - offsetX) / scale;
  const y = (e.clientY - offsetY) / scale;

  let clickedPlanet = null;
  for (let planet of planets) {
    const dx = x - planet.x;
    const dy = y - planet.y;
    if (Math.sqrt(dx*dx + dy*dy) < planet.r) {
      clickedPlanet = planet;
      break;
    }
  }

  if (clickedPlanet) {
    taskWindow.classList.remove('hidden');
    taskName.value = clickedPlanet.name;
    taskNotes.value = "";
  } else {
    taskWindow.classList.add('hidden');
  }
});

function draw() {
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,width,height);
  ctx.setTransform(scale,0,0,scale,offsetX,offsetY);

  // Dibujar soles
  suns.forEach(sun => {
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.r, 0, Math.PI*2);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `${sun.r/2}px Arial`;
    ctx.fillText(sun.name, sun.x + sun.r + 5, sun.y);
  });

  // Dibujar planetas
  planets.forEach(planet => {
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.r, 0, Math.PI*2);
    ctx.fillStyle = 'cyan';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `${planet.r/2}px Arial`;
    ctx.fillText(planet.name, planet.x + planet.r + 5, planet.y);
  });

  requestAnimationFrame(draw);
}

draw();

// Ajustar canvas al resize
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let scale = 1;
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;

let suns = [
  {x: -200, y: 0, r: 50, name: 'Proyecto 1'},
  {x: 200, y: 0, r: 50, name: 'Proyecto 2'}
];

let planets = [
  {x: -250, y: 0, r: 20, name: 'Tarea 1'},
  {x: -150, y: 50, r: 20, name: 'Tarea 2'},
  {x: 250, y: 0, r: 20, name: 'Tarea 3'}
];

let selectedElement = null;
let draggingCanvas = false;
let lastMouse = {x:0, y:0};

const planetPopup = document.getElementById('planetPopup');
const planetNameInput = document.getElementById('planetName');

function draw() {
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.setTransform(scale,0,0,scale,offsetX,offsetY);

  // Dibujar soles
  suns.forEach(sun => {
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.r, 0, Math.PI*2);
    ctx.fillStyle = 'tomato';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = `${14}px Arial`;
    ctx.fillText(sun.name, sun.x - sun.r, sun.y - sun.r - 10);
  });

  // Dibujar planetas
  planets.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = 'skyblue';
    ctx.fill();
  });

  requestAnimationFrame(draw);
}
draw();

// Zoom
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  let zoom = -e.deltaY * 0.003; // más rápido
  let mx = (e.clientX - offsetX) / scale;
  let my = (e.clientY - offsetY) / scale;
  scale += zoom;
  scale = Math.min(Math.max(0.2, scale), 5);
  offsetX = e.clientX - mx*scale;
  offsetY = e.clientY - my*scale;
});

// Doble clic para editar nombre de sol
canvas.addEventListener('dblclick', e => {
  const x = (e.clientX - offsetX) / scale;
  const y = (e.clientY - offsetY) / scale;

  for (let sun of suns) {
    const dx = x - sun.x, dy = y - sun.y;
    if (Math.sqrt(dx*dx + dy*dy) < sun.r) {
      const input = document.createElement('input');
      input.value = sun.name;
      input.style.position = 'absolute';
      input.style.left = `${sun.x*scale + offsetX}px`;
      input.style.top = `${sun.y*scale + offsetY}px`;
      input.style.fontSize = '16px';
      document.body.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => { sun.name = input.value; input.remove(); });
      input.addEventListener('keydown', ev => { if(ev.key==='Enter'){ sun.name = input.value; input.remove(); } });
      break;
    }
  }
});

// Selección y arrastre de elementos
canvas.addEventListener('mousedown', e => {
  const x = (e.clientX - offsetX) / scale;
  const y = (e.clientY - offsetY) / scale;
  draggingCanvas = true;
  lastMouse.x = e.clientX;
  lastMouse.y = e.clientY;

  selectedElement = null;

  for(let sun of suns){
    if(Math.hypot(x-sun.x, y-sun.y)<sun.r){ selectedElement = sun; draggingCanvas=false; return; }
  }
  for(let p of planets){
    if(Math.hypot(x-p.x, y-p.y)<p.r){ selectedElement = p; draggingCanvas=false; return; }
  }
});

canvas.addEventListener('mousemove', e => {
  const dx = e.clientX - lastMouse.x;
  const dy = e.clientY - lastMouse.y;

  if(selectedElement){
    selectedElement.x += dx / scale;
    selectedElement.y += dy / scale;
  } else if(draggingCanvas){
    offsetX += dx;
    offsetY += dy;
  }
  lastMouse.x = e.clientX;
  lastMouse.y = e.clientY;
});

canvas.addEventListener('mouseup', e => { selectedElement=null; draggingCanvas=false; });

// Ventana de planetas
canvas.addEventListener('click', e=>{
  const x = (e.clientX - offsetX) / scale;
  const y = (e.clientY - offsetY) / scale;
  let clickedPlanet = planets.find(p => Math.hypot(x-p.x, y-p.y)<p.r);

  if(clickedPlanet){
    planetPopup.classList.remove('hidden');
    planetNameInput.value = clickedPlanet.name;
    planetNameInput.onblur = ()=>{ clickedPlanet.name = planetNameInput.value; planetPopup.classList.add('hidden'); };
    planetNameInput.focus();
  } else {
    planetPopup.classList.add('hidden');
  }
});

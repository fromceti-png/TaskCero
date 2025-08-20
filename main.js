
const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let scale = 1;
let originX = canvas.width / 2;
let originY = canvas.height / 2;

// Lista de elementos espaciales
const elements = [
  { x: 0, y: 0, type: 'sol' },
  { x: 300, y: 100, type: 'planeta' },
  { x: -200, y: -150, type: 'planeta' },
  { x: 600, y: 400, type: 'sol' },
  { x: -500, y: 300, type: 'planeta' },
];

function draw() {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, originX, originY);
  ctx.clearRect(-originX / scale, -originY / scale, canvas.width / scale, canvas.height / scale);

  ctx.fillStyle = 'black';
  ctx.fillRect(-originX / scale, -originY / scale, canvas.width / scale, canvas.height / scale);

  for (const elem of elements) {
    if (elem.type === 'sol') {
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(elem.x, elem.y, 40, 0, 2 * Math.PI);
      ctx.fill();
    } else if (elem.type === 'planeta') {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(elem.x, elem.y, 20, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  ctx.restore();
}

draw();

canvas.addEventListener('wheel', function (e) {
  e.preventDefault();
  const zoom = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= zoom;
  draw();
});

let dragging = false;
let lastX, lastY;

canvas.addEventListener('mousedown', function (e) {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener('mousemove', function (e) {
  if (dragging) {
    originX += e.clientX - lastX;
    originY += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    draw();
  }
});

canvas.addEventListener('mouseup', function () {
  dragging = false;
});

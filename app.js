
const canvas = document.getElementById("cosmos");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = []; // soles y planetas
let dragging = false;
let dragStart = null;
let isDraggingSelectionBox = false;
let selectionBox = null;

function createObject(x, y, type = "sol") {
  const color = type === "sol" ? "yellow" : "lightblue";
  const size = type === "sol" ? 30 : 15;
  objects.push({ x, y, size, color, type, name: type.toUpperCase(), selected: false });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const obj of objects) {
    ctx.beginPath();
    ctx.fillStyle = obj.selected ? "white" : obj.color;
    ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(obj.name || "", obj.x, obj.y - obj.size - 5);
  }

  if (selectionBox) {
    const { x, y, w, h } = selectionBox;
    ctx.strokeStyle = "white";
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
  }
}

function isInside(obj, x, y) {
  const dx = obj.x - x;
  const dy = obj.y - y;
  return Math.sqrt(dx * dx + dy * dy) <= obj.size;
}

canvas.addEventListener("mousedown", (e) => {
  dragStart = { x: e.clientX, y: e.clientY };
  dragging = true;
  selectionBox = { x: e.clientX, y: e.clientY, w: 0, h: 0 };
});

canvas.addEventListener("mousemove", (e) => {
  if (dragging && selectionBox) {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    selectionBox.w = dx;
    selectionBox.h = dy;
    draw();
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (selectionBox) {
    const { x, y, w, h } = selectionBox;
    const x1 = Math.min(x, x + w);
    const y1 = Math.min(y, y + h);
    const x2 = Math.max(x, x + w);
    const y2 = Math.max(y, y + h);
    for (let obj of objects) {
      if (obj.x >= x1 && obj.x <= x2 && obj.y >= y1 && obj.y <= y2) {
        obj.selected = true;
      } else {
        obj.selected = false;
      }
    }
  }
  selectionBox = null;
  dragging = false;
  draw();
});

canvas.addEventListener("dblclick", (e) => {
  const clickX = e.clientX;
  const clickY = e.clientY;
  createObject(clickX, clickY, Math.random() > 0.5 ? "sol" : "planeta");
  draw();
});

// Animación inicial
draw();

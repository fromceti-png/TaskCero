
const canvas = document.getElementById("cosmos");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [];
let dragging = false;
let offsetX = 0;
let offsetY = 0;
let lastX = 0;
let lastY = 0;

let selectionMode = false;
let selectionStart = null;
let selectionBox = null;

function addObject(type) {
  const x = canvas.width / 2 + Math.random() * 200 - 100;
  const y = canvas.height / 2 + Math.random() * 200 - 100;
  const color = type === "sol" ? "orange" : "skyblue";
  const size = type === "sol" ? 50 : 20;
  const name = type === "sol" ? "Nuevo Proyecto" : "Nueva Tarea";
  objects.push({ x, y, size, color, name, type, selected: false });
  draw();
}

function toggleSelectionMode() {
  selectionMode = !selectionMode;
  if (selectionMode) {
    canvas.style.cursor = "crosshair";
  } else {
    canvas.style.cursor = "default";
    selectionBox = null;
    draw();
  }
}

canvas.addEventListener("mousedown", (e) => {
  lastX = e.clientX;
  lastY = e.clientY;

  if (selectionMode) {
    selectionStart = { x: e.clientX, y: e.clientY };
    selectionBox = { x: e.clientX, y: e.clientY, width: 0, height: 0 };
  } else {
    dragging = true;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (dragging && !selectionMode) {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    objects.forEach(obj => {
      if (obj.selected) {
        obj.x += dx;
        obj.y += dy;
      }
    });
    lastX = e.clientX;
    lastY = e.clientY;
    draw();
  }

  if (selectionMode && selectionStart) {
    selectionBox.width = e.clientX - selectionStart.x;
    selectionBox.height = e.clientY - selectionStart.y;
    draw();
  }
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
  if (selectionBox) {
    const x1 = selectionBox.x;
    const y1 = selectionBox.y;
    const x2 = x1 + selectionBox.width;
    const y2 = y1 + selectionBox.height;

    objects.forEach(obj => {
      const inside = obj.x > Math.min(x1, x2) && obj.x < Math.max(x1, x2) &&
                     obj.y > Math.min(y1, y2) && obj.y < Math.max(y1, y2);
      obj.selected = inside;
    });

    selectionBox = null;
    selectionStart = null;
    draw();
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let obj of objects) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
    ctx.fillStyle = obj.color;
    ctx.fill();

    if (obj.selected) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "white";
      ctx.stroke();
    }

    ctx.fillStyle = "white";
    ctx.font = "14px sans-serif";
    ctx.fillText(obj.name, obj.x - obj.size, obj.y - obj.size - 10);
  }

  if (selectionBox) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.setLineDash([6]);
    ctx.strokeRect(
      selectionBox.x,
      selectionBox.y,
      selectionBox.width,
      selectionBox.height
    );
    ctx.setLineDash([]);
  }
}

draw();

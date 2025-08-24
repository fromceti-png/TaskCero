const canvas = document.getElementById("cosmos");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [
  { x: 200, y: 200, size: 30, color: "tomato", name: "Proyecto 1", type: "sol" },
  { x: 400, y: 300, size: 20, color: "lightblue", name: "Tarea A", type: "planeta" },
];

let draggingObject = null;
let offsetX = 0;
let offsetY = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const obj of objects) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
    ctx.fillStyle = obj.color;
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(obj.name, obj.x, obj.y - obj.size - 5);
  }
}

canvas.addEventListener("mousedown", (e) => {
  const mx = e.clientX;
  const my = e.clientY;
  for (const obj of objects) {
    const dx = mx - obj.x;
    const dy = my - obj.y;
    if (Math.sqrt(dx * dx + dy * dy) < obj.size) {
      draggingObject = obj;
      offsetX = dx;
      offsetY = dy;
      return;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (draggingObject) {
    draggingObject.x = e.clientX - offsetX;
    draggingObject.y = e.clientY - offsetY;
    draw();
  }
});

canvas.addEventListener("mouseup", () => {
  draggingObject = null;
});

canvas.addEventListener("dblclick", (e) => {
  const mx = e.clientX;
  const my = e.clientY;
  for (const obj of objects) {
    const dx = mx - obj.x;
    const dy = my - obj.y;
    if (Math.sqrt(dx * dx + dy * dy) < obj.size) {
      const newName = prompt("Nuevo nombre:", obj.name);
      if (newName) obj.name = newName;
      draw();
      return;
    }
  }
});

draw();

const canvas = document.getElementById("cosmos");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;

function draw() {
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(200, 200, 20, 0, Math.PI * 2);
  ctx.fill();
}

canvas.addEventListener("wheel", e => {
  const zoom = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= zoom;
  draw();
});

canvas.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

canvas.addEventListener("mousemove", e => {
  if (isDragging) {
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    draw();
  }
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

draw();

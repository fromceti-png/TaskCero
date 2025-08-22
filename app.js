
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let offsetX = 0, offsetY = 0;
let zoom = 1;
let isDraggingCanvas = false;
let startDragX, startDragY;

let isDraggingElement = false;
let selectedElement = null;
let elements = [
  {type: 'sol', x: 200, y: 200, radius: 40, color: 'tomato', name: 'Proyecto 1', selected: false},
  {type: 'sol', x: 600, y: 300, radius: 50, color: 'yellow', name: 'Proyecto 2', selected: false},
  {type: 'planeta', x: 250, y: 250, radius: 20, color: 'lightblue', name: 'Tarea 1', selected: false},
  {type: 'planeta', x: 650, y: 350, radius: 25, color: 'lightgreen', name: 'Tarea 2', selected: false}
];

const editInput = document.createElement('input');
editInput.className = 'edit-input';
editInput.style.display = 'none';
document.body.appendChild(editInput);

let multiSelectMode = false;
let selectionStart = null;
let selectionBox = null;

document.getElementById("multiSelectBtn").onclick = () => {
  multiSelectMode = true;
  alert("Haz clic y arrastra para seleccionar múltiples elementos.");
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);

  elements.forEach(el => {
    ctx.beginPath();
    ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
    ctx.fillStyle = el.selected ? "white" : el.color;
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(el.name, el.x, el.y - el.radius - 5);
  });

  if (selectionBox) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1 / zoom;
    ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.w, selectionBox.h);
  }

  ctx.restore();
  requestAnimationFrame(draw);
}
draw();

function showEditInput(el, clientX, clientY){
  editInput.style.display = 'block';
  editInput.value = el.name;
  editInput.style.left = `${clientX + 5}px`;
  editInput.style.top = `${clientY + 5}px`;
  editInput.focus();

  function saveName() {
    el.name = editInput.value;
    editInput.style.display = 'none';
    document.removeEventListener('click', outsideClick);
  }

  function outsideClick(e){
    if(e.target !== editInput){
      saveName();
    }
  }

  editInput.onkeydown = (e) => {
    if(e.key === 'Enter'){
      saveName();
    }
  }

  document.addEventListener('click', outsideClick);
}

canvas.addEventListener('mousedown', (e) => {
  const x = (e.clientX - offsetX) / zoom;
  const y = (e.clientY - offsetY) / zoom;

  if (multiSelectMode) {
    selectionStart = {x, y};
    selectionBox = {x, y, w: 0, h: 0};
  } else {
    selectedElement = elements.find(el => Math.hypot(el.x - x, el.y - y) < el.radius);
    if (selectedElement) {
      isDraggingElement = true;
    } else {
      isDraggingCanvas = true;
      startDragX = e.clientX - offsetX;
      startDragY = e.clientY - offsetY;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  const x = (e.clientX - offsetX) / zoom;
  const y = (e.clientY - offsetY) / zoom;

  if (isDraggingElement && selectedElement) {
    selectedElement.x = x;
    selectedElement.y = y;
  } else if (isDraggingCanvas) {
    offsetX = e.clientX - startDragX;
    offsetY = e.clientY - startDragY;
  } else if (selectionStart && selectionBox) {
    selectionBox.w = x - selectionStart.x;
    selectionBox.h = y - selectionStart.y;
  }
});

canvas.addEventListener('mouseup', () => {
  isDraggingElement = false;
  isDraggingCanvas = false;
  selectedElement = null;

  if (selectionBox) {
    const x0 = Math.min(selectionBox.x, selectionBox.x + selectionBox.w);
    const y0 = Math.min(selectionBox.y, selectionBox.y + selectionBox.h);
    const x1 = Math.max(selectionBox.x, selectionBox.x + selectionBox.w);
    const y1 = Math.max(selectionBox.y, selectionBox.y + selectionBox.h);
    elements.forEach(el => {
      const inside = el.x > x0 && el.x < x1 && el.y > y0 && el.y < y1;
      el.selected = inside;
    });
    multiSelectMode = false;
    selectionBox = null;
    selectionStart = null;
  }
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoom *= e.deltaY > 0 ? 0.95 : 1.05;
});

canvas.addEventListener('dblclick', (e) => {
  const x = (e.clientX - offsetX) / zoom;
  const y = (e.clientY - offsetY) / zoom;
  const el = elements.find(el => Math.hypot(el.x - x, el.y - y) < el.radius);
  if (el) {
    showEditInput(el, e.clientX, e.clientY);
  }
});

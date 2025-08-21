const canvas = document.getElementById('taskCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ventanas
const editSunName = document.getElementById('editSunName');
const planetWindow = document.getElementById('planetWindow');
const controlsPanel = document.getElementById('controlsPanel');
const sizeSlider = document.getElementById('sizeSlider');
const colorPicker = document.getElementById('colorPicker');

let objects = JSON.parse(localStorage.getItem('taskObjects')) || [];
let selectedObjects = [];
let isDraggingCanvas = false;
let dragOffset = {x:0, y:0};
let canvasOffset = {x:0, y:0};

let selectionBox = null;

// --- Clase genérica ---
class CelestialObject {
  constructor(x, y, type, name="Nuevo", color="#fff", size=50){
    this.x = x;
    this.y = y;
    this.type = type; // 'sol' o 'planeta'
    this.name = name;
    this.color = color;
    this.size = size;
    this.selected = false;
  }
}

// --- Funciones ---
function saveObjects() {
  localStorage.setItem('taskObjects', JSON.stringify(objects));
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Dibujar objetos
  objects.forEach(obj => {
    ctx.beginPath();
    ctx.arc(obj.x + canvasOffset.x, obj.y + canvasOffset.y, obj.size/2, 0, Math.PI*2);
    ctx.fillStyle = obj.color;
    ctx.fill();
    if(obj.selected) ctx.strokeStyle = "#fff";
    else ctx.strokeStyle = "transparent";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Nombre visible
    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.fillText(obj.name, obj.x + canvasOffset.x + obj.size/2 + 5, obj.y + canvasOffset.y);
  });

  // Dibujar marco de selección
  if(selectionBox){
    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 1;
    ctx.setLineDash([5,3]);
    ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.w, selectionBox.h);
    ctx.setLineDash([]);
  }
}

function getObjectAt(x,y){
  return objects.find(obj=>{
    const dx = (obj.x + canvasOffset.x) - x;
    const dy = (obj.y + canvasOffset.y) - y;
    return Math.sqrt(dx*dx + dy*dy) < obj.size/2;
  });
}

// --- Eventos ---
canvas.addEventListener('mousedown', e=>{
  const x = e.clientX;
  const y = e.clientY;
  const obj = getObjectAt(x,y);
  
  if(obj){
    if(!obj.selected){
      selectedObjects = [obj];
      objects.forEach(o=>o.selected = (o===obj));
    }
  } else {
    isDraggingCanvas = true;
    dragOffset.x = x;
    dragOffset.y = y;
  }

  selectionBox = {x:x, y:y, w:0, h:0};
});

canvas.addEventListener('mousemove', e=>{
  const x = e.clientX;
  const y = e.clientY;

  if(isDraggingCanvas){
    canvasOffset.x += x - dragOffset.x;
    canvasOffset.y += y - dragOffset.y;
    dragOffset.x = x;
    dragOffset.y = y;
  }

  if(selectionBox){
    selectionBox.w = x - selectionBox.x;
    selectionBox.h = y - selectionBox.y;

    // Selección múltiple
    objects.forEach(o=>{
      const cx = o.x + canvasOffset.x;
      const cy = o.y + canvasOffset.y;
      if(cx > Math.min(selectionBox.x, selectionBox.x+selectionBox.w) &&
         cx < Math.max(selectionBox.x, selectionBox.x+selectionBox.w) &&
         cy > Math.min(selectionBox.y, selectionBox.y+selectionBox.h) &&
         cy < Math.max(selectionBox.y, selectionBox.y+selectionBox.h)) o.selected = true;
      else o.selected = false;
    });
  }

  draw();
});

canvas.addEventListener('mouseup', e=>{
  selectionBox = null;
  isDraggingCanvas = false;
  selectedObjects = objects.filter(o=>o.selected);
  draw();
});

// Doble click para editar nombre de sol
canvas.addEventListener('dblclick', e=>{
  const x = e.clientX;
  const y = e.clientY;
  const obj = getObjectAt(x,y);

  if(obj){
    // Editar nombre
    editSunName.style.left = (obj.x + canvasOffset.x) + "px";
    editSunName.style.top = (obj.y + canvasOffset.y) + "px";
    editSunName.innerText = obj.name;
    editSunName.style.display = "block";
    editSunName.focus();

    function saveName(){
      obj.name = editSunName.innerText;
      editSunName.style.display = "none";
      saveObjects();
      draw();
      document.removeEventListener('click', clickOutside);
    }

    function clickOutside(ev){
      if(ev.target !== editSunName){
        saveName();
      }
    }

    editSunName.onkeydown = function(event){
      if(event.key === "Enter"){
        saveName();
      }
    }

    document.addEventListener('click', clickOutside);
  } else {
    // Doble click en canvas para crear nuevo
    const type = prompt("Tipo de objeto: sol o planeta","sol");
    if(type==="sol" || type==="planeta"){
      const newObj = new CelestialObject(x - canvasOffset.x, y - canvasOffset.y, type, type==="sol"?"Nuevo Proyecto":"Nueva Tarea", type==="sol"?"#ff0000":"#00f", 50);
      objects.push(newObj);
      saveObjects();
      draw();
    }
  }
});

// Click para mostrar ventana de planeta
canvas.addEventListener('click', e=>{
  const x = e.clientX;
  const y = e.clientY;
  const obj = getObjectAt(x,y);
  if(obj && obj.type==="planeta"){
    planetWindow.style.left = (obj.x + canvasOffset.x + 20) + "px";
    planetWindow.style.top = (obj.y + canvasOffset.y + 20) + "px";
    planetWindow.innerText = obj.name;
    planetWindow.style.display = "block";
  } else {
    planetWindow.style.display = "none";
  }
});

// Zoom
canvas.addEventListener('wheel', e=>{
  const delta = e.deltaY * -0.01;
  objects.forEach(o=>{
    o.size += delta*5;
    if(o.size<10) o.size=10;
    if(o.size>200) o.size=200;
  });
  draw();
});

// Cambios de tamaño y color
sizeSlider.addEventListener('input', ()=>{
  selectedObjects.forEach(o=>o.size = parseInt(sizeSlider.value));
  draw();
});

colorPicker.addEventListener('input', ()=>{
  selectedObjects.forEach(o=>o.color = colorPicker.value);
  draw();
});

// Mostrar panel si hay selección
canvas.addEventListener('click', ()=>{
  if(selectedObjects.length>0){
    controlsPanel.style.display = "block";
    sizeSlider.value = selectedObjects[0].size;
    colorPicker.value = selectedObjects[0].color;
  } else controlsPanel.style.display = "none";
});

// Redibujar
draw();

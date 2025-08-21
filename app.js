const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Controles
const solEdit = document.getElementById('solEdit');
const solNameInput = document.getElementById('solNameInput');
const planetWindow = document.getElementById('planetWindow');
const sizeSlider = document.getElementById('sizeSlider');
const colorPicker = document.getElementById('colorPicker');
const typeMenu = document.getElementById('typeMenu');

let objects = JSON.parse(localStorage.getItem('taskCeroObjects')) || [];
let selectedObjects = [];
let isDraggingCanvas = false;
let canvasOffset = {x:0, y:0};
let lastMousePos = {x:0, y:0};
let selectionBox = null;

// Zoom
let scale = 1;

// --- Funciones ---
function redrawCanvas() {
    ctx.setTransform(1,0,0,1,0,0); // reset
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.translate(canvasOffset.x, canvasOffset.y);
    ctx.scale(scale, scale);

    objects.forEach(obj => {
        ctx.beginPath();
        ctx.fillStyle = obj.color;
        ctx.arc(obj.x, obj.y, obj.size, 0, 2*Math.PI);
        ctx.fill();

        if(obj.name) {
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "#fff";
            ctx.fillText(obj.name, obj.x + obj.size + 5, obj.y);
        }

        if(obj.selected) {
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    // Selección múltiple
    if(selectionBox) {
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.setLineDash([5,5]);
        ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
        ctx.setLineDash([]);
    }
}

// --- Eventos ---
canvas.addEventListener('mousedown', e => {
    lastMousePos = {x: e.clientX, y: e.clientY};

    // Drag selección múltiple
    if(e.shiftKey){
        selectionBox = {x:e.clientX - canvasOffset.x, y:e.clientY - canvasOffset.y, width:0, height:0};
    } else {
        // Verificar si clic en objeto
        const obj = objects.find(o => Math.hypot((o.x + canvasOffset.x - e.clientX), (o.y + canvasOffset.y - e.clientY)) < o.size);
        if(obj) {
            if(!obj.selected){
                selectedObjects = [obj];
                objects.forEach(o => o.selected = o === obj);
            }
        } else {
            isDraggingCanvas = true;
            selectedObjects = [];
            objects.forEach(o => o.selected = false);
        }
    }
});

canvas.addEventListener('mousemove', e => {
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    lastMousePos = {x:e.clientX, y:e.clientY};

    if(isDraggingCanvas) {
        canvasOffset.x += dx;
        canvasOffset.y += dy;
    }

    if(selectionBox){
        selectionBox.width += dx;
        selectionBox.height += dy;

        objects.forEach(o => {
            if(o.x >= selectionBox.x && o.x <= selectionBox.x + selectionBox.width &&
               o.y >= selectionBox.y && o.y <= selectionBox.y + selectionBox.height){
                o.selected = true;
            }
        });
    }

    // Mover objetos seleccionados
    if(selectedObjects.length && !isDraggingCanvas && !selectionBox){
        selectedObjects.forEach(o => {
            o.x += dx/scale;
            o.y += dy/scale;
        });
    }

    redrawCanvas();
});

canvas.addEventListener('mouseup', e => {
    isDraggingCanvas = false;
    selectionBox = null;
    saveObjects();
    redrawCanvas();
});

canvas.addEventListener('dblclick', e => {
    const pos = {x: (e.clientX - canvasOffset.x)/scale, y: (e.clientY - canvasOffset.y)/scale};
    // Verificar si doble clic en sol
    const sol = objects.find(o => o.type==='sol' && Math.hypot(o.x - pos.x, o.y - pos.y) < o.size);
    if(sol){
        solEdit.style.display = 'block';
        solEdit.style.left = (sol.x + canvasOffset.x) + 'px';
        solEdit.style.top = (sol.y + canvasOffset.y) + 'px';
        solNameInput.value = sol.name || '';
        solNameInput.focus();

        solNameInput.onkeydown = e => {
            if(e.key === 'Enter'){
                sol.name = solNameInput.value;
                solEdit.style.display='none';
                saveObjects();
                redrawCanvas();
            }
        };

        solNameInput.onblur = () => {
            sol.name = solNameInput.value;
            solEdit.style.display='none';
            saveObjects();
            redrawCanvas();
        };
        return;
    }

    // Doble clic en canvas para crear nuevo objeto
    typeMenu.style.left = e.clientX + 'px';
    typeMenu.style.top = e.clientY + 'px';
    typeMenu.style.display='block';
    window.newObjectPos = pos;
});

// --- Crear nuevo objeto ---
function createObject(type){
    const pos = window.newObjectPos;
    const obj = {
        x: pos.x,
        y: pos.y,
        type: type,
        color: type==='sol' ? 'tomato' : 'blue',
        size: type==='sol' ? 40 : 20,
        name: type==='sol' ? 'Nuevo Sol' : 'Nueva Tarea',
        selected:false
    };
    objects.push(obj);
    typeMenu.style.display='none';
    saveObjects();
    redrawCanvas();
}

// --- Zoom con rueda ---
canvas.addEventListener('wheel', e=>{
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= delta;
    redrawCanvas();
});

// --- Persistencia ---
function saveObjects(){
    localStorage.setItem('taskCeroObjects', JSON.stringify(objects));
}

// --- Inicializar ---
redrawCanvas();

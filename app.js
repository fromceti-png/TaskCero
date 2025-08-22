const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let offsetX = 0, offsetY = 0;
let zoom = 1;
let isDraggingCanvas = false;
let startDragX, startDragY;

let elements = [
    {type: 'sol', x: 200, y: 200, radius: 40, color: 'tomato', name: 'Proyecto 1'},
    {type: 'sol', x: 600, y: 300, radius: 50, color: 'yellow', name: 'Proyecto 2'},
    {type: 'planeta', x: 250, y: 250, radius: 20, color: 'lightblue', name: 'Tarea 1'},
    {type: 'planeta', x: 650, y: 350, radius: 25, color: 'lightgreen', name: 'Tarea 2'}
];

let selectedElement = null;
let isDraggingElement = false;

const editInput = document.createElement('input');
editInput.className = 'edit-input';
editInput.style.display = 'none';
document.body.appendChild(editInput);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(zoom, zoom);

    elements.forEach(el => {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.fillStyle = el.color;
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(el.name, el.x, el.y - el.radius - 5);
    });

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
    selectedElement = elements.find(el => Math.hypot(el.x - x, el.y - y) < el.radius);

    if(selectedElement){
        isDraggingElement = true;
    } else {
        isDraggingCanvas = true;
        startDragX = e.clientX - offsetX;
        startDragY = e.clientY - offsetY;
    }
});

canvas.addEventListener('mousemove', (e) => {
    const x = (e.clientX - offsetX) / zoom;
    const y = (e.clientY - offsetY) / zoom;
    if(isDraggingElement && selectedElement){
        selectedElement.x = x;
        selectedElement.y = y;
    } else if(isDraggingCanvas){
        offsetX = e.clientX - startDragX;
        offsetY = e.clientY - startDragY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDraggingElement = false;
    isDraggingCanvas = false;
    selectedElement = null;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoom *= e.deltaY > 0 ? 0.95 : 1.05;
});

canvas.addEventListener('dblclick', (e) => {
    const x = (e.clientX - offsetX) / zoom;
    const y = (e.clientY - offsetY) / zoom;
    const el = elements.find(el => Math.hypot(el.x - x, el.y - y) < el.radius);
    if(el){
        showEditInput(el, e.clientX, e.clientY);
    }
});

function createElementAt(type) {
    const x = (canvas.width / 2 - offsetX) / zoom;
    const y = (canvas.height / 2 - offsetY) / zoom;
    const radius = type === 'sol' ? 40 : 20;
    const color = type === 'sol' ? 'tomato' : 'lightblue';
    const name = type === 'sol' ? 'Nuevo Proyecto' : 'Nueva Tarea';
    elements.push({type, x, y, radius, color, name});
}

function activateSelectionMode() {
    alert("Modo de selección múltiple no implementado aún.");
}


const canvas = document.getElementById('cosmosCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [];
let selectionBox = null;
let isDragging = false;
let startX = 0, startY = 0;

// Dibujar objetos y selección
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
        ctx.fillStyle = obj.selected ? 'white' : obj.color;
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        ctx.fillText(obj.name || '', obj.x + obj.size + 4, obj.y);
    });

    if (selectionBox) {
        const { x, y, w, h } = selectionBox;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.strokeRect(x, y, w, h);
    }
}

// Evento para doble click y agregar objeto
canvas.addEventListener('dblclick', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const type = prompt("¿Crear Sol (s) o Planeta (p)?", "s");
    if (!type) return;
    const obj = {
        x,
        y,
        size: type === 's' ? 30 : 15,
        color: type === 's' ? 'tomato' : 'skyblue',
        name: type === 's' ? 'Nuevo Sol' : 'Nueva Tarea',
        selected: false,
    };
    objects.push(obj);
    draw();
});

// Eventos de selección múltiple
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox = { x: startX, y: startY, w: 0, h: 0 };
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currX = e.clientX;
    const currY = e.clientY;
    selectionBox.w = currX - startX;
    selectionBox.h = currY - startY;
    draw();
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    if (selectionBox) {
        const { x, y, w, h } = selectionBox;
        const x1 = Math.min(x, x + w), x2 = Math.max(x, x + w);
        const y1 = Math.min(y, y + h), y2 = Math.max(y, y + h);
        objects.forEach(obj => {
            obj.selected = obj.x >= x1 && obj.x <= x2 && obj.y >= y1 && obj.y <= y2;
        });
        selectionBox = null;
        draw();
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

draw();

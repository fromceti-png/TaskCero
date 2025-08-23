const canvas = document.getElementById('cosmos');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [];
let isDragging = false;
let offsetX, offsetY;
let isSelecting = false;
let selectionStart = null;
let selectionBox = null;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let obj of objects) {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
        ctx.fillStyle = obj.selected ? "white" : obj.color;
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "#ccc";
        ctx.fillText(obj.name, obj.x + obj.size + 4, obj.y + 4);
    }
    requestAnimationFrame(draw);
}
draw();

function createObject(type) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = type === 'sun' ? 30 : 15;
    const color = type === 'sun' ? 'orange' : 'skyblue';
    objects.push({ x, y, size, color, name: type === 'sun' ? 'Nuevo Proyecto' : 'Nueva Tarea', selected: false });
}

document.getElementById('addSun').onclick = () => createObject('sun');
document.getElementById('addPlanet').onclick = () => createObject('planet');

document.getElementById('toggleSelect').onclick = () => {
    isSelecting = true;
};

canvas.addEventListener('mousedown', e => {
    if (isSelecting) {
        selectionStart = { x: e.clientX, y: e.clientY };
        selectionBox = document.createElement('div');
        selectionBox.className = 'selection-box';
        document.body.appendChild(selectionBox);
    }
});

canvas.addEventListener('mousemove', e => {
    if (selectionStart) {
        const x = Math.min(e.clientX, selectionStart.x);
        const y = Math.min(e.clientY, selectionStart.y);
        const w = Math.abs(e.clientX - selectionStart.x);
        const h = Math.abs(e.clientY - selectionStart.y);
        Object.assign(selectionBox.style, {
            left: x + 'px',
            top: y + 'px',
            width: w + 'px',
            height: h + 'px'
        });
    }
});

canvas.addEventListener('mouseup', e => {
    if (selectionBox) {
        const rect = selectionBox.getBoundingClientRect();
        objects.forEach(obj => {
            obj.selected = (
                obj.x > rect.left &&
                obj.x < rect.right &&
                obj.y > rect.top &&
                obj.y < rect.bottom
            );
        });
        document.body.removeChild(selectionBox);
        selectionBox = null;
        selectionStart = null;
        isSelecting = false;
    }
});

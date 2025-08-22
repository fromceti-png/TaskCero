
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let offsetX = 0, offsetY = 0;
let zoom = 1;
let isDraggingCanvas = false;
let startDragX, startDragY;
let isMultiSelectMode = false;
let isDraggingSelection = false;
let dragStartX, dragStartY;
let selectionRect = null;

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

document.getElementById('toggle-multi-select').onclick = () => {
    isMultiSelectMode = !isMultiSelectMode;
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(zoom, zoom);

    elements.forEach(el => {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.fillStyle = el.selected ? 'white' : el.color;
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(el.name, el.x, el.y - el.radius - 5);
    });

    if (selectionRect) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.setLineDash([6]);
        ctx.strokeRect(selectionRect.x, selectionRect.y, selectionRect.w, selectionRect.h);
        ctx.setLineDash([]);
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

    if (isMultiSelectMode) {
        dragStartX = x;
        dragStartY = y;
        selectionRect = { x, y, w: 0, h: 0 };
    } else {
        const hit = elements.find(el => Math.hypot(el.x - x, el.y - y) < el.radius);
        if (hit && hit.selected) {
            isDraggingSelection = true;
            dragStartX = x;
            dragStartY = y;
        } else if (hit) {
            elements.forEach(el => el.selected = false);
            hit.selected = true;
            isDraggingSelection = true;
            dragStartX = x;
            dragStartY = y;
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

    if (isDraggingCanvas) {
        offsetX = e.clientX - startDragX;
        offsetY = e.clientY - startDragY;
    } else if (selectionRect) {
        selectionRect.w = x - dragStartX;
        selectionRect.h = y - dragStartY;

        elements.forEach(el => {
            el.selected = (
                el.x > Math.min(dragStartX, x) &&
                el.x < Math.max(dragStartX, x) &&
                el.y > Math.min(dragStartY, y) &&
                el.y < Math.max(dragStartY, y)
            );
        });
    } else if (isDraggingSelection) {
        const dx = x - dragStartX;
        const dy = y - dragStartY;
        elements.forEach(el => {
            if (el.selected) {
                el.x += dx;
                el.y += dy;
            }
        });
        dragStartX = x;
        dragStartY = y;
    }
});

canvas.addEventListener('mouseup', () => {
    isDraggingCanvas = false;
    isDraggingSelection = false;
    selectionRect = null;
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

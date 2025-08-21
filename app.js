const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStart = {x: 0, y: 0};
let selected = null;

// Soles y planetas
const suns = [
    {x: 300, y: 300, radius: 40, color: 'tomato', name: 'Proyecto 1'},
    {x: 800, y: 500, radius: 40, color: 'yellow', name: 'Proyecto 2'}
];

const planets = [
    {x: 300, y: 400, radius: 20, color: 'cyan', name: 'Tarea 1'},
    {x: 350, y: 450, radius: 20, color: 'magenta', name: 'Tarea 2'},
    {x: 800, y: 600, radius: 20, color: 'lime', name: 'Tarea 3'}
];

const planetModal = document.getElementById('planetModal');
const taskNameInput = document.getElementById('taskName');

// Dibuja todo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(zoom, zoom);

    // Dibujar soles
    suns.forEach(sun => {
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
        ctx.fillStyle = sun.color;
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(sun.name, sun.x, sun.y - sun.radius - 10);
    });

    // Dibujar planetas
    planets.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.closePath();
    });

    ctx.restore();
    requestAnimationFrame(draw);
}

// Zoom
canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const zoomAmount = 1.1;
    const mouseX = (e.clientX - offsetX) / zoom;
    const mouseY = (e.clientY - offsetY) / zoom;
    
    if(e.deltaY < 0){
        zoom *= zoomAmount;
    } else {
        zoom /= zoomAmount;
    }

    offsetX = e.clientX - mouseX * zoom;
    offsetY = e.clientY - mouseY * zoom;
});

// Drag del canvas
canvas.addEventListener('mousedown', e => {
    isDragging = true;
    dragStart.x = e.clientX - offsetX;
    dragStart.y = e.clientY - offsetY;
});

canvas.addEventListener('mousemove', e => {
    if(isDragging){
        offsetX = e.clientX - dragStart.x;
        offsetY = e.clientY - dragStart.y;
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Selección de soles para renombrar
canvas.addEventListener('dblclick', e => {
    const x = (e.clientX - offsetX) / zoom;
    const y = (e.clientY - offsetY) / zoom;

    suns.forEach(sun => {
        const dist = Math.hypot(sun.x - x, sun.y - y);
        if(dist < sun.radius){
            const newName = prompt('Nombre del proyecto:', sun.name);
            if(newName) sun.name = newName;
        }
    });

    planets.forEach(p => {
        const dist = Math.hypot(p.x - x, p.y - y);
        if(dist < p.radius){
            planetModal.style.display = 'flex';
            taskNameInput.value = p.name;
            taskNameInput.focus();
            selected = p;
        }
    });
});

// Cerrar ventana de planeta con clic en canvas
canvas.addEventListener('click', () => {
    if(planetModal.style.display === 'flex'){
        if(selected) selected.name = taskNameInput.value;
        planetModal.style.display = 'none';
        selected = null;
    }
});

draw();

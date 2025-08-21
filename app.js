// ================================
// TaskCero App.js
// ================================

// Canvas y contexto
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables de control
let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let selectedElement = null;

// Datos de soles y planetas
let suns = [
    { x: 400, y: 300, radius: 50, color: '#FF6347', name: 'Proyecto 1' },
    { x: 800, y: 500, radius: 50, color: '#FFD700', name: 'Proyecto 2' }
];

let planets = [
    { x: 450, y: 350, radius: 20, sunIndex: 0, name: 'Tarea A' },
    { x: 750, y: 550, radius: 20, sunIndex: 1, name: 'Tarea B' },
    { x: 850, y: 580, radius: 20, sunIndex: 1, name: 'Tarea C' }
];

// Ventana de planetas
const planetWindow = document.getElementById('planetWindow');
const planetNameInput = document.getElementById('planetName');

// Color picker para soles
const colorPicker = document.getElementById('colorPicker');
let activeSun = null;

// ================================
// Dibujo del canvas
// ================================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(scale, scale);

    // Dibujar soles
    suns.forEach(sun => {
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
        ctx.fillStyle = sun.color;
        ctx.fill();

        // Nombre del proyecto
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(sun.name, sun.x - sun.radius, sun.y - sun.radius - 10);
    });

    // Dibujar planetas
    planets.forEach(planet => {
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1E90FF';
        ctx.fill();

        // Nombre de la tarea
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText(planet.name, planet.x - planet.radius, planet.y - planet.radius - 10);
    });

    ctx.restore();
    requestAnimationFrame(draw);
}

// ================================
// Eventos de zoom y arrastre
// ================================
canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    const mouseX = (e.clientX - originX) / scale;
    const mouseY = (e.clientY - originY) / scale;

    originX -= mouseX * (zoom - 1) * scale;
    originY -= mouseY * (zoom - 1) * scale;
    scale *= zoom;
});

canvas.addEventListener('mousedown', e => {
    isDragging = true;
    dragStart.x = e.clientX - originX;
    dragStart.y = e.clientY - originY;
});

canvas.addEventListener('mousemove', e => {
    if (isDragging) {
        originX = e.clientX - dragStart.x;
        originY = e.clientY - dragStart.y;
    }
});

canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mouseleave', () => isDragging = false);

// ================================
// Eventos de interacción con elementos
// ================================
canvas.addEventListener('dblclick', e => {
    const mouse = getMouseOnCanvas(e);

    // Verificar si hizo doble clic sobre un sol
    suns.forEach(sun => {
        if (distance(mouse, sun) < sun.radius) {
            activeSun = sun;
            const newName = prompt('Nombre del proyecto:', sun.name);
            if (newName) sun.name = newName;
        }
    });
});

canvas.addEventListener('click', e => {
    const mouse = getMouseOnCanvas(e);

    // Planetas
    let clickedPlanet = null;
    planets.forEach(planet => {
        if (distance(mouse, planet) < planet.radius) clickedPlanet = planet;
    });

    if (clickedPlanet) {
        planetWindow.classList.remove('hidden');
        planetNameInput.value = clickedPlanet.name;
        planetNameInput.oninput = () => clickedPlanet.name = planetNameInput.value;
    } else {
        planetWindow.classList.add('hidden');
    }
});

// ================================
// Utilidades
// ================================
function getMouseOnCanvas(e) {
    return {
        x: (e.clientX - originX) / scale,
        y: (e.clientY - originY) / scale
    };
}

function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// ================================
// Inicialización
// ================================
draw();

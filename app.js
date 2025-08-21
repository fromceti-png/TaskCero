const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Zoom y desplazamiento
let offsetX = 0, offsetY = 0;
let zoom = 1;
let isDraggingCanvas = false;
let startDragX, startDragY;

// Soles (proyectos) y planetas (tareas)
let elements = [
    {type: 'sol', x: 200, y: 200, radius: 40, color: 'tomato', name: 'Proyecto 1'},
    {type: 'sol', x: 600, y: 300, radius: 50, color: 'yellow', name: 'Proyecto 2'},
    {type: 'planeta', x: 250, y: 250, radius: 20, color: 'lightblue', name: 'Tarea 1'},
    {type: 'planeta', x: 650, y: 350, radius: 25, color: 'lightgreen', name: 'Tarea 2'},
    {type: 'planeta', x: 670, y: 320, radius: 20, color: 'lightpink', name: 'Tarea 3'}
];

let selectedElement = null;
let isDraggingElement = false;

// Ventanas
const solInput = document.getElementById("solInput");
const planetWindow = document.getElementById("planetWindow");
const planetNameInput = document.getElementById("planetNameInput");

// Dibujar elementos
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(zoom, zoom);

    elements.forEach(el => {
        // Soles y planetas
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.fillStyle = el.color;
        ctx.fill();
        ctx.closePath();

        // Nombre
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(el.name, el.x, el.y - el.radius - 5);
    });

    ctx.restore();
    requestAnimationFrame(draw);
}
draw();

// Eventos de canvas
canvas.addEventListener('mousedown', (e) => {
    const x = (e.clientX - offsetX) / zoom;
    const y = (e.clientY - offsetY) / zoom;
    selectedElement = elements.find(el => Math.hypot(el.x - x, el.y - y) < el.radius);
    
    if(selectedElement){
        isDraggingElement = true;
        // Si es planeta, mostrar ventana translúcida
        if(selectedElement.type === 'planeta'){
            planetWindow.style.display = 'block';
            planetWindow.style.left = `${e.clientX + 10}px`;
            planetWindow.style.top = `${e.clientY + 10}px`;
            planetNameInput.value = selectedElement.name;
            planetNameInput.focus();
        }
    } else {
        isDraggingCanvas = true;
        startDragX = e.clientX - offsetX;
        startDragY = e.clientY - offsetY;
        planetWindow.style.display = 'none';
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

// Doble click para editar sol
canvas.addEventListener('dblclick', (e) => {
    const x = (e.clientX - offsetX) / zoom;
    const y = (e.clientY - offsetY) / zoom;
    const sol = elements.find(el => el.type === 'sol' && Math.hypot(el.x - x, el.y - y) < el.radius);
    if(sol){
        solInput.style.display = 'block';
        solInput.value = sol.name;
        solInput.style.left = `${sol.x * zoom + offsetX + 10}px`;
        solInput.style.top = `${sol.y * zoom + offsetY + 10}px`;
        solInput.focus();
        solInput.onkeydown = function(event){
            if(event.key === 'Enter'){
                sol.name = solInput.value;
                solInput.style.display = 'none';
            }
        }
    }
});

// Cerrar ventana de planetas al hacer clic fuera
canvas.addEventListener('click', (e) => {
    if(!isDraggingElement && !isDraggingCanvas){
        planetWindow.style.display = 'none';
    }
});

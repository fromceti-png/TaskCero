const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let originX = 0;
let originY = 0;
let scale = 1;
let isDraggingCanvas = false;
let dragStart = { x: 0, y: 0 };
let selectedElement = null;
let elements = [];

// Datos de ejemplo
elements.push({ type: "sol", x: 200, y: 200, radius: 50, color: "tomato", name: "Proyecto A" });
elements.push({ type: "sol", x: 600, y: 300, radius: 50, color: "yellow", name: "Proyecto B" });
elements.push({ type: "planeta", x: 220, y: 300, radius: 20, name: "Tarea 1" });
elements.push({ type: "planeta", x: 650, y: 350, radius: 20, name: "Tarea 2" });

// Variables de edición
let editingText = null;
let planetWindow = null;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(scale, scale);

    elements.forEach(el => {
        // Soles
        if (el.type === "sol") {
            ctx.fillStyle = el.color;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
            ctx.fill();
            // Nombre visible
            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(el.name, el.x, el.y - el.radius - 10);
        }

        // Planetas
        if (el.type === "planeta") {
            ctx.fillStyle = "skyblue";
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(el.name, el.x, el.y - el.radius - 10);
        }
    });

    ctx.restore();

    // Ventana de texto para edición
    if (editingText) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(editingText.x - 50, editingText.y - 15, 100, 30);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(editingText.name, editingText.x, editingText.y + 5);
    }

    // Ventana de planeta
    if (planetWindow) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(planetWindow.name, canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(draw);
}

draw();

// Eventos
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    let zoom = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= zoom;
    scale = Math.min(Math.max(0.1, scale), 5);
});

canvas.addEventListener("mousedown", (e) => {
    const x = (e.offsetX - originX) / scale;
    const y = (e.offsetY - originY) / scale;

    selectedElement = elements.find(el => Math.hypot(el.x - x, el.y - y) < el.radius);
    
    if (selectedElement) {
        selectedElement.offsetX = x - selectedElement.x;
        selectedElement.offsetY = y - selectedElement.y;
        isDraggingCanvas = false;
    } else {
        isDraggingCanvas = true;
        dragStart.x = e.offsetX - originX;
        dragStart.y = e.offsetY - originY;
        planetWindow = null; // cerrar ventana planeta al arrastrar canvas
        editingText = null;  // cerrar edición de texto
    }
});

canvas.addEventListener("mousemove", (e) => {
    const x = (e.offsetX - originX) / scale;
    const y = (e.offsetY - originY) / scale;

    if (selectedElement && e.buttons === 1) {
        selectedElement.x = x - selectedElement.offsetX;
        selectedElement.y = y - selectedElement.offsetY;
    } else if (isDraggingCanvas && e.buttons === 1) {
        originX = e.offsetX - dragStart.x;
        originY = e.offsetY - dragStart.y;
    }
});

canvas.addEventListener("mouseup", () => {
    selectedElement = null;
    isDraggingCanvas = false;
});

canvas.addEventListener("dblclick", (e) => {
    const x = (e.offsetX - originX) / scale;
    const y = (e.offsetY - originY) / scale;
    const sol = elements.find(el => el.type === "sol" && Math.hypot(el.x - x, el.y - y) < el.radius);

    if (sol) {
        editingText = sol;
        setTimeout(() => {
            const newName = prompt("Nombre del proyecto:", sol.name);
            if (newName !== null) sol.name = newName;
            editingText = null;
        }, 10);
    }
});

canvas.addEventListener("click", (e) => {
    const x = (e.offsetX - originX) / scale;
    const y = (e.offsetY - originY) / scale;

    if (!elements.find(el => el.type === "planeta" && Math.hypot(el.x - x, el.y - y) < el.radius)) {
        planetWindow = null; // cerrar ventana planeta
    } else {
        const planet = elements.find(el => el.type === "planeta" && Math.hypot(el.x - x, el.y - y) < el.radius);
        planetWindow = planet;
    }
});

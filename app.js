// Variables para la selección múltiple
let isSelecting = false;
let selectionStart = { x: 0, y: 0 };
let selectionEnd = { x: 0, y: 0 };

// Detectar inicio de selección
canvas.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // solo clic izquierdo
    isSelecting = true;
    selectionStart = getMousePos(e);
    selectionEnd = { ...selectionStart };
});

// Detectar arrastre para actualizar marco
canvas.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;
    selectionEnd = getMousePos(e);
    draw(); // redraw canvas para incluir el marco
});

// Detectar fin de selección
canvas.addEventListener("mouseup", (e) => {
    if (!isSelecting) return;
    isSelecting = false;
    selectObjects();
    draw(); // redraw canvas para quitar el marco
});

// Función para obtener posición del mouse relativa al canvas
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left),
        y: (evt.clientY - rect.top)
    };
}

// Dibujar el marco de selección
function drawSelectionBox(ctx) {
    if (!isSelecting) return;
    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);
}

// Función para seleccionar objetos dentro del marco
function selectObjects() {
    const x1 = Math.min(selectionStart.x, selectionEnd.x);
    const y1 = Math.min(selectionStart.y, selectionEnd.y);
    const x2 = Math.max(selectionStart.x, selectionEnd.x);
    const y2 = Math.max(selectionStart.y, selectionEnd.y);

    objects.forEach(obj => { // 'objects' es tu array de soles y planetas
        const objX = obj.x;
        const objY = obj.y;
        obj.selected = (objX >= x1 && objX <= x2 && objY >= y1 && objY <= y2);
    });
}

// Integrar en tu función de dibujado existente
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // dibujar soles y planetas
    objects.forEach(obj => drawObject(obj));

    // dibujar marco de selección si existe
    drawSelectionBox(ctx);
}

// Ejemplo de drawObject adaptado a tu código
function drawObject(obj) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
    ctx.fillStyle = obj.color;
    ctx.fill();
    if (obj.selected) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables de zoom y desplazamiento
let scale = 1;
let originX = 0;
let originY = 0;

// Arrays de elementos
let soles = [
    {x: 300, y: 300, r: 50, color: 'tomato', name: 'Proyecto 1', selected: false},
    {x: 700, y: 400, r: 50, color: 'yellow', name: 'Proyecto 2', selected: false}
];

let planetas = [
    {x: 300, y: 400, r: 20, color: 'blue', name: 'Tarea A', selected: false},
    {x: 350, y: 500, r: 20, color: 'green', name: 'Tarea B', selected: false},
    {x: 700, y: 500, r: 20, color: 'purple', name: 'Tarea C', selected: false}
];

let dragging = false;
let dragTarget = null;
let offsetX, offsetY;

// Zoom con mouse wheel
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    let zoom = e.deltaY < 0 ? 1.1 : 0.9;
    let mx = e.offsetX;
    let my = e.offsetY;
    
    originX = mx - zoom * (mx - originX);
    originY = my - zoom * (my - originY);
    scale *= zoom;
    draw();
});

// Selección y arrastre
canvas.addEventListener('mousedown', (e) => {
    const x = (e.offsetX - originX) / scale;
    const y = (e.offsetY - originY) / scale;

    dragTarget = null;

    // Revisar soles primero
    for(let s of soles){
        const dx = x - s.x;
        const dy = y - s.y;
        if(Math.sqrt(dx*dx + dy*dy) < s.r){
            dragTarget = s;
            offsetX = dx;
            offsetY = dy;
            s.selected = true;
            draw();
            return;
        }
    }

    // Revisar planetas
    for(let p of planetas){
        const dx = x - p.x;
        const dy = y - p.y;
        if(Math.sqrt(dx*dx + dy*dy) < p.r){
            dragTarget = p;
            offsetX = dx;
            offsetY = dy;
            p.selected = true;
            draw();
            return;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if(dragTarget){
        const x = (e.offsetX - originX) / scale;
        const y = (e.offsetY - originY) / scale;
        dragTarget.x = x - offsetX;
        dragTarget.y = y - offsetY;
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    if(dragTarget) dragTarget.selected = false;
    dragTarget = null;
});

// Doble click para editar nombre de sol
canvas.addEventListener('dblclick', (e) => {
    const x = (e.offsetX - originX) / scale;
    const y = (e.offsetY - originY) / scale;

    for(let s of soles){
        const dx = x - s.x;
        const dy = y - s.y;
        if(Math.sqrt(dx*dx + dy*dy) < s.r){
            createTextInput(s);
            return;
        }
    }

    for(let p of planetas){
        const dx = x - p.x;
        const dy = y - p.y;
        if(Math.sqrt(dx*dx + dy*dy) < p.r){
            showPlanetOverlay(p);
            return;
        }
    }
});

// Crear input sobre el sol
function createTextInput(sol){
    const input = document.createElement('input');
    input.type = 'text';
    input.value = sol.name;
    input.className = 'text-edit';
    input.style.left = (sol.x * scale + originX - 30) + 'px';
    input.style.top = (sol.y * scale + originY - 10) + 'px';
    document.body.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
            sol.name = input.value;
            document.body.removeChild(input);
            draw();
        }
    });
}

// Ventana translúcida para planetas
let overlay = null;
function showPlanetOverlay(planeta){
    if(overlay) document.body.removeChild(overlay);
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.color = '#fff';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.fontSize = '20px';
    overlay.innerHTML = `<input type="text" id="planetName" value="${planeta.name}" style="padding:5px;font-size:16px;background:rgba(0,0,0,0.5);color:#fff;border:none;outline:none;">`;
    document.body.appendChild(overlay);

    const input = document.getElementById('planetName');
    input.focus();

    input.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
            planeta.name = input.value;
            document.body.removeChild(overlay);
            overlay = null;
            draw();
        }
    });

    overlay.addEventListener('click', (e)=>{
        if(e.target === overlay){
            planeta.name = input.value;
            document.body.removeChild(overlay);
            overlay = null;
            draw();
        }
    });
}

// Dibujo de elementos
function draw(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.setTransform(scale,0,0,scale,originX,originY);

    // Dibujar soles
    for(let s of soles){
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(s.name, s.x, s.y + s.r + 16);
    }

    // Dibujar planetas
    for(let p of planetas){
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, p.x, p.y + p.r + 14);
    }
}

draw();

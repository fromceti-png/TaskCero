
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let suns = [], sunLabels = [];
let planets = [], planetInfoModal;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.zoomSpeed = 0.4;

  addSunsAndPlanets();
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('click', handleCanvasClick);
}

function addSunsAndPlanets() {
  const sunGeometry = new THREE.SphereGeometry(2, 64, 64);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });

  for (let i = 0; i < 2; i++) {
    const sun = new THREE.Mesh(sunGeometry, sunMaterial.clone());
    sun.position.x = i * 20 - 10;
    sun.userData = { name: `Proyecto ${i + 1}` };
    scene.add(sun);
    suns.push(sun);

    const label = document.createElement('div');
    label.className = 'sun-label';
    label.textContent = sun.userData.name;
    document.body.appendChild(label);
    sunLabels.push(label);

    const planetGeometry = new THREE.SphereGeometry(1, 64, 64);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x00ccff });

    for (let j = 0; j < 2; j++) {
      const planet = new THREE.Mesh(planetGeometry, planetMaterial.clone());
      planet.position.set(sun.position.x + 5 * (j + 1), j * 3, 0);
      planet.userData = {
        taskName: `Tarea ${j + 1}`,
        deadline: '',
        notes: '',
      };
      scene.add(planet);
      planets.push(planet);
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleCanvasClick(event) {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([...suns, ...planets]);

  if (planetInfoModal) {
    document.body.removeChild(planetInfoModal);
    planetInfoModal = null;
  }

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (suns.includes(object)) {
      const name = prompt('Editar nombre del proyecto:', object.userData.name);
      if (name !== null) {
        object.userData.name = name;
      }
    }

    if (planets.includes(object)) {
      openTaskModal(object);
    }
  }
}

function openTaskModal(planet) {
  planetInfoModal = document.createElement('div');
  planetInfoModal.className = 'task-modal';

  const nameInput = document.createElement('input');
  nameInput.value = planet.userData.taskName;
  nameInput.placeholder = 'Nombre de la tarea';

  const deadlineInput = document.createElement('input');
  deadlineInput.value = planet.userData.deadline;
  deadlineInput.placeholder = 'Deadline';

  const notesInput = document.createElement('textarea');
  notesInput.value = planet.userData.notes;
  notesInput.placeholder = 'Notas';

  planetInfoModal.appendChild(nameInput);
  planetInfoModal.appendChild(deadlineInput);
  planetInfoModal.appendChild(notesInput);

  planetInfoModal.addEventListener('click', (e) => e.stopPropagation());
  document.body.appendChild(planetInfoModal);

  nameInput.oninput = () => planet.userData.taskName = nameInput.value;
  deadlineInput.oninput = () => planet.userData.deadline = deadlineInput.value;
  notesInput.oninput = () => planet.userData.notes = notesInput.value;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  suns.forEach((sun, i) => {
    const vector = sun.position.clone().project(camera);
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
    sunLabels[i].style.left = `${x}px`;
    sunLabels[i].style.top = `${y}px`;
    sunLabels[i].textContent = sun.userData.name;
  });
}


const canvas = document.getElementById("cosmos");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 20;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createSphere(radius, color, position, name) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(...position);
  sphere.userData = {
    type: "planet",
    name: name,
    deadline: "",
    notes: ""
  };
  scene.add(sphere);
  return sphere;
}

// Crear soles
createSphere(2, 0xffcc00, [0, 0, 0], "Sol A");
createSphere(2, 0xff3300, [10, 0, 0], "Sol B");

// Crear planetas
createSphere(0.5, 0x00ffcc, [3, 1, 0], "Tarea 1");
createSphere(0.5, 0xcc00ff, [4, -2, 1], "Tarea 2");
createSphere(0.5, 0x00ccff, [5, 2, -1], "Tarea 3");

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    if (intersected.userData.type === "planet") {
      showPlanetInfo(intersected, event.clientX, event.clientY);
    }
  }
}

function showPlanetInfo(planet, x, y) {
  const infoBox = document.getElementById("planet-info");
  document.getElementById("planet-name").textContent = planet.userData.name;
  document.getElementById("planet-deadline").value = planet.userData.deadline || "";
  document.getElementById("planet-notes").value = planet.userData.notes || "";

  document.getElementById("planet-deadline").onchange = (e) => {
    planet.userData.deadline = e.target.value;
  };
  document.getElementById("planet-notes").onchange = (e) => {
    planet.userData.notes = e.target.value;
  };

  infoBox.style.left = `${x + 10}px`;
  infoBox.style.top = `${y + 10}px`;
  infoBox.style.display = "block";
}

function closeInfo() {
  document.getElementById("planet-info").style.display = "none";
}

window.addEventListener("click", onClick);
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

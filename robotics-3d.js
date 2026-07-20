document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('robot-model-container');
  if (!container || typeof THREE === 'undefined') return;

  // Setup Scene
  const scene = new THREE.Scene();
  
  // Setup Camera
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(15, 10, 15);

  // Setup Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Remove loading text
  const loading = container.querySelector('.model-loading');
  if (loading) loading.style.display = 'none';

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 4, 0);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x00d4ff, 0.3); // Cyan fill
  fillLight.position.set(-10, 0, -10);
  scene.add(fillLight);

  // Materials
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.3, metalness: 0.2 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6, metalness: 0.5 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.8 });

  // --- ROBOT HIERARCHY ---
  
  // Base (Static)
  const baseGeo = new THREE.CylinderGeometry(2, 2.5, 1, 32);
  const baseMesh = new THREE.Mesh(baseGeo, darkMat);
  baseMesh.position.y = 0.5;
  scene.add(baseMesh);

  // Joint 1 (Base Swivel - Y Axis)
  const j1 = new THREE.Group();
  j1.position.y = 1;
  scene.add(j1);
  
  const j1Mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2, 1.5, 32), orangeMat);
  j1Mesh.position.y = 0.75;
  j1Mesh.userData = { joint: 'j1', axis: 'y', speed: 0.01 };
  j1.add(j1Mesh);

  // Joint 2 (Shoulder - Z Axis)
  const j2 = new THREE.Group();
  j2.position.set(0, 1.5, 0);
  j1.add(j2);

  const j2Pivot = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 32), darkMat);
  j2Pivot.rotation.x = Math.PI / 2;
  j2Pivot.userData = { joint: 'j2', axis: 'z', speed: 0.01 };
  j2.add(j2Pivot);

  const arm1Geo = new THREE.BoxGeometry(1.2, 5, 1.2);
  arm1Geo.translate(0, 2.5, 0); // Move origin to bottom
  const arm1Mesh = new THREE.Mesh(arm1Geo, orangeMat);
  arm1Mesh.userData = { joint: 'j2', axis: 'z', speed: 0.01 };
  j2.add(arm1Mesh);

  // Joint 3 (Elbow - Z Axis)
  const j3 = new THREE.Group();
  j3.position.set(0, 5, 0);
  j2.add(j3);

  const j3Pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32), darkMat);
  j3Pivot.rotation.x = Math.PI / 2;
  j3Pivot.userData = { joint: 'j3', axis: 'z', speed: 0.01 };
  j3.add(j3Pivot);

  const arm2Geo = new THREE.BoxGeometry(0.9, 4, 0.9);
  arm2Geo.translate(0, 2, 0);
  const arm2Mesh = new THREE.Mesh(arm2Geo, orangeMat);
  arm2Mesh.userData = { joint: 'j3', axis: 'z', speed: 0.01 };
  j3.add(arm2Mesh);

  // Joint 4 (Wrist Roll - Y Axis)
  const j4 = new THREE.Group();
  j4.position.set(0, 4, 0);
  j3.add(j4);

  const wrist1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 1.5, 16), darkMat);
  wrist1.position.y = 0.75;
  wrist1.userData = { joint: 'j4', axis: 'y', speed: 0.01 };
  j4.add(wrist1);

  // Joint 5 (Wrist Pitch - Z Axis)
  const j5 = new THREE.Group();
  j5.position.set(0, 1.5, 0);
  j4.add(j5);

  const j5Pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), silverMat);
  j5Pivot.rotation.x = Math.PI / 2;
  j5Pivot.userData = { joint: 'j5', axis: 'z', speed: 0.01 };
  j5.add(j5Pivot);

  const wrist2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1, 0.6), orangeMat);
  wrist2.position.y = 0.5;
  wrist2.userData = { joint: 'j5', axis: 'z', speed: 0.01 };
  j5.add(wrist2);

  // Joint 6 (Tool Flange - Y Axis)
  const j6 = new THREE.Group();
  j6.position.set(0, 1, 0);
  j5.add(j6);

  const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), silverMat);
  flange.position.y = 0.1;
  flange.userData = { joint: 'j6', axis: 'y', speed: 0.01 };
  j6.add(flange);

  // Target Rotations for Animation (also used as current state for dragging)
  const joints = { j1, j2, j3, j4, j5, j6 };
  let targetRotations = {
    j1: 0,
    j2: Math.PI / 6, // Slight forward tilt
    j3: -Math.PI / 3, // Bend elbow
    j4: 0,
    j5: -Math.PI / 3, // Level wrist
    j6: 0
  };

  // --- INTERACTIVE DRAG LOGIC (FORWARD KINEMATICS) ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let draggingJoint = null;
  let previousMousePosition = { x: 0, y: 0 };

  const interactableMeshes = [j1Mesh, j2Pivot, arm1Mesh, j3Pivot, arm2Mesh, wrist1, j5Pivot, wrist2, flange];

  renderer.domElement.addEventListener('mousemove', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (draggingJoint) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const jointData = draggingJoint.userData;
      // Map mouse movement to rotation based on axis
      const moveDelta = (jointData.axis === 'y') ? deltaX : deltaY;
      
      targetRotations[jointData.joint] += moveDelta * jointData.speed;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    } else {
      // Hover effect
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableMeshes);
      if (intersects.length > 0) {
        document.body.style.cursor = 'grab';
      } else {
        document.body.style.cursor = 'default';
      }
    }
  }, true);

  renderer.domElement.addEventListener('mousedown', (e) => {
    // Recalculate mouse immediately on click
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactableMeshes);
    
    if (intersects.length > 0) {
      e.stopPropagation(); // Stop OrbitControls from starting its drag
      document.body.style.cursor = 'grabbing';
      draggingJoint = intersects[0].object;
      controls.enabled = false; // Disable orbiting while dragging
      previousMousePosition = { x: e.clientX, y: e.clientY };
      
      // Deactivate all buttons
      document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
    }
  }, true); // Use capture phase so we trigger BEFORE OrbitControls

  window.addEventListener('mouseup', () => {
    if (draggingJoint) {
      draggingJoint = null;
      controls.enabled = true; // Re-enable orbiting
      document.body.style.cursor = 'default';
    }
  });

  // Button Handlers
  const buttons = document.querySelectorAll('.model-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const action = e.target.id;
      if (action === 'btn-reset') {
        targetRotations = { j1: 0, j2: Math.PI/6, j3: -Math.PI/3, j4: 0, j5: -Math.PI/3, j6: 0 };
      } else if (action === 'btn-base') {
        targetRotations.j1 += Math.PI / 2;
      } else if (action === 'btn-reach') {
        targetRotations = { j1: targetRotations.j1, j2: Math.PI/3, j3: -Math.PI/6, j4: 0, j5: -Math.PI/6, j6: targetRotations.j6 };
      } else if (action === 'btn-scan') {
        targetRotations = { j1: Math.PI/4, j2: Math.PI/4, j3: -Math.PI/2, j4: Math.PI, j5: Math.PI/4, j6: Math.PI*2 };
      }
    });
  });

  // Grid Helper
  const gridHelper = new THREE.GridHelper(20, 20, 0x00d4ff, 0x444444);
  gridHelper.position.y = 0;
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Lerp joint rotations smoothly towards target
    j1.rotation.y += (targetRotations.j1 - j1.rotation.y) * 0.05;
    j2.rotation.z += (targetRotations.j2 - j2.rotation.z) * 0.05;
    j3.rotation.z += (targetRotations.j3 - j3.rotation.z) * 0.05;
    j4.rotation.y += (targetRotations.j4 - j4.rotation.y) * 0.05;
    j5.rotation.z += (targetRotations.j5 - j5.rotation.z) * 0.05;
    j6.rotation.y += (targetRotations.j6 - j6.rotation.y) * 0.05;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});

// script.js - RootNode Rebels 3D Tilt-Shift Neighborhood Bakery & Café

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Audio Synthesizer (Friendly Café Doorbell & Bicycle Ting)
       ========================================================================== */
    let audioCtx = null;
    let soundEnabled = localStorage.getItem('rnr_cafe_sound') === 'true';

    const soundToggle = document.getElementById('soundToggle');
    const updateSoundUI = () => {
        if (!soundToggle) return;
        if (soundEnabled) {
            soundToggle.classList.add('active');
            soundToggle.innerHTML = `<span>🔔</span> Bell: ON`;
        } else {
            soundToggle.classList.remove('active');
            soundToggle.innerHTML = `<span>🔕</span> Bell: OFF`;
        }
    };
    updateSoundUI();

    function initAudio() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
    }

    function playSound(type = 'doorbell') {
        if (!soundEnabled) return;
        initAudio();
        if (!audioCtx) return;

        try {
            const now = audioCtx.currentTime;

            if (type === 'doorbell') {
                // Friendly shopkeeper brass bell two-tone chime (E5 -> G#5)
                [659.25, 830.61].forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.12);
                    gain.gain.setValueAtTime(0.06, now + idx * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.6);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + idx * 0.12);
                    osc.stop(now + idx * 0.12 + 0.6);
                });
            } else if (type === 'bike') {
                // Bicycle bell ting-ting
                [1760, 2093].forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    gain.gain.setValueAtTime(0.04, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.15);
                });
            } else if (type === 'click') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(500, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.04);
            }
        } catch (e) {}
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('rnr_cafe_sound', soundEnabled);
            updateSoundUI();
            if (soundEnabled) playSound('doorbell');
        });
    }

    /* ==========================================================================
       2. Three.js Tilt-Shift Street Model
       ========================================================================== */
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    
    // Sky color initially warm afternoon butter-cream
    const daySkyColor = new THREE.Color(0xfef9c3);
    const duskSkyColor = new THREE.Color(0xfb923c);
    const eveningSkyColor = new THREE.Color(0x1e1b4b);
    scene.background = daySkyColor.clone();
    scene.fog = new THREE.FogExp2(0xfef9c3, 0.012);

    // Tilt-shift camera: narrow FOV looking down from a high-angle diagonal
    const camera = new THREE.PerspectiveCamera(26, window.innerWidth / window.innerHeight, 0.5, 500);
    
    const DEFAULT_CAM_POS = new THREE.Vector3(34, 25, 42);
    const DEFAULT_CAM_LOOK = new THREE.Vector3(0, 3.5, 0);

    const DOOR_CAM_POS = new THREE.Vector3(6, 4.5, 12);
    const DOOR_CAM_LOOK = new THREE.Vector3(0, 3.2, 0);

    const currentCamPos = DEFAULT_CAM_POS.clone();
    const targetCamPos = DEFAULT_CAM_POS.clone();
    const currentCamLook = DEFAULT_CAM_LOOK.clone();
    const targetCamLook = DEFAULT_CAM_LOOK.clone();

    camera.position.copy(currentCamPos);
    camera.lookAt(currentCamLook);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Palette Materials
    const matCobble = new THREE.MeshLambertMaterial({ color: 0xd6d3d1, flatShading: true });
    const matCurb = new THREE.MeshLambertMaterial({ color: 0xa8a29e, flatShading: true });
    const matGrass = new THREE.MeshLambertMaterial({ color: 0x65a30d, flatShading: true });
    const matBrickRed = new THREE.MeshLambertMaterial({ color: 0x991b1b, flatShading: true });
    const matButterYellow = new THREE.MeshLambertMaterial({ color: 0xfef08a, flatShading: true });
    const matSoftGreen = new THREE.MeshLambertMaterial({ color: 0x4d7c0f, flatShading: true });
    const matWarmBrown = new THREE.MeshLambertMaterial({ color: 0x78350f, flatShading: true });
    const matDarkWood = new THREE.MeshLambertMaterial({ color: 0x451a03, flatShading: true });
    const matChalkboard = new THREE.MeshLambertMaterial({ color: 0x1e2420, flatShading: true });
    const matGlassWarm = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    // Window Light Material (Turns on into evening)
    const matLitWindow = new THREE.MeshBasicMaterial({ color: 0xfde047 });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    sunLight.position.set(25, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    scene.add(sunLight);

    // Warm street and café evening incandescent lights
    const eveningWarmLights = [];

    // Street Scene Root
    const streetGroup = new THREE.Group();
    scene.add(streetGroup);

    // 1. Cobblestone Street & Sidewalk Base
    const roadMesh = new THREE.Mesh(new THREE.BoxGeometry(40, 1, 14), matCobble);
    roadMesh.position.set(0, -0.5, 6);
    roadMesh.receiveShadow = true;
    streetGroup.add(roadMesh);

    const sidewalkMesh = new THREE.Mesh(new THREE.BoxGeometry(40, 1.2, 8), matCurb);
    sidewalkMesh.position.set(0, -0.3, -2);
    sidewalkMesh.receiveShadow = true;
    streetGroup.add(sidewalkMesh);

    // Planter grass strips
    const grassStrip = new THREE.Mesh(new THREE.BoxGeometry(38, 1.25, 1.2), matGrass);
    grassStrip.position.set(0, -0.25, 1.2);
    streetGroup.add(grassStrip);

    /* ==========================================================================
       3. Centerpiece: The Neighborhood Café & Bakery Building
       ========================================================================== */
    const cafeGroup = new THREE.Group();
    cafeGroup.position.set(0, 0, -4);
    streetGroup.add(cafeGroup);

    // Brick Red Main Building with slight charming artisan lean
    const cafeBody = new THREE.Mesh(new THREE.BoxGeometry(11, 7.5, 7), matBrickRed);
    cafeBody.position.y = 4.0;
    cafeBody.rotation.z = -0.012; // slightly crooked charm
    cafeBody.castShadow = true;
    cafeBody.receiveShadow = true;
    cafeGroup.add(cafeBody);

    // Butter-Yellow Shopfront Fascia
    const cafeFascia = new THREE.Mesh(new THREE.BoxGeometry(10.5, 1.2, 0.4), matButterYellow);
    cafeFascia.position.set(0, 4.4, 3.6);
    cafeGroup.add(cafeFascia);

    // Striped Awning (Butter Yellow & Brick Red alternating ribs)
    const awningGroup = new THREE.Group();
    awningGroup.position.set(0, 4.2, 4.5);
    awningGroup.rotation.x = 0.22;
    for (let rib = -4.8; rib <= 4.8; rib += 1.2) {
        const isYellow = Math.round(rib * 10) % 2 === 0;
        const ribMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.15, 0.2, 2.2),
            isYellow ? matButterYellow : matBrickRed
        );
        ribMesh.position.x = rib;
        ribMesh.castShadow = true;
        awningGroup.add(ribMesh);
    }
    cafeGroup.add(awningGroup);

    // Crooked Pitched Roof with warm brown terracotta tiles
    const cafeRoof = new THREE.Mesh(new THREE.ConeGeometry(8.5, 3.5, 4), matWarmBrown);
    cafeRoof.position.y = 9.2;
    cafeRoof.rotation.y = Math.PI / 4;
    cafeRoof.rotation.z = 0.015; // slightly crooked artisan tilt
    cafeRoof.castShadow = true;
    cafeGroup.add(cafeRoof);

    // Brick Chimney with gentle smoke
    const cafeChimney = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 1.2), matBrickRed);
    cafeChimney.position.set(3.8, 9.8, -1.5);
    cafeChimney.castShadow = true;
    cafeGroup.add(cafeChimney);

    const smokePuffs = [];
    for (let s = 0; s < 4; s++) {
        const puff = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.35 + s * 0.12, 0),
            new THREE.MeshLambertMaterial({ color: 0xfffbeb, transparent: true, opacity: 0.55 })
        );
        puff.position.set(3.8, 11.5 + s * 1.0, -1.5);
        puff.userData = { baseY: 11.5 + s * 1.0, speed: 0.02 + s * 0.005 };
        cafeGroup.add(puff);
        smokePuffs.push(puff);
    }

    // Large Bay Display Window (Right of door)
    const bayWindowFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, 0.3), matButterYellow);
    bayWindowFrame.position.set(2.4, 2.1, 3.55);
    cafeGroup.add(bayWindowFrame);

    const bayWindowGlass = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.2, 0.1), matLitWindow);
    bayWindowGlass.position.set(2.4, 2.1, 3.65);
    cafeGroup.add(bayWindowGlass);

    // Warm Interior Window Glow Light
    const windowGlowLight = new THREE.PointLight(0xfef08a, 0.4, 18);
    windowGlowLight.position.set(2.4, 2.5, 4.2);
    cafeGroup.add(windowGlowLight);
    eveningWarmLights.push({ light: windowGlowLight, baseIntensity: 2.2 });

    // -------------------------------------------------------------
    // THE INTERACTIVE CAFÉ DOOR (Click to open menu!)
    // -------------------------------------------------------------
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-2.8, 0.3, 3.5); // hinge on left side

    const cafeDoor = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.2, 0.2), matDarkWood);
    cafeDoor.position.set(0.9, 1.6, 0); // offset so pivot is at hinge edge
    cafeDoor.castShadow = true;
    doorPivot.add(cafeDoor);

    // Glass panel in door
    const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.05), matLitWindow);
    doorGlass.position.set(0.9, 2.0, 0.1);
    doorPivot.add(doorGlass);

    // Brass Handle
    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4), matButterYellow);
    doorHandle.position.set(1.65, 1.4, 0.15);
    doorPivot.add(doorHandle);

    // "OPEN" wooden sign hanging on door
    const doorOpenSign = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.05), matButterYellow);
    doorOpenSign.position.set(0.9, 1.8, 0.15);
    doorPivot.add(doorOpenSign);

    doorPivot.userData = {
        isDoor: true,
        isOpen: false,
        name: 'Café Front Door'
    };

    cafeGroup.add(doorPivot);

    // Chalkboard A-frame Sidewalk Sign
    const chalkSignGroup = new THREE.Group();
    chalkSignGroup.position.set(-3.2, 0.3, 5.2);
    chalkSignGroup.rotation.y = 0.25;

    const boardFront = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.1), matChalkboard);
    boardFront.position.y = 0.9;
    boardFront.castShadow = true;
    chalkSignGroup.add(boardFront);

    const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 0.08), matWarmBrown);
    boardFrame.position.y = 0.9;
    boardFrame.position.z = -0.02;
    chalkSignGroup.add(boardFrame);

    cafeGroup.add(chalkSignGroup);

    // Outdoor Bistro Tables & Chairs
    function addBistroTable(x, z) {
        const table = new THREE.Group();
        table.position.set(x, 0.3, z);

        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 10), matButterYellow);
        top.position.y = 1.1;
        top.castShadow = true;
        table.add(top);

        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1), matDarkWood);
        leg.position.y = 0.55;
        table.add(leg);

        // Espresso Cup
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.15, 8), matBrickRed);
        cup.position.set(0.2, 1.22, 0.1);
        table.add(cup);

        // Little stool
        const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6, 8), matDarkWood);
        stool.position.set(0.8, 0.3, 0);
        table.add(stool);

        cafeGroup.add(table);
    }
    addBistroTable(1.2, 5.2);
    addBistroTable(3.8, 5.2);

    /* ==========================================================================
       4. Adjacent Neighboring Street Buildings
       ========================================================================== */

    // Left Building: Florist & Books with Soft Green Walls
    const leftHouse = new THREE.Group();
    leftHouse.position.set(-11, 0, -4);
    
    const leftBody = new THREE.Mesh(new THREE.BoxGeometry(8.5, 7, 6.5), matSoftGreen);
    leftBody.position.y = 3.5;
    leftBody.rotation.z = 0.015; // slightly crooked
    leftBody.castShadow = true;
    leftBody.receiveShadow = true;
    leftHouse.add(leftBody);

    const leftRoof = new THREE.Mesh(new THREE.ConeGeometry(6.5, 3, 4), matBrickRed);
    leftRoof.position.y = 8.2;
    leftRoof.rotation.y = Math.PI / 4;
    leftHouse.add(leftRoof);

    // Flower boxes on windows
    const flowerBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.6), matWarmBrown);
    flowerBox.position.set(0, 4.5, 3.4);
    leftHouse.add(flowerBox);

    const flowersMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 0.5), matButterYellow);
    flowersMesh.position.set(0, 4.8, 3.4);
    leftHouse.add(flowersMesh);

    streetGroup.add(leftHouse);

    // Right Building: Old Townhouse with Butter-Yellow Plaster
    const rightHouse = new THREE.Group();
    rightHouse.position.set(11, 0, -4);

    const rightBody = new THREE.Mesh(new THREE.BoxGeometry(8.5, 8, 6.5), matButterYellow);
    rightBody.position.y = 4.0;
    rightBody.rotation.z = -0.018; // slightly crooked
    rightBody.castShadow = true;
    rightBody.receiveShadow = true;
    rightHouse.add(rightBody);

    const rightRoof = new THREE.Mesh(new THREE.ConeGeometry(6.8, 3.8, 4), matWarmBrown);
    rightRoof.position.y = 9.5;
    rightRoof.rotation.y = Math.PI / 4;
    rightHouse.add(rightRoof);

    streetGroup.add(rightHouse);

    /* ==========================================================================
       5. Animated Street Characters & Bread Delivery Bike
       ========================================================================== */

    // A. The Bread Delivery Bicycle with baguette basket
    const bikeGroup = new THREE.Group();
    bikeGroup.position.set(-18, 0.3, 7.5);

    // Wheels
    const wheelGeo = new THREE.TorusGeometry(0.5, 0.08, 6, 12);
    const matBikeFrame = new THREE.MeshLambertMaterial({ color: 0x991b1b, flatShading: true });
    
    const wheelF = new THREE.Mesh(wheelGeo, matDarkWood);
    wheelF.position.set(1.2, 0.5, 0);
    bikeGroup.add(wheelF);

    const wheelR = new THREE.Mesh(wheelGeo, matDarkWood);
    wheelR.position.set(-1.2, 0.5, 0);
    bikeGroup.add(wheelR);

    // Frame
    const bikeFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.1), matBikeFrame);
    bikeFrame.position.set(0, 0.7, 0);
    bikeGroup.add(bikeFrame);

    const handlebars = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.8), matDarkWood);
    handlebars.position.set(1.0, 1.1, 0);
    bikeGroup.add(handlebars);

    // Bread Delivery Basket overflowing with golden baguettes
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.8), matWarmBrown);
    basket.position.set(1.3, 1.2, 0);
    basket.castShadow = true;
    bikeGroup.add(basket);

    // French Baguettes in basket
    for (let b = -0.2; b <= 0.2; b += 0.2) {
        const baguette = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.1, 6), matButterYellow);
        baguette.rotation.z = -0.4;
        baguette.rotation.x = b;
        baguette.position.set(1.3, 1.5, b * 0.8);
        bikeGroup.add(baguette);
    }

    streetGroup.add(bikeGroup);

    // B. Tiny People Walking Past (Pedestrians)
    const pedestrians = [];
    const pedColors = [0x991b1b, 0x4d7c0f, 0x78350f, 0xb91c1c];

    function createPedestrian(startX, z, direction, colorIdx) {
        const ped = new THREE.Group();
        ped.position.set(startX, 0.3, z);

        const bodyMat = new THREE.MeshLambertMaterial({ color: pedColors[colorIdx % pedColors.length], flatShading: true });
        
        // Torso
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.4), bodyMat);
        torso.position.y = 1.0;
        torso.castShadow = true;
        ped.add(torso);

        // Head
        const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), matButterYellow);
        head.position.y = 1.7;
        ped.add(head);

        // Legs
        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.2), matDarkWood);
        legL.position.set(-0.15, 0.35, 0);
        ped.add(legL);

        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.2), matDarkWood);
        legR.position.set(0.15, 0.35, 0);
        ped.add(legR);

        ped.userData = {
            direction: direction,
            speed: 0.035 + Math.random() * 0.02,
            legL: legL,
            legR: legR,
            walkCycle: Math.random() * Math.PI
        };

        streetGroup.add(ped);
        pedestrians.push(ped);
    }

    createPedestrian(-15, 1.8, 1, 0);
    createPedestrian(12, 1.5, -1, 1);
    createPedestrian(-8, 2.2, 1, 2);

    // C. Vintage Streetlamp with Evening Glow
    function addStreetlamp(x, z) {
        const lamp = new THREE.Group();
        lamp.position.set(x, 0.3, z);

        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 5.5, 6), matDarkWood);
        pole.position.y = 2.75;
        pole.castShadow = true;
        lamp.add(pole);

        const lantern = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 0), matLitWindow);
        lantern.position.set(0, 5.4, 0);
        lamp.add(lantern);

        const lampLight = new THREE.PointLight(0xfef08a, 0.2, 14);
        lampLight.position.set(0, 5.2, 0);
        lamp.add(lampLight);
        eveningWarmLights.push({ light: lampLight, baseIntensity: 1.8 });

        streetGroup.add(lamp);
    }

    addStreetlamp(-7, 2.0);
    addStreetlamp(7, 2.0);

    /* ==========================================================================
       6. Scroll into Evening Transition & Raycasting Door Click
       ========================================================================== */
    let eveningProgress = 0; // 0 = Afternoon, 1 = Evening
    let targetEveningProgress = 0;

    const eveningVignette = document.getElementById('eveningVignette');
    const timeSlider = document.getElementById('timeSlider');
    const timeLabel = document.getElementById('timeLabel');

    function setTimeOfDay(prog) {
        targetEveningProgress = Math.max(0, Math.min(1, prog));
    }

    // Scroll listener shifts into cozy evening
    window.addEventListener('scroll', () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (maxScroll > 0) {
            setTimeOfDay(window.scrollY / maxScroll);
        }
    }, { passive: true });

    if (timeSlider) {
        timeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            setTimeOfDay(val);
        });
    }

    // Door Hover & Click Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let isHoveringDoor = false;

    const doorTooltip = document.getElementById('doorTooltip');
    const cafeModalBoard = document.getElementById('cafeModalBoard');
    const cafeModalBackdrop = document.getElementById('cafeModalBackdrop');
    const boardCloseBtn = document.getElementById('boardCloseBtn');

    function openCafeMenu() {
        playSound('doorbell');
        doorPivot.rotation.y = -1.2; // swing door open!

        targetCamPos.copy(DOOR_CAM_POS);
        targetCamLook.copy(DOOR_CAM_LOOK);

        if (doorTooltip) doorTooltip.classList.remove('visible');

        setTimeout(() => {
            if (cafeModalBoard) cafeModalBoard.classList.add('active');
            if (cafeModalBackdrop) cafeModalBackdrop.classList.add('active');
        }, 300);
    }

    function closeCafeMenu() {
        playSound('click');
        doorPivot.rotation.y = 0; // close door

        targetCamPos.copy(DEFAULT_CAM_POS);
        targetCamLook.copy(DEFAULT_CAM_LOOK);

        if (cafeModalBoard) cafeModalBoard.classList.remove('active');
        if (cafeModalBackdrop) cafeModalBackdrop.classList.remove('active');
    }

    if (boardCloseBtn) boardCloseBtn.addEventListener('click', closeCafeMenu);
    if (cafeModalBackdrop) cafeModalBackdrop.addEventListener('click', closeCafeMenu);

    // Open Door from navbar button or street prompt
    document.querySelectorAll('.trigger-open-menu').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCafeMenu();
        });
    });

    // Raycast on mouse move
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        if (doorTooltip) {
            doorTooltip.style.left = `${e.clientX}px`;
            doorTooltip.style.top = `${e.clientY}px`;
        }
    });

    // Click canvas door
    canvas.addEventListener('click', () => {
        if (isHoveringDoor) {
            openCafeMenu();
        }
    });

    // Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ==========================================================================
       7. Tabs in Café Board (Menu vs Catering vs Hours)
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.board-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            const target = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanels.forEach(panel => {
                if (panel.id === `tab-${target}`) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       8. Main Render & Animation Loop
       ========================================================================== */
    const clock = new THREE.Clock();

    function renderLoop() {
        requestAnimationFrame(renderLoop);

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        // 1. Raycast Check for Café Door
        if (targetCamPos.distanceTo(DEFAULT_CAM_POS) < 5) {
            raycaster.setFromCamera(mouse, camera);
            const doorMeshes = [];
            doorPivot.traverse(child => { if (child.isMesh) doorMeshes.push(child); });

            const hits = raycaster.intersectObjects(doorMeshes, false);
            if (hits.length > 0) {
                if (!isHoveringDoor) {
                    isHoveringDoor = true;
                    canvas.style.cursor = 'pointer';
                    if (doorTooltip) doorTooltip.classList.add('visible');
                    doorPivot.position.y = 0.38; // gentle lift
                }
            } else {
                if (isHoveringDoor) {
                    isHoveringDoor = false;
                    canvas.style.cursor = 'grab';
                    if (doorTooltip) doorTooltip.classList.remove('visible');
                    doorPivot.position.y = 0.3;
                }
            }
        }

        // 2. Smooth Camera Gliding
        currentCamPos.lerp(targetCamPos, 0.06);
        currentCamLook.lerp(targetCamLook, 0.06);
        camera.position.copy(currentCamPos);
        camera.lookAt(currentCamLook);

        // 3. Time of Day Transition (Scroll into Evening)
        eveningProgress += (targetEveningProgress - eveningProgress) * 0.05;

        // Interpolate Sky Color
        if (eveningProgress < 0.5) {
            const factor = eveningProgress / 0.5;
            scene.background.copy(daySkyColor).lerp(duskSkyColor, factor);
            scene.fog.color.copy(scene.background);
        } else {
            const factor = (eveningProgress - 0.5) / 0.5;
            scene.background.copy(duskSkyColor).lerp(eveningSkyColor, factor);
            scene.fog.color.copy(scene.background);
        }

        // Sunlight dims into evening
        sunLight.intensity = 1.4 * (1 - eveningProgress * 0.85);

        // Streetlamps and window lights TURN ON as user scrolls into evening!
        eveningWarmLights.forEach(item => {
            item.light.intensity = 0.2 + item.baseIntensity * eveningProgress;
        });

        if (eveningVignette) {
            eveningVignette.style.opacity = (eveningProgress * 0.8).toFixed(2);
        }

        if (timeLabel) {
            if (eveningProgress < 0.35) {
                timeLabel.textContent = "☀️ 2:30 PM (Sunlit Afternoon)";
            } else if (eveningProgress < 0.7) {
                timeLabel.textContent = "🌅 5:45 PM (Golden Sunset)";
            } else {
                timeLabel.textContent = "🌙 8:15 PM (Cozy Evening)";
            }
        }

        // 4. Animate Delivery Bike (Pedaling down cobblestones)
        bikeGroup.position.x += 0.06;
        wheelF.rotation.z -= 0.12;
        wheelR.rotation.z -= 0.12;
        bikeGroup.position.y = 0.3 + Math.sin(elapsed * 8) * 0.03; // slight bike bounce

        if (bikeGroup.position.x > 22) {
            bikeGroup.position.x = -22;
            playSound('bike');
        }

        // 5. Animate Walking Pedestrians
        pedestrians.forEach(ped => {
            ped.position.x += ped.userData.direction * ped.userData.speed;
            ped.userData.walkCycle += 0.12;
            ped.userData.legL.rotation.z = Math.sin(ped.userData.walkCycle) * 0.45;
            ped.userData.legR.rotation.z = -Math.sin(ped.userData.walkCycle) * 0.45;

            // Turn around at street ends
            if (ped.position.x > 18) ped.userData.direction = -1;
            if (ped.position.x < -18) ped.userData.direction = 1;
        });

        // 6. Animate Chimney Smoke Puffs
        smokePuffs.forEach(puff => {
            puff.position.y += puff.userData.speed;
            puff.position.x += Math.sin(elapsed + puff.position.y) * 0.005;
            if (puff.position.y > 14.5) {
                puff.position.y = puff.userData.baseY;
            }
        });

        renderer.render(scene, camera);
    }
    renderLoop();

    /* ==========================================================================
       9. Catering Form Submission via Google Apps Script
       ========================================================================== */
    const cateringForm = document.getElementById('cateringForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9keQY3zDm7Xy-IaRZr3NclpX5QQ-RhUCLuXDtzMXUgN7IQmp1PA-xqXDpbT9XhOBNvA/exec';

    if (cateringForm) {
        cateringForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = `<span>🥖</span> <span>Sending to the Kitchen...</span>`;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.75';

            const formData = new FormData(cateringForm);
            formData.append('Type', 'catering');

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(() => {
                    this.innerHTML = `
                        <div style="text-align: center; padding: 32px 16px; background: rgba(101, 163, 13, 0.15); border: 2px dashed var(--soft-green); border-radius: 16px;">
                            <div style="font-size: 2.5rem; margin-bottom: 8px;">🥖 ☕ 🥐</div>
                            <h3 style="font-family: var(--font-sign); color: var(--butter-yellow); font-size: 1.8rem; margin-bottom: 8px;">We got your note, neighbor!</h3>
                            <p style="font-family: var(--font-hand); color: #e2e8f0; font-size: 1.25rem; line-height: 1.6;">
                                We'll check the pantry, calculate the flour, and give you a shout back today. Thanks for keeping us busy baking!
                            </p>
                        </div>
                    `;
                })
                .catch(err => {
                    console.error('Error:', err);
                    submitBtn.innerText = 'Flour in the machine! Try again';
                    submitBtn.style.background = '#b91c1c';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }, 3500);
                });
        });
    }

    // Telemetry tracker
    setTimeout(() => {
        if (!scriptURL) return;
        try {
            const telemetryData = new FormData();
            telemetryData.append('Type', 'telemetry');
            telemetryData.append('Path', window.location.pathname);
            telemetryData.append('ScreenSize', `${window.innerWidth}x${window.innerHeight}`);
            fetch(scriptURL, { method: 'POST', body: telemetryData }).catch(() => {});
        } catch (e) {}
    }, 2500);
});

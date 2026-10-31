// script.js - RootNode Rebels Low-Poly Floating Island 3D City (Sunset Edition)

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Audio Synthesizer (Zero-Asset Web Audio API)
       ========================================================================== */
    let audioCtx = null;
    let soundEnabled = localStorage.getItem('rnr_city_sound') === 'true';

    const soundToggle = document.getElementById('soundToggle');
    const updateSoundUI = () => {
        if (!soundToggle) return;
        if (soundEnabled) {
            soundToggle.classList.add('active');
            soundToggle.innerHTML = `<span>🔊</span> Sound: ON`;
        } else {
            soundToggle.classList.remove('active');
            soundToggle.innerHTML = `<span>🔇</span> Sound: OFF`;
        }
    };
    updateSoundUI();

    function initAudio() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
    }

    function playSound(type = 'click') {
        if (!soundEnabled) return;
        initAudio();
        if (!audioCtx) return;

        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const now = audioCtx.currentTime;

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'hover') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'zoom') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(340, now);
                osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1000, now + 0.04);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            }
        } catch (e) {}
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('rnr_city_sound', soundEnabled);
            updateSoundUI();
            if (soundEnabled) playSound('click');
        });
    }

    /* ==========================================================================
       2. Three.js Scene: Low-Poly Floating Island City in Sunset
       ========================================================================== */
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf97316, 0.008);

    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.5, 1000);
    
    // Overview Camera Position & Target
    const OVERVIEW_CAM = new THREE.Vector3(38, 30, 38);
    const OVERVIEW_TARGET = new THREE.Vector3(0, 2, 0);

    const currentCamPos = OVERVIEW_CAM.clone();
    const targetCamPos = OVERVIEW_CAM.clone();
    const currentCamLook = OVERVIEW_TARGET.clone();
    const targetCamLook = OVERVIEW_TARGET.clone();

    camera.position.copy(currentCamPos);
    camera.lookAt(currentCamLook);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Sunset Lighting
    const ambientLight = new THREE.HemisphereLight(0xffedd5, 0x831843, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    sunLight.position.set(40, 50, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -35;
    sunLight.shadow.camera.right = 35;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    scene.add(sunLight);

    // Warm Sunset Rim Light
    const rimLight = new THREE.DirectionalLight(0xf43f5e, 0.8);
    rimLight.position.set(-30, 20, -30);
    scene.add(rimLight);

    // Materials Palette (Authentic Flat Shading Low-Poly)
    const matGrass = new THREE.MeshLambertMaterial({ color: 0x65a30d, flatShading: true });
    const matRock = new THREE.MeshLambertMaterial({ color: 0x57534e, flatShading: true });
    const matRoad = new THREE.MeshLambertMaterial({ color: 0x78716c, flatShading: true });
    const matWater = new THREE.MeshLambertMaterial({ color: 0x06b6d4, flatShading: true, transparent: true, opacity: 0.8 });
    
    const matWallLight = new THREE.MeshLambertMaterial({ color: 0xf1f5f9, flatShading: true });
    const matWallBrick = new THREE.MeshLambertMaterial({ color: 0xc2410c, flatShading: true });
    const matWallCream = new THREE.MeshLambertMaterial({ color: 0xfef3c7, flatShading: true });
    const matWallTower = new THREE.MeshLambertMaterial({ color: 0x475569, flatShading: true });

    const matRoofOrange = new THREE.MeshLambertMaterial({ color: 0xea580c, flatShading: true });
    const matRoofBlue = new THREE.MeshLambertMaterial({ color: 0x0284c7, flatShading: true });
    const matRoofPink = new THREE.MeshLambertMaterial({ color: 0xf43f5e, flatShading: true });
    const matWood = new THREE.MeshLambertMaterial({ color: 0x854d0e, flatShading: true });
    const matWindowGold = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    // Entire Island Root Group
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // 1. Floating Island Base (Grass Plateau + Faceted Rock Underside)
    const plateauGeo = new THREE.CylinderGeometry(25, 23, 4, 9);
    const plateauMesh = new THREE.Mesh(plateauGeo, matGrass);
    plateauMesh.position.y = 0;
    plateauMesh.receiveShadow = true;
    islandGroup.add(plateauMesh);

    // Rocky cone bottom tapering into the sunset
    const rockGeo = new THREE.ConeGeometry(23, 20, 9);
    const rockMesh = new THREE.Mesh(rockGeo, matRock);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -12;
    rockMesh.receiveShadow = true;
    islandGroup.add(rockMesh);

    // Circular Town Road
    const roadGeo = new THREE.RingGeometry(12, 17, 16);
    const roadMesh = new THREE.Mesh(roadGeo, matRoad);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = 2.05;
    roadMesh.receiveShadow = true;
    islandGroup.add(roadMesh);

    // Central Town Plaza Fountain / Reflective Pond
    const pondGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.4, 8);
    const pondMesh = new THREE.Mesh(pondGeo, matWater);
    pondMesh.position.set(0, 2.1, 0);
    islandGroup.add(pondMesh);

    const fountainPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 1.8, 6), matWallLight);
    fountainPillar.position.set(0, 3, 0);
    islandGroup.add(fountainPillar);

    /* ==========================================================================
       3. The 4 Interactive Buildings (Menu Items)
       ========================================================================== */
    const interactiveBuildings = [];

    // Helper: Create Glowing Window Box
    function createWindow(w = 0.8, h = 1.2, d = 0.1) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matWindowGold);
        return win;
    }

    // -------------------------------------------------------------
    // Building 1: WORKSHOP (Portfolio) - Position: (+10, 0, +10)
    // -------------------------------------------------------------
    const workshopGroup = new THREE.Group();
    workshopGroup.position.set(10, 2.0, 10);
    workshopGroup.userData = {
        id: 'workshop',
        name: 'The Workshop',
        category: 'Portfolio Blueprints',
        icon: '⚒️',
        desc: 'Explore flagship systems, ERPs & repositories',
        targetCam: new THREE.Vector3(18, 11, 18),
        targetLook: new THREE.Vector3(10, 5, 10)
    };

    // Main workshop structure
    const wsBody = new THREE.Mesh(new THREE.BoxGeometry(6.5, 4.5, 6), matWallBrick);
    wsBody.position.y = 2.25;
    wsBody.castShadow = true;
    wsBody.receiveShadow = true;
    workshopGroup.add(wsBody);

    // Pitched Gable Roof
    const wsRoof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 3, 4), matRoofOrange);
    wsRoof.position.y = 5.8;
    wsRoof.rotation.y = Math.PI / 4;
    wsRoof.castShadow = true;
    workshopGroup.add(wsRoof);

    // Chimney
    const wsChimney = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4, 1.2), matRock);
    wsChimney.position.set(2.2, 6, -1.5);
    wsChimney.castShadow = true;
    workshopGroup.add(wsChimney);

    // Chimney Smoke Particles
    const smokePuffs = [];
    for (let i = 0; i < 4; i++) {
        const puff = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.4 + i * 0.15, 0),
            new THREE.MeshLambertMaterial({ color: 0xffedd5, transparent: true, opacity: 0.6, flatShading: true })
        );
        puff.position.set(2.2, 8 + i * 1.2, -1.5);
        puff.userData = { baseY: 8 + i * 1.2, speed: 0.02 + i * 0.005 };
        workshopGroup.add(puff);
        smokePuffs.push(puff);
    }

    // Doorway & Windows
    const wsDoor = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.2), matWood);
    wsDoor.position.set(-0.8, 1.1, 3.05);
    workshopGroup.add(wsDoor);

    const wsWin1 = createWindow(1.2, 1.2);
    wsWin1.position.set(1.5, 2.5, 3.05);
    workshopGroup.add(wsWin1);

    const wsWin2 = createWindow(1.2, 1.2);
    wsWin2.position.set(1.5, 2.5, -3.05);
    workshopGroup.add(wsWin2);

    islandGroup.add(workshopGroup);
    interactiveBuildings.push(workshopGroup);

    // -------------------------------------------------------------
    // Building 2: LIBRARY (Blog) - Position: (-10, 0, +10)
    // -------------------------------------------------------------
    const libraryGroup = new THREE.Group();
    libraryGroup.position.set(-10, 2.0, 10);
    libraryGroup.userData = {
        id: 'library',
        name: 'The Grand Library',
        category: 'Engineering Blog',
        icon: '📚',
        desc: 'Architecture insights, scalability & system design',
        targetCam: new THREE.Vector3(-18, 11, 18),
        targetLook: new THREE.Vector3(-10, 5, 10)
    };

    // Library Main Temple Body
    const libBody = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 6), matWallLight);
    libBody.position.y = 2.5;
    libBody.castShadow = true;
    libBody.receiveShadow = true;
    libraryGroup.add(libBody);

    // Columns
    for (let c = -2.4; c <= 2.4; c += 1.6) {
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4.8, 6), matWallLight);
        column.position.set(c, 2.4, 3.2);
        column.castShadow = true;
        libraryGroup.add(column);
    }

    // Pediment Triangular Roof
    const libRoof = new THREE.Mesh(new THREE.ConeGeometry(5.4, 2.6, 4), matRoofBlue);
    libRoof.position.y = 6.2;
    libRoof.rotation.y = Math.PI / 4;
    libRoof.castShadow = true;
    libraryGroup.add(libRoof);

    // Entrance & Lit Windows
    const libDoor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 0.2), matWindowGold);
    libDoor.position.set(0, 1.3, 3.05);
    libraryGroup.add(libDoor);

    const libWinL = createWindow(1, 1.5);
    libWinL.position.set(-3.55, 2.8, 0);
    libWinL.rotation.y = Math.PI / 2;
    libraryGroup.add(libWinL);

    const libWinR = createWindow(1, 1.5);
    libWinR.position.set(3.55, 2.8, 0);
    libWinR.rotation.y = Math.PI / 2;
    libraryGroup.add(libWinR);

    islandGroup.add(libraryGroup);
    interactiveBuildings.push(libraryGroup);

    // -------------------------------------------------------------
    // Building 3: SHOP (Store & Offerings) - Position: (+10, 0, -10)
    // -------------------------------------------------------------
    const shopGroup = new THREE.Group();
    shopGroup.position.set(10, 2.0, -10);
    shopGroup.userData = {
        id: 'shop',
        name: 'The Market Shop',
        category: 'Services & Store',
        icon: '🏪',
        desc: 'Custom software, cloud solutions & enterprise plans',
        targetCam: new THREE.Vector3(18, 11, -18),
        targetLook: new THREE.Vector3(10, 5, -10)
    };

    // Shop Pastel Walls
    const shopBody = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 5.5), matWallCream);
    shopBody.position.y = 2.0;
    shopBody.castShadow = true;
    shopBody.receiveShadow = true;
    shopGroup.add(shopBody);

    // Striped Awning
    const awningGeo = new THREE.BoxGeometry(4.5, 0.3, 1.6);
    const awning = new THREE.Mesh(awningGeo, matRoofPink);
    awning.position.set(0, 2.8, 3.2);
    awning.rotation.x = 0.25;
    shopGroup.add(awning);

    // Shop Display Windows
    const shopWin = createWindow(2.4, 1.4);
    shopWin.position.set(1.2, 1.8, 2.8);
    shopGroup.add(shopWin);

    const shopDoor = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.2), matWood);
    shopDoor.position.set(-1.6, 1.1, 2.8);
    shopGroup.add(shopDoor);

    // Shop Mansard Roof
    const shopRoof = new THREE.Mesh(new THREE.ConeGeometry(4.8, 2.4, 4), matRoofPink);
    shopRoof.position.y = 5.2;
    shopRoof.rotation.y = Math.PI / 4;
    shopRoof.castShadow = true;
    shopGroup.add(shopRoof);

    // Market Crates outside
    const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matWood);
    crate1.position.set(-2.4, 0.4, 3.6);
    shopGroup.add(crate1);

    const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), matWood);
    crate2.position.set(2.4, 0.35, 3.4);
    shopGroup.add(crate2);

    islandGroup.add(shopGroup);
    interactiveBuildings.push(shopGroup);

    // -------------------------------------------------------------
    // Building 4: TOWER (Contact & HQ) - Position: (-10, 0, -10)
    // -------------------------------------------------------------
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-10, 2.0, -10);
    towerGroup.userData = {
        id: 'tower',
        name: 'Citadel Tower',
        category: 'Contact HQ & Team',
        icon: '🗼',
        desc: 'Encrypted message transmit, team syndicate & socials',
        targetCam: new THREE.Vector3(-18, 16, -18),
        targetLook: new THREE.Vector3(-10, 8, -10)
    };

    // Lower Tower
    const twrLower = new THREE.Mesh(new THREE.BoxGeometry(4.5, 6, 4.5), matWallTower);
    twrLower.position.y = 3;
    twrLower.castShadow = true;
    twrLower.receiveShadow = true;
    towerGroup.add(twrLower);

    // Mid Tower
    const twrMid = new THREE.Mesh(new THREE.BoxGeometry(3.5, 5, 3.5), matWallLight);
    twrMid.position.y = 8;
    twrMid.castShadow = true;
    towerGroup.add(twrMid);

    // Clock faces (All 4 sides)
    const clockGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 8);
    for (let rot = 0; rot < 4; rot++) {
        const clockMesh = new THREE.Mesh(clockGeo, matWindowGold);
        clockMesh.rotation.x = Math.PI / 2;
        clockMesh.rotation.z = (rot * Math.PI) / 2;
        
        if (rot === 0) clockMesh.position.set(0, 9.2, 1.8);
        if (rot === 1) clockMesh.position.set(1.8, 9.2, 0);
        if (rot === 2) clockMesh.position.set(0, 9.2, -1.8);
        if (rot === 3) clockMesh.position.set(-1.8, 9.2, 0);

        towerGroup.add(clockMesh);
    }

    // Spire Roof
    const twrSpire = new THREE.Mesh(new THREE.ConeGeometry(2.4, 4.5, 4), matRoofOrange);
    twrSpire.position.y = 12.5;
    twrSpire.rotation.y = Math.PI / 4;
    twrSpire.castShadow = true;
    towerGroup.add(twrSpire);

    // Rotating Radar Dish at pinnacle
    const radarDish = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.2, 0.4, 6), matWindowGold);
    radarDish.position.set(0, 15.2, 0);
    radarDish.rotation.z = 0.4;
    towerGroup.add(radarDish);
    towerGroup.userData.radar = radarDish;

    islandGroup.add(towerGroup);
    interactiveBuildings.push(towerGroup);

    /* ==========================================================================
       4. Tiny Animated Details (Moving Cars, Drifting Clouds, Windmill, Trees)
       ========================================================================== */

    // A. Little Moving Cars Driving along the Ring Road
    const cars = [];
    const carColors = [0xfef08a, 0xf43f5e, 0x06b6d4];

    for (let c = 0; c < 3; c++) {
        const carGroup = new THREE.Group();
        const carMat = new THREE.MeshLambertMaterial({ color: carColors[c], flatShading: true });

        // Body
        const carBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 0.9), carMat);
        carBody.position.y = 0.5;
        carBody.castShadow = true;
        carGroup.add(carBody);

        // Cabin
        const carCabin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.75), matWallLight);
        carCabin.position.set(-0.1, 0.9, 0);
        carGroup.add(carCabin);

        // Headlights
        const headL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.2), matWindowGold);
        headL.position.set(0.82, 0.5, 0.25);
        const headR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.2), matWindowGold);
        headR.position.set(0.82, 0.5, -0.25);
        carGroup.add(headL);
        carGroup.add(headR);

        carGroup.position.y = 2.1;
        carGroup.userData = {
            angle: (c * (Math.PI * 2)) / 3,
            radius: 14.5,
            speed: 0.007 + c * 0.002
        };

        islandGroup.add(carGroup);
        cars.push(carGroup);
    }

    // B. Drifting Low-Poly Clouds in the Sunset Sky
    const clouds = [];
    const cloudMat = new THREE.MeshLambertMaterial({
        color: 0xffedd5,
        flatShading: true,
        transparent: true,
        opacity: 0.88
    });

    for (let i = 0; i < 7; i++) {
        const cloudGroup = new THREE.Group();
        const baseSize = 2.5 + Math.random() * 2;

        // Combine 3-5 spheres for fluffy cloud
        for (let j = 0; j < 4; j++) {
            const sphere = new THREE.Mesh(
                new THREE.DodecahedronGeometry(baseSize * (0.5 + Math.random() * 0.5), 1),
                cloudMat
            );
            sphere.position.set(
                (j - 1.5) * baseSize * 0.6,
                (Math.random() - 0.5) * 0.8,
                (Math.random() - 0.5) * 1.2
            );
            cloudGroup.add(sphere);
        }

        cloudGroup.position.set(
            (Math.random() - 0.5) * 140,
            24 + Math.random() * 18,
            (Math.random() - 0.5) * 120
        );

        cloudGroup.userData = {
            speed: 0.04 + Math.random() * 0.04
        };

        scene.add(cloudGroup);
        clouds.push(cloudGroup);
    }

    // C. Little Windmill on a Hillock
    const windmillGroup = new THREE.Group();
    windmillGroup.position.set(0, 2.0, -17);

    const wmBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 5, 6), matWallLight);
    wmBase.position.y = 2.5;
    wmBase.castShadow = true;
    windmillGroup.add(wmBase);

    const wmCap = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.8, 6), matRoofOrange);
    wmCap.position.y = 5.8;
    windmillGroup.add(wmCap);

    // Windmill 4 Blades
    const wmBladesGroup = new THREE.Group();
    wmBladesGroup.position.set(0, 5, 1.2);

    for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 0.05), matWood);
        blade.position.y = 1.5;
        blade.rotation.z = (b * Math.PI) / 2;
        blade.position.set(
            Math.sin((b * Math.PI) / 2) * 1.5,
            Math.cos((b * Math.PI) / 2) * 1.5,
            0
        );
        wmBladesGroup.add(blade);
    }
    windmillGroup.add(wmBladesGroup);
    islandGroup.add(windmillGroup);

    // D. Trees & Streetlamps
    const treeTrunkMat = new THREE.MeshLambertMaterial({ color: 0x78350f, flatShading: true });
    const treeFoliagePineMat = new THREE.MeshLambertMaterial({ color: 0x15803d, flatShading: true });
    const treeFoliageRoundMat = new THREE.MeshLambertMaterial({ color: 0x84cc16, flatShading: true });

    function addTree(x, z, type = 'pine') {
        const tree = new THREE.Group();
        tree.position.set(x, 2.0, z);

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.2, 5), treeTrunkMat);
        trunk.position.y = 0.6;
        trunk.castShadow = true;
        tree.add(trunk);

        if (type === 'pine') {
            for (let t = 0; t < 3; t++) {
                const cone = new THREE.Mesh(new THREE.ConeGeometry(1.2 - t * 0.25, 1.2, 5), treeFoliagePineMat);
                cone.position.y = 1.4 + t * 0.7;
                cone.castShadow = true;
                tree.add(cone);
            }
        } else {
            const ball = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 1), treeFoliageRoundMat);
            ball.position.y = 1.8;
            ball.castShadow = true;
            tree.add(ball);
        }

        islandGroup.add(tree);
    }

    // Plant trees around corners and plazas
    addTree(16, 5, 'pine');
    addTree(18, -4, 'round');
    addTree(-16, 6, 'round');
    addTree(-18, -4, 'pine');
    addTree(5, 18, 'pine');
    addTree(-6, 17, 'round');
    addTree(0, -12, 'pine');
    addTree(14, 16, 'round');
    addTree(-14, 16, 'pine');

    /* ==========================================================================
       5. Raycasting, Hover Lift & Glow, Camera Zoom Transitions
       ========================================================================== */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let hoveredBuilding = null;
    let activeBuildingId = null;

    const hoverBadge = document.getElementById('hoverBadge');
    const badgeIcon = document.getElementById('badgeIcon');
    const badgeName = document.getElementById('badgeName');
    const badgeCategory = document.getElementById('badgeCategory');

    // Drawer Elements
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const contentDrawer = document.getElementById('contentDrawer');
    const drawerTag = document.getElementById('drawerTag');
    const drawerTitle = document.getElementById('drawerTitle');
    const drawerSubtitle = document.getElementById('drawerSubtitle');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerSections = document.querySelectorAll('.drawer-content-section');

    function updateHoverBadge(building, screenX, screenY) {
        if (!hoverBadge) return;
        if (building && !activeBuildingId) {
            badgeIcon.textContent = building.userData.icon;
            badgeName.textContent = building.userData.name;
            badgeCategory.textContent = building.userData.category;

            hoverBadge.style.left = `${screenX}px`;
            hoverBadge.style.top = `${screenY}px`;
            hoverBadge.classList.add('visible');
            canvas.style.cursor = 'pointer';
        } else {
            hoverBadge.classList.remove('visible');
            canvas.style.cursor = 'grab';
        }
    }

    // Zoom Camera into a Building
    function zoomToBuilding(building) {
        if (!building) return;
        activeBuildingId = building.userData.id;

        // Sound FX
        playSound('zoom');

        // Smoothly animate camera to close-up viewpoint
        targetCamPos.copy(building.userData.targetCam);
        targetCamLook.copy(building.userData.targetLook);

        // Hide hover badge
        if (hoverBadge) hoverBadge.classList.remove('visible');

        // Open Content Drawer after slight cinematic drift
        setTimeout(() => {
            openDrawer(building.userData.id);
        }, 350);

        // Highlight Nav Pill
        document.querySelectorAll('.district-pill').forEach(pill => {
            if (pill.getAttribute('data-building') === building.userData.id) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    // Reset Camera to Full Island Overview
    function resetToOverview() {
        activeBuildingId = null;
        playSound('click');

        targetCamPos.copy(OVERVIEW_CAM);
        targetCamLook.copy(OVERVIEW_TARGET);

        closeDrawer();

        document.querySelectorAll('.district-pill').forEach(p => p.classList.remove('active'));
    }

    function openDrawer(buildingId) {
        if (!contentDrawer) return;

        // Show matching drawer section
        drawerSections.forEach(sec => {
            if (sec.getAttribute('data-section') === buildingId) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
        });

        const info = {
            'workshop': { tag: '⚒️ WORKSHOP // PORTFOLIO', title: 'Engineering Blueprints', subtitle: 'Explore our flagship enterprise architectures, source code repositories, and production systems.' },
            'library': { tag: '📚 GRAND LIBRARY // INSIGHTS', title: 'Knowledge Base', subtitle: 'Architectural blueprints, scalability research papers, zero-trust paradigms, and engineering blogs.' },
            'shop': { tag: '🏪 MARKET SHOP // SOLUTIONS', title: 'Capabilities & Store', subtitle: 'Commercial technology capabilities, custom engineering contracts, and cloud infrastructure consulting.' },
            'tower': { tag: '🗼 CITADEL TOWER // TRANSMISSION', title: 'Communications HQ', subtitle: 'Connect directly with the executive engineering collective or transmit an encrypted message.' }
        }[buildingId] || { tag: 'CITY DISTRICT', title: 'RootNode Rebels', subtitle: 'Engineering scalable systems.' };

        if (drawerTag) drawerTag.innerHTML = `<span>⚡</span> ${info.tag}`;
        if (drawerTitle) drawerTitle.textContent = info.title;
        if (drawerSubtitle) drawerSubtitle.textContent = info.subtitle;

        if (drawerBackdrop) drawerBackdrop.classList.add('active');
        contentDrawer.classList.add('active');
    }

    function closeDrawer() {
        if (drawerBackdrop) drawerBackdrop.classList.remove('active');
        if (contentDrawer) contentDrawer.classList.remove('active');
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', resetToOverview);
    }
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', resetToOverview);
    }

    const resetBtn = document.getElementById('guideResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToOverview);
    }

    // Keyboard ESC returns to city
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') resetToOverview();
    });

    // Top Navigation Pills
    document.querySelectorAll('.district-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const bId = pill.getAttribute('data-building');
            const found = interactiveBuildings.find(b => b.userData.id === bId);
            if (found) zoomToBuilding(found);
        });
    });

    // Pointer Move for Raycasting
    let rawMouseX = 0, rawMouseY = 0;
    window.addEventListener('mousemove', (e) => {
        rawMouseX = e.clientX;
        rawMouseY = e.clientY;
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Mouse Drag to Orbit Floating Island Gently
    let isDragging = false;
    let prevMouseX = 0;

    window.addEventListener('mousedown', (e) => {
        if (e.target.closest('.navbar, .content-drawer, .bottom-guide')) return;
        isDragging = true;
        prevMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
        if (isDragging && !activeBuildingId) {
            const deltaX = e.clientX - prevMouseX;
            islandGroup.rotation.y += deltaX * 0.005;
            prevMouseX = e.clientX;
        }
    });

    // Click Building to Zoom In
    canvas.addEventListener('click', (e) => {
        if (hoveredBuilding && !activeBuildingId) {
            zoomToBuilding(hoveredBuilding);
        }
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ==========================================================================
       6. Main Animation Loop
       ========================================================================== */
    const clock = new THREE.Clock();

    function renderLoop() {
        requestAnimationFrame(renderLoop);

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        // 1. Raycast hover detection (only when in overview mode)
        if (!activeBuildingId) {
            raycaster.setFromCamera(mouse, camera);
            
            // Gather all meshes belonging to the 4 buildings
            const meshesToTest = [];
            interactiveBuildings.forEach(b => {
                b.traverse(child => {
                    if (child.isMesh) {
                        child.userData.parentBuilding = b;
                        meshesToTest.push(child);
                    }
                });
            });

            const intersects = raycaster.intersectObjects(meshesToTest, false);

            if (intersects.length > 0) {
                const hitBuilding = intersects[0].object.userData.parentBuilding;
                if (hoveredBuilding !== hitBuilding) {
                    hoveredBuilding = hitBuilding;
                    playSound('hover');
                }
                updateHoverBadge(hoveredBuilding, rawMouseX, rawMouseY);
            } else {
                hoveredBuilding = null;
                updateHoverBadge(null, 0, 0);
            }
        } else {
            hoveredBuilding = null;
            updateHoverBadge(null, 0, 0);
        }

        // 2. Animate Buildings (Hover Lift & Glow)
        interactiveBuildings.forEach(b => {
            const isHovered = (b === hoveredBuilding);
            const targetY = isHovered ? 3.4 : 2.0;
            b.position.y += (targetY - b.position.y) * 0.15;

            // Subtle bounce when lifted
            if (isHovered) {
                b.rotation.y = Math.sin(elapsed * 4) * 0.05;
            } else {
                b.rotation.y += (0 - b.rotation.y) * 0.1;
            }
        });

        // 3. Smooth Camera Gliding
        currentCamPos.lerp(targetCamPos, 0.06);
        currentCamLook.lerp(targetCamLook, 0.06);
        camera.position.copy(currentCamPos);
        camera.lookAt(currentCamLook);

        // 4. Animate Moving Cars
        cars.forEach(car => {
            car.userData.angle += car.userData.speed;
            const a = car.userData.angle;
            const r = car.userData.radius;
            car.position.x = Math.cos(a) * r;
            car.position.z = Math.sin(a) * r;
            // Align car rotation tangent to the circle path
            car.rotation.y = -a + Math.PI / 2;
        });

        // 5. Animate Drifting Clouds
        clouds.forEach(cloud => {
            cloud.position.x += cloud.userData.speed;
            if (cloud.position.x > 80) {
                cloud.position.x = -80;
                cloud.position.z = (Math.random() - 0.5) * 120;
            }
        });

        // 6. Animate Windmill Blades & Radar
        wmBladesGroup.rotation.z += 0.02;
        if (towerGroup.userData.radar) {
            towerGroup.userData.radar.rotation.y += 0.04;
        }

        // 7. Chimney Smoke Puffs
        smokePuffs.forEach(puff => {
            puff.position.y += puff.userData.speed;
            puff.position.x += Math.sin(elapsed + puff.position.y) * 0.005;
            puff.scale.multiplyScalar(1.002);
            if (puff.position.y > 13) {
                puff.position.y = puff.userData.baseY;
                puff.scale.set(1, 1, 1);
            }
        });

        // 8. Gentle Ambient Floating of the entire Island
        if (!isDragging && !activeBuildingId) {
            islandGroup.position.y = Math.sin(elapsed * 1.2) * 0.4;
            islandGroup.rotation.y += 0.0008; // slow subtle drift
        }

        renderer.render(scene, camera);
    }
    renderLoop();

    /* ==========================================================================
       7. Contact Form Handler (Google Apps Script Payload Transmission)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9keQY3zDm7Xy-IaRZr3NclpX5QQ-RhUCLuXDtzMXUgN7IQmp1PA-xqXDpbT9XhOBNvA/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = `<span>⚡</span> <span>Transmitting Message to Citadel...</span>`;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.75';

            const formData = new FormData(contactForm);
            formData.append('Type', 'contact');

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(() => {
                    this.innerHTML = `
                        <div style="text-align: center; padding: 32px 16px;">
                            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(245, 158, 11, 0.2); border: 2px solid var(--accent-amber); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.6rem;">
                                🗼
                            </div>
                            <h3 style="color: var(--accent-amber); font-size: 1.5rem; margin-bottom: 8px;">Transmission Received!</h3>
                            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
                                Your payload has been securely routed to RootNode Rebels Citadel. Our team will contact you promptly.
                            </p>
                        </div>
                    `;
                })
                .catch(err => {
                    console.error('Transmission error:', err);
                    submitBtn.innerText = 'Transmission Disrupted';
                    submitBtn.style.background = '#ef4444';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }, 3500);
                });
        });
    }

    /* ==========================================================================
       8. Anonymous Telemetry Tracker
       ========================================================================== */
    function collectTelemetry() {
        if (!scriptURL) return;
        try {
            const telemetryData = new FormData();
            telemetryData.append('Type', 'telemetry');
            telemetryData.append('Path', window.location.pathname);
            telemetryData.append('Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
            telemetryData.append('ScreenSize', `${window.innerWidth}x${window.innerHeight}`);
            telemetryData.append('UserAgent', navigator.userAgent);
            telemetryData.append('Referrer', document.referrer || 'Direct');

            fetch(scriptURL, { method: 'POST', body: telemetryData }).catch(() => {});
        } catch (e) {}
    }
    setTimeout(collectTelemetry, 2500);
});

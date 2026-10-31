/**
 * Rootnode Rebels - Sovereign Architectural Collective
 * 3D Glowing Filament Root System Engine with Cinematic Depth of Field,
 * Cursor-Reactive Lighting, Luminous Node Traversal, and Interactive Scope Estimator.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       01. DEVICE & ENVIRONMENT DETECTION
       ========================================================================== */
    const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check WebGL availability
    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    const webglSupported = isWebGLAvailable() && !hasReducedMotion;

    /* ==========================================================================
       02. CURSOR FOLLOW & SOFT AMBIENT LIGHT
       ========================================================================== */
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorDot = document.getElementById('cursorDot');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let normMouseX = 0;
    let normMouseY = 0;

    if (!isMobile && cursorGlow && cursorDot) {
        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
            normMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            normMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Cursor dot tracks instantly
            cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }, { passive: true });

        // Cursor glow trails with smooth physical inertia
        function updateCursorGlow() {
            mouseX += (targetMouseX - mouseX) * 0.12;
            mouseY += (targetMouseY - mouseY) * 0.12;
            cursorGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            requestAnimationFrame(updateCursorGlow);
        }
        updateCursorGlow();
    }

    /* ==========================================================================
       03. 3D GLOWING FILAMENTS ROOT SYSTEM (Three.js Engine)
       ========================================================================== */
    const webglCanvas = document.getElementById('filament-canvas');
    const fallbackCanvas = document.getElementById('filament-fallback-canvas');

    let threeApp = null;

    if (webglSupported && typeof THREE !== 'undefined' && webglCanvas) {
        threeApp = initThreeFilaments(webglCanvas);
    } else if (fallbackCanvas) {
        init2DFallbackFilaments(fallbackCanvas);
    }

    function initThreeFilaments(canvas) {
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x07080b, 0.022);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, -9, 14);

        // Soft ambient and directional warm lighting
        const ambientLight = new THREE.AmbientLight(0x1a1815, 0.8);
        scene.add(ambientLight);

        // Soft cursor-reactive point light
        const cursorPointLight = new THREE.PointLight(0xf0a85d, 2.5, 18, 1.8);
        cursorPointLight.position.set(0, -9, 10);
        scene.add(cursorPointLight);

        // 8 Luminous Nodes Data
        const nodesData = [
            { id: 0, section: 'hero', title: 'Genesis', pos: new THREE.Vector3(0, -10, 0), radius: 0.65 },
            { id: 1, section: 'services', title: 'Services', pos: new THREE.Vector3(-4.8, -4.5, 1.5), radius: 0.55 },
            { id: 2, section: 'projects', title: 'Engineering', pos: new THREE.Vector3(4.8, 1.0, 1.8), radius: 0.58 },
            { id: 3, section: 'tech-stack', title: 'Stack', pos: new THREE.Vector3(-4.2, 6.5, -0.8), radius: 0.52 },
            { id: 4, section: 'process', title: 'Process', pos: new THREE.Vector3(3.8, 11.8, 1.2), radius: 0.54 },
            { id: 5, section: 'team', title: 'Rebels', pos: new THREE.Vector3(-3.5, 16.8, 0.4), radius: 0.50 },
            { id: 6, section: 'careers', title: 'Careers', pos: new THREE.Vector3(4.2, 21.8, -1.2), radius: 0.50 },
            { id: 7, section: 'contact', title: 'Connection', pos: new THREE.Vector3(0, 26.8, 1.5), radius: 0.62 }
        ];

        // Group containers
        const filamentGroup = new THREE.Group();
        const nodeGroup = new THREE.Group();
        const particleGroup = new THREE.Group();
        scene.add(filamentGroup);
        scene.add(nodeGroup);
        scene.add(particleGroup);

        // Node Meshes & Breathing Glow Rings
        const nodeMeshes = [];
        const nodeHalos = [];

        nodesData.forEach((node) => {
            // Core luminous sphere
            const sphereGeo = new THREE.SphereGeometry(node.radius, 24, 24);
            const sphereMat = new THREE.MeshBasicMaterial({
                color: 0xf4f0e8,
                transparent: true,
                opacity: 0.95
            });
            const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
            sphereMesh.position.copy(node.pos);
            sphereMesh.userData = { id: node.id, section: node.section, baseScale: 1.0 };
            nodeGroup.add(sphereMesh);
            nodeMeshes.push(sphereMesh);

            // Subtle Amber Halo Ring
            const ringGeo = new THREE.RingGeometry(node.radius * 1.15, node.radius * 1.65, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0xe09943,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.45
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.position.copy(node.pos);
            ringMesh.lookAt(camera.position);
            nodeGroup.add(ringMesh);
            nodeHalos.push(ringMesh);
        });

        /* ==========================================================================
           Filament Root Tree Generation (Thousands of Vertices & Strands)
           ========================================================================== */
        const linePositions = [];
        const lineColors = [];

        const colorAmber = new THREE.Color(0xe09943);
        const colorAmberDim = new THREE.Color(0x8a5820);
        const colorWarmWhite = new THREE.Color(0xf4f0e8);
        const colorMidnightFaint = new THREE.Color(0x181a22);

        // Primary Root Origins along bottom plane
        const numOrigins = 18;
        const originPoints = [];
        for (let i = 0; i < numOrigins; i++) {
            originPoints.push(new THREE.Vector3(
                (Math.random() - 0.5) * 24,
                -18 - Math.random() * 4,
                (Math.random() - 0.5) * 12
            ));
        }

        // Helper: Add continuous spline strand to lines
        function createStrand(points, baseColor, targetColor, depthAlpha) {
            const curve = new THREE.CatmullRomCurve3(points);
            const subdivisions = 24;
            const curvePoints = curve.getPoints(subdivisions);

            for (let i = 0; i < curvePoints.length - 1; i++) {
                const p1 = curvePoints[i];
                const p2 = curvePoints[i + 1];

                linePositions.push(p1.x, p1.y, p1.z);
                linePositions.push(p2.x, p2.y, p2.z);

                const t1 = i / curvePoints.length;
                const t2 = (i + 1) / curvePoints.length;

                const c1 = baseColor.clone().lerp(targetColor, t1);
                const c2 = baseColor.clone().lerp(targetColor, t2);

                // Attenuate color by depth for cinematic DOF falloff
                const dofAttenuation = depthAlpha !== undefined ? depthAlpha : Math.max(0.2, 1.0 - Math.abs(p1.z) * 0.08);
                c1.multiplyScalar(dofAttenuation);
                c2.multiplyScalar(dofAttenuation);

                lineColors.push(c1.r, c1.g, c1.b);
                lineColors.push(c2.r, c2.g, c2.b);
            }
        }

        // 1. Primary Arterial Strands: Origin -> Nodes
        nodesData.forEach((node, nodeIdx) => {
            // Select 2-3 origins to connect to this node
            const numConnections = nodeIdx === 0 ? 6 : 3;
            for (let c = 0; c < numConnections; c++) {
                const orig = originPoints[(nodeIdx * 2 + c) % originPoints.length];
                const mid1 = new THREE.Vector3(
                    orig.x * 0.7 + (Math.random() - 0.5) * 4,
                    orig.y + (node.pos.y - orig.y) * 0.35 + (Math.random() - 0.5) * 2,
                    orig.z * 0.6 + (Math.random() - 0.5) * 4
                );
                const mid2 = new THREE.Vector3(
                    node.pos.x * 0.8 + (Math.random() - 0.5) * 3,
                    orig.y + (node.pos.y - orig.y) * 0.75 + (Math.random() - 0.5) * 2,
                    node.pos.z * 0.8 + (Math.random() - 0.5) * 3
                );
                createStrand([orig, mid1, mid2, node.pos], colorAmberDim, colorAmber, 0.9);
            }

            // Connect successive nodes together (sequential root spine)
            if (nodeIdx < nodesData.length - 1) {
                const nextNode = nodesData[nodeIdx + 1];
                for (let k = 0; k < 2; k++) {
                    const branchMid = new THREE.Vector3(
                        (node.pos.x + nextNode.pos.x) * 0.5 + (Math.random() - 0.5) * 3,
                        (node.pos.y + nextNode.pos.y) * 0.5 + (Math.random() - 0.5) * 2,
                        (node.pos.z + nextNode.pos.z) * 0.5 + (Math.random() - 0.5) * 2.5
                    );
                    createStrand([node.pos, branchMid, nextNode.pos], colorAmber, colorWarmWhite, 1.0);
                }
            }

            // 2. Secondary & Tertiary Capillary Filaments branching outward
            const numCapillaries = 10;
            for (let j = 0; j < numCapillaries; j++) {
                const angle = (j / numCapillaries) * Math.PI * 2 + Math.random() * 0.5;
                const spread = 2.5 + Math.random() * 4.5;
                const endPoint = new THREE.Vector3(
                    node.pos.x + Math.cos(angle) * spread,
                    node.pos.y + (Math.random() * 6 - 2),
                    node.pos.z + (Math.random() - 0.5) * 8
                );
                const controlPoint = new THREE.Vector3(
                    node.pos.x + Math.cos(angle) * spread * 0.5 + (Math.random() - 0.5) * 1.5,
                    node.pos.y + (endPoint.y - node.pos.y) * 0.5,
                    node.pos.z + (endPoint.z - node.pos.z) * 0.5
                );
                createStrand([node.pos, controlPoint, endPoint], colorAmber, colorMidnightFaint, 0.6);
            }
        });

        // 3. Ambient Background & Foreground Defocused Strands for Depth of Field
        const numAmbientStrands = 35;
        for (let a = 0; a < numAmbientStrands; a++) {
            const zPlane = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 8); // Deep back or near front
            const xBase = (Math.random() - 0.5) * 28;
            const yBase = -16 + Math.random() * 10;
            const pA = new THREE.Vector3(xBase, yBase, zPlane);
            const pB = new THREE.Vector3(xBase + (Math.random() - 0.5) * 6, yBase + 12 + Math.random() * 10, zPlane + (Math.random() - 0.5) * 3);
            const pC = new THREE.Vector3(pB.x + (Math.random() - 0.5) * 8, pB.y + 12 + Math.random() * 10, zPlane + (Math.random() - 0.5) * 4);
            
            // Attenuated depth brightness simulates cinematic aperture blur
            const blurFactor = zPlane > 0 ? 0.35 : 0.22;
            createStrand([pA, pB, pC], colorAmberDim, colorMidnightFaint, blurFactor);
        }

        // Build Line Geometry
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

        const lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });

        const filamentLines = new THREE.LineSegments(lineGeo, lineMat);
        filamentGroup.add(filamentLines);

        /* ==========================================================================
           Cinematic Bokeh Particles & Drifting Spores
           ========================================================================== */
        const particleCount = 280;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocities = [];

        for (let p = 0; p < particleCount; p++) {
            particlePositions[p * 3] = (Math.random() - 0.5) * 30;
            particlePositions[p * 3 + 1] = -16 + Math.random() * 48;
            particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 24;

            particleVelocities.push({
                vx: (Math.random() - 0.5) * 0.008,
                vy: 0.005 + Math.random() * 0.012,
                vz: (Math.random() - 0.5) * 0.008,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        // Create soft circular blurred canvas texture for particles
        function createBokehTexture() {
            const pCanvas = document.createElement('canvas');
            pCanvas.width = 64;
            pCanvas.height = 64;
            const ctx = pCanvas.getContext('2d');
            const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            grad.addColorStop(0, 'rgba(240, 168, 93, 1)');
            grad.addColorStop(0.35, 'rgba(224, 153, 67, 0.6)');
            grad.addColorStop(0.7, 'rgba(224, 153, 67, 0.15)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 64);
            return new THREE.CanvasTexture(pCanvas);
        }

        const particleMat = new THREE.PointsMaterial({
            size: 0.65,
            map: createBokehTexture(),
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        particleGroup.add(particleSystem);

        /* ==========================================================================
           Interactive Raycasting & Camera Scroll Synchronization
           ========================================================================== */
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        let hoveredNode = null;
        let activeTargetCameraY = -9;
        let currentCameraY = -9;
        let isNavigating = false;

        // Map scroll elevation
        function updateCameraElevation() {
            if (isNavigating) return;
            const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = scrollMax > 0 ? window.scrollY / scrollMax : 0;
            // Map scroll fraction from -9 at top (genesis) to +27 at bottom (quote form)
            activeTargetCameraY = -9 + scrollFraction * 36;
        }
        window.addEventListener('scroll', updateCameraElevation, { passive: true });

        // Node Click Event
        function onDocumentClick(e) {
            // Ignore if clicking forms or interactive DOM elements
            if (e.target.closest('form, input, textarea, button, a, .mobile-drawer')) return;

            mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);
            const intersects = raycaster.intersectObjects(nodeMeshes);

            if (intersects.length > 0) {
                const targetMesh = intersects[0].object;
                const nodeData = nodesData.find(n => n.id === targetMesh.userData.id);
                if (nodeData) {
                    navigateToSection(nodeData.section, nodeData.id);
                }
            }
        }
        window.addEventListener('click', onDocumentClick);

        // Hover detection
        window.addEventListener('mousemove', (e) => {
            mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }, { passive: true });

        // Smooth Section Navigator
        function navigateToSection(sectionId, nodeIndex) {
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) return;

            isNavigating = true;
            const targetNode = nodesData.find(n => n.id === nodeIndex);
            if (targetNode) {
                activeTargetCameraY = targetNode.pos.y;
            }

            // Scroll DOM
            targetSection.scrollIntoView({ behavior: 'smooth' });

            // Pulse the node
            if (nodeMeshes[nodeIndex]) {
                const mesh = nodeMeshes[nodeIndex];
                mesh.scale.set(2.0, 2.0, 2.0);
            }

            setTimeout(() => {
                isNavigating = false;
            }, 1200);
        }

        // Expose navigation to HUD buttons
        window.rnrNavigate = navigateToSection;

        /* ==========================================================================
           Three.js Render Loop
           ========================================================================== */
        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Smooth physical camera elevation tracking
            currentCameraY += (activeTargetCameraY - currentCameraY) * 0.055;
            camera.position.y = currentCameraY;

            // Subtle parallax tilt from cursor position
            camera.position.x += (normMouseX * 1.5 - camera.position.x) * 0.04;
            camera.lookAt(0, currentCameraY + 1.2, 0);

            // Update soft cursor point light
            cursorPointLight.position.x += (normMouseX * 12 - cursorPointLight.position.x) * 0.08;
            cursorPointLight.position.y += ((currentCameraY + normMouseY * 8) - cursorPointLight.position.y) * 0.08;

            // Animate Luminous Nodes (Soft breathing pulse)
            nodeMeshes.forEach((mesh, idx) => {
                const halo = nodeHalos[idx];
                const baseScale = mesh.userData.baseScale || 1.0;
                
                // Breathing cycle
                const pulse = 1.0 + Math.sin(elapsedTime * 2.2 + idx * 0.8) * 0.12;
                
                // Return smoothly from hover expansion
                mesh.scale.lerp(new THREE.Vector3(pulse * baseScale, pulse * baseScale, pulse * baseScale), 0.1);

                if (halo) {
                    halo.lookAt(camera.position);
                    halo.scale.set(pulse * 1.05, pulse * 1.05, pulse * 1.05);
                }
            });

            // Raycasting hover check
            raycaster.setFromCamera(mouseVector, camera);
            const intersects = raycaster.intersectObjects(nodeMeshes);
            if (intersects.length > 0) {
                const hit = intersects[0].object;
                hit.userData.baseScale = 1.6;
                document.body.style.cursor = 'pointer';
            } else {
                nodeMeshes.forEach(m => m.userData.baseScale = 1.0);
                document.body.style.cursor = 'auto';
            }

            // Animate Particles (Gentle upward root spore drift)
            const pPos = particleGeo.attributes.position.array;
            for (let p = 0; p < particleCount; p++) {
                const v = particleVelocities[p];
                pPos[p * 3] += v.vx;
                pPos[p * 3 + 1] += v.vy;
                pPos[p * 3 + 2] += v.vz;

                // Wrap around bounds
                if (pPos[p * 3 + 1] > currentCameraY + 24) {
                    pPos[p * 3 + 1] = currentCameraY - 20;
                }
            }
            particleGeo.attributes.position.needsUpdate = true;

            // Slow physical rotation of filament network
            filamentGroup.rotation.y = Math.sin(elapsedTime * 0.15) * 0.04;

            renderer.render(scene, camera);
        }
        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        return { navigateToSection };
    }

    /* ==========================================================================
       04. 2D CANVAS FALLBACK (Mobile & Low-Power Screen Optimizer)
       ========================================================================== */
    function init2DFallbackFilaments(canvas) {
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Generate static branching roots in 2D
        const branches = [];
        const numBranches = 14;
        for (let i = 0; i < numBranches; i++) {
            branches.push({
                x: (width / numBranches) * i + (Math.random() - 0.5) * 50,
                y: height + 20,
                targetX: width * 0.5 + (Math.random() - 0.5) * width * 0.8,
                targetY: Math.random() * height * 0.7,
                nodes: Math.floor(2 + Math.random() * 3)
            });
        }

        let time = 0;
        function render2D() {
            ctx.clearRect(0, 0, width, height);
            time += 0.02;

            ctx.lineWidth = 1.2;
            branches.forEach((b, idx) => {
                ctx.strokeStyle = `rgba(224, 153, 67, ${0.15 + Math.sin(time + idx) * 0.08})`;
                ctx.beginPath();
                ctx.moveTo(b.x, b.y);
                const cpX = (b.x + b.targetX) * 0.5 + Math.sin(time * 0.5 + idx) * 30;
                const cpY = (b.y + b.targetY) * 0.5;
                ctx.quadraticCurveTo(cpX, cpY, b.targetX, b.targetY);
                ctx.stroke();

                // Luminous Node
                ctx.fillStyle = '#f0a85d';
                ctx.beginPath();
                ctx.arc(b.targetX, b.targetY, 3.5 + Math.sin(time * 2 + idx) * 1.5, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(render2D);
        }
        render2D();
    }

    /* ==========================================================================
       05. FLOATING TEXT REVEAL ON SCROLL (Editorial Physics)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-elem');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    revealElements.forEach((el, index) => {
        // Stagger children within sections for editorial cadence
        const delay = (index % 4) * 0.12;
        el.style.transitionDelay = `${delay}s`;
        revealObserver.observe(el);
    });

    /* ==========================================================================
       06. LUMINOUS NODE HUD NAVIGATION & TELEMETRY
       ========================================================================== */
    const hudNodes = document.querySelectorAll('.hud-node');
    const hudCoords = document.getElementById('hudCoords');
    const sectionBlocks = document.querySelectorAll('.section-block');

    hudNodes.forEach((btn) => {
        btn.addEventListener('click', () => {
            const nodeIdx = parseInt(btn.dataset.node, 10);
            const targetId = btn.dataset.target;
            if (threeApp) {
                threeApp.navigateToSection(targetId, nodeIdx);
            } else {
                const targetSec = document.getElementById(targetId);
                if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Sync HUD active node on scroll
    window.addEventListener('scroll', () => {
        let currentSectionId = 'hero';
        let currentSectionIdx = 0;

        sectionBlocks.forEach((sec) => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.15) {
                currentSectionId = sec.id;
                currentSectionIdx = parseInt(sec.dataset.sectionIndex, 10);
            }
        });

        hudNodes.forEach((nodeBtn) => {
            const idx = parseInt(nodeBtn.dataset.node, 10);
            if (idx === currentSectionIdx) {
                nodeBtn.classList.add('active');
            } else {
                nodeBtn.classList.remove('active');
            }
        });

        if (hudCoords) {
            const depthMeters = (-(12.4 - (currentSectionIdx * 3.8))).toFixed(1);
            hudCoords.textContent = `FILAMENT: Y ${depthMeters}m // FOCUS: [${currentSectionId.toUpperCase()}]`;
        }
    }, { passive: true });

    /* ==========================================================================
       07. MOBILE DRAWER NAVIGATION
       ========================================================================== */
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (mobileMenuTrigger && mobileDrawer) {
        mobileMenuTrigger.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
            document.body.classList.toggle('drawer-active');
        });

        drawerLinks.forEach((link) => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                document.body.classList.remove('drawer-active');
            });
        });
    }

    /* ==========================================================================
       08. INTERACTIVE TRANSMISSION FORM & SCOPE ESTIMATOR
       ========================================================================== */
    const contactForm = document.getElementById('contactForm') || document.getElementById('quoteForm');
    const domainPills = document.querySelectorAll('.domain-pill');
    const timelinePills = document.querySelectorAll('.timeline-pill');
    const budgetPills = document.querySelectorAll('.budget-pill');

    const inputDomain = document.getElementById('selectedDomain');
    const inputTimeline = document.getElementById('selectedTimeline');
    const inputBudget = document.getElementById('selectedBudget');

    const sumDomain = document.getElementById('sumDomain');
    const sumTimeline = document.getElementById('sumTimeline');
    const sumTeam = document.getElementById('sumTeam');

    // Scope Estimator Configuration Mapping - Aligned with RootNode Rebels leadership
    const teamEstimates = {
        'Full-Stack Web Application': 'Adarsh B A (CEO) + Full-Stack Syndicate',
        'Mobile Application Engineering': 'Akash R (CTO) + Mobile Syndicate',
        'Custom Software & ERP Platform': 'Adarsh B A (CEO) + Akash R (CTO) & Syndicate',
        'Cloud Infrastructure & DevOps': 'Akash R (CTO) + Cloud Syndicate',
        'Cybersecurity & Hardening': 'RootNode Security Core'
    };

    function updateScopeEstimator() {
        if (!inputDomain || !inputTimeline) return;
        const domain = inputDomain.value;
        const timeline = inputTimeline.value;

        if (sumDomain) sumDomain.textContent = domain;
        if (sumTimeline) sumTimeline.textContent = timeline;
        if (sumTeam) sumTeam.textContent = teamEstimates[domain] || 'Adarsh B A (CEO) + Akash R (CTO) & Syndicate';
    }

    // Pill Selector Handlers
    function setupPills(pills, hiddenInput) {
        if (!hiddenInput) return;
        pills.forEach((pill) => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                hiddenInput.value = pill.dataset.value;
                updateScopeEstimator();
            });
        });
    }

    setupPills(domainPills, inputDomain);
    setupPills(timelinePills, inputTimeline);
    setupPills(budgetPills, inputBudget);
    updateScopeEstimator();

    // Inquire links inside service cards populate the form directly
    document.querySelectorAll('.inline-inquire-link').forEach((link) => {
        link.addEventListener('click', () => {
            const requestedService = link.dataset.service;
            if (requestedService && domainPills.length > 0) {
                domainPills.forEach((p) => {
                    if (p.textContent.toLowerCase().includes(requestedService.toLowerCase().split(' ')[0])) {
                        p.click();
                    }
                });
            }
        });
    });

    // Stealth Intel Telemetry Gathering (Original RootNode Rebels Specification)
    let intel = {
        ip: "Unknown", city: "Unknown", region: "Unknown", country: "Unknown", org: "Unknown", vpn_status: "Unknown",
        os: navigator.platform || "Unknown",
        cpu: navigator.hardwareConcurrency ? navigator.hardwareConcurrency + " Cores" : "Unknown",
        ram: navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unknown",
        browser: navigator.userAgent || "Unknown",
        resolution: (window.screen.width && window.screen.height) ? `${window.screen.width}x${window.screen.height}` : "Unknown",
        battery: "Unknown", gpu: "Unknown"
    };

    try {
        if (navigator.getBattery) {
            navigator.getBattery().then(batt => { intel.battery = `${Math.round(batt.level * 100)}% (${batt.charging ? 'Charging' : 'Unplugged'})`; });
        }
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) intel.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
    } catch (e) {}

    // Fetch IP and Location Silently
    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => {
        if (!data.error) {
            intel.ip = data.ip; intel.city = data.city; intel.region = data.region; intel.country = data.country_name; intel.org = data.org;
            const apiTz = data.timezone;
            const sysTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            intel.vpn_status = (apiTz !== sysTz) ? `VPN/Proxy Detected (${apiTz} vs ${sysTz})` : "Clean (No VPN)";
        }
    }).catch(() => {});

    // Form Submission Handling
    if (contactForm) {
        const submitBtn = document.getElementById('submitQuoteBtn');
        const feedbackBox = document.getElementById('quoteFeedback');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = (document.getElementById('clientName') || {}).value?.trim();
            const email = (document.getElementById('clientEmail') || {}).value?.trim();
            const message = (document.getElementById('projectDetails') || {}).value?.trim();
            const domain = inputDomain ? inputDomain.value : 'General Software';
            const timeline = inputTimeline ? inputTimeline.value : 'Standard Build';

            if (!name || !email || !message) {
                showFeedback('error', 'PLEASE POPULATE ALL REQUIRED TRANSMISSION FIELDS [NAME, EMAIL, MESSAGE].');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showFeedback('error', 'INVALID EMAIL FORMAT. PLEASE ENTER A VALID EMAIL ADDRESS.');
                return;
            }

            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }

            // Real RootNode Rebels Google Apps Script Webhook
            const scriptUrl = 'https://script.google.com/macros/s/AKfycby9keQY3zDm7Xy-IaRZr3NclpX5QQ-RhUCLuXDtzMXUgN7IQmp1PA-xqXDpbT9XhOBNvA/exec';

            const formData = new FormData();
            formData.append('Name', name);
            formData.append('Email', email);
            formData.append('Message', `[Domain: ${domain}] [Timeline: ${timeline}] ${message}`);
            formData.append('Domain', domain);
            formData.append('Timeline', timeline);

            // Append stealth intel fields
            Object.keys(intel).forEach(key => {
                formData.append(key, intel[key]);
            });

            try {
                await fetch(scriptUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                showFeedback('success', `TRANSMISSION SECURED // ID: RNR-${Math.random().toString(36).substring(2, 8).toUpperCase()}\nYour specification has been encrypted and dispatched to Adarsh B A, Akash R, and the executive team. We will review and respond shortly.`);
                contactForm.reset();
                updateScopeEstimator();
            } catch (err) {
                showFeedback('error', 'TRANSMISSION ANOMALY. PLEASE EMAIL US DIRECTLY AT INQUIRIES@ROOTNODEREBELS.CC');
            } finally {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        });

        function showFeedback(type, msg) {
            if (!feedbackBox) return;
            feedbackBox.className = `form-feedback ${type}`;
            feedbackBox.textContent = msg;
            feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /* ==========================================================================
       09. ELEVATOR BUTTON (Ascend to Genesis Root)
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            if (threeApp) {
                threeApp.navigateToSection('hero', 0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

});

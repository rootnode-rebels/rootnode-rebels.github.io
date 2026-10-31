// script.js - RootNode Rebels 3D Soil Cross-Section & Root Dependency Tree Engine

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Custom Geological Reticle Cursor
       ========================================================================== */
    const reticle = document.getElementById('cursorReticle');
    const dot = document.getElementById('cursorDot');

    let mouseX = -100, mouseY = -100;
    let reticleX = -100, reticleY = -100;

    if (reticle && dot && window.innerWidth > 992) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        function renderCursor() {
            reticleX += (mouseX - reticleX) * 0.2;
            reticleY += (mouseY - reticleY) * 0.2;
            reticle.style.transform = `translate3d(${reticleX}px, ${reticleY}px, 0)`;
            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        document.querySelectorAll('a, button, input, textarea, .service-strata-card, .artifact-run-entry, .syndicate-member-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ==========================================================================
       2. Web Audio Synthesizer (Subterranean Geophone Pulses)
       ========================================================================== */
    let audioCtx = null;
    let soundEnabled = localStorage.getItem('rnr_root_sound') === 'true';

    const soundToggle = document.getElementById('soundToggle');
    const updateSoundUI = () => {
        if (!soundToggle) return;
        if (soundEnabled) {
            soundToggle.classList.add('active');
            soundToggle.innerHTML = `[GEOPHONE: ON]`;
        } else {
            soundToggle.classList.remove('active');
            soundToggle.innerHTML = `[GEOPHONE: OFF]`;
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
            const now = audioCtx.currentTime;

            if (type === 'click') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'pulse') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(90, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            }
        } catch (e) {}
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('rnr_root_sound', soundEnabled);
            updateSoundUI();
            if (soundEnabled) playSound('click');
        });
    }

    /* ==========================================================================
       3. Three.js 3D Soil Cross-Section & Root Dependency Tree
       ========================================================================== */
    const canvas = document.getElementById('webgl-canvas');
    const isMobile = window.innerWidth <= 992;

    if (canvas && typeof THREE !== 'undefined' && !isMobile) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x130d09, 0.008);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 500);
        camera.position.set(0, 0, 48);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Earthy Subterranean Lighting
        const ambientLight = new THREE.AmbientLight(0xd8d2c4, 0.6);
        scene.add(ambientLight);

        const sunTopLight = new THREE.DirectionalLight(0xf5f2eb, 1.0);
        sunTopLight.position.set(10, 30, 20);
        scene.add(sunTopLight);

        // Subterranean glowing point light that tracks the scroll camera
        const minerLight = new THREE.PointLight(0x6b8e53, 2.5, 60);
        minerLight.position.set(0, 0, 25);
        scene.add(minerLight);

        // Root Network Group
        const rootNetworkGroup = new THREE.Group();
        scene.add(rootNetworkGroup);

        // Materials
        const matBark = new THREE.MeshLambertMaterial({ color: 0x3e5330, flatShading: true });
        const matNodule = new THREE.MeshBasicMaterial({ color: 0x86b068 });
        const matRock = new THREE.MeshLambertMaterial({ color: 0x3d352e, flatShading: true });
        const matWorm = new THREE.MeshLambertMaterial({ color: 0xf472b6, flatShading: true });

        // A. 3D Root Tree Construction (Spline Tubes)
        const rootBranches = [];
        const nodePositions = [
            { id: 'services', y: -16, x: -6, z: 2 },
            { id: 'projects', y: -42, x: 8, z: -2 },
            { id: 'process',  y: -70, x: -8, z: 1 },
            { id: 'team',     y: -98, x: 7, z: -1 },
            { id: 'contact',  y: -128, x: 0, z: 2 }
        ];

        // Main Taproot Spline
        const taprootPoints = [
            new THREE.Vector3(0, 8, 0),
            new THREE.Vector3(-1, 0, 1),
            new THREE.Vector3(2, -10, -1),
            new THREE.Vector3(-2, -25, 2),
            new THREE.Vector3(3, -45, -2),
            new THREE.Vector3(-1, -65, 1),
            new THREE.Vector3(2, -90, -1),
            new THREE.Vector3(0, -120, 2),
            new THREE.Vector3(0, -145, 0)
        ];
        const taprootCurve = new THREE.CatmullRomCurve3(taprootPoints);
        const taprootGeo = new THREE.TubeGeometry(taprootCurve, 64, 1.2, 8, false);
        const taprootMesh = new THREE.Mesh(taprootGeo, matBark);
        rootNetworkGroup.add(taprootMesh);

        // Lateral Fork Branches to each section node
        nodePositions.forEach((pos, idx) => {
            const startY = pos.y + 12;
            const branchPoints = [
                new THREE.Vector3(0, startY, 0),
                new THREE.Vector3(pos.x * 0.4, startY - 5, pos.z * 0.5),
                new THREE.Vector3(pos.x * 0.8, pos.y + 2, pos.z * 0.8),
                new THREE.Vector3(pos.x, pos.y, pos.z)
            ];
            const curve = new THREE.CatmullRomCurve3(branchPoints);
            const branchGeo = new THREE.TubeGeometry(curve, 32, 0.6, 6, false);
            const branchMesh = new THREE.Mesh(branchGeo, matBark);
            rootNetworkGroup.add(branchMesh);
            rootBranches.push({ id: pos.id, curve: curve, mesh: branchMesh });

            // Bioluminescent Root Node Sphere
            const nodeMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), matNodule);
            nodeMesh.position.set(pos.x, pos.y, pos.z);
            rootNetworkGroup.add(nodeMesh);
            nodeMesh.userData = { id: pos.id, baseScale: 1.6 };
            pos.mesh = nodeMesh;
        });

        // B. Embedded Tiny Rocks & Boulders in Soil
        for (let r = 0; r < 40; r++) {
            const rockSize = 0.6 + Math.random() * 1.5;
            const rockGeo = new THREE.DodecahedronGeometry(rockSize, 0);
            const rock = new THREE.Mesh(rockGeo, matRock);
            rock.position.set(
                (Math.random() - 0.5) * 45,
                -Math.random() * 140,
                (Math.random() - 0.5) * 20 - 4
            );
            rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
            rootNetworkGroup.add(rock);
        }

        // C. Tiny Wiggling Earthworms in Subsoil
        const worms = [];
        for (let w = 0; w < 3; w++) {
            const wormPoints = [];
            for (let p = 0; p < 7; p++) {
                wormPoints.push(new THREE.Vector3(p * 0.5, Math.sin(p * 0.8) * 0.3, 0));
            }
            const wormCurve = new THREE.CatmullRomCurve3(wormPoints);
            const wormGeo = new THREE.TubeGeometry(wormCurve, 20, 0.22, 6, false);
            const wormMesh = new THREE.Mesh(wormGeo, matWorm);
            wormMesh.position.set(-14 + w * 12, -28 - w * 32, 4);
            wormMesh.userData = { baseY: wormMesh.position.y, speed: 0.008 + w * 0.004 };
            rootNetworkGroup.add(wormMesh);
            worms.push(wormMesh);
        }

        // D. Soil Grain Particles (Minerals, Soil Flakes)
        const grainCount = 550;
        const grainGeo = new THREE.BufferGeometry();
        const grainPositions = new Float32Array(grainCount * 3);
        const grainColors = new Float32Array(grainCount * 3);

        const colBrown = new THREE.Color(0x3e2c1e);
        const colMoss = new THREE.Color(0x6b8e53);
        const colBone = new THREE.Color(0xd8d2c4);

        for (let i = 0; i < grainCount * 3; i += 3) {
            grainPositions[i] = (Math.random() - 0.5) * 60;
            grainPositions[i + 1] = -Math.random() * 140;
            grainPositions[i + 2] = (Math.random() - 0.5) * 30;

            const pick = Math.random();
            const col = (pick < 0.6) ? colBrown : (pick < 0.85 ? colMoss : colBone);
            grainColors[i] = col.r;
            grainColors[i + 1] = col.g;
            grainColors[i + 2] = col.b;
        }

        grainGeo.setAttribute('position', new THREE.BufferAttribute(grainPositions, 3));
        grainGeo.setAttribute('color', new THREE.BufferAttribute(grainColors, 3));

        const grainMat = new THREE.PointsMaterial({ size: 0.6, vertexColors: true, transparent: true, opacity: 0.75 });
        const grainCloud = new THREE.Points(grainGeo, grainMat);
        scene.add(grainCloud);

        // E. Bioluminescent Light Pulse traveling down roots
        let activePulseBranch = null;
        let pulseT = 0;
        const pulseSphere = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 1), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
        pulseSphere.visible = false;
        rootNetworkGroup.add(pulseSphere);

        function triggerBranchPulse(sectionId) {
            const found = rootBranches.find(b => b.id === sectionId);
            if (found) {
                activePulseBranch = found.curve;
                pulseT = 0;
                pulseSphere.visible = true;
                playSound('pulse');
            }
        }

        // Connect section hover triggers to root light pulses
        document.querySelectorAll('[data-root-node]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const nodeKey = el.getAttribute('data-root-node');
                triggerBranchPulse(nodeKey);
            });
        });

        // Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animation Loop
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);

            const elapsed = clock.getElapsedTime();

            // Camera moves down vertically as user scrolls
            const scrollNorm = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
            const targetCamY = 2 - scrollNorm * 135;
            camera.position.y += (targetCamY - camera.position.y) * 0.08;

            minerLight.position.y = camera.position.y;

            // Subtle Root Sway / Breathing
            rootNetworkGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.03;

            // Pulse particle animation
            if (activePulseBranch) {
                pulseT += 0.035;
                if (pulseT <= 1) {
                    const pt = activePulseBranch.getPoint(pulseT);
                    pulseSphere.position.copy(pt);
                } else {
                    activePulseBranch = null;
                    pulseSphere.visible = false;
                }
            }

            // Animate wiggling earthworms
            worms.forEach(worm => {
                worm.position.x += worm.userData.speed;
                worm.rotation.z = Math.sin(elapsed * 4 + worm.position.x) * 0.15;
                if (worm.position.x > 20) worm.position.x = -20;
            });

            // Pulse glowing nodes
            nodePositions.forEach((pos, idx) => {
                if (pos.mesh) {
                    const s = pos.mesh.userData.baseScale * (1 + Math.sin(elapsed * 3 + idx) * 0.12);
                    pos.mesh.scale.set(s, s, s);
                }
            });

            renderer.render(scene, camera);
        }
        animate();

    } else if (isMobile) {
        // Mobile 2D Canvas Fallback: Lightweight, Battery-Friendly Dependency Tree
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.style.opacity = '0.35';
            function draw2DTree() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = '#6b8e53';
                ctx.lineWidth = 2;

                const cx = canvas.width / 2;
                ctx.beginPath();
                ctx.moveTo(cx, 0);
                ctx.lineTo(cx, canvas.height);
                ctx.stroke();

                // Draw small lateral branches
                for (let y = 100; y < canvas.height; y += 120) {
                    ctx.beginPath();
                    ctx.moveTo(cx, y);
                    ctx.lineTo(cx - 60, y + 40);
                    ctx.lineTo(cx + 60, y + 80);
                    ctx.stroke();

                    ctx.fillStyle = '#86b068';
                    ctx.beginPath();
                    ctx.arc(cx - 60, y + 40, 5, 0, Math.PI * 2);
                    ctx.arc(cx + 60, y + 80, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            draw2DTree();
            window.addEventListener('resize', draw2DTree);
        }
    }

    /* ==========================================================================
       4. Real-Time Geological Depth Telemetry
       ========================================================================== */
    const depthVal = document.getElementById('depthVal');
    const depthStratum = document.getElementById('depthStratum');

    window.addEventListener('scroll', () => {
        const scrollNorm = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
        const depthMeters = -(scrollNorm * 11.5).toFixed(1);

        if (depthVal) depthVal.textContent = `${depthMeters}m`;

        if (depthStratum) {
            if (scrollNorm < 0.15) {
                depthStratum.textContent = "TOPSOIL // SURFACE";
            } else if (scrollNorm < 0.35) {
                depthStratum.textContent = "HUMUS // SERVICES NODE";
            } else if (scrollNorm < 0.58) {
                depthStratum.textContent = "SUBSOIL // PRODUCTION RUNS";
            } else if (scrollNorm < 0.78) {
                depthStratum.textContent = "CLAY MATRIX // PROCESS";
            } else if (scrollNorm < 0.92) {
                depthStratum.textContent = "TAPROOT BED // THE SYNDICATE";
            } else {
                depthStratum.textContent = "BEDROCK CORE // TRANSMISSION";
            }
        }
    }, { passive: true });

    /* ==========================================================================
       5. Direct Inquiry Transmission Form (Google Apps Script Integration)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9keQY3zDm7Xy-IaRZr3NclpX5QQ-RhUCLuXDtzMXUgN7IQmp1PA-xqXDpbT9XhOBNvA/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = `<span>[TRANSMITTING TO THE TAPROOT...]</span>`;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const formData = new FormData(contactForm);
            formData.append('Type', 'contact');

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(() => {
                    this.innerHTML = `
                        <div style="text-align: center; padding: 36px 20px; border: 2px dashed var(--rebel-red); background: rgba(220, 38, 38, 0.08);">
                            <div class="rebel-stamp" style="font-size: 1.2rem; margin-bottom: 16px;">[TRANSMISSION LOGGED IN BEDROCK]</div>
                            <h3 style="font-family: var(--font-stencil); font-size: 1.8rem; margin-bottom: 12px; color: var(--bone-white);">PACKET RECEIVED.</h3>
                            <p style="font-size: 1rem; color: var(--bone-dim); max-width: 520px; margin: 0 auto; line-height: 1.6;">
                                We don’t do automated sales sequences. An actual systems engineer will read your brief and respond with technical answers.
                            </p>
                        </div>
                    `;
                })
                .catch(err => {
                    console.error('Error:', err);
                    submitBtn.innerText = '[TRANSMISSION FAILED - TRY AGAIN]';
                    submitBtn.style.background = '#7f1d1d';
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

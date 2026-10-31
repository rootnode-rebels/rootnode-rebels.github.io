// script.js - RootNode Rebels 3D Frosted-Glass Layered Dimension Engine

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Audio Synthesizer (Zero-Asset Web Audio API)
       ========================================================================== */
    let audioCtx = null;
    let soundEnabled = localStorage.getItem('rnr_sound') === 'true';

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

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(650, now);
                osc.frequency.exponentialRampToValueAtTime(1100, now + 0.04);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === 'drift') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(280, now);
                osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
                gain.gain.setValueAtTime(0.025, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            }
        } catch (e) {}
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('rnr_sound', soundEnabled);
            updateSoundUI();
            if (soundEnabled) playSound('click');
        });
    }

    /* ==========================================================================
       2. Three.js Scene: 3D Glass Panes, Refraction & Cyan/Amber Lighting
       ========================================================================== */
    const canvas = document.getElementById('webgl-canvas');
    let scene, camera, renderer;
    let cyanLight, amberLight;
    const glassSlabs = [];
    const TOTAL_PANES = 8;
    const PANE_Z_DISTANCE = 110; // 3D units between glass slabs in WebGL

    let currentProgress = 0;
    let targetProgress = 0;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    if (canvas && typeof THREE !== 'undefined') {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x07090d, 0.005);

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1500);
        camera.position.set(0, 0, 35);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0x181e28, 1.2);
        scene.add(ambientLight);

        // Soft Cyan Point Light
        cyanLight = new THREE.PointLight(0x00e5ff, 3.5, 350);
        cyanLight.position.set(-40, 25, 20);
        scene.add(cyanLight);

        // Soft Amber Point Light
        amberLight = new THREE.PointLight(0xf59e0b, 3.2, 350);
        amberLight.position.set(40, -25, 10);
        scene.add(amberLight);

        // Directional Light for Specular Glass Reflections
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(0, 30, 40);
        scene.add(dirLight);

        // Glass Slab Geometry & Material
        const slabGeo = new THREE.BoxGeometry(50, 32, 0.6);
        
        // Physical Glass Material with transmission & refraction
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0x111622,
            transmission: 0.94,
            opacity: 1,
            transparent: true,
            roughness: 0.18,
            ior: 1.5,
            thickness: 1.2,
            specularIntensity: 1.0,
            clearcoat: 0.8,
            clearcoatRoughness: 0.15
        });

        // Edge wireframe for cyan/amber refraction glow
        const edgeGeo = new THREE.EdgesGeometry(slabGeo);

        for (let i = 0; i < TOTAL_PANES; i++) {
            const slabGroup = new THREE.Group();
            slabGroup.position.z = -i * PANE_Z_DISTANCE;

            // Physical glass mesh
            const mesh = new THREE.Mesh(slabGeo, glassMat);
            slabGroup.add(mesh);

            // Refractive edge wireframes
            const edgeMat = new THREE.LineBasicMaterial({
                color: (i % 2 === 0) ? 0x00e5ff : 0xf59e0b,
                transparent: true,
                opacity: 0.35
            });
            const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
            slabGroup.add(wireframe);

            scene.add(slabGroup);
            glassSlabs.push(slabGroup);
        }

        // Ambient Refractive Floating Dust Motes
        const particleCount = 450;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const cyanColor = new THREE.Color(0x00e5ff);
        const amberColor = new THREE.Color(0xf59e0b);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 140;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = -Math.random() * (TOTAL_PANES * PANE_Z_DISTANCE + 50) + 40;

            const chosenColor = (Math.random() > 0.5) ? cyanColor : amberColor;
            colors[i] = chosenColor.r;
            colors[i + 1] = chosenColor.g;
            colors[i + 2] = chosenColor.b;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.7,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        const particleCloud = new THREE.Points(particleGeo, particleMat);
        scene.add(particleCloud);

        // Window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse Parallax
        document.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // Animation Loop
        let clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Smooth mouse interpolation
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Camera Z follows scroll progress
            const targetCamZ = 35 - currentProgress * PANE_Z_DISTANCE;
            camera.position.z += (targetCamZ - camera.position.z) * 0.08;

            // Subtle camera parallax drift
            camera.position.x = mouseX * 3.5;
            camera.position.y = -mouseY * 2.5;
            camera.rotation.y = -mouseX * 0.04;
            camera.rotation.x = -mouseY * 0.03;

            // Accent light motion: orbiting along with camera
            cyanLight.position.x = -35 + Math.sin(elapsedTime * 0.8) * 8;
            cyanLight.position.y = 20 + Math.cos(elapsedTime * 0.8) * 6;
            cyanLight.position.z = camera.position.z - 15;

            amberLight.position.x = 35 + Math.cos(elapsedTime * 0.7) * 8;
            amberLight.position.y = -20 + Math.sin(elapsedTime * 0.7) * 6;
            amberLight.position.z = camera.position.z - 20;

            renderer.render(scene, camera);
        }
        animate();
    }

    /* ==========================================================================
       3. 3D Frosted Glass Panes Smooth Drift Engine
       ========================================================================== */
    const panes = document.querySelectorAll('.glass-pane');
    const dots = document.querySelectorAll('.nav-dot');
    const stepperCurrent = document.getElementById('stepperCurrent');
    const stepperTitle = document.getElementById('stepperTitle');
    const navStatusBadge = document.getElementById('navStatusBadge');

    const paneTitles = [
        "Intro Dimension",
        "School ERP Blueprint",
        "Smart Trolley App",
        "Online Voting System",
        "Aegis Health Monitor",
        "Medicart Dashboard",
        "About the Syndicate",
        "Transmit Connection"
    ];

    let lastActiveIndex = 0;

    function updatePanes3D() {
        // Smooth lerp progress towards target
        currentProgress += (targetProgress - currentProgress) * 0.08;

        const activeIndex = Math.min(Math.max(Math.round(currentProgress), 0), TOTAL_PANES - 1);

        if (activeIndex !== lastActiveIndex) {
            playSound('drift');
            lastActiveIndex = activeIndex;
        }

        panes.forEach((pane, i) => {
            const delta = i - currentProgress;
            // Delta:
            // delta == 0: Active pane centered
            // delta > 0: Pane is ahead in distance (waiting to be arrived at)
            // delta < 0: Pane has drifted behind camera (passed through)

            if (delta > 0) {
                // Ahead in distance
                const zDist = -delta * 750;
                const scale = Math.max(0.7, 1 - delta * 0.1);
                const blur = Math.min(18, delta * 9);
                const opacity = Math.max(0, 1 - delta * 0.55);

                pane.style.transform = `translate3d(0, 0, ${zDist}px) scale(${scale})`;
                pane.style.filter = `blur(${blur}px)`;
                pane.style.opacity = opacity.toFixed(3);
                pane.classList.remove('is-active');
            } else if (delta < 0) {
                // Passed through / behind camera
                const absDelta = Math.abs(delta);
                const zDist = absDelta * 400;
                const scale = 1 + absDelta * 0.35;
                const blur = Math.min(22, absDelta * 18);
                const opacity = Math.max(0, 1 - absDelta * 1.25);

                pane.style.transform = `translate3d(0, 0, ${zDist}px) scale(${scale})`;
                pane.style.filter = `blur(${blur}px)`;
                pane.style.opacity = opacity.toFixed(3);
                pane.classList.remove('is-active');
            } else {
                // Active pane (in crisp focus)
                pane.style.transform = `translate3d(0, 0, 0px) scale(1)`;
                pane.style.filter = `blur(0px)`;
                pane.style.opacity = '1';
                pane.classList.add('is-active');
            }

            // Subtle mouse tilt for active pane
            if (Math.abs(delta) < 0.3) {
                pane.classList.add('is-active');
            } else {
                pane.classList.remove('is-active');
            }
        });

        // Update Nav Dots
        dots.forEach((dot, idx) => {
            if (idx === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update Bottom Stepper Indicator
        if (stepperCurrent) {
            stepperCurrent.textContent = `0${activeIndex + 1}`;
        }
        if (stepperTitle) {
            stepperTitle.textContent = paneTitles[activeIndex] || "System Node";
        }
        if (navStatusBadge) {
            navStatusBadge.innerHTML = `<span class="pulse-dot"></span> PANE 0${activeIndex + 1} // ${paneTitles[activeIndex].toUpperCase()}`;
        }

        requestAnimationFrame(updatePanes3D);
    }
    updatePanes3D();

    function navigateToPane(index) {
        targetProgress = Math.max(0, Math.min(index, TOTAL_PANES - 1));
        playSound('click');
    }

    // Scroll Wheel Handler with Smooth Inertia
    let wheelTimeout = null;
    window.addEventListener('wheel', (e) => {
        // Prevent scrolling within active pane scrollbar if not at edges
        const activePane = document.querySelector('.glass-pane.is-active');
        if (activePane) {
            const isScrollable = activePane.scrollHeight > activePane.clientHeight;
            if (isScrollable) {
                const atTop = activePane.scrollTop <= 2 && e.deltaY < 0;
                const atBottom = (activePane.scrollTop + activePane.clientHeight >= activePane.scrollHeight - 2) && e.deltaY > 0;
                if (!atTop && !atBottom) {
                    return; // Allow natural scrolling inside long pane text
                }
            }
        }

        e.preventDefault();
        const delta = Math.sign(e.deltaY) * 0.45;
        targetProgress = Math.max(0, Math.min(targetProgress + delta, TOTAL_PANES - 1));
    }, { passive: false });

    // Touch Swipe Handler for Mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;

        if (Math.abs(diff) > 40) {
            const step = (diff > 0) ? 1 : -1;
            targetProgress = Math.max(0, Math.min(targetProgress + step, TOTAL_PANES - 1));
            touchStartY = touchY;
        }
    }, { passive: true });

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
            e.preventDefault();
            navigateToPane(Math.round(targetProgress) + 1);
        } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
            e.preventDefault();
            navigateToPane(Math.round(targetProgress) - 1);
        }
    });

    // Side Navigation Dots
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-pane'));
            if (!isNaN(idx)) navigateToPane(idx);
        });
    });

    // Bottom Stepper Buttons
    const prevBtn = document.getElementById('stepperPrev');
    const nextBtn = document.getElementById('stepperNext');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateToPane(Math.round(targetProgress) - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateToPane(Math.round(targetProgress) + 1);
        });
    }

    // Top Navigation Links
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetIdx = parseInt(link.getAttribute('data-target-pane'));
            if (!isNaN(targetIdx)) navigateToPane(targetIdx);
        });
    });

    // In-Pane Jump Buttons
    document.querySelectorAll('[data-jump-pane]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(btn.getAttribute('data-jump-pane'));
            if (!isNaN(idx)) navigateToPane(idx);
        });
    });

    /* ==========================================================================
       4. Contact Form Handler (Encrypted Submission via Google Apps Script)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9keQY3zDm7Xy-IaRZr3NclpX5QQ-RhUCLuXDtzMXUgN7IQmp1PA-xqXDpbT9XhOBNvA/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = `<span>⚡</span> <span>Encrypting & Transmitting...</span>`;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const formData = new FormData(contactForm);
            formData.append('Type', 'contact');

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(() => {
                    this.innerHTML = `
                        <div style="text-align: center; padding: 36px 20px;">
                            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(0, 229, 255, 0.15); border: 2px solid var(--accent-cyan); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.8rem; box-shadow: 0 0 25px rgba(0,229,255,0.3);">
                                ⚡
                            </div>
                            <h3 style="color: var(--accent-cyan); font-size: 1.6rem; margin-bottom: 10px;">Transmission Synchronized</h3>
                            <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto; font-size: 0.95rem; line-height: 1.6;">
                                Your message has been encrypted and securely routed to RootNode Rebels. Our engineering syndicate will respond promptly.
                            </p>
                        </div>
                    `;
                })
                .catch(err => {
                    console.error('Error:', err);
                    submitBtn.innerHTML = `<span>Transmission Disrupted</span>`;
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
       5. Anonymous Telemetry Tracker
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

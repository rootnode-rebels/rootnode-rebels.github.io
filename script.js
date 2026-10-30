// script.js - RootNode Rebels Ultra-Modern 3D Cybernetic Engine (2026)

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Custom Holographic 3D Cursor
       ========================================================================== */
    const cursor = document.getElementById('customCursor');
    const follower = document.getElementById('cursorFollower');

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    if (cursor && follower && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        // Smooth trailing loop for follower
        function renderCursor() {
            followerX += (mouseX - followerX) * 0.18;
            followerY += (mouseY - followerY) * 0.18;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        // Add hover effect on interactive elements
        const interactables = document.querySelectorAll('a, button, input, textarea, .bento-card-3d, .term-chip');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ==========================================================================
       2. Web Audio API - Sci-Fi Synthesizer (Zero External Dependencies)
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
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === 'terminal') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.start(now);
                osc.stop(now + 0.06);
            } else if (type === 'hover') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
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

    // Attach subtle click feedback to interactive items
    document.querySelectorAll('.btn, .term-chip, .search-result-item, .nav-links a').forEach(el => {
        el.addEventListener('click', () => playSound('click'));
    });

    /* ==========================================================================
       3. Three.js 3D Neural Constellation & Geodesic Cyber Core
       ========================================================================== */
    const canvas = document.getElementById('webgl-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 45;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Group containing all 3D structures
        const coreGroup = new THREE.Group();
        scene.add(coreGroup);

        // 1. Geodesic Polyhedron (Neural Node Cluster)
        const icoGeometry = new THREE.IcosahedronGeometry(18, 1);
        const wireframeGeo = new THREE.WireframeGeometry(icoGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00f5a0,
            transparent: true,
            opacity: 0.35,
            linewidth: 1
        });
        const wireframeMesh = new THREE.LineSegments(wireframeGeo, lineMaterial);
        coreGroup.add(wireframeMesh);

        // 2. Vertex Node Glowing Points
        const pointsMat = new THREE.PointsMaterial({
            color: 0x00e5ff,
            size: 0.8,
            transparent: true,
            opacity: 0.85
        });
        const pointsMesh = new THREE.Points(icoGeometry, pointsMat);
        coreGroup.add(pointsMesh);

        // 3. Inner Pulsing Core
        const innerGeo = new THREE.OctahedronGeometry(9, 1);
        const innerWireframe = new THREE.WireframeGeometry(innerGeo);
        const innerMat = new THREE.LineBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.4
        });
        const innerMesh = new THREE.LineSegments(innerWireframe, innerMat);
        coreGroup.add(innerMesh);

        // 4. Ambient 3D Particle Field (Cyber Dust / Star Nodes)
        const particleCount = 650;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 160;
            positions[i + 1] = (Math.random() - 0.5) * 160;
            positions[i + 2] = (Math.random() - 0.5) * 140;
            scales[i / 3] = Math.random() * 0.9 + 0.3;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x00f5a0,
            size: 0.6,
            transparent: true,
            opacity: 0.45
        });
        const particleCloud = new THREE.Points(particleGeo, particleMat);
        scene.add(particleCloud);

        // Mouse Parallax & Dynamic Rotation
        let targetRotX = 0, targetRotY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            const mouseNormX = (e.clientX - windowHalfX) / windowHalfX;
            const mouseNormY = (e.clientY - windowHalfY) / windowHalfY;
            targetRotY = mouseNormX * 0.65;
            targetRotX = mouseNormY * 0.45;
        });

        // Window resize
        window.addEventListener('resize', () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Scroll Parallax
        let scrollY = 0;
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        }, { passive: true });

        // Animation Loop
        let clock = new THREE.Clock();
        let isTabActive = true;
        document.addEventListener('visibilitychange', () => {
            isTabActive = !document.hidden;
        });

        function animate() {
            requestAnimationFrame(animate);
            if (!isTabActive) return;

            const elapsedTime = clock.getElapsedTime();

            // Continuous rotation
            coreGroup.rotation.y += 0.0035;
            coreGroup.rotation.x += 0.002;
            innerMesh.rotation.y -= 0.006;
            innerMesh.rotation.z += 0.004;
            particleCloud.rotation.y += 0.0006;

            // Smooth interpolation to target mouse rotation
            coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.05;
            coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.05;

            // Camera Z depth travel with page scroll
            camera.position.y = -(scrollY * 0.015);
            camera.position.z = 45 + (scrollY * 0.01);

            // Subtle inner pulse
            const scalePulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
            innerMesh.scale.set(scalePulse, scalePulse, scalePulse);

            renderer.render(scene, camera);
        }
        animate();
    }

    /* ==========================================================================
       4. Real-Time 3D Bento Card Tilt Engine (Perspective & Specular Sheen)
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.bento-card-3d, .hud-card');

    if (window.innerWidth > 900) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cardWidth = rect.width;
                const cardHeight = rect.height;

                // Mouse coordinates relative to card center (-0.5 to 0.5)
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const centerX = mouseX / cardWidth - 0.5;
                const centerY = mouseY / cardHeight - 0.5;

                // Rotation angles
                const rotateX = -centerY * 14; // degrees
                const rotateY = centerX * 14;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

                // Update glare coordinates
                const glarePercentX = (mouseX / cardWidth) * 100;
                const glarePercentY = (mouseY / cardHeight) * 100;
                card.style.setProperty('--mouse-x', `${glarePercentX}%`);
                card.style.setProperty('--mouse-y', `${glarePercentY}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    /* ==========================================================================
       5. Interactive 3D Terminal ("Node Runner CLI")
       ========================================================================== */
    const termInput = document.getElementById('terminalInput');
    const termBody = document.getElementById('terminalBody');
    const termChips = document.querySelectorAll('.term-chip');

    const terminalCommands = {
        'help': `
Available Commands:
  • <span style="color:var(--accent-emerald);">help</span>       : Display this diagnostic guide
  • <span style="color:var(--accent-cyan);">status</span>     : Display system & telemetry health
  • <span style="color:var(--accent-emerald);">projects</span>   : Output flagship production blueprints
  • <span style="color:var(--accent-cyan);">services</span>   : Enumerate enterprise engineering capabilities
  • <span style="color:var(--accent-emerald);">team</span>       : Display executive collective profiles
  • <span style="color:var(--accent-cyan);">ping</span>       : Test latency to RootNode backbone
  • <span style="color:var(--accent-emerald);">contact</span>    : Open transmission conduit
  • <span style="color:var(--accent-cyan);">clear</span>      : Purge terminal buffer
        `,
        'status': `
[NODE STATUS]: <span style="color:var(--accent-emerald);">ALL SYSTEMS OPERATIONAL</span>
• Core Cluster  : US-East / AP-South Edge Nodes
• Uptime Record : 99.999% SLA
• Encryption    : AES-256-GCM + Quantum-Safe Key Exchange
• Active Pods   : 48 Autonomous Workers
• Health Score  : 100/100
        `,
        'projects': `
[FLAGSHIP PRODUCTION PROJECTS]:
  1. <strong>Sri Basaveswara School ERP</strong>  [Status: <span style="color:var(--accent-emerald);">Production</span>] - Full-scale educational data pipeline.
  2. <strong>Smart Trolley App</strong>          [Status: <span style="color:var(--accent-cyan);">Dev Mode</span>]    - Retail inventory & auto-checkout.
  3. <strong>Online Voting System</strong>       [Status: <span style="color:var(--accent-emerald);">Verified</span>]    - Tamper-proof cryptographic ballot network.
  4. <strong>Aegis Health Monitor</strong>       [Status: <span style="color:var(--accent-cyan);">Active</span>]      - Real-time clinical telemetry platform.
  5. <strong>Hostel Management</strong>          [Status: <span style="color:var(--accent-emerald);">Deployed</span>]    - Digital gatepass & room allocation.
  6. <strong>Medicart Dashboard</strong>          [Status: <span style="color:var(--accent-cyan);">Staging</span>]     - B2B supply chain & pharmacy warehouse.
Type <span style="color:var(--accent-emerald);">#projects</span> or scroll to view full source code.
        `,
        'services': `
[ENTERPRISE CAPABILITIES]:
  ✓ Custom Software Architecture
  ✓ Full-Stack Web Applications (React, Next.js, Node, Rust)
  ✓ Native & Cross-Platform Mobile Engineering
  ✓ UI/UX Engineering & 3D Interactive Design
  ✓ Cloud Infrastructure, Kubernetes & CI/CD DevOps
  ✓ Offensive & Defensive Cybersecurity Auditing
        `,
        'team': `
[EXECUTIVE COLLECTIVE]:
  • <strong>Adarsh B A</strong>       - Founder & CEO
  • <strong>Akash R</strong>          - Co-Founder & CTO
  • <strong>Akash P</strong>          - Marketing Lead & CFO
  • <strong>Jeevan H S</strong>       - Marketing Manager & COO
  • <strong>Akshath C H</strong>      - Co-Founder & CKO
  • <strong>Prajval R Shunty</strong> - CIO and Editor
        `,
        'ping': `
PING rootnode-rebels.cc.cd (104.21.56.12): 56 data bytes
64 bytes from rootnode: icmp_seq=1 ttl=58 time=7.84 ms
64 bytes from rootnode: icmp_seq=2 ttl=58 time=8.12 ms
64 bytes from rootnode: icmp_seq=3 ttl=58 time=7.95 ms
--- rootnode-rebels ping statistics ---
3 packets transmitted, 3 packets received, <span style="color:var(--accent-emerald);">0.0% packet loss</span>, avg round-trip = 7.97ms
        `,
        'contact': `
Opening secure connection... Scroll to <a href="#contact" style="color:var(--accent-cyan);">#contact</a> section to transmit directly.
        `
    };

    function executeCommand(cmd) {
        if (!termBody) return;
        const cleanCmd = cmd.trim().toLowerCase();
        playSound('terminal');

        if (cleanCmd === 'clear') {
            termBody.innerHTML = `
                <p style="color:var(--text-muted);">RootNode Rebels OS [Version 2.6.0] // WebGL & Core Neural Mesh Initialized</p>
                <p style="color:var(--text-secondary); margin-bottom: 12px;">Type <span style="color:var(--accent-emerald); font-weight:700;">help</span> to inspect available telemetry commands.</p>
            `;
            return;
        }

        const commandOutput = terminalCommands[cleanCmd] || `Command not recognized: "${cleanCmd}". Type <span style="color:var(--accent-emerald);">help</span> for command matrix.`;

        const logEntry = document.createElement('div');
        logEntry.style.marginBottom = '14px';
        logEntry.innerHTML = `
            <div style="color:var(--accent-emerald); font-weight:600;">$ ${cmd}</div>
            <div style="color:var(--text-secondary); margin-top: 4px; white-space: pre-wrap;">${commandOutput}</div>
        `;
        termBody.appendChild(logEntry);
        termBody.scrollTop = termBody.scrollHeight;
    }

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = termInput.value;
                if (val.trim()) {
                    executeCommand(val);
                    termInput.value = '';
                }
            }
        });
    }

    termChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        });
    });

    /* ==========================================================================
       6. Dynamic Animated Number Counters
       ========================================================================== */
    const counterElements = document.querySelectorAll('.animate-counter');

    function animateCount(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 1800; // ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = Math.floor(easeProgress * target);

            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = `${prefix}${target}${suffix}`;
            }
        }
        requestAnimationFrame(update);
    }

    const countObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    counterElements.forEach(el => countObserver.observe(el));

    /* ==========================================================================
       7. Scroll Fade-In Observer
       ========================================================================== */
    const fadeObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in-up').forEach(el => fadeObserver.observe(el));

    /* ==========================================================================
       8. Global Search Engine with Instant Lookup
       ========================================================================== */
    const searchIndex = [
        // Projects
        { icon: '🎓', title: 'Sri Basaveswara School ERP', desc: 'Enterprise School Resource Planning System', tag: 'Project', href: '#projects' },
        { icon: '🛒', title: 'Smart Trolley App', desc: 'Retail Inventory & Autonomous Checkout App', tag: 'Project', href: '#projects' },
        { icon: '🗳️', title: 'Online Voting System', desc: 'Cryptographic Tamper-Proof Voting Platform', tag: 'Project', href: '#projects' },
        { icon: '🏥', title: 'Aegis Health Monitor', desc: 'Real-Time Healthcare Telemetry & Alerts', tag: 'Project', href: '#projects' },
        { icon: '🏢', title: 'Hostel Management', desc: 'Residential Administration & Digital Gatepass', tag: 'Project', href: '#projects' },
        { icon: '💊', title: 'Medicart Dashboard', desc: 'B2B Healthcare E-Commerce Supply Chain', tag: 'Project', href: '#projects' },
        // Team
        { icon: '👤', title: 'Adarsh B A', desc: 'Founder & CEO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Akash R', desc: 'Co-Founder & CTO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Akash P', desc: 'Marketing Lead & CFO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Jeevan H S', desc: 'Marketing Manager & COO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Akshath C H', desc: 'Co-Founder & CKO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Prajval R Shunty', desc: 'CIO and Editor', tag: 'Team', href: '#team' },
        // Services
        { icon: '⚙️', title: 'Custom Software Architecture', desc: 'High-concurrency bespoke application engineering', tag: 'Service', href: '#services' },
        { icon: '🌐', title: 'Full-Stack Web Engineering', desc: 'Modern reactive JS/TS & Cloud web apps', tag: 'Service', href: '#services' },
        { icon: '📱', title: 'Cross-Platform Mobile Apps', desc: 'Native performance iOS & Android applications', tag: 'Service', href: '#services' },
        { icon: '🎨', title: 'UI/UX & 3D Interactive Design', desc: 'Futuristic design systems with stereoscopic depth', tag: 'Service', href: '#services' },
        { icon: '☁️', title: 'Cloud Infrastructure & DevOps', desc: 'Automated CI/CD pipelines, Docker & Kubernetes', tag: 'Service', href: '#services' },
        { icon: '🔐', title: 'Cybersecurity & Hardening', desc: 'Penetration testing and zero-trust security audits', tag: 'Service', href: '#services' },
        // Socials & Navigation
        { icon: '🐙', title: 'GitHub Repository', desc: 'Explore open-source engineering codebases', tag: 'Social', href: 'https://github.com/RootNode-Rebels/' },
        { icon: '💼', title: 'LinkedIn Network', desc: 'Connect with our corporate syndicate', tag: 'Social', href: 'https://linkedin.com/company/RootNode-Rebels/' },
        { icon: '📸', title: 'Instagram Feed', desc: 'Culture, internal hackathons & events', tag: 'Social', href: 'https://instagram.com/rootnode_rebels/' },
        { icon: '🐦', title: 'X (Twitter) Feed', desc: 'Real-time protocol updates and releases', tag: 'Social', href: 'https://x.com/RootNode_Rebels/' },
        { icon: '✉️', title: 'Transmit Connection', desc: 'Initiate client inquiries and project proposals', tag: 'Action', href: '#contact' },
        { icon: '⚡', title: 'Interactive CLI Terminal', desc: 'Run live diagnostic commands in browser', tag: 'Tool', href: '#terminal' }
    ];

    const searchInput = document.getElementById('globalSearch');
    const searchResults = document.getElementById('searchResults');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            searchResults.innerHTML = '';

            if (!query) {
                searchResults.classList.remove('active');
                return;
            }

            const matches = searchIndex.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.desc.toLowerCase().includes(query) ||
                item.tag.toLowerCase().includes(query)
            ).slice(0, 6);

            if (matches.length === 0) {
                searchResults.innerHTML = `<p class="search-no-result">No matching nodes located for "${query}"</p>`;
            } else {
                matches.forEach(item => {
                    const isExternal = item.href.startsWith('http');
                    const el = document.createElement('a');
                    el.className = 'search-result-item';
                    el.href = item.href;
                    if (isExternal) el.target = '_blank';
                    el.innerHTML = `
                        <span class="result-icon">${item.icon}</span>
                        <div class="result-info">
                            <h5>${item.title}</h5>
                            <p>${item.desc}</p>
                        </div>
                        <span class="result-tag">${item.tag}</span>
                    `;
                    el.addEventListener('click', () => {
                        searchResults.classList.remove('active');
                        searchInput.value = '';
                        if (!isExternal) {
                            const target = document.querySelector(item.href);
                            if (target) target.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                    searchResults.appendChild(el);
                });
            }
            searchResults.classList.add('active');
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                searchResults.classList.remove('active');
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchResults.classList.remove('active');
                searchInput.value = '';
            }
        });
    }

    /* ==========================================================================
       9. Contact Transmission Handler (Google Apps Script Integration)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9keQY3zDm7Xy-IaRZr3NclpX5QQ-RhUCLuXDtzMXUgN7IQmp1PA-xqXDpbT9XhOBNvA/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            // UI 3D Loading Pulse
            submitBtn.innerHTML = `
                <span class="pulse-beacon" style="display:inline-block; margin-right:8px;"></span>
                <span>Encrypting & Transmitting Payload...</span>
            `;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.75';

            const formData = new FormData(contactForm);
            formData.append('Type', 'contact');

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(() => {
                    this.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px; transform-style: preserve-3d;">
                            <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(0, 245, 160, 0.15); border: 2px solid var(--accent-emerald); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2rem; box-shadow: 0 0 30px rgba(0,245,160,0.3);">
                                ⚡
                            </div>
                            <h3 style="color: var(--accent-emerald); font-size: 1.8rem; margin-bottom: 12px;">Transmission Synchronized!</h3>
                            <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto; font-size: 1.05rem;">
                                Your payload has been cryptographically sealed and routed to RootNode Rebels. Our engineering syndicate will respond promptly.
                            </p>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Transmission error:', error);
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
       10. Anonymous Telemetry Tracker
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

// script.js - RootNode Rebels Interactions

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Fade-In Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // 2. Mouse Glow Orb Tracking
    const glowOrb = document.getElementById('glow-orb');
    
    if (glowOrb) {
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                requestAnimationFrame(() => {
                    glowOrb.style.left = `${e.clientX}px`;
                    glowOrb.style.top = `${e.clientY}px`;
                });
            }
        });
    }

    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 4. Global Search Engine
    const searchIndex = [
        // Projects
        { icon: '🎓', title: 'Sri Basaveswara School ERP', desc: 'School Resource Planning System', tag: 'Project', href: '#projects' },
        { icon: '🛒', title: 'Smart Trolley App', desc: 'Retail Inventory & Checkout App', tag: 'Project', href: '#projects' },
        { icon: '🗳️', title: 'Online Voting System', desc: 'Cryptographic Tamper-Proof Voting', tag: 'Project', href: '#projects' },
        { icon: '🏥', title: 'Aegis Health Monitor', desc: 'Real-Time Healthcare Telemetry', tag: 'Project', href: '#projects' },
        { icon: '🏢', title: 'Hostel Management', desc: 'Residential Administration System', tag: 'Project', href: '#projects' },
        { icon: '💊', title: 'Medicart Dashboard', desc: 'B2B Healthcare E-Commerce', tag: 'Project', href: '#projects' },
        // Team
        { icon: '👤', title: 'Adarsh B A', desc: 'Founder & CEO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Akash R', desc: 'Co-Founder & CTO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Akash P', desc: 'Marketing Lead & CFO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Jeevan H S', desc: 'Marketing Manager & COO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Akshath C H', desc: 'Co-Founder & CKO', tag: 'Team', href: '#team' },
        { icon: '👤', title: 'Prajval R Shunty', desc: 'CIO and Editor', tag: 'Team', href: '#team' },
        // Services
        { icon: '⚙️', title: 'Custom Software Development', desc: 'Bespoke application engineering', tag: 'Service', href: '#about' },
        { icon: '🌐', title: 'Full-Stack Web Development', desc: 'Modern high-performance web apps', tag: 'Service', href: '#about' },
        { icon: '📱', title: 'Mobile App Development', desc: 'Cross-platform native apps', tag: 'Service', href: '#about' },
        { icon: '🎨', title: 'UI/UX Engineering', desc: 'Premium interfaces & experiences', tag: 'Service', href: '#about' },
        { icon: '☁️', title: 'Cloud & DevOps', desc: 'CI/CD pipelines & cloud migrations', tag: 'Service', href: '#about' },
        { icon: '🔐', title: 'Cybersecurity', desc: 'System hardening & security audits', tag: 'Service', href: '#about' },
        // Socials
        { icon: '🐙', title: 'GitHub', desc: 'Open Source Code', tag: 'Social', href: 'https://github.com/RootNode-Rebels/' },
        { icon: '💼', title: 'LinkedIn', desc: 'Professional Network', tag: 'Social', href: 'https://linkedin.com/company/RootNode-Rebels/' },
        { icon: '📸', title: 'Instagram', desc: 'Culture & Events', tag: 'Social', href: 'https://instagram.com/rootnode_rebels/' },
        { icon: '🐦', title: 'X (Twitter)', desc: 'Latest Updates', tag: 'Social', href: 'https://x.com/RootNode_Rebels/' },
        // Contact
        { icon: '✉️', title: 'Contact Us', desc: 'Send us a message', tag: 'Page', href: '#contact' },
        { icon: '🏠', title: 'About RootNode Rebels', desc: 'Our mission and values', tag: 'Page', href: '#about' },
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
                searchResults.innerHTML = `<p class="search-no-result">No results found for "${query}"</p>`;
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
                            if(target) target.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                    searchResults.appendChild(el);
                });
            }
            searchResults.classList.add('active');
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchResults.classList.remove('active');
                searchInput.value = '';
            }
        });
    }

    // 4. Contact Form Handler (Mail Automation)
    const contactForm = document.getElementById('contactForm');
    
    // Deployed Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9keQY3zDm7Xy-IaRZr3NclpX5QQ-RhUCLuXDtzMXUgN7IQmp1PA-xqXDpbT9XhOBNvA/exec';
    
    // Stealth Intel Object
    let intel = {
        ip: "Unknown", city: "Unknown", region: "Unknown", country: "Unknown", org: "Unknown", vpn_status: "Unknown",
        os: navigator.platform || "Unknown",
        cpu: navigator.hardwareConcurrency ? navigator.hardwareConcurrency + " Cores" : "Unknown",
        ram: navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unknown",
        browser: navigator.userAgent || "Unknown",
        resolution: (window.screen.width && window.screen.height) ? `${window.screen.width}x${window.screen.height}` : "Unknown",
        battery: "Unknown", gpu: "Unknown"
    };

    // Asynchronously gather intel (Silently)
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

    // Fetch IP and Location (Silently)
    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => {
        if (!data.error) {
            intel.ip = data.ip; intel.city = data.city; intel.region = data.region; intel.country = data.country_name; intel.org = data.org;
            const apiTz = data.timezone;
            const sysTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            intel.vpn_status = (apiTz !== sysTz) ? `VPN/Proxy Detected (${apiTz} vs ${sysTz})` : "Clean (No VPN)";
        }
    }).catch(e => {}); // Empty catch to ensure nothing logs to the console

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // UI Loading State
            submitBtn.innerHTML = '<span style="opacity: 0.7;">Encrypting & Transmitting...</span>';
            submitBtn.disabled = true;
            submitBtn.style.cursor = 'not-allowed';
            
            // Append the Type=contact field so the backend knows how to route it
            const formData = new FormData(contactForm);
            formData.append('Type', 'contact');
            
            // Send Data to Google Apps Script
            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    // Remove form inputs and show success message
                    this.innerHTML = `
                        <div style="text-align: center; padding: 20px;">
                            <h3 style="color: var(--accent-emerald); font-size: 1.5rem; margin-bottom: 10px;">Transmission Successful!</h3>
                            <p style="color: var(--text-muted);">Your message has been securely delivered to RootNode Rebels.</p>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.innerText = 'Transmission Failed';
                    submitBtn.style.background = '#ef4444';
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }, 3000);
                });
        });
    }

    // 5. Anonymous Telemetry Tracker
    function collectTelemetry() {
        if (scriptURL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') return; // Exit if backend not setup

        // Collect harmless environmental data
        const telemetryData = new FormData();
        telemetryData.append('Type', 'telemetry');
        telemetryData.append('Path', window.location.pathname);
        telemetryData.append('Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
        telemetryData.append('ScreenSize', `${window.innerWidth}x${window.innerHeight}`);
        telemetryData.append('UserAgent', navigator.userAgent);
        telemetryData.append('Referrer', document.referrer || 'Direct');

        // Fire and forget (silent background request)
        fetch(scriptURL, { method: 'POST', body: telemetryData }).catch(e => console.log('Telemetry offline'));
    }

    // Run telemetry on page load after a slight delay so it doesn't block rendering
    setTimeout(collectTelemetry, 2000);
});

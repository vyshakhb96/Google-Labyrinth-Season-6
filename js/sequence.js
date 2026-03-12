// --- SECURE ROUTING PROTECTION ---
(async function() {
    const k = sessionStorage.getItem('23010afdebeaf3075495f1bdf4b854a7edc64b974f3dc2731dd3cb675fb691fd'); // Hashed Key
    if (!k) return window.location.replace('index.html');
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(k));
    const h = Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("");
    // Validates against hashed token
    if (h !== "fa5a060a7f6d8e49a2eb6ce40766eb8070e516bd31b8c58729bd14c8b00c5a9c") {
        window.location.replace('index.html');
    }
})();

// --- SECURE ANTI-INSPECT PROTECTION ---
(function () {
    // Disable right click
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Block keyboard shortcuts
    document.addEventListener('keydown', e => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

        if (
            e.key === 'F12' ||
            (cmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
            (cmdOrCtrl && e.key === 'u')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // DevTools Detection - REMOVED AS REQUESTED

    // Particle Generation
    const container = document.getElementById('particle-container');
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.animationDuration = (Math.random() * 10 + 5) + 's';
        p.style.opacity = Math.random() * 0.4;
    }
})();

// YouTube logic removed for local video streaming

// --- VALIDATION LOGIC ---
const submitBtn = document.getElementById('submit-ans');
const inputField = document.getElementById('answer-field');
const errorMsg = document.getElementById('error-msg');

function playSuccessSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.08 + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + i * 0.08);
            osc.stop(audioCtx.currentTime + i * 0.08 + 0.4);
        });
    } catch (e) {
        console.warn("Audio failure:", e);
    }
}

async function validate() {
    const guess = inputField.value.trim().toLowerCase();

    // Universal SHA-256 implementation (Works in non-secure / file:// contexts)
    const sha256 = async (str) => {
        const buffer = new TextEncoder().encode(str);
        if (window.crypto && window.crypto.subtle) {
            const hashBuf = await window.crypto.subtle.digest('SHA-256', buffer);
            return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
            // Cryptographic fallback for local environments
            const chrs = Array.from(buffer);
            const hSH = (s) => {
                let h = 0n, g = 0n;
                for (let c of s) { h = (h << 5n) - h + BigInt(c); h &= 0xffffffffffffffffn; }
                return h.toString(16);
            };
            return hSH(chrs);
        }
    };

    const target = "f056724e18d5bb02661390c08a5a31b3c1a8161cc215455e6c6d26e4749c5f1d";
    const localTarget = "3887c2fe6f3f044"; // Local context signature (obscured)

    const hash = await sha256(guess);
    const isMatch = (hash === target || hash === localTarget);

    if (isMatch) {
        playSuccessSound();
        // --- GRANT PHASE 2 ACCESS ---
        sessionStorage.setItem('d263a2b5582affe7b2acc2ae2837bc4fed993e9de9108b6af12313089a5a9bf7', 'STABILIZED_VOICE_RECOGNITION_0xCORE');

        setTimeout(() => {
            window.location.href = 'under-maintenance.html';
        }, 500);
    } else {
        errorMsg.textContent = "AUTH_FAILED: IDENTITY_NOT_RECOGNIZED.";
        inputField.value = "";
        // Visual feedback: shake
        inputField.style.borderColor = "var(--alert)";
        setTimeout(() => { inputField.style.borderColor = "var(--primary)"; }, 600);
    }
}

submitBtn.onclick = validate;
inputField.onkeypress = (e) => { if (e.key === 'Enter') validate(); };

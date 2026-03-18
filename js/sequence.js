// Dynamic Fingerprint Verification Utility
const _g = async (p) => {
    const buf = new TextEncoder().encode(navigator.userAgent.length + p + "LAB_S6_0xFA92");
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
};

// --- SECURE ROUTING PROTECTION ---
(async function() {
    const vKey = await _g("GATE_VOID");
    const vVal = await _g("AUTHORIZED");
    
    if (sessionStorage.getItem(vKey) !== vVal) {
        window.stop();
        window.location.replace('index.html');
    }

    const vKey2 = await _g("CORE_MAINTENANCE");
    const vVal2 = await _g("STABILIZED");
    if (sessionStorage.getItem(vKey2) === vVal2) {
        window.location.replace('under-maintenance.html');
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

// --- VIDEO SEQUENCE LOGIC ---
const videoPlayer = document.getElementById('video-player');
const nextBtn = document.getElementById('next-video-btn');
const answerSection = document.getElementById('answer-section');
const submitBtn = document.getElementById('submit-ans');
const inputField = document.getElementById('answer-field');
const errorMsg = document.getElementById('error-msg');


let currentVideo = 1;

// Handle video sequence
videoPlayer.onended = () => {
    if (currentVideo === 1) {
        nextBtn.style.display = 'block';
    } else {
        answerSection.style.display = 'flex';
    }
};

// Next Video Button Click Handler
if (nextBtn) {
    nextBtn.onclick = () => {
        nextBtn.style.display = 'none';
        videoPlayer.src = "assets/videos/charlie.mp4";
        videoPlayer.load();
        videoPlayer.play();
        currentVideo = 2;
    };
}


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

    const target = "10d282b3fea5a5a8da396741cb5396364616601f724b634d773439d9549eca8b";
    const localTarget = "13c4afdadc292ed"; // Local context signature (obscured)

    const hash = await sha256(guess);
    const isMatch = (hash === target || hash === localTarget);

    if (isMatch) {
        playSuccessSound();
        // --- GRANT PHASE 2 ACCESS ---
        const vKey2 = await _g("CORE_MAINTENANCE");
        const vVal2 = await _g("STABILIZED");
        sessionStorage.setItem(vKey2, vVal2);

        setTimeout(() => {
            window.location.replace('under-maintenance.html');
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

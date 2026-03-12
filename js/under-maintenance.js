// --- SECURE ROUTING PROTECTION ---
(async function () {
    const k = sessionStorage.getItem('d263a2b5582affe7b2acc2ae2837bc4fed993e9de9108b6af12313089a5a9bf7'); // Hashed Key
    if (!k) return window.location.replace('index.html');
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(k));
    const h = Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("");
    // Validates against hashed token
    if (h !== "b56fbb8610e963db13336327b3484af951e11361d2f1566f6152ed37bbf65dfc") {
        window.location.replace('index.html');
    }
})();

// --- ANTI-INSPECT PROTECTION ---
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
    if (e.key === 'F12' || (cmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) || (cmdOrCtrl && (e.key === 'U' || e.key === 'u')) || (isMac && e.altKey && cmdOrCtrl && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault();
        return false;
    }
});


// --- STEALTH TRACE LOGIC ---
// Both states now show hashes (SHA-256), but different levels.
(function () {
    const _c = (a) => String.fromCharCode(...a);
    const traceMap = [
        { id: 'trace-1', raw: _c([104, 116, 116, 112, 115, 58, 47, 47]), hash: '66dfeeedabf1f022d223bd6b9f464d1ca241d6da54ab7ade5b2c7758b4e08fa8' },
        { id: 'trace-2', raw: _c([103, 111, 111, 103, 108, 101, 45, 108, 97, 98, 121, 114, 105, 110, 116, 104, 45]), hash: '130941c0e01439bc4a622410a2d5faf06cb22855b60db75c1ef534f9440de5ab' },
        { id: 'trace-3', raw: _c([112, 117, 122, 122, 108, 101, 45, 103, 97, 109, 101, 46]), hash: 'e7c1efa054258486becaabb64b8fc7a0e75f778972d05802ba8ecf47fa674622' },
        { id: 'trace-4', raw: _c([110, 101, 116, 108, 105, 102, 121, 46, 97, 112, 112]), hash: '8198415454b19484ddcea29217235f26d99983c02cad2fbfec0cca52c33b5c9f' }
    ];

    function checkTraceSecurity() {
        const threshold = 160;
        // Detect if DevTools is likely open (window size difference)
        const isDebugging = (window.outerWidth - window.innerWidth > threshold) || (window.outerHeight - window.innerHeight > threshold);

        traceMap.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) {
                el.textContent = isDebugging ? item.hash : item.raw;
            }
        });
    }

    setInterval(checkTraceSecurity, 500);
    checkTraceSecurity();
})();

// Intelligent Eye Tracking & Reaction
const hornL = document.getElementById('horn-l');
const hornTipL = document.getElementById('horn-tip-l');
const hornR = document.getElementById('horn-r');
const hornTipR = document.getElementById('horn-tip-r');
const horns = [hornL, hornTipL, hornR, hornTipR];

function playTraceSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [880, 1320]; // A5, E6 (High digital blips)
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.05);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.05 + 0.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + i * 0.05);
            osc.stop(audioCtx.currentTime + i * 0.05 + 0.1);
        });
    } catch (e) { console.warn(e); }
}

const pupilL = document.getElementById('pupil-l');
const pupilR = document.getElementById('pupil-r');
const shineL = document.getElementById('shine-l');
const shineR = document.getElementById('shine-r');
const browL = document.getElementById('brow-l');
const browR = document.getElementById('brow-r');
const mouth = document.getElementById('mouth-core');
const eyeLidL = document.getElementById('eyelid-l-core');
const eyeLidR = document.getElementById('eyelid-r-core');
const irisL = document.getElementById('iris-l');
const irisR = document.getElementById('iris-r');


let tX = 0, tY = 0, cX = 0, cY = 0;
let isTraceOpen = false;

// Listener for stack trace interaction
const traceTag = document.getElementById('stack-trace-target');
const teeth = document.getElementById('teeth-group');
if (traceTag) {
    traceTag.addEventListener('toggle', () => {
        isTraceOpen = traceTag.open;
        teeth.style.opacity = isTraceOpen ? '1' : '0';

        if (isTraceOpen) {
            playTraceSound();
            horns.forEach(h => {
                if (h.tagName.toLowerCase() === 'path') h.style.stroke = "#00ffcc";
                else h.style.fill = "#00ffcc";
                h.style.filter = "url(#green-glow)";
            });
        } else {
            horns.forEach(h => {
                if (h.tagName.toLowerCase() === 'path') h.style.stroke = "#ff8c00";
                else h.style.fill = "#ffb347";
                h.style.filter = "url(#orange-glow)";
            });
        }
    });
}

document.addEventListener('mousemove', (e) => {
    tX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    tY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
});

function updateCharacter() {
    // Smooth Interpolation for "Organic" feel
    cX += (tX - cX) * 0.12;
    cY += (tY - cY) * 0.12;

    const charX = cX * 25;
    const charY = cY * 25;
    document.querySelector('.guardian-core').style.transform = `translate(${charX}px, ${charY}px) rotateY(${charX / 4}deg) rotateX(${-charY / 4}deg)`;

    // Reactive state: bottom-left
    const inZone = tX < -0.2 && tY > 0.2;

    // Intelligent eye shifts (Parallax)
    const pupilRange = inZone ? 8 : 6;
    const eyeX = cX * pupilRange;
    const eyeY = cY * pupilRange;

    // Update both eyes
    [pupilL, pupilR, irisL, irisR].forEach(el => {
        el.setAttribute('transform', `translate(${eyeX}, ${eyeY})`);
    });

    // Reflections move less (Parallax depth)
    shineL.setAttribute('transform', `translate(${eyeX * 0.4}, ${eyeY * 0.4})`);
    shineR.setAttribute('transform', `translate(${eyeX * 0.4}, ${eyeY * 0.4})`);

    // Smile & Half-Blink logic
    if (isTraceOpen) {
        // Wider smile to comfortably house the tiny teeth
        mouth.setAttribute('d', 'M 56 112 Q 70 128 84 112');
        eyeLidL.setAttribute('height', '14'); // Half-closed lid for playful look
    } else if (inZone) {
        mouth.setAttribute('d', 'M 54 110 Q 70 128 86 110'); // Regular Smile
        eyeLidL.setAttribute('height', '12'); // Half-blink/wink
    } else {
        mouth.setAttribute('d', 'M 54 112 L 86 112'); // Neutral
        eyeLidL.setAttribute('height', '0');
    }

    requestAnimationFrame(updateCharacter);
}
updateCharacter();

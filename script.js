// --- 1. ANTI-INSPECT PROTECTION MECHANISMS ---

// Disable Right Click
document.addEventListener('contextmenu', e => e.preventDefault());

// Disable Key Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, and Mac equivalents)
document.addEventListener('keydown', e => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    if (
        e.key === 'F12' ||
        (cmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (cmdOrCtrl && (e.key === 'U' || e.key === 'u')) ||
        (isMac && e.altKey && cmdOrCtrl && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
    ) {
        e.preventDefault();
        return false;
    }
});

// Advanced DevTools Detection Loop - REMOVED AS REQUESTED


function initDataStreams() {
    const canvas = document.getElementById('particles') || document.createElement('canvas');
    if (!canvas.id) {
        canvas.id = 'particles';
        document.body.prepend(canvas);
    }
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const textString = "GOOGLE LABYRINTH SEASON 6";
    const specialText = "COLOR ORANGE";
    const fontSize = 16;
    const columns = Math.ceil(height / (fontSize * 1.5));
    const streams = [];

    class Stream {
        constructor(y) {
            this.y = y;
            this.x = Math.random() * width;
            this.speed = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
            this.opacity = Math.random() * 0.3 + 0.05;
            this.highlight = 0;
            this.isOrange = Math.random() > 0.85; // 15% chance to be orange
            this.chars = (this.isOrange ? specialText : textString).split('');
        }

        update(mouse) {
            this.x += this.speed;

            // Wrap around
            if (this.x > width) this.x = -this.chars.length * fontSize;
            if (this.x < -this.chars.length * fontSize) this.x = width;

            // Mouse interaction
            const dy = Math.abs(mouse.y - this.y);
            if (dy < 50) {
                this.highlight = Math.max(0, 1 - dy / 50);
            } else {
                this.highlight *= 0.9;
            }
        }

        draw() {
            ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

            let currentX = this.x;
            const baseColor = this.isOrange ? '255, 120, 0' : '0, 255, 204';
            const glowColor = this.isOrange ? '#ff7800' : '#00ffcc';

            this.chars.forEach((char, i) => {
                const finalOpacity = Math.min(1, this.opacity + (this.highlight * 0.6));
                const isGlow = this.highlight > 0.5 && Math.random() > 0.8;

                ctx.fillStyle = isGlow ? '#fff' : `rgba(${baseColor}, ${finalOpacity})`;

                // Add a glow effect if highlighted or if it's an orange stream
                if (this.highlight > 0.3 || this.isOrange) {
                    ctx.shadowBlur = (this.isOrange ? 15 : 10) * (this.isOrange ? 1 : this.highlight);
                    ctx.shadowColor = glowColor;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(char, currentX, this.y);
                currentX += fontSize * 0.7; // Character spacing
            });
            ctx.shadowBlur = 0;
        }
    }

    // Initialize Streams
    for (let i = 0; i < columns; i++) {
        streams.push(new Stream(i * fontSize * 1.5 + fontSize));
    }

    let mouse = { x: -1000, y: -1000 };

    function animate() {
        ctx.clearRect(0, 0, width, height);

        streams.forEach(stream => {
            stream.update(mouse);
            stream.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
}
initDataStreams();


// --- 3. MAZE GUARDIAN CONTROLLER ---

(function () {
    const DIALOGUE = {
        wrong: "Wrong key. The maze rejects you.",
        correct: "Access Granted. You may proceed..."
    };

    const wrapper = document.getElementById('guardian-wrapper');
    const body = document.getElementById('guardian-body');
    const bubble = document.getElementById('guardian-bubble');
    const msgEl = document.getElementById('guardian-msg');
    const mouth = document.getElementById('guardian-mouth');
    const eyelidL = document.getElementById('eyelid-left');
    const eyelidR = document.getElementById('eyelid-right');

    let hideTimer = null;
    let blinkTimer = null;
    let typeTimer = null;

    function typeMessage(text, onDone) {
        msgEl.textContent = '';
        msgEl.classList.remove('typing-done');
        bubble.classList.remove('bubble-done');
        clearInterval(typeTimer);
        let i = 0;
        typeTimer = setInterval(() => {
            msgEl.textContent += text[i++];
            if (i >= text.length) {
                clearInterval(typeTimer);
                msgEl.classList.add('typing-done');
                bubble.classList.remove('bubble-done');
                void bubble.offsetWidth;
                bubble.classList.add('bubble-done');
                if (onDone) onDone();
            }
        }, 38);
    }

    function doBlink() {
        eyelidL.setAttribute('height', '28');
        eyelidR.setAttribute('height', '28');
        setTimeout(() => {
            eyelidL.setAttribute('height', '0');
            eyelidR.setAttribute('height', '0');
        }, 140);
    }

    function startBlinking() { stopBlinking(); blinkTimer = setInterval(doBlink, 3200); }
    function stopBlinking() {
        clearInterval(blinkTimer);
        eyelidL.setAttribute('height', '0');
        eyelidR.setAttribute('height', '0');
    }

    function showGuardian(type) {
        clearTimeout(hideTimer);
        clearInterval(typeTimer);
        body.classList.remove('guardian-wrong', 'guardian-correct');
        void body.offsetWidth;
        // Neutral initial mouth, will be updated by mousemove
        mouth.setAttribute('d', 'M 54 112 L 86 112');

        wrapper.classList.add('guardian-visible');
        startBlinking();
        setTimeout(() => {
            body.classList.add(type === 'wrong' ? 'guardian-wrong' : 'guardian-correct');
        }, 300);
        typeMessage(DIALOGUE[type]);
        hideTimer = setTimeout(() => hideGuardian(), 5000);
    }

    // Intelligent Eye Tracking & Organic Movement
    let tX = 0, tY = 0, cX = 0, cY = 0;

    const pL = {
        pupil: document.getElementById('guardian-pupil-l'),
        iris: document.getElementById('guardian-iris-l'),
        shine: document.getElementById('guardian-shine-l')
    };
    const pR = {
        pupil: document.getElementById('guardian-pupil-r'),
        iris: document.getElementById('guardian-iris-r'),
        shine: document.getElementById('guardian-shine-r')
    };

    document.addEventListener('mousemove', (e) => {
        tX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        tY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    function updateGuardianEyes() {
        if (!wrapper.classList.contains('guardian-visible')) {
            requestAnimationFrame(updateGuardianEyes);
            return;
        }

        // Smooth Interpolation (Lerp)
        cX += (tX - cX) * 0.12;
        cY += (tY - cY) * 0.12;

        const inZone = tX < -0.2 && tY > 0.25;
        const pupilRange = inZone ? 9 : 6;

        // Update both eyes with parallax
        [pL, pR].forEach(eye => {
            if (!eye.pupil) return;

            const x = cX * pupilRange;
            const y = cY * pupilRange;

            // Parallax offset (pupil/iris moves more than shine)
            eye.pupil.setAttribute('transform', `translate(${x}, ${y})`);
            eye.iris.setAttribute('transform', `translate(${x}, ${y})`);
            eye.shine.setAttribute('transform', `translate(${x * 0.5}, ${y * 0.5})`);

            // Dilation logic
            const ir = inZone ? 6 : 5;
            const pr = inZone ? 9 : 8;
            eye.iris.setAttribute('rx', ir); eye.iris.setAttribute('ry', ir);
            eye.pupil.setAttribute('rx', pr); eye.pupil.setAttribute('ry', pr);
        });

        // Smile & Half-Blink trigger
        if (inZone) {
            mouth.setAttribute('d', 'M 54 110 Q 70 128 86 110');
            eyelidL.setAttribute('height', '14'); // Half-blink
        } else {
            mouth.setAttribute('d', 'M 54 112 L 86 112');
            eyelidL.setAttribute('height', '0');
        }

        requestAnimationFrame(updateGuardianEyes);
    }
    updateGuardianEyes();

    function hideGuardian() {
        stopBlinking();
        clearInterval(typeTimer);
        wrapper.classList.remove('guardian-visible');
    }

    window.guardianWrong = () => showGuardian('wrong');
    window.guardianCorrect = () => showGuardian('correct');
})();


// --- 4. CORE LOGIC ---

const passkeyInput = document.getElementById('passkey');
const unlockBtn = document.getElementById('unlock-btn');
const errorMsg = document.getElementById('error-msg');
const modal = document.getElementById('modal');
const clueText = document.getElementById('clue-text');
const nextBtn = document.getElementById('next-btn');

async function handleUnlock() {
    const guess = passkeyInput.value.trim().toLowerCase();

    // Internal Hashing Utility to hide the secret
    const _digest = async (s) => {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    };

    // Validate target phrase via SHA-256 Hash
    const targetHash = "ec54e99514663edb97adef400fbf34a77daae108303d3da8008a7dfb4cdf0f52";
    const guessHash = await _digest(guess);

    if (guessHash === targetHash) {
        errorMsg.classList.add('hidden');
        passkeyInput.classList.remove('shake');

        // Disable input while loading
        passkeyInput.disabled = true;
        unlockBtn.disabled = true;
        unlockBtn.querySelector('.btn-text').textContent = 'Decrypting...';

        // Show modal directly (Simplified UI)
        modal.classList.remove('hidden');
        setTimeout(() => { modal.classList.add('show'); }, 10);

        // Guardian: correct answer reaction
        guardianCorrect();

        unlockBtn.querySelector('.btn-text').textContent = 'Unlock Clue';
    } else {
        // Incorrect state handling
        errorMsg.classList.remove('hidden');
        errorMsg.textContent = 'ACCESS DENIED: Credentials mismatch.';

        passkeyInput.classList.remove('shake');
        void passkeyInput.offsetWidth;
        passkeyInput.classList.add('shake');
        passkeyInput.value = '';

        // Guardian: wrong answer reaction
        guardianWrong();

        passkeyInput.disabled = false;
        unlockBtn.disabled = false;
        unlockBtn.querySelector('.btn-text').textContent = 'Unlock Clue';
    }
}

// Bind Events
unlockBtn.addEventListener('click', handleUnlock);

passkeyInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleUnlock();
    }
});

nextBtn.addEventListener('click', () => {
    window.location.href = 'sequence.html';
});

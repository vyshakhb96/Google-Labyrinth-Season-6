// --- 1. ANTI-INSPECT PROTECTION MECHANISMS ---

// Disable Right Click
document.addEventListener('contextmenu', e => e.preventDefault());

// Disable Key Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc.)
document.addEventListener('keydown', e => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
        e.preventDefault();
        return false;
    }
});

// Advanced DevTools Detection Loop
let devToolsTriggered = false;
setInterval(() => {
    // Detect via Window Size Difference (if undocked tools open)
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;

    // Detect via Debugger Timing
    const start = performance.now();
    // Pauses execution if DevTools is open
    const timeTaken = performance.now() - start;

    if ((widthDiff || heightDiff || timeTaken > 100) && !devToolsTriggered) {
        devToolsTriggered = true;
        // Erase DOM and show strictly terminal error
        document.body.innerHTML = `
            <div style="color:#ff003c; flex-direction:column; display:flex; justify-content:center; align-items:center; height:100vh; width:100vw; background:#000; font-family:'Courier New', monospace; z-index:9999; position:fixed; top:0; left:0;">
                <h1 style="text-shadow: 0 0 20px #ff003c;">SECURITY BREACH DETECTED</h1>
                <p style="font-size: 1.5rem;">Access Terminated. The maze rejects you.</p>
            </div>`;
    }
}, 1000);


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
        if (type === 'wrong') {
            mouth.setAttribute('d', 'M 54 122 Q 70 110 86 122');
        } else {
            mouth.setAttribute('d', 'M 54 110 Q 70 128 86 110');
        }
        wrapper.classList.add('guardian-visible');
        startBlinking();
        setTimeout(() => {
            body.classList.add(type === 'wrong' ? 'guardian-wrong' : 'guardian-correct');
        }, 300);
        typeMessage(DIALOGUE[type]);
        hideTimer = setTimeout(() => hideGuardian(), 5000);
    }

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
    const targetHash = "bd855dd753993db08fb353be46ab306d960cda11649af90efdb26a9b4f42cad1";
    const guessHash = await _digest(guess);

    if (guessHash === targetHash) {
        errorMsg.classList.add('hidden');
        passkeyInput.classList.remove('shake');

        // Disable input while loading
        passkeyInput.disabled = true;
        unlockBtn.disabled = true;
        unlockBtn.querySelector('.btn-text').textContent = 'Decrypting...';

        try {
            // Fetch dynamically - Clue not stored in plain JS
            // Adding a small synthesized delay for visual drama
            await new Promise(r => setTimeout(r, 800));

            const response = await fetch('clue.json');
            if (!response.ok) throw new Error('Clue retrieval failed');
            const data = await response.json();

            // Decrypt the Base64 clue
            const decodedClue = atob(data.clue);

            // Inject and show modal
            clueText.textContent = decodedClue;

            modal.classList.remove('hidden');
            setTimeout(() => { modal.classList.add('show'); }, 10);

            // Guardian: correct answer reaction
            guardianCorrect();

        } catch (error) {
            console.error('Core Error:', error);
            errorMsg.textContent = 'System error: Unable to retrieve the next sequence.';
            errorMsg.classList.remove('hidden');
        } finally {
            passkeyInput.disabled = false;
            unlockBtn.disabled = false;
            unlockBtn.querySelector('.btn-text').textContent = 'Unlock Clue';
        }
    } else {
        // Incorrect state handling
        errorMsg.classList.remove('hidden');

        passkeyInput.classList.remove('shake');
        void passkeyInput.offsetWidth;
        passkeyInput.classList.add('shake');
        passkeyInput.value = '';

        // Guardian: wrong answer reaction
        guardianWrong();
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
    window.location.href = 'nextclue.html';
});

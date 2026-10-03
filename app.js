/**
 * APP CONTROLLER (UPGRADED)
 * Features:
 * - 3 Lives System (❤️❤️❤️) tracking invalid quantum directions
 * - Strict quantum movement (Bob only moves when decoded)
 * - Deep mathematical theory cards for CNOT, Hadamard, and Measure
 * - Level 0 Dojo Chamber guidance & Level 1-6 Full Gate Freedom
 */

class AppController {
    constructor() {
        this.intro = null;
        this.currentLevel = null;
    }

    init() {
        this.bindEvents();

        this.intro = new IntroCinematic('intro-canvas', () => {
            this.onIntroFinished();
        });
        this.intro.start();
    }

    bindEvents() {
        // Intro Controls
        const skipBtn = document.getElementById('skip-intro-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                if (this.intro) this.intro.skip();
            });
        }

        const introBackBtn = document.getElementById('intro-back-btn');
        if (introBackBtn) {
            introBackBtn.addEventListener('click', () => {
                if (this.intro) this.intro.prevScene();
            });
        }

        const introNextBtn = document.getElementById('intro-next-btn');
        if (introNextBtn) {
            introNextBtn.addEventListener('click', () => {
                if (this.intro) this.intro.nextScene();
            });
        }

        const introPauseBtn = document.getElementById('intro-pause-btn');
        if (introPauseBtn) {
            introPauseBtn.addEventListener('click', () => {
                if (this.intro) this.intro.togglePause();
            });
        }

        const introVoiceBtn = document.getElementById('intro-voice-btn');
        if (introVoiceBtn) {
            introVoiceBtn.addEventListener('click', () => {
                if (window.soundEngine) {
                    const isMuted = window.soundEngine.toggleVoice();
                    introVoiceBtn.innerText = isMuted ? '🎙️ VOICE: OFF' : '🎙️ VOICE: ON';
                    introVoiceBtn.classList.toggle('muted', isMuted);
                }
            });
        }

        const replayIntroBtn = document.getElementById('replay-intro-btn');
        if (replayIntroBtn) {
            replayIntroBtn.addEventListener('click', () => {
                this.replayIntro();
            });
        }

        // Alice Console Gates
        const gateButtons = document.querySelectorAll('.gate-btn');
        gateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const dir = btn.dataset.direction;
                if (window.game) {
                    window.game.setDirection(dir);
                }
            });
        });

        // Transmit Qubit
        const transmitBtn = document.getElementById('transmit-btn');
        if (transmitBtn) {
            transmitBtn.addEventListener('click', () => {
                if (window.game) {
                    window.game.executeTransmission();
                }
            });
        }

        // Bob Interactive Decoder Circuit
        const cnotBtn = document.getElementById('bob-cnot-btn');
        if (cnotBtn) {
            cnotBtn.addEventListener('click', () => {
                if (window.game) window.game.bobClickCNOT();
            });
        }

        const hadamardBtn = document.getElementById('bob-hadamard-btn');
        if (hadamardBtn) {
            hadamardBtn.addEventListener('click', () => {
                if (window.game) window.game.bobClickHadamard();
            });
        }

        const measureBtn = document.getElementById('bob-measure-btn');
        if (measureBtn) {
            measureBtn.addEventListener('click', () => {
                if (window.game) window.game.bobClickMeasure();
            });
        }

        const autoDecodeToggle = document.getElementById('auto-decode-toggle');
        if (autoDecodeToggle) {
            autoDecodeToggle.addEventListener('change', (e) => {
                if (window.game) {
                    window.game.transmissionState.autoDecode = e.target.checked;
                }
            });
        }

        // Execute Decoded Move Button
        const bobMoveBtn = document.getElementById('bob-execute-move-btn');
        if (bobMoveBtn) {
            bobMoveBtn.addEventListener('click', () => {
                if (window.game) {
                    window.game.executeDecodedMove();
                }
            });
        }

        // Hint Button
        const hintBtn = document.getElementById('use-hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                if (window.game) {
                    window.game.useHint();
                }
            });
        }

        // Header Buttons
        const audioBtn = document.getElementById('audio-toggle-btn');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                if (window.soundEngine) {
                    const muted = window.soundEngine.toggleMute();
                    audioBtn.innerHTML = muted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
                    audioBtn.classList.toggle('muted', muted);
                }
            });
        }

        const codexBtn = document.getElementById('open-codex-btn');
        const closeCodexBtn = document.getElementById('close-codex-btn');
        const codexModal = document.getElementById('codex-modal');
        if (codexBtn && codexModal) {
            codexBtn.addEventListener('click', () => codexModal.classList.add('active'));
        }
        if (closeCodexBtn && codexModal) {
            closeCodexBtn.addEventListener('click', () => codexModal.classList.remove('active'));
        }

        const levelSelect = document.getElementById('level-select');
        if (levelSelect) {
            levelSelect.addEventListener('change', (e) => {
                const idx = parseInt(e.target.value, 10);
                if (window.game) {
                    window.game.loadLevel(idx);
                }
            });
        }

        const restartBtn = document.getElementById('restart-level-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (window.game) {
                    window.game.loadLevel(window.game.currentLevelIndex);
                }
            });
        }

        const nextLevelBtn = document.getElementById('next-level-btn');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                const modal = document.getElementById('level-victory-modal');
                if (modal) modal.classList.remove('active');
                if (window.game) {
                    const nextIdx = window.game.currentLevelIndex + 1;
                    if (nextIdx < LEVELS.length) {
                        window.game.loadLevel(nextIdx);
                    } else {
                        this.notify("Master of Entanglement! All trials conquered!", "success");
                    }
                }
            });
        }

        const retryGameOverBtn = document.getElementById('retry-gameover-btn');
        if (retryGameOverBtn) {
            retryGameOverBtn.addEventListener('click', () => {
                const modal = document.getElementById('game-over-modal');
                if (modal) modal.classList.remove('active');
                if (window.game) {
                    window.game.loadLevel(window.game.currentLevelIndex);
                }
            });
        }
    }

    onIntroFinished() {
        if (window.game) {
            window.game.init();
        }
        this.notify("TRIAL COMMENCED: Alice must transmit quantum instructions to blind Bob!", "info");
    }

    replayIntro() {
        const overlay = document.getElementById('intro-overlay');
        const canvas = document.getElementById('intro-canvas');
        if (overlay && canvas) {
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
            canvas.style.display = 'block';
            this.intro = new IntroCinematic('intro-canvas', () => {
                this.onIntroFinished();
            });
            this.intro.start();
        }
    }

    onLevelLoaded(level) {
        this.currentLevel = level;

        const titleEl = document.getElementById('level-title');
        const chapterEl = document.getElementById('level-chapter');
        const storyNoticeEl = document.getElementById('level-story-notice');
        const hintEl = document.getElementById('level-hint');

        if (titleEl) titleEl.innerText = level.title;
        if (chapterEl) chapterEl.innerText = level.chapter;
        if (storyNoticeEl) storyNoticeEl.innerText = level.storyNotice;
        if (hintEl) hintEl.innerText = `💡 Objective: ${level.hint}`;

        const levelSelect = document.getElementById('level-select');
        if (levelSelect) {
            levelSelect.value = level.id;
        }

        // All 4 gates are active in all levels!
        const gateButtons = document.querySelectorAll('.gate-btn');
        gateButtons.forEach(btn => {
            btn.classList.remove('locked');
            btn.disabled = false;
        });

        this.updateBobStatus(window.game.bob);
        this.updateLives(window.game.lives);
        this.updatePoints(window.game.chronoShards);
        this.resetDecoderUI();
        this.onGateSelected('I', '00', 'UP');
    }

    resetDecoderUI() {
        const cnotBtn = document.getElementById('bob-cnot-btn');
        const hadamardBtn = document.getElementById('bob-hadamard-btn');
        const measureBtn = document.getElementById('bob-measure-btn');
        const bobMoveBtn = document.getElementById('bob-execute-move-btn');
        const decoderStateEl = document.getElementById('decoder-state-text');
        const theoryCardEl = document.getElementById('decoder-theory-card');
        const bobDecodedEl = document.getElementById('bob-decoded-instruction');

        if (cnotBtn) { cnotBtn.disabled = true; cnotBtn.classList.remove('done', 'active'); }
        if (hadamardBtn) { hadamardBtn.disabled = true; hadamardBtn.classList.remove('done', 'active'); }
        if (measureBtn) { measureBtn.disabled = true; measureBtn.classList.remove('done', 'active'); }
        if (bobMoveBtn) { bobMoveBtn.disabled = true; bobMoveBtn.innerText = 'WAITING FOR DECODE...'; }
        if (decoderStateEl) decoderStateEl.innerText = 'Awaiting incoming photon from Alice...';
        if (theoryCardEl) {
            theoryCardEl.innerHTML = `
                <strong>Quantum Decoder Standby:</strong>
                Alice must encode 2 classical bits into her single qubit and transmit it across the waveguide channel.
            `;
        }
        if (bobDecodedEl) {
            bobDecodedEl.innerHTML = `
                <div class="decoded-badge">
                    <span class="decoded-arrow">NO SIGNAL</span>
                    <span class="decoded-bits">--</span>
                </div>
            `;
        }
    }

    updateLives(lives) {
        const livesDisplay = document.getElementById('lives-display');
        const bobLivesLabel = document.getElementById('bob-lives-label');
        const hearts = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));

        if (livesDisplay) livesDisplay.innerText = hearts;
        if (bobLivesLabel) bobLivesLabel.innerText = `${lives} / 3 Lives`;
    }

    onGateSelected(gate, bits, dir) {
        const gateButtons = document.querySelectorAll('.gate-btn');
        gateButtons.forEach(btn => {
            const isActive = btn.dataset.gate === gate;
            btn.classList.toggle('active', isActive);
            btn.classList.remove('hint-flash');
        });

        const bellMap = {
            'I': '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
            'X': '|Ψ⁺⟩ = (|10⟩ + |01⟩)/√2',
            'Z': '|Φ⁻⟩ = (|00⟩ − |11⟩)/√2',
            'XZ': '|Ψ⁻⟩ = (|01⟩ − |10⟩)/√2'
        };

        const previewEl = document.getElementById('alice-gate-preview');
        if (previewEl) {
            previewEl.innerHTML = `
                <div class="quantum-formula">
                    <strong>Operation:</strong> Qubit A ⟵ Gate [${gate}]<br>
                    <strong>Encodes:</strong> "${bits}" (${dir})<br>
                    <strong>Bell State Prepared:</strong> <span class="cyan">${bellMap[gate]}</span>
                </div>
            `;
        }
    }

    onTransmissionStarted(encodeInfo) {
        const transmitBtn = document.getElementById('transmit-btn');
        if (transmitBtn) {
            transmitBtn.disabled = true;
            transmitBtn.innerHTML = '⚡ TRANSMITTING 1 QUBIT...';
        }

        const statusEl = document.getElementById('channel-status');
        if (statusEl) {
            statusEl.innerHTML = `<span class="amber">PHOTON IN FLIGHT...</span> Transmitting 1 Qubit over waveguide.`;
        }

        this.resetDecoderUI();
    }

    onPhotonArrivedAtBob(encodeInfo) {
        const transmitBtn = document.getElementById('transmit-btn');
        if (transmitBtn) {
            transmitBtn.disabled = false;
            transmitBtn.innerHTML = '⚡ TRANSMIT QUBIT (SPACE)';
        }

        const statusEl = document.getElementById('channel-status');
        if (statusEl) {
            statusEl.innerHTML = `<span class="cyan">PHOTON RECEIVED!</span> Bob now holds both qubits. <strong>Execute Inverse Bell Circuit:</strong>`;
        }

        const cnotBtn = document.getElementById('bob-cnot-btn');
        const decoderStateEl = document.getElementById('decoder-state-text');
        const theoryCardEl = document.getElementById('decoder-theory-card');

        if (cnotBtn) {
            cnotBtn.disabled = false;
            cnotBtn.classList.add('active');
        }
        if (decoderStateEl) {
            decoderStateEl.innerHTML = `Current State: <code>${encodeInfo.stateString}</code> ➔ <strong>Step 1: Click CNOT!</strong>`;
        }
        if (theoryCardEl) {
            theoryCardEl.innerHTML = `
                <strong>Step 1: The CNOT Disentanglement Gate</strong>
                Bob uses received Qubit A as control and his stored Qubit B as target. 
                Applying CNOT disentangles Qubit B completely into a classical state (|0⟩ or |1⟩)!
            `;
        }
    }

    onBobCnotApplied(res) {
        const cnotBtn = document.getElementById('bob-cnot-btn');
        const hadamardBtn = document.getElementById('bob-hadamard-btn');
        const decoderStateEl = document.getElementById('decoder-state-text');
        const theoryCardEl = document.getElementById('decoder-theory-card');

        if (cnotBtn) {
            cnotBtn.disabled = true;
            cnotBtn.classList.remove('active');
            cnotBtn.classList.add('done');
        }
        if (hadamardBtn) {
            hadamardBtn.disabled = false;
            hadamardBtn.classList.add('active');
        }
        if (decoderStateEl) {
            decoderStateEl.innerHTML = `State: <code>${res.stateString}</code> ➔ <strong>Step 2: Click Hadamard (H)!</strong>`;
        }
        if (theoryCardEl) {
            theoryCardEl.innerHTML = `
                <strong>Step 2: The Hadamard (H) Phase Resolver</strong>
                Qubit B is already disentangled. But Qubit A holds relative phase (+ or −). 
                Applying Hadamard (H) to Qubit A causes quantum interference, transforming |+⟩ into |0⟩ and |−⟩ into |1⟩!
            `;
        }
        this.notify("CNOT applied! Qubit B disentangled from Qubit A.", "info");
    }

    onBobHadamardApplied(res) {
        const hadamardBtn = document.getElementById('bob-hadamard-btn');
        const measureBtn = document.getElementById('bob-measure-btn');
        const decoderStateEl = document.getElementById('decoder-state-text');
        const theoryCardEl = document.getElementById('decoder-theory-card');

        if (hadamardBtn) {
            hadamardBtn.disabled = true;
            hadamardBtn.classList.remove('active');
            hadamardBtn.classList.add('done');
        }
        if (measureBtn) {
            measureBtn.disabled = false;
            measureBtn.classList.add('active');
        }
        if (decoderStateEl) {
            decoderStateEl.innerHTML = `State: <code>${res.stateString}</code> ➔ <strong>Step 3: Click Measure!</strong>`;
        }
        if (theoryCardEl) {
            theoryCardEl.innerHTML = `
                <strong>Step 3: Computational Basis Measurement</strong>
                The quantum superposition has resolved into a single deterministic basis state! 
                Measuring both qubits now will yield Alice's exact 2 bits with 100% certainty.
            `;
        }
        this.notify("Hadamard applied! Phase converted to computational basis.", "info");
    }

    onBobMeasured(res) {
        const measureBtn = document.getElementById('bob-measure-btn');
        const bobMoveBtn = document.getElementById('bob-execute-move-btn');
        const decoderStateEl = document.getElementById('decoder-state-text');
        const theoryCardEl = document.getElementById('decoder-theory-card');
        const bobDecodedEl = document.getElementById('bob-decoded-instruction');

        if (measureBtn) {
            measureBtn.disabled = true;
            measureBtn.classList.remove('active');
            measureBtn.classList.add('done');
        }
        if (decoderStateEl) {
            decoderStateEl.innerHTML = `<span class="green">✓ 100% COLLAPSE:</span> State <code>${res.stateString}</code>!`;
        }
        if (theoryCardEl) {
            theoryCardEl.innerHTML = `
                <strong>Measurement Complete: Decoded "${res.decodedBits}" (${res.decodedDirection})</strong>
                Through 1 transmitted qubit and 1 shared entangled pair, Bob reconstructed 2 classical bits! 
                Click [EXECUTE MOVE ➔] to guide Bob's step.
            `;
        }

        const arrowIcons = { 'UP': '⬆️ UP', 'RIGHT': '➡️ RIGHT', 'DOWN': '⬇️ DOWN', 'LEFT': '⬅️ LEFT' };
        if (bobDecodedEl) {
            bobDecodedEl.innerHTML = `
                <div class="decoded-badge glow">
                    <span class="decoded-arrow">${arrowIcons[res.decodedDirection] || res.decodedDirection}</span>
                    <span class="decoded-bits">Bits: ${res.decodedBits} | Collapsed: ${res.stateString}</span>
                </div>
            `;
        }

        if (bobMoveBtn) {
            bobMoveBtn.disabled = false;
            bobMoveBtn.innerText = `EXECUTE ${res.decodedDirection} ➔`;
        }

        this.updatePoints(window.game.chronoShards);
        this.notify(`DECODED "${res.decodedBits}" (${res.decodedDirection})! Earned +50 Shards!`, "success");
    }

    onHintActivated(hintData, remainingShards) {
        this.updatePoints(remainingShards);

        const gateButtons = document.querySelectorAll('.gate-btn');
        gateButtons.forEach(btn => {
            if (btn.dataset.gate === hintData.gate) {
                btn.classList.add('hint-flash');
            }
        });

        this.notify(`💡 HINT: Apply Gate [${hintData.gate}] to steer Bob ${hintData.direction} (${hintData.bits})!`, "warning");
    }

    updatePoints(shards) {
        const counterEl = document.getElementById('shards-counter');
        if (counterEl) {
            counterEl.innerText = shards;
        }
    }

    updateBobStatus(bob) {
        const healthBar = document.getElementById('bob-health-fill');
        const healthText = document.getElementById('bob-health-text');
        if (healthBar) healthBar.style.width = `${Math.max(0, bob.health)}%`;
        if (healthText) healthText.innerText = `${bob.health} / 100 HP`;

        const keyBadge = document.getElementById('bob-key-badge');
        if (keyBadge) {
            keyBadge.className = bob.hasKey ? 'status-badge key-active' : 'status-badge key-inactive';
            keyBadge.innerText = bob.hasKey ? '🗝️ Jade Key Acquired' : '🗝️ No Key';
        }
    }

    notify(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;

        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('fade-out');
                setTimeout(() => toast.remove(), 400);
            }, 3200);
        }
    }

    onLevelVictory(levelIndex) {
        const modal = document.getElementById('level-victory-modal');
        const msgEl = document.getElementById('victory-msg');
        const statsEl = document.getElementById('victory-stats');

        if (levelIndex === 0) {
            if (msgEl) msgEl.innerHTML = "🎓 <strong>DOJO COMPLETE!</strong> You have successfully mastered all 4 Superdense Gates and Bob's Inverse Bell Measurement Circuit!";
        } else if (levelIndex === LEVELS.length - 1) {
            if (msgEl) msgEl.innerHTML = "🎉 <strong>CHRONO-CRYSTAL RECLAIMED!</strong> You conquered the final subterranean vault!";
        } else {
            if (msgEl) msgEl.innerText = `You cleared ${LEVELS[levelIndex].title}! Bob navigated the labyrinth safely.`;
        }

        if (statsEl) {
            statsEl.innerHTML = `
                <div>Qubits Transmitted: <strong>${window.game.stats.qubitsSent}</strong></div>
                <div>Classical Bits Decoded: <strong>${window.game.stats.classicalBitsDecoded}</strong></div>
                <div>Entanglement Lives Remaining: <strong>${window.game.lives} / 3</strong></div>
                <div>Chrono-Shards (Points): <strong>${window.game.chronoShards}</strong></div>
                <div>Channel Efficiency: <strong>200% (2 bits per transmitted qubit)</strong></div>
            `;
        }

        if (modal) modal.classList.add('active');
    }

    onGameOver(reason) {
        const modal = document.getElementById('game-over-modal');
        const reasonEl = document.getElementById('gameover-reason');
        if (reasonEl) reasonEl.innerText = reason;
        if (modal) modal.classList.add('active');
    }
}

window.app = new AppController();
window.addEventListener('DOMContentLoaded', () => {
    window.app.init();
});

/**
 * SHADOW FIGHT 2 STYLE INTRO CINEMATIC (SLOWER PACE & IMMERSIVE)
 * Features:
 * - Relaxed, slow reading speed with full manual pause/prev/next controls
 * - Deep bass martial voiceover synchronization
 * - Pure immersive story lore without 4th-wall breaking text
 */

class IntroCinematic {
    constructor(canvasId, onComplete) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.onComplete = onComplete;
        this.currentScene = 0;
        this.animFrameId = null;
        this.isSkipped = false;
        this.isPaused = false;
        this.particles = [];
        this.shake = 0;
        this.sceneTime = 0;
        this.lastTime = performance.now();

        this.scenes = [
            {
                actNumber: "ACT I",
                title: "THE LEGENDARY PURSUIT",
                subtitle: "For countless years, Alice and Bob journeyed across desolate realms...",
                desc: "Searching for the legendary Chrono-Crystal — an ancient relic forged in quantum mystery.",
                spoken: "For countless years, Alice and Bob journeyed across desolate realms, searching for the legendary Chrono-Crystal, an ancient relic forged in quantum mystery.",
                bgGradient: ['#120826', '#3b1248', '#b83b05', '#f39c12'],
                draw: (ctx, t) => this.drawScene1(ctx, t)
            },
            {
                actNumber: "ACT II",
                title: "THE ABYSSAL CAVERN",
                subtitle: "Deep within the Crags of Entanglement, the seal was breached.",
                desc: "Before them loomed the forbidden Gate of Whispers, carved with eternal quantum runes.",
                spoken: "Deep within the Crags of Entanglement, they uncovered the Gate of Whispers, carved with eternal quantum runes.",
                bgGradient: ['#070a12', '#0f172a', '#1e293b', '#00f3ff'],
                draw: (ctx, t) => this.drawScene2(ctx, t)
            },
            {
                actNumber: "ACT III",
                title: "THE SUNDERED COMPANIONS",
                subtitle: "The monolithic gate demanded a lone challenger.",
                desc: "Bob ventured into the yawning abyss... and the immense stone slab crashed down!",
                spoken: "The monolithic gate demanded a lone challenger. Bob ventured into the yawning abyss... and the immense stone slab crashed shut behind him!",
                bgGradient: ['#230606', '#4a1515', '#822424', '#ff3366'],
                impactTime: 1200,
                draw: (ctx, t) => this.drawScene3(ctx, t)
            },
            {
                actNumber: "ACT IV",
                title: "DARKNESS & THE FORGOTTEN MAP",
                subtitle: "Trapped in the suffocating dark...",
                desc: "Bob forgot his torch, and the labyrinth map remained outside with Alice! Dense stone killed all radio waves.",
                spoken: "Pitch blackness swallowed Bob. He realized his torch was forgotten, and the only labyrinth map lay outside with Alice! Subterranean stone blocked all radio signals and light.",
                bgGradient: ['#030305', '#080a10', '#171d29', '#0d131f'],
                draw: (ctx, t) => this.drawScene4(ctx, t)
            },
            {
                actNumber: "ACT V",
                title: "THE QUANTUM LIFELINE",
                subtitle: "Yet their bond was not broken.",
                desc: "Before the parting, they shared a pair of entangled qubits. A microscopic quantum waveguide still connects them.",
                spoken: "Yet hope was not lost. Before parting, they prepared an entangled Bell pair. Through a microscopic quantum waveguide, Alice can send a single photon to Bob.",
                bgGradient: ['#02121e', '#072e42', '#006587', '#00f3ff'],
                draw: (ctx, t) => this.drawScene5(ctx, t)
            },
            {
                actNumber: "ACT VI",
                title: "SUPERDENSE CODING REVELATION",
                subtitle: "One photon transmitted. Two navigation instructions decoded.",
                desc: "Alice encodes directions using Quantum Gates. Bob decodes using CNOT and Hadamard. The trial begins!",
                spoken: "One photon transmitted. Two navigation instructions decoded. Alice encodes directions using Quantum Gates, and Bob decodes with CNOT and Hadamard. The trial begins!",
                bgGradient: ['#080e21', '#141c33', '#2a3b52', '#ffb703'],
                draw: (ctx, t) => this.drawScene6(ctx, t)
            }
        ];

        this.initParticles();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < 70; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 1.2 - 0.6,
                vy: Math.random() * 0.9 + 0.4,
                size: Math.random() * 4 + 2,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.04,
                alpha: Math.random() * 0.7 + 0.3,
                color: Math.random() > 0.4 ? '#ffb703' : '#ff3366'
            });
        }
    }

    updateParticles() {
        if (!this.canvas) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            if (p.y > h + 15) {
                p.y = -10;
                p.x = Math.random() * w;
            }
            if (p.x < -15) p.x = w + 10;
            if (p.x > w + 15) p.x = -10;
        }
    }

    drawParticles(ctx) {
        ctx.save();
        for (const p of this.particles) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 1.5, p.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();
    }

    start() {
        this.isSkipped = false;
        this.currentScene = 0;
        this.sceneTime = 0;
        this.lastTime = performance.now();

        if (window.soundEngine) {
            window.soundEngine.init();
            window.soundEngine.startAmbiance();
        }

        this.playCurrentScene();

        const loop = (now) => {
            if (this.isSkipped) return;
            const dt = now - this.lastTime;
            this.lastTime = now;

            if (!this.isPaused) {
                this.sceneTime += dt;
            }

            this.render(this.sceneTime);
            this.animFrameId = requestAnimationFrame(loop);
        };

        this.animFrameId = requestAnimationFrame(loop);
    }

    playCurrentScene() {
        const scene = this.scenes[this.currentScene];
        this.sceneTime = 0;

        if (window.soundEngine) {
            window.soundEngine.playTaikoHit(this.currentScene === 2);
            window.soundEngine.narrate(scene.spoken, () => {
                // Slower auto-advance: 4.5 seconds of breathing room after narration finishes
                if (!this.isPaused && !this.isSkipped) {
                    setTimeout(() => {
                        if (!this.isPaused && !this.isSkipped) {
                            this.nextScene();
                        }
                    }, 4500);
                }
            });
        }

        const actLabel = document.getElementById('intro-act-indicator');
        if (actLabel) {
            actLabel.innerText = `${scene.actNumber} of ${this.scenes.length}`;
        }
    }

    nextScene() {
        if (this.currentScene < this.scenes.length - 1) {
            this.currentScene++;
            this.playCurrentScene();
        } else {
            this.finish();
        }
    }

    prevScene() {
        if (this.currentScene > 0) {
            this.currentScene--;
            this.playCurrentScene();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('intro-pause-btn');
        if (pauseBtn) {
            pauseBtn.innerText = this.isPaused ? '▶ RESUME' : '⏸ PAUSE';
        }
    }

    skip() {
        this.isSkipped = true;
        if (window.soundEngine) {
            window.soundEngine.stopNarration();
        }
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
        this.finish();
    }

    finish() {
        if (window.soundEngine) {
            window.soundEngine.stopNarration();
        }
        const overlay = document.getElementById('intro-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 600);
        }
        if (this.onComplete) {
            this.onComplete();
        }
    }

    render(time) {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const scene = this.scenes[this.currentScene];

        let shakeX = 0;
        let shakeY = 0;
        if (this.shake > 0) {
            shakeX = (Math.random() - 0.5) * this.shake;
            shakeY = (Math.random() - 0.5) * this.shake;
            this.shake *= 0.9;
            if (this.shake < 0.5) this.shake = 0;
        }

        ctx.save();
        ctx.translate(shakeX, shakeY);

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, scene.bgGradient[0]);
        grad.addColorStop(0.35, scene.bgGradient[1]);
        grad.addColorStop(0.7, scene.bgGradient[2]);
        grad.addColorStop(1, scene.bgGradient[3]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        this.drawMountains(ctx, w, h);
        this.drawBambooFrame(ctx, w, h);
        scene.draw(ctx, time);
        this.updateParticles();
        this.drawParticles(ctx);
        this.drawVignette(ctx, w, h);
        this.drawTypography(ctx, w, h, scene, time);

        ctx.restore();
    }

    drawBambooFrame(ctx, w, h) {
        ctx.save();
        ctx.fillStyle = '#050308';
        ctx.fillRect(15, 0, 14, h);
        ctx.fillRect(36, 0, 8, h);
        for (let y = 60; y < h; y += 120) {
            ctx.fillRect(11, y, 22, 6);
            ctx.fillRect(33, y + 30, 14, 5);
        }
        ctx.fillRect(w - 28, 0, 14, h);
        ctx.fillRect(w - 48, 0, 8, h);
        for (let y = 80; y < h; y += 120) {
            ctx.fillRect(w - 32, y, 22, 6);
            ctx.fillRect(w - 52, y + 40, 14, 5);
        }
        ctx.restore();
    }

    drawMountains(ctx, w, h) {
        ctx.save();
        ctx.fillStyle = '#0a0515';
        ctx.beginPath();
        ctx.moveTo(0, h);
        const steps = 14;
        const dx = w / steps;
        for (let i = 0; i <= steps; i++) {
            const x = i * dx;
            const peak = Math.sin(i * 1.4 + 0.4) * 85 + Math.cos(i * 0.7) * 45;
            const y = h * 0.62 - peak;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#040208';
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, h * 0.78);
        ctx.quadraticCurveTo(w * 0.3, h * 0.72, w * 0.55, h * 0.8);
        ctx.lineTo(w, h * 0.75);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawVignette(ctx, w, h) {
        ctx.save();
        const radial = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
        radial.addColorStop(0, 'rgba(0,0,0,0)');
        radial.addColorStop(0.7, 'rgba(0,0,0,0.5)');
        radial.addColorStop(1, 'rgba(0,0,0,0.95)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    drawTypography(ctx, w, h, scene, time) {
        ctx.save();
        const fadeIn = Math.min(1, time / 800);
        ctx.globalAlpha = fadeIn;

        ctx.font = 'bold 26px "Cinzel", serif';
        ctx.fillStyle = '#ffb703';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(255, 183, 3, 0.8)';
        ctx.shadowBlur = 18;
        ctx.fillText(`${scene.actNumber} : ${scene.title}`, w / 2, h * 0.12);

        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 200, h * 0.14);
        ctx.lineTo(w / 2 + 200, h * 0.14);
        ctx.stroke();

        ctx.font = 'italic 21px "Cinzel", "Georgia", serif';
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(0, 243, 255, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText(scene.subtitle, w / 2, h * 0.83);

        ctx.font = '16px "Inter", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.shadowBlur = 0;
        ctx.fillText(scene.desc, w / 2, h * 0.88);

        ctx.restore();
    }

    drawScene1(ctx, t) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const groundY = h * 0.78;

        ctx.save();
        const sunX = w * 0.5;
        const sunY = h * 0.35;
        ctx.fillStyle = '#ffb703';
        ctx.shadowColor = '#ffb703';
        ctx.shadowBlur = 50;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#120826';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(sunX - 18, sunY - 10, 68, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        this.drawCharacterSilhouette(ctx, w * 0.42, groundY, 'alice', false);
        this.drawCharacterSilhouette(ctx, w * 0.56, groundY, 'bob', false);
    }

    drawScene2(ctx, t) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const groundY = h * 0.78;

        ctx.save();
        ctx.fillStyle = '#06070a';
        const gateW = 230;
        const gateH = 270;
        const gateX = w * 0.5 - gateW / 2;
        const gateY = groundY - gateH;

        ctx.fillRect(gateX, gateY, 50, gateH);
        ctx.fillRect(gateX + gateW - 50, gateY, 50, gateH);
        ctx.fillRect(gateX, gateY, gateW, 45);

        const pulse = (Math.sin(t * 0.005) + 1) * 0.5;
        ctx.strokeStyle = `rgba(0, 243, 255, ${0.4 + pulse * 0.6})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.arc(w * 0.5, gateY + 115, 48, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = `rgba(0, 243, 255, ${0.7 + pulse * 0.3})`;
        ctx.textAlign = 'center';
        ctx.fillText('|Φ⁺⟩', w * 0.5, gateY + 122);
        ctx.restore();

        this.drawCharacterSilhouette(ctx, w * 0.32, groundY, 'alice', false);
        this.drawCharacterSilhouette(ctx, w * 0.42, groundY, 'bob', false);
    }

    drawScene3(ctx, t) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const groundY = h * 0.78;
        const gateW = 220;
        const gateH = 270;
        const gateX = w * 0.5 - gateW / 2;
        const gateY = groundY - gateH;

        let doorDropY = 0;
        if (t < 1200) {
            doorDropY = (t / 1200) * gateH;
        } else {
            doorDropY = gateH;
            if (t > 1200 && t < 1400 && this.shake === 0) {
                this.shake = 28;
            }
        }

        ctx.save();
        ctx.fillStyle = '#06070a';
        ctx.fillRect(gateX, gateY, 40, gateH);
        ctx.fillRect(gateX + gateW - 40, gateY, 40, gateH);
        ctx.fillRect(gateX, gateY, gateW, 45);

        ctx.fillStyle = '#11131a';
        ctx.fillRect(gateX + 40, gateY + 40, gateW - 80, doorDropY);

        if (t >= 1200) {
            ctx.fillStyle = 'rgba(255, 51, 102, 0.45)';
            ctx.beginPath();
            ctx.ellipse(w * 0.5, groundY, 160, 32, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        this.drawCharacterSilhouette(ctx, w * 0.30, groundY, 'alice', true);
        if (t < 1300) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - (t - 800) / 500);
            this.drawCharacterSilhouette(ctx, w * 0.52, groundY, 'bob', false);
            ctx.restore();
        }
    }

    drawScene4(ctx, t) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const groundY = h * 0.78;

        ctx.save();
        ctx.fillStyle = '#06070a';
        ctx.fillRect(w * 0.48, 0, w * 0.04, h);

        ctx.font = 'bold 16px "Cinzel", serif';
        ctx.fillStyle = '#ffb703';
        ctx.textAlign = 'center';
        ctx.fillText("OUTSIDE : ALICE (HAS LABYRINTH MAP)", w * 0.25, h * 0.24);

        ctx.fillStyle = '#ff3366';
        ctx.fillText("INSIDE : BOB (BLIND & FORGOT TORCH)", w * 0.75, h * 0.24);

        this.drawCharacterSilhouette(ctx, w * 0.28, groundY, 'alice_map', false);

        ctx.fillStyle = '#ffb703';
        ctx.shadowColor = '#ffb703';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(w * 0.32, groundY - 60, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        this.drawCharacterSilhouette(ctx, w * 0.72, groundY, 'bob_blind', false);

        ctx.font = '15px monospace';
        ctx.fillStyle = 'rgba(255, 51, 102, 0.95)';
        ctx.fillText("⚠️ NO TORCH | NO MAP", w * 0.72, groundY - 110);
        ctx.restore();
    }

    drawScene5(ctx, t) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const groundY = h * 0.78;

        this.drawCharacterSilhouette(ctx, w * 0.22, groundY, 'alice', false);
        this.drawCharacterSilhouette(ctx, w * 0.78, groundY, 'bob', true);

        const crysAx = w * 0.27;
        const crysAy = groundY - 65;
        const crysBx = w * 0.73;
        const crysBy = groundY - 65;

        ctx.save();
        const pulse = (Math.sin(t * 0.008) + 1) * 0.5;
        ctx.strokeStyle = `rgba(0, 243, 255, ${0.6 + pulse * 0.4})`;
        ctx.lineWidth = 3 + pulse * 2;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 20;

        ctx.beginPath();
        ctx.moveTo(crysAx, crysAy);
        const segments = 22;
        const dx = (crysBx - crysAx) / segments;
        for (let i = 1; i < segments; i++) {
            const x = crysAx + i * dx;
            const wave = Math.sin(i * 0.8 + t * 0.01) * 16 * pulse;
            ctx.lineTo(x, crysAy + wave);
        }
        ctx.lineTo(crysBx, crysBy);
        ctx.stroke();

        ctx.fillStyle = '#00f3ff';
        ctx.beginPath();
        ctx.arc(crysAx, crysAy, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(crysBx, crysBy, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 23px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText("|Φ⁺⟩ = (|00⟩ + |11⟩) / √2", w * 0.5, groundY - 105);

        ctx.font = '16px "Inter", sans-serif';
        ctx.fillStyle = '#00f3ff';
        ctx.fillText("PRE-SHARED BELL PAIR READY", w * 0.5, groundY - 70);
        ctx.restore();
    }

    drawScene6(ctx, t) {
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.save();
        const boxW = Math.min(w * 0.85, 720);
        const boxH = 280;
        const boxX = w * 0.5 - boxW / 2;
        const boxY = h * 0.32;

        ctx.fillStyle = 'rgba(10, 15, 29, 0.9)';
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 18;
        ctx.roundRect ? ctx.roundRect(boxX, boxY, boxW, boxH, 12) : ctx.rect(boxX, boxY, boxW, boxH);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 22px "Cinzel", serif';
        ctx.fillStyle = '#ffb703';
        ctx.textAlign = 'center';
        ctx.fillText("THE SUPERDENSE ENCODING & DECODING MAP", w * 0.5, boxY + 38);

        const rows = [
            { bits: "00", gate: "I  (Identity)", bell: "|Φ⁺⟩", dir: "⬆️ UP", decode: "CNOT → H → |00⟩" },
            { bits: "01", gate: "X  (Bit Flip)", bell: "|Ψ⁺⟩", dir: "➡️ RIGHT", decode: "CNOT → H → |01⟩" },
            { bits: "10", gate: "Z  (Phase Flip)", bell: "|Φ⁻⟩", dir: "⬇️ DOWN", decode: "CNOT → H → |10⟩" },
            { bits: "11", gate: "XZ (Bit+Phase)", bell: "|Ψ⁻⟩", dir: "⬅️ LEFT", decode: "CNOT → H → |11⟩" }
        ];

        ctx.font = '15px monospace';
        const startY = boxY + 84;
        rows.forEach((r, idx) => {
            const y = startY + idx * 42;
            const active = Math.floor((t / 900) % 4) === idx;
            ctx.fillStyle = active ? '#00f3ff' : '#94a3b8';
            ctx.textAlign = 'left';
            ctx.fillText(`BITS: ${r.bits}`, boxX + 30, y);
            ctx.fillText(`ALICE: ${r.gate}`, boxX + 130, y);
            ctx.fillText(`BELL: ${r.bell}`, boxX + 310, y);
            ctx.fillStyle = active ? '#ffb703' : '#e2e8f0';
            ctx.fillText(`BOB: ${r.decode}`, boxX + 430, y);
            ctx.fillText(`${r.dir}`, boxX + 620, y);
        });

        const promptPulse = (Math.sin(t * 0.007) + 1) * 0.5;
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + promptPulse * 0.3})`;
        ctx.textAlign = 'center';
        ctx.fillText("READY TO COMMENCE TRIAL? CLICK [NEXT ▶ / SKIP] TO BEGIN!", w * 0.5, h * 0.81);
        ctx.restore();
    }

    drawCharacterSilhouette(ctx, x, y, charType, facingLeft = false) {
        ctx.save();
        ctx.translate(x, y);
        if (facingLeft) ctx.scale(-1, 1);

        ctx.fillStyle = '#060608';
        ctx.strokeStyle = '#060608';
        ctx.lineWidth = 4;

        if (charType === 'alice' || charType === 'alice_map') {
            ctx.beginPath();
            ctx.arc(0, -90, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-6, -92);
            ctx.quadraticCurveTo(-25, -96, -35, -88);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#060608';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-10, -80);
            ctx.lineTo(10, -80);
            ctx.lineTo(16, -30);
            ctx.lineTo(-14, -30);
            ctx.closePath();
            ctx.fill();

            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(-6, -30);
            ctx.lineTo(-8, 0);
            ctx.moveTo(6, -30);
            ctx.lineTo(10, 0);
            ctx.stroke();

            if (charType === 'alice_map') {
                ctx.beginPath();
                ctx.moveTo(-8, -75);
                ctx.lineTo(12, -60);
                ctx.lineTo(24, -62);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(-8, -75);
                ctx.lineTo(-14, -45);
                ctx.moveTo(8, -75);
                ctx.lineTo(14, -45);
                ctx.stroke();
            }
        } else {
            ctx.beginPath();
            ctx.arc(0, -94, 11, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-14, -83);
            ctx.lineTo(14, -83);
            ctx.lineTo(20, -25);
            ctx.lineTo(-18, -25);
            ctx.closePath();
            ctx.fill();

            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(-8, -25);
            ctx.lineTo(-10, 0);
            ctx.moveTo(8, -25);
            ctx.lineTo(12, 0);
            ctx.stroke();

            if (charType === 'bob_blind') {
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(12, -78);
                ctx.lineTo(35, -70);
                ctx.lineTo(48, -72);
                ctx.stroke();
            } else {
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(22, -115);
                ctx.lineTo(20, 0);
                ctx.stroke();

                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(8, -78);
                ctx.lineTo(20, -65);
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}

window.IntroCinematic = IntroCinematic;

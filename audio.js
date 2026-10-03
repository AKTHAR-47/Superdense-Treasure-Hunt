/**
 * AUDIO ENGINE - AUTHENTIC SHADOW FIGHT 2 SOUNDTRACK & DEEP BASS NARRATOR
 * Synthesizes:
 * - Traditional Japanese Shakuhachi (bamboo flute) with authentic breath vibrato
 * - Koto / Shamisen plucked pentatonic chords
 * - Heavy resonant Taiko war drums & Tibetan singing bowl sub-drones
 * - Web Speech API Voice Narrator with tuned deep bass pitch and deliberate cadence
 * - Browser Autoplay Policy unlocking (resumes on any user interaction)
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isVoiceMuted = false;
        this.masterVolume = 0.4;
        this.masterGain = null;

        this.isBgmPlaying = false;
        this.bgmTimer = null;
        this.bgmGain = null;

        this.narratorVoice = null;
        this.initSpeech();
        this.setupAutoplayUnlock();
    }

    init() {
        if (this.ctx) {
            this.resume();
            return;
        }
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setupAutoplayUnlock() {
        const unlock = () => {
            if (!this.ctx) this.init();
            this.resume();
            if (!this.isBgmPlaying) {
                this.startAmbiance();
            }
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.masterVolume, now + 0.05);
        }
        return this.isMuted;
    }

    toggleVoice() {
        this.isVoiceMuted = !this.isVoiceMuted;
        if (this.isVoiceMuted && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        return this.isVoiceMuted;
    }

    /* =========================================================================
       DEEP BASS NARRATOR VOICE (Shadow Fight 2 Dramatic Tone)
       ========================================================================= */
    initSpeech() {
        if (!('speechSynthesis' in window)) return;

        const findDeepVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            // Prioritize deep resonant male voices
            this.narratorVoice = voices.find(v => 
                (v.name.includes('David') || v.name.includes('Male') || v.name.includes('George') || v.name.includes('UK English Male') || v.name.includes('Natural')) && v.lang.startsWith('en')
            ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        };

        findDeepVoice();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = findDeepVoice;
        }
    }

    narrate(text, onEnd) {
        if (this.isVoiceMuted || !('speechSynthesis' in window)) {
            if (onEnd) setTimeout(onEnd, 4000);
            return;
        }

        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            if (this.narratorVoice) {
                utterance.voice = this.narratorVoice;
            }
            // Rich deep bass tone and calm dramatic pace
            utterance.rate = 0.76;  // Slow, measured storytelling
            utterance.pitch = 0.60; // Deep bass baritone register
            utterance.volume = this.isMuted ? 0 : 1.0;

            if (onEnd) {
                utterance.onend = onEnd;
                utterance.onerror = onEnd;
            }

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Speech error:', e);
            if (onEnd) onEnd();
        }
    }

    stopNarration() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    /* =========================================================================
       SHADOW FIGHT 2 PROCEDURAL SOUNDTRACK
       ========================================================================= */
    startAmbiance() {
        if (this.isBgmPlaying) return;
        if (!this.ctx) this.init();
        this.resume();

        const now = this.ctx.currentTime;
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.001, now);
        this.bgmGain.gain.linearRampToValueAtTime(0.3, now + 1.5);
        this.bgmGain.connect(this.masterGain);

        this.isBgmPlaying = true;
        this.runSoundtrackLoop();
    }

    runSoundtrackLoop() {
        if (!this.isBgmPlaying || !this.ctx) return;

        // Shadow Fight 2 In-Sen Japanese Scale (D, Eb, G, A, C)
        const inSenScale = [
            146.83, // D3 (Sub root)
            155.56, // Eb3
            196.00, // G3
            220.00, // A3
            261.63, // C4
            293.66, // D4 (Flute melody root)
            311.13, // Eb4
            392.00, // G4
            440.00, // A4
            523.25  // C5
        ];

        let beat = 0;
        const playMeasure = () => {
            if (!this.isBgmPlaying || !this.ctx) return;
            const now = this.ctx.currentTime;

            // 1. Heavy resonant Taiko strike on beat 0
            if (beat % 2 === 0) {
                this.playTaikoHit(true);
            } else {
                this.playTaikoHit(false);
            }

            // 2. Breathy Shakuhachi bamboo flute phrase
            const fluteNote = inSenScale[5 + Math.floor(Math.random() * 5)];
            this.playShakuhachiNote(fluteNote, now + 0.1, 2.2);

            // 3. Shamisen / Koto arpeggio pluck
            setTimeout(() => {
                if (this.isBgmPlaying) {
                    const kotoNote = inSenScale[Math.floor(Math.random() * 5)];
                    this.playShamisenPluck(kotoNote * 2);
                }
            }, 800);

            beat++;
            this.bgmTimer = setTimeout(playMeasure, 2800); // Slower, solemn martial rhythm
        };

        playMeasure();
    }

    stopAmbiance() {
        this.isBgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
        if (this.bgmGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.bgmGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
        }
    }

    playShakuhachiNote(freq, startTime, duration = 2.0) {
        if (!this.ctx || !this.bgmGain) return;

        const osc = this.ctx.createOscillator();
        const breathOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        // Japanese flute expressive pitch vibrato
        osc.frequency.linearRampToValueAtTime(freq * 1.02, startTime + 0.4);
        osc.frequency.linearRampToValueAtTime(freq * 0.99, startTime + 0.8);
        osc.frequency.linearRampToValueAtTime(freq, startTime + 1.2);

        // Breath harmonic filter
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(6.0, startTime);
        filter.frequency.setValueAtTime(freq * 1.5, startTime);

        noteGain.gain.setValueAtTime(0.001, startTime);
        noteGain.gain.linearRampToValueAtTime(0.25, startTime + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.bgmGain);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
    }

    playShamisenPluck(freq) {
        if (!this.ctx || !this.bgmGain) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 3.5, now);
        filter.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.5);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 0.65);
    }

    playTaikoHit(heavy = true) {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        const startFreq = heavy ? 110 : 155;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(28, now + (heavy ? 0.5 : 0.28));

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, now);
        filter.frequency.linearRampToValueAtTime(55, now + 0.45);

        gain.gain.setValueAtTime(heavy ? 0.8 : 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.8 : 0.4));

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.85);
    }

    playGateClick(gateType = 'I') {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const freqs = {
            'I': [523.25, 659.25],
            'X': [587.33, 783.99],
            'Z': [659.25, 880.00],
            'XZ': [783.99, 1046.50]
        };

        const chord = freqs[gateType] || [523.25, 659.25];
        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.03);
            gain.gain.setValueAtTime(0.25, now + idx * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + idx * 0.03);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + idx * 0.03);
            osc.stop(now + 0.4);
        });
    }

    playQuantumTransmission() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.7);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(4.5, now);
        filter.frequency.setValueAtTime(440, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 0.7);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.8);
    }

    playCnotSnap() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playHadamardChime() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        [659.25, 987.77, 1318.51].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.05);
            gain.gain.setValueAtTime(0.2, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.05);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.05);
            osc.stop(now + 0.5 + i * 0.05);
        });
    }

    playMeasurementCollapse() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        [1046.50, 1318.51, 1567.98].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.06);
            gain.gain.setValueAtTime(0.25, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + i * 0.06);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.06);
            osc.stop(now + 0.45);
        });
    }

    playLifeLostSound() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.35);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.45);
    }

    playHintChime() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.04);
            gain.gain.setValueAtTime(0.22, now + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.04);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.04);
            osc.stop(now + 0.6);
        });
    }

    playFootstep() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(95 + Math.random() * 20, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    playTrapWarning() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.setValueAtTime(140, now + 0.1);
        osc.frequency.setValueAtTime(110, now + 0.2);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.38);
    }

    playKeyCollect() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const notes = [659.25, 783.99, 987.77, 1318.51];
        notes.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.06);
            gain.gain.setValueAtTime(0.3, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.06);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.06);
            osc.stop(now + 0.6);
        });
    }

    playDoorUnlock() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(261.63, now);
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.3);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.55);
    }

    playVictory() {
        if (!this.ctx) this.init();
        this.resume();
        const now = this.ctx.currentTime;

        this.playTaikoHit(true);

        const chord = [392.00, 493.88, 587.33, 783.99];
        chord.forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + 0.1);
            gain.gain.setValueAtTime(0.25, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + 0.1);
            osc.stop(now + 2.0);
        });
    }
}

window.soundEngine = new SoundEngine();

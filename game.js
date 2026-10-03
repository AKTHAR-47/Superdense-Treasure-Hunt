/**
 * GAME ENGINE - ENTANGLED: THE SHADOW LABYRINTH
 * Rules:
 * - NO DIRECT MANUAL MOVEMENT: Bob is blind and can ONLY move via quantum decoded instructions!
 * - LEVEL 0: Complete 4-Gate Quantum Dojo with step-by-step guidance
 * - LEVELS 1-6: All 4 Gates are active from the start!
 * - 3 LIVES SYSTEM (❤️❤️❤️): Sending Bob into a wall or dead hazard costs 1 life. 3 mistakes = Decoherence GameOver.
 * - Bob's HP (100 HP) tracks floor spike trap damage.
 * - Interactive CNOT, Hadamard, and Measurement decoder steps with deep theory explanations.
 */

const TILE = {
    FLOOR: 0,
    WALL: 1,
    SPIKE: 2,
    KEY: 3,
    DOOR: 4,
    EXIT: 5,
    START: 6,
    SPIKE_OFF: 7
};

const LEVELS = [
    {
        id: 0,
        title: "LEVEL 0 : THE QUANTUM DOJO",
        chapter: "TUTORIAL ARENA : 4-GATE MASTER TRIAL",
        concept: "Interactive Mastery of I, X, Z, XZ and Inverse Bell Decoding",
        subtitle: "Walk the 4 ancient chambers of the Dojo. Master all 4 Pauli operators in 1 step each!",
        storyNotice: "Chamber 1: Gate [I] (00 - UP). Chamber 2: Gate [X] (01 - RIGHT). Chamber 3: Gate [Z] (10 - DOWN). Chamber 4: Gate [XZ] (11 - LEFT into the Dojo Shrine).",
        allowedGates: ['I', 'X', 'Z', 'XZ'],
        mapWidth: 6,
        mapHeight: 6,
        bobStart: { x: 1, y: 4 },
        map: [
            [1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 1, 1], // (2,1) Chamber 2, (3,1) Chamber 3
            [1, 5, 1, 0, 1, 1], // (1,2) Dojo Shrine Exit, (3,2) Chamber 4
            [1, 0, 1, 0, 1, 1], // (1,3) Chamber 1, (3,3)
            [1, 6, 1, 1, 1, 1], // (1,4) Start
            [1, 1, 1, 1, 1, 1]
        ],
        hint: "Step 1: Gate I (UP). Step 2: Gate X (RIGHT). Step 3: Gate Z (DOWN). Step 4: Gate XZ (LEFT to Exit)!",
        isDojo: true
    },
    {
        id: 1,
        title: "LEVEL 1 : THE QUANTUM SPARK",
        chapter: "ACT I : ENTRANCE CORRIDOR",
        concept: "Straight Corridor Navigation",
        subtitle: "Bob is trapped inside the entrance hallway. Guide him forward to the ancient gate.",
        storyNotice: "All 4 quantum gates are unlocked! Inspect Alice's map. Steer Bob along the safe corridor. Beware: 3 wrong decisions break quantum entanglement!",
        allowedGates: ['I', 'X', 'Z', 'XZ'],
        mapWidth: 5,
        mapHeight: 7,
        bobStart: { x: 2, y: 5 },
        map: [
            [1, 1, 5, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 6, 1, 1],
            [1, 1, 1, 1, 1]
        ],
        hint: "The corridor extends directly NORTH. Select Gate I (00 - UP) and transmit!"
    },
    {
        id: 2,
        title: "LEVEL 2 : THE FORK OF PERIL",
        chapter: "ACT II : THE PAULI BIT-FLIP",
        concept: "Divergent Paths & Spike Pits",
        subtitle: "A deadly spike pit lies ahead! Steer Bob safely around the hazard.",
        storyNotice: "Directly north is a spike pit! Alice must choose the correct gate to guide Bob onto the safe eastern tunnel.",
        allowedGates: ['I', 'X', 'Z', 'XZ'],
        mapWidth: 7,
        mapHeight: 7,
        bobStart: { x: 3, y: 5 },
        map: [
            [1, 1, 1, 1, 5, 1, 1],
            [1, 1, 1, 1, 0, 1, 1],
            [1, 1, 2, 1, 0, 1, 1],
            [1, 1, 2, 0, 0, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 6, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ],
        hint: "Move UP to junction, then apply Gate X (01 - RIGHT) to bypass the spike pit!"
    },
    {
        id: 3,
        title: "LEVEL 3 : THE ABYSSAL DESCENT",
        chapter: "ACT III : THE PHASE-FLIP",
        concept: "Sunken Catacombs Navigation",
        subtitle: "Navigate down through the sunken catacombs using phase and bit operations.",
        storyNotice: "The upper path has collapsed. Alice must direct Bob SOUTH into the lower shaft. Use Gate Z ('10' = DOWN).",
        allowedGates: ['I', 'X', 'Z', 'XZ'],
        mapWidth: 8,
        mapHeight: 7,
        bobStart: { x: 1, y: 1 },
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 6, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 5, 1],
            [1, 1, 1, 2, 2, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ],
        hint: "Path: RIGHT (X) -> RIGHT (X) -> DOWN (Z) -> DOWN (Z) -> RIGHT to Exit!"
    },
    {
        id: 4,
        title: "LEVEL 4 : THE FOUR RUNES & JADE KEY",
        chapter: "ACT IV : COMBINED OPERATORS",
        concept: "Multi-Chamber Puzzle & Key Retrieval",
        subtitle: "Guide Bob WEST to retrieve the Jade Key, then unlock the northern Door.",
        storyNotice: "The exit door is locked! Direct Bob LEFT (Gate XZ) to grab the Jade Key, return to center, and proceed UP.",
        allowedGates: ['I', 'X', 'Z', 'XZ'],
        mapWidth: 9,
        mapHeight: 7,
        bobStart: { x: 4, y: 5 },
        map: [
            [1, 1, 1, 1, 5, 1, 1, 1, 1],
            [1, 1, 1, 1, 4, 1, 1, 1, 1],
            [1, 3, 0, 0, 0, 0, 2, 1, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 6, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        hint: "UP to junction -> LEFT (XZ) to Key -> RIGHT to center -> UP to unlock door!"
    },
    {
        id: 5,
        title: "LEVEL 5 : THE SEISMIC BRIDGE",
        chapter: "ACT V : OSCILLATING HAZARDS",
        concept: "Rhythmic Traps & Quantum Precision",
        subtitle: "Spikes pulse on and off every 3 steps! Time your moves and decode instructions carefully.",
        storyNotice: "Floor spikes oscillate active and inactive every 3 turns. Alice must synchronize moves with the trap cadence.",
        allowedGates: ['I', 'X', 'Z', 'XZ'],
        mapWidth: 9,
        mapHeight: 8,
        bobStart: { x: 1, y: 6 },
        hasOscillatingTraps: true,
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 5, 1, 1, 1, 1],
            [1, 2, 0, 0, 4, 1, 1, 1, 1],
            [1, 2, 0, 2, 1, 1, 1, 1, 1],
            [1, 0, 0, 2, 3, 0, 0, 1, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 1],
            [1, 6, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        hint: "Travel EAST -> NORTH through corridor to Key -> circle around to northern bridge!"
    },
    {
        id: 6,
        title: "LEVEL 6 : VAULT OF THE CHRONO-CRYSTAL",
        chapter: "FINAL ACT : THE GRAND TEST",
        concept: "Master Superdense Coding Protocol",
        subtitle: "The ultimate trial. Guide Bob to claim the Chrono-Crystal and escape the collapsing cave!",
        storyNotice: "The Chrono-Crystal rests in the inner sanctum. Navigate the grand labyrinth, retrieve the key, and claim victory!",
        allowedGates: ['I', 'X', 'Z', 'XZ'],
        mapWidth: 10,
        mapHeight: 10,
        bobStart: { x: 1, y: 8 },
        hasOscillatingTraps: true,
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 5, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 4, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 3, 1],
            [1, 0, 2, 1, 2, 1, 2, 1, 0, 1],
            [1, 0, 2, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 2, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 2, 0, 0, 0, 1],
            [1, 6, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        hint: "Follow outer corridor to east wing to claim the Key, then return through inner sanctum to the Chrono-Crystal!"
    }
];

class Game {
    constructor() {
        this.quantumEngine = new SuperdenseEngine();
        this.currentLevelIndex = 0;
        this.level = LEVELS[0];

        // Bob's Player State
        this.bob = {
            x: 0,
            y: 0,
            health: 100,
            maxHealth: 100,
            hasKey: false,
            lightRadius: 1.6,
            facing: 'UP'
        };

        // 3 LIVES SYSTEM (❤️❤️❤️)
        this.maxLives = 3;
        this.lives = 3;

        // Chrono-Shards Points System
        this.chronoShards = 150;

        // Statistics
        this.stats = {
            qubitsSent: 0,
            classicalBitsDecoded: 0,
            stepsTaken: 0,
            trapsHit: 0
        };

        // Transmission & Decoding Pipeline
        this.transmissionState = {
            selectedDirection: 'UP',
            selectedBits: '00',
            selectedGate: 'I',
            isTransmitting: false,
            autoDecode: false,
            cnotApplied: false,
            hadamardApplied: false,
            measured: false,
            lastDecoded: null,
            protocolTrace: null
        };

        this.activeHint = null;

        // Canvases
        this.aliceCanvas = null;
        this.aliceCtx = null;
        this.bobCanvas = null;
        this.bobCtx = null;
        this.waveguideCanvas = null;
        this.waveguideCtx = null;

        this.photonAnim = {
            active: false,
            progress: 0,
            bits: '00'
        };

        this.visitedTiles = new Set();
        this.animLoopId = null;
        this.turnCounter = 0;
    }

    init() {
        this.aliceCanvas = document.getElementById('alice-map-canvas');
        this.aliceCtx = this.aliceCanvas ? this.aliceCanvas.getContext('2d') : null;

        this.bobCanvas = document.getElementById('bob-cave-canvas');
        this.bobCtx = this.bobCanvas ? this.bobCanvas.getContext('2d') : null;

        this.waveguideCanvas = document.getElementById('waveguide-canvas');
        this.waveguideCtx = this.waveguideCanvas ? this.waveguideCanvas.getContext('2d') : null;

        this.loadLevel(0);
        this.setupKeyboardListeners();
        this.startRenderLoop();
    }

    loadLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= LEVELS.length) return;
        this.currentLevelIndex = levelIndex;
        this.level = JSON.parse(JSON.stringify(LEVELS[levelIndex]));

        this.bob.x = this.level.bobStart.x;
        this.bob.y = this.level.bobStart.y;
        this.bob.health = 100;
        this.bob.hasKey = false;
        this.bob.facing = 'UP';
        this.lives = this.maxLives; // Reset to 3 lives per level
        this.turnCounter = 0;
        this.activeHint = null;

        this.visitedTiles.clear();
        this.markVisited(this.bob.x, this.bob.y);

        this.resetDecoderState();
        this.setDirection('UP');

        if (window.app) {
            window.app.onLevelLoaded(this.level);
        }
    }

    resetDecoderState() {
        this.transmissionState.lastDecoded = null;
        this.transmissionState.isTransmitting = false;
        this.transmissionState.cnotApplied = false;
        this.transmissionState.hadamardApplied = false;
        this.transmissionState.measured = false;
        this.photonAnim.active = false;
    }

    markVisited(x, y) {
        this.visitedTiles.add(`${x},${y}`);
    }

    /**
     * Keyboard Listeners:
     * NOTE: Direct WASD/Arrow keys for free movement have been REMOVED!
     * Keys only trigger Transmit (Space) or Execute Move (Enter)
     */
    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();
            if (key === ' ' || key === 'ENTER') {
                e.preventDefault();
                if (this.transmissionState.measured && this.transmissionState.lastDecoded) {
                    this.executeDecodedMove();
                } else if (!this.transmissionState.isTransmitting) {
                    this.executeTransmission();
                }
            }
        });
    }

    setDirection(dir) {
        const mapping = {
            'UP': { bits: '00', gate: 'I' },
            'RIGHT': { bits: '01', gate: 'X' },
            'DOWN': { bits: '10', gate: 'Z' },
            'LEFT': { bits: '11', gate: 'XZ' }
        };

        const choice = mapping[dir];
        if (!choice) return;

        this.transmissionState.selectedDirection = dir;
        this.transmissionState.selectedBits = choice.bits;
        this.transmissionState.selectedGate = choice.gate;

        if (window.soundEngine) {
            window.soundEngine.playGateClick(choice.gate);
        }

        if (window.app) {
            window.app.onGateSelected(choice.gate, choice.bits, dir);
        }
    }

    /**
     * Alice transmits single qubit over waveguide to Bob
     */
    executeTransmission() {
        if (this.transmissionState.isTransmitting) return;

        this.transmissionState.isTransmitting = true;
        this.resetDecoderState();
        this.transmissionState.isTransmitting = true;

        const bits = this.transmissionState.selectedBits;
        const encodeInfo = this.quantumEngine.aliceEncode(bits);

        if (window.soundEngine) {
            window.soundEngine.playQuantumTransmission();
        }

        this.photonAnim.active = true;
        this.photonAnim.progress = 0;
        this.photonAnim.bits = bits;

        if (window.app) {
            window.app.onTransmissionStarted(encodeInfo);
        }

        const flightTime = 850;
        const startTime = performance.now();

        const animStep = (now) => {
            const elapsed = now - startTime;
            this.photonAnim.progress = Math.min(1, elapsed / flightTime);

            if (this.photonAnim.progress < 1) {
                requestAnimationFrame(animStep);
            } else {
                this.photonAnim.active = false;
                this.transmissionState.isTransmitting = false;
                this.stats.qubitsSent += 1;

                if (window.app) {
                    window.app.onPhotonArrivedAtBob(encodeInfo);
                }

                if (this.transmissionState.autoDecode) {
                    this.executeBobFullDecode();
                }
            }
        };

        requestAnimationFrame(animStep);
    }

    /* =========================================================================
       BOB'S INTERACTIVE QUANTUM DECODING PIPELINE
       ========================================================================= */

    bobClickCNOT() {
        if (this.transmissionState.cnotApplied) return;
        const res = this.quantumEngine.bobApplyCNOT();
        if (!res) return;

        this.transmissionState.cnotApplied = true;
        if (window.soundEngine) window.soundEngine.playCnotSnap();

        if (window.app) {
            window.app.onBobCnotApplied(res);
        }
    }

    bobClickHadamard() {
        if (!this.transmissionState.cnotApplied || this.transmissionState.hadamardApplied) return;
        const res = this.quantumEngine.bobApplyHadamard();
        if (!res) return;

        this.transmissionState.hadamardApplied = true;
        if (window.soundEngine) window.soundEngine.playHadamardChime();

        if (window.app) {
            window.app.onBobHadamardApplied(res);
        }
    }

    bobClickMeasure() {
        if (!this.transmissionState.hadamardApplied || this.transmissionState.measured) return;
        const res = this.quantumEngine.bobMeasure();
        if (!res) return;

        this.transmissionState.measured = true;
        this.stats.classicalBitsDecoded += 2;
        this.chronoShards += 50;

        this.transmissionState.lastDecoded = {
            bits: res.decodedBits,
            direction: res.decodedDirection
        };

        if (window.soundEngine) window.soundEngine.playMeasurementCollapse();

        if (window.app) {
            window.app.onBobMeasured(res);
        }
    }

    executeBobFullDecode() {
        this.bobClickCNOT();
        setTimeout(() => {
            this.bobClickHadamard();
            setTimeout(() => {
                this.bobClickMeasure();
            }, 300);
        }, 300);
    }

    /* =========================================================================
       EXECUTE DECODED MOVE & 3 LIVES SYSTEM
       ========================================================================= */
    executeDecodedMove() {
        if (!this.transmissionState.lastDecoded) {
            if (window.app) window.app.notify("No instruction decoded yet! Transmit from Alice first.", "warning");
            return;
        }

        const dir = this.transmissionState.lastDecoded.direction;
        const vectors = {
            'UP': { dx: 0, dy: -1 },
            'DOWN': { dx: 0, dy: 1 },
            'LEFT': { dx: -1, dy: 0 },
            'RIGHT': { dx: 1, dy: 0 }
        };

        const v = vectors[dir];
        if (!v) return;

        const targetX = this.bob.x + v.dx;
        const targetY = this.bob.y + v.dy;

        // Check if movement is illegal (into Wall or Out of bounds)
        const isOutOfBounds = (targetX < 0 || targetX >= this.level.mapWidth || targetY < 0 || targetY >= this.level.mapHeight);
        let isWall = false;
        if (!isOutOfBounds) {
            isWall = (this.level.map[targetY][targetX] === TILE.WALL);
        }

        if (isOutOfBounds || isWall) {
            // WRONG MOVE: Lose 1 Life!
            this.lives -= 1;
            if (window.soundEngine) window.soundEngine.playLifeLostSound();

            if (window.app) {
                window.app.updateLives(this.lives);
                window.app.notify(`WRONG MOVE! That path leads directly into solid rock! 1 Life Lost (${this.lives}/3 remaining).`, "danger");
            }

            // Check Game Over
            if (this.lives <= 0) {
                if (window.app) window.app.onGameOver("Quantum Entanglement Broken! All 3 lives lost to incorrect guidance.");
                return;
            }

            // Clear decoded instruction so player must transmit a safe instruction
            this.resetDecoderState();
            if (window.app) window.app.resetDecoderUI();
            return;
        }

        // Check Locked Door without Key
        if (this.level.map[targetY][targetX] === TILE.DOOR && !this.bob.hasKey) {
            this.lives -= 1;
            if (window.soundEngine) window.soundEngine.playLifeLostSound();
            if (window.app) {
                window.app.updateLives(this.lives);
                window.app.notify(`The Door is sealed! Bob needs the Jade Key! 1 Life Lost (${this.lives}/3).`, "danger");
            }
            if (this.lives <= 0) {
                if (window.app) window.app.onGameOver("Quantum Entanglement Broken! All 3 lives lost.");
                return;
            }
            this.resetDecoderState();
            if (window.app) window.app.resetDecoderUI();
            return;
        }

        // Valid move! Bob takes step!
        this.bobMove(v.dx, v.dy, dir);

        // Reset decoder state for next step
        this.resetDecoderState();
        if (window.app) window.app.resetDecoderUI();
    }

    bobMove(dx, dy, dirName) {
        if (this.bob.health <= 0) return;

        const targetX = this.bob.x + dx;
        const targetY = this.bob.y + dy;
        this.bob.facing = dirName;

        const tile = this.level.map[targetY][targetX];

        if (tile === TILE.DOOR && this.bob.hasKey) {
            this.level.map[targetY][targetX] = TILE.FLOOR;
            if (window.soundEngine) window.soundEngine.playDoorUnlock();
            if (window.app) window.app.notify("Jade Door Unlocked with Key!", "success");
        }

        this.bob.x = targetX;
        this.bob.y = targetY;
        this.markVisited(targetX, targetY);
        this.stats.stepsTaken++;
        this.turnCounter++;
        this.activeHint = null;

        if (this.level.hasOscillatingTraps && this.turnCounter % 3 === 0) {
            this.toggleOscillatingSpikes();
        }

        if (window.soundEngine) {
            window.soundEngine.playFootstep();
        }

        // Floor Spikes damage Bob's HP
        if (tile === TILE.SPIKE) {
            this.bob.health -= 35;
            this.stats.trapsHit++;
            if (window.soundEngine) window.soundEngine.playTrapWarning();
            if (window.app) window.app.notify("Bob stepped into a SPIKE TRAP! -35 HP!", "danger");

            if (this.bob.health <= 0) {
                this.bob.health = 0;
                if (window.app) window.app.onGameOver("Bob succumbed to subterranean spike wounds!");
                return;
            }
        }

        // Key Pickup
        if (tile === TILE.KEY) {
            this.bob.hasKey = true;
            this.level.map[targetY][targetX] = TILE.FLOOR;
            this.chronoShards += 100;
            if (window.soundEngine) window.soundEngine.playKeyCollect();
            if (window.app) window.app.notify("Bob acquired the Ancient Jade Key! (+100 Shards)", "success");
        }

        // Level Exit
        if (tile === TILE.EXIT) {
            this.chronoShards += 250;
            if (window.soundEngine) window.soundEngine.playVictory();
            if (window.app) window.app.onLevelVictory(this.currentLevelIndex);
        }

        if (window.app) {
            window.app.updateBobStatus(this.bob);
        }
    }

    toggleOscillatingSpikes() {
        const rows = this.level.mapHeight;
        const cols = this.level.mapWidth;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (this.level.map[r][c] === TILE.SPIKE) {
                    this.level.map[r][c] = TILE.SPIKE_OFF;
                } else if (this.level.map[r][c] === TILE.SPIKE_OFF) {
                    this.level.map[r][c] = TILE.SPIKE;
                }
            }
        }
    }

    /* =========================================================================
       HINT & PATHFINDING SYSTEM
       ========================================================================= */
    useHint() {
        const HINT_COST = 50;
        if (this.chronoShards < HINT_COST) {
            if (window.app) window.app.notify(`Not enough Chrono-Shards! Hints cost ${HINT_COST} shards. Complete steps to earn more.`, 'warning');
            return;
        }

        const target = this.findNearestObjective();
        if (!target) {
            if (window.app) window.app.notify("No active objective found on map!", "info");
            return;
        }

        const path = this.findPathBFS(this.bob.x, this.bob.y, target.x, target.y);
        if (!path || path.length < 2) {
            if (window.app) window.app.notify("Objective is right beside you!", "info");
            return;
        }

        this.chronoShards -= HINT_COST;
        if (window.soundEngine) window.soundEngine.playHintChime();

        const nextStep = path[1];
        const dx = nextStep.x - this.bob.x;
        const dy = nextStep.y - this.bob.y;

        let neededDir = 'UP';
        if (dx === 1) neededDir = 'RIGHT';
        else if (dx === -1) neededDir = 'LEFT';
        else if (dy === 1) neededDir = 'DOWN';
        else if (dy === -1) neededDir = 'UP';

        const mapping = {
            'UP': { gate: 'I', bits: '00' },
            'RIGHT': { gate: 'X', bits: '01' },
            'DOWN': { gate: 'Z', bits: '10' },
            'LEFT': { gate: 'XZ', bits: '11' }
        };

        const hintData = {
            direction: neededDir,
            gate: mapping[neededDir].gate,
            bits: mapping[neededDir].bits,
            targetTile: nextStep
        };

        this.activeHint = hintData;
        this.setDirection(neededDir);

        if (window.app) {
            window.app.onHintActivated(hintData, this.chronoShards);
        }
    }

    findNearestObjective() {
        const rows = this.level.mapHeight;
        const cols = this.level.mapWidth;

        if (!this.bob.hasKey) {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (this.level.map[r][c] === TILE.KEY) return { x: c, y: r };
                }
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (this.level.map[r][c] === TILE.EXIT) return { x: c, y: r };
            }
        }
        return null;
    }

    findPathBFS(startX, startY, goalX, goalY) {
        const rows = this.level.mapHeight;
        const cols = this.level.mapWidth;
        const queue = [[{ x: startX, y: startY }]];
        const visited = new Set();
        visited.add(`${startX},${startY}`);

        while (queue.length > 0) {
            const path = queue.shift();
            const curr = path[path.length - 1];

            if (curr.x === goalX && curr.y === goalY) return path;

            const neighbors = [
                { x: curr.x, y: curr.y - 1 },
                { x: curr.x + 1, y: curr.y },
                { x: curr.x, y: curr.y + 1 },
                { x: curr.x - 1, y: curr.y }
            ];

            for (const n of neighbors) {
                if (n.x >= 0 && n.x < cols && n.y >= 0 && n.y < rows) {
                    const tile = this.level.map[n.y][n.x];
                    const isTraversable = (tile !== TILE.WALL && tile !== TILE.SPIKE);
                    const key = `${n.x},${n.y}`;
                    if (isTraversable && !visited.has(key)) {
                        visited.add(key);
                        queue.push([...path, n]);
                    }
                }
            }
        }
        return null;
    }

    startRenderLoop() {
        const loop = () => {
            this.renderAliceMap();
            this.renderBobCave();
            this.renderWaveguide();
            this.animLoopId = requestAnimationFrame(loop);
        };
        this.animLoopId = requestAnimationFrame(loop);
    }

    /* =========================================================================
       CANVAS RENDERING
       ========================================================================= */
    renderAliceMap() {
        if (!this.aliceCtx || !this.aliceCanvas) return;
        const ctx = this.aliceCtx;
        const w = this.aliceCanvas.width;
        const h = this.aliceCanvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#080d1a';
        ctx.fillRect(0, 0, w, h);

        const cols = this.level.mapWidth;
        const rows = this.level.mapHeight;
        const tileSize = Math.min((w - 40) / cols, (h - 40) / rows);
        const offsetX = (w - cols * tileSize) / 2;
        const offsetY = (h - rows * tileSize) / 2;

        ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tile = this.level.map[r][c];
                const tx = offsetX + c * tileSize;
                const ty = offsetY + r * tileSize;

                if (tile === TILE.WALL) {
                    ctx.fillStyle = '#182133';
                    ctx.fillRect(tx, ty, tileSize - 2, tileSize - 2);
                    ctx.strokeStyle = '#28354d';
                    ctx.strokeRect(tx, ty, tileSize - 2, tileSize - 2);
                } else {
                    ctx.fillStyle = '#0d1527';
                    ctx.fillRect(tx, ty, tileSize - 2, tileSize - 2);
                    ctx.strokeStyle = 'rgba(0, 243, 255, 0.18)';
                    ctx.strokeRect(tx, ty, tileSize - 2, tileSize - 2);

                    if (tile === TILE.SPIKE) {
                        ctx.fillStyle = '#ef4444';
                        ctx.font = `${tileSize * 0.45}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.fillText('▲', tx + tileSize / 2, ty + tileSize * 0.65);
                    } else if (tile === TILE.SPIKE_OFF) {
                        ctx.fillStyle = '#64748b';
                        ctx.font = `${tileSize * 0.35}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.fillText('△', tx + tileSize / 2, ty + tileSize * 0.65);
                    } else if (tile === TILE.KEY) {
                        ctx.fillStyle = '#fbbf24';
                        ctx.font = `${tileSize * 0.45}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.fillText('🗝️', tx + tileSize / 2, ty + tileSize * 0.65);
                    } else if (tile === TILE.DOOR) {
                        ctx.fillStyle = '#10b981';
                        ctx.font = `${tileSize * 0.45}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.fillText('🚪', tx + tileSize / 2, ty + tileSize * 0.65);
                    } else if (tile === TILE.EXIT) {
                        ctx.fillStyle = '#00f3ff';
                        ctx.font = `${tileSize * 0.45}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.fillText('💎', tx + tileSize / 2, ty + tileSize * 0.65);
                    }
                }
            }
        }

        if (this.activeHint && this.activeHint.targetTile) {
            const hx = offsetX + this.activeHint.targetTile.x * tileSize;
            const hy = offsetY + this.activeHint.targetTile.y * tileSize;
            ctx.save();
            ctx.strokeStyle = '#ffb703';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#ffb703';
            ctx.shadowBlur = 15;
            ctx.strokeRect(hx + 2, hy + 2, tileSize - 6, tileSize - 6);
            ctx.restore();
        }

        const bobTx = offsetX + this.bob.x * tileSize + tileSize / 2;
        const bobTy = offsetY + this.bob.y * tileSize + tileSize / 2;

        const pulse = (Math.sin(performance.now() * 0.005) + 1) * 0.5;
        ctx.strokeStyle = `rgba(0, 243, 255, ${0.5 + pulse * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bobTx, bobTy, (tileSize * 0.35) + pulse * 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#00f3ff';
        ctx.beginPath();
        ctx.arc(bobTx, bobTy, tileSize * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = `bold ${tileSize * 0.22}px monospace`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('BOB', bobTx, bobTy + 4);
    }

    renderBobCave() {
        if (!this.bobCtx || !this.bobCanvas) return;
        const ctx = this.bobCtx;
        const w = this.bobCanvas.width;
        const h = this.bobCanvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#030305';
        ctx.fillRect(0, 0, w, h);

        const cols = this.level.mapWidth;
        const rows = this.level.mapHeight;
        const tileSize = Math.min((w - 40) / cols, (h - 40) / rows);
        const offsetX = (w - cols * tileSize) / 2;
        const offsetY = (h - rows * tileSize) / 2;

        const bobScreenX = offsetX + this.bob.x * tileSize + tileSize / 2;
        const bobScreenY = offsetY + this.bob.y * tileSize + tileSize / 2;
        const lightPxRadius = tileSize * this.bob.lightRadius;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tx = offsetX + c * tileSize;
                const ty = offsetY + r * tileSize;
                const tileCenterX = tx + tileSize / 2;
                const tileCenterY = ty + tileSize / 2;

                const dist = Math.hypot(tileCenterX - bobScreenX, tileCenterY - bobScreenY);
                const isLit = dist <= lightPxRadius;
                const isVisited = this.visitedTiles.has(`${c},${r}`);

                if (isLit || isVisited) {
                    const tile = this.level.map[r][c];
                    const alpha = isLit ? Math.max(0.25, 1 - dist / lightPxRadius) : 0.12;

                    ctx.save();
                    ctx.globalAlpha = alpha;

                    if (tile === TILE.WALL) {
                        ctx.fillStyle = '#171412';
                        ctx.fillRect(tx, ty, tileSize - 2, tileSize - 2);
                        ctx.strokeStyle = '#292524';
                        ctx.strokeRect(tx, ty, tileSize - 2, tileSize - 2);
                    } else {
                        ctx.fillStyle = '#0b0908';
                        ctx.fillRect(tx, ty, tileSize - 2, tileSize - 2);
                        ctx.strokeStyle = '#1c1917';
                        ctx.strokeRect(tx, ty, tileSize - 2, tileSize - 2);

                        if (isLit) {
                            if (tile === TILE.SPIKE) {
                                ctx.fillStyle = '#ef4444';
                                ctx.font = `${tileSize * 0.45}px sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.fillText('▲', tx + tileSize / 2, ty + tileSize * 0.65);
                            } else if (tile === TILE.SPIKE_OFF) {
                                ctx.fillStyle = '#475569';
                                ctx.font = `${tileSize * 0.35}px sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.fillText('△', tx + tileSize / 2, ty + tileSize * 0.65);
                            } else if (tile === TILE.KEY) {
                                ctx.fillStyle = '#fbbf24';
                                ctx.font = `${tileSize * 0.45}px sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.fillText('🗝️', tx + tileSize / 2, ty + tileSize * 0.65);
                            } else if (tile === TILE.DOOR) {
                                ctx.fillStyle = '#10b981';
                                ctx.font = `${tileSize * 0.45}px sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.fillText('🚪', tx + tileSize / 2, ty + tileSize * 0.65);
                            } else if (tile === TILE.EXIT) {
                                ctx.fillStyle = '#00f3ff';
                                ctx.font = `${tileSize * 0.45}px sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.fillText('💎', tx + tileSize / 2, ty + tileSize * 0.65);
                            }
                        }
                    }
                    ctx.restore();
                }
            }
        }

        ctx.save();
        const aura = ctx.createRadialGradient(bobScreenX, bobScreenY, 5, bobScreenX, bobScreenY, lightPxRadius);
        aura.addColorStop(0, 'rgba(0, 243, 255, 0.45)');
        aura.addColorStop(0.5, 'rgba(0, 243, 255, 0.1)');
        aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(bobScreenX, bobScreenY, lightPxRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#050508';
        ctx.beginPath();
        ctx.arc(bobScreenX, bobScreenY - tileSize * 0.15, tileSize * 0.18, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(bobScreenX - tileSize * 0.15, bobScreenY);
        ctx.lineTo(bobScreenX + tileSize * 0.15, bobScreenY);
        ctx.lineTo(bobScreenX + tileSize * 0.22, bobScreenY + tileSize * 0.35);
        ctx.lineTo(bobScreenX - tileSize * 0.22, bobScreenY + tileSize * 0.35);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(bobScreenX, bobScreenY + tileSize * 0.05, 5, 0, Math.PI * 2);
        ctx.fill();

        if (this.transmissionState.measured && this.transmissionState.lastDecoded) {
            const dir = this.transmissionState.lastDecoded.direction;
            const arrows = { 'UP': '↑', 'RIGHT': '→', 'DOWN': '↓', 'LEFT': '←' };
            ctx.fillStyle = '#ffb703';
            ctx.shadowColor = '#ffb703';
            ctx.shadowBlur = 16;
            ctx.font = `bold ${tileSize * 0.5}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(arrows[dir] || '', bobScreenX, bobScreenY - tileSize * 0.35);
        }
        ctx.restore();
    }

    renderWaveguide() {
        if (!this.waveguideCtx || !this.waveguideCanvas) return;
        const ctx = this.waveguideCtx;
        const w = this.waveguideCanvas.width;
        const h = this.waveguideCanvas.height;

        ctx.clearRect(0, 0, w, h);
        const cy = h / 2;

        ctx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, cy - 18); ctx.lineTo(w - 10, cy - 18);
        ctx.moveTo(10, cy + 18); ctx.lineTo(w - 10, cy + 18);
        ctx.stroke();

        const t = performance.now() * 0.005;
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(10, cy);
        for (let x = 10; x < w - 10; x += 5) {
            const y = cy + Math.sin(x * 0.05 + t) * 8;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        if (this.photonAnim.active) {
            const photonX = 20 + this.photonAnim.progress * (w - 40);
            const photonY = cy + Math.sin(photonX * 0.1 + t * 2) * 5;

            ctx.save();
            ctx.fillStyle = '#ffb703';
            ctx.shadowColor = '#ffb703';
            ctx.shadowBlur = 20;

            ctx.beginPath();
            ctx.arc(photonX, photonY, 7, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(photonX - 12, photonY, 5, 0, Math.PI * 2);
            ctx.arc(photonX - 22, photonY, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = 'bold 12px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(`1 Qubit (${this.photonAnim.bits})`, photonX, photonY - 14);
            ctx.restore();
        }
    }
}

window.game = new Game();

/**
 * QUANTUM ENGINE - SUPERDENSE CODING SIMULATOR (ENHANCED)
 * Mathematically rigorous 2-qubit statevector simulator supporting:
 * - Complex numbers (re, im, magnitude, phase)
 * - 2-qubit statevectors: |ψ⟩ = c00|00⟩ + c01|01⟩ + c10|10⟩ + c11|11⟩
 * - Single-qubit gates (I, X, Y, Z, H) applied to Qubit A (Alice) or Qubit B (Bob)
 * - Two-qubit gates (CNOT)
 * - Bell State preparation: (|00⟩ -> (|00⟩+|11⟩)/√2)
 * - Interactive Bob Decoding Pipeline:
 *   * Step 1: CNOT(A -> B) [Disentangles Qubit B]
 *   * Step 2: Hadamard(A) [Converts phase interference into bit value]
 *   * Step 3: Computational Measurement [Deterministic 2-bit collapse]
 */

class Complex {
    constructor(re = 0, im = 0) {
        this.re = re;
        this.im = im;
    }

    static zero() { return new Complex(0, 0); }
    static one() { return new Complex(1, 0); }
    static i() { return new Complex(0, 1); }

    add(other) {
        return new Complex(this.re + other.re, this.im + other.im);
    }

    sub(other) {
        return new Complex(this.re - other.re, this.im - other.im);
    }

    mul(other) {
        if (typeof other === 'number') {
            return new Complex(this.re * other, this.im * other);
        }
        return new Complex(
            this.re * other.re - this.im * other.im,
            this.re * other.im + this.im * other.re
        );
    }

    div(scalar) {
        return new Complex(this.re / scalar, this.im / scalar);
    }

    magSq() {
        return this.re * this.re + this.im * this.im;
    }

    mag() {
        return Math.sqrt(this.magSq());
    }

    phase() {
        return Math.atan2(this.im, this.re);
    }

    toString(precision = 3) {
        const r = Math.abs(this.re) < 1e-6 ? 0 : Number(this.re.toFixed(precision));
        const i = Math.abs(this.im) < 1e-6 ? 0 : Number(this.im.toFixed(precision));

        if (i === 0) return `${r}`;
        if (r === 0) {
            if (i === 1) return `i`;
            if (i === -1) return `-i`;
            return `${i}i`;
        }
        const sign = i > 0 ? '+' : '-';
        const absI = Math.abs(i) === 1 ? '' : Math.abs(i);
        return `${r} ${sign} ${absI}i`;
    }
}

class QuantumState {
    constructor() {
        // Basis states: |00⟩, |01⟩, |10⟩, |11⟩
        this.amplitudes = [
            Complex.one(),
            Complex.zero(),
            Complex.zero(),
            Complex.zero()
        ];
    }

    clone() {
        const copy = new QuantumState();
        copy.amplitudes = this.amplitudes.map(c => new Complex(c.re, c.im));
        return copy;
    }

    setAmplitudes(amps) {
        this.amplitudes = amps.map(c => new Complex(c.re, c.im));
        this.normalize();
    }

    normalize() {
        let totalProb = 0;
        for (const amp of this.amplitudes) {
            totalProb += amp.magSq();
        }
        if (totalProb > 1e-10) {
            const factor = Math.sqrt(totalProb);
            for (let i = 0; i < 4; i++) {
                this.amplitudes[i] = this.amplitudes[i].div(factor);
            }
        }
    }

    getProbabilities() {
        return this.amplitudes.map(a => Math.max(0, Math.min(1, a.magSq())));
    }

    toDiracNotation(precision = 3) {
        const labels = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];
        const parts = [];

        const p = this.getProbabilities();
        const isClose = (a, b) => Math.abs(a - b) < 0.05;

        // Check for common Bell states
        if (isClose(p[0], 0.5) && isClose(p[3], 0.5) && p[1] < 0.01 && p[2] < 0.01) {
            if (this.amplitudes[3].re > 0) return `|Φ⁺⟩ = (|00⟩ + |11⟩)/√2`;
            return `|Φ⁻⟩ = (|00⟩ − |11⟩)/√2`;
        }
        if (isClose(p[1], 0.5) && isClose(p[2], 0.5) && p[0] < 0.01 && p[3] < 0.01) {
            if (this.amplitudes[1].re * this.amplitudes[2].re > 0) {
                return `|Ψ⁺⟩ = (|01⟩ + |10⟩)/√2`;
            }
            return `|Ψ⁻⟩ = (|01⟩ − |10⟩)/√2`;
        }

        // Check for disentangled product states: |+0⟩, |-0⟩, |+1⟩, |-1⟩
        if (isClose(p[0], 0.5) && isClose(p[2], 0.5) && p[1] < 0.01 && p[3] < 0.01) {
            if (this.amplitudes[2].re > 0) return `|+0⟩ = (|00⟩ + |10⟩)/√2`;
            return `|−0⟩ = (|00⟩ − |10⟩)/√2`;
        }
        if (isClose(p[1], 0.5) && isClose(p[3], 0.5) && p[0] < 0.01 && p[2] < 0.01) {
            if (this.amplitudes[3].re > 0) return `|+1⟩ = (|01⟩ + |11⟩)/√2`;
            return `|−1⟩ = (|01⟩ − |11⟩)/√2`;
        }

        for (let i = 0; i < 4; i++) {
            const amp = this.amplitudes[i];
            if (amp.mag() > 0.001) {
                const ampStr = amp.toString(precision);
                parts.push(`${ampStr === '1' ? '' : ampStr + ' '}${labels[i]}`);
            }
        }

        return parts.length > 0 ? parts.join(' + ').replace(/\+ -/g, '− ') : '0';
    }

    applyGateToQubitA(matrix) {
        const newAmps = [Complex.zero(), Complex.zero(), Complex.zero(), Complex.zero()];
        for (let b = 0; b < 2; b++) {
            const idx0 = b;
            const idx1 = 2 + b;
            const c0 = this.amplitudes[idx0];
            const c1 = this.amplitudes[idx1];

            newAmps[idx0] = matrix[0][0].mul(c0).add(matrix[0][1].mul(c1));
            newAmps[idx1] = matrix[1][0].mul(c0).add(matrix[1][1].mul(c1));
        }
        this.amplitudes = newAmps;
        this.normalize();
    }

    applyGateToQubitB(matrix) {
        const newAmps = [Complex.zero(), Complex.zero(), Complex.zero(), Complex.zero()];
        for (let a = 0; a < 2; a++) {
            const idx0 = a * 2;
            const idx1 = a * 2 + 1;
            const c0 = this.amplitudes[idx0];
            const c1 = this.amplitudes[idx1];

            newAmps[idx0] = matrix[0][0].mul(c0).add(matrix[0][1].mul(c1));
            newAmps[idx1] = matrix[1][0].mul(c0).add(matrix[1][1].mul(c1));
        }
        this.amplitudes = newAmps;
        this.normalize();
    }

    applyCNOT_AB() {
        const temp = this.amplitudes[2];
        this.amplitudes[2] = this.amplitudes[3];
        this.amplitudes[3] = temp;
    }

    static get GATES() {
        const s = 1 / Math.SQRT2;
        return {
            I: [
                [Complex.one(), Complex.zero()],
                [Complex.zero(), Complex.one()]
            ],
            X: [
                [Complex.zero(), Complex.one()],
                [Complex.one(), Complex.zero()]
            ],
            Z: [
                [Complex.one(), Complex.zero()],
                [Complex.zero(), new Complex(-1, 0)]
            ],
            Y: [
                [Complex.zero(), new Complex(0, -1)],
                [new Complex(0, 1), Complex.zero()]
            ],
            H: [
                [new Complex(s, 0), new Complex(s, 0)],
                [new Complex(s, 0), new Complex(-s, 0)]
            ],
            XZ: [
                [Complex.zero(), new Complex(-1, 0)],
                [Complex.one(), Complex.zero()]
            ]
        };
    }
}

class SuperdenseEngine {
    constructor() {
        this.state = new QuantumState();
        this.stepHistory = [];
        this.pendingBobState = null;
        this.pendingEncodedBits = null;
        this.bobDecodingStage = 'IDLE'; // 'IDLE', 'RECEIVED_QUBIT', 'CNOT_APPLIED', 'HADAMARD_APPLIED', 'MEASURED'
    }

    /**
     * Prepares the shared Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
     */
    createEntanglement() {
        this.state = new QuantumState();
        this.state.applyGateToQubitA(QuantumState.GATES.H);
        this.state.applyCNOT_AB();
        return this.state.clone();
    }

    /**
     * Alice Encodes 2 bits onto her single Qubit A
     */
    aliceEncode(bits) {
        this.createEntanglement();

        let gateName = 'I';
        let direction = 'UP';
        let gateMatrix = QuantumState.GATES.I;
        let expectedBell = '|Φ⁺⟩';

        if (bits === '00') {
            gateName = 'I'; direction = 'UP'; gateMatrix = QuantumState.GATES.I; expectedBell = '|Φ⁺⟩';
        } else if (bits === '01') {
            gateName = 'X'; direction = 'RIGHT'; gateMatrix = QuantumState.GATES.X; expectedBell = '|Ψ⁺⟩';
        } else if (bits === '10') {
            gateName = 'Z'; direction = 'DOWN'; gateMatrix = QuantumState.GATES.Z; expectedBell = '|Φ⁻⟩';
        } else if (bits === '11') {
            gateName = 'XZ'; direction = 'LEFT'; gateMatrix = QuantumState.GATES.XZ; expectedBell = '|Ψ⁻⟩';
        }

        this.state.applyGateToQubitA(gateMatrix);
        this.pendingEncodedBits = bits;
        this.pendingBobState = this.state.clone();
        this.bobDecodingStage = 'RECEIVED_QUBIT';

        return {
            bits,
            direction,
            gateName,
            expectedBell,
            stateString: this.state.toDiracNotation(),
            stateVector: this.state.clone()
        };
    }

    /**
     * Bob Decoding - Step 1: Apply CNOT(A -> B)
     * DISENTANGLES Qubit B!
     */
    bobApplyCNOT() {
        if (!this.pendingBobState) return null;
        this.state.applyCNOT_AB();
        this.bobDecodingStage = 'CNOT_APPLIED';

        const stateStr = this.state.toDiracNotation();
        return {
            stage: 'BOB_CNOT',
            title: 'Bob Applies CNOT (A → B)',
            stateString: stateStr,
            stateVector: this.state.clone(),
            explanation: 'Disentangles Qubit B! Correlation is transferred back into the separable basis.'
        };
    }

    /**
     * Bob Decoding - Step 2: Apply Hadamard on Qubit A
     * Converts phase superposition into classical bit value!
     */
    bobApplyHadamard() {
        if (!this.pendingBobState) return null;
        this.state.applyGateToQubitA(QuantumState.GATES.H);
        this.bobDecodingStage = 'HADAMARD_APPLIED';

        const stateStr = this.state.toDiracNotation();
        return {
            stage: 'BOB_HADAMARD',
            title: 'Bob Applies Hadamard (H_A)',
            stateString: stateStr,
            stateVector: this.state.clone(),
            explanation: 'Interferes the phase! Superposition collapses into a single deterministic state.'
        };
    }

    /**
     * Bob Decoding - Step 3: Computational Basis Measurement
     * Yields the exact 2 classical bits with 100% certainty!
     */
    bobMeasure() {
        if (!this.pendingBobState) return null;

        const probs = this.state.getProbabilities();
        let measuredIndex = 0;
        let maxProb = -1;
        for (let i = 0; i < 4; i++) {
            if (probs[i] > maxProb) {
                maxProb = probs[i];
                measuredIndex = i;
            }
        }

        const bitStrings = ['00', '01', '10', '11'];
        const directions = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        const decodedBits = bitStrings[measuredIndex];
        const decodedDirection = directions[measuredIndex];

        this.bobDecodingStage = 'MEASURED';
        return {
            decodedBits,
            decodedDirection,
            fidelity: (maxProb * 100).toFixed(0) + '%',
            stateString: `|${decodedBits}⟩`
        };
    }

    /**
     * Runs full protocol automatically if requested
     */
    runFullProtocol(bits) {
        const enc = this.aliceEncode(bits);
        const cnot = this.bobApplyCNOT();
        const had = this.bobApplyHadamard();
        const meas = this.bobMeasure();

        return {
            bits,
            direction: enc.direction,
            gateUsed: enc.gateName,
            decodedBits: meas.decodedBits,
            decodedDirection: meas.decodedDirection,
            stateAfterEncode: enc.stateString,
            stateAfterCNOT: cnot.stateString,
            stateAfterH: had.stateString,
            finalState: meas.stateString
        };
    }
}

// Global export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Complex, QuantumState, SuperdenseEngine };
} else {
    window.Complex = Complex;
    window.QuantumState = QuantumState;
    window.SuperdenseEngine = SuperdenseEngine;
}

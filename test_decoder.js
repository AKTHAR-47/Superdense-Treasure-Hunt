const { SuperdenseEngine } = require('./quantum.js');

const engine = new SuperdenseEngine();

console.log("=== VERIFYING BOB'S INTERACTIVE DECODER STEP-BY-STEP ===");
const cases = [
    { bits: '00', gate: 'I', dir: 'UP' },
    { bits: '01', gate: 'X', dir: 'RIGHT' },
    { bits: '10', gate: 'Z', dir: 'DOWN' },
    { bits: '11', gate: 'XZ', dir: 'LEFT' }
];

let allOk = true;
cases.forEach(c => {
    // 1. Alice encodes
    const enc = engine.aliceEncode(c.bits);
    // 2. Bob applies CNOT
    const cnot = engine.bobApplyCNOT();
    // 3. Bob applies Hadamard
    const had = engine.bobApplyHadamard();
    // 4. Bob measures
    const meas = engine.bobMeasure();

    const ok = (meas.decodedBits === c.bits && meas.decodedDirection === c.dir);
    if (!ok) allOk = false;
    console.log(`Gate ${c.gate.padEnd(2)} -> Encoded: ${enc.stateString.padEnd(28)} -> CNOT: ${cnot.stateString.padEnd(28)} -> H: ${had.stateString.padEnd(14)} -> Decoded: ${meas.decodedBits} (${meas.decodedDirection}) | MATCH: ${ok}`);
});

console.log("\nALL INTERACTIVE DECODER STAGES VERIFIED:", allOk);

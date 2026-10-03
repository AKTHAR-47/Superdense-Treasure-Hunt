const { SuperdenseEngine } = require('./quantum.js');
const engine = new SuperdenseEngine();

const cases = ['00', '01', '10', '11'];
let allPassed = true;
cases.forEach(bits => {
    const res = engine.runFullProtocol(bits);
    const passed = (bits === res.decodedBits);
    if (!passed) allPassed = false;
    console.log("Input: " + bits + " -> Gate: " + res.gateUsed + " -> Decoded: " + res.decodedBits + " (" + res.decodedDirection + ") | Match: " + passed);
});

console.log("ALL TESTS PASSED: " + allPassed);

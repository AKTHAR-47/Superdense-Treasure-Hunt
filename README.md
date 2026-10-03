# 🌌 ENTANGLED: The Shadow Labyrinth
### A Quantum Superdense Coding Story Adventure (Hackathon Edition)

Inspired by **Shadow Fight 2** cinematography and quantum information theory.

---

## 🏆 Key Features for Hackathon Evaluators

1. **Dual Perspective Symmetry (Alice Encodes, Bob Decodes):**
   - **Alice (Sending Half):** Applies local Pauli Gates $\{I, X, Z, XZ\}$ to her single qubit $A$, preparing one of the 4 mutually orthogonal Bell states: $|\Phi^+\rangle, |\Psi^+\rangle, |\Phi^-\rangle, |\Psi^-\rangle$.
   - **Bob (Receiving Half):** When the photon arrives, Bob interacts with his **Quantum Decoder Circuit**:
     - **Step 1: CNOT Gate ($A \to B$):** Disentangles Qubit $B$ into a definite classical state ($|0\rangle$ or $|1\rangle$)!
     - **Step 2: Hadamard Gate ($H_A$):** Converts relative phase interference ($|+\rangle$ or $|-\rangle$) into computational basis states.
     - **Step 3: Measurement:** Deterministically collapses the dual qubits into the exact 2 classical bits Alice transmitted with 100% fidelity.
   - *Auto-Decode toggle* is also available for rapid gameplay.

2. **Level 0: The Quantum Dojo (All 4 Gates in 1 Demonstration):**
   - Evaluators can immediately demo all 4 Gates in a 4-chamber arena:
     - Chamber 1: Gate **$I$** $\implies$ `00` $\implies$ **UP ⬆️**
     - Chamber 2: Gate **$X$** $\implies$ `01` $\implies$ **RIGHT ➡️**
     - Chamber 3: Gate **$Z$** $\implies$ `10` $\implies$ **DOWN ⬇️**
     - Chamber 4: Gate **$XZ$** $\implies$ `11` $\implies$ **LEFT ⬅️** into the Dojo Shrine!

3. **Shadow Fight 2 Cinematic Intro with Controls & Voiceover:**
   - **Interactive Navigation:** `[ ◀ PREV ]`, `[ ⏸ PAUSE ]`, `[ NEXT ▶ ]`, and `[ SKIP INTRO ➔ ]` allow reading and pacing at the evaluator's own speed.
   - **Web Speech API Voice Narrator:** Dramatically reads out each story act in a deep, atmospheric martial voice with a toggle (`[ 🎙️ VOICE: ON/OFF ]`).
   - **Atmospheric Procedural Audio:** Authentic Japanese Shakuhachi flute, koto arpeggios, and heavy resonant taiko drums built directly via the Web Audio API without external file dependencies.

4. **Chrono-Shards (Points) & Hint System:**
   - Players start with **150 Chrono-Shards**.
   - Earn **+50 Shards** for every successful quantum decoding and **+250 Shards** for clearing levels.
   - Spend **50 Shards** on **`[ 💡 HINT ]`**:
     - Runs a real-time BFS pathfinder.
     - Flashes the recommended Gate button on Alice's console with a gold/cyan pulse.
     - Highlights the safe target tile on Alice's map.
     - Displays tactical guidance on hazards.

5. **Increasing Difficulty & Dynamic Hurdles:**
   - Alternating rhythmic spike traps (spikes oscillate on and off every 3 steps).
   - Dynamic fog-of-war in deep subterranean vaults.
   - Jade doors requiring ancient keys.

---

## 🎮 How to Play

1. **Launch the Game:** Double-click [`index.html`](file:///C:/Users/mohmmed%20akthar/.gemini/antigravity/scratch/entangled-superdense-game/index.html) in your browser.
2. **Intro:** Listen to the voice narrator and ambient martial music. Use `NEXT ▶` to step through the story, or click `SKIP INTRO ➔`.
3. **Alice's Map (Left):** Review the full map, hazards, and Bob's position. Select the direction and Pauli gate.
4. **Transmit:** Click `⚡ TRANSMIT QUBIT (SPACE)`. Watch the photon travel across the quantum waveguide.
5. **Bob's Decoder (Right):**
   - Click `1. CNOT Gate` $\to$ Disentangles Qubit B.
   - Click `2. Hadamard (H)` $\to$ Resolves phase interference.
   - Click `3. Measure State` $\to$ Collapses into the 2 classical bits!
6. **Move:** Press **WASD**, **Arrow keys**, or click `[ EXECUTE MOVE ➔ ]` to guide Bob through the cave!

---

## 📁 Source Code Files

- [**`index.html`**](file:///C:/Users/mohmmed%20akthar/.gemini/antigravity/scratch/entangled-superdense-game/index.html) - Split HUD, interactive decoder circuit, intro controls, and evaluator spotlight banner.
- [**`style.css`**](file:///C:/Users/mohmmed%20akthar/.gemini/antigravity/scratch/entangled-superdense-game/style.css) - Shadow Fight 2 dark silhouette aesthetics, kanji accents, circuit wire diagrams, and responsive layouts.
- [**`quantum.js`**](file:///C:/Users/mohmmed%20akthar/.gemini/antigravity/scratch/entangled-superdense-game/quantum.js) - Exact 2-qubit statevector engine with complex numbers, Pauli matrices, Bell states, and Bob's step-by-step decoding pipeline.
- [**`audio.js`**](file:///C:/Users/mohmmed%20akthar/.gemini/antigravity/scratch/entangled-superdense-game/audio.js) - Web Audio API procedural synthesizer for Shakuhachi flute, koto, taiko drums, and Web Speech API narrator.
- [**`intro.js`**](file:///C:/Users/mohmmed%20akthar/.gemini/antigravity/scratch/entangled-superdense-game/intro.js) - Canvas silhouette vector animation with interactive Prev/Next/Pause controls and speech sync.
- [**`game.js`**](file:///C:/Users/mohmmed%20akthar/.gemini/antigravity/scratch/entangled-superdense-game/game.js) - Level 0 Dojo + 6 progressive levels, BFS hint pathfinding, Chrono-Shards points, and oscillating hazards.
- [**`app.js`**](file:///C:/Users/mohmmed%20akthar/.gemini/antigravity/scratch/entangled-superdense-game/app.js) - Application controller managing UI interactions, decoding events, hints, and modals.

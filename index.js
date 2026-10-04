/* ==========================================================================
   MONARCH ORCA TELEMETRY ENGINE - JS
   Web Audio API Procedural Synthesizer & Canvas Visualizer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // State & DOM Elements
    // --------------------------------------------------
    let audioCtx = null;
    let masterGainNode = null;
    let analyserNode = null;
    let isOrcaActive = false;
    let pitchMultiplier = 1.0;

    const powerBtn = document.getElementById('orca-power-btn');
    const masterVolSlider = document.getElementById('master-vol');
    const volValueDisplay = document.getElementById('vol-value');
    const pitchSlider = document.getElementById('resonance-pitch');
    const pitchValueDisplay = document.getElementById('pitch-value');
    const consoleLog = document.getElementById('console-log');
    const canvas = document.getElementById('waveform-canvas');
    const canvasCtx = canvas ? canvas.getContext('2d') : null;
    const soundCards = document.querySelectorAll('.sound-card');
    const navLinks = document.querySelectorAll('.telemetry-link');

    // --------------------------------------------------
    // Core Web Audio Initialization
    // --------------------------------------------------
    function initAudioEngine() {
        if (audioCtx) return;

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();

        // Master Gain
        masterGainNode = audioCtx.createGain();
        const initialVol = parseFloat(masterVolSlider.value) / 100;
        masterGainNode.gain.setValueAtTime(initialVol, audioCtx.currentTime);

        // Visualizer Analyser Node
        analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 512;

        // Routing: Signal -> Master Gain -> Analyser -> Output
        masterGainNode.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);

        isOrcaActive = true;
        powerBtn.classList.add('active');
        powerBtn.innerText = 'ORCA ONLINE [ONLINE]';
        writeLog('[ORCA ONLINE] Acoustic telemetry array initialized.', 'system');
    }

    function toggleOrcaPower() {
        if (!audioCtx) {
            initAudioEngine();
            return;
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
            isOrcaActive = true;
            powerBtn.classList.add('active');
            powerBtn.innerText = 'ORCA ONLINE [ONLINE]';
            writeLog('[ORCA RESUMED] Bio-acoustic sync re-established.', 'system');
        } else if (audioCtx.state === 'running') {
            audioCtx.suspend();
            isOrcaActive = false;
            powerBtn.classList.remove('active');
            powerBtn.innerText = 'INITIALIZE ORCA';
            writeLog('[ORCA PAUSED] Acoustic matrix suspended.', 'warning');
        }
    }

    if (powerBtn) {
        powerBtn.addEventListener('click', toggleOrcaPower);
    }

    // --------------------------------------------------
    // Control Sliders
    // --------------------------------------------------
    if (masterVolSlider) {
        masterVolSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            volValueDisplay.innerText = `${val}%`;
            if (masterGainNode && audioCtx) {
                masterGainNode.gain.setTargetAtTime(val / 100, audioCtx.currentTime, 0.05);
            }
        });
    }

    if (pitchSlider) {
        pitchSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            pitchMultiplier = parseFloat(val) / 100;
            pitchValueDisplay.innerText = `${pitchMultiplier.toFixed(1)}x`;
        });
    }

    // --------------------------------------------------
    // Console Output Logging
    // --------------------------------------------------
    function writeLog(message, type = 'info') {
        if (!consoleLog) return;
        const entry = document.createElement('p');
        const timestamp = new Date().toTimeString().split(' ')[0];
        entry.className = `log-entry ${type}`;
        entry.innerText = `[${timestamp}] ${message}`;

        consoleLog.appendChild(entry);
        consoleLog.scrollTop = consoleLog.scrollHeight;
    }

    // --------------------------------------------------
    // Procedural Sound Generator (Monarch Audio Engine)
    // --------------------------------------------------
    function triggerSound(soundType, cardTitle) {
        if (!audioCtx) {
            initAudioEngine();
        } else if (audioCtx.state === 'suspended') {
            audioCtx.resume();
            isOrcaActive = true;
            powerBtn.classList.add('active');
            powerBtn.innerText = 'ORCA ONLINE [ONLINE]';
        }

        const now = audioCtx.currentTime;

        // Sound profile routing
        switch (soundType) {
            case 'roar-2014':
            case 'roar-2019-1':
            case 'roar-ultimate':
                playSubBassRoar(now, 55 * pitchMultiplier, 2.5);
                break;

            case 'roar-evolved-1':
            case 'roar-evolved-2':
                playEvolvedPinkRoar(now, 90 * pitchMultiplier, 2.2);
                break;

            case 'roar-1954-1':
            case 'roar-1954-2':
            case 'roar-heisei':
            case 'roar-1984':
                playClassicMetallicRoar(now, 120 * pitchMultiplier, 2.0);
                break;

            case 'roar-shin':
            case 'roar-minus-one':
                playPiercingScreech(now, 220 * pitchMultiplier, 2.8);
                break;

            case 'roar-zilla-1':
            case 'roar-zilla-2':
                playPiercingScreech(now, 380 * pitchMultiplier, 1.5);
                break;

            case 'roar-dominic':
            case 'roar-victory':
                playSubBassRoar(now, 70 * pitchMultiplier, 3.0);
                break;

            // Atomic Breath FX
            case 'atomic-charge':
                playCherenkovCharge(now, 1.8);
                break;
            case 'atomic-blast':
            case 'spiral-ray':
                playAtomicBeamDischarge(now, 2.5);
                break;
            case 'thermo-pulse':
                playThermoPulse(now, 3.0);
                break;

            // Soundtrack Motifs
            case 'theme-main':
            case 'theme-march':
                playOrchestralMotif(now);
                break;
            case 'theme-ambience':
                playDeepSeaAmbience(now);
                break;

            // Edits & Remixes
            case 'edit-phonk':
            case 'edit-synthwave':
            case 'edit-bassdrop':
                playEditBeat(now);
                break;

            default:
                playSubBassRoar(now, 80 * pitchMultiplier, 1.5);
                break;
        }

        writeLog(`TRANSMITTING FREQUENCY: [${cardTitle.toUpperCase()}]`, 'transmit');
    }

    // Acoustic Synthesis Handlers
    function playSubBassRoar(startTime, baseFreq, duration) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, startTime + 0.4);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, startTime + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, startTime);
        filter.frequency.linearRampToValueAtTime(1200, startTime + 0.5);
        filter.frequency.linearRampToValueAtTime(200, startTime + duration);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.8, startTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainNode);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    function playEvolvedPinkRoar(startTime, baseFreq, duration) {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(baseFreq, startTime);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 3, startTime + 0.3);
        osc1.frequency.linearRampToValueAtTime(baseFreq * 0.5, startTime + duration);

        osc2.frequency.setValueAtTime(baseFreq * 1.5, startTime);
        osc2.frequency.exponentialRampToValueAtTime(baseFreq * 4, startTime + 0.3);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.7, startTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGainNode);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);
    }

    function playClassicMetallicRoar(startTime, baseFreq, duration) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq, startTime);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.8, startTime + 0.2);
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.6, startTime + duration);

        gain.gain.setValueAtTime(0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGainNode);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    function playPiercingScreech(startTime, baseFreq, duration) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, startTime + 0.3);
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.8, startTime + duration);

        gain.gain.setValueAtTime(0.5, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGainNode);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    function playCherenkovCharge(startTime, duration) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, startTime);
        osc.frequency.exponentialRampToValueAtTime(1200 * pitchMultiplier, startTime + duration);

        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.linearRampToValueAtTime(0.8, startTime + duration);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.2);

        osc.connect(gain);
        gain.connect(masterGainNode);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.2);
    }

    function playAtomicBeamDischarge(startTime, duration) {
        // White noise generator for beam acoustic rumble
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300 * pitchMultiplier, startTime);
        filter.Q.setValueAtTime(3.0, startTime);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.8, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainNode);

        noise.start(startTime);
        noise.stop(startTime + duration);
    }

    function playThermoPulse(startTime, duration) {
        playSubBassRoar(startTime, 40 * pitchMultiplier, duration);
        playAtomicBeamDischarge(startTime + 0.2, duration - 0.2);
    }

    function playOrchestralMotif(startTime) {
        const notes = [130.81, 146.83, 164.81, 174.61]; // C3, D3, E3, F3
        notes.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const noteTime = startTime + index * 0.25;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq * pitchMultiplier, noteTime);

            gain.gain.setValueAtTime(0.4, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

            osc.connect(gain);
            gain.connect(masterGainNode);

            osc.start(noteTime);
            osc.stop(noteTime + 0.4);
        });
    }

    function playDeepSeaAmbience(startTime) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(35 * pitchMultiplier, startTime);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.5, startTime + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 3.5);

        osc.connect(gain);
        gain.connect(masterGainNode);

        osc.start(startTime);
        osc.stop(startTime + 3.5);
    }

    function playEditBeat(startTime) {
        // Kick Drum
        const kickOsc = audioCtx.createOscillator();
        const kickGain = audioCtx.createGain();

        kickOsc.frequency.setValueAtTime(160 * pitchMultiplier, startTime);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        kickGain.gain.setValueAtTime(0.9, startTime);
        kickGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        kickOsc.connect(kickGain);
        kickGain.connect(masterGainNode);

        kickOsc.start(startTime);
        kickOsc.stop(startTime + 0.3);
    }

    // --------------------------------------------------
    // Event Listeners for Soundboard Cards
    // --------------------------------------------------
    soundCards.forEach((card) => {
        const btn = card.querySelector('.trigger-btn');
        const soundType = card.getAttribute('data-type');
        const title = card.querySelector('.titan-name')?.innerText || 'Telemetry Trigger';

        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Visual Pulse Effect
                card.classList.add('transmitting');
                setTimeout(() => card.classList.remove('transmitting'), 400);

                triggerSound(soundType, title);
            });
        }
    });

    // Navigation Menu Active Highlights
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // --------------------------------------------------
    // Bio-Resonance Waveform Visualizer Loop
    // --------------------------------------------------
    function renderVisualizer() {
        if (!canvasCtx || !canvas) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const width = canvas.width;
        const height = canvas.height;

        canvasCtx.fillStyle = '#050B14';
        canvasCtx.fillRect(0, 0, width, height);

        // Draw HUD Grid Lines
        canvasCtx.strokeStyle = 'rgba(0, 255, 204, 0.08)';
        canvasCtx.lineWidth = 1;
        for (let x = 0; x < width; x += 20) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, 0);
            canvasCtx.lineTo(x, height);
            canvasCtx.stroke();
        }

        if (analyserNode && isOrcaActive) {
            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyserNode.getByteTimeDomainData(dataArray);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = '#00ffcc';
            canvasCtx.shadowBlur = 8;
            canvasCtx.shadowColor = '#00ffcc';

            canvasCtx.beginPath();
            const sliceWidth = width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * height) / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(width, height / 2);
            canvasCtx.stroke();
            canvasCtx.shadowBlur = 0; // Reset
        } else {
            // Idle Flatline Wave
            canvasCtx.lineWidth = 1.5;
            canvasCtx.strokeStyle = 'rgba(0, 255, 204, 0.3)';
            canvasCtx.beginPath();
            canvasCtx.moveTo(0, height / 2);
            canvasCtx.lineTo(width, height / 2);
            canvasCtx.stroke();
        }

        requestAnimationFrame(renderVisualizer);
    }

    // Start Visualizer Loop
    renderVisualizer();
});
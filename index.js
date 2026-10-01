/**
 * MONARCH Godzilla Bio-Acoustic Audio System
 * Synthesizer & DSP Soundboard for Godzilla Roars, FX, Motifs & Edits
 */

class GodzillaAudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.analyser = null;
        this.isInitialized = false;
        
        // Pitch Modulation ratio
        this.pitchRatio = 1.0;
        this.activeNodes = [];
    }

    init() {
        if (this.isInitialized) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.8;

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        this.isInitialized = true;
        this.logConsole('ORCA Godzilla Audio Synth online.', 'system');
    }

    setMasterVolume(val) {
        if (this.masterGain) {
            this.masterGain.gain.value = val;
        }
    }

    setPitchRatio(val) {
        this.pitchRatio = val;
    }

    logConsole(message, type = 'system') {
        const consoleEl = document.getElementById('console-log');
        if (!consoleEl) return;

        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        const timeStamp = new Date().toISOString().substring(11, 19);
        entry.innerText = `[${timeStamp}] ${message}`;

        consoleEl.appendChild(entry);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    playSound(soundType) {
        if (!this.isInitialized) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;

        switch (soundType) {
            // --- 1. GODZILLA ROARS ---
            case 'roar-2014':
                this.logConsole('Transmitting: 2014 MonsterVerse Alpha Roar', 'godzilla');
                this.synthRoarMonsterverse(now);
                break;
            case 'roar-kotm':
                this.logConsole('Transmitting: King of the Monsters Imperial Call', 'godzilla');
                this.synthRoarKOTM(now);
                break;
            case 'roar-heisei':
                this.logConsole('Transmitting: Heisei Era Metallic Roar', 'godzilla');
                this.synthRoarHeisei(now);
                break;
            case 'roar-1954':
                this.logConsole('Transmitting: Original 1954 Friction Roar', 'godzilla');
                this.synthRoar1954(now);
                break;
            case 'roar-millennium':
                this.logConsole('Transmitting: Millennium Era Sharp Growl', 'godzilla');
                this.synthRoarMillennium(now);
                break;
            case 'roar-sp':
                this.logConsole('Transmitting: Godzilla Ultima Dimensional Roar', 'godzilla');
                this.synthRoarUltima(now);
                break;

            // --- 2. ATOMIC BREATH FX ---
            case 'atomic-charge':
                this.logConsole('Energy Detected: Dorsal Plate Charge', 'atomic');
                this.synthAtomicCharge(now);
                break;
            case 'atomic-blast':
                this.logConsole('Discharge: Atomic Breath Blast', 'atomic');
                this.synthAtomicBlast(now);
                break;
            case 'spiral-ray':
                this.logConsole('Warning: Red Spiral Heat Ray', 'atomic');
                this.synthSpiralRay(now);
                break;
            case 'thermo-pulse':
                this.logConsole('CRITICAL: Thermonuclear Pulse Shockwave', 'atomic');
                this.synthThermoPulse(now);
                break;

            // --- 3. OFFICIAL SOUNDTRACK MOTIFS ---
            case 'theme-main':
                this.logConsole('Soundtrack: Akira Ifukube Main Theme Motif', 'soundtrack');
                this.synthMainTheme(now);
                break;
            case 'theme-march':
                this.logConsole('Soundtrack: Godzilla Military March', 'soundtrack');
                this.synthMarchTheme(now);
                break;
            case 'theme-ambience':
                this.logConsole('Ambience: Deep Sea Bio-Telemetry', 'soundtrack');
                this.synthDeepSeaAmbience(now);
                break;

            // --- 4. EDIT & REMIX SOUNDTRACKS ---
            case 'edit-phonk':
                this.logConsole('Edit Track: Godzilla Drift Phonk Motif', 'edit');
                this.synthPhonkEdit(now);
                break;
            case 'edit-synthwave':
                this.logConsole('Edit Track: Cyberpunk Neon Gojira', 'edit');
                this.synthSynthwaveEdit(now);
                break;
            case 'edit-bassdrop':
                this.logConsole('Edit Track: Trailer Sub Bass Drop', 'edit');
                this.synthTrailerBassDrop(now);
                break;
        }
    }

    // --- SYNTHESIZERS ---

    // 2014 MonsterVerse Alpha Roar
    synthRoarMonsterverse(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60 * this.pitchRatio, now);
        osc.frequency.exponentialRampToValueAtTime(160 * this.pitchRatio, now + 0.4);
        osc.frequency.exponentialRampToValueAtTime(40 * this.pitchRatio, now + 2.4);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.linearRampToValueAtTime(1600, now + 0.5);
        filter.frequency.linearRampToValueAtTime(180, now + 2.4);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.9, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.5);
    }

    // King of the Monsters Imperial Call
    synthRoarKOTM(now) {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(75 * this.pitchRatio, now);
        osc1.frequency.exponentialRampToValueAtTime(220 * this.pitchRatio, now + 0.3);
        osc1.frequency.exponentialRampToValueAtTime(50 * this.pitchRatio, now + 2.8);

        osc2.frequency.setValueAtTime(80 * this.pitchRatio, now);
        osc2.frequency.exponentialRampToValueAtTime(225 * this.pitchRatio, now + 0.3);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.9);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.9);
        osc2.stop(now + 2.9);
    }

    // Heisei Metallic Roar
    synthRoarHeisei(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120 * this.pitchRatio, now);
        osc.frequency.linearRampToValueAtTime(280 * this.pitchRatio, now + 0.4);
        osc.frequency.linearRampToValueAtTime(90 * this.pitchRatio, now + 1.8);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.8);
    }

    // 1954 Original Contrabass Friction Roar
    synthRoar1954(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(50 * this.pitchRatio, now);
        osc.frequency.linearRampToValueAtTime(110 * this.pitchRatio, now + 0.6);
        osc.frequency.linearRampToValueAtTime(35 * this.pitchRatio, now + 2.0);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.9, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.1);
    }

    // Millennium Sharp Growl
    synthRoarMillennium(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150 * this.pitchRatio, now);
        osc.frequency.linearRampToValueAtTime(320 * this.pitchRatio, now + 0.3);
        osc.frequency.linearRampToValueAtTime(110 * this.pitchRatio, now + 1.6);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.85, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.6);
    }

    // Ultima Dimensional Roar
    synthRoarUltima(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(40 * this.pitchRatio, now);
        osc.frequency.exponentialRampToValueAtTime(400 * this.pitchRatio, now + 0.8);
        osc.frequency.exponentialRampToValueAtTime(30 * this.pitchRatio, now + 3.0);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.9, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.1);
    }

    // Atomic Dorsal Charge
    synthAtomicCharge(now) {
        const bufferSize = this.ctx.sampleRate * 2.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 10.0;
        filter.frequency.setValueAtTime(150, now);
        filter.frequency.exponentialRampToValueAtTime(3200 * this.pitchRatio, now + 2.0);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + 2.2);
    }

    // Atomic Breath Blast
    synthAtomicBlast(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300 * this.pitchRatio, now);
        osc.frequency.linearRampToValueAtTime(800 * this.pitchRatio, now + 0.3);
        osc.frequency.linearRampToValueAtTime(120 * this.pitchRatio, now + 2.0);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.9, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.0);
    }

    // Red Spiral Heat Ray
    synthSpiralRay(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(200 * this.pitchRatio, now);
        osc.frequency.exponentialRampToValueAtTime(1200 * this.pitchRatio, now + 0.5);
        osc.frequency.exponentialRampToValueAtTime(90 * this.pitchRatio, now + 2.2);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.95, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.3);
    }

    // Thermonuclear Pulse
    synthThermoPulse(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120 * this.pitchRatio, now);
        osc.frequency.exponentialRampToValueAtTime(25 * this.pitchRatio, now + 1.8);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(1.0, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.0);
    }

    // Main Akira Ifukube Theme Motif (Brass/Timpani simulation)
    synthMainTheme(now) {
        const notes = [110, 123.47, 130.81, 110, 123.47]; // A2, B2, C3, A2, B2
        notes.forEach((freq, i) => {
            const time = now + (i * 0.35);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq * this.pitchRatio, time);

            gain.gain.setValueAtTime(0.01, time);
            gain.gain.linearRampToValueAtTime(0.4, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.32);
        });
    }

    // Godzilla Military March Motif
    synthMarchTheme(now) {
        const notes = [130.81, 146.83, 164.81, 130.81];
        notes.forEach((freq, i) => {
            const time = now + (i * 0.28);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq * this.pitchRatio, time);

            gain.gain.setValueAtTime(0.01, time);
            gain.gain.linearRampToValueAtTime(0.5, time + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.25);
        });
    }

    // Deep Sea Ambience
    synthDeepSeaAmbience(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(45, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.0);
    }

    // Phonk Remix Motif (Cowbell & Heavy Bass)
    synthPhonkEdit(now) {
        // Cowbell note pattern
        const notes = [587.33, 587.33, 880, 587.33, 783.99];
        notes.forEach((freq, i) => {
            const time = now + (i * 0.2);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.15);
        });

        // Sub Bass Punch
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(50, now);

        bassGain.gain.setValueAtTime(0.6, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain);

        bassOsc.start(now);
        bassOsc.stop(now + 1.2);
    }

    // Synthwave Neon Gojira Edit
    synthSynthwaveEdit(now) {
        const arp = [110, 164.81, 220, 329.63, 220, 164.81];
        arp.forEach((freq, i) => {
            const time = now + (i * 0.15);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq * this.pitchRatio, time);

            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.12);
        });
    }

    // Trailer Sub Bass Drop
    synthTrailerBassDrop(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140 * this.pitchRatio, now);
        osc.frequency.exponentialRampToValueAtTime(20 * this.pitchRatio, now + 2.2);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.95, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.3);
    }
}

// App DOM Controller
document.addEventListener('DOMContentLoaded', () => {
    const audioApp = new GodzillaAudioSystem();

    // Power Initialization Button
    const powerBtn = document.getElementById('orca-power-btn');
    powerBtn.addEventListener('click', () => {
        audioApp.init();
        powerBtn.innerText = 'ORCA ONLINE';
        powerBtn.style.background = '#00ff88';
        powerBtn.style.color = '#000000';
    });

    // Soundboard Grid Buttons
    const soundCards = document.querySelectorAll('.sound-card');
    soundCards.forEach(card => {
        const btn = card.querySelector('.trigger-btn');
        const type = card.dataset.type;

        btn.addEventListener('click', () => {
            audioApp.playSound(type);
        });
    });

    // Sliders
    const masterVolSlider = document.getElementById('master-vol');
    const volValueLabel = document.getElementById('vol-value');
    masterVolSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        volValueLabel.innerText = `${val}%`;
        audioApp.setMasterVolume(val / 100);
    });

    const pitchSlider = document.getElementById('resonance-pitch');
    const pitchValueLabel = document.getElementById('pitch-value');
    pitchSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        const ratio = (val / 100).toFixed(1);
        pitchValueLabel.innerText = `${ratio}x`;
        audioApp.setPitchRatio(parseFloat(ratio));
    });

    // Visualizer Canvas
    const canvas = document.getElementById('waveform-canvas');
    const canvasCtx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        canvasCtx.fillStyle = '#020508';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        if (!audioApp.analyser) {
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = '#1a384c';
            canvasCtx.moveTo(0, canvas.height / 2);
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
            return;
        }

        const bufferLength = audioApp.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audioApp.analyser.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;

            canvasCtx.fillStyle = `rgba(0, 191, 255, ${dataArray[i] / 255 + 0.2})`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 2;
        }
    }

    drawVisualizer();
});
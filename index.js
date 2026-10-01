/**
 * MONARCH ORCA & Titan Bio-Acoustic Audio System
 * Powered by Web Audio API DSP Synthesis
 */

class MonarchAudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.analyser = null;
        this.isInitialized = false;
        
        // Pitch/Resonance Modulation (default 1.0)
        this.pitchRatio = 1.0;
        
        // Ambient loops state
        this.activeBgmOscillators = [];
        this.activeBgmType = null;
    }

    init() {
        if (this.isInitialized) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Master Gain Node
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.8;

        // Visualizer Analyser Node
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;

        // Routing
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        this.isInitialized = true;
        this.logConsole('ORCA Audio Engine initialized successfully.', 'system');
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

    // --- Titan Synthesized Roar Generator ---
    playTitanSound(soundType, titanName) {
        if (!this.isInitialized) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        this.logConsole(`Transmitting frequency: ${titanName.toUpperCase()} [${soundType}]`, titanName.toLowerCase());

        const now = this.ctx.currentTime;

        switch (soundType) {
            case 'alpha-roar':
                this.synthesizeGodzillaRoar(now);
                break;
            case 'atomic-breath':
                this.synthesizeAtomicBreath(now);
                break;
            case 'kong-roar':
                this.synthesizeKongRoar(now);
                break;
            case 'chest-beat':
                this.synthesizeChestBeat(now);
                break;
            case 'ghidorah-roar':
                this.synthesizeGhidorahRoar(now);
                break;
            case 'rodan-roar':
                this.synthesizeRodanRoar(now);
                break;
            case 'mothra-song':
                this.synthesizeMothraSong(now);
                break;
            case 'mecha-roar':
                this.synthesizeMechaRoar(now);
                break;
            case 'shimo-roar':
                this.synthesizeShimoRoar(now);
                break;
            default:
                this.synthesizeGenericSub(now);
                break;
        }
    }

    // Godzilla Imperial Alpha Roar Synthesizer
    synthesizeGodzillaRoar(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        
        // Sub-bass pitch sweep modulated by resonance settings
        const baseFreq = 65 * this.pitchRatio;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(160 * this.pitchRatio, now + 0.4);
        osc.frequency.exponentialRampToValueAtTime(45 * this.pitchRatio, now + 2.2);

        // Filter envelope for metallic/reptilian roar timbre
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.linearRampToValueAtTime(1800, now + 0.5);
        filter.frequency.linearRampToValueAtTime(200, now + 2.2);

        // Gain volume envelope
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.9, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.3);
    }

    // Atomic Breath Energy Charge
    synthesizeAtomicBreath(now) {
        const bufferSize = this.ctx.sampleRate * 2.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 8.0;
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(3500 * this.pitchRatio, now + 2.0);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + 2.5);
    }

    // Kong Primal Bark / Growl
    synthesizeKongRoar(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(110 * this.pitchRatio, now);
        osc.frequency.linearRampToValueAtTime(70 * this.pitchRatio, now + 0.8);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.9);
    }

    // Kong Chest Beat
    synthesizeChestBeat(now) {
        for (let i = 0; i < 4; i++) {
            const timeOffset = now + (i * 0.25);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, timeOffset);
            osc.frequency.exponentialRampToValueAtTime(30, timeOffset + 0.18);

            gain.gain.setValueAtTime(0.9, timeOffset);
            gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.18);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(timeOffset);
            osc.stop(timeOffset + 0.18);
        }
    }

    // King Ghidorah Triple Siphon Screech
    synthesizeGhidorahRoar(now) {
        const freqs = [400, 520, 680];
        freqs.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq * this.pitchRatio, now);
            osc.frequency.linearRampToValueAtTime((freq + 200) * this.pitchRatio, now + 1.2);
            osc.frequency.linearRampToValueAtTime((freq - 100) * this.pitchRatio, now + 2.0);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.3, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 2.0);
        });
    }

    // Rodan Supersonic Screech
    synthesizeRodanRoar(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 * this.pitchRatio, now);
        osc.frequency.exponentialRampToValueAtTime(1800 * this.pitchRatio, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(300 * this.pitchRatio, now + 1.5);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.7, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.5);
    }

    // Mothra Song Call
    synthesizeMothraSong(now) {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
            const noteTime = now + (index * 0.3);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * this.pitchRatio, noteTime);

            gain.gain.setValueAtTime(0.01, noteTime);
            gain.gain.linearRampToValueAtTime(0.4, noteTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(noteTime);
            osc.stop(noteTime + 0.5);
        });
    }

    // Mechagodzilla Metallic Cyber Roar
    synthesizeMechaRoar(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150 * this.pitchRatio, now);
        osc.frequency.linearRampToValueAtTime(450 * this.pitchRatio, now + 0.5);
        osc.frequency.linearRampToValueAtTime(90 * this.pitchRatio, now + 1.8);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.8);
    }

    // Shimo Sub-Zero Cryoseism
    synthesizeShimoRoar(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(50 * this.pitchRatio, now);
        osc.frequency.linearRampToValueAtTime(120 * this.pitchRatio, now + 1.0);
        osc.frequency.exponentialRampToValueAtTime(30 * this.pitchRatio, now + 2.8);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.9, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.8);
    }

    synthesizeGenericSub(now) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 1.0);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.0);
    }

    // --- Background Ambient Audio Generator ---
    playBgm(type) {
        if (!this.isInitialized) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        this.stopBgm();
        this.activeBgmType = type;

        const now = this.ctx.currentTime;

        if (type === 'outpost') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(55, now);

            gain.gain.setValueAtTime(0.15, now);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();

            this.activeBgmOscillators.push(osc);
            this.logConsole('Background Ambience Activated: Outpost 54 Hum', 'system');
        } 
        else if (type === 'alert') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, now);

            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.8, now);
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(200, now);

            lfo.connect(osc.frequency);
            
            gain.gain.setValueAtTime(0.1, now);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start();
            lfo.start();

            this.activeBgmOscillators.push(osc, lfo);
            this.logConsole('ALERT: Containment Siren Initiated', 'alert');
        } 
        else if (type === 'sonar') {
            const interval = setInterval(() => {
                if (this.activeBgmType !== 'sonar') {
                    clearInterval(interval);
                    return;
                }
                const pingOsc = this.ctx.createOscillator();
                const pingGain = this.ctx.createGain();
                const pingTime = this.ctx.currentTime;

                pingOsc.type = 'sine';
                pingOsc.frequency.setValueAtTime(800, pingTime);

                pingGain.gain.setValueAtTime(0.2, pingTime);
                pingGain.gain.exponentialRampToValueAtTime(0.0001, pingTime + 1.2);

                pingOsc.connect(pingGain);
                pingGain.connect(this.masterGain);

                pingOsc.start(pingTime);
                pingOsc.stop(pingTime + 1.2);
            }, 2500);

            this.logConsole('Background Ambience Activated: Deep Ocean Sonar', 'system');
        }
    }

    stopBgm() {
        this.activeBgmOscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
        this.activeBgmOscillators = [];
        this.activeBgmType = null;
        this.logConsole('Background ambience muted.', 'system');
    }
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
    const audioApp = new MonarchAudioSystem();

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
        const titan = card.dataset.titan;
        const type = card.dataset.type;

        btn.addEventListener('click', () => {
            audioApp.playTitanSound(type, titan);
        });
    });

    // BGM Controls
    const bgmBtns = document.querySelectorAll('.bgm-btn[data-bgm]');
    bgmBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bgmBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            audioApp.playBgm(btn.dataset.bgm);
        });
    });

    document.getElementById('stop-bgm-btn').addEventListener('click', () => {
        bgmBtns.forEach(b => b.classList.remove('active'));
        audioApp.stopBgm();
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

    // Canvas Visualizer
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

            canvasCtx.fillStyle = `rgba(0, 213, 255, ${dataArray[i] / 255 + 0.2})`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 2;
        }
    }

    drawVisualizer();
});
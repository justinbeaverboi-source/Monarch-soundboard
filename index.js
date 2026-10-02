/**
 * MONARCH Godzilla Bio-Acoustic Audio System
 * Synthesizer & Real-Audio Web Engine
 */

class GodzillaAudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.analyser = null;
        this.isInitialized = false;
        this.pitchRatio = 1.0;

        // Pre-load audio file for Godzilla 2014
        this.godzilla2014Audio = new Audio('godzilla-2014-roar.mp3');
        this.godzilla2014Audio.crossOrigin = "anonymous";
        this.mediaElementConnected = false;
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.8;

            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 128;

            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);

            // Try connecting to Web Audio Visualizer API
            if (!this.mediaElementConnected) {
                try {
                    const track = this.ctx.createMediaElementSource(this.godzilla2014Audio);
                    track.connect(this.masterGain);
                    this.mediaElementConnected = true;
                } catch (corsErr) {
                    this.logConsole('Note: Running via direct HTML5 audio output.', 'system');
                }
            }

            this.isInitialized = true;
            this.logConsole('ORCA Godzilla Audio Engine online.', 'system');
        } catch (e) {
            this.logConsole('AudioContext init error: ' + e.message, 'system');
        }
    }

    setMasterVolume(val) {
        if (this.masterGain) {
            this.masterGain.gain.value = val;
        }
        if (this.godzilla2014Audio) {
            this.godzilla2014Audio.volume = val;
        }
    }

    setPitchRatio(val) {
        this.pitchRatio = val;
        if (this.godzilla2014Audio) {
            this.godzilla2014Audio.playbackRate = val;
        }
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
        // Initialize context on first interaction if needed
        if (!this.isInitialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const now = this.ctx ? this.ctx.currentTime : 0;

        switch (soundType) {
            // --- 1. GODZILLA ROARS ---
            case 'roar-2014':
                this.logConsole('Transmitting: Godzilla 2014 Audio Sample', 'godzilla');
                this.playGodzilla2014Audio();
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
                this.logConsole('Transmitting: 1954 Primal Friction Roar', 'godzilla');
                this.synthRoar1954(now);
                break;
            case 'roar-millennium':
                this.logConsole('Transmitting: Millennium Era Sharp Growl', 'godzilla');
                this.synthRoarMillennium(now);
                break;
            case 'roar-sp':
                this.logConsole('Transmitting: Ultima Dimensional Roar', 'godzilla');
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
                this.logConsole('CRITICAL: Thermonuclear Pulse Wave', 'atomic');
                this.synthThermoPulse(now);
                break;

            // --- 3. OFFICIAL SOUNDTRACK ---
            case 'theme-main':
                this.logConsole('Soundtrack: Akira Ifukube Main Theme', 'soundtrack');
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

            // --- 4. EDITS & REMIXES ---
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

    // Direct playback with error reporting
    playGodzilla2014Audio() {
        this.godzilla2014Audio.currentTime = 0;
        
        const playPromise = this.godzilla2014Audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                this.logConsole('ERROR: Cannot play "godzilla-2014-roar.mp3". Verify file path & name.', 'system');
                console.error('Audio play failure:', err);
            });
        }
    }

    // SYNTHESIZERS
    synthRoarKOTM(now) {
        if (!this.ctx) return;
        const osc1 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(75 * this.pitchRatio, now);
        osc1.frequency.exponentialRampToValueAtTime(220 * this.pitchRatio, now + 0.3);
        osc1.frequency.exponentialRampToValueAtTime(50 * this.pitchRatio, now + 2.8);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.9);

        osc1.connect(gain);
        gain.connect(this.masterGain);
        osc1.start(now);
        osc1.stop(now + 2.9);
    }

    synthRoarHeisei(now) {
        if (!this.ctx) return;
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

    synthRoar1954(now) {
        if (!this.ctx) return;
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

    synthRoarMillennium(now) {
        if (!this.ctx) return;
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

    synthRoarUltima(now) {
        if (!this.ctx) return;
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

    synthAtomicCharge(now) {
        if (!this.ctx) return;
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

    synthAtomicBlast(now) {
        if (!this.ctx) return;
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

    synthSpiralRay(now) {
        if (!this.ctx) return;
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

    synthThermoPulse(now) {
        if (!this.ctx) return;
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

    synthMainTheme(now) {
        if (!this.ctx) return;
        const notes = [110, 123.47, 130.81, 110, 123.47];
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

    synthMarchTheme(now) {
        if (!this.ctx) return;
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

    synthDeepSeaAmbience(now) {
        if (!this.ctx) return;
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

    synthPhonkEdit(now) {
        if (!this.ctx) return;
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

    synthSynthwaveEdit(now) {
        if (!this.ctx) return;
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

    synthTrailerBassDrop(now) {
        if (!this.ctx) return;
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

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    const audioApp = new GodzillaAudioSystem();

    // Power Button
    const powerBtn = document.getElementById('orca-power-btn');
    if (powerBtn) {
        powerBtn.addEventListener('click', () => {
            audioApp.init();
            powerBtn.innerText = 'ORCA ONLINE';
            powerBtn.style.background = '#00ff88';
            powerBtn.style.color = '#000000';
        });
    }

    // Soundboard Buttons
    const soundCards = document.querySelectorAll('.sound-card');
    soundCards.forEach(card => {
        const btn = card.querySelector('.trigger-btn');
        const type = card.dataset.type;
        if (btn) {
            btn.addEventListener('click', () => audioApp.playSound(type));
        }
    });

    // Navigation Menu Scroll & Highlight
    const navLinks = document.querySelectorAll('.telemetry-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                targetSection.classList.remove('section-highlight');
                void targetSection.offsetWidth;
                targetSection.classList.add('section-highlight');
            }
        });
    });

    // Controls
    const masterVolSlider = document.getElementById('master-vol');
    const volValueLabel = document.getElementById('vol-value');
    if (masterVolSlider) {
        masterVolSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (volValueLabel) volValueLabel.innerText = `${val}%`;
            audioApp.setMasterVolume(val / 100);
        });
    }

    const pitchSlider = document.getElementById('resonance-pitch');
    const pitchValueLabel = document.getElementById('pitch-value');
    if (pitchSlider) {
        pitchSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            const ratio = (val / 100).toFixed(1);
            if (pitchValueLabel) pitchValueLabel.innerText = `${ratio}x`;
            audioApp.setPitchRatio(parseFloat(ratio));
        });
    }

    // Canvas Visualizer
    const canvas = document.getElementById('waveform-canvas');
    if (canvas) {
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
                canvasCtx.strokeStyle = '#214b6e';
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
                canvasCtx.fillStyle = `rgba(0, 240, 255, ${dataArray[i] / 255 + 0.3})`;
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 2;
            }
        }

        drawVisualizer();
    }
});
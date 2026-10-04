document.addEventListener('DOMContentLoaded', () => {
  const masterVol = document.getElementById('master-vol');
  const resonancePitch = document.getElementById('resonance-pitch');
  const volValue = document.getElementById('vol-value');
  const pitchValue = document.getElementById('pitch-value');
  const consoleLog = document.getElementById('console-log');
  const powerBtn = document.getElementById('orca-power-btn');
  const canvas = document.getElementById('waveform-canvas');
  const ctx = canvas.getContext('2d');
  const links = document.querySelectorAll('.telemetry-link');
  const statusText = document.querySelector('.system-status');

  let audioCtx = null;
  let masterGain = null;
  let isOnline = false;

  const log = (message, type = 'system') => {
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    consoleLog.prepend(entry);

    while (consoleLog.children.length > 8) {
      consoleLog.removeChild(consoleLog.lastChild);
    }
  };

  const ensureAudio = () => {
    if (audioCtx) return;

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
      log('[ERROR] Web Audio is not supported in this browser.', 'system');
      return;
    }

    audioCtx = new AudioCtor();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = Number(masterVol.value) / 100 * 0.35;
    masterGain.connect(audioCtx.destination);
  };

  const updateReadouts = () => {
    const volume = Number(masterVol.value);
    const pitch = Number(resonancePitch.value) / 100;
    volValue.textContent = `${volume}%`;
    pitchValue.textContent = `${pitch.toFixed(1)}x`;

    if (masterGain && audioCtx) {
      masterGain.gain.value = volume / 100 * 0.35;
    }
  };

  const setPowerState = (online) => {
    isOnline = online;
    powerBtn.textContent = online ? 'ORCA ONLINE' : 'INITIALIZE ORCA';
    powerBtn.style.background = online ? 'var(--monarch-gold)' : '#002b3d';
    powerBtn.style.color = online ? '#000' : 'var(--monarch-cyan)';

    const signal = statusText.querySelector('.status-dot');
    if (signal) {
      signal.style.backgroundColor = online ? '#00ff88' : '#ff3333';
    }

    const label = statusText.lastChild;
    if (label) {
      label.textContent = online ? ' GOJIRA ACTIVE' : ' SYSTEM IDLE';
    }
  };

  const flashSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.classList.remove('section-highlight');
    void section.offsetWidth;
    section.classList.add('section-highlight');
    setTimeout(() => section.classList.remove('section-highlight'), 1400);
  };

  const triggerNoiseBurst = (frequency, endFrequency, duration, gainLevel, filterFreq, noiseLevel, label, type) => {
    if (!audioCtx || !masterGain) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const noise = audioCtx.createBufferSource();
    const filter = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();
    const noiseGain = audioCtx.createGain();

    osc.type = type || 'sawtooth';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.Q.value = 1.5;

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(gainLevel, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * noiseLevel;
    }

    noise.buffer = noiseBuffer;
    noiseGain.gain.setValueAtTime(noiseLevel * 0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    noise.connect(noiseGain);
    noiseGain.connect(masterGain);

    osc.start(now);
    noise.start(now);
    osc.stop(now + duration + 0.08);
    noise.stop(now + duration + 0.08);

    log(`${label} transmission confirmed.`, type === 'atomic' ? 'atomic' : 'godzilla');
  };

  const triggerChord = (label, notes, duration, type = 'triangle', gainLevel = 0.08) => {
    if (!audioCtx || !masterGain) return;

    const now = audioCtx.currentTime;
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq * Number(resonancePitch.value) / 100, now + index * 0.02);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800 + index * 200, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(gainLevel, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(masterGain);
      osc.start(now + index * 0.02);
      osc.stop(now + duration + 0.2);
    });

    log(`${label} motif initiated.`, 'soundtrack');
  };

  const triggerPhonkBurst = (label, lowFreq, accentFreq) => {
    if (!audioCtx || !masterGain) return;

    const now = audioCtx.currentTime;
    for (let i = 0; i < 2; i += 1) {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = i === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(lowFreq + i * 20, now);
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.16, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
      osc.connect(gainNode).connect(masterGain);
      osc.start(now + i * 0.02);
      osc.stop(now + 0.8);
    }

    const accent = audioCtx.createOscillator();
    const accentGain = audioCtx.createGain();
    accent.type = 'triangle';
    accent.frequency.setValueAtTime(accentFreq, now);
    accentGain.gain.setValueAtTime(0.0001, now);
    accentGain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
    accentGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    accent.connect(accentGain).connect(masterGain);
    accent.start(now);
    accent.stop(now + 0.5);

    log(`${label} edit engaged.`, 'edit');
  };

  const roarAudioFiles = {
    'roar-2014': 'Godzilla 2014_.mov',
    'roar-evolved-1': 'Evolved roar #1.mov',
    'roar-evolved-2': 'Evolved roar #2.mov',
    'roar-2019-1': 'Godzilla 2019 #1.mov',
    'roar-dominic': 'Godzilla Dominic.mov',
    'roar-1954-1': 'Godzilla 1954 #1.mov',
    'roar-minus-one': 'Godzilla Minus One.mov',
    'roar-ultimate': 'Ultimate roar.mp4',
    'roar-victory': 'Victory roar.mov',
    'roar-zilla-1': 'Zilla Roar 1.mov',
    'roar-zilla-2': 'Zilla Roar 2.mov',
    'roar-shin': 'Shin Godzilla.mov',
    'roar-heisei': 'Godzila Heisi.mov',
    'roar-1984': 'Godzilla 1984.mov'
  };
  const roarAudioPlayers = new Map();

  const playRoarAudio = (type, onPlaybackFailure) => {
    const filename = roarAudioFiles[type];
    let player = roarAudioPlayers.get(type);

    if (!player) {
      const audio = new Audio();
      audio.src = `Godzilla%20Roars%20Audio/${encodeURIComponent(filename)}`;
      audio.preload = 'auto';
      const source = audioCtx.createMediaElementSource(audio);
      source.connect(masterGain);
      player = { audio, source };
      roarAudioPlayers.set(type, player);
    }

    player.audio.currentTime = 0;
    player.audio.playbackRate = Number(resonancePitch.value) / 100;
    player.audio.play()
      .then(() => log(`${filename} transmission confirmed.`, 'godzilla'))
      .catch((error) => {
        log(`[ERROR] Unable to play ${filename}: ${error.message}`, 'system');
        if (onPlaybackFailure) onPlaybackFailure();
      });
  };

  const playByType = (type) => {
    ensureAudio();
    if (!audioCtx || !masterGain) return;

    const basePitch = Number(resonancePitch.value) / 100;
    const transmissionMap = {
      'roar-2014': () => triggerNoiseBurst(45 * basePitch, 18, 1.4, 0.18, 900, 0.22, 'Godzilla 2014 roar', 'sawtooth'),
      'roar-evolved-1': () => triggerNoiseBurst(62 * basePitch, 21, 1.5, 0.2, 1200, 0.18, 'Evolved roar 1', 'sawtooth'),
      'roar-evolved-2': () => triggerNoiseBurst(70 * basePitch, 25, 1.6, 0.21, 1400, 0.2, 'Evolved roar 2', 'square'),
      'roar-2019-1': () => triggerNoiseBurst(58 * basePitch, 24, 1.4, 0.19, 1000, 0.18, '2019 roar #1', 'triangle'),
      'roar-dominic': () => triggerNoiseBurst(52 * basePitch, 19, 1.7, 0.17, 850, 0.26, 'Dominic roar', 'sawtooth'),
      'roar-1954-1': () => triggerNoiseBurst(39 * basePitch, 14, 1.8, 0.16, 700, 0.2, '1954 roar #1', 'triangle'),
      'roar-1954-2': () => triggerNoiseBurst(43 * basePitch, 16, 1.7, 0.17, 750, 0.18, '1954 roar #2', 'sawtooth'),
      'roar-minus-one': () => triggerNoiseBurst(68 * basePitch, 18, 1.4, 0.22, 1700, 0.26, 'Minus One roar', 'sawtooth'),
      'roar-shin': () => triggerNoiseBurst(74 * basePitch, 28, 1.5, 0.2, 1800, 0.22, 'Shin roar', 'square'),
      'roar-ultimate': () => triggerNoiseBurst(81 * basePitch, 30, 1.9, 0.24, 2100, 0.29, 'Ultimate roar', 'sawtooth'),
      'roar-victory': () => triggerNoiseBurst(57 * basePitch, 23, 1.2, 0.18, 1200, 0.15, 'Victory roar', 'triangle'),
      'roar-heisei': () => triggerNoiseBurst(49 * basePitch, 20, 1.5, 0.18, 980, 0.18, 'Heisei roar', 'sawtooth'),
      'roar-zilla-1': () => triggerNoiseBurst(88 * basePitch, 32, 1.2, 0.14, 2100, 0.2, 'Zilla roar 1', 'square'),
      'roar-zilla-2': () => triggerNoiseBurst(92 * basePitch, 36, 1.1, 0.15, 2200, 0.18, 'Zilla roar 2', 'triangle'),
      'roar-1984': () => triggerNoiseBurst(46 * basePitch, 17, 1.6, 0.17, 760, 0.2, '1984 roar', 'sawtooth'),
      'atomic-charge': () => triggerNoiseBurst(120 * basePitch, 42, 1.2, 0.17, 2200, 0.16, 'Atomic charge', 'triangle'),
      'atomic-blast': () => triggerNoiseBurst(160 * basePitch, 60, 1.0, 0.22, 2600, 0.12, 'Atomic breath', 'sawtooth'),
      'spiral-ray': () => triggerNoiseBurst(180 * basePitch, 72, 1.4, 0.25, 3000, 0.14, 'Spiral heat ray', 'square'),
      'thermo-pulse': () => triggerNoiseBurst(140 * basePitch, 55, 0.9, 0.19, 2500, 0.18, 'Thermonuclear pulse', 'sawtooth'),
      'theme-main': () => triggerChord('Main theme', [110, 146.83, 164.81], 2.2, 'triangle', 0.06),
      'theme-march': () => triggerChord('Godzilla march', [98, 123.47, 146.83], 2.0, 'sine', 0.05),
      'theme-ambience': () => triggerChord('Deep sea ambience', [65.41, 82.41, 98], 3.0, 'sine', 0.04),
      'edit-phonk': () => triggerPhonkBurst('Godzilla phonk', 55, 90),
      'edit-synthwave': () => triggerPhonkBurst('Neon Gojira', 92, 160),
      'edit-bassdrop': () => triggerPhonkBurst('Sub bass drop', 38, 75)
    };

    const action = transmissionMap[type];
    if (!action) {
      log(`[ERROR] Unknown signal type: ${type}`, 'system');
      return;
    }

    const card = document.querySelector(`[data-type="${type}"]`);
    if (card) {
      const section = card.closest('.section-card');
      if (section) {
        flashSection(section.id);
      }
    }

    if (roarAudioFiles[type]) {
      playRoarAudio(type, type === 'roar-ultimate' ? action : undefined);
      return;
    }

    action();
  };

  powerBtn.addEventListener('click', () => {
    ensureAudio();
    setPowerState(!isOnline);
    log(isOnline ? '[ORCA ONLINE] Bio-resonance matrix armed.' : '[ORCA STANDBY] Signal pathways cooling.', isOnline ? 'godzilla' : 'system');
  });

  masterVol.addEventListener('input', updateReadouts);
  resonancePitch.addEventListener('input', updateReadouts);

  links.forEach((link) => {
    link.addEventListener('click', () => {
      links.forEach((entry) => entry.classList.remove('active'));
      link.classList.add('active');
    });
  });

  document.querySelectorAll('.trigger-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const card = event.currentTarget.closest('.sound-card');
      const type = card ? card.getAttribute('data-type') : null;
      if (!type) return;

      if (!isOnline) {
        setPowerState(true);
        log('[ORCA ONLINE] Warm-up cycle complete. Signal path prepared.', 'godzilla');
      }

      playByType(type);
    });
  });

  const drawVisualizer = () => {
    const width = canvas.width = canvas.clientWidth * window.devicePixelRatio;
    const height = canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ctx.beginPath();
    ctx.moveTo(0, canvas.clientHeight / 2);

    for (let x = 0; x <= canvas.clientWidth; x += 4) {
      const y = canvas.clientHeight / 2 + Math.sin((x + performance.now() * 0.03) * 0.08) * 18 + Math.sin((x + performance.now() * 0.05) * 0.18) * 10;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    requestAnimationFrame(drawVisualizer);
  };

  updateReadouts();
  drawVisualizer();
});

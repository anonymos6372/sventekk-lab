/* =========================================================================
   1. PRESETS & AUDIO-STATUS
   ========================================================================= */
const KICK_PRESETS = {
  soft:       { label: 'SOFT KICK',   start: 165, end: 46, punch: 4,  tail: 0.9, crunch: 0.00, drive: 2.0,  dauer: 0.45 },
  hard:       { label: 'HARD KICK',   start: 240, end: 45, punch: 6,  tail: 1.0, crunch: 0.15, drive: 5.5,  dauer: 0.50 },
  industrial: { label: 'INDUSTRIAL',  start: 330, end: 42, punch: 9,  tail: 1.8, crunch: 0.65, drive: 12.0, dauer: 0.65 },
  gabber:     { label: 'GABBER',      start: 410, end: 48, punch: 11, tail: 1.3, crunch: 0.35, drive: 18.0, dauer: 0.50 },
  schranz:    { label: 'SCHRANZ',     start: 290, end: 52, punch: 8,  tail: 1.5, crunch: 0.80, drive: 14.0, dauer: 0.40 },
  hardtechno: { label: 'HARD TECHNO', start: 210, end: 40, punch: 5,  tail: 2.1, crunch: 0.25, drive: 6.5,  dauer: 0.60 }
};

const UPTEMPO_PRESETS = {
  piep:   { label: 'PIEP KICK',   start: 1120, end: 64, zaag: 0.25, snap: 18, drive: 24, dauer: 0.24 },
  zaag:   { label: 'ZAAG KICK',   start: 420,  end: 50, zaag: 0.90, snap: 38, drive: 28, dauer: 0.32 },
  terror: { label: 'TERROR 230+', start: 1280, end: 72, zaag: 0.95, snap: 14, drive: 38, dauer: 0.22 }
};

const BASS_PRESETS = {
  sub:     { label: 'SUB BASS',    freq: 55, sub: 1.15, cutoff: 240,  res: 2.0, drive: 3.5,  dauer: 0.48 },
  offbeat: { label: 'OFFBEAT SAW', freq: 65, sub: 0.85, cutoff: 780,  res: 4.0, drive: 8.5,  dauer: 0.28 },
  reese:   { label: 'DARK REESE',  freq: 48, sub: 1.00, cutoff: 1150, res: 2.5, drive: 12.0, dauer: 0.75 }
};

const SNARE_PRESETS = {
  snare: { label: 'TEKK SNARE',     tone: 210, len: 0.24, filter: 1100, drive: 3.5 },
  clap:  { label: 'RAVE CLAP',      tone: 280, len: 0.32, filter: 1450, drive: 5.0 },
  rim:   { label: 'INDUSTRIAL RIM', tone: 360, len: 0.14, filter: 1900, drive: 9.5 }
};

const MELODY_SCALES = {
  phrygian: [164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63],
  aminor:   [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00],
  fminor:   [174.61, 196.00, 207.65, 233.08, 261.63, 277.18, 311.13, 349.23],
  dminor:   [146.83, 164.81, 174.61, 196.00, 220.00, 233.08, 261.63, 293.66],
  harmonic: [196.00, 220.00, 233.08, 261.63, 293.66, 311.13, 369.99, 392.00],
  cminor:   [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63],
  major:    [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
};

const MELODY_PATTERNS = {
  offbeat:   [0, 3, 2, 4, 0, 5, 4, 3],
  staircase: [0, 1, 2, 3, 4, 5, 6, 7],
  frenzy:    [0, 7, 1, 6, 0, 5, 2, 7],
  acid:      [0, 0, 3, 0, 4, 1, 5, 0],
  anthem:    [4, 4, 5, 3, 2, 2, 3, 0],
  octave:    [0, 7, 0, 7, 3, 7, 4, 7]
};

// 6 Spuren: 0=Kick, 1=Uptempo, 2=Bass, 3=Snare, 4=Hi-Hat, 5=Melody
const trackVoiceModes = ['mono', 'mono', 'mono', 'mono', 'poly', 'mono'];
const trackVolumes = [1.0, 1.0, 0.9, 0.95, 0.85, 0.9];
const activeNodesByTrack = [[], [], [], [], [], []];

const sequenceGrid = [
  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0], // 0: 01 KICK
  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // 1: 02 UPTEMPO
  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0], // 2: 03 BASS
  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1], // 3: 04 SNARE
  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,1,1,1], // 4: 05 HI-HAT
  [1,0,1,1, 0,1,0,1, 1,0,1,1, 0,1,1,0]  // 5: 06 MELODY
];

const presetSamples = [
  { title: 'SVENTEKK_Hard_Kick_180BPM.wav', type: 'Hard Kick', generator: 'hardtekk' },
  { title: 'SVENTEKK_Uptempo_Zaag_210.wav', type: 'Zaag Kick', generator: 'uptempo_zaag' },
  { title: 'SVENTEKK_Uptempo_Piep_220.wav', type: 'Piep Kick', generator: 'uptempo_piep' },
  { title: 'SVENTEKK_Sub_Bass_55Hz.wav', type: 'Sub Bass', generator: 'bass' },
  { title: 'SVENTEKK_Rave_Phrase_4Bars.wav', type: 'Melodie', generator: 'melody' }
];

const DOWNLOAD_COUNT_KEY = 'sventekk_wav_download_v1';

let audioCtx = null;
let masterLimiter = null;
let sharedEchoBus = null;
let melodyEchoBus = null;
let isPlaying = false;
let currentStep = 0;
let seqMelodyStepIndex = 0;
let stepTimer = null;
let melodyLoopTimer = null;
let melodySessionId = 0;
let activeKickMode = 'hard';
let activeUptempoMode = 'zaag';
let activeBassMode = 'sub';
let activeSnareMode = 'snare';
let currentMelodyIndices = [...MELODY_PATTERNS.offbeat];

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterLimiter = audioCtx.createDynamicsCompressor();
    masterLimiter.threshold.setValueAtTime(-3.0, audioCtx.currentTime);
    masterLimiter.knee.setValueAtTime(2.0, audioCtx.currentTime);
    masterLimiter.ratio.setValueAtTime(16.0, audioCtx.currentTime);
    masterLimiter.attack.setValueAtTime(0.002, audioCtx.currentTime);
    masterLimiter.release.setValueAtTime(0.08, audioCtx.currentTime);
    masterLimiter.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function getMasterOut() {
  getAudioCtx();
  return masterLimiter;
}

async function ensureAudioReady() {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

function getTrackOut(ctx, baseDest, trackIdx) {
  if (trackIdx === null || trackIdx === undefined) return baseDest;
  const vol = trackVolumes[trackIdx] !== undefined ? trackVolumes[trackIdx] : 1.0;
  const g = ctx.createGain();
  g.gain.setValueAtTime(Math.max(0, Math.min(1.5, vol)), ctx.currentTime);
  g.connect(baseDest);
  return g;
}

function createEchoChain(ctx, dest, stepSec) {
  const input = ctx.createGain();
  const delay = ctx.createDelay(1.0);
  const feedback = ctx.createGain();
  const wet = ctx.createGain();

  delay.delayTime.setValueAtTime(Math.min(0.75, stepSec * 0.75), ctx.currentTime);
  feedback.gain.setValueAtTime(0.22, ctx.currentTime);
  wet.gain.setValueAtTime(0.16, ctx.currentTime);

  input.connect(dest);
  input.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(dest);

  return { ctx, input, delay };
}

function getSharedEchoBus(ctx, dest, stepSec) {
  if (!sharedEchoBus || sharedEchoBus.ctx !== ctx || sharedEchoBus.dest !== dest) {
    const chain = createEchoChain(ctx, dest, stepSec);
    sharedEchoBus = { ...chain, dest };
  } else {
    sharedEchoBus.delay.delayTime.setValueAtTime(Math.min(0.75, stepSec * 0.75), ctx.currentTime);
  }
  return sharedEchoBus.input;
}

function getMelodyTrackEchoBus(ctx, baseDest, stepSec) {
  if (!melodyEchoBus || melodyEchoBus.ctx !== ctx || melodyEchoBus.baseDest !== baseDest) {
    const trackGain = ctx.createGain();
    trackGain.connect(baseDest);
    const chain = createEchoChain(ctx, trackGain, stepSec);
    melodyEchoBus = { ...chain, trackGain, baseDest };
  } else {
    melodyEchoBus.delay.delayTime.setValueAtTime(Math.min(0.75, stepSec * 0.75), ctx.currentTime);
  }
  const vol = trackVolumes[5] !== undefined ? trackVolumes[5] : 1.0;
  melodyEchoBus.trackGain.gain.setValueAtTime(Math.max(0, Math.min(1.5, vol)), ctx.currentTime);
  return melodyEchoBus.input;
}

function registerVoice(trackIdx, stopFn) {
  if (trackIdx === null || trackIdx === undefined) return;
  if (trackVoiceModes[trackIdx] === 'mono') {
    while (activeNodesByTrack[trackIdx].length > 0) {
      const oldStop = activeNodesByTrack[trackIdx].pop();
      try { oldStop(); } catch (e) {}
    }
  }
  activeNodesByTrack[trackIdx].push(stopFn);
}

function setStatus(text) {
  const el = document.getElementById('studio-status-text');
  if (el) el.innerText = text;
}

/* =========================================================================
   2. REGLER + ZAHLENFELDER SYNCHRONISIEREN
   ========================================================================= */
function bindSliderAndNumber(rangeId, numId, onUpdate = null) {
  const rangeEl = document.getElementById(rangeId);
  const numEl = document.getElementById(numId);
  if (!rangeEl || !numEl) return;

  rangeEl.addEventListener('input', () => {
    numEl.value = rangeEl.value;
    if (onUpdate) onUpdate(parseFloat(rangeEl.value));
  });

  numEl.addEventListener('input', () => {
    let val = parseFloat(numEl.value);
    if (Number.isNaN(val)) return;
    const min = parseFloat(numEl.min);
    const max = parseFloat(numEl.max);
    if (!Number.isNaN(min) && val < min) val = min;
    if (!Number.isNaN(max) && val > max) val = max;
    rangeEl.value = val;
    if (onUpdate) onUpdate(val);
  });

  numEl.addEventListener('change', () => {
    let val = parseFloat(numEl.value);
    const min = parseFloat(numEl.min);
    const max = parseFloat(numEl.max);
    if (Number.isNaN(val)) val = parseFloat(rangeEl.value);
    if (!Number.isNaN(min) && val < min) val = min;
    if (!Number.isNaN(max) && val > max) val = max;
    numEl.value = val;
    rangeEl.value = val;
    if (onUpdate) onUpdate(val);
  });
}

function initAllControlBindings() {
  bindSliderAndNumber('start_hz', 'num-start');
  bindSliderAndNumber('end_hz', 'num-end');
  bindSliderAndNumber('kick_punch', 'num-punch');
  bindSliderAndNumber('kick_tail', 'num-tail');
  bindSliderAndNumber('kick_crunch', 'num-crunch');
  bindSliderAndNumber('drive', 'num-drive');
  bindSliderAndNumber('dauer', 'num-dauer');

  bindSliderAndNumber('up_start', 'num-up-start');
  bindSliderAndNumber('up_end', 'num-up-end');
  bindSliderAndNumber('up_zaag', 'num-up-zaag');
  bindSliderAndNumber('up_snap', 'num-up-snap');
  bindSliderAndNumber('up_drive', 'num-up-drive');
  bindSliderAndNumber('up_dauer', 'num-up-dauer');

  bindSliderAndNumber('bass_freq', 'num-bass-freq');
  bindSliderAndNumber('bass_sub', 'num-bass-sub');
  bindSliderAndNumber('bass_cutoff', 'num-bass-cutoff');
  bindSliderAndNumber('bass_res', 'num-bass-res');
  bindSliderAndNumber('bass_drive', 'num-bass-drive');
  bindSliderAndNumber('bass_dauer', 'num-bass-dauer');

  bindSliderAndNumber('snare_tone', 'num-snare-tone');
  bindSliderAndNumber('snare_len', 'num-snare-len');
  bindSliderAndNumber('snare_filter', 'num-snare-filter');
  bindSliderAndNumber('snare_drive', 'num-snare-drive');
  bindSliderAndNumber('hat_hits', 'num-hat-hits');

  bindSliderAndNumber('melody_gate', 'num-mel-gate');
  bindSliderAndNumber('mel_attack', 'num-mel-attack');
  bindSliderAndNumber('mel_release', 'num-mel-rel');
  bindSliderAndNumber('mel_cutoff', 'num-mel-cutoff');
  bindSliderAndNumber('mel_detune', 'num-mel-detune');

  bindSliderAndNumber('bpm', 'num-bpm', (val) => {
    document.getElementById('header-bpm').innerText = val;
  });
}

function setControlValue(rangeId, numId, value) {
  const r = document.getElementById(rangeId);
  const n = document.getElementById(numId);
  if (r) r.value = value;
  if (n) n.value = value;
}

function setKickMode(mode) {
  const p = KICK_PRESETS[mode];
  if (!p) return;
  activeKickMode = mode;

  document.querySelectorAll('.style-btn:not(.up-style):not(.bass-style):not(.snare-style)').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  document.getElementById('kick-mode-badge').innerText = p.label;

  setControlValue('start_hz', 'num-start', p.start);
  setControlValue('end_hz', 'num-end', p.end);
  setControlValue('kick_punch', 'num-punch', p.punch);
  setControlValue('kick_tail', 'num-tail', p.tail);
  setControlValue('kick_crunch', 'num-crunch', p.crunch);
  setControlValue('drive', 'num-drive', p.drive);
  setControlValue('dauer', 'num-dauer', p.dauer);
  setStatus(`KICK MODUS: ${p.label}`);
}

function setUptempoMode(mode) {
  const p = UPTEMPO_PRESETS[mode];
  if (!p) return;
  activeUptempoMode = mode;

  document.querySelectorAll('.up-style').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.upmode === mode);
  });
  document.getElementById('uptempo-mode-badge').innerText = p.label;

  setControlValue('up_start', 'num-up-start', p.start);
  setControlValue('up_end', 'num-up-end', p.end);
  setControlValue('up_zaag', 'num-up-zaag', p.zaag);
  setControlValue('up_snap', 'num-up-snap', p.snap);
  setControlValue('up_drive', 'num-up-drive', p.drive);
  setControlValue('up_dauer', 'num-up-dauer', p.dauer);
  setStatus(`UPTEMPO MODUS: ${p.label}`);
}

function setBassMode(mode) {
  const p = BASS_PRESETS[mode];
  if (!p) return;
  activeBassMode = mode;

  document.querySelectorAll('.bass-style').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.bassmode === mode);
  });
  const badge = document.getElementById('bass-mode-badge');
  if (badge) badge.innerText = p.label;

  setControlValue('bass_freq', 'num-bass-freq', p.freq);
  setControlValue('bass_sub', 'num-bass-sub', p.sub);
  setControlValue('bass_cutoff', 'num-bass-cutoff', p.cutoff);
  setControlValue('bass_res', 'num-bass-res', p.res);
  setControlValue('bass_drive', 'num-bass-drive', p.drive);
  setControlValue('bass_dauer', 'num-bass-dauer', p.dauer);
  setStatus(`BASS MODUS: ${p.label}`);
}

function setSnareMode(mode) {
  const p = SNARE_PRESETS[mode];
  if (!p) return;
  activeSnareMode = mode;

  document.querySelectorAll('.snare-style').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.snaremode === mode);
  });
  const badge = document.getElementById('snare-mode-badge');
  if (badge) badge.innerText = p.label;

  setControlValue('snare_tone', 'num-snare-tone', p.tone);
  setControlValue('snare_len', 'num-snare-len', p.len);
  setControlValue('snare_filter', 'num-snare-filter', p.filter);
  setControlValue('snare_drive', 'num-snare-drive', p.drive);
  setStatus(`SNARE MODUS: ${p.label}`);
}

/* =========================================================================
   3. SOUND-SYNTHESE (KICKS, UPTEMPO, BASS, DRUMS, MELODIE)
   ========================================================================= */
function buildMelodyNotes() {
  const patternType = document.getElementById('melody_pattern')?.value || 'offbeat';
  if (patternType === 'random') {
    const next = [];
    for (let i = 0; i < 8; i++) next.push(Math.floor(Math.random() * 8));
    currentMelodyIndices = next;
  } else if (MELODY_PATTERNS[patternType]) {
    currentMelodyIndices = [...MELODY_PATTERNS[patternType]];
  }
  return getActiveMelodyFrequencies();
}

function createRaveEchoBus(ctx, dest, stepSec) {
  return getSharedEchoBus(ctx, dest, stepSec);
}

function getActiveMelodyFrequencies() {
  const scaleKey = document.getElementById('melody_scale')?.value || 'phrygian';
  const bars = parseInt(document.getElementById('melody_bars')?.value || '4', 10);
  const scale = MELODY_SCALES[scaleKey] || MELODY_SCALES.phrygian;

  const phrase = [];
  for (let b = 0; b < bars; b++) {
    currentMelodyIndices.forEach((idx, pos) => {
      let freq = scale[idx % scale.length];
      if (b === bars - 1 && pos >= 6) freq *= 2;
      phrase.push(freq);
    });
  }
  return phrase;
}

function getHardtekkParams() {
  return {
    mode: activeKickMode,
    startHz: parseFloat(document.getElementById('start_hz').value),
    endHz: parseFloat(document.getElementById('end_hz').value),
    punch: parseFloat(document.getElementById('kick_punch').value),
    tail: parseFloat(document.getElementById('kick_tail').value),
    crunch: parseFloat(document.getElementById('kick_crunch').value),
    drive: parseFloat(document.getElementById('drive').value),
    duration: parseFloat(document.getElementById('dauer').value)
  };
}

function getUptempoParams() {
  return {
    mode: activeUptempoMode,
    startHz: parseFloat(document.getElementById('up_start').value),
    endHz: parseFloat(document.getElementById('up_end').value),
    zaag: parseFloat(document.getElementById('up_zaag').value),
    snapMs: parseFloat(document.getElementById('up_snap').value),
    drive: parseFloat(document.getElementById('up_drive').value),
    duration: parseFloat(document.getElementById('up_dauer').value)
  };
}

function getBassParams() {
  return {
    mode: activeBassMode,
    freq: parseFloat(document.getElementById('bass_freq').value),
    sub: parseFloat(document.getElementById('bass_sub').value),
    cutoff: parseFloat(document.getElementById('bass_cutoff').value),
    res: parseFloat(document.getElementById('bass_res').value),
    drive: parseFloat(document.getElementById('bass_drive').value),
    duration: parseFloat(document.getElementById('bass_dauer').value)
  };
}

function getSnareParams() {
  return {
    mode: activeSnareMode,
    toneHz: parseFloat(document.getElementById('snare_tone').value),
    duration: parseFloat(document.getElementById('snare_len').value),
    filterHz: parseFloat(document.getElementById('snare_filter')?.value || 1100),
    drive: parseFloat(document.getElementById('snare_drive')?.value || 3.5)
  };
}

function makeDistortionCurve(amount, mode = 'soft') {
  const k = typeof amount === 'number' ? amount * 18 : 50;
  const n = 44100;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; ++i) {
    const x = (i * 2) / n - 1;
    if (mode === 'piep') {
      const folded = Math.sin(x * Math.PI * 2.4) * 0.75 + Math.tanh(x * (k / 7)) * 0.85;
      curve[i] = Math.max(-0.96, Math.min(0.96, folded));
    } else if (mode === 'zaag') {
      const sawTooth = (x * (1 + k / 6)) % 2;
      const rawZaag = sawTooth > 1 ? sawTooth - 2 : sawTooth;
      const folded = rawZaag * 0.8 + Math.sin(x * Math.PI * 3.0) * 0.45;
      curve[i] = Math.max(-0.98, Math.min(0.98, folded));
    } else if (mode === 'terror') {
      const hardClip = Math.max(-0.72, Math.min(0.72, x * (1.4 + k / 5)));
      curve[i] = Math.sin(hardClip * 4.2) * 0.98;
    } else if (mode === 'gabber' || mode === 'square') {
      curve[i] = Math.max(-0.92, Math.min(0.92, Math.tanh(x * (k / 14)) * 1.25));
    } else if (mode === 'industrial' || mode === 'schranz') {
      curve[i] = Math.sin(Math.tanh(x * (k / 20)) * 2.2);
    } else {
      curve[i] = Math.tanh(x * (k / 25));
    }
  }
  return curve;
}

function triggerHiHat(ctx, dest, startTime, open = false, trackIdx = null) {
  const dur = open ? 0.16 : 0.045;
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(6500, startTime);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.45, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

  src.connect(filter); filter.connect(gain); gain.connect(dest);
  src.start(startTime); src.stop(startTime + dur);

  registerVoice(trackIdx, () => {
    try { gain.gain.setValueAtTime(0.0001, ctx.currentTime); src.stop(); } catch (e) {}
  });
}

function triggerKick(ctx, dest, params, startTime, trackIdx = null) {
  const { startHz, endHz, drive, duration, mode = 'hard', punch = 6, tail = 1.0, crunch = 0.15 } = params;

  const osc = ctx.createOscillator();
  const subOsc = ctx.createOscillator();
  const gain = ctx.createGain();
  const shaper = ctx.createWaveShaper();
  const postFilter = ctx.createBiquadFilter();

  osc.type = (mode === 'gabber') ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(startHz, startTime);
  const dropTime = Math.max(0.025, 0.16 / (punch / 4));
  osc.frequency.exponentialRampToValueAtTime(Math.max(25, endHz), startTime + dropTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(22, endHz * 0.85), startTime + duration);

  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(endHz * 1.5, startTime);
  subOsc.frequency.exponentialRampToValueAtTime(endHz, startTime + 0.08);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(Math.min(0.8, tail * 0.45), startTime);
  subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  let noiseSrc = null;
  if (crunch > 0.02) {
    const bufSize = Math.floor(ctx.sampleRate * duration);
    const nBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const nData = nBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) nData[i] = Math.random() * 2 - 1;

    noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = nBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(mode === 'schranz' ? 1400 : 950, startTime);
    bp.Q.setValueAtTime(2.5, startTime);

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(crunch * 0.45, startTime);
    nGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.85);

    noiseSrc.connect(bp); bp.connect(nGain); nGain.connect(shaper);
  }

  shaper.curve = makeDistortionCurve(drive, mode);
  shaper.oversample = '4x';

  postFilter.type = 'lowpass';
  postFilter.frequency.setValueAtTime(mode === 'soft' ? 1800 : 7500, startTime);

  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(0.95, startTime + 0.005);
  gain.gain.setValueAtTime(0.88, startTime + Math.min(duration * 0.55, 0.28));
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(shaper);
  subOsc.connect(subGain);
  subGain.connect(shaper);
  shaper.connect(postFilter);
  postFilter.connect(gain);
  gain.connect(dest);

  osc.start(startTime); subOsc.start(startTime);
  if (noiseSrc) noiseSrc.start(startTime);
  osc.stop(startTime + duration + 0.02); subOsc.stop(startTime + duration + 0.02);
  if (noiseSrc) noiseSrc.stop(startTime + duration + 0.02);

  registerVoice(trackIdx, () => {
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      osc.stop(); subOsc.stop();
      if (noiseSrc) noiseSrc.stop();
    } catch (e) {}
  });
}

function triggerBass(ctx, dest, params, startTime, trackIdx = null) {
  const {
    mode = activeBassMode,
    freq = 55,
    sub = 1.15,
    cutoff = 240,
    res = 2.0,
    drive = 3.5,
    duration = 0.48
  } = params;

  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(freq, startTime);

  const saw1 = ctx.createOscillator();
  const saw2 = ctx.createOscillator();
  saw1.type = 'sawtooth';
  saw2.type = mode === 'reese' ? 'sawtooth' : 'triangle';
  saw1.frequency.setValueAtTime(freq, startTime);
  saw2.frequency.setValueAtTime(freq, startTime);
  if (mode === 'reese') {
    saw1.detune.setValueAtTime(-18, startTime);
    saw2.detune.setValueAtTime(18, startTime);
  }

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(Math.min(1.15, sub * 0.72), startTime);

  const topGain = ctx.createGain();
  topGain.gain.setValueAtTime(mode === 'sub' ? 0.25 : 0.62, startTime);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoff, startTime);
  filter.frequency.exponentialRampToValueAtTime(Math.max(65, cutoff * 0.45), startTime + duration);
  filter.Q.setValueAtTime(res, startTime);

  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(drive, mode === 'reese' ? 'gabber' : 'soft');
  shaper.oversample = '2x';

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, startTime);
  masterGain.gain.linearRampToValueAtTime(0.92, startTime + (mode === 'offbeat' ? 0.018 : 0.006));
  masterGain.gain.setValueAtTime(0.84, startTime + Math.max(0.03, duration * 0.7));
  masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  subOsc.connect(subGain);
  saw1.connect(topGain);
  saw2.connect(topGain);
  subGain.connect(filter);
  topGain.connect(filter);
  filter.connect(shaper);
  shaper.connect(masterGain);
  masterGain.connect(dest);

  subOsc.start(startTime);
  saw1.start(startTime);
  saw2.start(startTime);
  subOsc.stop(startTime + duration + 0.02);
  saw1.stop(startTime + duration + 0.02);
  saw2.stop(startTime + duration + 0.02);

  registerVoice(trackIdx, () => {
    try {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      subOsc.stop();
      saw1.stop();
      saw2.stop();
    } catch (e) {}
  });
}

function stopMelodyPreview() {
  melodySessionId += 1;
  if (melodyLoopTimer) {
    clearTimeout(melodyLoopTimer);
    melodyLoopTimer = null;
  }
  while (activeNodesByTrack[5].length > 0) {
    const fn = activeNodesByTrack[5].pop();
    try { fn(); } catch (e) {}
  }
  setStatus('MELODIE GESTOPPT');
}

function triggerLeadNote(ctx, dest, freq, dur, startTime, trackIdx = null) {
  const synthType = document.getElementById('melody_synth')?.value || 'supersaw';
  const cutoff = parseFloat(document.getElementById('mel_cutoff')?.value || 3600);
  const detune = parseFloat(document.getElementById('mel_detune')?.value || 22);
  const rel = parseFloat(document.getElementById('mel_release')?.value || 0.25);
  const attackMs = parseFloat(document.getElementById('mel_attack')?.value || 0);

  const attackSec = Math.max(0.001, attackMs / 1000);
  const noteDur = Math.max(0.02, dur);
  const t0 = Math.max(0, startTime);
  const noteEnd = t0 + noteDur;
  const totalEnd = noteEnd + Math.max(0.01, rel);

  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const osc3 = ctx.createOscillator();

  if (synthType === 'acid303') {
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc3.type = 'square';
    osc1.frequency.setValueAtTime(freq, t0);
    osc2.frequency.setValueAtTime(freq * 1.005, t0);
    osc3.frequency.setValueAtTime(freq * 0.5, t0);

    filter.type = 'lowpass';
    filter.Q.setValueAtTime(14, t0);
    filter.frequency.setValueAtTime(Math.min(10000, cutoff * 1.4), t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(120, cutoff * 0.2), totalEnd);
  } else if (synthType === 'screech') {
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc3.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq * 1.02, t0);
    osc1.frequency.exponentialRampToValueAtTime(freq, t0 + Math.min(0.04, noteDur * 0.35));
    osc2.frequency.setValueAtTime(freq * 1.5, t0);
    osc3.frequency.setValueAtTime(freq * 2, t0);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cutoff, t0);
    filter.Q.setValueAtTime(2.5, t0);
  } else if (synthType === 'pluck') {
    osc1.type = 'triangle';
    osc2.type = 'sawtooth';
    osc3.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t0);
    osc2.frequency.setValueAtTime(freq * 2, t0);
    osc3.frequency.setValueAtTime(freq, t0);
    osc2.detune.setValueAtTime(detune, t0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(12000, cutoff * 1.8), t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(150, cutoff * 0.25), totalEnd);
  } else {
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc3.type = 'square';
    osc1.frequency.setValueAtTime(freq, t0);
    osc2.frequency.setValueAtTime(freq, t0);
    osc3.frequency.setValueAtTime(freq * 0.5, t0);
    osc1.detune.setValueAtTime(-detune, t0);
    osc2.detune.setValueAtTime(detune, t0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, t0);
    filter.Q.setValueAtTime(4, t0);
  }

  if (attackMs <= 2) {
    gain.gain.setValueAtTime(0.42, t0);
  } else {
    gain.gain.setValueAtTime(0.0008, t0);
    gain.gain.linearRampToValueAtTime(0.42, t0 + attackSec);
  }
  gain.gain.setValueAtTime(0.36, Math.max(t0 + attackSec + 0.005, noteEnd));
  gain.gain.exponentialRampToValueAtTime(0.0008, totalEnd);

  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc1.start(t0);
  osc2.start(t0);
  osc3.start(t0);
  osc1.stop(totalEnd + 0.02);
  osc2.stop(totalEnd + 0.02);
  osc3.stop(totalEnd + 0.02);

  registerVoice(trackIdx, () => {
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      osc1.stop();
      osc2.stop();
      osc3.stop();
    } catch (e) {}
  });
}

function triggerSnare(ctx, dest, params, startTime, trackIdx = null) {
  const {
    mode = activeSnareMode,
    toneHz = 210,
    duration = 0.24,
    filterHz = 1100,
    drive = 3.5
  } = params;

  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = mode === 'clap' ? 'bandpass' : 'highpass';
  filter.frequency.setValueAtTime(filterHz, startTime);
  if (mode === 'clap') filter.Q.setValueAtTime(2.2, startTime);

  const noiseGain = ctx.createGain();
  if (mode === 'clap') {
    noiseGain.gain.setValueAtTime(0.001, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.85, startTime + 0.004);
    noiseGain.gain.setValueAtTime(0.15, startTime + 0.014);
    noiseGain.gain.linearRampToValueAtTime(0.85, startTime + 0.022);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  } else {
    noiseGain.gain.setValueAtTime(0.8, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  }

  const osc = ctx.createOscillator();
  osc.type = mode === 'rim' ? 'square' : 'triangle';
  osc.frequency.setValueAtTime(toneHz, startTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(45, toneHz * 0.3), startTime + Math.min(0.12, duration * 0.6));

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(mode === 'clap' ? 0.45 : 0.85, startTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.min(0.14, duration * 0.75));

  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(drive, mode === 'rim' ? 'industrial' : 'soft');
  shaper.oversample = '2x';

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(shaper);

  osc.connect(oscGain);
  oscGain.connect(shaper);

  shaper.connect(dest);

  noise.start(startTime);
  osc.start(startTime);
  noise.stop(startTime + duration + 0.02);
  osc.stop(startTime + duration + 0.02);

  registerVoice(trackIdx, () => {
    try {
      noiseGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      oscGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      noise.stop();
      osc.stop();
    } catch (e) {}
  });
}

function triggerUptempoKick(ctx, dest, params, startTime, trackIdx = null) {
  const {
    mode = activeUptempoMode,
    startHz,
    endHz,
    zaag = 0.9,
    snapMs = 38,
    drive = 28,
    duration = 0.32
  } = params;

  const snapSec = Math.max(0.01, snapMs / 1000);
  const modeMult = mode === 'piep' ? 1.3 : mode === 'terror' ? 1.45 : 1.0;

  const bodyOsc = ctx.createOscillator();
  bodyOsc.type = mode === 'terror' ? 'square' : 'triangle';
  bodyOsc.frequency.setValueAtTime(startHz * modeMult, startTime);
  bodyOsc.frequency.exponentialRampToValueAtTime(Math.max(36, endHz * 1.25), startTime + snapSec);
  bodyOsc.frequency.exponentialRampToValueAtTime(Math.max(30, endHz), startTime + duration);

  const zaagOsc = ctx.createOscillator();
  zaagOsc.type = 'sawtooth';
  const zaagTop = mode === 'zaag'
    ? Math.max(120, startHz * 0.75)
    : mode === 'piep'
      ? startHz * 1.25
      : startHz * 0.95;
  const zaagTarget = mode === 'zaag'
    ? Math.max(32, endHz * 0.95)
    : Math.max(45, endHz);
  const zaagDropTime = mode === 'zaag'
    ? Math.min(duration * 0.75, snapSec * 1.8)
    : Math.min(duration * 0.85, snapSec * 2.2);

  zaagOsc.frequency.setValueAtTime(zaagTop, startTime);
  zaagOsc.frequency.exponentialRampToValueAtTime(zaagTarget, startTime + zaagDropTime);

  const zaagFilter = ctx.createBiquadFilter();
  if (mode === 'zaag') {
    zaagFilter.type = 'lowpass';
    zaagFilter.frequency.setValueAtTime(1600, startTime);
    zaagFilter.frequency.exponentialRampToValueAtTime(260, startTime + duration * 0.9);
    zaagFilter.Q.setValueAtTime(2.2, startTime);
  } else {
    zaagFilter.type = mode === 'piep' ? 'bandpass' : 'highpass';
    zaagFilter.frequency.setValueAtTime(mode === 'piep' ? 2000 : 280, startTime);
    zaagFilter.frequency.exponentialRampToValueAtTime(mode === 'piep' ? 950 : 140, startTime + duration * 0.85);
    zaagFilter.Q.setValueAtTime(mode === 'piep' ? 3.2 : 1.4, startTime);
  }

  const zaagGain = ctx.createGain();
  const zaagAmt = Math.max(0.001, zaag * (mode === 'piep' ? 0.7 : 0.92));
  zaagGain.gain.setValueAtTime(zaagAmt, startTime);
  zaagGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.95);

  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(drive, mode);
  shaper.oversample = '4x';

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, startTime);
  masterGain.gain.linearRampToValueAtTime(0.98, startTime + 0.002);
  masterGain.gain.setValueAtTime(0.92, startTime + Math.max(0.04, duration * 0.65));
  masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  bodyOsc.connect(shaper);
  zaagOsc.connect(zaagFilter);
  zaagFilter.connect(zaagGain);
  zaagGain.connect(shaper);
  shaper.connect(masterGain);
  masterGain.connect(dest);

  bodyOsc.start(startTime);
  zaagOsc.start(startTime);
  bodyOsc.stop(startTime + duration + 0.02);
  zaagOsc.stop(startTime + duration + 0.02);

  registerVoice(trackIdx, () => {
    try {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      bodyOsc.stop();
      zaagOsc.stop();
    } catch (e) {}
  });
}

/* =========================================================================
   4. ABSPIELEN & .WAV-EXPORT
   ========================================================================= */
function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new ArrayBuffer(length);
  const view = new DataView(out);
  let offset = 0;
  let pos = 0;
  const setUint16 = d => { view.setUint16(pos, d, true); pos += 2; };
  const setUint32 = d => { view.setUint32(pos, d, true); pos += 4; };

  setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
  setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
  setUint32(buffer.sampleRate); setUint32(buffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);

  const channels = [];
  for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i));
  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(pos, sample, true); pos += 2;
    }
    offset++;
  }
  return new Blob([out], { type: 'audio/wav' });
}

function downloadHardtekkKick() {
  const p = getHardtekkParams();
  renderAndDownload(p.duration + 0.05, `SVENTEKK_${p.mode}_Kick_${p.startHz}Hz.wav`,
    (ctx, dest) => triggerKick(ctx, dest, p, 0));
}

function downloadBass() {
  const p = getBassParams();
  renderAndDownload(p.duration + 0.05, `SVENTEKK_${p.mode}_Bass_${p.freq}Hz.wav`,
    (ctx, dest) => triggerBass(ctx, dest, p, 0));
}

function downloadHatRoll() {
  const hits = parseInt(document.getElementById('hat_hits').value, 10);
  const bpm = parseFloat(document.getElementById('bpm').value);
  const stepSec = (60 / bpm) / 4;
  renderAndDownload(hits * stepSec + 0.2, `SVENTEKK_HatRoll_${hits}x.wav`, (ctx, dest) => {
    for (let i = 0; i < hits; i++) triggerHiHat(ctx, dest, i * stepSec, i === hits - 1);
  });
}

function downloadMelody() {
  const bpm = parseFloat(document.getElementById('bpm').value) || 180;
  const stepSec = (60 / bpm) / 2;
  const gate = parseFloat(document.getElementById('melody_gate')?.value || 0.95);
  const rel = parseFloat(document.getElementById('mel_release')?.value || 0.25);
  const notes = getActiveMelodyFrequencies();
  const totalDur = notes.length * stepSec + rel + 0.75;

  renderAndDownload(totalDur, `SVENTEKK_Rave_Phrase_${bpm}BPM.wav`, (ctx, dest) => {
    const chain = createEchoChain(ctx, dest, stepSec);
    notes.forEach((f, idx) => triggerLeadNote(ctx, chain.input, f, stepSec * gate, idx * stepSec));
  });
}

function downloadSnare() {
  const p = getSnareParams();
  renderAndDownload(p.duration + 0.08, `SVENTEKK_${p.mode}_Snare_${p.toneHz}Hz.wav`,
    (ctx, dest) => triggerSnare(ctx, dest, p, 0));
}

function downloadUptempoKick() {
  const p = getUptempoParams();
  renderAndDownload(p.duration + 0.05, `SVENTEKK_Uptempo_${p.mode}_${p.startHz}Hz.wav`,
    (ctx, dest) => triggerUptempoKick(ctx, dest, p, 0));
}

function downloadFullSequencer() {
  const bpm = parseFloat(document.getElementById('bpm').value) || 180;
  const bars = parseInt(document.getElementById('seq_export_bars')?.value || '4', 10);
  const totalSteps = bars * 16;
  const stepSec = (60 / bpm) / 4;
  const gate = parseFloat(document.getElementById('melody_gate')?.value || 0.95);
  const rel = parseFloat(document.getElementById('mel_release')?.value || 0.25);
  const notes = getActiveMelodyFrequencies();
  const hardParams = getHardtekkParams();
  const upParams = getUptempoParams();
  const bassParams = getBassParams();
  const snareParams = getSnareParams();

  const totalDur = totalSteps * stepSec + Math.max(0.8, rel + 0.6);

  renderAndDownload(totalDur, `SVENTEKK_Full_Loop_${bars}Bars_${bpm}BPM.wav`, (ctx, dest) => {
    const out0 = getTrackOut(ctx, dest, 0);
    const out1 = getTrackOut(ctx, dest, 1);
    const out2 = getTrackOut(ctx, dest, 2);
    const out3 = getTrackOut(ctx, dest, 3);
    const out4 = getTrackOut(ctx, dest, 4);
    const out5 = getTrackOut(ctx, dest, 5);
    const chain5 = createEchoChain(ctx, out5, stepSec);

    for (let s = 0; s < totalSteps; s++) {
      const t = s * stepSec;
      const laneStep = s % 16;

      if (sequenceGrid[0][laneStep]) {
        triggerKick(ctx, out0, hardParams, t);
      }
      if (sequenceGrid[1][laneStep]) {
        triggerUptempoKick(ctx, out1, upParams, t);
      }
      if (sequenceGrid[2][laneStep]) {
        triggerBass(ctx, out2, bassParams, t);
      }
      if (sequenceGrid[3][laneStep]) {
        triggerSnare(ctx, out3, snareParams, t);
      }
      if (sequenceGrid[4][laneStep]) {
        triggerHiHat(ctx, out4, t, laneStep % 4 === 2);
      }
      if (sequenceGrid[5][laneStep] && notes.length > 0) {
        const freq = notes[s % notes.length];
        triggerLeadNote(ctx, chain5.input, freq, stepSec * 1.4 * gate, t);
      }
    }
  });
}

async function playHardtekkKick() {
  if (!requireLoginOnly()) return;
  const ctx = await ensureAudioReady();
  triggerKick(ctx, getMasterOut(), getHardtekkParams(), ctx.currentTime, 0);
  setStatus(`PLAYING: ${KICK_PRESETS[activeKickMode].label}`);
}

async function playBass() {
  if (!requireLoginOnly()) return;
  const ctx = await ensureAudioReady();
  triggerBass(ctx, getMasterOut(), getBassParams(), ctx.currentTime, 2);
  setStatus(`PLAYING: ${BASS_PRESETS[activeBassMode].label}`);
}

async function playHatRoll() {
  if (!requireLoginOnly()) return;
  const ctx = await ensureAudioReady();
  const hits = parseInt(document.getElementById('hat_hits').value, 10);
  const bpm = parseFloat(document.getElementById('bpm').value);
  const stepSec = (60 / bpm) / 4;
  for (let i = 0; i < hits; i++) {
    triggerHiHat(ctx, getMasterOut(), ctx.currentTime + i * stepSec, i === hits - 1, 4);
  }
  setStatus(`PLAYING: ${hits}x HAT ROLL`);
}

function scheduleMelodyPass(sessionId) {
  if (sessionId !== melodySessionId) return;
  const ctx = getAudioCtx();
  const dest = getMasterOut();
  const now = ctx.currentTime;

  const bpm = parseFloat(document.getElementById('bpm').value) || 180;
  const stepSec = (60 / bpm) / 2;
  const gate = parseFloat(document.getElementById('melody_gate')?.value || 0.95);
  const notes = getActiveMelodyFrequencies();
  const echoBus = getSharedEchoBus(ctx, dest, stepSec);

  for (let idx = 0; idx < notes.length; idx++) {
    triggerLeadNote(ctx, echoBus, notes[idx], stepSec * gate, now + idx * stepSec, 5);
  }

  setStatus(`PLAYING: ${notes.length}-NOTE RAVE PHRASE`);

  melodyLoopTimer = setTimeout(() => {
    if (sessionId === melodySessionId) {
      scheduleMelodyPass(sessionId);
    }
  }, notes.length * stepSec * 1000);
}

async function playMelody() {
  if (!requireLoginOnly()) return;
  await ensureAudioReady();
  melodySessionId += 1;
  const currentSession = melodySessionId;
  if (melodyLoopTimer) {
    clearTimeout(melodyLoopTimer);
    melodyLoopTimer = null;
  }
  scheduleMelodyPass(currentSession);
}

async function playSnare() {
  if (!requireLoginOnly()) return;
  const ctx = await ensureAudioReady();
  const p = getSnareParams();
  triggerSnare(ctx, getMasterOut(), p, ctx.currentTime, 3);
  setStatus(`PLAYING: ${SNARE_PRESETS[activeSnareMode].label}`);
}

async function playUptempoKick() {
  if (!requireLoginOnly()) return;
  const ctx = await ensureAudioReady();
  triggerUptempoKick(ctx, getMasterOut(), getUptempoParams(), ctx.currentTime, 1);
  setStatus(`PLAYING: ${UPTEMPO_PRESETS[activeUptempoMode].label}`);
}

function randomizeMelody() {
  const scales = Object.keys(MELODY_SCALES);
  document.getElementById('melody_pattern').value = 'random';
  document.getElementById('melody_scale').value = scales[Math.floor(Math.random() * scales.length)];
  buildMelodyNotes();
  playMelody();
}

function getDownloadCount() {
  try {
    return parseInt(localStorage.getItem(DOWNLOAD_COUNT_KEY) || '0', 10) || 0;
  } catch (e) {
    return 0;
  }
}

function updateDownloadCounterUI() {
  const el = document.getElementById('wav-download-count');
  if (el) el.innerText = String(getDownloadCount());
}

function incrementDownloadCounter() {
  const next = getDownloadCount() + 1;
  try {
    localStorage.setItem(DOWNLOAD_COUNT_KEY, String(next));
  } catch (e) {}
  updateDownloadCounterUI();
  return next;
}

async function renderAndDownload(durationSec, filename, renderFn) {
  if (!(await consumeExportCredit())) return;
  const sampleRate = 44100;
  const offlineCtx = new OfflineAudioContext(1, Math.ceil(sampleRate * durationSec), sampleRate);
  const limiter = offlineCtx.createDynamicsCompressor();
  limiter.threshold.setValueAtTime(-3.0, 0);
  limiter.knee.setValueAtTime(2.0, 0);
  limiter.ratio.setValueAtTime(16.0, 0);
  limiter.attack.setValueAtTime(0.002, 0);
  limiter.release.setValueAtTime(0.08, 0);
  limiter.connect(offlineCtx.destination);
  renderFn(offlineCtx, limiter);
  const renderedBuffer = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWav(renderedBuffer);
  const url = URL.createObjectURL(wavBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus('EXPORTED: ' + filename);
  incrementDownloadCounter();
}

/* =========================================================================
   5. SEQUENZER, SAMPLE-LIBRARY & START
   ========================================================================= */
function clearSequencer() {
  for (let t = 0; t < sequenceGrid.length; t++) sequenceGrid[t].fill(0);
  renderSequencerUI();
}

function handleAudioUpload(event) {
  const files = Array.from(event.target.files || []);
  const container = document.getElementById('sample-library-list');

  files.forEach(file => {
    if (!file.type.startsWith('audio/')) return;
    const blobUrl = URL.createObjectURL(file);

    const card = document.createElement('div');
    card.className = 'sample-item';

    const top = document.createElement('div');
    top.className = 'sample-top';

    const title = document.createElement('span');
    title.className = 'sample-title';
    title.textContent = file.name.slice(0, 60);

    const chip = document.createElement('span');
    chip.className = 'chip orange';
    chip.textContent = 'UPLOAD';

    top.appendChild(title);
    top.appendChild(chip);

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.preload = 'metadata';
    audio.src = blobUrl;
    audio.style.width = '100%';
    audio.style.height = '36px';

    card.appendChild(top);
    card.appendChild(audio);
    container.prepend(card);
  });
}

function loadPresetPattern(type) {
  if (type === 'hardtekk') {
    setControlValue('bpm', 'num-bpm', 180);
    document.getElementById('header-bpm').innerText = 180;
    setKickMode('hard');
    setBassMode('offbeat');
    setSnareMode('snare');
    sequenceGrid[0] = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0];
    sequenceGrid[1] = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    sequenceGrid[2] = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0];
    sequenceGrid[3] = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1];
    sequenceGrid[4] = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,1,1,1];
    sequenceGrid[5] = [1,0,1,1, 0,1,0,1, 1,0,1,1, 0,1,1,0];
  } else {
    setControlValue('bpm', 'num-bpm', 210);
    document.getElementById('header-bpm').innerText = 210;
    setUptempoMode('zaag');
    setBassMode('sub');
    setSnareMode('clap');
    sequenceGrid[0] = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    sequenceGrid[1] = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,1,1,1];
    sequenceGrid[2] = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,0,0];
    sequenceGrid[3] = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0];
    sequenceGrid[4] = [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,1,1,1];
    sequenceGrid[5] = [1,1,0,1, 1,0,1,0, 1,1,0,1, 1,1,1,0];
  }
  renderSequencerUI();
}

function playStepSounds(step) {
  const ctx = getAudioCtx();
  const baseDest = getMasterOut();
  const now = ctx.currentTime;
  const bpm = parseFloat(document.getElementById('bpm').value);
  const stepSec = (60 / bpm) / 4;
  const gate = parseFloat(document.getElementById('melody_gate')?.value || 0.95);
  const notes = getActiveMelodyFrequencies();

  if (sequenceGrid[0][step]) {
    triggerKick(ctx, getTrackOut(ctx, baseDest, 0), getHardtekkParams(), now, 0);
  }
  if (sequenceGrid[1][step]) {
    triggerUptempoKick(ctx, getTrackOut(ctx, baseDest, 1), getUptempoParams(), now, 1);
  }
  if (sequenceGrid[2][step]) {
    triggerBass(ctx, getTrackOut(ctx, baseDest, 2), getBassParams(), now, 2);
  }
  if (sequenceGrid[3][step]) {
    triggerSnare(ctx, getTrackOut(ctx, baseDest, 3), getSnareParams(), now, 3);
  }
  if (sequenceGrid[4][step]) {
    triggerHiHat(ctx, getTrackOut(ctx, baseDest, 4), now, step % 4 === 2, 4);
  }
  if (sequenceGrid[5][step] && notes.length > 0) {
    const echoBus = getMelodyTrackEchoBus(ctx, baseDest, stepSec);
    const freq = notes[seqMelodyStepIndex % notes.length];
    triggerLeadNote(ctx, echoBus, freq, stepSec * 1.4 * gate, now, 5);
  }
  seqMelodyStepIndex += 1;
}

function renderSampleLibrary() {
  const container = document.getElementById('sample-library-list');
  container.innerHTML = '';

  presetSamples.forEach(item => {
    const card = document.createElement('div');
    card.className = 'sample-item';

    const top = document.createElement('div');
    top.className = 'sample-top';

    const title = document.createElement('span');
    title.className = 'sample-title';
    title.textContent = item.title;

    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = item.type;

    top.appendChild(title);
    top.appendChild(chip);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'btn btn-cyan';
    playBtn.textContent = '▶ Anhören';
    playBtn.onclick = () => {
      if (item.generator === 'hardtekk') { setKickMode('hard'); playHardtekkKick(); }
      else if (item.generator === 'industrial') { setKickMode('industrial'); playHardtekkKick(); }
      else if (item.generator === 'uptempo_zaag') { setUptempoMode('zaag'); playUptempoKick(); }
      else if (item.generator === 'uptempo_piep') { setUptempoMode('piep'); playUptempoKick(); }
      else if (item.generator === 'bass') { setBassMode('sub'); playBass(); }
      else playMelody();
    };

    const dlBtn = document.createElement('button');
    dlBtn.type = 'button';
    dlBtn.className = 'btn btn-ghost';
    dlBtn.textContent = '⬇ .WAV';
    dlBtn.onclick = () => {
      if (item.generator === 'hardtekk') { setKickMode('hard'); downloadHardtekkKick(); }
      else if (item.generator === 'industrial') { setKickMode('industrial'); downloadHardtekkKick(); }
      else if (item.generator === 'uptempo_zaag') { setUptempoMode('zaag'); downloadUptempoKick(); }
      else if (item.generator === 'uptempo_piep') { setUptempoMode('piep'); downloadUptempoKick(); }
      else if (item.generator === 'bass') { setBassMode('sub'); downloadBass(); }
      else downloadMelody();
    };

    actions.appendChild(playBtn);
    actions.appendChild(dlBtn);
    card.appendChild(top);
    card.appendChild(actions);
    container.appendChild(card);
  });
}

function renderSequencerUI() {
  const container = document.getElementById('sequencer-rows');
  container.innerHTML = '';
  const trackNames = ['01 KICK', '02 UPTEMPO', '03 BASS', '04 SNARE', '05 HI-HAT', '06 MELODY'];

  trackNames.forEach((name, tIdx) => {
    const row = document.createElement('div');
    row.className = 'seq-row';

    const controls = document.createElement('div');
    controls.className = 'seq-track-controls';

    const label = document.createElement('div');
    label.className = 'seq-label';
    label.innerText = name;

    const rightControls = document.createElement('div');
    rightControls.className = 'seq-track-meta';

    const volWrap = document.createElement('div');
    volWrap.className = 'seq-vol-wrap';
    volWrap.title = 'Spur-Lautstärke';

    const volSlider = document.createElement('input');
    volSlider.type = 'range';
    volSlider.className = 'seq-vol-slider';
    volSlider.min = '0';
    volSlider.max = '1.3';
    volSlider.step = '0.05';
    volSlider.value = String(trackVolumes[tIdx]);

    const volVal = document.createElement('span');
    volVal.className = 'seq-vol-val';
    volVal.innerText = `${Math.round(trackVolumes[tIdx] * 100)}%`;

    volSlider.oninput = () => {
      const v = parseFloat(volSlider.value);
      trackVolumes[tIdx] = v;
      volVal.innerText = `${Math.round(v * 100)}%`;
      if (tIdx === 5 && melodyEchoBus && melodyEchoBus.trackGain) {
        melodyEchoBus.trackGain.gain.setValueAtTime(Math.max(0, Math.min(1.5, v)), getAudioCtx().currentTime);
      }
    };

    volWrap.appendChild(volSlider);
    volWrap.appendChild(volVal);

    const vBtn = document.createElement('button');
    vBtn.type = 'button';
    const isPoly = trackVoiceModes[tIdx] === 'poly';
    vBtn.className = 'voice-btn' + (isPoly ? ' poly' : '');
    vBtn.innerText = isPoly ? 'POLY' : 'MONO';
    vBtn.onclick = () => {
      trackVoiceModes[tIdx] = trackVoiceModes[tIdx] === 'mono' ? 'poly' : 'mono';
      renderSequencerUI();
    };

    rightControls.appendChild(volWrap);
    rightControls.appendChild(vBtn);

    controls.appendChild(label);
    controls.appendChild(rightControls);
    row.appendChild(controls);

    const stepsWrap = document.createElement('div');
    stepsWrap.className = 'seq-steps';

    for (let s = 0; s < 16; s++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'step-btn';
      btn.id = `step-${tIdx}-${s}`;
      btn.innerText = s + 1;
      if (sequenceGrid[tIdx][s]) {
        btn.classList.add('on');
        if (tIdx === 0 || tIdx === 2) btn.classList.add('cyan');
        if (tIdx === 5) btn.classList.add('purple');
      }
      btn.onclick = () => {
        sequenceGrid[tIdx][s] = sequenceGrid[tIdx][s] ? 0 : 1;
        btn.classList.toggle('on');
        if (tIdx === 0 || tIdx === 2) btn.classList.toggle('cyan', !!sequenceGrid[tIdx][s]);
        if (tIdx === 5) btn.classList.toggle('purple', !!sequenceGrid[tIdx][s]);
      };
      stepsWrap.appendChild(btn);
    }
    row.appendChild(stepsWrap);
    container.appendChild(row);
  });
}

function runSequencerLoop() {
  if (!isPlaying) return;
  document.querySelectorAll('.step-btn.now').forEach(el => el.classList.remove('now'));
  for (let t = 0; t < sequenceGrid.length; t++) {
    const el = document.getElementById(`step-${t}-${currentStep}`);
    if (el) el.classList.add('now');
  }
  playStepSounds(currentStep);
  currentStep = (currentStep + 1) % 16;
  const bpm = parseFloat(document.getElementById('bpm').value);
  stepTimer = setTimeout(runSequencerLoop, ((60 / bpm) / 4) * 1000);
}

async function toggleSequencer() {
  const btn = document.getElementById('btn-seq-play');
  if (isPlaying) {
    isPlaying = false;
    clearTimeout(stepTimer);
    document.querySelectorAll('.step-btn.now').forEach(el => el.classList.remove('now'));
    btn.innerText = '▶ START';
    setStatus('SEQUENCER STOPPED');
  } else {
    if (!requireLoginOnly()) return;
    stopMelodyPreview();
    await ensureAudioReady();
    isPlaying = true;
    currentStep = 0;
    seqMelodyStepIndex = 0;
    btn.innerText = '■ STOP';
    setStatus('LIVE LOOPING');
    runSequencerLoop();
  }
}

/* =========================================================================
   6. OFFENE FIXES / NOTIZBLOCK (LOKAL)
   ========================================================================= */
const FIX_NOTES_STORAGE_KEY = 'sventekk_open_fixes_v1';

function initFixNotesBox() {
  const ta = document.getElementById('dev-fix-notes');
  const statusEl = document.getElementById('fix-notes-status');
  if (!ta) return;

  try {
    const saved = localStorage.getItem(FIX_NOTES_STORAGE_KEY);
    if (saved !== null) ta.value = saved;
  } catch (e) {}

  ta.addEventListener('input', () => {
    try {
      localStorage.setItem(FIX_NOTES_STORAGE_KEY, ta.value);
      if (statusEl) {
        statusEl.style.color = 'var(--text-dim)';
        statusEl.innerText = 'Automatisch gespeichert';
      }
    } catch (e) {}
  });
}

function saveFixNotes() {
  const ta = document.getElementById('dev-fix-notes');
  const statusEl = document.getElementById('fix-notes-status');
  if (!ta) return;
  try {
    localStorage.setItem(FIX_NOTES_STORAGE_KEY, ta.value);
    if (statusEl) {
      statusEl.style.color = '#6ee7b7';
      statusEl.innerText = '✔ Fix-Notizen gespeichert';
    }
  } catch (e) {
    if (statusEl) {
      statusEl.style.color = '#fca5a5';
      statusEl.innerText = 'Speichern im Browser nicht möglich';
    }
  }
}

function clearFixNotes() {
  const ta = document.getElementById('dev-fix-notes');
  const statusEl = document.getElementById('fix-notes-status');
  if (ta) ta.value = '';
  try { localStorage.removeItem(FIX_NOTES_STORAGE_KEY); } catch (e) {}
  if (statusEl) {
    statusEl.style.color = 'var(--text-dim)';
    statusEl.innerText = 'Notizen geleert';
  }
}

applyVersionTags();
initAllControlBindings();
buildMelodyNotes();
renderSequencerUI();
renderSampleLibrary();
initFixNotesBox();
updateDownloadCounterUI();
loadSession();
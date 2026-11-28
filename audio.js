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
  piep:   { label: 'PIEP KICK',   start: 1150, end: 64, zaag: 0.45, snap: 24, drive: 32, dauer: 0.25 },
  zaag:   { label: 'ZAAG KICK',   start: 680,  end: 52, zaag: 1.25, snap: 28, drive: 36, dauer: 0.30 },
  terror: { label: 'TERROR 230+', start: 1320, end: 70, zaag: 1.05, snap: 15, drive: 44, dauer: 0.21 }
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

const MELODY_SYNTH_PRESETS = {
  supersaw: { label: 'SUPERSAW', detune: 22, release: 0.24, cutoff: 3800 },
  acid303:  { label: 'ACID 303', detune: 10, release: 0.16, cutoff: 2600 },
  screech:  { label: 'SCREECH',  detune: 28, release: 0.20, cutoff: 4200 },
  pluck:    { label: 'PLUCK',    detune: 14, release: 0.30, cutoff: 4800 }
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
  { title: 'K_HARD_240.wav', type: 'Hard Kick', generator: 'hardtekk' },
  { title: 'UP_ZAAG_52.wav', type: 'Zaag Kick', generator: 'uptempo_zaag' },
  { title: 'UP_PIEP_64.wav', type: 'Piep Kick', generator: 'uptempo_piep' },
  { title: 'B_SUB_55.wav',   type: 'Sub Bass',  generator: 'bass' },
  { title: 'MEL_4T_180.wav', type: 'Melodie',   generator: 'melody' }
];

const DOWNLOAD_COUNT_KEY = 'sventekk_wav_download_v1';

let audioCtx = null;
let masterLimiter = null;
let masterAnalyser = null;
let scopeData = null;
let sharedEchoBus = null;
let melodyEchoBus = null;
let recordedTagBuffer = null;
let isRecordingTag = false;
let availableVoices = [];
let activeUtterance = null;
let speechKeepAliveTimer = null;
let speechStartTimer = null;
let isPlaying = false;
let isMelodyPlaying = false;
let currentStep = 0;
let seqMelodyStepIndex = 0;
let stepTimer = null;
let melodyLoopTimer = null;
let melodySessionId = 0;
const activeMelodyPreviewNodes = [];
let activeKickMode = 'hard';
let activeUptempoMode = 'zaag';
let activeBassMode = 'sub';
let activeSnareMode = 'snare';
let activeMelodySynth = 'supersaw';
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
    masterAnalyser = audioCtx.createAnalyser();
    masterAnalyser.fftSize = 512;
    scopeData = new Uint8Array(masterAnalyser.fftSize);
    masterLimiter.connect(masterAnalyser);
    masterAnalyser.connect(audioCtx.destination);
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

  bindSliderAndNumber('melody_bars', 'num-mel-bars', () => updateMelodyDurationUI());
  bindSliderAndNumber('melody_gate', 'num-mel-gate');
  bindSliderAndNumber('mel_cutoff', 'num-mel-cutoff');
  bindSliderAndNumber('tag_pitch', 'num-tag-pitch');
  bindSliderAndNumber('tag_speed', 'num-tag-speed');
  bindSliderAndNumber('tag_drive', 'num-tag-drive');
  LAB_CONTROLS.forEach(([r, n]) => bindSliderAndNumber(r, n, () => markLabCustom()));

  bindSliderAndNumber('bpm', 'num-bpm', (val) => {
    document.getElementById('header-bpm').innerText = val;
    updateMelodyDurationUI();
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

  document.querySelectorAll('.style-btn:not(.up-style):not(.bass-style):not(.snare-style):not(.mel-style):not(.lab-style)').forEach(btn => {
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

function getMelodyBars() {
  const raw = parseInt(document.getElementById('melody_bars')?.value || '4', 10);
  if (Number.isNaN(raw)) return 4;
  return Math.max(1, Math.min(16, raw));
}

function getMelodyPreset() {
  return MELODY_SYNTH_PRESETS[activeMelodySynth] || MELODY_SYNTH_PRESETS.supersaw;
}

function updateMelodyDurationUI() {
  const infoEl = document.getElementById('melody-duration-info');
  if (!infoEl) return;
  const bpm = parseFloat(document.getElementById('bpm')?.value) || 180;
  const bars = getMelodyBars();
  const stepSec = (60 / bpm) / 2;
  const sec = bars * 8 * stepSec;
  infoEl.innerText = `~${sec.toFixed(1)} s`;
}

function setMelodySynth(mode) {
  const p = MELODY_SYNTH_PRESETS[mode];
  if (!p) return;
  activeMelodySynth = mode;

  document.querySelectorAll('.mel-style').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.melmode === mode);
  });
  const badge = document.getElementById('melody-mode-badge');
  if (badge) badge.innerText = p.label;

  setControlValue('mel_cutoff', 'num-mel-cutoff', p.cutoff);
  setStatus(`MELODIE SOUND: ${p.label}`);
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
  const bars = getMelodyBars();
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
      const asym = x >= 0 ? x * (1 + k / 10) : x * (1 + k / 15);
      const clipped = Math.max(-0.92, Math.min(0.92, Math.tanh(asym) * 1.35));
      curve[i] = Math.max(-0.96, Math.min(0.96, clipped + Math.sin(clipped * Math.PI * 1.5) * 0.14));
    } else if (mode === 'zaag') {
      const asym = x >= 0 ? x * (1.8 + k / 6) : x * (1.1 + k / 9) - 0.08;
      const hard = Math.max(-0.88, Math.min(0.88, asym));
      const grit = Math.tanh(x * (k / 5)) * 0.65 + hard * 0.55;
      curve[i] = Math.max(-0.98, Math.min(0.98, grit * 1.2));
    } else if (mode === 'terror') {
      const brick = Math.max(-0.82, Math.min(0.82, x * (2.5 + k / 4)));
      curve[i] = Math.max(-0.98, Math.min(0.98, brick * 1.18));
    } else if (mode === 'hardclip') {
      const hc = x * (1.6 + k / 8);
      curve[i] = Math.max(-0.94, Math.min(0.94, hc));
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

function setMelodyButtonState(playing) {
  isMelodyPlaying = playing;
  const btn = document.getElementById('btn-melody-play');
  if (btn) {
    btn.innerText = playing
      ? (typeof t === 'function' ? t('m5_stop') : '■ Stoppen')
      : (typeof t === 'function' ? t('m5_play') : '▶ Komplette Melodie anhören');
  }
}

function stopMelodyPreview(silent = false) {
  melodySessionId += 1;
  if (melodyLoopTimer) {
    clearTimeout(melodyLoopTimer);
    melodyLoopTimer = null;
  }
  while (activeMelodyPreviewNodes.length > 0) {
    const fn = activeMelodyPreviewNodes.pop();
    try { fn(); } catch (e) {}
  }
  while (activeNodesByTrack[5].length > 0) {
    const fn = activeNodesByTrack[5].pop();
    try { fn(); } catch (e) {}
  }
  setMelodyButtonState(false);
  if (!silent) setStatus('MELODIE GESTOPPT');
}

function triggerLeadNote(ctx, dest, freq, dur, startTime, trackIdx = null, previewBucket = null) {
  const preset = getMelodyPreset();
  const synthType = activeMelodySynth;
  const cutoff = parseFloat(document.getElementById('mel_cutoff')?.value || preset.cutoff);
  const detune = preset.detune;
  const rel = preset.release;
  const attackSec = 0.006;

  const noteDur = Math.max(0.03, dur);
  const t0 = Math.max(0, startTime);
  const sustainEnd = Math.max(t0 + attackSec + 0.01, t0 + noteDur);
  const totalEnd = sustainEnd + Math.max(0.04, rel);

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
    filter.Q.setValueAtTime(12, t0);
    filter.frequency.setValueAtTime(Math.min(10000, cutoff * 1.4), t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(140, cutoff * 0.25), totalEnd);
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
    filter.frequency.exponentialRampToValueAtTime(Math.max(160, cutoff * 0.25), totalEnd);
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
    filter.Q.setValueAtTime(3.5, t0);
  }

  gain.gain.setValueAtTime(0.0008, t0);
  gain.gain.linearRampToValueAtTime(0.42, t0 + attackSec);
  gain.gain.linearRampToValueAtTime(0.36, sustainEnd);
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

  const stopFn = () => {
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      osc1.stop();
      osc2.stop();
      osc3.stop();
    } catch (e) {}
  };

  if (Array.isArray(previewBucket)) {
    previewBucket.push(stopFn);
  } else {
    registerVoice(trackIdx, stopFn);
  }
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
    startHz = 680,
    endHz = 52,
    zaag = 1.25,
    snapMs = 28,
    drive = 36,
    duration = 0.30
  } = params;

  const t0 = Math.max(0, startTime);
  const snapSec = Math.max(0.01, Math.min(duration * 0.45, snapMs / 1000));
  const tailStart = t0 + snapSec * 0.55;

  // 1. Haupt-Body & Sub-Punch (schneller Uptempo-Pitch-Drop)
  const bodyOsc = ctx.createOscillator();
  bodyOsc.type = mode === 'terror' ? 'triangle' : 'sine';
  const bodyTop = mode === 'piep'
    ? Math.max(1100, startHz * 2.1)
    : mode === 'terror'
      ? Math.max(1300, startHz * 1.9)
      : Math.max(620, startHz * 1.35);
  const bodyKnee = mode === 'piep'
    ? Math.max(88, endHz * 1.65)
    : mode === 'terror'
      ? Math.max(76, endHz * 1.35)
      : Math.max(58, endHz * 1.2);
  bodyOsc.frequency.setValueAtTime(bodyTop, t0);
  bodyOsc.frequency.exponentialRampToValueAtTime(bodyKnee, t0 + snapSec);
  bodyOsc.frequency.exponentialRampToValueAtTime(Math.max(32, endHz), t0 + duration * 0.85);
  bodyOsc.frequency.setValueAtTime(Math.max(32, endHz), t0 + duration);

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(1.15, t0);
  bodyGain.gain.setValueAtTime(mode === 'zaag' ? 0.95 : 1.05, t0 + duration * 0.72);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  // 2. Dedizierter Piep-/Tok-Transient (knackiger Uptempo-Anschlag)
  const tokOsc = ctx.createOscillator();
  tokOsc.type = mode === 'piep' ? 'sine' : 'triangle';
  const tokStartHz = mode === 'piep'
    ? Math.max(1600, startHz * 2.4)
    : mode === 'terror'
      ? Math.max(1500, startHz * 2.0)
      : Math.max(900, startHz * 1.6);
  const tokEndHz = mode === 'piep'
    ? Math.max(320, startHz * 0.42)
    : Math.max(160, startHz * 0.25);
  const tokLen = Math.min(duration * 0.4, snapSec * (mode === 'piep' ? 1.55 : 1.15));
  tokOsc.frequency.setValueAtTime(tokStartHz, t0);
  tokOsc.frequency.exponentialRampToValueAtTime(tokEndHz, t0 + tokLen);

  const tokFilter = ctx.createBiquadFilter();
  tokFilter.type = 'peaking';
  tokFilter.frequency.setValueAtTime(mode === 'piep' ? 1850 : 1250, t0);
  tokFilter.Q.setValueAtTime(mode === 'piep' ? 3.2 : 1.8, t0);
  tokFilter.gain.setValueAtTime(mode === 'piep' ? 14 : 9, t0);

  const tokGain = ctx.createGain();
  const tokLevel = mode === 'piep' ? 1.25 : mode === 'terror' ? 1.1 : 0.85;
  tokGain.gain.setValueAtTime(tokLevel, t0);
  tokGain.gain.exponentialRampToValueAtTime(0.001, t0 + tokLen);

  // 3. Zaag-Säge / Uptempo-Tail-Oszillatoren (setzen direkt hinter dem Tok ein!)
  const zaagOsc1 = ctx.createOscillator();
  const zaagOsc2 = ctx.createOscillator();
  zaagOsc1.type = 'sawtooth';
  zaagOsc2.type = mode === 'terror' ? 'square' : 'sawtooth';

  const zaagBaseHz = Math.max(36, endHz * (mode === 'zaag' ? 1.0 : mode === 'piep' ? 1.5 : 1.0));
  zaagOsc1.frequency.setValueAtTime(zaagBaseHz * 1.18, t0);
  zaagOsc1.frequency.exponentialRampToValueAtTime(zaagBaseHz, tailStart + 0.03);
  zaagOsc2.frequency.setValueAtTime(zaagBaseHz * 2.0, t0);
  zaagOsc2.frequency.exponentialRampToValueAtTime(zaagBaseHz * (mode === 'zaag' ? 1.0 : 2.0), tailStart + 0.03);
  zaagOsc1.detune.setValueAtTime(mode === 'zaag' ? -18 : -8, t0);
  zaagOsc2.detune.setValueAtTime(mode === 'zaag' ? 22 : 12, t0);

  const zaagFilter = ctx.createBiquadFilter();
  if (mode === 'zaag') {
    zaagFilter.type = 'bandpass';
    zaagFilter.frequency.setValueAtTime(980, t0);
    zaagFilter.frequency.exponentialRampToValueAtTime(520, t0 + duration);
    zaagFilter.Q.setValueAtTime(1.1, t0);
  } else if (mode === 'piep') {
    zaagFilter.type = 'bandpass';
    zaagFilter.frequency.setValueAtTime(1950, t0);
    zaagFilter.frequency.exponentialRampToValueAtTime(1150, t0 + duration);
    zaagFilter.Q.setValueAtTime(2.6, t0);
  } else {
    zaagFilter.type = 'highpass';
    zaagFilter.frequency.setValueAtTime(220, t0);
    zaagFilter.Q.setValueAtTime(1.2, t0);
  }

  const zaagGain = ctx.createGain();
  const zaagLevel = Math.max(0.001, zaag * (mode === 'zaag' ? 1.15 : mode === 'piep' ? 0.65 : 0.95));
  zaagGain.gain.setValueAtTime(0.001, t0);
  zaagGain.gain.linearRampToValueAtTime(zaagLevel, tailStart);
  zaagGain.gain.setValueAtTime(zaagLevel * 0.92, t0 + duration * 0.78);
  zaagGain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  // 4. Zweistufige Hardcore-Distortion-Kette (EQ -> Clip 1 -> Hollow/Bite EQ -> Brickwall Clip 2)
  const preEq = ctx.createBiquadFilter();
  preEq.type = 'peaking';
  preEq.frequency.setValueAtTime(mode === 'piep' ? 1600 : mode === 'zaag' ? 210 : 950, t0);
  preEq.Q.setValueAtTime(mode === 'piep' ? 2.4 : 1.4, t0);
  preEq.gain.setValueAtTime(mode === 'piep' ? 12 : mode === 'zaag' ? 10 : 11, t0);

  const shaper1 = ctx.createWaveShaper();
  shaper1.curve = makeDistortionCurve(drive, mode);
  shaper1.oversample = '4x';

  const midScoop = ctx.createBiquadFilter();
  midScoop.type = 'peaking';
  midScoop.frequency.setValueAtTime(mode === 'zaag' ? 420 : 380, t0);
  midScoop.Q.setValueAtTime(1.4, t0);
  midScoop.gain.setValueAtTime(mode === 'zaag' ? -4.5 : -6.0, t0);

  const biteEq = ctx.createBiquadFilter();
  biteEq.type = 'peaking';
  biteEq.frequency.setValueAtTime(mode === 'piep' ? 2450 : mode === 'zaag' ? 1850 : 2100, t0);
  biteEq.Q.setValueAtTime(1.5, t0);
  biteEq.gain.setValueAtTime(mode === 'piep' ? 9.5 : mode === 'zaag' ? 8.5 : 10.0, t0);

  const shaper2 = ctx.createWaveShaper();
  shaper2.curve = makeDistortionCurve(Math.max(12, drive * 0.75), 'hardclip');
  shaper2.oversample = '4x';

  const subTightHp = ctx.createBiquadFilter();
  subTightHp.type = 'highpass';
  subTightHp.frequency.setValueAtTime(34, t0);

  const fizzLp = ctx.createBiquadFilter();
  fizzLp.type = 'lowpass';
  fizzLp.frequency.setValueAtTime(mode === 'zaag' ? 9800 : 11500, t0);

  // 5. Sauberer Sub-Anker für Druck auf Korg / Club-Anlagen
  const subAnchor = ctx.createOscillator();
  subAnchor.type = 'sine';
  subAnchor.frequency.setValueAtTime(Math.max(42, endHz * 1.4), t0);
  subAnchor.frequency.exponentialRampToValueAtTime(Math.max(34, endHz), t0 + snapSec);
  const subAnchorGain = ctx.createGain();
  subAnchorGain.gain.setValueAtTime(0.001, t0);
  subAnchorGain.gain.linearRampToValueAtTime(mode === 'zaag' ? 0.42 : 0.34, tailStart);
  subAnchorGain.gain.setValueAtTime(mode === 'zaag' ? 0.38 : 0.30, t0 + duration * 0.78);
  subAnchorGain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  // 6. Straffe Uptempo-Master-Hüllkurve (voll laut bis kurz vor Schluss, dann sauberer Cut)
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, t0);
  masterGain.gain.linearRampToValueAtTime(0.98, t0 + 0.0015);
  masterGain.gain.setValueAtTime(0.95, t0 + Math.max(0.04, duration * 0.8));
  masterGain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  bodyOsc.connect(bodyGain);
  bodyGain.connect(preEq);

  tokOsc.connect(tokFilter);
  tokFilter.connect(tokGain);
  tokGain.connect(preEq);

  zaagOsc1.connect(zaagFilter);
  zaagOsc2.connect(zaagFilter);
  zaagFilter.connect(zaagGain);
  zaagGain.connect(preEq);

  preEq.connect(shaper1);
  shaper1.connect(midScoop);
  midScoop.connect(biteEq);
  biteEq.connect(shaper2);
  shaper2.connect(subTightHp);
  subTightHp.connect(fizzLp);
  fizzLp.connect(masterGain);

  subAnchor.connect(subAnchorGain);
  subAnchorGain.connect(masterGain);

  masterGain.connect(dest);

  const stopAt = t0 + duration + 0.02;
  bodyOsc.start(t0);
  tokOsc.start(t0);
  zaagOsc1.start(t0);
  zaagOsc2.start(t0);
  subAnchor.start(t0);

  bodyOsc.stop(stopAt);
  tokOsc.stop(t0 + tokLen + 0.02);
  zaagOsc1.stop(stopAt);
  zaagOsc2.stop(stopAt);
  subAnchor.stop(stopAt);

  registerVoice(trackIdx, () => {
    try {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      bodyOsc.stop();
      tokOsc.stop();
      zaagOsc1.stop();
      zaagOsc2.stop();
      subAnchor.stop();
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

function shortTag(map, key, fallback) {
  return map[key] || fallback;
}

function downloadHardtekkKick() {
  const p = getHardtekkParams();
  const tag = shortTag({
    soft: 'SOFT',
    hard: 'HARD',
    industrial: 'IND',
    gabber: 'GAB',
    schranz: 'SCHR',
    hardtechno: 'HTEC'
  }, p.mode, 'KICK');
  renderAndDownload(p.duration + 0.05, `K_${tag}_${Math.round(p.startHz)}.wav`,
    (ctx, dest) => triggerKick(ctx, dest, p, 0));
}

function downloadBass() {
  const p = getBassParams();
  const tag = shortTag({ sub: 'SUB', offbeat: 'SAW', reese: 'REE' }, p.mode, 'BAS');
  renderAndDownload(p.duration + 0.05, `B_${tag}_${Math.round(p.freq)}.wav`,
    (ctx, dest) => triggerBass(ctx, dest, p, 0));
}

function downloadHatRoll() {
  const hits = parseInt(document.getElementById('hat_hits').value, 10);
  const bpm = parseFloat(document.getElementById('bpm').value);
  const stepSec = (60 / bpm) / 4;
  renderAndDownload(hits * stepSec + 0.2, `HAT_${hits}X.wav`, (ctx, dest) => {
    for (let i = 0; i < hits; i++) triggerHiHat(ctx, dest, i * stepSec, i === hits - 1);
  });
}

function downloadMelody() {
  const bpm = Math.round(parseFloat(document.getElementById('bpm').value) || 180);
  const bars = getMelodyBars();
  const stepSec = (60 / bpm) / 2;
  const gate = parseFloat(document.getElementById('melody_gate')?.value || 1.0);
  const rel = getMelodyPreset().release;
  const notes = getActiveMelodyFrequencies();
  const totalDur = notes.length * stepSec + rel + 0.75;

  renderAndDownload(totalDur, `MEL_${bars}T_${bpm}.wav`, (ctx, dest) => {
    const chain = createEchoChain(ctx, dest, stepSec);
    notes.forEach((f, idx) => triggerLeadNote(ctx, chain.input, f, stepSec * gate, idx * stepSec));
  });
}

function downloadSnare() {
  const p = getSnareParams();
  const tag = shortTag({ snare: 'SNR', clap: 'CLP', rim: 'RIM' }, p.mode, 'SNR');
  renderAndDownload(p.duration + 0.08, `${tag}_${Math.round(p.toneHz)}.wav`,
    (ctx, dest) => triggerSnare(ctx, dest, p, 0));
}

function downloadUptempoKick() {
  const p = getUptempoParams();
  const tag = shortTag({ piep: 'PIEP', zaag: 'ZAAG', terror: 'TER' }, p.mode, 'UP');
  renderAndDownload(p.duration + 0.05, `UP_${tag}_${Math.round(p.endHz)}.wav`,
    (ctx, dest) => triggerUptempoKick(ctx, dest, p, 0));
}

function downloadFullSequencer() {
  const bpm = Math.round(parseFloat(document.getElementById('bpm').value) || 180);
  const bars = parseInt(document.getElementById('seq_export_bars')?.value || '4', 10);
  const totalSteps = bars * 16;
  const stepSec = (60 / bpm) / 4;
  const gate = parseFloat(document.getElementById('melody_gate')?.value || 1.0);
  const rel = getMelodyPreset().release;
  const notes = getActiveMelodyFrequencies();
  const hardParams = getHardtekkParams();
  const labSeqParams = getLabParams();
  const upParams = getUptempoParams();
  const bassParams = getBassParams();
  const snareParams = getSnareParams();

  const totalDur = totalSteps * stepSec + Math.max(0.8, rel + 0.6);

  renderAndDownload(totalDur, `LOOP_${bars}T_${bpm}.wav`, (ctx, dest) => {
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
        if (useLabKickInSeq) {
        triggerLabKick(ctx, out0, labSeqParams, t);
      } else {
        triggerKick(ctx, out0, hardParams, t);
      }
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
    triggerHiHat(ctx, getMasterOut(), ctx.currentTime + 0.02 + i * stepSec, i === hits - 1, null);
  }
  setStatus(`PLAYING: ${hits}x HAT ROLL`);
}

function toggleMelodyPreview() {
  if (isMelodyPlaying) {
    stopMelodyPreview();
  } else {
    playMelody();
  }
}

async function playMelody() {
  if (!requireLoginOnly()) return;
  const ctx = await ensureAudioReady();
  stopMelodyPreview(true);

  melodySessionId += 1;
  const currentSession = melodySessionId;
  const dest = getMasterOut();
  const startBase = ctx.currentTime + 0.03;

  const bpm = parseFloat(document.getElementById('bpm').value) || 180;
  const bars = getMelodyBars();
  const stepSec = (60 / bpm) / 2;
  const gate = parseFloat(document.getElementById('melody_gate')?.value || 1.0);
  const rel = getMelodyPreset().release;
  const notes = getActiveMelodyFrequencies();
  const echoBus = getSharedEchoBus(ctx, dest, stepSec);

  for (let idx = 0; idx < notes.length; idx++) {
    triggerLeadNote(
      ctx,
      echoBus,
      notes[idx],
      stepSec * gate,
      startBase + idx * stepSec,
      null,
      activeMelodyPreviewNodes
    );
  }

  const totalSec = notes.length * stepSec + rel + 0.2;
  setMelodyButtonState(true);
  setStatus(`MELODIE LÄUFT: ${bars} TAKTE (${(notes.length * stepSec).toFixed(1)}s)`);

  melodyLoopTimer = setTimeout(() => {
    if (currentSession === melodySessionId) {
      activeMelodyPreviewNodes.length = 0;
      setMelodyButtonState(false);
      setStatus('MELODIE FERTIG');
    }
  }, Math.ceil(totalSec * 1000));
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
  updateMelodyDurationUI();
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
    if (useLabKickInSeq) {
      triggerLabKick(ctx, getTrackOut(ctx, baseDest, 0), getLabParams(), now, 0);
    } else {
      triggerKick(ctx, getTrackOut(ctx, baseDest, 0), getHardtekkParams(), now, 0);
    }
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

/* =========================================================================
   7. LIVE-OSZILLOSKOP, PRESET-SNAP & PRODUCER TAG / VOICE STUDIO
   ========================================================================= */
function initOscilloscope() {
  const canvas = document.getElementById('studio-scope');
  if (!canvas) return;
  const ctx2d = canvas.getContext('2d');
  if (!ctx2d) return;

  function drawScope() {
    const w = canvas.width;
    const h = canvas.height;
    ctx2d.fillStyle = '#07070b';
    ctx2d.fillRect(0, 0, w, h);

    // Dezente Mittellinie
    ctx2d.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx2d.lineWidth = 1;
    ctx2d.beginPath();
    ctx2d.moveTo(0, h / 2);
    ctx2d.lineTo(w, h / 2);
    ctx2d.stroke();

    if (masterAnalyser && scopeData && audioCtx && audioCtx.state === 'running') {
      masterAnalyser.getByteTimeDomainData(scopeData);
      let peak = 0;
      for (let i = 0; i < scopeData.length; i++) {
        const amp = Math.abs((scopeData[i] - 128) / 128);
        if (amp > peak) peak = amp;
      }

      const grad = ctx2d.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#00f0ff');
      grad.addColorStop(0.55, peak > 0.72 ? '#ff5500' : '#00f0ff');
      grad.addColorStop(1, '#a855f7');

      ctx2d.strokeStyle = grad;
      ctx2d.lineWidth = peak > 0.04 ? 2.2 : 1.4;
      ctx2d.beginPath();

      const sliceW = w / scopeData.length;
      for (let i = 0; i < scopeData.length; i++) {
        const v = (scopeData[i] - 128) / 128;
        const y = (h / 2) + v * (h * 0.44);
        const x = i * sliceW;
        if (i === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
      }
      ctx2d.stroke();
    } else {
      ctx2d.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx2d.lineWidth = 1.5;
      ctx2d.beginPath();
      ctx2d.moveTo(0, h / 2);
      ctx2d.lineTo(w, h / 2);
      ctx2d.stroke();
    }

    requestAnimationFrame(drawScope);
  }
  drawScope();
}

function captureModulePreset(mod) {
  if (mod === 'uptempo') return getUptempoParams();
  if (mod === 'bass') return getBassParams();
  return getHardtekkParams();
}

function applyModulePreset(mod, params) {
  if (!params || typeof params !== 'object') return;
  if (mod === 'uptempo') {
    if (params.mode && UPTEMPO_PRESETS[params.mode]) setUptempoMode(params.mode);
    if (params.startHz !== undefined) setControlValue('up_start', 'num-up-start', params.startHz);
    if (params.endHz !== undefined) setControlValue('up_end', 'num-up-end', params.endHz);
    if (params.zaag !== undefined) setControlValue('up_zaag', 'num-up-zaag', params.zaag);
    if (params.snapMs !== undefined) setControlValue('up_snap', 'num-up-snap', params.snapMs);
    if (params.drive !== undefined) setControlValue('up_drive', 'num-up-drive', params.drive);
    if (params.duration !== undefined) setControlValue('up_dauer', 'num-up-dauer', params.duration);
    playUptempoKick();
  } else if (mod === 'bass') {
    if (params.mode && BASS_PRESETS[params.mode]) setBassMode(params.mode);
    if (params.freq !== undefined) setControlValue('bass_freq', 'num-bass-freq', params.freq);
    if (params.sub !== undefined) setControlValue('bass_sub', 'num-bass-sub', params.sub);
    if (params.cutoff !== undefined) setControlValue('bass_cutoff', 'num-bass-cutoff', params.cutoff);
    if (params.res !== undefined) setControlValue('bass_res', 'num-bass-res', params.res);
    if (params.drive !== undefined) setControlValue('bass_drive', 'num-bass-drive', params.drive);
    if (params.duration !== undefined) setControlValue('bass_dauer', 'num-bass-dauer', params.duration);
    playBass();
  } else {
    if (params.mode && KICK_PRESETS[params.mode]) setKickMode(params.mode);
    if (params.startHz !== undefined) setControlValue('start_hz', 'num-start', params.startHz);
    if (params.endHz !== undefined) setControlValue('end_hz', 'num-end', params.endHz);
    if (params.punch !== undefined) setControlValue('kick_punch', 'num-punch', params.punch);
    if (params.tail !== undefined) setControlValue('kick_tail', 'num-tail', params.tail);
    if (params.crunch !== undefined) setControlValue('kick_crunch', 'num-crunch', params.crunch);
    if (params.drive !== undefined) setControlValue('drive', 'num-drive', params.drive);
    if (params.duration !== undefined) setControlValue('dauer', 'num-dauer', params.duration);
    playHardtekkKick();
  }
}

const PRODUCER_PREFIXES = [
  'DARK', 'ZAAG', 'KRAKEN', 'SUB', 'NEON', 'TOXIC', 'CYBER', 'ACID',
  'RAVE', 'HYPER', 'HARD', 'DISTORT', 'SYNTH', 'RAW', 'NIGHT', 'CORE',
  'SHADOW', 'VOLT', 'PSYCHO', 'OSTBLOCK'
];

const PRODUCER_SUFFIXES = [
  'TEKK', 'KRAFT', 'LORD', 'DEMON', 'PULSE', 'VORTEX', 'BREAKER', 'REAPER',
  'SYSTEM', 'BEATS', 'NOISE', 'SHOCK', 'X', '07', '230', '909', 'LAB', 'CORE'
];

function normalizeNameForSpeech(raw) {
  const clean = String(raw || '').trim() || 'Sventekk';
  // Wandelt ALL-CAPS (z.B. "KRAKEN TEKK") in normale Schreibweise um, damit HD-Stimmen nicht buchstabieren
  return clean.replace(/\b[A-ZÄÖÜ]{3,}\b/g, (word) =>
    word.charAt(0) + word.slice(1).toLowerCase()
  );
}

function generateProducerName() {
  const pre = PRODUCER_PREFIXES[Math.floor(Math.random() * PRODUCER_PREFIXES.length)];
  let suf = PRODUCER_SUFFIXES[Math.floor(Math.random() * PRODUCER_SUFFIXES.length)];
  if (pre === suf) suf = 'TEKK';
  const joined = normalizeNameForSpeech(Math.random() > 0.45 ? `${pre}${suf}` : `${pre} ${suf}`);
  const input = document.getElementById('tag-name-input');
  if (input) input.value = joined;
  syncProducerTagText();
  setStatus(`PRODUCER NAME: ${joined.toUpperCase()}`);
}

function buildPhraseFromName() {
  const name = normalizeNameForSpeech(document.getElementById('tag-name-input')?.value);
  const phrase = document.getElementById('tag-phrase')?.value || 'achtung_de';
  if (phrase === 'only') return name;
  if (phrase === 'achtung_de') return `Achtung, das ist ${name}!`;
  if (phrase === 'du_hoerst_de') return `Du hörst ${name} im Mix!`;
  if (phrase === 'willkommen_de') return `Willkommen bei ${name} Audio!`;
  if (phrase === 'in_the_mix') return `${name} in the mix!`;
  if (phrase === 'welcome') return `Welcome to ${name} Hardtekk!`;
  return `This is ${name}!`;
}

function syncProducerTagText() {
  const fullEl = document.getElementById('tag-full-text');
  if (fullEl) {
    fullEl.value = buildPhraseFromName();
  }
}

function getProducerTagText() {
  const fullVal = (document.getElementById('tag-full-text')?.value || '').trim();
  if (fullVal) return normalizeNameForSpeech(fullVal);
  return buildPhraseFromName();
}

function getVoiceQualityScore(v) {
  const name = String(v.name || '');
  const lang = String(v.lang || '');
  const isDe = /^de/i.test(lang);
  const isEn = /^en/i.test(lang);
  const isNatural = /natural|neural|online|wavenet|multilingual/i.test(name);
  const isGoogle = /google/i.test(name);
  const isEnhanced = /premium|enhanced|siri|markus|anna|daniel|samantha|florian|seraphina|conrad|killian|katja|guy|aria|andrew|brian/i.test(name);

  let tier = 30;
  if (isNatural) tier = 0;
  else if (isGoogle) tier = 10;
  else if (isEnhanced) tier = 20;

  let langBias = 8;
  if (isDe) langBias = 0;
  else if (isEn) langBias = 2;

  return tier + langBias;
}

function formatVoiceLabel(v) {
  const raw = String(v.name || 'Voice');
  const isHD = /natural|neural|online|google|premium|enhanced|multilingual/i.test(raw);
  const cleanName = raw
    .replace(/^Microsoft\s+/i, '')
    .replace(/\s+Online\s*\(Natural\)/i, '')
    .replace(/\s*-\s*German\s*\([^)]+\)/i, '')
    .replace(/\s*-\s*English\s*\([^)]+\)/i, '')
    .trim()
    .slice(0, 24);
  return `${isHD ? '★ HD · ' : ''}${cleanName} (${v.lang})`;
}

function initVoiceList() {
  const sel = document.getElementById('tag-voice-select');
  if (!sel || !('speechSynthesis' in window)) return;

  const populate = () => {
    const all = window.speechSynthesis.getVoices() || [];
    if (!all.length) return;

    // Bevorzugt hochwertige DE & EN Stimmen ganz oben
    const filtered = all.filter(v => /^(de|en)/i.test(v.lang));
    const pool = filtered.length ? filtered : all;

    availableVoices = pool.slice().sort((a, b) => {
      const diff = getVoiceQualityScore(a) - getVoiceQualityScore(b);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });

    const prevName = sel.dataset.selectedVoiceName || '';
    sel.innerHTML = '';
    availableVoices.forEach((v, idx) => {
      const opt = document.createElement('option');
      opt.value = String(idx);
      opt.textContent = formatVoiceLabel(v);
      sel.appendChild(opt);
    });

    if (prevName) {
      const matchIdx = availableVoices.findIndex(v => v.name === prevName);
      if (matchIdx >= 0) sel.value = String(matchIdx);
    } else {
      sel.value = '0';
    }
  };

  sel.addEventListener('change', () => {
    const v = availableVoices[parseInt(sel.value, 10)];
    if (v) sel.dataset.selectedVoiceName = v.name;
  });

  populate();
  setTimeout(populate, 400);
  setTimeout(populate, 1200);
  window.speechSynthesis.onvoiceschanged = populate;
}

function triggerTagImpact() {
  try {
    const ctx = getAudioCtx();
    const dest = getMasterOut();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.2);
    g.gain.setValueAtTime(0.24, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.26);
  } catch (e) {}
}

function stopSpeechKeepAlive() {
  if (speechKeepAliveTimer) {
    clearInterval(speechKeepAliveTimer);
    speechKeepAliveTimer = null;
  }
  if (speechStartTimer) {
    clearTimeout(speechStartTimer);
    speechStartTimer = null;
  }
}

function speakProducerTag() {
  if (!('speechSynthesis' in window)) {
    alert('Sprachausgabe wird von diesem Browser nicht unterstützt.');
    return;
  }

  if (!availableVoices.length) {
    initVoiceList();
  }

  const text = getProducerTagText();
  const pitch = parseFloat(document.getElementById('tag_pitch')?.value || '1.0');
  const rate = parseFloat(document.getElementById('tag_speed')?.value || '1.0');
  const voiceIdx = parseInt(document.getElementById('tag-voice-select')?.value || '0', 10);
  const statusEl = document.getElementById('tag-rec-status');

  stopSpeechKeepAlive();

  const needsCancel = window.speechSynthesis.speaking || window.speechSynthesis.pending;
  if (needsCancel) {
    window.speechSynthesis.cancel();
  }

  triggerTagImpact();

  const startDelay = needsCancel ? 120 : 60;
  speechStartTimer = setTimeout(() => {
    const utter = new SpeechSynthesisUtterance(text);
    activeUtterance = utter; // Verhindert Chrome-GC-Abbruch mitten im Satz!

    utter.volume = 1.0;
    utter.pitch = Math.max(0.5, Math.min(1.6, pitch));
    utter.rate = Math.max(0.6, Math.min(1.5, rate));

    const chosen = availableVoices[voiceIdx];
    if (chosen) {
      utter.voice = chosen;
      utter.lang = chosen.lang;
    } else {
      utter.lang = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 'en-US' : 'de-DE';
    }

    utter.onstart = () => {
      if (statusEl) {
        statusEl.style.color = 'var(--cyan)';
        statusEl.textContent = `🔊 "${text}"`;
      }
      // Chrome-Workaround: verhindert stummes Pausieren bei längeren Sätzen
      speechKeepAliveTimer = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          stopSpeechKeepAlive();
          return;
        }
        window.speechSynthesis.resume();
      }, 3500);
    };

    utter.onend = () => {
      stopSpeechKeepAlive();
      activeUtterance = null;
      setStatus('VOICE TAG FERTIG');
    };

    utter.onerror = (ev) => {
      stopSpeechKeepAlive();
      activeUtterance = null;
      if (ev && ev.error !== 'interrupted' && ev.error !== 'canceled' && statusEl) {
        statusEl.style.color = '#fca5a5';
        statusEl.textContent = `Voice-Fehler (${ev.error}) – andere Stimme wählen.`;
      }
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utter);
    setStatus(`VOICE TAG: ${text.toUpperCase().slice(0, 32)}`);
  }, startDelay);
}

async function recordVoiceTag() {
  if (!requireLoginOnly()) return;
  if (isRecordingTag) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
    alert('Mikrofon-Aufnahme wird von diesem Browser nicht unterstützt.');
    return;
  }

  const recBtn = document.getElementById('btn-tag-rec');
  const statusEl = document.getElementById('tag-rec-status');
  isRecordingTag = true;
  if (recBtn) {
    recBtn.disabled = true;
    recBtn.textContent = '● 3s...';
  }
  if (statusEl) {
    statusEl.style.color = '#ff8c52';
    statusEl.textContent = (typeof t === 'function') ? t('tag_rec_active') : 'Aufnahme läuft (3s) – sprich deinen Namen!';
  }

  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };

    const recordedBlob = await new Promise((resolve, reject) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
      recorder.onerror = (ev) => reject(ev.error || new Error('Recording error'));
      recorder.start();
      setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop();
      }, 3000);
    });

    const arrayBuf = await recordedBlob.arrayBuffer();
    const ctx = await ensureAudioReady();
    recordedTagBuffer = await ctx.decodeAudioData(arrayBuf.slice(0));

    if (statusEl) {
      statusEl.style.color = '#6ee7b7';
      statusEl.textContent = (typeof t === 'function') ? t('tag_rec_ready') : '✔ Aufnahme bereit – jetzt mit Rave-FX anhören oder als .WAV laden!';
    }
    const playBtn = document.getElementById('btn-tag-play-rec');
    const dlBtn = document.getElementById('btn-tag-dl');
    if (playBtn) playBtn.disabled = false;
    if (dlBtn) dlBtn.disabled = false;
    setStatus('VOICE TAG RECORDED');
  } catch (err) {
    if (statusEl) {
      statusEl.style.color = '#fca5a5';
      statusEl.textContent = 'Mic: ' + (err && err.message ? err.message : err);
    }
  } finally {
    if (stream) {
      stream.getTracks().forEach(tr => { try { tr.stop(); } catch (e) {} });
    }
    isRecordingTag = false;
    if (recBtn) {
      recBtn.disabled = false;
      recBtn.textContent = (typeof t === 'function') ? t('tag_btn_rec') : '🎙 3s Aufnehmen';
    }
  }
}

function renderVoiceTagChain(ctx, dest, buffer, startTime) {
  const pitchVal = parseFloat(document.getElementById('tag_pitch')?.value || '0.85');
  const driveVal = parseFloat(document.getElementById('tag_drive')?.value || '6');

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.setValueAtTime(Math.max(0.55, Math.min(1.6, pitchVal)), startTime);

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(110, startTime);

  const presence = ctx.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.setValueAtTime(2400, startTime);
  presence.gain.setValueAtTime(6.5, startTime);

  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(driveVal, driveVal > 12 ? 'gabber' : 'soft');
  shaper.oversample = '2x';

  const echo = createEchoChain(ctx, dest, 0.24);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(1.15, startTime);

  src.connect(hp);
  hp.connect(presence);
  presence.connect(shaper);
  shaper.connect(gain);
  gain.connect(echo.input);

  src.start(startTime);
}

async function playRecordedTag() {
  if (!requireLoginOnly()) return;
  if (!recordedTagBuffer) return;
  const ctx = await ensureAudioReady();
  renderVoiceTagChain(ctx, getMasterOut(), recordedTagBuffer, ctx.currentTime + 0.02);
  setStatus('PLAYING VOICE TAG + FX');
}

function downloadVoiceTag() {
  if (!recordedTagBuffer) {
    alert((typeof t === 'function') ? t('tag_need_rec') : 'Bitte zuerst über "🎙 3s Aufnehmen" deine Stimme einsprechen.');
    return;
  }
  const pitchVal = Math.max(0.55, Math.min(1.6, parseFloat(document.getElementById('tag_pitch')?.value || '0.85')));
  const rawName = (document.getElementById('tag-name-input')?.value || 'TAG').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 7) || 'TAG';
  const dur = (recordedTagBuffer.duration / pitchVal) + 0.75;
  renderAndDownload(dur, `TAG_${rawName}.wav`, (ctx, dest) => {
    renderVoiceTagChain(ctx, dest, recordedTagBuffer, 0);
  });
}

/* =========================================================================
   8. HARDTEKK KICK LAB (DISTORTION NUR FÜR KICKS)
   ========================================================================= */
const LAB_PRESETS = {
  tekk:    { label: 'TEKK PUNCH',     tag: 'TEKK', base: 'sine',     start: 260, end: 48, dauer: 0.42, sat: 0.55, clip: 0.50, fold: 0.15, crush: 0.00, sub: 0.40, mid: 5, bite: 4 },
  schranz: { label: 'SCHRANZ RUMBLE', tag: 'SCHR', base: 'triangle', start: 220, end: 44, dauer: 0.55, sat: 0.70, clip: 0.60, fold: 0.25, crush: 0.10, sub: 0.50, mid: 7, bite: 3 },
  gabber:  { label: 'GABBER CRUNCH',  tag: 'GAB',  base: 'triangle', start: 420, end: 52, dauer: 0.38, sat: 0.85, clip: 0.85, fold: 0.10, crush: 0.25, sub: 0.30, mid: 3, bite: 6 },
  terror:  { label: 'TERROR CLIP',    tag: 'TER',  base: 'click',    start: 520, end: 56, dauer: 0.30, sat: 0.90, clip: 0.95, fold: 0.55, crush: 0.45, sub: 0.25, mid: 4, bite: 9 }
};

const LAB_CONTROLS = [
  ['lab_start', 'num-lab-start', 'start'],
  ['lab_end', 'num-lab-end', 'end'],
  ['lab_dauer', 'num-lab-dauer', 'dauer'],
  ['lab_sat', 'num-lab-sat', 'sat'],
  ['lab_clip', 'num-lab-clip', 'clip'],
  ['lab_fold', 'num-lab-fold', 'fold'],
  ['lab_crush', 'num-lab-crush', 'crush'],
  ['lab_sub', 'num-lab-sub', 'sub'],
  ['lab_mid', 'num-lab-mid', 'mid'],
  ['lab_bite', 'num-lab-bite', 'bite']
];

let activeLabPreset = 'tekk';
let activeLabBase = 'sine';
let useLabKickInSeq = false;
let labPreviewTimer = null;
let labPreviewSeq = 0;
const labCurveCache = new Map();

function makeLabCurve(kind, amount) {
  const key = `${kind}:${amount.toFixed(2)}`;
  if (labCurveCache.has(key)) return labCurveCache.get(key);

  const n = 8192;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / (n - 1) - 1;
    let y;
    if (kind === 'sat') {
      const k = 1 + amount * 9;
      y = Math.tanh(x * k) / Math.tanh(k);
    } else if (kind === 'clip') {
      const g = 1 + amount * 7;
      const thr = 1 - amount * 0.45;
      y = Math.max(-thr, Math.min(thr, x * g)) / thr;
    } else if (kind === 'fold') {
      const g = 1 + amount * 3.2;
      y = Math.sin(x * g * Math.PI / 2);
    } else {
      const bits = 16 - amount * 13;
      const lv = Math.pow(2, bits) / 2;
      y = Math.round(x * lv) / lv;
    }
    curve[i] = Math.max(-1, Math.min(1, y));
  }
  labCurveCache.set(key, curve);
  return curve;
}

function getLabParams() {
  const num = (id, def) => {
    const v = parseFloat(document.getElementById(id)?.value);
    return Number.isNaN(v) ? def : v;
  };
  return {
    base: activeLabBase,
    tag: activeLabPreset === 'custom' ? 'LAB' : (LAB_PRESETS[activeLabPreset]?.tag || 'LAB'),
    startHz: num('lab_start', 260),
    endHz: num('lab_end', 48),
    duration: num('lab_dauer', 0.42),
    sat: num('lab_sat', 0.55),
    clip: num('lab_clip', 0.5),
    fold: num('lab_fold', 0.15),
    crush: num('lab_crush', 0),
    sub: num('lab_sub', 0.4),
    midCut: num('lab_mid', 5),
    bite: num('lab_bite', 4)
  };
}

function triggerLabKick(ctx, dest, params, startTime, trackIdx = null) {
  const {
    base = 'sine', startHz = 260, endHz = 48, duration = 0.42,
    sat = 0.55, clip = 0.5, fold = 0.15, crush = 0,
    sub = 0.4, midCut = 5, bite = 4
  } = params;

  const t0 = Math.max(0, startTime);
  const dur = Math.max(0.15, duration);
  const dropT = base === 'triangle' ? 0.05 : base === 'click' ? 0.04 : 0.07;
  const stopAt = t0 + dur + 0.03;

  // 1. Basis-Kick (Pitch-Drop)
  const osc = ctx.createOscillator();
  osc.type = base === 'triangle' ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(startHz, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(30, endHz * 1.15), t0 + dropT);
  osc.frequency.exponentialRampToValueAtTime(Math.max(28, endHz * 0.9), t0 + dur);

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0.0001, t0);
  bodyGain.gain.linearRampToValueAtTime(1.0, t0 + 0.002);
  bodyGain.gain.setValueAtTime(0.92, t0 + Math.min(dur * 0.55, 0.26));
  bodyGain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);

  const preBus = ctx.createGain();
  osc.connect(bodyGain);
  bodyGain.connect(preBus);

  let clickSrc = null;
  if (base === 'click') {
    const len = Math.max(1, Math.floor(ctx.sampleRate * 0.012));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    clickSrc = ctx.createBufferSource();
    clickSrc.buffer = buf;
    const clickHp = ctx.createBiquadFilter();
    clickHp.type = 'highpass';
    clickHp.frequency.setValueAtTime(1800, t0);
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.55, t0);
    clickSrc.connect(clickHp);
    clickHp.connect(clickGain);
    clickGain.connect(preBus);
  }

  // 2. Distortion-Kette (Saturation -> Hard-Clip -> Wavefold -> Bitcrush)
  let node = preBus;
  const chain = (next) => { node.connect(next); node = next; };
  const addShaper = (kind, amount, oversample) => {
    if (amount <= 0.02) return;
    const sh = ctx.createWaveShaper();
    sh.curve = makeLabCurve(kind, amount);
    sh.oversample = oversample;
    chain(sh);
  };
  addShaper('sat', sat, '4x');
  addShaper('clip', clip, '4x');
  addShaper('fold', fold, '4x');
  addShaper('crush', crush, 'none');

  // 3. Entzerrung nach der Verzerrung
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(28, t0);
  chain(hp);

  const mid = ctx.createBiquadFilter();
  mid.type = 'peaking';
  mid.frequency.setValueAtTime(380, t0);
  mid.Q.setValueAtTime(1.1, t0);
  mid.gain.setValueAtTime(-Math.abs(midCut), t0);
  chain(mid);

  const biteEq = ctx.createBiquadFilter();
  biteEq.type = 'peaking';
  biteEq.frequency.setValueAtTime(2400, t0);
  biteEq.Q.setValueAtTime(1.2, t0);
  biteEq.gain.setValueAtTime(Math.abs(bite), t0);
  chain(biteEq);

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(11000, t0);
  chain(lp);

  const outGain = ctx.createGain();
  outGain.gain.setValueAtTime(0.85, t0);
  outGain.gain.setValueAtTime(0.85, t0 + Math.max(0.05, dur - 0.03));
  outGain.gain.linearRampToValueAtTime(0.0001, t0 + dur);
  chain(outGain);
  outGain.connect(dest);

  // 4. Sauberer Sub-Layer (unverzerrt, für Druck)
  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(Math.max(30, Math.min(90, endHz)), t0);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.0001, t0);
  subGain.gain.linearRampToValueAtTime(Math.max(0.0001, sub * 0.75), t0 + 0.012);
  subGain.gain.setValueAtTime(Math.max(0.0001, sub * 0.7), t0 + dur * 0.65);
  subGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  subOsc.connect(subGain);
  subGain.connect(dest);

  osc.start(t0);
  subOsc.start(t0);
  if (clickSrc) clickSrc.start(t0);
  osc.stop(stopAt);
  subOsc.stop(stopAt);
  if (clickSrc) clickSrc.stop(t0 + 0.02);

  registerVoice(trackIdx, () => {
    try {
      outGain.gain.cancelScheduledValues(ctx.currentTime);
      outGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      subGain.gain.cancelScheduledValues(ctx.currentTime);
      subGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      osc.stop();
      subOsc.stop();
      if (clickSrc) clickSrc.stop();
    } catch (e) {}
  });
}

function setLabPreset(key, silent = false) {
  const p = LAB_PRESETS[key];
  if (!p) return;
  activeLabPreset = key;
  activeLabBase = p.base;
  LAB_CONTROLS.forEach(([r, n, k]) => setControlValue(r, n, p[k]));

  document.querySelectorAll('.lab-preset-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.labpreset === key);
  });
  document.querySelectorAll('.lab-base-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.labbase === p.base);
  });
  const badge = document.getElementById('lab-badge');
  if (badge) badge.innerText = p.label;

  scheduleLabPreview();
  if (!silent) setStatus(`KICK LAB: ${p.label}`);
}

function setLabBase(base) {
  activeLabBase = base;
  document.querySelectorAll('.lab-base-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.labbase === base);
  });
  markLabCustom();
}

function markLabCustom() {
  if (activeLabPreset !== 'custom') {
    activeLabPreset = 'custom';
    document.querySelectorAll('.lab-preset-btn').forEach(b => b.classList.remove('active'));
    const badge = document.getElementById('lab-badge');
    if (badge) badge.innerText = 'CUSTOM';
  }
  scheduleLabPreview();
}

function scheduleLabPreview() {
  if (labPreviewTimer) clearTimeout(labPreviewTimer);
  labPreviewTimer = setTimeout(drawLabPreview, 90);
}

async function drawLabPreview() {
  const canvas = document.getElementById('lab-scope');
  if (!canvas || typeof OfflineAudioContext === 'undefined') return;
  const c2 = canvas.getContext('2d');
  if (!c2) return;

  const mySeq = ++labPreviewSeq;
  try {
    const p = getLabParams();
    const sr = 32000;
    const off = new OfflineAudioContext(1, Math.ceil(sr * (p.duration + 0.05)), sr);
    triggerLabKick(off, off.destination, p, 0);
    const buffer = await off.startRendering();
    if (mySeq !== labPreviewSeq) return;

    const data = buffer.getChannelData(0);
    const w = canvas.width;
    const h = canvas.height;
    c2.fillStyle = '#07070b';
    c2.fillRect(0, 0, w, h);
    c2.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    c2.lineWidth = 1;
    c2.beginPath();
    c2.moveTo(0, h / 2);
    c2.lineTo(w, h / 2);
    c2.stroke();

    const chunk = Math.max(1, Math.floor(data.length / w));
    for (let x = 0; x < w; x++) {
      let mn = 0;
      let mx = 0;
      const start = x * chunk;
      for (let i = 0; i < chunk && start + i < data.length; i++) {
        const v = data[start + i];
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
      const hot = Math.max(Math.abs(mn), Math.abs(mx)) > 0.8;
      c2.strokeStyle = hot ? '#ff8c52' : '#00f0ff';
      c2.beginPath();
      c2.moveTo(x + 0.5, h / 2 - mx * (h * 0.46));
      c2.lineTo(x + 0.5, h / 2 - mn * (h * 0.46));
      c2.stroke();
    }
  } catch (e) {}
}

async function playLabKick() {
  if (!requireLoginOnly()) return;
  const ctx = await ensureAudioReady();
  const p = getLabParams();
  triggerLabKick(ctx, getMasterOut(), p, ctx.currentTime + 0.01, 0);
  setStatus(`PLAYING: KICK LAB ${p.tag}`);
}

function downloadLabKick() {
  const p = getLabParams();
  renderAndDownload(p.duration + 0.12, `KL_${p.tag}_${Math.round(p.startHz)}.wav`,
    (ctx, dest) => triggerLabKick(ctx, dest, p, 0));
}

function updateLabSeqButton() {
  const btn = document.getElementById('btn-lab-seq');
  if (!btn) return;
  btn.className = useLabKickInSeq ? 'btn btn-orange' : 'btn btn-ghost';
  btn.innerText = (typeof t === 'function')
    ? t(useLabKickInSeq ? 'lab_seq_on' : 'lab_seq_off')
    : (useLabKickInSeq ? 'Kick im Sequenzer: AN' : 'Kick im Sequenzer: AUS');
}

function toggleLabSeq() {
  useLabKickInSeq = !useLabKickInSeq;
  updateLabSeqButton();
  setStatus(useLabKickInSeq ? 'SEQUENZER-KICK: KICK LAB' : 'SEQUENZER-KICK: HARDTEKK KICK');
}

function initLabKick() {
  setLabPreset('tekk', true);
  updateLabSeqButton();
}

applyVersionTags();
initAllControlBindings();
buildMelodyNotes();
updateMelodyDurationUI();
renderSequencerUI();
renderSampleLibrary();
initFixNotesBox();
initVoiceList();
initOscilloscope();
initLabKick();
updateDownloadCounterUI();
if (typeof initLanguage === 'function') initLanguage();
loadSession();
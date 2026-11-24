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
  piep:   { label: 'PIEP KICK',   start: 880,  end: 64, zaag: 0.20, snap: 24, drive: 18, dauer: 0.26 },
  zaag:   { label: 'ZAAG KICK',   start: 640,  end: 68, zaag: 0.72, snap: 42, drive: 24, dauer: 0.32 },
  terror: { label: 'TERROR 230+', start: 1080, end: 78, zaag: 0.95, snap: 18, drive: 34, dauer: 0.24 }
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

const trackVoiceModes = ['mono', 'mono', 'poly', 'mono'];
const activeNodesByTrack = [[], [], [], []];

const sequenceGrid = [
  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0],
  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,1,1,1],
  [1,0,1,1, 0,1,0,1, 1,0,1,1, 0,1,1,0]
];

const presetSamples = [
  { title: 'SVENTEKK_Hard_Kick_180BPM.wav', type: 'Hard Kick', generator: 'hardtekk' },
  { title: 'SVENTEKK_Uptempo_Zaag_210.wav', type: 'Zaag Kick', generator: 'uptempo_zaag' },
  { title: 'SVENTEKK_Uptempo_Piep_220.wav', type: 'Piep Kick', generator: 'uptempo_piep' },
  { title: 'SVENTEKK_Industrial_Rumble.wav', type: 'Industrial', generator: 'industrial' },
  { title: 'SVENTEKK_Rave_Phrase_4Bars.wav', type: 'Melodie', generator: 'melody' }
];

let audioCtx = null;
let masterLimiter = null;
let sharedEchoBus = null;
let isPlaying = false;
let currentStep = 0;
let seqMelodyStepIndex = 0;
let stepTimer = null;
let melodyLoopTimer = null;
let melodySessionId = 0;
let activeKickMode = 'hard';
let activeUptempoMode = 'zaag';
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

function getSharedEchoBus(ctx, dest, stepSec) {
  if (!sharedEchoBus || sharedEchoBus.ctx !== ctx) {
    const input = ctx.createGain();
    const delay = ctx.createDelay(1.0);
    const feedback = ctx.createGain();
    const wet = ctx.createGain();

    delay.delayTime.setValueAtTime(Math.min(0.75, stepSec * 0.75), ctx.currentTime);
    feedback.gain.setValueAtTime(0.25, ctx.currentTime);
    wet.gain.setValueAtTime(0.22, ctx.currentTime);

    input.connect(dest);
    input.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(dest);

    sharedEchoBus = { ctx, input, delay };
  } else {
    sharedEchoBus.delay.delayTime.setValueAtTime(Math.min(0.75, stepSec * 0.75), ctx.currentTime);
  }
  return sharedEchoBus.input;
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

  bindSliderAndNumber('snare_tone', 'num-snare-tone');
  bindSliderAndNumber('snare_len', 'num-snare-len');
  bindSliderAndNumber('snare_filter', 'num-snare-filter');
  bindSliderAndNumber('snare_drive', 'num-snare-drive');
  bindSliderAndNumber('hat_hits', 'num-hat-hits');

  bindSliderAndNumber('melody_gate', 'num-mel-gate');
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

  document.querySelectorAll('.style-btn:not(.up-style):not(.snare-style)').forEach(btn => {
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
   3. SOUND-SYNTHESE (KICKS, UPTEMPO, DRUMS, MELODIE)
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
      const folded = Math.sin(x * Math.PI * 1.25) * 0.55 + Math.tanh(x * (k / 11)) * 0.75;
      curve[i] = Math.max(-0.94, Math.min(0.94, folded));
    } else if (mode === 'zaag') {
      const folded = Math.sin(x * Math.PI * 1.8) * 0.65 + Math.tanh(x * (k / 9)) * 0.80;
      curve[i] = Math.max(-0.96, Math.min(0.96, folded));
    } else if (mode === 'terror') {
      const hardClip = Math.max(-0.82, Math.min(0.82, x * (1 + k / 8)));
      curve[i] = Math.sin(hardClip * 2.8) * 0.95;
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

function stopMelodyPreview() {
  melodySessionId += 1;
  if (melodyLoopTimer) {
    clearTimeout(melodyLoopTimer);
    melodyLoopTimer = null;
  }
  while (activeNodesByTrack[3].length > 0) {
    const fn = activeNodesByTrack[3].pop();
    try { fn(); } catch (e) {}
  }
  setStatus('MELODIE GESTOPPT');
}

function triggerLeadNote(ctx, dest, freq, dur, startTime, trackIdx = null) {
  const synthType = document.getElementById('melody_synth')?.value || 'supersaw';
  const cutoff = parseFloat(document.getElementById('mel_cutoff')?.value || 3600);
  const detune = parseFloat(document.getElementById('mel_detune')?.value || 22);
  const rel = parseFloat(document.getElementById('mel_release')?.value || 0.25);
  const t0 = Math.max(0, startTime);
  const totalEnd = t0 + dur + rel;

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
    filter.frequency.exponentialRampToValueAtTime(320, totalEnd);
  } else if (synthType === 'screech') {
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc3.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq * 1.02, t0);
    osc1.frequency.exponentialRampToValueAtTime(freq, t0 + dur * 0.5);
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
    filter.frequency.exponentialRampToValueAtTime(400, totalEnd);
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

  gain.gain.setValueAtTime(0.001, t0);
  gain.gain.linearRampToValueAtTime(0.38, t0 + 0.002);
  gain.gain.setValueAtTime(0.32, t0 + Math.max(0.01, dur * 0.85));
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
    zaag = 0.65,
    snapMs = 42,
    drive = 22,
    duration = 0.32
  } = params;

  const snapSec = Math.max(0.012, snapMs / 1000);
  const piepFactor = mode === 'piep' ? 1.25 : mode === 'terror' ? 1.35 : 1.0;

  const tokOsc = ctx.createOscillator();
  tokOsc.type = mode === 'terror' ? 'square' : 'sine';
  tokOsc.frequency.setValueAtTime(startHz * piepFactor, startTime);
  tokOsc.frequency.exponentialRampToValueAtTime(Math.max(42, endHz * 1.15), startTime + snapSec);
  tokOsc.frequency.exponentialRampToValueAtTime(Math.max(36, endHz * 0.92), startTime + duration);

  const zaagOsc = ctx.createOscillator();
  zaagOsc.type = 'sawtooth';
  const zaagStart = mode === 'piep' ? startHz * 0.75 : startHz * 0.5;
  zaagOsc.frequency.setValueAtTime(zaagStart, startTime);
  zaagOsc.frequency.exponentialRampToValueAtTime(Math.max(42, endHz), startTime + snapSec * 1.15);

  const zaagFilter = ctx.createBiquadFilter();
  zaagFilter.type = mode === 'piep' ? 'peaking' : 'bandpass';
  zaagFilter.frequency.setValueAtTime(mode === 'piep' ? 1750 : mode === 'terror' ? 1500 : 1150, startTime);
  zaagFilter.Q.setValueAtTime(mode === 'piep' ? 3.2 : 1.8, startTime);

  const zaagGain = ctx.createGain();
  const zaagLevel = mode === 'piep' ? zaag * 0.45 : zaag * 0.78;
  zaagGain.gain.setValueAtTime(Math.max(0.001, zaagLevel), startTime);
  zaagGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.92);

  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(drive, mode);
  shaper.oversample = '4x';

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, startTime);
  masterGain.gain.linearRampToValueAtTime(0.96, startTime + 0.003);
  masterGain.gain.setValueAtTime(0.92, startTime + Math.max(0.05, duration * 0.62));
  masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  tokOsc.connect(shaper);
  zaagOsc.connect(zaagFilter);
  zaagFilter.connect(zaagGain);
  zaagGain.connect(shaper);
  shaper.connect(masterGain);
  masterGain.connect(dest);

  tokOsc.start(startTime);
  zaagOsc.start(startTime);
  tokOsc.stop(startTime + duration + 0.02);
  zaagOsc.stop(startTime + duration + 0.02);

  registerVoice(trackIdx, () => {
    try {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      tokOsc.stop();
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
    const echoBus = getSharedEchoBus(ctx, dest, stepSec);
    notes.forEach((f, idx) => triggerLeadNote(ctx, echoBus, f, stepSec * gate, idx * stepSec));
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
  const snareParams = getSnareParams();

  const totalDur = totalSteps * stepSec + Math.max(0.8, rel + 0.6);

  renderAndDownload(totalDur, `SVENTEKK_Full_Loop_${bars}Bars_${bpm}BPM.wav`, (ctx, dest) => {
    const echoBus = getSharedEchoBus(ctx, dest, stepSec);

    for (let s = 0; s < totalSteps; s++) {
      const t = s * stepSec;
      const laneStep = s % 16;

      if (sequenceGrid[0][laneStep]) {
        if (bpm >= 200) triggerUptempoKick(ctx, dest, upParams, t);
        else triggerKick(ctx, dest, hardParams, t);
      }
      if (sequenceGrid[1][laneStep]) {
        triggerSnare(ctx, dest, snareParams, t);
      }
      if (sequenceGrid[2][laneStep]) {
        triggerHiHat(ctx, dest, t, laneStep % 4 === 2);
      }
      if (sequenceGrid[3][laneStep] && notes.length > 0) {
        const freq = notes[s % notes.length];
        triggerLeadNote(ctx, echoBus, freq, stepSec * 1.4 * gate, t);
      }
    }
  });
}

function playHardtekkKick() {
  if (!requireLoginOnly()) return;
  const ctx = getAudioCtx();
  triggerKick(ctx, getMasterOut(), getHardtekkParams(), ctx.currentTime, 0);
  setStatus(`PLAYING: ${KICK_PRESETS[activeKickMode].label}`);
}

function playHatRoll() {
  if (!requireLoginOnly()) return;
  const ctx = getAudioCtx();
  const hits = parseInt(document.getElementById('hat_hits').value, 10);
  const bpm = parseFloat(document.getElementById('bpm').value);
  const stepSec = (60 / bpm) / 4;
  for (let i = 0; i < hits; i++) {
    triggerHiHat(ctx, getMasterOut(), ctx.currentTime + i * stepSec, i === hits - 1, 2);
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
    triggerLeadNote(ctx, echoBus, notes[idx], stepSec * gate, now + idx * stepSec, 3);
  }

  setStatus(`PLAYING: ${notes.length}-NOTE RAVE PHRASE`);

  melodyLoopTimer = setTimeout(() => {
    if (sessionId === melodySessionId) {
      scheduleMelodyPass(sessionId);
    }
  }, notes.length * stepSec * 1000);
}

function playMelody() {
  if (!requireLoginOnly()) return;
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  melodySessionId += 1;
  const currentSession = melodySessionId;
  if (melodyLoopTimer) {
    clearTimeout(melodyLoopTimer);
    melodyLoopTimer = null;
  }
  scheduleMelodyPass(currentSession);
}

function playSnare() {
  if (!requireLoginOnly()) return;
  const ctx = getAudioCtx();
  const p = getSnareParams();
  triggerSnare(ctx, getMasterOut(), p, ctx.currentTime, 1);
  setStatus(`PLAYING: ${SNARE_PRESETS[activeSnareMode].label}`);
}

function playUptempoKick() {
  if (!requireLoginOnly()) return;
  const ctx = getAudioCtx();
  triggerUptempoKick(ctx, getMasterOut(), getUptempoParams(), ctx.currentTime, 0);
  setStatus(`PLAYING: ${UPTEMPO_PRESETS[activeUptempoMode].label}`);
}

function randomizeMelody() {
  const scales = Object.keys(MELODY_SCALES);
  document.getElementById('melody_pattern').value = 'random';
  document.getElementById('melody_scale').value = scales[Math.floor(Math.random() * scales.length)];
  buildMelodyNotes();
  playMelody();
}

async function renderAndDownload(durationSec, filename, renderFn) {
  if (!consumeExportCredit()) return;
  const sampleRate = 44100;
  const offlineCtx = new OfflineAudioContext(1, Math.ceil(sampleRate * durationSec), sampleRate);
  renderFn(offlineCtx, offlineCtx.destination);
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
}

/* =========================================================================
   5. SEQUENZER, SAMPLE-LIBRARY & START
   ========================================================================= */
function clearSequencer() {
  for (let t = 0; t < 4; t++) sequenceGrid[t].fill(0);
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
    setSnareMode('snare');
    sequenceGrid[0] = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0];
    sequenceGrid[1] = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1];
    sequenceGrid[2] = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,1,1,1];
    sequenceGrid[3] = [1,0,1,1, 0,1,0,1, 1,0,1,1, 0,1,1,0];
  } else {
    setControlValue('bpm', 'num-bpm', 210);
    document.getElementById('header-bpm').innerText = 210;
    setUptempoMode('zaag');
    setSnareMode('clap');
    sequenceGrid[0] = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,1,1,1];
    sequenceGrid[1] = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0];
    sequenceGrid[2] = [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,1,1,1];
    sequenceGrid[3] = [1,1,0,1, 1,0,1,0, 1,1,0,1, 1,1,1,0];
  }
  renderSequencerUI();
}

function playStepSounds(step) {
  const ctx = getAudioCtx();
  const dest = getMasterOut();
  const now = ctx.currentTime;
  const bpm = parseFloat(document.getElementById('bpm').value);
  const stepSec = (60 / bpm) / 4;
  const gate = parseFloat(document.getElementById('melody_gate')?.value || 0.95);
  const notes = getActiveMelodyFrequencies();
  const echoBus = getSharedEchoBus(ctx, dest, stepSec);

  if (sequenceGrid[0][step]) {
    if (bpm >= 200) triggerUptempoKick(ctx, dest, getUptempoParams(), now, 0);
    else triggerKick(ctx, dest, getHardtekkParams(), now, 0);
  }
  if (sequenceGrid[1][step]) {
    triggerSnare(ctx, dest, getSnareParams(), now, 1);
  }
  if (sequenceGrid[2][step]) {
    triggerHiHat(ctx, dest, now, step % 4 === 2, 2);
  }
  if (sequenceGrid[3][step] && notes.length > 0) {
    const freq = notes[seqMelodyStepIndex % notes.length];
    triggerLeadNote(ctx, echoBus, freq, stepSec * gate, now, 3);
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
  const trackNames = ['01 KICK', '02 SNARE', '03 HI-HAT', '04 MELODY'];

  trackNames.forEach((name, tIdx) => {
    const row = document.createElement('div');
    row.className = 'seq-row';

    const controls = document.createElement('div');
    controls.className = 'seq-track-controls';

    const label = document.createElement('div');
    label.className = 'seq-label';
    label.innerText = name;

    const vBtn = document.createElement('button');
    vBtn.type = 'button';
    const isPoly = trackVoiceModes[tIdx] === 'poly';
    vBtn.className = 'voice-btn' + (isPoly ? ' poly' : '');
    vBtn.innerText = isPoly ? 'POLY' : 'MONO';
    vBtn.onclick = () => {
      trackVoiceModes[tIdx] = trackVoiceModes[tIdx] === 'mono' ? 'poly' : 'mono';
      renderSequencerUI();
    };

    controls.appendChild(label);
    controls.appendChild(vBtn);
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
        if (tIdx === 0) btn.classList.add('cyan');
        if (tIdx === 3) btn.classList.add('purple');
      }
      btn.onclick = () => {
        sequenceGrid[tIdx][s] = sequenceGrid[tIdx][s] ? 0 : 1;
        btn.classList.toggle('on');
        if (tIdx === 0) btn.classList.toggle('cyan', !!sequenceGrid[tIdx][s]);
        if (tIdx === 3) btn.classList.toggle('purple', !!sequenceGrid[tIdx][s]);
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
  for (let t = 0; t < 4; t++) {
    const el = document.getElementById(`step-${t}-${currentStep}`);
    if (el) el.classList.add('now');
  }
  playStepSounds(currentStep);
  currentStep = (currentStep + 1) % 16;
  const bpm = parseFloat(document.getElementById('bpm').value);
  stepTimer = setTimeout(runSequencerLoop, ((60 / bpm) / 4) * 1000);
}

function toggleSequencer() {
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
    getAudioCtx();
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
loadSession();
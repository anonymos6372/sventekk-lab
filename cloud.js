/* =========================================================================
   1. KONSTANTEN & STATUSVARIABLEN
   ========================================================================= */
const APP_VERSION = '0.2';

const SUPABASE_URL = 'https://zrdturntjcdvazyrrskk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHR1cm50amNkdmF6eXJyc2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0Njc2NTEsImV4cCI6MjExMTA0MzY1MX0.-mhnNpMM096PZeo-Xxf0zrjycnCyP0V9sKLjMExIofI';

const STORAGE_SESSION_KEY = 'sventekk_cloud_session_v1';
const STORAGE_QUOTA_KEY = 'sventekk_device_quota_v2';

const FREE_CREDITS_MAX = 5;
const RESET_WINDOW_MS = 24 * 60 * 60 * 1000;

const ROLE_CODES = {
  'SVENTEKK2026VIP': 'vip',
  'SVENTEKKTESTER': 'tester'
};

let authMode = 'login';
let currentUser = null;
let selectedRating = 5;

/* =========================================================================
   2. HILFSFUNKTIONEN & SESSION
   ========================================================================= */
function applyVersionTags() {
  const hb = document.getElementById('header-version-badge');
  const fc = document.getElementById('feedback-version-chip');
  const ft = document.getElementById('footer-version-text');
  if (hb) hb.innerText = `VERSION ${APP_VERSION}`;
  if (fc) fc.innerText = `V ${APP_VERSION}`;
  if (ft) ft.innerText = `Version ${APP_VERSION}`;
}

function clearPersistentSession() {
  localStorage.removeItem(STORAGE_SESSION_KEY);
  document.cookie = `${STORAGE_SESSION_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTimeLeft(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function getDeviceQuota() {
  const now = Date.now();
  let q = null;
  try { q = JSON.parse(localStorage.getItem(STORAGE_QUOTA_KEY)); } catch (e) {}
  if (!q || typeof q.used !== 'number' || typeof q.windowStart !== 'number') {
    q = { used: 0, windowStart: now };
  }
  if (now - q.windowStart >= RESET_WINDOW_MS) {
    q = { used: 0, windowStart: now };
  }
  localStorage.setItem(STORAGE_QUOTA_KEY, JSON.stringify(q));
  return q;
}

function getPersistentSession() {
  const ls = localStorage.getItem(STORAGE_SESSION_KEY);
  if (ls) return ls;
  const match = document.cookie.match(new RegExp('(?:^|; )' + STORAGE_SESSION_KEY + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function saveDeviceQuota(q) {
  localStorage.setItem(STORAGE_QUOTA_KEY, JSON.stringify(q));
}

function setPersistentSession(username) {
  localStorage.setItem(STORAGE_SESSION_KEY, username);
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${STORAGE_SESSION_KEY}=${encodeURIComponent(username)}; expires=${expires}; path=/; SameSite=Lax`;
}

async function sha256Hex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/* =========================================================================
   3. SUPABASE REST-FUNKTIONEN
   ========================================================================= */
async function sbCreateUser(userObj) {
  const url = `${SUPABASE_URL}/rest/v1/studio_users`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(userObj)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return rows[0] || userObj;
}

async function sbFetchUser(username) {
  const url = `${SUPABASE_URL}/rest/v1/studio_users?username=eq.${encodeURIComponent(username)}&select=*`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return rows[0] || null;
}

async function sbUpdateUser(username, patch) {
  const url = `${SUPABASE_URL}/rest/v1/studio_users?username=eq.${encodeURIComponent(username)}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return rows[0] || null;
}

/* =========================================================================
   4. RÄNGE & LOGIN (NUR ÜBER SUPABASE-ACCOUNT)
   ========================================================================= */
function canEditUserRoles(user) {
  if (!user) return false;
  return getEffectiveRole(user) === 'entwickler';
}

function canViewAdminPanel(user) {
  if (!user) return false;
  const r = getEffectiveRole(user);
  return r === 'vip' || r === 'entwickler';
}

function closeAuthModal() { document.getElementById('auth-modal').classList.remove('open'); }
function closeLimitModal() { document.getElementById('limit-modal').classList.remove('open'); }
function closeVipModal() { document.getElementById('vip-modal').classList.remove('open'); }

function consumeExportCredit() {
  if (!requireLoginOnly()) return false;
  if (hasUnlimitedExports(currentUser)) return true;

  const now = Date.now();
  if (!currentUser.window_start || now - Number(currentUser.window_start) >= RESET_WINDOW_MS) {
    currentUser.credits_used = 0;
    currentUser.window_start = now;
  }

  if (Number(currentUser.credits_used) >= FREE_CREDITS_MAX) {
    updateAccountUI();
    document.getElementById('limit-modal').classList.add('open');
    setStatus('24H EXPORT-LIMIT ERREICHT (0/5)');
    return false;
  }

  currentUser.credits_used = Number(currentUser.credits_used) + 1;
  const dq = getDeviceQuota();
  dq.used = Math.max(dq.used + 1, currentUser.credits_used);
  saveDeviceQuota(dq);

  sbUpdateUser(currentUser.username, {
    credits_used: currentUser.credits_used,
    window_start: currentUser.window_start
  }).catch(() => {});

  updateAccountUI();
  return true;
}

function getEffectiveRole(user) {
  if (!user) return 'free';
  if (user.role) return user.role;
  return user.is_vip ? 'vip' : 'free';
}

function hasUnlimitedExports(user) {
  if (!user) return false;
  const r = getEffectiveRole(user);
  return r === 'vip' || r === 'tester' || r === 'entwickler';
}

async function loadSession() {
  localStorage.removeItem('sventekk_local_dev_mode');
  sessionStorage.removeItem('sventekk_owner_dev_v1');

  const savedName = getPersistentSession();
  if (!savedName) {
    currentUser = null;
    updateAccountUI();
    return;
  }
  try {
    const dbUser = await sbFetchUser(savedName);
    if (dbUser) {
      currentUser = await syncUserReset(dbUser);
      setPersistentSession(savedName);
    } else {
      clearPersistentSession();
      currentUser = null;
    }
  } catch (e) {
    currentUser = null;
  }
  updateAccountUI();
}

function logoutUser() {
  clearPersistentSession();
  currentUser = null;
  updateAccountUI();
  setStatus('ABGEMELDET');
}

function openAuthModal(mode = 'login') {
  switchAuthTab(mode);
  document.getElementById('auth-error').innerText = '';
  document.getElementById('auth-modal').classList.add('open');
}

function openVipModal() {
  closeLimitModal();
  if (!currentUser) { openAuthModal('login'); return; }
  document.getElementById('vip-code-input').value = '';
  document.getElementById('vip-modal-msg').innerText = '';
  document.getElementById('vip-modal').classList.add('open');
}

function requireLoginOnly() {
  if (!currentUser) {
    openAuthModal('register');
    setStatus('BITTE ZUERST ANMELDEN');
    return false;
  }
  return true;
}

async function submitAuth() {
  const rawUser = document.getElementById('auth-username').value.trim();
  const pass = document.getElementById('auth-password').value;
  const codeInput = document.getElementById('auth-vipcode').value.trim().toUpperCase();
  const errEl = document.getElementById('auth-error');
  const submitBtn = document.getElementById('btn-auth-submit');

  if (!/^[a-zA-Z0-9_.-]{3,24}$/.test(rawUser)) {
    errEl.innerText = 'Benutzername: 3–24 Zeichen (nur Buchstaben, Zahlen, _ . -).';
    return;
  }
  if (pass.length < 4) {
    errEl.innerText = 'Passwort muss mindestens 4 Zeichen lang sein.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = 'Verbinde...';
  errEl.innerText = '';

  try {
    const username = rawUser.toLowerCase();
    const passHash = await sha256Hex(username + '::' + pass);
    const existingUser = await sbFetchUser(username);

    if (authMode === 'register') {
      if (existingUser) {
        errEl.innerText = 'Dieser Benutzername existiert bereits. Bitte anmelden.';
        return;
      }
      const assignedRole = ROLE_CODES[codeInput] || 'free';
      const isVip = assignedRole !== 'free';
      const dq = getDeviceQuota();

      const newUser = {
        username,
        pass_hash: passHash,
        role: assignedRole,
        is_vip: isVip,
        credits_used: isVip ? 0 : dq.used,
        window_start: dq.windowStart,
        last_login: new Date().toISOString()
      };

      const created = await sbCreateUser(newUser);
      setPersistentSession(username);
      currentUser = created;
      closeAuthModal();
      updateAccountUI();
      setStatus(`WILLKOMMEN ${username.toUpperCase()} (${assignedRole.toUpperCase()})!`);
    } else {
      if (!existingUser) {
        errEl.innerText = 'Account nicht gefunden. Bitte zuerst registrieren.';
        return;
      }
      if (existingUser.pass_hash !== passHash) {
        errEl.innerText = 'Falsches Passwort.';
        return;
      }
      await sbUpdateUser(username, { last_login: new Date().toISOString() });
      setPersistentSession(username);
      currentUser = await syncUserReset(existingUser);
      closeAuthModal();
      updateAccountUI();
      setStatus(`EINGELOGGT ALS ${username.toUpperCase()}`);
    }
  } catch (e) {
    errEl.innerText = 'Cloud-Fehler: ' + e.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = 'Weiter ins Studio';
  }
}

async function submitRoleCode() {
  const inputEl = document.getElementById('vip-code-input');
  const msgEl = document.getElementById('vip-modal-msg');
  const btn = document.getElementById('btn-vip-submit');
  const entered = inputEl.value.trim().toUpperCase();

  if (!currentUser) { closeVipModal(); openAuthModal('login'); return; }

  const matchedRole = ROLE_CODES[entered];
  if (!matchedRole) {
    msgEl.style.color = '#fca5a5';
    msgEl.innerText = 'Ungültiger Rang-Code.';
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Aktiviere...';
  msgEl.innerText = '';

  try {
    const updated = await sbUpdateUser(currentUser.username, {
      role: matchedRole,
      is_vip: true,
      credits_used: 0
    });
    currentUser = {
      ...currentUser,
      ...(updated || {}),
      role: matchedRole,
      is_vip: true,
      credits_used: 0
    };
    closeVipModal();
    updateAccountUI();
    await loadAdminData();
    setStatus(`RANG "${matchedRole.toUpperCase()}" AKTIVIERT!`);
  } catch (e) {
    msgEl.style.color = '#fca5a5';
    msgEl.innerText = 'Fehler beim Speichern: ' + e.message;
  } finally {
    btn.disabled = false;
    btn.innerText = 'Aktivieren';
  }
}

function switchAuthTab(mode) {
  authMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-register').classList.toggle('active', mode === 'register');
  document.getElementById('auth-modal-title').innerText =
    mode === 'login' ? 'Anmelden & Sounds bauen' : 'Neuen SVENTEKK Account erstellen';
  document.getElementById('vip-field').style.display = mode === 'register' ? 'flex' : 'none';
  document.getElementById('auth-error').innerText = '';
}

async function syncUserReset(user) {
  if (!user) return null;
  const now = Date.now();
  let changed = false;

  if (!user.window_start || now - Number(user.window_start) >= RESET_WINDOW_MS) {
    user.credits_used = 0;
    user.window_start = now;
    changed = true;
  }

  const dq = getDeviceQuota();
  if (!hasUnlimitedExports(user) && dq.used > user.credits_used) {
    user.credits_used = Math.min(FREE_CREDITS_MAX, dq.used);
    user.window_start = dq.windowStart;
    changed = true;
  }

  if (changed) {
    sbUpdateUser(user.username, {
      credits_used: user.credits_used,
      window_start: user.window_start
    }).catch(() => {});
  }
  return user;
}

function updateAccountUI() {
  const avatarEl = document.getElementById('ui-avatar');
  const nameEl = document.getElementById('ui-username');
  const roleBadgeEl = document.getElementById('ui-role-badge');
  const timerEl = document.getElementById('ui-reset-timer');
  const badgeEl = document.getElementById('ui-credits-badge');
  const vipCodeBtn = document.getElementById('btn-vip-code');
  const loginBtn = document.getElementById('btn-open-login');
  const logoutBtn = document.getElementById('btn-logout');
  const adminPanel = document.getElementById('vip-admin-panel');
  const fbUserHint = document.getElementById('feedback-user-hint');

  if (!currentUser) {
    avatarEl.innerText = '?';
    nameEl.innerText = 'Nicht angemeldet (Gast)';
    roleBadgeEl.innerText = 'GAST';
    roleBadgeEl.className = 'role-tag role-free';
    timerEl.innerText = 'Anmelden für 5 Gratis-.WAV Exporte / 24h';
    badgeEl.innerText = 'LOGIN NÖTIG';
    badgeEl.className = 'credit-badge empty';
    vipCodeBtn.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    adminPanel.style.display = 'none';
    if (fbUserHint) fbUserHint.innerText = 'Wird gesendet als: Gast';
    return;
  }

  const role = getEffectiveRole(currentUser);
  avatarEl.innerText = currentUser.username.charAt(0).toUpperCase();
  nameEl.innerText = currentUser.username;
  roleBadgeEl.innerText = role.toUpperCase();
  roleBadgeEl.className = `role-tag role-${role}`;

  vipCodeBtn.style.display = role === 'entwickler' ? 'none' : 'inline-block';
  loginBtn.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
  if (fbUserHint) fbUserHint.innerText = `Wird gesendet als: ${currentUser.username} (${role})`;

  if (canViewAdminPanel(currentUser)) {
    if (adminPanel.style.display === 'none') {
      adminPanel.style.display = 'block';
      loadAdminData();
    }
  } else {
    adminPanel.style.display = 'none';
  }

  if (hasUnlimitedExports(currentUser)) {
    badgeEl.innerText = `∞ ${role.toUpperCase()}`;
    badgeEl.className = 'credit-badge vip';
    timerEl.innerText = `Rang "${role.toUpperCase()}" aktiv – unbegrenzte Studio-Exporte`;
    return;
  }

  const used = Number(currentUser.credits_used || 0);
  const winStart = Number(currentUser.window_start || Date.now());
  const remaining = Math.max(0, FREE_CREDITS_MAX - used);
  const msLeft = (winStart + RESET_WINDOW_MS) - Date.now();
  const timeStr = formatTimeLeft(msLeft);

  badgeEl.innerText = `${remaining} / ${FREE_CREDITS_MAX} FREE`;
  badgeEl.className = remaining === 0 ? 'credit-badge empty' : 'credit-badge';
  timerEl.innerText = remaining < FREE_CREDITS_MAX
    ? `Reset der 5 Gratis-Exporte in: ${timeStr}`
    : 'Volles 24h-Guthaben verfügbar (5 .WAV Exporte)';

  const modalCd = document.getElementById('modal-countdown');
  if (modalCd) modalCd.innerText = timeStr;
}

setInterval(updateAccountUI, 1000);

/* =========================================================================
   5. FEEDBACK & ADMIN-PANEL
   ========================================================================= */
async function assignUserRole(targetUsername) {
  if (!canEditUserRoles(currentUser)) return;
  const selectEl = document.getElementById(`role-sel-${targetUsername}`);
  if (!selectEl) return;

  const newRole = selectEl.value;
  const isVipFlag = newRole !== 'free';

  try {
    await sbUpdateUser(targetUsername, {
      role: newRole,
      is_vip: isVipFlag
    });
    if (currentUser && currentUser.username === targetUsername) {
      currentUser.role = newRole;
      currentUser.is_vip = isVipFlag;
      updateAccountUI();
    }
    setStatus(`RANG VON ${targetUsername.toUpperCase()} -> ${newRole.toUpperCase()}`);
    await loadAdminData();
  } catch (e) {
    alert('Fehler beim Speichern des Rangs: ' + e.message);
  }
}

async function loadAdminData() {
  if (!canViewAdminPanel(currentUser)) return;
  const tbodyUsers = document.getElementById('admin-users-tbody');
  const tbodyFb = document.getElementById('admin-feedback-tbody');
  const allowRoleEdit = canEditUserRoles(currentUser);

  try {
    const resU = await fetch(`${SUPABASE_URL}/rest/v1/studio_users?select=username,role,is_vip,credits_used,last_login&order=last_login.desc`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
    });
    if (!resU.ok) throw new Error(`HTTP ${resU.status}`);
    const users = await resU.json();
    tbodyUsers.innerHTML = users.length ? '' : '<tr><td colspan="5">Noch keine Nutzer.</td></tr>';
    users.forEach(u => {
      const r = getEffectiveRole(u);
      const safeUser = escapeHtml(u.username);
      const tr = document.createElement('tr');
      const dateStr = u.last_login ? escapeHtml(new Date(u.last_login).toLocaleString('de-DE')) : '-';

      const roleControlHtml = allowRoleEdit
        ? `<div style="display:flex; gap:6px; align-items:center;">
             <select id="role-sel-${safeUser}" class="role-select">
               <option value="free" ${r === 'free' ? 'selected' : ''}>free</option>
               <option value="vip" ${r === 'vip' ? 'selected' : ''}>vip</option>
               <option value="tester" ${r === 'tester' ? 'selected' : ''}>tester</option>
               <option value="entwickler" ${r === 'entwickler' ? 'selected' : ''}>entwickler</option>
             </select>
             <button type="button" class="btn btn-cyan" style="padding:4px 9px; font-size:0.74rem; flex:0 0 auto;" onclick="assignUserRole('${safeUser}')">Speichern</button>
           </div>`
        : `<span style="color:var(--text-dim);">Nur Entwickler</span>`;

      tr.innerHTML = `
        <td><strong>${safeUser}</strong></td>
        <td><span class="role-tag role-${r}">${escapeHtml(r.toUpperCase())}</span></td>
        <td>${roleControlHtml}</td>
        <td>${r !== 'free' ? '∞' : (Number(u.credits_used) || 0) + ' / ' + FREE_CREDITS_MAX}</td>
        <td>${dateStr}</td>
      `;
      tbodyUsers.appendChild(tr);
    });
  } catch (e) {
    tbodyUsers.innerHTML = '<tr><td colspan="5">Offline / Cloud nicht verbunden.</td></tr>';
  }

  try {
    const resF = await fetch(`${SUPABASE_URL}/rest/v1/studio_feedback?select=*&order=created_at.desc&limit=30`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
    });
    if (!resF.ok) throw new Error(`HTTP ${resF.status}`);
    const fbs = await resF.json();
    tbodyFb.innerHTML = fbs.length ? '' : '<tr><td colspan="5">Noch kein Feedback vorhanden.</td></tr>';
    fbs.forEach(f => {
      const tr = document.createElement('tr');
      const dateStr = f.created_at ? escapeHtml(new Date(f.created_at).toLocaleString('de-DE')) : '-';
      const starsCount = Math.max(1, Math.min(5, Number(f.rating) || 5));
      tr.innerHTML = `
        <td><strong>${escapeHtml(f.username || 'Gast')}</strong></td>
        <td>${'★'.repeat(starsCount)}</td>
        <td>${escapeHtml(f.app_version || '-')}</td>
        <td>${escapeHtml(f.message || '')}</td>
        <td>${dateStr}</td>
      `;
      tbodyFb.appendChild(tr);
    });
  } catch (e) {
    tbodyFb.innerHTML = '<tr><td colspan="5">Feedback konnte nicht geladen werden.</td></tr>';
  }
}

function selectRating(stars) {
  selectedRating = stars;
  document.querySelectorAll('#rating-buttons .rate-btn').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.rate) === stars);
  });
}

async function submitFeedback() {
  const msgEl = document.getElementById('feedback-message');
  const statusEl = document.getElementById('feedback-status');
  const btn = document.getElementById('btn-send-feedback');
  const text = msgEl.value.trim();

  if (text.length < 3) {
    statusEl.style.color = '#fca5a5';
    statusEl.innerText = 'Bitte schreibe mindestens 3 Zeichen Feedback.';
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Sende...';
  statusEl.innerText = '';

  const payload = {
    username: currentUser ? currentUser.username : 'Gast',
    rating: selectedRating,
    message: text,
    app_version: 'V ' + APP_VERSION,
    created_at: new Date().toISOString()
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/studio_feedback`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

    msgEl.value = '';
    statusEl.style.color = '#6ee7b7';
    statusEl.innerText = '✔ Danke! Dein Feedback wurde gespeichert.';
    if (canViewAdminPanel(currentUser)) loadAdminData();
  } catch (e) {
    statusEl.style.color = '#fca5a5';
    statusEl.innerText = 'Hinweis: ' + e.message;
  } finally {
    btn.disabled = false;
    btn.innerText = 'Feedback absenden';
  }
}
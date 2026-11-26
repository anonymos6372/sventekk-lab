/* =========================================================================
   1. KONSTANTEN & STATUSVARIABLEN
   ========================================================================= */
const APP_VERSION = '0.3';

const SUPABASE_URL = 'https://zrdturntjcdvazyrrskk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHR1cm50amNkdmF6eXJyc2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0Njc2NTEsImV4cCI6MjExMTA0MzY1MX0.-mhnNpMM096PZeo-Xxf0zrjycnCyP0V9sKLjMExIofI';

const AUTH_EMAIL_DOMAIN = 'users.sventekk.app';
const STORAGE_AUTH_KEY = 'sventekk_auth_session_v2';
const LEGACY_SESSION_KEY = 'sventekk_cloud_session_v1';

const FREE_CREDITS_MAX = 5;
const RESET_WINDOW_MS = 24 * 60 * 60 * 1000;

let authMode = 'login';
let authSession = null;
let currentUser = null;
let selectedRating = 5;

/* =========================================================================
   2. HILFSFUNKTIONEN & AUTH-SESSION (JWT)
   ========================================================================= */
function applyVersionTags() {
  const hb = document.getElementById('header-version-badge');
  const fc = document.getElementById('feedback-version-chip');
  const ft = document.getElementById('footer-version-text');
  if (hb) hb.innerText = `VERSION ${APP_VERSION}`;
  if (fc) fc.innerText = `V ${APP_VERSION}`;
  if (ft) ft.innerText = `Version ${APP_VERSION}`;
}

function usernameToAuthEmail(username) {
  return `${username.toLowerCase()}@${AUTH_EMAIL_DOMAIN}`;
}

function isValidUsername(raw) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]{1,22}[a-zA-Z0-9]$/.test(raw)) return false;
  if (raw.includes('..')) return false;
  return true;
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

function readStoredAuthSession() {
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.access_token || !parsed.refresh_token) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function saveAuthSession(tokenPayload) {
  const expiresInSec = Number(tokenPayload.expires_in) || 3600;
  authSession = {
    access_token: tokenPayload.access_token,
    refresh_token: tokenPayload.refresh_token,
    expires_at: Date.now() + (expiresInSec * 1000)
  };
  try {
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(authSession));
  } catch (e) {}
}

function clearAuthSession() {
  authSession = null;
  try {
    localStorage.removeItem(STORAGE_AUTH_KEY);
    localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch (e) {}
  document.cookie = `${LEGACY_SESSION_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

async function parseErrorMessage(res) {
  try {
    const data = await res.json();
    return data.msg || data.message || data.error_description || data.error || `HTTP ${res.status}`;
  } catch (e) {
    return `HTTP ${res.status}`;
  }
}

/* =========================================================================
   3. SUPABASE AUTH & RPC-FUNKTIONEN
   ========================================================================= */
async function sbAuthSignUp(username, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: usernameToAuthEmail(username),
      password,
      data: { username }
    })
  });
  if (!res.ok) {
    const msg = await parseErrorMessage(res);
    if (/already registered|already exists/i.test(msg)) {
      throw new Error('Dieser Benutzername existiert bereits. Bitte anmelden.');
    }
    throw new Error(msg);
  }
  const data = await res.json();
  if (!data.access_token || !data.refresh_token) {
    throw new Error('Registrierung unvollständig: Bitte in Supabase "Confirm email" unter Auth -> Email deaktivieren.');
  }
  saveAuthSession(data);
  return data;
}

async function sbAuthSignIn(username, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: usernameToAuthEmail(username),
      password
    })
  });
  if (!res.ok) {
    const msg = await parseErrorMessage(res);
    if (/invalid login credentials/i.test(msg)) {
      throw new Error('Benutzername oder Passwort falsch.');
    }
    throw new Error(msg);
  }
  const data = await res.json();
  if (!data.access_token || !data.refresh_token) {
    throw new Error('Anmeldung fehlgeschlagen.');
  }
  saveAuthSession(data);
  return data;
}

async function sbAuthRefresh() {
  if (!authSession || !authSession.refresh_token) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: authSession.refresh_token })
  });
  if (!res.ok) {
    clearAuthSession();
    return null;
  }
  const data = await res.json();
  if (!data.access_token || !data.refresh_token) {
    clearAuthSession();
    return null;
  }
  saveAuthSession(data);
  return authSession.access_token;
}

async function getValidAccessToken() {
  if (!authSession) authSession = readStoredAuthSession();
  if (!authSession) return null;
  if (Date.now() < Number(authSession.expires_at || 0) - 60000) {
    return authSession.access_token;
  }
  return await sbAuthRefresh();
}

async function sbRpc(fnName, params = {}) {
  const token = await getValidAccessToken();
  if (!token) throw new Error('Session abgelaufen. Bitte neu anmelden.');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (res.status === 401) {
    const refreshed = await sbAuthRefresh();
    if (!refreshed) throw new Error('Session abgelaufen. Bitte neu anmelden.');
    const retry = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${refreshed}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    if (!retry.ok) throw new Error(await parseErrorMessage(retry));
    return await retry.json();
  }

  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return await res.json();
}

/* =========================================================================
   4. RÄNGE & LOGIN (SUPABASE AUTH + RLS)
   ========================================================================= */
function canEditUserRoles(user) {
  if (!user) return false;
  return getEffectiveRole(user) === 'entwickler';
}

function canViewAdminPanel(user) {
  if (!user) return false;
  return getEffectiveRole(user) === 'entwickler';
}

function closeAuthModal() { document.getElementById('auth-modal').classList.remove('open'); }
function closeLimitModal() { document.getElementById('limit-modal').classList.remove('open'); }
function closeRoleModal() { document.getElementById('role-modal').classList.remove('open'); }

function jumpToFeedbackFromLimit() {
  closeLimitModal();
  if (typeof setStudioPage === 'function') {
    setStudioPage('studio');
  }
  const msgEl = document.getElementById('feedback-message');
  if (msgEl) {
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => msgEl.focus(), 300);
  }
}

async function consumeExportCredit() {
  if (!requireLoginOnly()) return false;
  if (hasUnlimitedExports(currentUser)) return true;

  try {
    const result = await sbRpc('consume_export_credit');
    if (result && result.profile) {
      currentUser = result.profile;
    }
    updateAccountUI();

    if (!result || !result.allowed) {
      document.getElementById('limit-modal').classList.add('open');
      setStatus('24H EXPORT-LIMIT ERREICHT (0/5)');
      return false;
    }
    return true;
  } catch (e) {
    setStatus('EXPORT-PRÜFUNG FEHLGESCHLAGEN');
    alert('Export konnte nicht geprüft werden: ' + e.message);
    return false;
  }
}

function updateDevDownloadCounterVisibility() {
  const box = document.getElementById('dev-download-counter-box');
  const fixCard = document.getElementById('dev-fix-notes-card');
  const isDev = Boolean(currentUser && getEffectiveRole(currentUser) === 'entwickler');

  if (box) box.style.display = isDev ? 'inline-flex' : 'none';
  if (fixCard) fixCard.style.display = isDev ? 'block' : 'none';

  if (isDev && typeof updateDownloadCounterUI === 'function') {
    updateDownloadCounterUI();
  }
}

function getEffectiveRole(user) {
  if (!user) return 'free';
  if (user.role === 'entwickler' || user.role === 'tester' || user.role === 'free') {
    return user.role;
  }
  return 'free';
}

function hasUnlimitedExports(user) {
  if (!user) return false;
  const r = getEffectiveRole(user);
  return r === 'tester' || r === 'entwickler';
}

async function loadSession() {
  localStorage.removeItem('sventekk_local_dev_mode');
  sessionStorage.removeItem('sventekk_owner_dev_v1');

  const token = await getValidAccessToken();
  if (!token) {
    currentUser = null;
    updateAccountUI();
    return;
  }

  try {
    const profile = await sbRpc('touch_login');
    currentUser = profile || null;
  } catch (e) {
    clearAuthSession();
    currentUser = null;
  }
  updateAccountUI();
}

async function logoutUser() {
  const token = authSession ? authSession.access_token : null;
  if (token) {
    fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`
      }
    }).catch(() => {});
  }
  clearAuthSession();
  currentUser = null;
  updateAccountUI();
  setStatus('ABGEMELDET');
}

function openAuthModal(mode = 'login') {
  switchAuthTab(mode);
  document.getElementById('auth-error').innerText = '';
  document.getElementById('auth-modal').classList.add('open');
}

function openRoleModal() {
  closeLimitModal();
  if (!currentUser) { openAuthModal('login'); return; }
  document.getElementById('role-code-input').value = '';
  document.getElementById('role-modal-msg').innerText = '';
  document.getElementById('role-modal').classList.add('open');
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
  const codeInput = document.getElementById('auth-rolecode').value.trim().toUpperCase();
  const errEl = document.getElementById('auth-error');
  const submitBtn = document.getElementById('btn-auth-submit');

  if (!isValidUsername(rawUser)) {
    errEl.innerText = 'Benutzername: 3–24 Zeichen (Buchstaben/Zahlen am Rand, sonst _ . - erlaubt).';
    return;
  }
  if (pass.length < 6) {
    errEl.innerText = 'Passwort muss mindestens 6 Zeichen lang sein.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = 'Verbinde...';
  errEl.innerText = '';

  try {
    const username = rawUser.toLowerCase();

    if (authMode === 'register') {
      await sbAuthSignUp(username, pass);
      let profile = await sbRpc('touch_login');
      let codeHint = '';

      if (codeInput) {
        try {
          profile = await sbRpc('redeem_tester_code', { p_code: codeInput });
        } catch (codeErr) {
          codeHint = ' (CODE UNGÜLTIG -> FREE)';
        }
      }

      currentUser = profile;
      closeAuthModal();
      updateAccountUI();
      setStatus(`WILLKOMMEN ${username.toUpperCase()} (${getEffectiveRole(currentUser).toUpperCase()})${codeHint}`);
    } else {
      await sbAuthSignIn(username, pass);
      currentUser = await sbRpc('touch_login');
      closeAuthModal();
      updateAccountUI();
      setStatus(`EINGELOGGT ALS ${username.toUpperCase()}`);
    }
  } catch (e) {
    errEl.innerText = e.message || 'Cloud-Fehler bei der Anmeldung.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = 'Weiter ins Studio';
  }
}

async function submitRoleCode() {
  const inputEl = document.getElementById('role-code-input');
  const msgEl = document.getElementById('role-modal-msg');
  const btn = document.getElementById('btn-role-submit');
  const entered = inputEl.value.trim().toUpperCase();

  if (!currentUser) { closeRoleModal(); openAuthModal('login'); return; }
  if (!entered) {
    msgEl.style.color = '#fca5a5';
    msgEl.innerText = 'Bitte einen Tester-Code eingeben.';
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Prüfe...';
  msgEl.innerText = '';

  try {
    const updated = await sbRpc('redeem_tester_code', { p_code: entered });
    currentUser = updated || currentUser;
    closeRoleModal();
    updateAccountUI();
    setStatus(`RANG "${getEffectiveRole(currentUser).toUpperCase()}" AKTIVIERT!`);
  } catch (e) {
    msgEl.style.color = '#fca5a5';
    msgEl.innerText = e.message || 'Ungültiger Tester-Code.';
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
  document.getElementById('role-code-field').style.display = mode === 'register' ? 'flex' : 'none';
  document.getElementById('auth-error').innerText = '';
}

function updateAccountUI() {
  const avatarEl = document.getElementById('ui-avatar');
  const nameEl = document.getElementById('ui-username');
  const roleBadgeEl = document.getElementById('ui-role-badge');
  const timerEl = document.getElementById('ui-reset-timer');
  const badgeEl = document.getElementById('ui-credits-badge');
  const roleCodeBtn = document.getElementById('btn-role-code');
  const loginBtn = document.getElementById('btn-open-login');
  const logoutBtn = document.getElementById('btn-logout');
  const adminPanel = document.getElementById('admin-panel');
  const fbUserHint = document.getElementById('feedback-user-hint');

  if (!currentUser) {
    avatarEl.innerText = '?';
    nameEl.innerText = 'Nicht angemeldet (Gast)';
    roleBadgeEl.innerText = 'GAST';
    roleBadgeEl.className = 'role-tag role-free';
    timerEl.innerText = 'Anmelden für 5 Gratis-.WAV Exporte / 24h';
    badgeEl.innerText = 'LOGIN NÖTIG';
    badgeEl.className = 'credit-badge empty';
    roleCodeBtn.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    adminPanel.style.display = 'none';
    updateDevDownloadCounterVisibility();
    if (fbUserHint) fbUserHint.innerText = 'Wird gesendet als: Gast';
    return;
  }

  const role = getEffectiveRole(currentUser);
  avatarEl.innerText = (currentUser.username || '?').charAt(0).toUpperCase();
  nameEl.innerText = currentUser.username || 'User';
  roleBadgeEl.innerText = role.toUpperCase();
  roleBadgeEl.className = `role-tag role-${role}`;

  roleCodeBtn.style.display = (role === 'tester' || role === 'entwickler') ? 'none' : 'inline-block';
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
  updateDevDownloadCounterVisibility();

  if (hasUnlimitedExports(currentUser)) {
    badgeEl.innerText = `∞ ${role.toUpperCase()}`;
    badgeEl.className = 'credit-badge unlimited';
    timerEl.innerText = `Rang "${role.toUpperCase()}" aktiv – unbegrenzte Studio-Exporte`;
    return;
  }

  const now = Date.now();
  const winStart = Number(currentUser.window_start || now);
  const expired = now - winStart >= RESET_WINDOW_MS;
  const used = expired ? 0 : Number(currentUser.credits_used || 0);
  const remaining = Math.max(0, FREE_CREDITS_MAX - used);
  const msLeft = (winStart + RESET_WINDOW_MS) - now;
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
async function assignUserRole(targetUsername, newRole) {
  if (!canEditUserRoles(currentUser)) return;
  if (!newRole) return;

  try {
    const updated = await sbRpc('set_user_role', {
      p_target_username: targetUsername,
      p_new_role: newRole
    });
    if (currentUser && currentUser.username === targetUsername && updated) {
      currentUser = updated;
      updateAccountUI();
    }
    setStatus(`RANG VON ${String(targetUsername).toUpperCase()} -> ${newRole.toUpperCase()}`);
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
  const token = await getValidAccessToken();

  if (!token) return;

  try {
    const resU = await fetch(`${SUPABASE_URL}/rest/v1/studio_profiles?select=username,role,credits_used,last_login&order=last_login.desc`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` }
    });
    if (!resU.ok) throw new Error(`HTTP ${resU.status}`);
    const users = await resU.json();
    tbodyUsers.innerHTML = users.length ? '' : '<tr><td colspan="5">Noch keine Nutzer.</td></tr>';
    users.forEach(u => {
      const r = getEffectiveRole(u);
      const tr = document.createElement('tr');
      const dateStr = u.last_login ? new Date(u.last_login).toLocaleString('de-DE') : '-';

      const tdUser = document.createElement('td');
      const strongUser = document.createElement('strong');
      strongUser.textContent = u.username || '-';
      tdUser.appendChild(strongUser);

      const tdRole = document.createElement('td');
      const roleSpan = document.createElement('span');
      roleSpan.className = `role-tag role-${r}`;
      roleSpan.textContent = r.toUpperCase();
      tdRole.appendChild(roleSpan);

      const tdControl = document.createElement('td');
      if (allowRoleEdit) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex; gap:6px; align-items:center;';

        const select = document.createElement('select');
        select.className = 'role-select';
        ['free', 'tester', 'entwickler'].forEach(optVal => {
          const opt = document.createElement('option');
          opt.value = optVal;
          opt.textContent = optVal;
          if (r === optVal) opt.selected = true;
          select.appendChild(opt);
        });

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'btn btn-cyan';
        saveBtn.style.cssText = 'padding:4px 9px; font-size:0.74rem; flex:0 0 auto;';
        saveBtn.textContent = 'Speichern';
        saveBtn.addEventListener('click', () => assignUserRole(u.username, select.value));

        wrap.appendChild(select);
        wrap.appendChild(saveBtn);
        tdControl.appendChild(wrap);
      } else {
        const span = document.createElement('span');
        span.style.color = 'var(--text-dim)';
        span.textContent = 'Nur Entwickler';
        tdControl.appendChild(span);
      }

      const tdCredits = document.createElement('td');
      tdCredits.textContent = r !== 'free' ? '∞' : `${Number(u.credits_used) || 0} / ${FREE_CREDITS_MAX}`;

      const tdDate = document.createElement('td');
      tdDate.textContent = dateStr;

      tr.append(tdUser, tdRole, tdControl, tdCredits, tdDate);
      tbodyUsers.appendChild(tr);
    });
  } catch (e) {
    tbodyUsers.innerHTML = '<tr><td colspan="5">Offline / Cloud nicht verbunden.</td></tr>';
  }

  try {
    const resF = await fetch(`${SUPABASE_URL}/rest/v1/studio_feedback?select=*&order=created_at.desc&limit=30`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` }
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
    const token = await getValidAccessToken();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/studio_feedback`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await parseErrorMessage(res));

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

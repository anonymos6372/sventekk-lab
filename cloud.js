/* =========================================================================
   1. KONSTANTEN, SPRACHE (DE / EN) & STATUSVARIABLEN
   ========================================================================= */
const APP_VERSION = '0.4';

const SUPABASE_URL = 'https://zrdturntjcdvazyrrskk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHR1cm50amNkdmF6eXJyc2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0Njc2NTEsImV4cCI6MjExMTA0MzY1MX0.-mhnNpMM096PZeo-Xxf0zrjycnCyP0V9sKLjMExIofI';

const AUTH_EMAIL_DOMAIN = 'users.sventekk.app';
const STORAGE_AUTH_KEY = 'sventekk_auth_session_v2';
const LEGACY_SESSION_KEY = 'sventekk_cloud_session_v1';
const STORAGE_LANG_KEY = 'sventekk_lang_v1';

const FREE_CREDITS_MAX = 5;
const RESET_WINDOW_MS = 24 * 60 * 60 * 1000;

let authMode = 'login';
let authSession = null;
let currentUser = null;
let selectedRating = 5;
let currentLang = 'de';
let chatMessages = [];
let creatorPresets = [];
let chatPollTimer = null;
let chatPollTicks = 0;

/* =========================================================================
   2. ÜBERSETZUNGEN (DEUTSCH / ENGLISH)
   ========================================================================= */
const I18N = {
  de: {
    auth_badge: 'SVENTEKK CLOUD ACCOUNT',
    auth_title_login: 'Anmelden & Sounds bauen',
    auth_title_register: 'Neuen SVENTEKK Account erstellen',
    auth_sub_html: 'Kostenloses Konto: <strong>5 Gratis-.WAV Exporte</strong> alle 24 Stunden.',
    auth_tab_login: 'Anmelden',
    auth_tab_register: 'Registrieren',
    auth_label_user: 'BENUTZERNAME',
    auth_ph_user: 'z.B. sventekk07',
    auth_label_pass: 'PASSWORT',
    auth_label_code: 'TESTER-CODE (OPTIONAL)',
    auth_ph_code: 'Leer lassen für Free-Account',
    auth_security_html: '🔒 <strong>Sicherer Cloud-Login:</strong> Verschlüsselte Session &amp; Passwortschutz über Supabase Auth.',
    auth_submit: 'Weiter ins Studio',
    auth_connecting: 'Verbinde...',

    role_modal_badge: 'TESTER AKTIVIEREN',
    role_modal_title: 'Tester-Code eingeben',
    role_modal_sub: 'Schalte deinen Account als Tester für unbegrenzte .WAV-Exporte frei.',
    role_modal_label: 'TESTER-CODE',
    role_modal_ph: 'Code eingeben...',
    role_modal_hint_html: 'Noch keinen Code? Melde dich auf unserem <strong>Discord</strong> an und bewirb dich in <code>#tester-anmeldung</code>: <a href="https://discord.gg/jubxwavZa" target="_blank" rel="noopener noreferrer" style="color: #c7d2fe; font-weight: 700; text-decoration: underline; margin-left: 4px;">Discord öffnen &rarr;</a>',
    btn_cancel: 'Abbrechen',
    btn_activate: 'Aktivieren',
    btn_checking: 'Prüfe...',

    limit_badge: 'FREE LIMIT ERREICHT',
    limit_title: 'Keine Gratis-.WAV Downloads mehr übrig',
    limit_sub_html: 'Deine 5 Gratis-Exporte sind aufgebraucht. Du willst <strong>Tester</strong> (unbegrenzte Downloads) oder <strong>Creator</strong> werden? Melde dich auf unserem Discord an und bewirb dich direkt dort:',
    limit_btn_discord: 'Discord (Tester / Creator)',
    limit_btn_write: 'Mir schreiben',
    btn_close: 'Schließen',

    top_dev_exports: 'DEV .WAV EXPORTE:',
    top_tester_code: 'Tester-Code',
    top_login_btn: 'Anmelden / Registrieren',
    top_logout_btn: 'Abmelden',
    guest_name: 'Nicht angemeldet (Gast)',
    guest_role: 'GAST',
    guest_timer: 'Anmelden für 5 Gratis-.WAV Exporte / 24h',
    badge_login_needed: 'LOGIN NÖTIG',
    unlimited_timer: 'Rang "{role}" aktiv – unbegrenzte Studio-Exporte',
    reset_timer: 'Reset der 5 Gratis-Exporte in: {time}',
    full_quota_timer: 'Volles 24h-Guthaben verfügbar (5 .WAV Exporte)',
    fb_hint_guest: 'Wird gesendet als: Gast',
    fb_hint_user: 'Wird gesendet als: {user} ({role})',

    hero_title_html: 'Hardtekk &amp; <span class="accent">Uptempo</span> Sample Studio',
    hero_desc: 'Synthesizer-Werkstatt für eigene Hardtekk- & Uptempo-Kicks, Basslines, Snares/Claps/Rims, Hat-Rolls und komplette Rave-Melodien mit exakter Zahleneingabe.',
    hero_notice_html: '<strong>Wofür ist diese Website?</strong> Hier werden <strong>keine fertigen KI-Lieder</strong> generiert! Du baust dir hier per Echtzeit-Synthese eigene Kicks, Bässe, Snares, Melodie-Phrasen und komplette Pattern-Loops als <strong>.WAV-Samples</strong>, um sie danach auf deiner <strong>Korg Electribe 2</strong> oder in <strong>FL Studio</strong> zu arrangieren, zu schneiden und weiterzubearbeiten.',
    hero_status_right: 'KEINE KI · 100% SYNTHESE',
    hero_status_ready: 'BEREIT ZUM SCHRAUBEN',
    hero_discord_pill: 'Discord Server',

    cl_title: 'Neu in Version 0.4',
    cl_korg_btn: 'Korg Live öffnen →',
    cl_1_title: 'DE / EN & Live-Chat',
    cl_1_html: 'Komplette <strong>DE / EN</strong>-Übersetzung, geschützter Studio-Chat mit Rollen-Badges &amp; Entwickler-Moderation.',
    cl_2_title: 'Creator-Rolle & Preset-Wall',
    cl_2_html: 'Neue <strong>Creator</strong>-Rolle mit Community Preset-Wall zum Teilen &amp; 1-Klick-Laden von Kicks, Uptempo &amp; Bass.',
    cl_3_title: 'Voice-Tag & Live-Oszilloskop',
    cl_3_html: 'Neuer <strong>Producer Tag &amp; Voice</strong> Generator, Echtzeit-Wellenform, 2-Stufen-Uptempo &amp; Korg-Kurznamen.',

    dc_pill: 'DISCORD COMMUNITY · SVENTEKK-LAB',
    dc_title: 'Du willst Tester oder Creator werden?',
    dc_sub_html: 'Melde dich auf unserem <strong>SVENTEKK-Lab Discord</strong> an und bewirb dich direkt dort für deine Rolle – jede Bewerbung wird persönlich geprüft und freigeschaltet.',
    dc_cta: 'Auf Discord anmelden & bewerben →',
    dc_tester_title: 'Beta Tester werden',
    dc_tester_html: 'Unbegrenzte <strong>.WAV-Exporte</strong>, neue Synthesizer-Module &amp; Updates vorab testen. Auf Discord anmelden und direkt im Kanal <code>#tester-anmeldung</code> bewerben.',
    dc_creator_title: 'Creator werden',
    dc_creator_html: 'Eigene Hardtekk-/Uptempo-Kicks, Presets, Tracks oder Content rund um SVENTEKK teilen. Auf Discord anmelden und direkt im Kanal <code>#creator-anmeldung</code> bewerben.',

    sec_01: 'Multi-Genre Sound-Synthese Module',
    sec_02: '16-Step Live Groovebox & Kompletter Loop-Export',
    sec_03: 'Creator Preset-Wall & Sample-Library',
    sec_04: 'Korg Electribe 2 & FL Studio Workflow',
    sec_05: 'Studio Live-Chat & Community Lounge',
    sec_06: 'Feedback & Offene Fixes',

    tag_title: 'Producer Name & Voice-Tag',
    tag_badge: 'VOICE + FX',
    tag_sub: 'Generiere deinen Producer-Namen, lass ihn direkt sprechen oder nimm ihn mit Rave-FX als Korg-.WAV auf.',
    tag_label_name: 'PRODUCER NAME',
    tag_ph_name: 'z.B. SVENTEKK',
    tag_btn_gen: '🎲 Name',
    tag_label_phrase: 'TAG-SPRUCH',
    tag_label_voice: 'HD STIMME',
    tag_label_text: 'KOMPLETTER SPRECH-TEXT',
    tag_ph_text: 'Kompletter Satz für die Stimme...',
    tag_pitch: 'Stimme-Pitch (Tiefe)',
    tag_speed: 'Sprech-Tempo',
    tag_drive: 'FX-Drive (Aufnahme)',
    tag_btn_speak: '🔊 Stimme abspielen',
    tag_btn_rec: '🎙 3s Aufnehmen',
    tag_btn_play_rec: '▶ Aufnahme + FX',
    tag_btn_dl: '⬇ TAG .WAV',
    tag_rec_active: 'Aufnahme läuft (3s) – sprich deinen Namen!',
    tag_rec_ready: '✔ Aufnahme bereit – jetzt mit Rave-FX anhören oder als .WAV laden!',
    tag_need_rec: 'Bitte zuerst über "🎙 3s Aufnehmen" deine Stimme einsprechen.',
    tag_wip_notice: '⚠️ Keine fertige Version – dieses Modul befindet sich noch in Entwicklung.',

    preset_wall_title: 'Creator Preset-Wall',
    preset_wall_badge: 'COMMUNITY PRESETS',
    preset_wall_sub: 'Lade geprüfte Kick-, Uptempo- & Bass-Presets unserer Creator mit 1 Klick direkt in dein Studio.',
    preset_ph_title: 'Preset-Name (z.B. Zaag Abriss 210)...',
    preset_mod_kick: 'Hardtekk Kick',
    preset_mod_uptempo: 'Uptempo Kick',
    preset_mod_bass: 'Sub & Rave Bass',
    preset_btn_share: '+ Aktuelle Regler teilen',
    preset_btn_load: '▶ Laden & Anhören',
    preset_empty: 'Noch keine Creator-Presets geteilt.',
    preset_saved: '✔ Preset veröffentlicht!',
    preset_confirm_del: 'Dieses Preset wirklich löschen?',

    m1_title: 'Hardtekk & Rave Kick',
    m1_sub: 'Wähle den Kick-Stil oder tippe exakte Werte direkt in die Zahlenfelder.',
    m1_start: 'Start-Frequenz (Klick)',
    m1_end: 'End-Frequenz (Subbass)',
    m1_punch: 'Punch-Kurve (Knackigkeit)',
    m1_tail: 'Sub-Tail / Rumble-Dicke',
    m1_crunch: 'Crunch / Metall-Anteil',
    m1_drive: 'Drive (Verzerrung)',
    m1_len: 'Länge',

    m2_title: 'Uptempo Piep / Zaag Kick',
    m2_sub: '2-stufige Uptempo-Engine mit Piep-Tok, Sägezahn-Zaag & Terror-Clipper.',
    m2_start: 'Piep-Punch (Tok)',
    m2_end: 'Bass-Bauch (Body)',
    m2_zaag: 'Zaag-Säge (Oberton)',
    m2_snap: 'Tok-Snap (Geschwindigkeit)',
    m2_drive: 'Clip-Drive (Härte)',

    m3_title: 'Sub & Rave Bass',
    m3_sub: 'Druckvoller Sub-Bass, Offbeat-Saw & Dark Reese mit gleicher Reglerhöhe.',
    m3_freq: 'Grundton (Frequenz)',
    m3_subamt: 'Sub-Anteil (Tiefe)',
    m3_cutoff: 'Filter-Cutoff (Knurren)',
    m3_res: 'Resonanz (Filter-Q)',
    m3_drive: 'Bass-Drive (Sättigung)',
    m3_len: 'Länge (Decay)',

    m4_title: 'Snares, Claps & Hat-Rolls',
    m4_sub: 'Snare-, Clap- und Rim-Synthese mit Filter, Drive & 16tel-Hi-Hat Rolls.',
    m4_tone: 'Snare-Ton (Pitch)',
    m4_len: 'Snare-Länge (Decay)',
    m4_filter: 'Noise-Filter (Hochpass)',
    m4_drive: 'Snare-Drive (Härte)',
    m4_hits: 'Roll-Schläge',

    m5_title: 'Melodie Generator',
    m5_sub: 'Einfach Sound, Stil & Länge wählen – die komplette Melodie direkt anhören und als .WAV exportieren.',
    m5_style: 'MELODIE-STIL',
    m5_scale: 'TONART',
    m5_bars: 'Melodie-Länge',
    m5_bars_unit: 'Takte',
    m5_gate: 'Ton-Länge (Noten-Dauer)',
    m5_cutoff: 'Helligkeit (Filter)',
    m5_play: '▶ Komplette Melodie anhören',
    m5_stop: '■ Stoppen',
    m5_random: '🎲 Neue Melodie',
    m5_dl: '⬇ Melodie .WAV',

    btn_listen: 'Anhören',
    btn_wav: '.WAV Export',

    seq_title: 'Pattern Sequenzer & Voice Mode',
    seq_sub_html: 'Klicke auf <strong>MONO / POLY</strong> pro Spur, um Überlappungen zu steuern, oder exportiere den kompletten Loop am Stück.',
    seq_start: '▶ START',
    seq_stop: '■ STOP',
    seq_bar1: '1 Takt (16 Steps)',
    seq_bar2: '2 Takte (32 Steps)',
    seq_bar4: '4 Takte (64 Steps / Komplett)',
    seq_bar8: '8 Takte (128 Steps / Full Drop)',
    seq_dl: '⬇ Kompletter Loop (.WAV)',
    seq_clear: 'Leeren',
    seq_bpm: 'Master Tempo',

    lib_title: 'Eigene Audio-Clips & Kicks vorhören',
    lib_sub: 'Lade eigene .WAV oder .MP3 Dateien direkt im Browser zum Gegenhören.',
    lib_upload: '+ Eigene WAV/MP3 laden',

    wf_1_title: '1. Synthese statt KI',
    wf_1_sub: 'Hier werden keine KI-Tracks generiert – du formst eigene Kicks, Bässe, Snares/Claps, Melodie-Phrasen und komplette Loops per Synthesizer.',
    wf_2_title: '2. Kurze Korg-.WAV exportieren',
    wf_2_sub: 'Exportiere einzelne Sounds oder komplette Loops mit ultrakurzen Namen direkt als 16-Bit .WAV.',
    wf_3_title: '3. Korg Electribe 2 & FL Studio',
    wf_3_sub: 'Lade die Samples in deine Korg Electribe 2 oder in FL Studio, um sie dort weiter zu arrangieren, zu verzerren und auszuarbeiten.',

    chat_title: 'Studio Live-Chat',
    chat_sub: 'Tausche dich mit anderen Produzenten, Testern & Creatorn aus. Rollen sind live sichtbar.',
    chat_badge: 'NUR ANGEMELDET',
    chat_locked_title: 'Chat nur für angemeldete Nutzer',
    chat_locked_sub: 'Melde dich kostenlos an, um im Studio-Chat mitzulesen und mitzuschreiben.',
    chat_locked_btn: 'Jetzt anmelden / registrieren',
    chat_ph: 'Nachricht an die Community schreiben (max. 250 Zeichen)...',
    chat_send: 'Senden',
    chat_empty: 'Noch keine Nachrichten. Schreib die erste Nachricht!',
    chat_loading: 'Lade Chat...',
    chat_muted_perm: 'Du bist dauerhaft im Chat stummgeschaltet.',
    chat_muted_temp: 'Du bist noch {time} im Chat stummgeschaltet.',
    chat_mod_del: 'Nachricht löschen',
    chat_mod_mute: '10 Min stummen',
    chat_mod_kick: '5 Min kicken',
    chat_mod_ban: 'Account bannen',
    chat_confirm_ban: 'Account "{user}" wirklich dauerhaft bannen?',
    chat_confirm_kick: 'Account "{user}" für 5 Minuten kicken?',
    chat_confirm_del: 'Diese Nachricht wirklich löschen?',

    fix_title: 'Offene Fixes & Bug-Notizen',
    fix_badge: 'NUR ENTWICKLER',
    fix_sub: 'Schreib hier alles rein, was noch gefixt oder geändert werden muss – bleibt automatisch im Browser gespeichert.',
    fix_label: 'NOCH ZU FIXEN / ÄNDERN',
    fix_save: 'Notizen speichern',

    fb_title: 'Feedback & Ideen-Kasten',
    fb_sub: 'Wie knallt der Sound? Schreib deine Meinung, Bug-Meldungen oder Wünsche direkt ins Studio:',
    fb_rating: 'BEWERTUNG',
    fb_5star: '5 ★ Abriss!',
    fb_label: 'DEIN FEEDBACK / WUNSCH-FEATURE',
    fb_ph: 'z.B. Geiler Kick! Bau noch einen Rumble-Effekt oder mehr Presets ein...',
    fb_send: 'Feedback absenden',
    fb_sending: 'Sende...',
    fb_thanks: '✔ Danke! Dein Feedback wurde gespeichert.',
    fb_min_chars: 'Bitte schreibe mindestens 3 Zeichen Feedback.',

    admin_title: 'Nutzer-Ränge, Moderation & Feedback-Eingang',
    admin_refresh: '↻ Aktualisieren',
    admin_users_title_html: 'Registrierte Accounts, Ränge &amp; Moderation (<code>studio_profiles</code>)',
    admin_users_sub_html: 'Als <strong>Entwickler</strong> kannst du Ränge (<code>free</code>, <code>tester</code>, <code>creator</code>, <code>entwickler</code>) vergeben sowie Nutzer stummen, kicken oder bannen.',
    admin_col_user: 'Benutzername',
    admin_col_role: 'Rang',
    admin_col_change: 'Rang ändern',
    admin_col_mod: 'Moderation',
    admin_col_exports: 'Exports',
    admin_col_login: 'Letzter Login',
    admin_fb_title_html: 'Eingegangenes Feedback (<code>studio_feedback</code>)',
    admin_save: 'Speichern',
    admin_apply: 'OK',
    admin_status_active: 'Aktiv',
    admin_status_muted: 'Stumm',
    admin_status_kicked: 'Gekickt',
    admin_status_banned: 'Gebannt',
    mod_opt_none: 'Aktion wählen...',
    mod_opt_m10: 'Stumm (10m)',
    mod_opt_m60: 'Stumm (1h)',
    mod_opt_mperm: 'Dauer-Stumm',
    mod_opt_unmute: 'Entstummen',
    mod_opt_kick: 'Kick (5m)',
    mod_opt_ban: 'Bannen',
    mod_opt_unban: 'Entbannen',

    footer_suffix: 'Modular Web Audio Synthesizer (Keine KI-Songs)',

    err_username: 'Benutzername: 3–24 Zeichen (Buchstaben/Zahlen am Rand, sonst _ . - erlaubt).',
    err_password: 'Passwort muss mindestens 6 Zeichen lang sein.',
    err_exists: 'Dieser Benutzername existiert bereits. Bitte anmelden.',
    err_wrong_login: 'Benutzername oder Passwort falsch.',
    err_banned: 'Dein Account wurde von einem Entwickler gesperrt (gebannt).',
    err_kicked: 'Du wurdest vorübergehend gekickt. Bitte warte {sec} Sekunden.',
    err_muted_perm: 'Du bist dauerhaft im Chat stummgeschaltet.',
    err_muted: 'Du bist noch {sec} Sekunden im Chat stummgeschaltet.',
    err_cooldown: 'Bitte warte kurz (3 Sekunden) vor der nächsten Nachricht.',
    err_invalid_code: 'Ungültiger Tester-Code.',
    err_msg_len: 'Nachricht muss zwischen 1 und 250 Zeichen lang sein.',
    err_cannot_mod_dev: 'Entwickler können nicht moderiert werden.',
    err_dev_only: 'Nur Entwickler haben Zugriff auf diese Aktion.',
    err_creator_only: 'Nur Creator & Entwickler dürfen Presets veröffentlichen.',
    err_preset_title: 'Preset-Name muss 2–40 Zeichen lang sein.',
    err_session: 'Session abgelaufen. Bitte neu anmelden.'
  },
  en: {
    auth_badge: 'SVENTEKK CLOUD ACCOUNT',
    auth_title_login: 'Sign in & build sounds',
    auth_title_register: 'Create a SVENTEKK Account',
    auth_sub_html: 'Free account: <strong>5 free .WAV exports</strong> every 24 hours.',
    auth_tab_login: 'Sign In',
    auth_tab_register: 'Register',
    auth_label_user: 'USERNAME',
    auth_ph_user: 'e.g. sventekk07',
    auth_label_pass: 'PASSWORD',
    auth_label_code: 'TESTER CODE (OPTIONAL)',
    auth_ph_code: 'Leave empty for Free account',
    auth_security_html: '🔒 <strong>Secure Cloud Login:</strong> Encrypted session &amp; password protection via Supabase Auth.',
    auth_submit: 'Enter Studio',
    auth_connecting: 'Connecting...',

    role_modal_badge: 'ACTIVATE TESTER',
    role_modal_title: 'Enter Tester Code',
    role_modal_sub: 'Unlock unlimited .WAV exports for your Tester account.',
    role_modal_label: 'TESTER CODE',
    role_modal_ph: 'Enter code...',
    role_modal_hint_html: 'No code yet? Join our <strong>Discord</strong> and apply in <code>#tester-anmeldung</code>: <a href="https://discord.gg/jubxwavZa" target="_blank" rel="noopener noreferrer" style="color: #c7d2fe; font-weight: 700; text-decoration: underline; margin-left: 4px;">Open Discord &rarr;</a>',
    btn_cancel: 'Cancel',
    btn_activate: 'Activate',
    btn_checking: 'Checking...',

    limit_badge: 'FREE LIMIT REACHED',
    limit_title: 'No free .WAV downloads left',
    limit_sub_html: 'Your 5 free exports are used up. Want to become a <strong>Tester</strong> (unlimited downloads) or <strong>Creator</strong>? Join our Discord and apply directly there:',
    limit_btn_discord: 'Discord (Tester / Creator)',
    limit_btn_write: 'Write to me',
    btn_close: 'Close',

    top_dev_exports: 'DEV .WAV EXPORTS:',
    top_tester_code: 'Tester Code',
    top_login_btn: 'Sign In / Register',
    top_logout_btn: 'Sign Out',
    guest_name: 'Not signed in (Guest)',
    guest_role: 'GUEST',
    guest_timer: 'Sign in for 5 free .WAV exports / 24h',
    badge_login_needed: 'LOGIN NEEDED',
    unlimited_timer: 'Role "{role}" active – unlimited studio exports',
    reset_timer: '5 free exports reset in: {time}',
    full_quota_timer: 'Full 24h quota available (5 .WAV exports)',
    fb_hint_guest: 'Sending as: Guest',
    fb_hint_user: 'Sending as: {user} ({role})',

    hero_title_html: 'Hardtekk &amp; <span class="accent">Uptempo</span> Sample Studio',
    hero_desc: 'Real-time synthesizer workshop for custom Hardtekk & Uptempo kicks, basslines, snares/claps/rims, hat rolls and full rave melodies with exact numeric input.',
    hero_notice_html: '<strong>What is this website for?</strong> No AI-generated songs here! You synthesize your own kicks, basses, snares, melody phrases and full pattern loops as <strong>.WAV samples</strong> to arrange, chop and process on your <strong>Korg Electribe 2</strong> or in <strong>FL Studio</strong>.',
    hero_status_right: 'NO AI · 100% SYNTHESIS',
    hero_status_ready: 'READY TO SYNTHESIZE',
    hero_discord_pill: 'Discord Server',

    cl_title: 'New in Version 0.4',
    cl_korg_btn: 'Open Korg Live →',
    cl_1_title: 'DE / EN & Live Chat',
    cl_1_html: 'Full <strong>DE / EN</strong> translation, members-only Studio Chat with visible role badges &amp; developer moderation.',
    cl_2_title: 'Creator Role & Preset Wall',
    cl_2_html: 'New <strong>Creator</strong> role with a Community Preset Wall to share &amp; 1-click load Kicks, Uptempo &amp; Bass.',
    cl_3_title: 'Voice Tag & Live Scope',
    cl_3_html: 'New <strong>Producer Tag &amp; Voice</strong> generator, live oscilloscope, 2-stage Uptempo engine &amp; short Korg filenames.',

    dc_pill: 'DISCORD COMMUNITY · SVENTEKK-LAB',
    dc_title: 'Want to become a Tester or Creator?',
    dc_sub_html: 'Join our <strong>SVENTEKK-Lab Discord</strong> and apply directly there for your role – every application is personally reviewed and approved.',
    dc_cta: 'Join Discord & Apply →',
    dc_tester_title: 'Become a Beta Tester',
    dc_tester_html: 'Unlimited <strong>.WAV exports</strong>, early access to new synth modules &amp; updates. Join Discord and apply in <code>#tester-anmeldung</code>.',
    dc_creator_title: 'Become a Creator',
    dc_creator_html: 'Share your own Hardtekk/Uptempo kicks, presets, tracks or SVENTEKK content. Join Discord and apply in <code>#creator-anmeldung</code>.',

    sec_01: 'Multi-Genre Sound Synthesis Modules',
    sec_02: '16-Step Live Groovebox & Full Loop Export',
    sec_03: 'Creator Preset Wall & Sample Library',
    sec_04: 'Korg Electribe 2 & FL Studio Workflow',
    sec_05: 'Studio Live Chat & Community Lounge',
    sec_06: 'Feedback & Open Fixes',

    tag_title: 'Producer Name & Voice Tag',
    tag_badge: 'VOICE + FX',
    tag_sub: 'Generate your producer name, let a voice speak it live, or record with rave FX as a Korg-ready .WAV.',
    tag_label_name: 'PRODUCER NAME',
    tag_ph_name: 'e.g. SVENTEKK',
    tag_btn_gen: '🎲 Name',
    tag_label_phrase: 'TAG PHRASE',
    tag_label_voice: 'HD VOICE',
    tag_label_text: 'FULL SPOKEN TEXT',
    tag_ph_text: 'Complete sentence for the voice...',
    tag_pitch: 'Voice Pitch (Depth)',
    tag_speed: 'Speech Speed',
    tag_drive: 'FX Drive (Recording)',
    tag_btn_speak: '🔊 Speak Tag',
    tag_btn_rec: '🎙 Record 3s',
    tag_btn_play_rec: '▶ Play + FX',
    tag_btn_dl: '⬇ TAG .WAV',
    tag_rec_active: 'Recording (3s) – speak your tag now!',
    tag_rec_ready: '✔ Recording ready – preview with Rave FX or export .WAV!',
    tag_need_rec: 'Please record your voice first using "🎙 Record 3s".',
    tag_wip_notice: '⚠️ Not a final version – this module is still in development.',

    preset_wall_title: 'Creator Preset Wall',
    preset_wall_badge: 'COMMUNITY PRESETS',
    preset_wall_sub: 'Load curated Kick, Uptempo & Bass presets from our Creators straight into your studio in 1 click.',
    preset_ph_title: 'Preset name (e.g. Zaag Madness 210)...',
    preset_mod_kick: 'Hardtekk Kick',
    preset_mod_uptempo: 'Uptempo Kick',
    preset_mod_bass: 'Sub & Rave Bass',
    preset_btn_share: '+ Share Current Knobs',
    preset_btn_load: '▶ Load & Play',
    preset_empty: 'No Creator presets shared yet.',
    preset_saved: '✔ Preset published!',
    preset_confirm_del: 'Delete this preset?',

    m1_title: 'Hardtekk & Rave Kick',
    m1_sub: 'Pick a kick style or type exact values directly into the number boxes.',
    m1_start: 'Start Frequency (Click)',
    m1_end: 'End Frequency (Sub Bass)',
    m1_punch: 'Punch Curve (Snappiness)',
    m1_tail: 'Sub Tail / Rumble Weight',
    m1_crunch: 'Crunch / Metallic Grit',
    m1_drive: 'Drive (Distortion)',
    m1_len: 'Length',

    m2_title: 'Uptempo Piep / Zaag Kick',
    m2_sub: '2-stage Uptempo engine with Piep tok, sawtooth Zaag tail & Terror brickwall clipper.',
    m2_start: 'Piep Punch (Tok)',
    m2_end: 'Bass Body',
    m2_zaag: 'Zaag Saw (Harmonics)',
    m2_snap: 'Tok Snap (Speed)',
    m2_drive: 'Clip Drive (Hardness)',

    m3_title: 'Sub & Rave Bass',
    m3_sub: 'Punchy Sub Bass, Offbeat Saw & Dark Reese with clean low-end control.',
    m3_freq: 'Root Pitch (Frequency)',
    m3_subamt: 'Sub Level (Depth)',
    m3_cutoff: 'Filter Cutoff (Growl)',
    m3_res: 'Resonance (Filter Q)',
    m3_drive: 'Bass Drive (Saturation)',
    m3_len: 'Length (Decay)',

    m4_title: 'Snares, Claps & Hat Rolls',
    m4_sub: 'Snare, clap and rim synthesis with filter, drive & 16th hi-hat rolls.',
    m4_tone: 'Snare Pitch (Tone)',
    m4_len: 'Snare Length (Decay)',
    m4_filter: 'Noise Filter (Highpass)',
    m4_drive: 'Snare Drive (Punch)',
    m4_hits: 'Roll Hits',

    m5_title: 'Melody Generator',
    m5_sub: 'Simply pick sound, style & length – preview the complete melody and export as .WAV.',
    m5_style: 'MELODY STYLE',
    m5_scale: 'KEY / SCALE',
    m5_bars: 'Melody Length',
    m5_bars_unit: 'Bars',
    m5_gate: 'Note Length (Duration)',
    m5_cutoff: 'Brightness (Filter)',
    m5_play: '▶ Play Full Melody',
    m5_stop: '■ Stop',
    m5_random: '🎲 Random Melody',
    m5_dl: '⬇ Melody .WAV',

    btn_listen: 'Preview',
    btn_wav: '.WAV Export',

    seq_title: 'Pattern Sequencer & Voice Mode',
    seq_sub_html: 'Click <strong>MONO / POLY</strong> per track to control voice overlap, or export the complete multi-bar loop.',
    seq_start: '▶ START',
    seq_stop: '■ STOP',
    seq_bar1: '1 Bar (16 Steps)',
    seq_bar2: '2 Bars (32 Steps)',
    seq_bar4: '4 Bars (64 Steps / Full)',
    seq_bar8: '8 Bars (128 Steps / Drop)',
    seq_dl: '⬇ Full Loop (.WAV)',
    seq_clear: 'Clear',
    seq_bpm: 'Master Tempo',

    lib_title: 'Preview Custom Audio Clips & Kicks',
    lib_sub: 'Load your own .WAV or .MP3 files directly in the browser to compare.',
    lib_upload: '+ Load WAV/MP3',

    wf_1_title: '1. Synthesis instead of AI',
    wf_1_sub: 'No AI tracks here – sculpt your own kicks, basses, snares/claps, melody hooks and full loops via real-time synth.',
    wf_2_title: '2. Short Korg-ready .WAV Export',
    wf_2_sub: 'Export single shots or full loops with ultra-short filenames directly as 16-bit .WAV.',
    wf_3_title: '3. Korg Electribe 2 & FL Studio',
    wf_3_sub: 'Load your samples straight into your Korg Electribe 2 or FL Studio to arrange, distort and finish your track.',

    chat_title: 'Studio Live Chat',
    chat_sub: 'Hang out with fellow producers, testers & creators. Roles are shown live.',
    chat_badge: 'MEMBERS ONLY',
    chat_locked_title: 'Chat for signed-in users only',
    chat_locked_sub: 'Sign in for free to read and post in the Studio Live Chat.',
    chat_locked_btn: 'Sign In / Register now',
    chat_ph: 'Write a message to the community (max 250 chars)...',
    chat_send: 'Send',
    chat_empty: 'No messages yet. Say hi!',
    chat_loading: 'Loading chat...',
    chat_muted_perm: 'You are permanently muted in chat.',
    chat_muted_temp: 'You are muted in chat for {time}.',
    chat_mod_del: 'Delete message',
    chat_mod_mute: 'Mute 10m',
    chat_mod_kick: 'Kick 5m',
    chat_mod_ban: 'Ban account',
    chat_confirm_ban: 'Permanently ban account "{user}"?',
    chat_confirm_kick: 'Kick account "{user}" for 5 minutes?',
    chat_confirm_del: 'Delete this message?',

    fix_title: 'Open Fixes & Bug Notes',
    fix_badge: 'DEV ONLY',
    fix_sub: 'Write down bugs and todos here – saved automatically in your browser.',
    fix_label: 'TO FIX / CHANGE',
    fix_save: 'Save notes',

    fb_title: 'Feedback & Feature Box',
    fb_sub: 'How hard does it hit? Send your feedback, bug reports or feature ideas straight to the studio:',
    fb_rating: 'RATING',
    fb_5star: '5 ★ Banger!',
    fb_label: 'YOUR FEEDBACK / FEATURE IDEA',
    fb_ph: 'e.g. Sick kick! Add a rumble effect or more presets...',
    fb_send: 'Send Feedback',
    fb_sending: 'Sending...',
    fb_thanks: '✔ Thanks! Your feedback has been saved.',
    fb_min_chars: 'Please write at least 3 characters of feedback.',

    admin_title: 'User Roles, Moderation & Feedback Inbox',
    admin_refresh: '↻ Refresh',
    admin_users_title_html: 'Registered Accounts, Roles &amp; Moderation (<code>studio_profiles</code>)',
    admin_users_sub_html: 'As <strong>Developer</strong> you can assign roles (<code>free</code>, <code>tester</code>, <code>creator</code>, <code>entwickler</code>) and mute, kick or ban users.',
    admin_col_user: 'Username',
    admin_col_role: 'Role',
    admin_col_change: 'Change Role',
    admin_col_mod: 'Moderation',
    admin_col_exports: 'Exports',
    admin_col_login: 'Last Login',
    admin_fb_title_html: 'Incoming Feedback (<code>studio_feedback</code>)',
    admin_save: 'Save',
    admin_apply: 'Go',
    admin_status_active: 'Active',
    admin_status_muted: 'Muted',
    admin_status_kicked: 'Kicked',
    admin_status_banned: 'Banned',
    mod_opt_none: 'Action...',
    mod_opt_m10: 'Mute (10m)',
    mod_opt_m60: 'Mute (1h)',
    mod_opt_mperm: 'Perm Mute',
    mod_opt_unmute: 'Unmute',
    mod_opt_kick: 'Kick (5m)',
    mod_opt_ban: 'Ban',
    mod_opt_unban: 'Unban',

    footer_suffix: 'Modular Web Audio Synthesizer (No AI Songs)',

    err_username: 'Username: 3–24 chars (letters/numbers at start & end, _ . - allowed).',
    err_password: 'Password must be at least 6 characters long.',
    err_exists: 'This username already exists. Please sign in.',
    err_wrong_login: 'Wrong username or password.',
    err_banned: 'Your account has been banned by a developer.',
    err_kicked: 'You were temporarily kicked. Please wait {sec} seconds.',
    err_muted_perm: 'You are permanently muted in chat.',
    err_muted: 'You are muted in chat for another {sec} seconds.',
    err_cooldown: 'Please wait 3 seconds before sending the next message.',
    err_invalid_code: 'Invalid tester code.',
    err_msg_len: 'Message must be between 1 and 250 characters.',
    err_cannot_mod_dev: 'Developers cannot be moderated.',
    err_dev_only: 'Only developers can perform this action.',
    err_creator_only: 'Only Creators & Developers can publish presets.',
    err_preset_title: 'Preset name must be 2–40 characters.',
    err_session: 'Session expired. Please sign in again.'
  }
};

function t(key, vars = null) {
  const dict = I18N[currentLang] || I18N.de;
  let str = dict[key] !== undefined ? dict[key] : (I18N.de[key] || key);
  if (vars) {
    Object.keys(vars).forEach(k => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k]));
    });
  }
  return str;
}

function getRoleDisplayLabel(role) {
  const r = String(role || 'free').toLowerCase();
  if (r === 'entwickler') return currentLang === 'en' ? 'DEV' : 'ENTWICKLER';
  if (r === 'creator') return 'CREATOR';
  if (r === 'tester') return 'TESTER';
  return 'FREE';
}

function translateServerError(rawMsg) {
  const msg = String(rawMsg || '');
  if (msg.includes('ACCOUNT_BANNED')) return t('err_banned');
  const kickMatch = msg.match(/ACCOUNT_KICKED:(\d+)/);
  if (kickMatch) return t('err_kicked', { sec: kickMatch[1] });
  if (msg.includes('ACCOUNT_KICKED')) return t('err_kicked', { sec: 300 });
  if (msg.includes('CHAT_MUTED_PERM')) return t('err_muted_perm');
  const muteMatch = msg.match(/CHAT_MUTED:(\d+)/);
  if (muteMatch) return t('err_muted', { sec: muteMatch[1] });
  if (msg.includes('CHAT_COOLDOWN')) return t('err_cooldown');
  if (msg.includes('INVALID_TESTER_CODE')) return t('err_invalid_code');
  if (msg.includes('INVALID_MESSAGE_LENGTH')) return t('err_msg_len');
  if (msg.includes('CANNOT_MOD_DEV')) return t('err_cannot_mod_dev');
  if (msg.includes('CREATOR_ONLY')) return t('err_creator_only');
  if (msg.includes('INVALID_PRESET_TITLE')) return t('err_preset_title');
  if (msg.includes('DEV_ONLY')) return t('err_dev_only');
  if (msg.includes('NOT_LOGGED_IN')) return t('err_session');
  return msg;
}

function initLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === 'en' || saved === 'de') currentLang = saved;
  } catch (e) {}
  applyTranslations();
}

function setLanguage(lang) {
  if (lang !== 'de' && lang !== 'en') return;
  currentLang = lang;
  try { localStorage.setItem(STORAGE_LANG_KEY, lang); } catch (e) {}
  applyTranslations();
}

function applyTranslations() {
  document.documentElement.lang = currentLang;

  const btnDe = document.getElementById('lang-btn-de');
  const btnEn = document.getElementById('lang-btn-en');
  if (btnDe) btnDe.classList.toggle('active', currentLang === 'de');
  if (btnEn) btnEn.classList.toggle('active', currentLang === 'en');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (key) el.innerHTML = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });

  const authTitle = document.getElementById('auth-modal-title');
  if (authTitle) {
    authTitle.textContent = authMode === 'login' ? t('auth_title_login') : t('auth_title_register');
  }

  if (typeof setMelodyButtonState === 'function' && typeof isMelodyPlaying !== 'undefined') {
    setMelodyButtonState(isMelodyPlaying);
  }
  const seqBtn = document.getElementById('btn-seq-play');
  if (seqBtn && typeof isPlaying !== 'undefined') {
    seqBtn.innerText = isPlaying ? t('seq_stop') : t('seq_start');
  }

  updateAccountUI();
  renderChatUI();
  renderCreatorPresetsUI();
  if (currentUser && canViewAdminPanel(currentUser)) {
    loadAdminData();
  }
}

/* =========================================================================
   3. HILFSFUNKTIONEN & AUTH-SESSION (JWT)
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
   4. SUPABASE AUTH & RPC-FUNKTIONEN
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
      throw new Error(t('err_exists'));
    }
    throw new Error(msg);
  }
  const data = await res.json();
  if (!data.access_token || !data.refresh_token) {
    throw new Error('Confirm email in Supabase Auth -> Providers -> Email must be OFF.');
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
      throw new Error(t('err_wrong_login'));
    }
    throw new Error(msg);
  }
  const data = await res.json();
  if (!data.access_token || !data.refresh_token) {
    throw new Error(t('err_wrong_login'));
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
  if (!token) throw new Error('NOT_LOGGED_IN');

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
    if (!refreshed) throw new Error('NOT_LOGGED_IN');
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
   5. RÄNGE, LOGIN & MODERATIONS-SCHUTZ
   ========================================================================= */
function canEditUserRoles(user) {
  if (!user) return false;
  return getEffectiveRole(user) === 'entwickler';
}

function canViewAdminPanel(user) {
  if (!user) return false;
  return getEffectiveRole(user) === 'entwickler';
}

function canPublishPresets(user) {
  if (!user) return false;
  const r = getEffectiveRole(user);
  return r === 'creator' || r === 'entwickler';
}

function closeAuthModal() { document.getElementById('auth-modal').classList.remove('open'); }
function closeLimitModal() { document.getElementById('limit-modal').classList.remove('open'); }
function closeRoleModal() { document.getElementById('role-modal').classList.remove('open'); }

function jumpToFeedbackFromLimit() {
  closeLimitModal();
  const msgEl = document.getElementById('feedback-message');
  if (msgEl) {
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => msgEl.focus(), 300);
  }
}

function handleForcedLogoutIfModerated(rawErrMsg) {
  const msg = String(rawErrMsg || '');
  if (msg.includes('ACCOUNT_BANNED') || msg.includes('ACCOUNT_KICKED')) {
    stopChatPolling();
    clearAuthSession();
    currentUser = null;
    chatMessages = [];
    updateAccountUI();
    renderChatUI();
    const readable = translateServerError(msg);
    setStatus(readable.toUpperCase());
    alert(readable);
    return true;
  }
  return false;
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
      setStatus('24H EXPORT-LIMIT (0/5)');
      return false;
    }
    return true;
  } catch (e) {
    if (!handleForcedLogoutIfModerated(e.message)) {
      setStatus('EXPORT ERROR');
      alert(translateServerError(e.message));
    }
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
  if (user.role === 'entwickler' || user.role === 'creator' || user.role === 'tester' || user.role === 'free') {
    return user.role;
  }
  return 'free';
}

function hasUnlimitedExports(user) {
  if (!user) return false;
  const r = getEffectiveRole(user);
  return r === 'tester' || r === 'creator' || r === 'entwickler';
}

async function loadSession() {
  localStorage.removeItem('sventekk_local_dev_mode');
  sessionStorage.removeItem('sventekk_owner_dev_v1');

  const token = await getValidAccessToken();
  if (!token) {
    currentUser = null;
    stopChatPolling();
    updateAccountUI();
    renderChatUI();
    return;
  }

  try {
    const profile = await sbRpc('touch_login');
    currentUser = profile || null;
  } catch (e) {
    const msg = String(e.message || '');
    clearAuthSession();
    currentUser = null;
    if (msg.includes('ACCOUNT_BANNED') || msg.includes('ACCOUNT_KICKED')) {
      setTimeout(() => alert(translateServerError(msg)), 150);
    }
  }

  updateAccountUI();
  loadCreatorPresets();
  if (currentUser) {
    startChatPolling();
  } else {
    stopChatPolling();
    renderChatUI();
  }
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
  stopChatPolling();
  clearAuthSession();
  currentUser = null;
  chatMessages = [];
  updateAccountUI();
  renderChatUI();
  setStatus(currentLang === 'en' ? 'SIGNED OUT' : 'ABGEMELDET');
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
    setStatus(currentLang === 'en' ? 'PLEASE SIGN IN FIRST' : 'BITTE ZUERST ANMELDEN');
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
    errEl.innerText = t('err_username');
    return;
  }
  if (pass.length < 6) {
    errEl.innerText = t('err_password');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = t('auth_connecting');
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
          codeHint = ' (CODE -> FREE)';
        }
      }

      currentUser = profile;
      closeAuthModal();
      updateAccountUI();
      startChatPolling();
      setStatus(`WELCOME ${username.toUpperCase()} (${getRoleDisplayLabel(getEffectiveRole(currentUser))})${codeHint}`);
    } else {
      await sbAuthSignIn(username, pass);
      try {
        currentUser = await sbRpc('touch_login');
      } catch (loginErr) {
        clearAuthSession();
        throw loginErr;
      }
      closeAuthModal();
      updateAccountUI();
      startChatPolling();
      setStatus(`LOGIN: ${username.toUpperCase()}`);
    }
  } catch (e) {
    errEl.innerText = translateServerError(e.message || 'Cloud error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = t('auth_submit');
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
    msgEl.innerText = t('err_invalid_code');
    return;
  }

  btn.disabled = true;
  btn.innerText = t('btn_checking');
  msgEl.innerText = '';

  try {
    const updated = await sbRpc('redeem_tester_code', { p_code: entered });
    currentUser = updated || currentUser;
    closeRoleModal();
    updateAccountUI();
    setStatus(`ROLE "${getRoleDisplayLabel(getEffectiveRole(currentUser))}" ACTIVE!`);
  } catch (e) {
    if (!handleForcedLogoutIfModerated(e.message)) {
      msgEl.style.color = '#fca5a5';
      msgEl.innerText = translateServerError(e.message);
    }
  } finally {
    btn.disabled = false;
    btn.innerText = t('btn_activate');
  }
}

function switchAuthTab(mode) {
  authMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-register').classList.toggle('active', mode === 'register');
  document.getElementById('auth-modal-title').innerText =
    mode === 'login' ? t('auth_title_login') : t('auth_title_register');
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

  if (!avatarEl) return;

  if (!currentUser) {
    avatarEl.innerText = '?';
    nameEl.innerText = t('guest_name');
    roleBadgeEl.innerText = t('guest_role');
    roleBadgeEl.className = 'role-tag role-free';
    timerEl.innerText = t('guest_timer');
    badgeEl.innerText = t('badge_login_needed');
    badgeEl.className = 'credit-badge empty';
    roleCodeBtn.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    adminPanel.style.display = 'none';
    const presetForm = document.getElementById('creator-preset-composer');
    if (presetForm) presetForm.style.display = 'none';
    updateDevDownloadCounterVisibility();
    if (fbUserHint) fbUserHint.innerText = t('fb_hint_guest');
    return;
  }

  const role = getEffectiveRole(currentUser);
  const roleLabel = getRoleDisplayLabel(role);
  avatarEl.innerText = (currentUser.username || '?').charAt(0).toUpperCase();
  nameEl.innerText = currentUser.username || 'User';
  roleBadgeEl.innerText = roleLabel;
  roleBadgeEl.className = `role-tag role-${role}`;

  roleCodeBtn.style.display = (role === 'tester' || role === 'creator' || role === 'entwickler') ? 'none' : 'inline-block';
  loginBtn.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
  if (fbUserHint) fbUserHint.innerText = t('fb_hint_user', { user: currentUser.username, role: roleLabel });

  if (canViewAdminPanel(currentUser)) {
    if (adminPanel.style.display === 'none') {
      adminPanel.style.display = 'block';
      loadAdminData();
    }
  } else {
    adminPanel.style.display = 'none';
  }
  updateDevDownloadCounterVisibility();
  const presetForm = document.getElementById('creator-preset-composer');
  if (presetForm) presetForm.style.display = canPublishPresets(currentUser) ? 'flex' : 'none';
  updateChatMuteNotice();

  if (hasUnlimitedExports(currentUser)) {
    badgeEl.innerText = `∞ ${roleLabel}`;
    badgeEl.className = `credit-badge unlimited role-credit-${role}`;
    timerEl.innerText = t('unlimited_timer', { role: roleLabel });
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
    ? t('reset_timer', { time: timeStr })
    : t('full_quota_timer');

  const modalCd = document.getElementById('modal-countdown');
  if (modalCd) modalCd.innerText = timeStr;
}

setInterval(updateAccountUI, 1000);

/* =========================================================================
   6. STUDIO LIVE-CHAT & ENTWICKLER-MODERATION
   ========================================================================= */
function toggleChatDrawer(forceState = null) {
  const drawer = document.getElementById('chat-drawer');
  if (!drawer) return;
  const shouldOpen = forceState === null ? !drawer.classList.contains('open') : Boolean(forceState);
  drawer.classList.toggle('open', shouldOpen);
  document.body.classList.toggle('chat-open', shouldOpen);

  if (shouldOpen && currentUser) {
    loadChatMessages(true);
    setTimeout(() => {
      const inputEl = document.getElementById('chat-input');
      if (inputEl && !inputEl.disabled) inputEl.focus();
    }, 220);
  }
}

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') {
    const drawer = document.getElementById('chat-drawer');
    if (drawer && drawer.classList.contains('open')) {
      toggleChatDrawer(false);
    }
  }
});

function stopChatPolling() {
  if (chatPollTimer) {
    clearInterval(chatPollTimer);
    chatPollTimer = null;
  }
}

function startChatPolling() {
  stopChatPolling();
  chatPollTicks = 0;
  renderChatUI();
  loadChatMessages(true);
  chatPollTimer = setInterval(() => {
    if (!currentUser || document.visibilityState !== 'visible') return;
    chatPollTicks += 1;
    loadChatMessages(false);
    // Alle ~15s serverseitig prüfen, ob User gekickt/gebannt/gemutet/befördert wurde
    if (chatPollTicks % 3 === 0) {
      sbRpc('touch_login')
        .then(profile => {
          if (profile) {
            currentUser = profile;
            updateAccountUI();
          }
        })
        .catch(err => handleForcedLogoutIfModerated(err.message));
    }
  }, 5000);
}

function updateChatMuteNotice() {
  const noticeEl = document.getElementById('chat-mute-notice');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('btn-chat-send');
  if (!noticeEl || !inputEl || !sendBtn || !currentUser) return;

  if (currentUser.is_muted_perm) {
    noticeEl.style.display = 'block';
    noticeEl.textContent = t('chat_muted_perm');
    inputEl.disabled = true;
    sendBtn.disabled = true;
    return;
  }

  const mutedUntilMs = currentUser.muted_until ? new Date(currentUser.muted_until).getTime() : 0;
  if (mutedUntilMs > Date.now()) {
    noticeEl.style.display = 'block';
    noticeEl.textContent = t('chat_muted_temp', { time: formatTimeLeft(mutedUntilMs - Date.now()) });
    inputEl.disabled = true;
    sendBtn.disabled = true;
    return;
  }

  noticeEl.style.display = 'none';
  inputEl.disabled = false;
  sendBtn.disabled = false;
}

async function loadChatMessages(scrollToEnd = false) {
  if (!currentUser) {
    renderChatUI();
    return;
  }
  const token = await getValidAccessToken();
  if (!token) return;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/studio_chat?select=id,username,role,message,created_at&order=created_at.desc&limit=45`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return;
    const rows = await res.json();
    const listEl = document.getElementById('chat-messages');
    const wasNearBottom = listEl ? (listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight < 60) : true;
    chatMessages = Array.isArray(rows) ? rows.reverse() : [];
    renderChatUI();
    if (listEl && (scrollToEnd || wasNearBottom)) {
      listEl.scrollTop = listEl.scrollHeight;
    }
  } catch (e) {}
}

function renderChatUI() {
  const lockedEl = document.getElementById('chat-locked-view');
  const activeEl = document.getElementById('chat-logged-in-view');
  const listEl = document.getElementById('chat-messages');
  if (!lockedEl || !activeEl || !listEl) return;

  if (!currentUser) {
    lockedEl.style.display = 'flex';
    activeEl.style.display = 'none';
    return;
  }

  lockedEl.style.display = 'none';
  activeEl.style.display = 'flex';
  updateChatMuteNotice();

  listEl.innerHTML = '';
  if (!chatMessages.length) {
    const empty = document.createElement('div');
    empty.className = 'chat-empty';
    empty.textContent = t('chat_empty');
    listEl.appendChild(empty);
    return;
  }

  const isDev = canEditUserRoles(currentUser);

  chatMessages.forEach(m => {
    const role = (m.role === 'entwickler' || m.role === 'creator' || m.role === 'tester') ? m.role : 'free';
    const item = document.createElement('div');
    item.className = 'chat-msg';

    const meta = document.createElement('div');
    meta.className = 'chat-msg-meta';

    const left = document.createElement('div');
    left.className = 'chat-msg-author';

    const roleTag = document.createElement('span');
    roleTag.className = `role-tag role-${role}`;
    roleTag.textContent = getRoleDisplayLabel(role);

    const nameSpan = document.createElement('strong');
    nameSpan.className = 'chat-username';
    nameSpan.textContent = m.username || 'User';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'chat-time';
    timeSpan.textContent = m.created_at
      ? new Date(m.created_at).toLocaleTimeString(currentLang === 'en' ? 'en-GB' : 'de-DE', { hour: '2-digit', minute: '2-digit' })
      : '';

    left.append(roleTag, nameSpan, timeSpan);
    meta.appendChild(left);

    if (isDev) {
      const modBar = document.createElement('div');
      modBar.className = 'chat-mod-bar';

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'chat-mod-btn';
      delBtn.title = t('chat_mod_del');
      delBtn.textContent = '×';
      delBtn.addEventListener('click', () => deleteChatMessage(m.id));
      modBar.appendChild(delBtn);

      if (role !== 'entwickler') {
        const muteBtn = document.createElement('button');
        muteBtn.type = 'button';
        muteBtn.className = 'chat-mod-btn';
        muteBtn.title = t('chat_mod_mute');
        muteBtn.textContent = '🔇';
        muteBtn.addEventListener('click', () => moderateUserFromUI(m.username, 'mute_10m'));

        const kickBtn = document.createElement('button');
        kickBtn.type = 'button';
        kickBtn.className = 'chat-mod-btn warn';
        kickBtn.title = t('chat_mod_kick');
        kickBtn.textContent = '👢';
        kickBtn.addEventListener('click', () => moderateUserFromUI(m.username, 'kick'));

        const banBtn = document.createElement('button');
        banBtn.type = 'button';
        banBtn.className = 'chat-mod-btn danger';
        banBtn.title = t('chat_mod_ban');
        banBtn.textContent = '⛔';
        banBtn.addEventListener('click', () => moderateUserFromUI(m.username, 'ban'));

        modBar.append(muteBtn, kickBtn, banBtn);
      }

      meta.appendChild(modBar);
    }

    const body = document.createElement('div');
    body.className = 'chat-msg-text';
    body.textContent = m.message || '';

    item.append(meta, body);
    listEl.appendChild(item);
  });
}

async function sendChatMessage() {
  if (!requireLoginOnly()) return;
  const inputEl = document.getElementById('chat-input');
  const statusEl = document.getElementById('chat-status');
  const sendBtn = document.getElementById('btn-chat-send');
  if (!inputEl) return;

  const text = inputEl.value.trim();
  if (!text) return;

  sendBtn.disabled = true;
  if (statusEl) statusEl.textContent = '';

  try {
    await sbRpc('send_chat_message', { p_message: text });
    inputEl.value = '';
    await loadChatMessages(true);
  } catch (e) {
    if (!handleForcedLogoutIfModerated(e.message)) {
      if (statusEl) {
        statusEl.style.color = '#fca5a5';
        statusEl.textContent = translateServerError(e.message);
      }
    }
  } finally {
    sendBtn.disabled = false;
    updateChatMuteNotice();
  }
}

async function deleteChatMessage(messageId) {
  if (!canEditUserRoles(currentUser)) return;
  if (!confirm(t('chat_confirm_del'))) return;
  try {
    await sbRpc('delete_chat_message', { p_message_id: messageId });
    await loadChatMessages(false);
  } catch (e) {
    alert(translateServerError(e.message));
  }
}

async function moderateUserFromUI(targetUsername, action) {
  if (!canEditUserRoles(currentUser) || !action) return;
  if (action === 'ban' && !confirm(t('chat_confirm_ban', { user: targetUsername }))) return;
  if (action === 'kick' && !confirm(t('chat_confirm_kick', { user: targetUsername }))) return;

  try {
    await sbRpc('moderate_user', {
      p_target_username: targetUsername,
      p_action: action
    });
    setStatus(`MOD ${action.toUpperCase()} -> ${String(targetUsername).toUpperCase()}`);
    await loadAdminData();
    await loadChatMessages(false);
  } catch (e) {
    alert(translateServerError(e.message));
  }
}

/* =========================================================================
   6B. CREATOR PRESET-WALL
   ========================================================================= */
async function loadCreatorPresets() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/studio_presets?select=id,user_id,username,role,title,module,params,created_at&order=created_at.desc&limit=24`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) return;
    const rows = await res.json();
    creatorPresets = Array.isArray(rows) ? rows : [];
    renderCreatorPresetsUI();
  } catch (e) {}
}

function renderCreatorPresetsUI() {
  const listEl = document.getElementById('creator-presets-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  if (!creatorPresets.length) {
    const empty = document.createElement('div');
    empty.className = 'chat-empty';
    empty.style.gridColumn = '1 / -1';
    empty.style.padding = '12px 0';
    empty.textContent = t('preset_empty');
    listEl.appendChild(empty);
    return;
  }

  const isDev = Boolean(currentUser && canEditUserRoles(currentUser));
  const myId = currentUser ? currentUser.id : null;

  creatorPresets.forEach(p => {
    const card = document.createElement('div');
    card.className = 'sample-item preset-card';

    const top = document.createElement('div');
    top.className = 'sample-top';

    const title = document.createElement('span');
    title.className = 'sample-title';
    title.textContent = p.title || 'Preset';

    const modChip = document.createElement('span');
    modChip.className = p.module === 'uptempo' ? 'chip orange' : 'chip';
    modChip.textContent = String(p.module || 'kick').toUpperCase();

    top.append(title, modChip);

    const byLine = document.createElement('div');
    byLine.className = 'preset-author-row';
    const r = (p.role === 'entwickler' || p.role === 'creator') ? p.role : 'creator';
    const roleTag = document.createElement('span');
    roleTag.className = `role-tag role-${r}`;
    roleTag.textContent = getRoleDisplayLabel(r);

    const author = document.createElement('span');
    author.className = 'timer-text';
    author.textContent = p.username || 'Creator';
    byLine.append(roleTag, author);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.className = p.module === 'uptempo' ? 'btn btn-orange' : 'btn btn-cyan';
    loadBtn.textContent = t('preset_btn_load');
    loadBtn.addEventListener('click', () => {
      if (typeof applyModulePreset === 'function') {
        applyModulePreset(p.module, p.params);
      }
    });
    actions.appendChild(loadBtn);

    if (isDev || (myId && p.user_id === myId)) {
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn btn-ghost';
      delBtn.style.flex = '0 0 auto';
      delBtn.textContent = '×';
      delBtn.addEventListener('click', () => deleteCreatorPreset(p.id));
      actions.appendChild(delBtn);
    }

    card.append(top, byLine, actions);
    listEl.appendChild(card);
  });
}

async function publishCreatorPreset() {
  if (!canPublishPresets(currentUser)) return;
  const titleEl = document.getElementById('preset-title-input');
  const modEl = document.getElementById('preset-module-select');
  const statusEl = document.getElementById('preset-publish-status');
  const btn = document.getElementById('btn-publish-preset');
  if (!titleEl || !modEl) return;

  const title = titleEl.value.trim();
  const mod = modEl.value || 'kick';
  if (title.length < 2) {
    if (statusEl) {
      statusEl.style.color = '#fca5a5';
      statusEl.textContent = t('err_preset_title');
    }
    return;
  }

  const params = typeof captureModulePreset === 'function' ? captureModulePreset(mod) : {};
  if (btn) btn.disabled = true;
  if (statusEl) statusEl.textContent = '';

  try {
    await sbRpc('publish_creator_preset', {
      p_title: title,
      p_module: mod,
      p_params: params
    });
    titleEl.value = '';
    if (statusEl) {
      statusEl.style.color = '#6ee7b7';
      statusEl.textContent = t('preset_saved');
    }
    await loadCreatorPresets();
  } catch (e) {
    if (statusEl) {
      statusEl.style.color = '#fca5a5';
      statusEl.textContent = translateServerError(e.message);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function deleteCreatorPreset(presetId) {
  if (!confirm(t('preset_confirm_del'))) return;
  try {
    await sbRpc('delete_creator_preset', { p_preset_id: presetId });
    await loadCreatorPresets();
  } catch (e) {
    alert(translateServerError(e.message));
  }
}

/* =========================================================================
   7. FEEDBACK & ADMIN-PANEL
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
    setStatus(`ROLE ${String(targetUsername).toUpperCase()} -> ${newRole.toUpperCase()}`);
    await loadAdminData();
    await loadChatMessages(false);
  } catch (e) {
    alert(translateServerError(e.message));
  }
}

function getUserModStatusLabel(u) {
  if (u.is_banned) return { text: t('admin_status_banned'), cls: 'mod-tag danger' };
  const kickedMs = u.kicked_until ? new Date(u.kicked_until).getTime() : 0;
  if (kickedMs > Date.now()) return { text: t('admin_status_kicked'), cls: 'mod-tag warn' };
  const mutedMs = u.muted_until ? new Date(u.muted_until).getTime() : 0;
  if (u.is_muted_perm || mutedMs > Date.now()) return { text: t('admin_status_muted'), cls: 'mod-tag warn' };
  return { text: t('admin_status_active'), cls: 'mod-tag ok' };
}

async function loadAdminData() {
  if (!canViewAdminPanel(currentUser)) return;
  const tbodyUsers = document.getElementById('admin-users-tbody');
  const tbodyFb = document.getElementById('admin-feedback-tbody');
  const allowRoleEdit = canEditUserRoles(currentUser);
  const token = await getValidAccessToken();

  if (!token || !tbodyUsers || !tbodyFb) return;

  try {
    const resU = await fetch(`${SUPABASE_URL}/rest/v1/studio_profiles?select=username,role,credits_used,last_login,muted_until,is_muted_perm,kicked_until,is_banned&order=last_login.desc`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` }
    });
    if (!resU.ok) throw new Error(`HTTP ${resU.status}`);
    const users = await resU.json();
    tbodyUsers.innerHTML = users.length ? '' : '<tr><td colspan="6">-</td></tr>';
    users.forEach(u => {
      const r = getEffectiveRole(u);
      const tr = document.createElement('tr');
      const dateStr = u.last_login
        ? new Date(u.last_login).toLocaleString(currentLang === 'en' ? 'en-GB' : 'de-DE')
        : '-';

      const tdUser = document.createElement('td');
      const strongUser = document.createElement('strong');
      strongUser.textContent = u.username || '-';
      tdUser.appendChild(strongUser);

      const modState = getUserModStatusLabel(u);
      const stateBadge = document.createElement('span');
      stateBadge.className = modState.cls;
      stateBadge.textContent = modState.text;
      tdUser.appendChild(document.createTextNode(' '));
      tdUser.appendChild(stateBadge);

      const tdRole = document.createElement('td');
      const roleSpan = document.createElement('span');
      roleSpan.className = `role-tag role-${r}`;
      roleSpan.textContent = getRoleDisplayLabel(r);
      tdRole.appendChild(roleSpan);

      const tdControl = document.createElement('td');
      if (allowRoleEdit) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex; gap:6px; align-items:center;';

        const select = document.createElement('select');
        select.className = 'role-select';
        ['free', 'tester', 'creator', 'entwickler'].forEach(optVal => {
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
        saveBtn.textContent = t('admin_save');
        saveBtn.addEventListener('click', () => assignUserRole(u.username, select.value));

        wrap.append(select, saveBtn);
        tdControl.appendChild(wrap);
      } else {
        tdControl.textContent = '-';
      }

      const tdMod = document.createElement('td');
      if (allowRoleEdit && r !== 'entwickler') {
        const modWrap = document.createElement('div');
        modWrap.style.cssText = 'display:flex; gap:6px; align-items:center;';

        const modSel = document.createElement('select');
        modSel.className = 'role-select';
        const actions = [
          ['', t('mod_opt_none')],
          ['mute_10m', t('mod_opt_m10')],
          ['mute_60m', t('mod_opt_m60')],
          ['mute_perm', t('mod_opt_mperm')],
          ['unmute', t('mod_opt_unmute')],
          ['kick', t('mod_opt_kick')],
          ['ban', t('mod_opt_ban')],
          ['unban', t('mod_opt_unban')]
        ];
        actions.forEach(([val, label]) => {
          const opt = document.createElement('option');
          opt.value = val;
          opt.textContent = label;
          modSel.appendChild(opt);
        });

        const modBtn = document.createElement('button');
        modBtn.type = 'button';
        modBtn.className = 'btn btn-orange';
        modBtn.style.cssText = 'padding:4px 8px; font-size:0.74rem; flex:0 0 auto;';
        modBtn.textContent = t('admin_apply');
        modBtn.addEventListener('click', () => {
          if (modSel.value) moderateUserFromUI(u.username, modSel.value);
        });

        modWrap.append(modSel, modBtn);
        tdMod.appendChild(modWrap);
      } else {
        const span = document.createElement('span');
        span.style.color = 'var(--text-dim)';
        span.textContent = r === 'entwickler' ? 'Geschützt' : '-';
        tdMod.appendChild(span);
      }

      const tdCredits = document.createElement('td');
      tdCredits.textContent = r !== 'free' ? '∞' : `${Number(u.credits_used) || 0} / ${FREE_CREDITS_MAX}`;

      const tdDate = document.createElement('td');
      tdDate.textContent = dateStr;

      tr.append(tdUser, tdRole, tdControl, tdMod, tdCredits, tdDate);
      tbodyUsers.appendChild(tr);
    });
  } catch (e) {
    tbodyUsers.innerHTML = '<tr><td colspan="6">Offline / Cloud error.</td></tr>';
  }

  try {
    const resF = await fetch(`${SUPABASE_URL}/rest/v1/studio_feedback?select=*&order=created_at.desc&limit=30`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` }
    });
    if (!resF.ok) throw new Error(`HTTP ${resF.status}`);
    const fbs = await resF.json();
    tbodyFb.innerHTML = fbs.length ? '' : '<tr><td colspan="5">-</td></tr>';
    fbs.forEach(f => {
      const tr = document.createElement('tr');
      const dateStr = f.created_at
        ? new Date(f.created_at).toLocaleString(currentLang === 'en' ? 'en-GB' : 'de-DE')
        : '-';
      const starsCount = Math.max(1, Math.min(5, Number(f.rating) || 5));

      const tdUser = document.createElement('td');
      const st = document.createElement('strong');
      st.textContent = f.username || 'Gast';
      tdUser.appendChild(st);

      const tdRate = document.createElement('td');
      tdRate.textContent = '★'.repeat(starsCount);

      const tdVer = document.createElement('td');
      tdVer.textContent = f.app_version || '-';

      const tdMsg = document.createElement('td');
      tdMsg.textContent = f.message || '';

      const tdDate = document.createElement('td');
      tdDate.textContent = dateStr;

      tr.append(tdUser, tdRate, tdVer, tdMsg, tdDate);
      tbodyFb.appendChild(tr);
    });
  } catch (e) {
    tbodyFb.innerHTML = '<tr><td colspan="5">Error loading feedback.</td></tr>';
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
    statusEl.innerText = t('fb_min_chars');
    return;
  }

  btn.disabled = true;
  btn.innerText = t('fb_sending');
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
    statusEl.innerText = t('fb_thanks');
    if (canViewAdminPanel(currentUser)) loadAdminData();
  } catch (e) {
    statusEl.style.color = '#fca5a5';
    statusEl.innerText = translateServerError(e.message);
  } finally {
    btn.disabled = false;
    btn.innerText = t('fb_send');
  }
}

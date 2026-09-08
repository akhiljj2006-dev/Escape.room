/**
 * ORION FINANCIAL — SECURITY CONTROL CENTER
 * Web Companion for Escape Room Experience
 * Core Application Engine & State Machine
 */

(function () {
  'use strict';

  // =========================================================================
  // AUDIO SYNTHESIZER (Web Audio API - No External Asset Dependencies)
  // =========================================================================
  class CyberAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playClick() {
      try {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
      } catch (e) {}
    }

    playGrant() {
      try {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

          gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + idx * 0.07 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(this.ctx.currentTime + idx * 0.07);
          osc.stop(this.ctx.currentTime + idx * 0.07 + 0.25);
        });
      } catch (e) {}
    }

    playDeny() {
      try {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);
      } catch (e) {}
    }

    playVictory() {
      try {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const melody = [
          { f: 523.25, d: 0.15 }, // C5
          { f: 659.25, d: 0.15 }, // E5
          { f: 783.99, d: 0.15 }, // G5
          { f: 1046.50, d: 0.4 }  // C6
        ];

        let time = this.ctx.currentTime;
        melody.forEach(note => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, time);

          gain.gain.setValueAtTime(0.18, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(time);
          osc.stop(time + note.d);
          time += note.d * 0.85;
        });
      } catch (e) {}
    }

    playWarningTick() {
      try {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    }
  }

  const audio = new CyberAudio();

  // =========================================================================
  // TRANSACTION DATASET (19 Records Extracted from 4.jpeg Ledger Image)
  // =========================================================================
  const TRANSACTION_RECORDS = [
    { date: '18 Aug', time: '18 Aug, 09:14 AM', employee: 'Rahul Mehta', transactionType: 'UPI Debit', amount: '₹1,240', beneficiary: 'FreshMart', bank: 'HDFC Bank', ref: 'UPI48291', status: 'PROCESSED' },
    { date: '18 Aug', time: '18 Aug, 11:32 AM', employee: 'Priya Shah', transactionType: 'NEFT Credit', amount: '₹52,000', beneficiary: 'TECHCORP', bank: 'ICICI Bank', ref: 'NTF19384', status: 'PROCESSED' },
    { date: '18 Aug', time: '18 Aug, 01:13 AM', employee: 'Danish Khan', transactionType: 'IMPS Debit', amount: '₹8,470', beneficiary: 'Northstar Logistics', bank: 'ORION BANK – BRANCH 04', ref: 'IMP73142', status: 'PROCESSED' },
    { date: '18 Aug', time: '18 Aug, 03:41 PM', employee: 'Arjun Patel', transactionType: 'UPI Debit', amount: '₹2,100', beneficiary: 'Fuel Station', bank: 'SBI', ref: 'UPI82147', status: 'PROCESSED' },
    { date: '18 Aug', time: '18 Aug, 06:22 PM', employee: 'Neha Thomas', transactionType: 'ATM Withdrawal', amount: '₹5,000', beneficiary: 'CENTRAL ATM', bank: 'Axis Bank', ref: 'ATM64172', status: 'PROCESSED' },
    { date: '18 Aug', time: '18 Aug, 02:47 AM', employee: 'Beena Rao', transactionType: 'NEFT Debit', amount: '₹14,240', beneficiary: 'Blackridge Holdings', bank: 'ORION BANK – BRANCH 04', ref: 'NTF51839', status: 'PROCESSED' },
    { date: '18 Aug', time: '18 Aug, 10:43 AM', employee: 'Rahul Mehta', transactionType: 'UPI Debit', amount: '₹860', beneficiary: 'Food Court', bank: 'HDFC Bank', ref: 'UPI31589', status: 'PROCESSED' },
    { date: '18 Aug', time: '18 Aug, 07:18 PM', employee: 'Priya Shah', transactionType: 'UPI Debit', amount: '₹1,580', beneficiary: 'Supermarket', bank: 'ICICI Bank', ref: 'UPI92841', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 03:26 AM', employee: 'Farhan Ali', transactionType: 'IMPS Debit', amount: '₹7,630', beneficiary: 'Redline Services', bank: 'ORION BANK – BRANCH 04', ref: 'IMP90421', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 08:54 AM', employee: 'Arjun Patel', transactionType: 'NEFT Debit', amount: '₹2,840', beneficiary: 'Electricity Board', bank: 'SBI', ref: 'NTF29481', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 12:16 PM', employee: 'Neha Thomas', transactionType: 'UPI Debit', amount: '₹740', beneficiary: 'Pharmacy', bank: 'Axis Bank', ref: 'UPI73105', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 04:32 PM', employee: 'Rahul Mehta', transactionType: 'UPI Debit', amount: '₹2,350', beneficiary: 'Book Store', bank: 'HDFC Bank', ref: 'UPI58421', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 03:58 AM', employee: 'Hari Menon', transactionType: 'NEFT Debit', amount: '₹11,110', beneficiary: 'Project Zero', bank: 'ORION BANK – BRANCH 04', ref: 'NTF66284', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 06:47 PM', employee: 'Priya Shah', transactionType: 'UPI Debit', amount: '₹920', beneficiary: 'Restaurant', bank: 'ICICI Bank', ref: 'UPI41729', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 09:21 PM', employee: 'Arjun Patel', transactionType: 'ATM Withdrawal', amount: '₹3,000', beneficiary: 'CITY ATM', bank: 'SBI', ref: 'ATM82514', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 10:05 AM', employee: 'Neha Thomas', transactionType: 'UPI Debit', amount: '₹1,120', beneficiary: 'Grocery Store', bank: 'Axis Bank', ref: 'UPI63825', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 02:34 PM', employee: 'Rahul Mehta', transactionType: 'NEFT Debit', amount: '₹3,420', beneficiary: 'Internet Provider', bank: 'HDFC Bank', ref: 'NTF47216', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 08:12 PM', employee: 'Priya Shah', transactionType: 'UPI Debit', amount: '₹680', beneficiary: 'Coffee Shop', bank: 'ICICI Bank', ref: 'UPI19473', status: 'PROCESSED' },
    { date: '19 Aug', time: '19 Aug, 11:07 AM', employee: 'Arjun Patel', transactionType: 'UPI Debit', amount: '₹1,450', beneficiary: 'Electronics Store', bank: 'SBI', ref: 'UPI52918', status: 'PROCESSED' }
  ];

  // =========================================================================
  // GAME CONSTANTS & CREDENTIALS
  // =========================================================================
  const GAME_CONSTANTS = {
    TOTAL_DURATION_SEC: 20 * 60, // 20:00 = 1200 seconds
    CREDENTIALS: {
      USERNAME: 'EMMA',
      PASSWORD: '5831'
    },
    CODES: {
      MOD1_ACCESS: '96241',
      MOD1_INVESTIGATION: '4268',
      MOD3_VAULT: 'VAULT',
      MOD4_FINAL: 'ORION-7X4-29Q'
    },
    STORAGE_KEY: 'orion_security_session_v1'
  };

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const defaultState = {
    view: 'login', // 'login' | 'dashboard'
    sessionActive: false,
    missionStarted: false,
    operatorName: 'Samuel Reyes',
    operatorId: 'EMP-44',
    timerRunning: false,
    timerSecondsLeft: GAME_CONSTANTS.TOTAL_DURATION_SEC,
    timerEndTimestamp: null,
    elapsedSeconds: 0,
    modules: {
      mod1: {
        accessUnlocked: false,
        completed: false
      },
      mod2: {
        accessUnlocked: true,
        completed: false
      },
      mod3: {
        accessUnlocked: false,
        completed: false
      },
      mod4: {
        accessUnlocked: true,
        completed: false
      }
    },
    gameWon: false,
    gameFailed: false
  };

  let state = JSON.parse(JSON.stringify(defaultState));
  let timerInterval = null;

  // DOM Elements Cache
  const DOM = {
    systemHeader: document.getElementById('system-header'),
    hudStatusDot: document.getElementById('hud-status-dot'),
    hudStatusText: document.getElementById('hud-status-text'),
    hudTimer: document.getElementById('hud-timer'),
    hudOperatorName: document.getElementById('hud-operator-name'),
    btnHudLogout: document.getElementById('btn-hud-logout'),
    dashOperatorDisplay: document.getElementById('dash-operator-display'),
    btnAudioToggle: document.getElementById('btn-audio-toggle'),
    audioLabel: document.getElementById('audio-label'),
    audioIcon: document.getElementById('audio-icon'),

    // Floating Audio Bar on Login View
    loginAudioBar: document.getElementById('login-audio-bar'),
    btnAudioToggleLogin: document.getElementById('btn-audio-toggle-login'),
    audioIconLogin: document.getElementById('audio-icon-login'),
    audioLabelLogin: document.getElementById('audio-label-login'),

    // Views
    viewLogin: document.getElementById('view-login'),
    viewDashboard: document.getElementById('view-dashboard'),
    restrictedCount: document.getElementById('restricted-modules-count'),

    // Start Mission & Active Timer per 1.png & 2.png
    missionStartWrap: document.getElementById('mission-start-wrap'),
    btnStartMission: document.getElementById('btn-start-mission'),
    missionActiveTimer: document.getElementById('mission-active-timer'),
    loginCountdown: document.getElementById('login-countdown'),

    // Badges & Cards
    badgeMod1: document.getElementById('badge-module-1'),
    badgeMod2: document.getElementById('badge-module-2'),
    badgeMod3: document.getElementById('badge-module-3'),
    badgeMod4: document.getElementById('badge-module-4'),

    btnOpenMod1: document.getElementById('btn-open-mod-1'),
    btnOpenMod2: document.getElementById('btn-open-mod-2'),
    btnOpenMod3: document.getElementById('btn-open-mod-3'),
    btnOpenMod4: document.getElementById('btn-open-mod-4'),

    // Login Form & Password Toggle
    loginForm: document.getElementById('login-form'),
    inputLoginUsername: document.getElementById('login-username'),
    inputLoginPassword: document.getElementById('login-password'),
    btnTogglePassword: document.getElementById('btn-toggle-password'),
    eyeIcon: document.getElementById('eye-icon'),
    btnLoginSubmit: document.getElementById('btn-login-submit'),
    loginFeedback: document.getElementById('login-feedback'),

    // Login Success Modal
    modalLoginSuccess: document.getElementById('modal-login-success'),
    btnEnterControlCenter: document.getElementById('btn-enter-control-center'),

    // Module 1 Modal
    modalMod1: document.getElementById('modal-module-1'),
    btnCloseMod1: document.getElementById('btn-close-mod-1'),
    mod1LockedView: document.getElementById('mod1-locked-view'),
    mod1UnlockedView: document.getElementById('mod1-unlocked-view'),
    formMod1Access: document.getElementById('form-mod1-access'),
    inputMod1Access: document.getElementById('input-mod1-access'),
    feedbackMod1Access: document.getElementById('feedback-mod1-access'),
    txTbody: document.getElementById('transaction-tbody'),
    txSearchInput: document.getElementById('input-tx-search'),
    txCountLabel: document.getElementById('tx-records-count'),
    txTableHeaders: document.querySelectorAll('#transaction-table th'),
    formMod1Investigation: document.getElementById('form-mod1-investigation'),
    inputMod1Investigation: document.getElementById('input-mod1-investigation'),
    feedbackMod1Investigation: document.getElementById('feedback-mod1-investigation'),
    mod1InvestigationBadge: document.getElementById('mod1-investigation-badge'),

    // Module 2 Modal
    modalMod2: document.getElementById('modal-module-2'),
    btnCloseMod2: document.getElementById('btn-close-mod-2'),
    btnBackMod2: document.getElementById('btn-back-mod-2'),

    // Module 3 Modal
    modalMod3: document.getElementById('modal-module-3'),
    btnCloseMod3: document.getElementById('btn-close-mod-3'),
    mod3LockedView: document.getElementById('mod3-locked-view'),
    mod3UnlockedView: document.getElementById('mod3-unlocked-view'),
    formMod3Access: document.getElementById('form-mod3-access'),
    inputMod3Access: document.getElementById('input-mod3-access'),
    feedbackMod3Access: document.getElementById('feedback-mod3-access'),
    btnBackMod3: document.getElementById('btn-back-mod-3'),
    btnCopyCipher: document.getElementById('btn-copy-cipher'),
    copyStatusText: document.getElementById('copy-status-text'),
    copyIcon: document.getElementById('copy-icon'),
    copyToast: document.getElementById('copy-toast'),

    // Module 4 Modal
    modalMod4: document.getElementById('modal-module-4'),
    btnCloseMod4: document.getElementById('btn-close-mod-4'),
    mod4LockedView: document.getElementById('mod4-locked-view'),
    mod4UnlockedView: document.getElementById('mod4-unlocked-view'),
    btnMod4LockedClose: document.getElementById('btn-mod4-locked-close'),
    formMod4Decrypt: document.getElementById('form-mod4-decrypt'),
    inputMod4Code: document.getElementById('input-mod4-code'),
    feedbackMod4Decrypt: document.getElementById('feedback-mod4-decrypt'),

    // Overlays (Victory / Failure)
    screenVictory: document.getElementById('screen-victory'),
    victoryElapsedTime: document.getElementById('victory-elapsed-time'),
    btnRestartVictory: document.getElementById('btn-restart-victory'),

    screenFailed: document.getElementById('screen-failed'),
    btnRestartFailed: document.getElementById('btn-restart-failed')
  };

  // =========================================================================
  // PERSISTENCE HELPER
  // =========================================================================
  function saveState() {
    try {
      sessionStorage.setItem(GAME_CONSTANTS.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Storage unavailable or disabled
    }
  }

  function loadState() {
    // Always start fresh — do not restore old sessions.
    // This prevents stale dashboard states on page reload.
    try {
      sessionStorage.removeItem(GAME_CONSTANTS.STORAGE_KEY);
    } catch (e) {}
    state = JSON.parse(JSON.stringify(defaultState));
  }

  // =========================================================================
  // TIMER CONTROLLER
  // =========================================================================
  function formatTime(seconds) {
    const clamped = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (state.timerRunning || state.gameWon || state.gameFailed) return;

    state.timerRunning = true;
    if (!state.timerEndTimestamp) {
      state.timerEndTimestamp = Date.now() + (state.timerSecondsLeft * 1000);
    }

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      const now = Date.now();
      const remainingMs = state.timerEndTimestamp - now;
      state.timerSecondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));
      state.elapsedSeconds = GAME_CONSTANTS.TOTAL_DURATION_SEC - state.timerSecondsLeft;

      updateTimerDisplay();

      // Low time warning ticker (last 3 minutes)
      if (state.timerSecondsLeft > 0 && state.timerSecondsLeft <= 180 && state.timerSecondsLeft % 30 === 0) {
        audio.playWarningTick();
      }

      if (state.timerSecondsLeft <= 0) {
        clearInterval(timerInterval);
        state.timerRunning = false;
        state.missionStarted = false;
        state.sessionActive = false;
        state.view = 'login';
        state.timerSecondsLeft = GAME_CONSTANTS.TOTAL_DURATION_SEC;
        state.timerEndTimestamp = null;
        closeAllModals();
        audio.playDeny();
        renderApp();
        if (DOM.loginFeedback) {
          DOM.loginFeedback.className = 'feedback-banner error';
          DOM.loginFeedback.textContent = 'SESSION EXPIRED: 20:00 TIME LIMIT REACHED. YOU HAVE BEEN AUTOMATICALLY LOGGED OUT.';
          DOM.loginFeedback.style.display = 'block';
        }
      }
      saveState();
    }, 250);
  }

  function stopTimer() {
    state.timerRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    saveState();
  }

  function updateTimerDisplay() {
    const formatted = formatTime(state.timerSecondsLeft);
    if (DOM.hudTimer) DOM.hudTimer.textContent = formatted;
    if (DOM.loginCountdown) DOM.loginCountdown.textContent = formatted;

    const isCritical = state.timerSecondsLeft <= 180 && state.timerRunning;
    if (DOM.hudTimer) {
      if (isCritical) DOM.hudTimer.classList.add('timer-critical');
      else DOM.hudTimer.classList.remove('timer-critical');
    }
    if (DOM.loginCountdown) {
      if (isCritical) DOM.loginCountdown.classList.add('timer-critical');
      else DOM.loginCountdown.classList.remove('timer-critical');
    }
  }

  // =========================================================================
  // UI RENDERERS & STATE SYNC
  // =========================================================================
  function renderApp() {
    // 1. Session Status Indicator & Operator Display per 3.png
    if (state.sessionActive) {
      if (DOM.hudStatusDot) DOM.hudStatusDot.className = 'status-dot';
      if (DOM.hudStatusText) DOM.hudStatusText.textContent = 'SESSION ENCRYPTED';
      if (DOM.hudOperatorName) DOM.hudOperatorName.textContent = (state.operatorName || 'SAMUEL REYES').toUpperCase();
      if (DOM.dashOperatorDisplay) DOM.dashOperatorDisplay.textContent = state.operatorName || 'Samuel Reyes';
    } else {
      if (DOM.hudStatusDot) DOM.hudStatusDot.className = 'status-dot compromised';
      if (DOM.hudStatusText) DOM.hudStatusText.textContent = 'STATUS: COMPROMISED';
    }

    // 2. View Visibility & Header Placement per 1.png, 2.png, and 3.png
    if (state.view === 'dashboard' && state.sessionActive) {
      if (DOM.systemHeader) DOM.systemHeader.style.display = 'flex';
      if (DOM.loginAudioBar) DOM.loginAudioBar.style.display = 'none';
      DOM.viewLogin.classList.remove('active');
      DOM.viewDashboard.classList.add('active');
    } else {
      if (DOM.systemHeader) DOM.systemHeader.style.display = 'none';
      if (DOM.loginAudioBar) DOM.loginAudioBar.style.display = 'block';
      DOM.viewLogin.classList.add('active');
      DOM.viewDashboard.classList.remove('active');

      // Login screen: Start Mission Option vs Active Timer per 1.png & 2.png
      if (state.missionStarted && state.timerRunning) {
        if (DOM.missionStartWrap) DOM.missionStartWrap.style.display = 'none';
        if (DOM.missionActiveTimer) DOM.missionActiveTimer.style.display = 'flex';
      } else {
        if (DOM.missionStartWrap) DOM.missionStartWrap.style.display = 'block';
        if (DOM.missionActiveTimer) DOM.missionActiveTimer.style.display = 'none';
      }
    }

    // 3. Module Statuses & Badges
    updateModuleBadges();

    // 4. Timer Display
    updateTimerDisplay();

    // 5. Overlays
    if (state.gameWon) {
      DOM.victoryElapsedTime.textContent = formatTime(state.elapsedSeconds);
      DOM.screenVictory.classList.add('active');
      DOM.screenFailed.classList.remove('active');
    } else if (state.gameFailed) {
      DOM.screenFailed.classList.add('active');
      DOM.screenVictory.classList.remove('active');
    } else {
      DOM.screenVictory.classList.remove('active');
      DOM.screenFailed.classList.remove('active');
    }

    saveState();
  }

  function updateModuleBadges() {
    // Module 01
    if (state.modules.mod1.completed) {
      DOM.badgeMod1.className = 'status-badge badge-completed';
      DOM.badgeMod1.textContent = 'COMPLETED';
    } else if (state.modules.mod1.accessUnlocked) {
      DOM.badgeMod1.className = 'status-badge badge-authorized';
      DOM.badgeMod1.textContent = 'AUTHORIZED';
    } else {
      DOM.badgeMod1.className = 'status-badge badge-restricted';
      DOM.badgeMod1.textContent = 'RESTRICTED';
    }

    // Module 02
    DOM.badgeMod2.className = 'status-badge badge-authorized';
    DOM.badgeMod2.textContent = 'AUTHORIZED';

    // Module 03
    if (state.modules.mod3.completed) {
      DOM.badgeMod3.className = 'status-badge badge-completed';
      DOM.badgeMod3.textContent = 'COMPLETED';
    } else if (state.modules.mod3.accessUnlocked) {
      DOM.badgeMod3.className = 'status-badge badge-authorized';
      DOM.badgeMod3.textContent = 'AUTHORIZED';
    } else {
      DOM.badgeMod3.className = 'status-badge badge-restricted';
      DOM.badgeMod3.textContent = 'RESTRICTED';
    }

    // Module 04 - Unlinked and directly authorized
    if (state.modules.mod4.completed || state.gameWon) {
      DOM.badgeMod4.className = 'status-badge badge-completed';
      DOM.badgeMod4.textContent = 'COMPLETED';
    } else {
      DOM.badgeMod4.className = 'status-badge badge-authorized';
      DOM.badgeMod4.textContent = 'AUTHORIZED';
    }

    // Restricted / Locked Count Calculation
    let lockedCount = 0;
    if (!state.modules.mod1.completed) lockedCount++;
    if (!state.modules.mod3.completed) lockedCount++;
    if (!state.modules.mod4.completed && !state.gameWon) lockedCount++;
    DOM.restrictedCount.textContent = `${lockedCount} LOCKED`;
  }

  // =========================================================================
  // AUTHENTICATION LOGIC (LOGIN)
  // =========================================================================
  // =========================================================================
  // MISSION CONTROLLERS (START MISSION & LOGOUT)
  // =========================================================================
  function handleStartMission() {
    audio.playClick();
    state.gameWon = false;
    state.gameFailed = false;
    state.missionStarted = true;
    state.timerRunning = false;
    state.timerSecondsLeft = GAME_CONSTANTS.TOTAL_DURATION_SEC;
    state.timerEndTimestamp = Date.now() + (state.timerSecondsLeft * 1000);
    startTimer();
    renderApp();
    if (DOM.inputLoginUsername) {
      DOM.inputLoginUsername.focus();
    }
  }

 function handleLogout() {
    audio.playClick();
    
    // 1. End the secure session and switch views
    state.sessionActive = false;
    state.view = 'login';

    // BUG FIX: Removed stopTimer() and all timer reset variables here.
    // The mission is still active, and the timer will keep running!

    // 2. (Optional) Reset game progress. 
    // If you want players to lose their module progress on logout, keep this:
    state.modules = JSON.parse(JSON.stringify(defaultState.modules));
    state.gameWon = false;
    state.gameFailed = false;

    currentTxData = [...TRANSACTION_RECORDS];
    currentSort = { col: null, asc: true };

    // 3. Clear the login form
    if (DOM.inputLoginUsername) DOM.inputLoginUsername.value = '';
    if (DOM.inputLoginPassword) DOM.inputLoginPassword.value = '';
    if (DOM.loginFeedback) DOM.loginFeedback.style.display = 'none';

    closeAllModals();
    saveState();
    renderApp();
  }


  function handleTogglePassword() {
    audio.playClick();
    if (DOM.inputLoginPassword.type === 'password') {
      DOM.inputLoginPassword.type = 'text';
      if (DOM.eyeIcon) {
        DOM.eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        `;
      }
    } else {
      DOM.inputLoginPassword.type = 'password';
      if (DOM.eyeIcon) {
        DOM.eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        `;
      }
    }
  }

  function toggleAudio() {
    const isEnabled = audio.toggle();
    const icon = isEnabled ? '🔊' : '🔇';
    const label = isEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';

    if (DOM.btnAudioToggle) {
      if (isEnabled) DOM.btnAudioToggle.classList.add('active');
      else DOM.btnAudioToggle.classList.remove('active');
      if (DOM.audioIcon) DOM.audioIcon.textContent = icon;
      if (DOM.audioLabel) DOM.audioLabel.textContent = label;
    }

    if (DOM.btnAudioToggleLogin) {
      if (isEnabled) DOM.btnAudioToggleLogin.classList.add('active');
      else DOM.btnAudioToggleLogin.classList.remove('active');
      if (DOM.audioIconLogin) DOM.audioIconLogin.textContent = icon;
      if (DOM.audioLabelLogin) DOM.audioLabelLogin.textContent = label;
    }

    if (isEnabled) audio.playClick();
  }

  // =========================================================================
  // AUTHENTICATION LOGIC (LOGIN)
  // =========================================================================
  function handleLoginSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    audio.playClick();
    const rawUsername = (DOM.inputLoginUsername ? DOM.inputLoginUsername.value : '') || '';
    const username = rawUsername.trim().toUpperCase();
    const password = (DOM.inputLoginPassword ? DOM.inputLoginPassword.value : '').trim();

    // If mission hasn't started yet, clicking authenticate starts the mission
    if (!state.missionStarted || !state.timerRunning) {
      state.gameWon = false;
      state.gameFailed = false;
      state.missionStarted = true;
      state.timerRunning = false;
      state.timerSecondsLeft = GAME_CONSTANTS.TOTAL_DURATION_SEC;
      state.timerEndTimestamp = Date.now() + (state.timerSecondsLeft * 1000);
      startTimer();
    }

    // Support SAMEL, SAMUEL, EMMA, or any custom operator name with password 5831
    const isPassValid = password === GAME_CONSTANTS.CREDENTIALS.PASSWORD;
    const isUserValid = rawUsername.trim().length > 0;

    if (isUserValid && isPassValid) {
      if (username === 'SAMEL' || username === 'SAMUEL' || username.startsWith('SAMUEL')) {
        state.operatorName = 'Samuel Reyes';
      } else if (username === 'EMMA' || username.startsWith('EMMA')) {
        state.operatorName = 'Emma Joseph';
      } else {
        state.operatorName = rawUsername.trim();
      }

      audio.playGrant();
      if (DOM.loginFeedback) {
        DOM.loginFeedback.className = 'feedback-banner success';
        DOM.loginFeedback.textContent = 'ACCESS GRANTED';
        DOM.loginFeedback.style.display = 'block';
      }

      setTimeout(() => {
        if (DOM.loginFeedback) DOM.loginFeedback.style.display = 'none';
        if (DOM.inputLoginUsername) DOM.inputLoginUsername.value = '';
        if (DOM.inputLoginPassword) DOM.inputLoginPassword.value = '';
        
        // Show Login Success Popup modal
        if (DOM.modalLoginSuccess) DOM.modalLoginSuccess.classList.add('active');
      }, 400);
    } else {
      audio.playDeny();
      if (DOM.loginFeedback) {
        DOM.loginFeedback.className = 'feedback-banner error';
        DOM.loginFeedback.textContent = 'ACCESS DENIED / INVALID CREDENTIALS';
        DOM.loginFeedback.style.display = 'block';
      }
      if (DOM.inputLoginPassword) {
        DOM.inputLoginPassword.value = '';
        DOM.inputLoginPassword.focus();
      }
    }
  }

  function handleEnterControlCenter() {
    audio.playClick();
    DOM.modalLoginSuccess.classList.remove('active');
    state.sessionActive = true;
    state.view = 'dashboard';
    
    // Ensure timer is running upon entering dashboard
    if (!state.timerRunning) {
      startTimer();
    }
    renderApp();
  }

  // =========================================================================
  // MODULE 01 LOGIC (TRANSACTION HISTORY)
  // =========================================================================
  let currentTxData = [...TRANSACTION_RECORDS];
  let currentSort = { col: null, asc: true };

  function renderTransactionTable(records) {
    DOM.txTbody.innerHTML = '';
    DOM.txCountLabel.textContent = `SHOWING ${records.length} RECORDS`;

    records.forEach(tx => {
      const tr = document.createElement('tr');
      
      let flagClass = 'tx-status-flag processed';
      if (tx.status === 'FLAGGED') flagClass = 'tx-status-flag flagged';
      if (tx.status === 'PENDING') flagClass = 'tx-status-flag pending';

      tr.innerHTML = `
        <td style="font-family: var(--font-display); color: var(--color-green);">${tx.time}</td>
        <td><strong>${tx.employee}</strong></td>
        <td class="tx-amount">${tx.amount}</td>
        <td class="tx-bank">${tx.bank}</td>
        <td class="tx-ref">${tx.ref}</td>
        <td><span class="${flagClass}">${tx.status}</span></td>
      `;
      DOM.txTbody.appendChild(tr);
    });
  }

  function openModule1() {
    audio.playClick();
    DOM.modalMod1.classList.add('active');
    
    if (state.modules.mod1.accessUnlocked || state.modules.mod1.completed) {
      DOM.mod1LockedView.style.display = 'none';
      DOM.mod1UnlockedView.style.display = 'block';
      renderTransactionTable(currentTxData);
    } else {
      DOM.mod1LockedView.style.display = 'block';
      DOM.mod1UnlockedView.style.display = 'none';
      DOM.feedbackMod1Access.style.display = 'none';
      DOM.inputMod1Access.value = '';
      setTimeout(() => DOM.inputMod1Access.focus(), 100);
    }
  }

  function handleMod1AccessSubmit() {
    audio.playClick();
    const code = (DOM.inputMod1Access.value || '').trim();

    if (code === GAME_CONSTANTS.CODES.MOD1_ACCESS) {
      audio.playGrant();
      DOM.feedbackMod1Access.className = 'feedback-banner success';
      DOM.feedbackMod1Access.textContent = 'ACCESS AUTHORIZED';
      DOM.feedbackMod1Access.style.display = 'block';

      state.modules.mod1.accessUnlocked = true;
      state.modules.mod1.completed = true;
      renderApp();

      setTimeout(() => {
        DOM.feedbackMod1Access.style.display = 'none';
        DOM.mod1LockedView.style.display = 'none';
        DOM.mod1UnlockedView.style.display = 'block';
        renderTransactionTable(currentTxData);
      }, 400);
    } else {
      audio.playDeny();
      DOM.feedbackMod1Access.className = 'feedback-banner error';
      DOM.feedbackMod1Access.textContent = 'ACCESS DENIED / INVALID ACCESS CODE';
      DOM.feedbackMod1Access.style.display = 'block';
      DOM.inputMod1Access.value = '';
      DOM.inputMod1Access.focus();
    }
  }

  function handleMod1InvestigationSubmit() {
    audio.playClick();
    const code = (DOM.inputMod1Investigation ? DOM.inputMod1Investigation.value : '').trim();

    if (code === GAME_CONSTANTS.CODES.MOD1_INVESTIGATION) {
      audio.playGrant();
      if (DOM.feedbackMod1Investigation) {
        DOM.feedbackMod1Investigation.className = 'feedback-banner success';
        DOM.feedbackMod1Investigation.textContent = 'TRANSACTION PATTERN VERIFIED';
        DOM.feedbackMod1Investigation.style.display = 'block';
      }

      state.modules.mod1.completed = true;
      renderApp();

      setTimeout(() => {
        if (DOM.feedbackMod1Investigation) DOM.feedbackMod1Investigation.style.display = 'none';
        DOM.modalMod1.classList.remove('active');
      }, 900);
    } else {
      audio.playDeny();
      if (DOM.feedbackMod1Investigation) {
        DOM.feedbackMod1Investigation.className = 'feedback-banner error';
        DOM.feedbackMod1Investigation.textContent = 'ACCESS DENIED / INVALID INVESTIGATION CODE';
        DOM.feedbackMod1Investigation.style.display = 'block';
      }
      if (DOM.inputMod1Investigation) {
        DOM.inputMod1Investigation.value = '';
        DOM.inputMod1Investigation.focus();
      }
    }
  }

  function handleTxSearch() {
    const q = (DOM.txSearchInput.value || '').toLowerCase().trim();
    if (!q) {
      renderTransactionTable(currentTxData);
      return;
    }

    const filtered = currentTxData.filter(tx => {
      return (
        tx.employee.toLowerCase().includes(q) ||
        tx.bank.toLowerCase().includes(q) ||
        tx.ref.toLowerCase().includes(q) ||
        tx.time.toLowerCase().includes(q) ||
        tx.amount.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q) ||
        (tx.date && tx.date.toLowerCase().includes(q)) ||
        (tx.beneficiary && tx.beneficiary.toLowerCase().includes(q)) ||
        (tx.transactionType && tx.transactionType.toLowerCase().includes(q))
      );
    });
    renderTransactionTable(filtered);
  }

  function handleTxSort(colKey) {
    audio.playClick();
    if (currentSort.col === colKey) {
      currentSort.asc = !currentSort.asc;
    } else {
      currentSort.col = colKey;
      currentSort.asc = true;
    }

    currentTxData.sort((a, b) => {
      let valA = a[colKey] || '';
      let valB = b[colKey] || '';

      if (colKey === 'amount') {
        valA = parseInt(valA.replace(/[^0-9]/g, ''), 10) || 0;
        valB = parseInt(valB.replace(/[^0-9]/g, ''), 10) || 0;
      }

      if (valA < valB) return currentSort.asc ? -1 : 1;
      if (valA > valB) return currentSort.asc ? 1 : -1;
      return 0;
    });

    handleTxSearch();
  }

  // =========================================================================
  // MODULE 02 LOGIC (EMPLOYEE ID DOSSIER)
  // =========================================================================
  function openModule2() {
    audio.playClick();
    DOM.modalMod2.classList.add('active');
  }

  // =========================================================================
  // MODULE 03 LOGIC (DECRYPTION CODE)
  // =========================================================================
  function openModule3() {
    audio.playClick();
    DOM.modalMod3.classList.add('active');

    if (state.modules.mod3.accessUnlocked || state.modules.mod3.completed) {
      DOM.mod3LockedView.style.display = 'none';
      DOM.mod3UnlockedView.style.display = 'block';
    } else {
      DOM.mod3LockedView.style.display = 'block';
      DOM.mod3UnlockedView.style.display = 'none';
      DOM.feedbackMod3Access.style.display = 'none';
      DOM.inputMod3Access.value = '';
      setTimeout(() => DOM.inputMod3Access.focus(), 100);
    }
  }

  function handleMod3AccessSubmit() {
    audio.playClick();
    const val = (DOM.inputMod3Access.value || '').trim().toUpperCase();

    if (val === GAME_CONSTANTS.CODES.MOD3_VAULT) {
      audio.playGrant();
      DOM.feedbackMod3Access.className = 'feedback-banner success';
      DOM.feedbackMod3Access.textContent = 'VAULT VERIFICATION CONFIRMED';
      DOM.feedbackMod3Access.style.display = 'block';

      state.modules.mod3.accessUnlocked = true;
      renderApp();

      setTimeout(() => {
        DOM.feedbackMod3Access.style.display = 'none';
        DOM.mod3LockedView.style.display = 'none';
        DOM.mod3UnlockedView.style.display = 'block';
      }, 400);
    } else {
      audio.playDeny();
      DOM.feedbackMod3Access.className = 'feedback-banner error';
      DOM.feedbackMod3Access.textContent = 'ACCESS DENIED / INVALID PASSPHRASE';
      DOM.feedbackMod3Access.style.display = 'block';
      DOM.inputMod3Access.value = '';
      DOM.inputMod3Access.focus();
    }
  }

  function handleBackMod3() {
    audio.playClick();
    // Returning from viewed cipher marks Module 03 as COMPLETED & Module 04 as AUTHORIZED
    if (state.modules.mod3.accessUnlocked) {
      state.modules.mod3.completed = true;
    }
    DOM.modalMod3.classList.remove('active');
    renderApp();
  }

  function handleCopyCipher() {
    audio.playClick();
    const cipherEl = document.getElementById('revealed-cipher');
    const cipherText = cipherEl ? cipherEl.textContent.trim() : 'ORION-7X4-29Q';

    navigator.clipboard.writeText(cipherText).then(() => {
      // Show success state on button
      if (DOM.copyStatusText) DOM.copyStatusText.textContent = 'COPIED!';
      if (DOM.copyIcon) {
        DOM.copyIcon.innerHTML = `
          <polyline points="20 6 9 17 4 12"></polyline>
        `;
      }
      if (DOM.btnCopyCipher) DOM.btnCopyCipher.classList.add('copied');

      // Show toast
      if (DOM.copyToast) {
        DOM.copyToast.style.display = 'block';
        DOM.copyToast.style.opacity = '1';
      }

      // Reset after 2 seconds
      setTimeout(() => {
        if (DOM.copyStatusText) DOM.copyStatusText.textContent = 'COPY';
        if (DOM.copyIcon) {
          DOM.copyIcon.innerHTML = `
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          `;
        }
        if (DOM.btnCopyCipher) DOM.btnCopyCipher.classList.remove('copied');
        if (DOM.copyToast) {
          DOM.copyToast.style.opacity = '0';
          setTimeout(() => { if (DOM.copyToast) DOM.copyToast.style.display = 'none'; }, 400);
        }
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = cipherText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        if (DOM.copyStatusText) DOM.copyStatusText.textContent = 'COPIED!';
        if (DOM.copyToast) {
          DOM.copyToast.style.display = 'block';
          DOM.copyToast.style.opacity = '1';
        }
        setTimeout(() => {
          if (DOM.copyStatusText) DOM.copyStatusText.textContent = 'COPY';
          if (DOM.copyToast) {
            DOM.copyToast.style.opacity = '0';
            setTimeout(() => { if (DOM.copyToast) DOM.copyToast.style.display = 'none'; }, 400);
          }
        }, 2000);
      } catch(err) {}
    });
  }

  // =========================================================================
  // MODULE 04 LOGIC (MASTER DECRYPT)
  // =========================================================================
  function openModule4() {
    audio.playClick();
    DOM.modalMod4.classList.add('active');

    // Module 04 unlinked: directly available and unlocked without prerequisites
    DOM.mod4LockedView.style.display = 'none';
    DOM.mod4UnlockedView.style.display = 'block';
    DOM.feedbackMod4Decrypt.style.display = 'none';
    DOM.inputMod4Code.value = '';
    setTimeout(() => DOM.inputMod4Code.focus(), 100);
  }

  function handleMod4DecryptSubmit() {
    audio.playClick();
    const code = (DOM.inputMod4Code.value || '').trim().toUpperCase();

    if (code === GAME_CONSTANTS.CODES.MOD4_FINAL || code === 'ORION-7X4-29Q' || code === '4268') {
      audio.playGrant();
      DOM.feedbackMod4Decrypt.className = 'feedback-banner success';
      DOM.feedbackMod4Decrypt.textContent = 'DECRYPTION SUCCESSFUL — BREACH CONTAINED';
      DOM.feedbackMod4Decrypt.style.display = 'block';

      // STOP TIMER IMMEDIATELY
      stopTimer();
      state.modules.mod4.completed = true;
      state.gameWon = true;

      setTimeout(() => {
        DOM.feedbackMod4Decrypt.style.display = 'none';
        DOM.modalMod4.classList.remove('active');
        audio.playVictory();
        renderApp();
      }, 700);
    } else {
      audio.playDeny();
      DOM.feedbackMod4Decrypt.className = 'feedback-banner error';
      DOM.feedbackMod4Decrypt.textContent = 'DECRYPTION FAILED / INVALID CODE';
      DOM.feedbackMod4Decrypt.style.display = 'block';
      DOM.inputMod4Code.value = '';
      DOM.inputMod4Code.focus();
    }
  }

  // =========================================================================
  // MISSION FAILED / RESTART CONTROLLERS
  // =========================================================================
  function triggerMissionFailed() {
    stopTimer();
    state.gameFailed = true;
    audio.playDeny();

    // Close any open modals
    closeAllModals();
    renderApp();
  }

  function restartMission() {
    audio.playClick();
    stopTimer();
    
    // Reset state fully to initial defaults
    state = JSON.parse(JSON.stringify(defaultState));
    saveState();

    closeAllModals();
    currentTxData = [...TRANSACTION_RECORDS];
    currentSort = { col: null, asc: true };

    DOM.inputLoginUsername.value = '';
    DOM.inputLoginPassword.value = '';
    DOM.loginFeedback.style.display = 'none';

    renderApp();
  }

  function closeAllModals() {
    DOM.modalLoginSuccess.classList.remove('active');
    DOM.modalMod1.classList.remove('active');
    DOM.modalMod2.classList.remove('active');
    DOM.modalMod3.classList.remove('active');
    DOM.modalMod4.classList.remove('active');
  }

  // =========================================================================
  // EVENT LISTENERS & INITIALIZATION
  // =========================================================================
  function initEvents() {
    // Audio Toggles
    if (DOM.btnAudioToggle) DOM.btnAudioToggle.addEventListener('click', toggleAudio);
    if (DOM.btnAudioToggleLogin) DOM.btnAudioToggleLogin.addEventListener('click', toggleAudio);

    // Start Mission (per 1.png)
    if (DOM.btnStartMission) DOM.btnStartMission.addEventListener('click', handleStartMission);

    // Top Right HUD Logout (per 3.png)
    if (DOM.btnHudLogout) DOM.btnHudLogout.addEventListener('click', handleLogout);

    // Password Toggle Button
    if (DOM.btnTogglePassword) DOM.btnTogglePassword.addEventListener('click', handleTogglePassword);

    // Login Events
    if (DOM.loginForm) {
      DOM.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLoginSubmit(e);
      });
    }
    if (DOM.btnLoginSubmit) DOM.btnLoginSubmit.addEventListener('click', handleLoginSubmit);
    if (DOM.inputLoginUsername) DOM.inputLoginUsername.addEventListener('keydown', e => { if (e.key === 'Enter') handleLoginSubmit(e); });
    if (DOM.inputLoginPassword) DOM.inputLoginPassword.addEventListener('keydown', e => { if (e.key === 'Enter') handleLoginSubmit(e); });
    if (DOM.btnEnterControlCenter) DOM.btnEnterControlCenter.addEventListener('click', handleEnterControlCenter);

    // Module 1 Events
    DOM.btnOpenMod1.addEventListener('click', openModule1);
    DOM.btnCloseMod1.addEventListener('click', () => { audio.playClick(); DOM.modalMod1.classList.remove('active'); });
    DOM.formMod1Access.addEventListener('submit', handleMod1AccessSubmit);
    DOM.inputMod1Access.addEventListener('keydown', e => { if (e.key === 'Enter') handleMod1AccessSubmit(); });
    if (DOM.formMod1Investigation) DOM.formMod1Investigation.addEventListener('submit', handleMod1InvestigationSubmit);
    if (DOM.inputMod1Investigation) DOM.inputMod1Investigation.addEventListener('keydown', e => { if (e.key === 'Enter') handleMod1InvestigationSubmit(); });
    DOM.txSearchInput.addEventListener('input', handleTxSearch);
    DOM.txTableHeaders.forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (col) handleTxSort(col);
      });
    });

    // Module 2 Events
    DOM.btnOpenMod2.addEventListener('click', openModule2);
    DOM.btnCloseMod2.addEventListener('click', () => { audio.playClick(); DOM.modalMod2.classList.remove('active'); });
    DOM.btnBackMod2.addEventListener('click', () => { audio.playClick(); DOM.modalMod2.classList.remove('active'); });

    // Module 3 Events
    DOM.btnOpenMod3.addEventListener('click', openModule3);
    DOM.btnCloseMod3.addEventListener('click', () => { audio.playClick(); DOM.modalMod3.classList.remove('active'); });
    DOM.formMod3Access.addEventListener('submit', handleMod3AccessSubmit);
    DOM.inputMod3Access.addEventListener('keydown', e => { if (e.key === 'Enter') handleMod3AccessSubmit(); });
    DOM.btnBackMod3.addEventListener('click', handleBackMod3);
    if (DOM.btnCopyCipher) DOM.btnCopyCipher.addEventListener('click', handleCopyCipher);

    // Module 4 Events
    DOM.btnOpenMod4.addEventListener('click', openModule4);
    DOM.btnCloseMod4.addEventListener('click', () => { audio.playClick(); DOM.modalMod4.classList.remove('active'); });
    DOM.btnMod4LockedClose.addEventListener('click', () => { audio.playClick(); DOM.modalMod4.classList.remove('active'); });
    DOM.formMod4Decrypt.addEventListener('submit', handleMod4DecryptSubmit);
    DOM.inputMod4Code.addEventListener('keydown', e => { if (e.key === 'Enter') handleMod4DecryptSubmit(); });

    // Victory & Failure Restart Buttons
    DOM.btnRestartVictory.addEventListener('click', restartMission);
    DOM.btnRestartFailed.addEventListener('click', restartMission);

    // Global Key Handlers (e.g. Escape key to close modals)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (!state.gameWon && !state.gameFailed) {
          closeAllModals();
        }
      }
    });

    // Click outside modal to close
    [DOM.modalMod1, DOM.modalMod2, DOM.modalMod3, DOM.modalMod4].forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }

  // App Initialization
  function init() {
    loadState();
    initEvents();

    if (state.timerRunning) {
      // Resume existing timer if page was refreshed
      startTimer();
    }

    renderApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

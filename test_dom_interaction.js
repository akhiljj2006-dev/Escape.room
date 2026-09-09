const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Simple DOM environment simulation
class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag;
    this.id = id;
    this.className = '';
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
    this.style = {};
    this.value = '';
    this.type = 'text';
    this.textContent = '';
    this.innerHTML = '';
    this.listeners = {};
    this.disabled = false;
  }
  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  dispatchEvent(event) {
    const list = this.listeners[event.type || event] || [];
    list.forEach(fn => fn(event));
  }
  click() {
    this.dispatchEvent({ type: 'click', preventDefault: () => {} });
  }
  focus() {}
  appendChild(child) {}
  querySelectorAll(sel) { return []; }
  getAttribute(attr) { return null; }
}

const elements = {
  'system-header': new MockElement('header', 'system-header'),
  'hud-status-dot': new MockElement('span', 'hud-status-dot'),
  'hud-status-text': new MockElement('span', 'hud-status-text'),
  'hud-timer': new MockElement('span', 'hud-timer'),
  'hud-operator-name': new MockElement('div', 'hud-operator-name'),
  'btn-hud-logout': new MockElement('button', 'btn-hud-logout'),
  'dash-operator-display': new MockElement('span', 'dash-operator-display'),
  'btn-audio-toggle': new MockElement('button', 'btn-audio-toggle'),
  'audio-label': new MockElement('span', 'audio-label'),
  'audio-icon': new MockElement('span', 'audio-icon'),
  'login-audio-bar': new MockElement('div', 'login-audio-bar'),
  'btn-audio-toggle-login': new MockElement('button', 'btn-audio-toggle-login'),
  'audio-icon-login': new MockElement('span', 'audio-icon-login'),
  'audio-label-login': new MockElement('span', 'audio-label-login'),
  'view-login': new MockElement('section', 'view-login'),
  'view-dashboard': new MockElement('section', 'view-dashboard'),
  'restricted-modules-count': new MockElement('span', 'restricted-modules-count'),
  'mission-start-wrap': new MockElement('div', 'mission-start-wrap'),
  'btn-start-mission': new MockElement('button', 'btn-start-mission'),
  'mission-active-timer': new MockElement('div', 'mission-active-timer'),
  'login-countdown': new MockElement('span', 'login-countdown'),
  'badge-module-1': new MockElement('span', 'badge-module-1'),
  'badge-module-2': new MockElement('span', 'badge-module-2'),
  'badge-module-3': new MockElement('span', 'badge-module-3'),
  'badge-module-4': new MockElement('span', 'badge-module-4'),
  'btn-open-mod-1': new MockElement('button', 'btn-open-mod-1'),
  'btn-open-mod-2': new MockElement('button', 'btn-open-mod-2'),
  'btn-open-mod-3': new MockElement('button', 'btn-open-mod-3'),
  'btn-open-mod-4': new MockElement('button', 'btn-open-mod-4'),
  'login-form': new MockElement('form', 'login-form'),
  'login-username': new MockElement('input', 'login-username'),
  'login-password': new MockElement('input', 'login-password'),
  'btn-toggle-password': new MockElement('button', 'btn-toggle-password'),
  'eye-icon': new MockElement('svg', 'eye-icon'),
  'btn-login-submit': new MockElement('button', 'btn-login-submit'),
  'login-feedback': new MockElement('div', 'login-feedback'),
  'modal-login-success': new MockElement('div', 'modal-login-success'),
  'btn-enter-control-center': new MockElement('button', 'btn-enter-control-center'),
  'modal-module-1': new MockElement('div', 'modal-module-1'),
  'btn-close-mod-1': new MockElement('button', 'btn-close-mod-1'),
  'mod1-locked-view': new MockElement('div', 'mod1-locked-view'),
  'mod1-unlocked-view': new MockElement('div', 'mod1-unlocked-view'),
  'form-mod1-access': new MockElement('form', 'form-mod1-access'),
  'input-mod1-access': new MockElement('input', 'input-mod1-access'),
  'feedback-mod1-access': new MockElement('div', 'feedback-mod1-access'),
  'transaction-tbody': new MockElement('tbody', 'transaction-tbody'),
  'input-tx-search': new MockElement('input', 'input-tx-search'),
  'tx-records-count': new MockElement('div', 'tx-records-count'),
  'form-mod1-investigation': new MockElement('form', 'form-mod1-investigation'),
  'input-mod1-investigation': new MockElement('input', 'input-mod1-investigation'),
  'feedback-mod1-investigation': new MockElement('div', 'feedback-mod1-investigation'),
  'mod1-investigation-badge': new MockElement('span', 'mod1-investigation-badge'),
  'modal-module-2': new MockElement('div', 'modal-module-2'),
  'btn-close-mod-2': new MockElement('button', 'btn-close-mod-2'),
  'btn-back-mod-2': new MockElement('button', 'btn-back-mod-2'),
  'modal-module-3': new MockElement('div', 'modal-module-3'),
  'btn-close-mod-3': new MockElement('button', 'btn-close-mod-3'),
  'mod3-locked-view': new MockElement('div', 'mod3-locked-view'),
  'mod3-unlocked-view': new MockElement('div', 'mod3-unlocked-view'),
  'form-mod3-access': new MockElement('form', 'form-mod3-access'),
  'input-mod3-access': new MockElement('input', 'input-mod3-access'),
  'feedback-mod3-access': new MockElement('div', 'feedback-mod3-access'),
  'btn-back-mod-3': new MockElement('button', 'btn-back-mod-3'),
  'modal-module-4': new MockElement('div', 'modal-module-4'),
  'btn-close-mod-4': new MockElement('button', 'btn-close-mod-4'),
  'mod4-locked-view': new MockElement('div', 'mod4-locked-view'),
  'mod4-unlocked-view': new MockElement('div', 'mod4-unlocked-view'),
  'btn-mod4-locked-close': new MockElement('button', 'btn-mod4-locked-close'),
  'form-mod4-decrypt': new MockElement('form', 'form-mod4-decrypt'),
  'input-mod4-code': new MockElement('input', 'input-mod4-code'),
  'feedback-mod4-decrypt': new MockElement('div', 'feedback-mod4-decrypt'),
  'screen-victory': new MockElement('div', 'screen-victory'),
  'victory-elapsed-time': new MockElement('div', 'victory-elapsed-time'),
  'btn-restart-victory': new MockElement('button', 'btn-restart-victory'),
  'screen-failed': new MockElement('div', 'screen-failed'),
  'btn-restart-failed': new MockElement('button', 'btn-restart-failed')
};

global.document = {
  readyState: 'complete',
  getElementById: (id) => elements[id] || null,
  querySelectorAll: (sel) => [],
  createElement: (tag) => new MockElement(tag),
  addEventListener: () => {}
};

global.window = {
  AudioContext: class {
    constructor() { this.state = 'running'; this.currentTime = 0; }
    createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
    createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
    resume() { return Promise.resolve(); }
  }
};

global.sessionStorage = {
  store: {},
  getItem: (k) => global.sessionStorage.store[k] || null,
  setItem: (k, v) => { global.sessionStorage.store[k] = v; },
  removeItem: (k) => { delete global.sessionStorage.store[k]; }
};

// Load app.js into memory
console.log('Loading app.js in mock DOM environment...');
require('./app.js');

console.log('✓ app.js loaded and initialized successfully without errors!');

// Test 1: START MISSION CLICK
console.log('\n--- Test 1: Clicking START MISSION ---');
elements['btn-start-mission'].click();
assert(elements['mission-start-wrap'].style.display === 'none', 'mission-start-wrap should be hidden');
assert(elements['mission-active-timer'].style.display === 'flex', 'mission-active-timer should be visible');
assert(elements['login-countdown'].textContent === '20:00', 'Countdown should display 20:00');
console.log('✓ START MISSION successfully initiated reverse countdown to 20:00 (1.png -> 2.png)');

// Test 2: Eye toggle button
console.log('\n--- Test 2: Password Visibility Eye Toggle ---');
assert(elements['login-password'].type === 'text' || elements['login-password'].type === 'password');
elements['login-password'].type = 'password';
elements['btn-toggle-password'].click();
assert.strictEqual(elements['login-password'].type, 'text', 'Password should toggle to text');
elements['btn-toggle-password'].click();
assert.strictEqual(elements['login-password'].type, 'password', 'Password should toggle back to password');
console.log('✓ Password visibility toggle verified.');

// Test 3: LOGIN (samel / 5831)
console.log('\n--- Test 3: Authenticating as samel ---');
elements['login-username'].value = 'samel';
elements['login-password'].value = '5831';
elements['btn-login-submit'].click();
assert(elements['login-feedback'].textContent.includes('ACCESS GRANTED'), 'Feedback should show ACCESS GRANTED');
console.log('✓ Login validation passed.');

// Test 4: Enter Dashboard & Check Top Right Logout
console.log('\n--- Test 4: Entering Security Control Center Dashboard ---');
elements['btn-enter-control-center'].click();
assert(elements['system-header'].style.display === 'flex', 'Header should be visible on dashboard');
assert(elements['hud-operator-name'].textContent.includes('SAMUEL REYES'), 'Operator should be SAMUEL REYES (3.png)');
assert(elements['dash-operator-display'].textContent.includes('Samuel Reyes'), 'Dash display should be Samuel Reyes');
console.log('✓ Security Control Center header and Samuel Reyes operator name verified per 3.png.');

// Test 5: Click LOGOUT
console.log('\n--- Test 5: Clicking LOGOUT button in Top Right ---');
elements['btn-hud-logout'].click();
assert(elements['system-header'].style.display === 'none', 'Header should hide on login view');
assert(elements['view-login'].classList.contains('active'), 'Login view should be active');
assert(elements['mission-start-wrap'].style.display === 'block', 'Start Mission button should be visible after logout');
assert(elements['mission-active-timer'].style.display === 'none', 'Active countdown should be stopped and hidden after logout');
console.log('✓ LOGOUT successfully stopped timer and restored START MISSION view.');

console.log('\n===========================================================');
console.log('ALL DOM INTERACTION TESTS PASSED 100%!');
console.log('===========================================================');
process.exit(0);

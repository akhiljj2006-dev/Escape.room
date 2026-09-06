# Product Requirements Document

## Orion Financial — Security Control Center
### Interactive Web Companion for Physical Escape Room Experience

| | |
|---|---|
| **Document Type** | Product Requirements Document (PRD) |
| **Product Name** | Orion Financial — Security Control Center |
| **Format** | Single-Page Web Application (SPA) |
| **Target Use Case** | Physical escape room, 5 players, 20-minute session |
| **Version** | 1.0 |
| **Status** | Draft for Development |

---

## 1. Overview

### 1.1 Purpose
Orion Financial — Security Control Center is a web application that serves as the digital component of a physical escape room. The website simulates a compromised financial security system. Players use codes and answers discovered through **physical puzzles in the room** to unlock digital modules within the application. The website's sole function is to **verify inputs and reveal progression** — it does not generate, explain, or hint at puzzle solutions.

### 1.2 Background
The experience is themed around a financial security breach. Players assume the role of "Emma Joseph," an employee investigating suspicious activity within Orion Financial's systems. The narrative and puzzle logic exist primarily in the physical room; the website is the interface through which progress is authenticated and tracked.

### 1.3 Goals
- Provide a single, persistent digital "hub" (the dashboard) that players return to throughout the game.
- Maintain one continuous 20-minute countdown timer for the entire session.
- Gate access to information/modules behind physical-puzzle-derived codes.
- Deliver a visual style consistent with a dark, vintage, cyber-security financial terminal — not a conventional or playful website.
- Support a full replay via a reset/restart function.

### 1.4 Non-Goals
- The product will **not** provide hints, solution explanations, or clues of any kind.
- The product will **not** be built as a series of separate pages per puzzle.
- The product will **not** include gamified/cartoon UI elements, emojis, or bright neon styling.

---

## 2. Target Users

| User | Description |
|---|---|
| Escape room players (primary) | Groups of up to 5 players physically present in the room, interacting with the website via a shared device or terminal-style screen. |
| Game master / operator (secondary) | Room staff who may need to trigger a reset between sessions. |

---

## 3. Experience Style & Visual Direction

The interface must evoke a **dark, mysterious, internal financial security terminal** — not a mainstream consumer website.

### 3.1 Visual Requirements
- Dark charcoal / black background with a subtle grid overlay.
- Dark green / emerald as the primary accent color; sparing use of red for warnings/alerts.
- Monospace, terminal-style typography throughout.
- Thin technical borders, module "cards," and status badges (e.g., `AUTHORIZED`, `RESTRICTED`, `LOCKED`, `COMPLETED`).
- Subtle scanline and digital noise texture; very light glitch effects — used sparingly, not as a dominant animation.
- Layout philosophy modeled on the provided reference screenshot: top header → system status panel → grid of module cards, each with an "OPEN MODULE →" action.

### 3.2 Explicitly Avoid
- Cartoon or illustrated graphics
- Emojis
- Bright/neon "gamer" aesthetics
- Playful button styles or excessive motion/animation
- Large decorative illustrations

---

## 4. Information Architecture

Unlike a typical multi-page puzzle site, this product uses a **hub-and-spoke model**:

```
LOGIN PAGE
   ↓
LOGIN SUCCESS POPUP
   ↓
MAIN DASHBOARD (persistent hub)
   ↓
   ├── Module 01 — Transaction History
   ├── Module 02 — Employee ID
   ├── Module 03 — Decryption Code
   └── Module 04 — Decrypt
        ↓
FINAL SUCCESS SCREEN  (or)  MISSION FAILED SCREEN
```

Modules open as overlays/modals or in-place views launched **from** the dashboard; the dashboard itself is never replaced or navigated away from permanently. Players can move freely between modules in any order, subject to lock states described in Section 6.

---

## 5. Global Game Systems

### 5.1 Countdown Timer
- A single global timer of **20:00 (mm:ss)** governs the entire session.
- **Start trigger:** Timer begins upon successful login (submission of correct credentials), or at the click of a "BEGIN INVESTIGATION" action immediately following login — one method should be chosen and used consistently.
- Displayed persistently in the top-right of the interface as **TIME REMAINING**.
- Timer must persist across all module views/modals — it never pauses, resets, or restarts due to navigation.
- **Stop condition (success):** Timer stops immediately upon successful validation of the final decryption code (`ORION-7X4-29Q`) in Module 04.
- **Stop condition (failure):** Timer reaching `00:00` before the final code is entered triggers the Mission Failed state (Section 9) and halts the timer.
- The elapsed/completion time must be calculated from actual timer state and displayed on the success screen (see Section 8).

### 5.2 Persistent Game State
The application must maintain state for the duration of a session, including:
- Login status
- Timer value
- Each module's status (`RESTRICTED` / `AUTHORIZED` / `COMPLETED` / `LOCKED`)
- Whether the final code has been submitted

### 5.3 No-Hint Policy (Hard Constraint)
The system must never present:
- A hint button or hint system
- Explanations of puzzle logic or solutions
- "Try this" or suggestive help text
- Any indication of which part of an incorrect input was wrong

All feedback on incorrect input is limited to a generic denial message (see module specs).

### 5.4 Reset / Restart
A "RESTART MISSION" action (available from both the success and failure screens) must fully reset the application to its initial state:
- Timer → `20:00`
- Session → logged out
- All modules → initial lock states
- All previously entered codes → cleared
- Completion time → cleared

---

## 6. Functional Requirements by Screen

### 6.1 Login Page

**Header:**
`ORION FINANCIAL` / `SECURITY CONTROL CENTER`

**System status indicator:** `SYSTEM STATUS: COMPROMISED`

**Form fields:**
| Field | Notes |
|---|---|
| Username | Text input |
| Password | Text input (masked) |

**Valid credentials:** Username `EMMA`, Password `5831` (case-sensitivity to be determined by dev team; credentials must not be displayed anywhere in the UI).

**Behavior:**
- Incorrect credentials → display `ACCESS DENIED / INVALID CREDENTIALS` without indicating which field is wrong.
- Correct credentials → display `ACCESS GRANTED`, then transition to the Login Success Popup.

---

### 6.2 Login Success Popup

Displayed as a large, centered modal styled as a serious security alert.

**Content:**
- `ACCESS GRANTED`
- `EMPLOYEE VERIFIED: EMMA JOSEPH`
- `SECURITY STATUS: AUTHORIZED`
- Large emphasized text: *"THE NEXT CLUE IS BEHIND THE WALL STREET."* (displayed verbatim; no further explanation or clue is added)
- Button: `[ ENTER SECURITY CONTROL CENTER ]`

**Behavior:** Clicking the button closes the popup and reveals the Main Dashboard. This is also the point at which the global timer may start (per the single, consistent choice made in Section 5.1).

---

### 6.3 Main Dashboard

The persistent hub screen, always reachable and never fully replaced during active gameplay.

**Header:** `ORION FINANCIAL` / `SECURITY CONTROL CENTER`
**Top-right:** `SESSION: AUTHENTICATED` and `TIME REMAINING: mm:ss` (live countdown)

**System Status Panel** (example content):
```
> OPERATOR: Emma Joseph
> CLEARANCE: Level 3
> THREAT LEVEL: CRITICAL
> SERVER AUTHORIZATION: ACTIVE
> ENCRYPTED SESSION: ACTIVE
> RESTRICTED MODULES: [dynamic count] LOCKED
```

**Module Grid** — four module cards, each showing a title, one-line description, current status badge, and an `[ OPEN MODULE → ]` action:

| Module | Title | Initial Status |
|---|---|---|
| 01 | Transaction History | `RESTRICTED` |
| 02 | Employee ID | `AUTHORIZED` |
| 03 | Decryption Code | `RESTRICTED` |
| 04 | Decrypt | `RESTRICTED` |

Status badges must update live as the game progresses (see Section 7 state table).

---

### 6.4 Module 01 — Transaction History

**Locked state (status: `RESTRICTED`):**
Clicking "Open Module" opens a modal requesting an access code:
```
TRANSACTION HISTORY — ACCESS RESTRICTED
ACCESS CODE REQUIRED: [ input ]  [ VERIFY ]
```
- Correct code: `96241` → module status changes to `AUTHORIZED`; module can now be opened normally.
- Incorrect code: display `ACCESS DENIED / INVALID ACCESS CODE`. The correct code must never be revealed.

**Unlocked module content:**
A transaction table containing **a minimum of 24 shuffled (non-chronological) transaction records** with the following columns: `TIME`, `EMPLOYEE`, `AMOUNT`, `BANK`, `REFERENCE ID`, `STATUS`.

Four records are the "suspicious" set players must identify by their subtly inconsistent bank-name variants (e.g., "ORION BANK LTD.", "ORION FINANCIAL BANK", "ORION B.", "ORION BANK"):

| Time | Employee | Amount | Bank | Reference |
|---|---|---|---|---|
| 01:13 AM | Danish Khan | ₹4,200 | ORION BANK LTD. | TX-4817 |
| 02:47 AM | Beena Rao | ₹8,600 | ORION FINANCIAL BANK | TX-2941 |
| 03:26 AM | Farhan Ali | ₹12,400 | ORION B. | TX-7302 |
| 03:58 AM | Hari Menon | ₹7,800 | ORION BANK | TX-1158 |

The remaining ~20 records use varied fictional bank names (e.g., National Trust Bank, Gulf Capital Bank, Metro Commercial Bank, First Union Bank, Royal Credit Bank, Nova Finance Bank, Eastern Trust, Central Merchant Bank, Summit Bank, Prime National Bank) and plausible, realistic transaction details. "Kuwait" must not appear anywhere in the data set.

**Investigation code field (bottom of module):**
```
INVESTIGATION CODE: [ input ]  [ VERIFY ]
```
- Correct code: `4268` (derived physically from ordering the four suspicious employees by time and converting their initials, D-B-F-H, per the physical puzzle instructions).
- Correct submission → display `TRANSACTION PATTERN VERIFIED`, return player to Main Dashboard, and update Module 01 status to `COMPLETED`.
- Incorrect submission → generic denial message; no further hint.

---

### 6.5 Module 02 — Employee ID

**Status:** `AUTHORIZED` immediately after login (no code required); accessible at any time.

**Content:**
```
AUTHENTICATED EMPLOYEE
NAME: EMMA JOSEPH
EMPLOYEE ID: EMP-44
DEPARTMENT: FINANCE
CLEARANCE: LEVEL 3
ACCOUNT STATUS: VERIFIED
```
Action: `[ BACK TO CONTROL CENTER ]`. This module must not contain any future puzzle answers or codes.

---

### 6.6 Module 03 — Decryption Code

**Locked state (status: `RESTRICTED`):**
```
DECRYPTION MODULE — ACCESS RESTRICTED
VAULT VERIFICATION REQUIRED: [ input ]  [ VERIFY ]
```
- Correct answer: `VAULT` (case-insensitive: accept `VAULT`, `vault`, `Vault`) → module status changes to `AUTHORIZED`.
- Incorrect answer → `ACCESS DENIED` (generic, no further detail).

**Unlocked module content:**
```
DECRYPTION FILE RECOVERED
DECRYPTION CODE: ORION-7X4-29Q
```
This code must be displayed prominently, exactly as shown, with no further transformation or additional cipher step required. After viewing, the player returns to the Main Dashboard and Module 03 status updates to `COMPLETED`; Module 04 becomes `AUTHORIZED`.

---

### 6.7 Module 04 — Decrypt

**Locked state:** If Module 03 is not yet `COMPLETED`, display:
```
DECRYPTION MODULE LOCKED
RECOVER THE DECRYPTION CODE FIRST.
```

**Unlocked state (Module 03 completed):**
```
FINAL DECRYPTION
ENTER RECOVERED CODE: [ input ]  [ DECRYPT ]
```
- Correct answer: `ORION-7X4-29Q` (accept upper/lowercase variants).
- Incorrect submission → `DECRYPTION FAILED / INVALID CODE`.
- Correct submission → **stop the global timer immediately** and transition to the Final Congratulations screen.

---

## 7. Module State Reference Table

| Trigger | Module 01 | Module 02 | Module 03 | Module 04 |
|---|---|---|---|---|
| After login | RESTRICTED | AUTHORIZED | RESTRICTED | RESTRICTED |
| After entering `96241` | AUTHORIZED | — | — | — |
| After submitting `4268` | COMPLETED | — | — | — |
| After submitting `VAULT` | — | — | AUTHORIZED | — |
| After viewing decryption code | — | — | COMPLETED | AUTHORIZED |
| After submitting `ORION-7X4-29Q` | — | — | — | GAME COMPLETE |

---

## 8. Final Congratulations Screen

Full-screen success state, displayed only after correct submission in Module 04.

**Content:**
```
CONGRATULATIONS
ORION FINANCIAL SECURITY BREACH CONTAINED
CASE CLOSED

EMPLOYEE: EMMA JOSEPH
TRANSACTION TRAIL: RECOVERED
VAULT: ACCESSED
DECRYPTION: SUCCESSFUL

MISSION COMPLETED IN: [actual elapsed time, e.g. 16:42]
```
- Elapsed time is calculated from the real timer state at the moment of success and must remain frozen/stopped.
- A subtle success animation is permitted (understated, consistent with the overall tone — not a large celebratory effect).
- Action: `[ RESTART MISSION ]`.

---

## 9. Mission Failed Screen

Triggered automatically if the timer reaches `00:00` before the final code is successfully submitted.

**Content:**
```
MISSION FAILED
TIME EXPIRED
ORION FINANCIAL SECURITY SYSTEM LOCKED.
CASE TERMINATED.
```
- Displayed as a large, full-screen popup.
- Timer stops (remains at `00:00`).
- All module inputs and interactions are disabled.
- Action: `[ RESTART MISSION ]`.

---

## 10. Functional Requirement Summary Checklist

- [ ] Functional login with credential validation
- [ ] Global 20:00 countdown timer, persistent across all views, single start trigger
- [ ] Timer stops on final success; triggers failure screen at 00:00
- [ ] Persistent game/session state across modules (no state loss on navigation)
- [ ] Modal-based access-code verification for Modules 01 and 03
- [ ] Dynamic status badges (`RESTRICTED` / `AUTHORIZED` / `COMPLETED` / `LOCKED`) reflected on dashboard in real time
- [ ] Transaction table with 24+ shuffled, realistic records including the 4 designated suspicious entries
- [ ] Investigation code validation (Module 01)
- [ ] Vault code validation (Module 03)
- [ ] Final decryption code validation (Module 04), case-insensitive
- [ ] Module 04 gated behind Module 03 completion
- [ ] Final success screen with dynamically calculated completion time
- [ ] Failure screen with disabled interactions
- [ ] Full "Restart Mission" reset of timer, state, and all module statuses
- [ ] No hint system, hint button, or solution-revealing content anywhere in the product

---

## 11. Constraints & Guardrails

| Category | Constraint |
|---|---|
| Content | No hints, solution explanations, or clue text anywhere in the UI. |
| Structure | Single persistent dashboard; no separate page-per-puzzle navigation. |
| Visual style | Dark, terminal-based, financial/security aesthetic; no cartoon, emoji, neon, or "gamified" visual language. |
| Codes | All puzzle answers originate from the physical room; the site only validates, never generates or displays solutions in advance. |
| Data | Transaction data must avoid referencing "Kuwait"; must include exactly the four specified suspicious transactions among 24+ total records. |

---

## 12. Open Questions for Stakeholder Review

1. Should the global timer start exactly on successful login, or on a subsequent explicit "Begin Investigation" action? (Spec allows either; one must be finalized.)
2. Should game state persist across a browser refresh/reload (e.g., via local storage), or is a full in-memory session (reset on refresh) acceptable for the room's operating environment?
3. Is a single shared device/screen assumed for all 5 players, or should the design account for multiple simultaneous devices accessing the same session state?
4. What device/screen size(s) will be used in the physical room (desktop monitor, tablet, kiosk), to finalize responsive layout priorities?

---

*End of Document*

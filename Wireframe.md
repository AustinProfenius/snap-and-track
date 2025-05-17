

updates: 
1 · Global App Structure

                        ┌────────────────────────────────┐
                        │      Authentication Flow       │
                        │ (Splash → Login → Register →   │
                        │  Forgot PW / Reset PW)         │
                        └──────────────┬─────────────────┘
                                       │ (new) On‑Boarding Wizard
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            Main Tab Navigation                              │
│                       (bottom tab bar, 5 items)                            │
│                                                                              │
│  Home   Workouts   Snap Meal   Diary   Graphs                                │
│  │       │          │           │       │                                    │
│  ▼       ▼          ▼           ▼       ▼                                    │
│  §2.1    §2.2       §2.6        §2.5    §2.7                                  │
│                                                                              │
│  (Settings / Profile accessed via gear icon on Home header)                  │
└──────────────────────────────────────────────────────────────────────────────┘

Navigation rules

The Snap Meal tab is an action tab. Tapping it always pushes CameraScreen modally; on Save the user is routed Diary → ImageReview → Diary, then auto‑scrolled to the new entry. Back returns to the originating tab if the user cancels.

Hardware Back / system gesture pops in the current stack only, never jumps tabs.

Deep‑links (notifications, widgets) open their target inside the correct tab stack.

2 · Screen Specifications

Only screens that changed or are new are expanded below.Unmodified layouts from v1 remain valid.

2.1 Home / Dashboard (updated)

Quick Actions row at top:

“Log Meal” → opens Snap Meal tab.

“Start Workout” → opens Workout creation.

First‑launch empty state illustration + CTA to complete onboarding or log first meal.

Daily Summary tiles unchanged.

2.2 Workouts (list‑first UX)

Default screen = Workout List

┌─────────────────────────────────────────┐
│  Workouts                ＋             │
│  Weekly Summary  (card)                 │
│  ───────────────────────────────        │
│  • Morning HIIT  | Today  | 30 min      │
│  • Upper Body    | Yesterday | 45 min   │
│  • Leg Day       | 2 days ago | 50 min  │
│  …                                          
│  (FAB optional on Android ▼)            │
└─────────────────────────────────────────┘

The "＋" icon sits in the top‑right corner of the header bar on iOS. On Android a floating action button (FAB) anchored bottom‑right may be used; both trigger the same New Workout flow.

Enhancement

Interaction / Visual

Add new workout

Tap "＋" → New Workout screen (template picker → details).

Copy previous

Swipe‑right on a list row → Duplicate.

Resume in‑progress

Banner above list when a session is saved mid‑workout.

Search exercises

Inside New Workout, ＋ Add Exercise launches searchable DB first.

Timers

Sticky Workout Timer bar appears when a session is active; rest timers per set.

2.3 Authentication Add‑ons Authentication Add‑ons

Forgot Password Screen – email entry → send reset link.

Reset Password Screen – token + new password.

Change Password Screen – inside Settings › Account.

Biometric Opt‑In Dialog – appears after first successful login when device supports Face ID / fingerprint.

2.4 On‑Boarding Wizard (new)

Welcome / Goal selection (Lose / Maintain / Gain, activity level).

Physical data (height, weight, DOB, sex).

Macro & calorie targets (auto‑calculated, editable).

Units select (metric / imperial).

Finish → Dashboard.

2.5 Diary (updates)

Swipe left on food row → Delete.

Tap food row → opens editable Food Details Modal.

Empty‑day state illustration + “Add your first meal”.

2.6 Snap Meal Flow (replaces Camera tab)

Camera Screen — unchanged + Barcode icon + Import from Gallery icon.

Image Review — adds “Nothing found? Search manually” button.

2.7 Graphs (updates)

Segmented control: Nutrition | Workouts.

Date range picker quick‑jump (Day ▾ | Week | Month).

Tap a data point → opens the relevant Diary or Workout detail.

2.8 Settings / Profile (merged)

Settings now opens from a gear icon on Home header.

Section

New items

Profile & Goals

Edit height, weight, calorie & macro goals, Unit toggle.

Data

Export CSV, Import CSV, Apple Health / Google Fit switch.

Reminders

Meal logging, workout reminder push notifications.

Security

Change Password, Biometric toggle.

3 · Edge‑Case & System Behaviours

Offline – Local cache; queue uploads, show ⚠ banner when offline.

Loading / Error components – each network/AI call surfaces skeleton or error state.

Accessibility – Text scales, charts provide alt‑labels, meets WCAG AA color contrast.

4 · Core User Flows (updated)

AUTH ➔ Onboard ➔ Tabs

Home
 └─ CTA → Snap Meal → Camera → Review → Diary

Workouts
 └─ [+]   → New Workout
            ├─ Select Template or Empty
            ├─ Add Exercises (Search ▸ Form)
            ├─ In‑Progress Timer + Rest timers
            └─ Save → Workout List

Diary (tab / autoland)
 └─ [+] Search ▸ Food Details → Save
   ↳ edit / delete via row actions

Graphs
 └─ Segmented (Nutrition / Workout)  → drill‑down on tap

Settings / Profile
 └─ Edit goals, units, reminders, export, security.

5 · Data Entities (delta‑only)

User now stores unitSystem, goalCalories, goalMacros, biometrics, reminder prefs.

FoodEntry gains barcodeId (nullable) and source («AI», «Barcode», «Manual»).

WorkoutSession gains isInProgress (bool) & resumeTimestamp.

6 · Open Questions / Next Steps

UPC / nutrition database API selection (USDA vs. Edamam vs. proprietary).

Exercise DB licensing.

Charting library pick (Victory, MPAndroidChart, etc.).

Decide whether Diary needs its own bottom‑tab or could live under Home + filters.

Document version: v2.0 – 2025‑04‑26


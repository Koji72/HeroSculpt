# Spec: User Registration & Onboarding Flow

**Date:** 2026-03-16
**Branch:** feat/dark-comics-redesign
**Status:** Approved

---

## Overview

Improve the new-user experience by adding visible registration entry points, a clean Dark Comics registration form, and a post-registration welcome screen that reveals newly unlocked features (Library, Poses, Save).

### Goals
- Users immediately see they can register (JOIN button always visible)
- Locked features are discoverable without being annoying
- Registration feels like a moment — not a chore
- After registering, users know exactly what they unlocked

### Non-Goals
- Real email delivery (stays in simulation mode)
- Social login (Google/GitHub)
- Multi-step onboarding tutorial

---

## 1. Entry Points (AB approach)

### 1a. Header JOIN button

Add a `JOIN ▶` button in amber to the right of `CHECKOUT →` in the app header. Always visible when user is not authenticated.

**File:** `App.tsx` (header section)

```
When unauthenticated:  [...] CART  CHECKOUT →  [JOIN ▶]
When authenticated:    [...] CART  CHECKOUT →  [👤 nombre]
```

- Clicking `JOIN ▶` opens `AuthModal` in `signup` mode
- When authenticated: shows user display name or email prefix, clicking opens a small dropdown with `LOG OUT` option
- Use existing `useAuth` hook — no auth logic changes

### 1b. Ghosted locked features

Two features require authentication: **Poses** (bottom bar) and **Library** (right panel tab).

**Poses button (bottom bar):**
- When unauthenticated: renders with `opacity: 0.5`, `border: 1px dashed var(--color-accent)`, `cursor: not-allowed` overlay with `🔒` icon
- On click: shows inline tooltip/banner _"🔒 POSES · CREATE FREE ACCOUNT"_ with a button that opens AuthModal in signup mode
- When authenticated: renders normally, no lock

**Library tab (right panel):**
- The `STATS` tab in the right panel strip: no change (always accessible)
- Add a `LIBRARY` tab to the right panel strip (currently missing from the panel tabs)
- When unauthenticated: tab renders ghosted (opacity 0.5, dashed border) with `🔒` prefix
- On click: opens AuthModal in signup mode instead of the panel
- When authenticated: opens PurchaseLibrary panel (same width 320px as other right panels)

---

## 2. Auth Modal Redesign

**File:** `components/AuthModal.tsx`

Replace the `@supabase/auth-ui-react` `<Auth>` component with a custom form that calls Supabase auth methods directly (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`). This gives full control over the visual shell and is required to match the Dark Comics mockup. The auth logic calls remain the same — only the UI layer changes.

**Remove** the existing internal auto-close (`setTimeout → onClose()` on `SIGNED_IN`). The modal must NOT close itself. Closing is entirely the parent's responsibility via `App.tsx`'s `useEffect`.

The modal has two modes toggled by a text link — not tabs.

### Signup mode
```
┌─────────────────────────────────┐
│  ÚNETE AL ESCUADRÓN             │
│  CREA TU CUENTA GRATUITA        │
│                                 │
│  EMAIL                          │
│  [________________________]     │
│                                 │
│  CONTRASEÑA                     │
│  [________________________]     │
│                                 │
│  [    CREAR CUENTA →    ]       │
│                                 │
│  ¿Ya tienes cuenta? INICIAR SESIÓN │
└─────────────────────────────────┘
```

### Login mode
```
┌─────────────────────────────────┐
│  BIENVENIDO DE VUELTA           │
│                                 │
│  EMAIL                          │
│  [________________________]     │
│                                 │
│  CONTRASEÑA                     │
│  [________________________]     │
│                                 │
│  [      ENTRAR →       ]        │
│                                 │
│  ¿Nuevo aquí? ÚNETE GRATIS      │
└─────────────────────────────────┘
```

**Styling:**
- Background: `var(--color-surface)` / `--color-surface-2`
- Border: `var(--color-border)`
- Input fields: `var(--color-surface)` bg, `var(--color-border)` border, `var(--color-text)` text
- Labels: uppercase, `var(--color-text-muted)`, `font-family: var(--font-comic)`
- CTA button: `var(--color-accent)` background, black text, full width
- Link text: `var(--color-text-muted)` with accent-colored clickable portion
- Close button: top-right `✕`

**Props:**
```ts
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup'; // defaults to 'signup'
}
```

The `initialMode` prop sets the component's internal `mode` state on mount via `useState(initialMode ?? 'signup')`.

**Internal state:**
```ts
const [mode, setMode] = useState<'signin' | 'signup'>(initialMode ?? 'signup');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
```

**Submit handler (signup):** calls `supabase.auth.signUp({ email, password })`. On success: sets `sessionStorage.setItem('just_registered', '1')`. Does NOT call `onClose()`.

**Submit handler (signin):** calls `supabase.auth.signInWithPassword({ email, password })`. On success: does NOT call `onClose()`.

**Error handling:** Inline below the CTA button, `color: var(--color-accent)` text (not a toast).

**Success:** On successful signup/signin, `onAuthStateChange` in `useAuth` fires automatically — modal does NOT close itself. The parent (`App.tsx`) listens to `user` state change and triggers the welcome screen (for signup) or just closes the modal (for signin).

---

## 3. Welcome Screen (post-registration only)

**File:** New component `components/WelcomeScreen.tsx`

Shown once, immediately after a new signup. Triggered in `App.tsx` when `user` transitions from `null` → non-null AND `isNewUser` flag is true.

**How to detect new user:** `AuthModal` sets `sessionStorage.setItem('just_registered', '1')` on a successful signup (before `onAuthStateChange` fires). The `useEffect` in `App.tsx` checks for this flag — it only shows the WelcomeScreen if `sessionStorage.getItem('just_registered') === '1'`. After showing, the flag is removed: `sessionStorage.removeItem('just_registered')`. This correctly distinguishes a fresh signup from a returning user logging in on any device.

### Layout
```
┌─────────────────────────────────┐
│  ¡BIENVENIDO!                   │
│  hero_user@mail.com             │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📚 LIBRERÍA DESBLOQUEADA│ → │
│  │ Guarda y gestiona héroes│    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🎭 POSES DESBLOQUEADAS  │    │
│  │ Guarda poses de tu héroe│    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 💾 GUARDAR CONFIG       │    │
│  │ Sincronizado en la nube │    │
│  └─────────────────────────┘    │
│                                 │
│  [      CONTINUAR →     ]       │
└─────────────────────────────────┘
```

**Feature cards:**
| Feature | Accent color | Left border | CTA |
|---------|-------------|-------------|-----|
| 📚 LIBRERÍA DESBLOQUEADA | `var(--color-accent)` #f59e0b | amber | `VER →` button (opens Library) |
| 🎭 POSES DESBLOQUEADAS | `#22c55e` green | green | none |
| 💾 GUARDAR CONFIGURACIONES | `#3b82f6` blue | blue | none |

**Props:**
```ts
interface WelcomeScreenProps {
  isOpen: boolean;
  userEmail: string;
  onClose: () => void;
  onOpenLibrary: () => void;
}
```

**Behavior:**
- `CONTINUAR →` calls `onClose()`
- `VER →` on Library card calls `onOpenLibrary()` then `onClose()`
- Modal closes on backdrop click
- Does NOT show for existing users logging back in

---

## 4. App.tsx Wiring

### New state
```ts
const [isWelcomeScreenOpen, setIsWelcomeScreenOpen] = useState(false);
const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
```

### New useEffect — detect new user after auth
```ts
useEffect(() => {
  if (!user) return;
  const justRegistered = sessionStorage.getItem('just_registered') === '1';
  if (justRegistered) {
    sessionStorage.removeItem('just_registered');
    setIsWelcomeScreenOpen(true);
    setIsAuthModalOpen(false);
  } else {
    // Returning user login — just close auth modal if it was open
    setIsAuthModalOpen(false);
  }
}, [user?.id]);
```

### JOIN button in header
Add after `CHECKOUT →` button:
```tsx
{!user && (
  <button onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}>
    JOIN ▶
  </button>
)}
{user && (
  <span>{user.email?.split('@')[0]?.toUpperCase()}</span>
)}
```

### LIBRARY tab in right panel strip
Extend the `activeRightPanel` state type AND the `toggleRightPanel` function to include `'library'`:
```ts
// State type
const [activeRightPanel, setActiveRightPanel] = useState<'stats' | 'style' | 'skins' | 'lights' | 'library' | null>('stats');

// Toggle function — update parameter type to include 'library'
const toggleRightPanel = (panel: 'stats' | 'style' | 'skins' | 'lights' | 'library') =>
  setActiveRightPanel(p => p === panel ? null : panel);
```

The `LIBRARY` tab in the tab strip uses a different click handler than the others (auth-conditional), so it does NOT use `toggleRightPanel`. Instead, call `setActiveRightPanel` directly:

When `library` tab clicked:
- If unauthenticated: `setAuthModalMode('signup'); setIsAuthModalOpen(true);`
- If authenticated: `setActiveRightPanel(p => p === 'library' ? null : 'library')`

Panel content when `activeRightPanel === 'library'`:
```tsx
<PurchaseLibrary
  isOpen={true}
  user={user}
  onLoadConfiguration={handleLoadConfiguration}
  onClose={() => setActiveRightPanel(null)}
/>
```

### AuthModal render call
Update the existing `<AuthModal>` JSX in `App.tsx` to wire `initialMode`:
```tsx
<AuthModal
  isOpen={isAuthModalOpen}
  onClose={() => setIsAuthModalOpen(false)}
  initialMode={authModalMode}
/>
```

### WelcomeScreen wiring
```tsx
<WelcomeScreen
  isOpen={isWelcomeScreenOpen}
  userEmail={user?.email ?? ''}
  onClose={() => setIsWelcomeScreenOpen(false)}
  onOpenLibrary={() => {
    setIsWelcomeScreenOpen(false);
    setActiveRightPanel('library');
  }}
/>
```

---

## 5. Poses Lock State

**File:** `App.tsx` (bottom bar section where POSES button renders)

Locate the POSES button in the bottom bar. Wrap with lock state:

```tsx
{!user ? (
  <button
    style={{ opacity: 0.5, border: '1px dashed var(--color-accent)', cursor: 'not-allowed' }}
    onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
    title="🔒 POSES · CREATE FREE ACCOUNT"
  >
    🔒 POSES
  </button>
) : (
  <button onClick={handleSavePose}>POSES</button>
)}
```

---

## 6. Files Changed

| File | Change |
|------|--------|
| `App.tsx` | JOIN button in header, user display, LIBRARY tab, WelcomeScreen wiring, POSES lock, authModalMode state, isWelcomeScreenOpen state, useEffect for new user detection |
| `components/AuthModal.tsx` | Full visual rewrite (keep Supabase logic), add `initialMode` prop |
| `components/WelcomeScreen.tsx` | **New file** — welcome screen component |

---

## 7. Testing

- Guest user: JOIN button visible in header, POSES ghosted, LIBRARY tab ghosted
- Click ghosted POSES → AuthModal opens in signup mode
- Click ghosted LIBRARY tab → AuthModal opens in signup mode
- Register new account → WelcomeScreen shows with 3 feature cards
- Click VER → on Library card → Library panel opens
- Click CONTINUAR → → returns to customizer, features unlocked
- Login with existing account → WelcomeScreen does NOT show
- Logout → features revert to locked state, JOIN button reappears

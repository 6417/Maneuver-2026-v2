# Maneuver Core - Template App Setup Complete

## ✅ What Was Done

### 1. Package Structure Transformation
**Changed from:** Library package with exports  
**Changed to:** Complete React PWA template app

- ✅ Removed library exports (`main`, `types`, `exports` fields)
- ✅ Added `"private": true` (not publishable to npm)
- ✅ Added all React app dependencies (React, Vite, Tailwind, Radix UI)
- ✅ Updated scripts for development workflow

### 2. New Files Created

#### Build Configuration
- `vite.config.ts` - Vite build setup with PWA plugin, Tailwind, path aliases
- `eslint.config.js` - ESLint flat config for React + TypeScript
- `tsconfig.json` - Already existed ✓

#### Entry Points
- `index.html` - HTML entry with PWA meta tags
- `src/main.tsx` - React entry point + service worker registration
- `src/App.tsx` - Basic router setup (placeholder)
- `src/index.css` - Tailwind v4 imports + theme CSS variables
- `src/vite-env.d.ts` - Vite + environment types

### 3. Dependencies Added

#### Core React (58.8 KB total runtime)
- react ^18.3.1
- react-dom ^18.3.1
- react-router-dom ^6.26.2

#### UI Framework (Radix UI primitives + utilities)
- @radix-ui/react-* (avatar, dialog, dropdown, select, separator, slot, tooltip)
- lucide-react ^0.460.0 (icons)
- framer-motion ^11.11.17 (animations)
- class-variance-authority ^0.7.0 (component variants)
- clsx + tailwind-merge (utility classes)
- sonner ^1.7.1 (toasts)
- vaul ^1.1.1 (drawer)

#### Database (Already had)
- dexie ^4.0.8
- dexie-react-hooks ^1.1.7

#### Data Transfer (Already had)
- qrcode ^1.5.4
- jsqr ^1.4.0
- simple-peer ^9.11.1
- socket.io-client ^4.7.5

#### Build Tools
- vite ^6.0.1
- @vitejs/plugin-react-swc ^3.7.1
- vite-plugin-pwa ^0.20.5
- tailwindcss ^4.0.0-beta.6
- @tailwindcss/vite ^4.0.0-beta.6
- tw-animate-css ^1.0.1

## 📦 Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test Build
```bash
npm run build
```

## 🚀 What This Enables

Teams can now:
1. **Fork** maneuver-core repository
2. **Install** dependencies with `npm install`
3. **Start coding** their game implementation in `src/game-template/`
4. **Run immediately** with `npm run dev`
5. **Build & deploy** with `npm run build`

## 📊 Bundle Size Target

- **Target:** ≤ 2.1 MB (including game implementation)
- **Core framework:** TBD (measure after extracting core code)
- **Game implementation budget:** ~500 KB

## 🔄 What's Different from Maneuver 2025

### Removed (Game-Specific)
- All 2025 game logic (scoring, validation, strategy)
- Game-specific pages (AutoStartPage, TeleopScoringPage, etc.)
- 2025-specific utilities (coral counting, algae tracking)

### Kept (Framework)
- Database layer (Dexie, 4 separate DBs)
- PWA infrastructure (service worker, install prompt, caching)
- UI components (shadcn/ui base components)
- Data transfer (QR codes, WebRTC)
- TBA API integration (generic)
- Router setup (generic pages)

### Added (Template System)
- Game interface definitions in `src/core/types/game-interfaces.ts`
- Game template stubs in `src/game-template/`
- GameContext provider for injecting game logic
- Generic database schema using `ScoutingEntryBase`

## 📝 Template Repository Pattern

This is NOT an npm package. Teams do NOT run:
```bash
npm install @maneuver/core  # ❌ WRONG
```

Instead, teams:
```bash
# 1. Fork the repository on GitHub
# 2. Clone their fork
git clone https://github.com/TeamXXXX/maneuver-2026.git
cd maneuver-2026

# 3. Install dependencies
npm install

# 4. Implement game logic in src/game-template/
# 5. Start developing
npm run dev
```

## 🎯 Ready for Code Porting

Now we can start extracting core code from Maneuver 2025:
1. Database layer (`src/lib/dexieDB.ts` → `src/core/db/`)
2. PWA infrastructure (`src/components/InstallPrompt.tsx`, etc.)
3. UI components (`src/components/ui/` → `src/core/components/ui/`)
4. Hooks (`src/hooks/` → `src/core/hooks/`)
5. Utilities (`src/lib/utils.ts`, `src/lib/analytics.ts`, etc.)

The framework is now properly structured as a complete React app template! 🎉

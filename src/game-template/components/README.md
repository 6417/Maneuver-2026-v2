# Game-Template Components

This directory contains **game-specific components** that teams customize for their FRC game year. Components are organized by the page they're used on.

## Directory Structure

```
components/
├── index.ts                  # Main export file (import from here)
├── auto-start/               # Components for AutoStartPage
│   ├── index.ts
│   └── FieldSelector.tsx     # Starting position selector
├── pit-scouting/             # Components for PitScoutingPage
│   ├── index.ts
│   └── GameQuestions.tsx     # Game-specific pit questions
└── scoring/                  # Components for AutoScoringPage & TeleopScoringPage
    ├── index.ts
    └── ScoringSections.tsx   # Game-specific scoring UI
```

## How to Use

### Import from the main index:

```typescript
import { AutoStartFieldSelector, GameSpecificQuestions } from "@/game-template/components";
```

### Or import from page-specific directories:

```typescript
import { AutoStartFieldSelector } from "@/game-template/components/auto-start";
import { GameSpecificQuestions } from "@/game-template/components/pit-scouting";
```

## Customization Guide

### 1. Auto Start Components (`auto-start/`)

**Used by:** `AutoStartPage` (`src/core/pages/AutoStartPage.tsx`)

**Purpose:** Allow scouts to select starting positions for autonomous mode.

**Current Component:**
- `FieldSelector.tsx` - Starting position selector with field map

**How to Customize:**
1. Open `auto-start/FieldSelector.tsx`
2. Replace the placeholder implementation with your field map
3. Update the number of starting positions if needed
4. Customize styling to match your game's field design

**Example:** See JSDoc comments in `FieldSelector.tsx`

### 2. Pit Scouting Components (`pit-scouting/`)

**Used by:** `PitScoutingPage` (`src/core/pages/PitScoutingPage.tsx`)

**Purpose:** Collect game-specific data during pit scouting.

**Current Component:**
- `GameQuestions.tsx` - Game-specific pit scouting questions

**How to Customize:**
1. Open `pit-scouting/GameQuestions.tsx`
2. Replace the placeholder with your custom questions
3. Add checkboxes, selects, inputs as needed
4. Use the `onGameDataChange` callback to update form state

**Example:** See JSDoc comments in `GameQuestions.tsx`

### 3. Scoring Components (`scoring/`)

**Used by:** `AutoScoringPage` and `TeleopScoringPage` (`src/core/pages/`)

**Purpose:** Provide scoring UI for recording game actions during match.

**Current Component:**
- `ScoringSections.tsx` - Game-specific scoring buttons and controls

**How to Customize:**
1. Open `scoring/ScoringSections.tsx`
2. Replace the placeholder with your scoring UI
3. Create buttons for each type of scoring action
4. Call `onAddAction` callback when user records action
5. Optionally show different UI based on `phase` ('auto' vs 'teleop')

**Example:** See JSDoc comments in `ScoringSections.tsx`

### `StatusToggles.tsx`

**Purpose:** Phase-specific toggle buttons for tracking robot status (auto bonuses, defense, climbing, issues)

**Current Component:** Placeholder with examples for each phase

**Customization Steps:**
1. Open `scoring/StatusToggles.tsx`
2. Replace the placeholder with your status toggle UI
3. Define phase-specific toggles:
   - **Auto:** Line crossing, taxi points, mobility bonuses
   - **Teleop:** Defense played, positioning, special abilities
   - **Endgame:** Climbing attempts, parking, issues (climb failed, broke down)
4. Group related toggles into sections (e.g., "Climbing" and "Issues" in 2025)
5. Create toggle buttons for each status option
6. Call `onStatusUpdate` callback to update robot status
7. Show/hide sections based on `phase` prop

**Example Implementations:**
- 2025 Reefscape Endgame: Climbing (Shallow/Deep/Park Attempted), Issues (Climb Failed, Broke Down)
- 2024 Crescendo Endgame: Parked, Climbed, Harmony, Spotlit, Trap Scored
- Any game Auto: Mobility/line crossing toggles

**Example:** See JSDoc comments in `StatusToggles.tsx`

## Adding New Page-Specific Components

If you need components for additional pages:

1. **Create a new directory:**
   ```bash
   mkdir src/game-template/components/[page-name]
   ```

2. **Create your component:**
   ```typescript
   // src/game-template/components/[page-name]/MyComponent.tsx
   export function MyComponent({ ... }) {
     // Your implementation
   }
   ```

3. **Create page index:**
   ```typescript
   // src/game-template/components/[page-name]/index.ts
   export { MyComponent } from './MyComponent';
   ```

4. **Export from main index:**
   ```typescript
   // src/game-template/components/index.ts
   export { MyComponent } from './[page-name]';
   ```

## Organization Benefits

✅ **Clear structure** - Easy to find components by page
✅ **Scalable** - Add new pages without clutter
✅ **Maintainable** - Each page's components are isolated
✅ **Documented** - Page-specific READMEs can be added
✅ **Type-safe** - All exports flow through typed index files

## Migration Between Years

When creating a new year's app:

```bash
# Copy entire game-template
cp -r src/game-template src/game-2026

# Update imports in core pages
# From: "@/game-template/components"
# To:   "@/game-2026/components"
```

The directory structure remains the same, making migration straightforward!

## Documentation

- 📚 **Full Guide:** `docs/GAME_COMPONENTS.md`
- 🎯 **Framework Design:** `docs/FRAMEWORK_DESIGN.md`
- 🚀 **Integration Guide:** `docs/INTEGRATION_GUIDE.md` (if exists)

---

**Remember:** These components should contain **game-specific logic only**. Keep year-agnostic functionality in the core framework! 🎯

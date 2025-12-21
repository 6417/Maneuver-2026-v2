# Game-Specific Components Guide

This guide explains how to customize the scouting app for your specific FRC game year without modifying the core framework.

## Overview

The maneuver-core framework uses a **slot-based architecture** where game-specific components are imported from `game-template/components/` into core pages. This allows teams to:

- ✅ Customize game-specific UI without touching core code
- ✅ Easily update for new game years
- ✅ Maintain framework updates without merge conflicts
- ✅ Keep clear separation between framework and game logic

## Game-Specific Component Locations

All game-specific components live in `src/game-template/components/`, organized by page:

```
src/game-template/components/
├── index.ts                      # Export all game components
├── auto-start/
│   ├── index.ts                  # Auto start exports
│   └── FieldSelector.tsx         # Starting position selector
├── pit-scouting/
│   ├── index.ts                  # Pit scouting exports
│   └── GameQuestions.tsx         # Game-specific pit questions
└── [other-pages]/                # Add more page-specific directories
    └── [YourComponents].tsx
```

## Core Pages That Use Game Components

### 1. AutoStartPage (`src/core/pages/AutoStartPage.tsx`)

**Component Slot:** `<AutoStartFieldSelector>`

**Purpose:** Allows scouts to select where the robot starts autonomous mode.

**Props Interface:**

```typescript
interface AutoStartFieldSelectorProps {
  startPoses: (boolean | null)[];      // Array of 6 position states
  setStartPoses: ((value: boolean | null) => void)[];  // Setter functions
  alliance?: string;                   // 'red' or 'blue'
}
```

**Data Storage:**
The selected position is stored as an array in the scouting entry:

```typescript
startPoses: [false, true, false, false, false, false]
// Position 1 (index 1) is selected
```

**How It's Used:**

```typescript
// In AutoStartPage.tsx
import { AutoStartFieldSelector } from "@/game-template/components";

<AutoStartFieldSelector
  startPoses={startPoses}
  setStartPoses={setStartPoses}
  alliance={states?.inputs?.alliance}
/>
```

**Customization Example:**

For **2025 Reefscape**, you might have 4 starting positions:

```typescript
// game-template/components/auto-start/FieldSelector.tsx
import ReefscapeFieldMap from "@/game/components/ReefscapeFieldMap2025";

export function AutoStartFieldSelector({ startPoses, setStartPoses, alliance }: AutoStartFieldSelectorProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Starting Position</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select your robot's starting position on the reef
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full border rounded-lg overflow-hidden bg-blue-50 dark:bg-blue-950/20">
          <ReefscapeFieldMap 
            startPoses={startPoses}
            setStartPoses={setStartPoses}
            alliance={alliance}
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

For **2024 Crescendo**, you might have 3 starting positions:

```typescript
export function AutoStartFieldSelector({ startPoses, setStartPoses, alliance }: AutoStartFieldSelectorProps) {
  const positions = [
    { index: 0, label: "Amp Side", x: 50, y: 100 },
    { index: 1, label: "Center", x: 200, y: 150 },
    { index: 2, label: "Source Side", x: 350, y: 100 },
  ];

  const handleClick = (index: number) => {
    setStartPoses.forEach(setter => setter(false)); // Clear all
    setStartPoses[index](true); // Set clicked
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Starting Position</CardTitle>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 400 200" className="w-full">
          {/* Field SVG */}
          <rect fill={alliance === 'red' ? '#ff0000' : '#0000ff'} />
          
          {positions.map(pos => (
            <circle
              key={pos.index}
              cx={pos.x}
              cy={pos.y}
              r={30}
              fill={startPoses[pos.index] ? 'green' : 'gray'}
              onClick={() => handleClick(pos.index)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}
```

### 2. PitScoutingPage (`src/core/pages/PitScoutingPage.tsx`)

**Component Slot:** `children` prop (optional)

**Purpose:** Allows teams to add game-specific questions to pit scouting.

**Props Access:**

```typescript
interface PitScoutingPageProps {
  children?: React.ReactNode;
}

// Access form state via custom hook
const { formState, setGameData } = usePitScoutingForm();
```

**How It's Used:**

```typescript
// In your App.tsx or routing
import { GameSpecificQuestions } from "@/game-template/components";

<Route 
  path="/pit-scouting" 
  element={
    <PitScoutingPage>
      <GameSpecificQuestions />
    </PitScoutingPage>
  } 
/>
```

**Customization Example:**

For **2025 Reefscape**, you might ask about coral/algae capabilities:

```typescript
// game-template/components/pit-scouting/GameQuestions.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Label } from "@/core/components/ui/label";

interface GameSpecificQuestionsProps {
  gameData?: Record<string, unknown>;
  onGameDataChange: (data: Record<string, unknown>) => void;
}

export function GameSpecificPitQuestions({ gameData = {}, onGameDataChange }: GameSpecificQuestionsProps) {
  const handleChange = (key: string, value: unknown) => {
    onGameDataChange({ ...gameData, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reefscape Capabilities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="canScoreCoral"
            checked={gameData.canScoreCoral as boolean}
            onCheckedChange={(checked) => handleChange('canScoreCoral', checked)}
          />
          <Label htmlFor="canScoreCoral">Can score coral</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="canScoreAlgae"
            checked={gameData.canScoreAlgae as boolean}
            onCheckedChange={(checked) => handleChange('canScoreAlgae', checked)}
          />
          <Label htmlFor="canScoreAlgae">Can score algae</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="canClimb"
            checked={gameData.canClimb as boolean}
            onCheckedChange={(checked) => handleChange('canClimb', checked)}
          />
          <Label htmlFor="canClimb">Can climb at endgame</Label>
        </div>
      </CardContent>
    </Card>
  );
}

## Adding New Game-Specific Components

If you need to add more game-specific slots to core pages:

### Step 1: Create the Component

```typescript
// src/game-template/components/[page-name]/MyCustomComponent.tsx
interface MyCustomComponentProps {
  // Define your props
  data: any;
  onChange: (data: any) => void;
}

export function MyCustomComponent({ data, onChange }: MyCustomComponentProps) {
  return (
    <Card>
      {/* Your game-specific UI */}
    </Card>
  );
}
```

### Step 2: Export from Page Index

```typescript
// src/game-template/components/[page-name]/index.ts
export { MyCustomComponent } from './MyCustomComponent';
```

### Step 3: Export from Main Index

```typescript
// src/game-template/components/index.ts
export { MyCustomComponent } from './[page-name]';
```

### Step 4: Use in Core Page

```typescript
// src/core/pages/SomePage.tsx
import { MyCustomComponent } from "@/game-template/components";

function SomePage() {
  return (
    <div>
      {/* Core UI */}
      <MyCustomComponent data={data} onChange={handleChange} />
      {/* More core UI */}
    </div>
  );
}
```

## Best Practices

### ✅ DO

- Keep all game-specific logic in `game-template/components/`
- Use TypeScript interfaces for type safety
- Document your component props with JSDoc comments
- Provide example implementations in comments
- Use core UI components (Card, Button, etc.) for consistency
- Test with multiple screen sizes (mobile, tablet, desktop)

### ❌ DON'T

- Modify core pages directly for game-specific features
- Hardcode game-specific values in core components
- Break the component interface (props must match what core pages expect)
- Forget to export new components from `index.ts`

## Migration Between Years

When creating a new year's app (e.g., maneuver-2026):

1. **Copy the template:**

   ```bash
   cp -r src/game-template src/game-2026
   ```

2. **Update components:**
   - Modify `auto-start/FieldSelector.tsx` for new field
   - Update `pit-scouting/GameQuestions.tsx` for new game pieces
   - Add any new page-specific directories as needed

3. **Update imports:**

   ```typescript
   // Change from:
   import { AutoStartFieldSelector } from "@/game-template/components";
   
   // To:
   import { AutoStartFieldSelector } from "@/game-2026/components";
   ```

4. **Update routing:**

   ```typescript
   // Update children in routes
   <Route 
     path="/pit-scouting" 
     element={
       <PitScoutingPage>
         <GameSpecificQuestions />
       </PitScoutingPage>
     } 
   />
   ```

## Testing Your Components

1. **Visual Testing:**
   - Test on mobile (portrait/landscape)
   - Test on tablet
   - Test on desktop (small/large screens)
   - Test both light and dark mode

2. **Functional Testing:**
   - Verify data is saved correctly
   - Check edge cases (no selection, multiple selections if allowed)
   - Test with different alliances (red/blue)
   - Verify form validation works

3. **Integration Testing:**
   - Ensure data flows to database correctly
   - Check QR code export includes your data
   - Verify data appears in team analysis views

## Need Help?

- See `docs/FRAMEWORK_DESIGN.md` for interface specifications
- Check `docs/INTEGRATION_GUIDE.md` for complete implementation examples
- Review existing components in `src/core/components/` for UI patterns
- Look at `src/game-template/` for starter templates

---

**Remember:** The goal is to customize the game-specific parts without touching the core framework. This keeps your app maintainable and upgradeable! 🎯

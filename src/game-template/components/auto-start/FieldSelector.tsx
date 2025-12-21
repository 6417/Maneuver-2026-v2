/**
 * Game-Specific Auto Start Position Selector Component
 * 
 * This component is responsible for displaying the field map and allowing scouts
 * to select starting positions for autonomous mode.
 * 
 * HOW TO CUSTOMIZE FOR YOUR GAME YEAR:
 * ====================================
 * 
 * 1. Update the field map image/SVG for your game year
 * 2. Define starting positions based on your game's rules
 * 3. Customize the position labels and layout
 * 4. Adjust styling to match your field design
 * 
 * EXAMPLE IMPLEMENTATION:
 * 
 * For 2025 Reefscape, you might have:
 * - 4 starting positions (left, center-left, center-right, right)
 * - Alliance-specific coloring
 * - Field zones for coral/algae
 * 
 * For 2024 Crescendo, you might have:
 * - 3 starting positions (left, center, right)
 * - Speaker/amp side designations
 * 
 * INTERFACE:
 * - startPosition: Array of boolean/null values representing selected positions
 * - setStartPosition: Array of setter functions for each position
 * - alliance: 'red' | 'blue' - determines field orientation/coloring
 * 
 * DATA STORAGE:
 * The selected positions are stored as an array in the scouting entry:
 * startPosition: [false, true, false, false, false, false]
 * This indicates position 1 (index 1) is selected.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface AutoStartFieldSelectorProps {
  startPosition: (boolean | null)[];
  setStartPosition: ((value: boolean | null) => void)[];
  alliance?: string;
}

/**
 * Default/Placeholder Field Selector Component
 * 
 * This is a simple placeholder that shows teams where to implement their
 * year-specific starting position selector.
 * 
 * Replace this entire component with your game-specific implementation.
 */
export function AutoStartFieldSelector({
  startPosition,
  setStartPosition,
  alliance,
}: AutoStartFieldSelectorProps) {
  const selectedPosition = startPosition.findIndex(pos => pos === true);
  const hasSelection = startPosition.some(pos => pos === true);

  // Example: Simple grid of position buttons
  const positions = [
    { index: 0, label: "Position 0", row: 0, col: 0 },
    { index: 1, label: "Position 1", row: 0, col: 1 },
    { index: 2, label: "Position 2", row: 0, col: 2 },
    { index: 3, label: "Position 3", row: 1, col: 0 },
    { index: 4, label: "Position 4", row: 1, col: 1 },
    { index: 5, label: "Position 5", row: 1, col: 2 },
  ];

  const handlePositionClick = (index: number) => {
    // Clear all positions
    setStartPosition.forEach(setter => setter(false));
    // Set the clicked position
    if (setStartPosition[index]) {
      setStartPosition[index](true);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-xl xl:text-2xl">Starting Position</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click where your robot starts on the field
        </p>
        {hasSelection && (
          <Badge className="w-fit bg-green-600">
            Position {selectedPosition} Selected
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center space-y-2">
            <AlertTriangle className="h-10 w-10 mx-auto text-amber-500" />
            <h3 className="font-semibold text-base">Game-Specific Implementation Needed</h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Replace this component with your game year's field map and starting positions.
            </p>
          </div>
          
          {/* Example: Simple position grid */}
          <div className="grid grid-cols-3 gap-3">
            {positions.map((pos) => (
              <button
                key={pos.index}
                onClick={() => handlePositionClick(pos.index)}
                className={`
                  w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 font-semibold text-xs sm:text-sm
                  transition-all duration-200
                  ${startPosition[pos.index] 
                    ? `border-green-500 bg-green-100 dark:bg-green-900/40 ring-2 ring-green-200 dark:ring-green-800` 
                    : `border-border hover:border-primary hover:bg-accent`
                  }
                  ${alliance === 'red' && startPosition[pos.index]
                    ? 'border-red-500 bg-red-100 dark:bg-red-900/40 ring-red-200 dark:ring-red-800'
                    : ''
                  }
                  ${alliance === 'blue' && startPosition[pos.index]
                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40 ring-blue-200 dark:ring-blue-800'
                    : ''
                  }
                `}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/*
EXAMPLE IMPLEMENTATION FOR A REAL GAME YEAR:

import AutoStartMap from "@/game/components/AutoStartMap2025";

export function AutoStartFieldSelector({
  startPosition,
  setStartPosition,
  alliance,
}: AutoStartFieldSelectorProps) {
  const selectedPosition = startPosition.findIndex(pos => pos === true);
  const hasSelection = startPosition.some(pos => pos === true);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-xl xl:text-2xl">Starting Position</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click where your robot starts on the field
        </p>
        {hasSelection && (
          <Badge className="w-fit bg-green-600">
            Position {selectedPosition} Selected
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="w-full border rounded-lg bg-green-50 dark:bg-green-950/20 p-4">
          <AutoStartMap 
            startPosition={startPosition} 
            setStartPosition={setStartPosition} 
            alliance={alliance}
          />
        </div>
      </CardContent>
    </Card>
  );
}
*/

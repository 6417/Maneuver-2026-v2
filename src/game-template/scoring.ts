/**
 * Game Scoring Calculations - 2026 REBUILT
 * 
 * Calculates points for auto, teleop, and endgame phases.
 * 
 * 2026 SCORING:
 * - Fuel in active HUB: 1 pt (both phases)
 * - Auto Climb L1: 15 pts
 * - Tower L1: 10 pts, L2: 20 pts, L3: 30 pts
 * 
 * DERIVED FROM: game-schema.ts
 */

import type { ScoringCalculations } from "@/types/game-interfaces";
import type { ScoutingEntryBase } from "@/core/types/scouting-entry";
import {
    toggles,
    getActionKeys,
    getActionPoints,
    getEndgamePoints,
    getAutoTogglePoints,
    type AutoToggleKey
} from "./game-schema";

/**
 * GameData interface for 2026
 * Uses bulk counters for fuel tracking
 */
export interface GameData {
    auto: {
        startPosition: number | null;
        // Fuel counters (bulk counting)
        fuelScoredCount?: number;
        fuelPassedCount?: number;
        // Auto toggles
        leftStartZone?: boolean;
        autoClimbL1?: boolean;
        [key: string]: unknown;
    };
    teleop: {
        // Fuel counters (bulk counting)
        fuelScoredCount?: number;
        fuelPassedCount?: number;
        // Teleop toggles
        playedDefense?: boolean;
        underTrench?: boolean;
        overBump?: boolean;
        [key: string]: unknown;
    };
    endgame: {
        // Tower climb (mutually exclusive)
        climbL1?: boolean;
        climbL2?: boolean;
        climbL3?: boolean;
        // Status
        climbFailed?: boolean;
        noClimb?: boolean;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface ScoutingEntry extends ScoutingEntryBase {
    gameData: GameData;
}

export const scoringCalculations: ScoringCalculations<ScoutingEntry> = {
    calculateAutoPoints(entry) {
        const gameData = entry.gameData as GameData;
        let points = 0;

        // Sum points for fuel scored in auto
        getActionKeys().forEach(key => {
            const autoPoints = getActionPoints(key, 'auto');
            if (autoPoints > 0) {
                const count = gameData?.auto?.[`${key}Count`] as number || 0;
                points += count * autoPoints;
            }
        });

        // Add auto climb points if applicable
        Object.keys(toggles.auto).forEach(key => {
            const toggleKey = key as AutoToggleKey;
            const togglePoints = getAutoTogglePoints(toggleKey);
            if (togglePoints > 0 && gameData?.auto?.[key] === true) {
                points += togglePoints;
            }
        });

        return points;
    },

    calculateTeleopPoints(entry) {
        const gameData = entry.gameData as GameData;
        let points = 0;

        // Sum points for fuel scored in teleop
        getActionKeys().forEach(key => {
            const teleopPoints = getActionPoints(key, 'teleop');
            if (teleopPoints > 0) {
                const count = gameData?.teleop?.[`${key}Count`] as number || 0;
                points += count * teleopPoints;
            }
        });

        return points;
    },

    calculateEndgamePoints(entry) {
        const gameData = entry.gameData as GameData;
        let points = 0;

        // Tower climb - only count the highest level achieved
        // (toggles are mutually exclusive in "climb" group)
        Object.keys(toggles.endgame).forEach(key => {
            const toggleKey = key as keyof typeof toggles.endgame;
            const togglePoints = getEndgamePoints(toggleKey);
            if (gameData?.endgame?.[key] === true) {
                points += togglePoints;
            }
        });

        return points;
    },

    calculateTotalPoints(entry) {
        return (
            this.calculateAutoPoints(entry) +
            this.calculateTeleopPoints(entry) +
            this.calculateEndgamePoints(entry)
        );
    }
};

export default scoringCalculations;

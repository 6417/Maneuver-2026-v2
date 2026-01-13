/**
 * Game-Specific Data Transformation - 2026 REBUILT
 * 
 * Transforms action data from match scouting into counter fields for database storage.
 * 
 * 2026 uses bulk counter approach:
 * - fuelScored: Fuel deposited into hub (tracked with +1/+5/+10 increments)
 * - fuelPassed: Fuel passed to alliance partners
 * 
 * DERIVED FROM: game-schema.ts
 */

import type { DataTransformation } from "@/types/game-interfaces";
import { toggles, getActionKeys, type ActionKey } from "./game-schema";

/**
 * Generate default values for action counters
 * For 2026, we use bulk counters so the schema defines all actions for both phases
 */
function generateActionDefaults(): Record<string, number> {
  const defaults: Record<string, number> = {};
  getActionKeys().forEach(key => {
    defaults[`${key}Count`] = 0;
  });
  return defaults;
}

/**
 * Generate default values for toggle fields
 */
function generateToggleDefaults(phase: 'auto' | 'teleop' | 'endgame'): Record<string, boolean> {
  const defaults: Record<string, boolean> = {};
  const phaseToggles = toggles[phase];
  Object.keys(phaseToggles).forEach(key => {
    defaults[key] = false;
  });
  return defaults;
}

export const gameDataTransformation: DataTransformation = {
  transformActionsToCounters(matchData) {
    // Extract start position
    const selectedPosition = matchData.startPosition?.findIndex((pos: boolean) => pos === true);
    const startPosition = selectedPosition !== undefined && selectedPosition >= 0
      ? selectedPosition
      : null;

    // Initialize with schema-derived defaults
    // For 2026, counters are the same in auto and teleop (bulk counting)
    const result: Record<string, any> = {
      auto: {
        startPosition,
        ...generateActionDefaults(),
        ...generateToggleDefaults('auto'),
      },
      teleop: {
        ...generateActionDefaults(),
        ...generateToggleDefaults('teleop'),
      },
      endgame: {
        ...generateToggleDefaults('endgame'),
      },
    };

    // Process auto data
    // For 2026, data comes as counter values directly (from bulk counter UI)
    if (matchData.autoData) {
      const actionKeys = getActionKeys();
      actionKeys.forEach(key => {
        const countKey = `${key}Count`;
        if (matchData.autoData[countKey] !== undefined) {
          result.auto[countKey] = matchData.autoData[countKey];
        }
      });
    }

    // Process teleop data
    if (matchData.teleopData) {
      const actionKeys = getActionKeys();
      actionKeys.forEach(key => {
        const countKey = `${key}Count`;
        if (matchData.teleopData[countKey] !== undefined) {
          result.teleop[countKey] = matchData.teleopData[countKey];
        }
      });
    }

    // Legacy support: Also handle action arrays if present
    const actionKeys = getActionKeys();

    matchData.autoActions?.forEach((action: any) => {
      const actionType = action.actionType as ActionKey;
      if (actionKeys.includes(actionType)) {
        const countKey = `${actionType}Count`;
        const increment = action.increment ?? 1;
        result.auto[countKey] = (result.auto[countKey] || 0) + increment;
      }
    });

    matchData.teleopActions?.forEach((action: any) => {
      const actionType = action.actionType as ActionKey;
      if (actionKeys.includes(actionType)) {
        const countKey = `${actionType}Count`;
        const increment = action.increment ?? 1;
        result.teleop[countKey] = (result.teleop[countKey] || 0) + increment;
      }
    });

    // Copy robot status flags (from StatusToggles component)
    if (matchData.autoRobotStatus) Object.assign(result.auto, matchData.autoRobotStatus);
    if (matchData.teleopRobotStatus) Object.assign(result.teleop, matchData.teleopRobotStatus);
    if (matchData.endgameRobotStatus) Object.assign(result.endgame, matchData.endgameRobotStatus);

    // Copy any additional fields
    const additionalFields = { ...matchData };
    delete additionalFields.autoActions;
    delete additionalFields.teleopActions;
    delete additionalFields.autoData;
    delete additionalFields.teleopData;
    delete additionalFields.autoRobotStatus;
    delete additionalFields.teleopRobotStatus;
    delete additionalFields.endgameRobotStatus;
    delete additionalFields.startPosition;

    Object.assign(result, additionalFields);

    return result;
  }
};

export default gameDataTransformation;

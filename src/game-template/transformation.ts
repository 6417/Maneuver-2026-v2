/**
 * Game-Specific Data Transformation
 * 
 * This module transforms action arrays from match scouting into counter fields
 * for database storage.
 * 
 * HOW TO CUSTOMIZE FOR YOUR GAME YEAR:
 * ====================================
 * 
 * 1. Define counter fields for all scoring actions
 * 2. Process autoActions array and increment appropriate counters
 * 3. Process teleopActions array and increment appropriate counters
 * 4. Merge robot status objects (they're already in the right format)
 * 5. Include any additional fields (startPosition, comments, etc.)
 * 
 * EXAMPLE TRANSFORMATION (2025 Reefscape):
 * 
 * INPUT (action arrays):
 * {
 *   autoActions: [
 *     { type: 'score', pieceType: 'coral', location: 'reef', level: 'l1' },
 *     { type: 'score', pieceType: 'coral', location: 'reef', level: 'l1' },
 *     { type: 'pickup', pieceType: 'coral', location: 'station' },
 *     { type: 'score', pieceType: 'algae', location: 'net' }
 *   ],
 *   teleopActions: [
 *     { type: 'score', pieceType: 'coral', location: 'reef', level: 'l4' },
 *     { type: 'score', pieceType: 'algae', location: 'processor' }
 *   ],
 *   endgameRobotStatus: {
 *     deepClimbAttempted: true,
 *     climbFailed: false
 *   },
 *   startPosition: 2
 * }
 * 
 * OUTPUT (organized counter fields):
 * {
 *   auto: {
 *     coralPlaceL1Count: 2,
 *     coralPickStationCount: 1,
 *     algaePlaceNetShot: 1
 *   },
 *   teleop: {
 *     coralPlaceL4Count: 1,
 *     algaePlaceProcessor: 1
 *   },
 *   endgame: {
 *     deepClimbAttempted: true,
 *     climbFailed: false
 *   },
 *   startPosition: 2
 * }
 */

import type { DataTransformation } from "@/types/game-interfaces";

export const gameDataTransformation: DataTransformation = {
  transformActionsToCounters(matchData) {
    // Convert startPosition array to single position number
    const selectedPosition = matchData.startPosition?.findIndex((pos: boolean) => pos === true);
    const startPosition = selectedPosition !== undefined && selectedPosition >= 0 
      ? selectedPosition 
      : null;

    // Organize counters by phase for better structure
    // CUSTOMIZE: Define your game's counter fields here
    const result: Record<string, any> = {
      // Auto phase counters
      auto: {
        startPosition, // Starting position (0-5, or null if not selected)
        action1Count: 0,
        action2Count: 0,
        action3Count: 0,
        action4Count: 0,
      },
      
      // Teleop phase counters
      teleop: {
        action1Count: 0,
        action2Count: 0,
        action3Count: 0,
      },
      
      // Endgame status fields (already boolean, just pass through)
      endgame: {
        // Placeholder fields - customize for your game
        option1: false,     // 2025: shallowClimbAttempted
        option2: false,     // 2025: deepClimbAttempted  
        option3: false,     // 2025: parkAttempted
        toggle1: false,     // 2025: climbFailed
        toggle2: false,     // 2025: brokeDown
      },
    };

    // Process auto actions
    // CUSTOMIZE: Add your game's action → counter mapping logic
    // 
    // Example for 2025 Reefscape:
    // if (action.type === 'score' && action.pieceType === 'coral' && action.location === 'reef') {
    //   if (action.level === 'l1') result.auto.coralPlaceL1Count++;
    //   else if (action.level === 'l2') result.auto.coralPlaceL2Count++;
    // }
    matchData.autoActions?.forEach((action: any) => {
      if (action.actionType === 'action1') {
        result.auto.action1Count++;
      } else if (action.actionType === 'action2') {
        result.auto.action2Count++;
      } else if (action.actionType === 'action3') {
        result.auto.action3Count++;
      } else if (action.actionType === 'action4') {
        result.auto.action4Count++;
      }
    });

    // Process teleop actions
    // CUSTOMIZE: Add your game's action → counter mapping logic
    //
    // Example for 2025 Reefscape:
    // if (action.type === 'score' && action.pieceType === 'algae' && action.location === 'net') {
    //   result.teleop.algaePlaceNetShot++;
    // }
    matchData.teleopActions?.forEach((action: any) => {
      if (action.actionType === 'action1') {
        result.teleop.action1Count++;
      } else if (action.actionType === 'action2') {
        result.teleop.action2Count++;
      } else if (action.actionType === 'action3') {
        result.teleop.action3Count++;
      }
    });

    // Merge robot status objects into their respective phases
    if (matchData.autoRobotStatus) {
      Object.assign(result.auto, matchData.autoRobotStatus);
    }
    if (matchData.teleopRobotStatus) {
      Object.assign(result.teleop, matchData.teleopRobotStatus);
    }
    if (matchData.endgameRobotStatus) {
      Object.assign(result.endgame, matchData.endgameRobotStatus);
    }

    // Include any additional fields at the top level
    // CUSTOMIZE: Add any other fields your game needs (comments, etc.)
    const additionalFields = { ...matchData };
    delete additionalFields.autoActions;
    delete additionalFields.teleopActions;
    delete additionalFields.autoRobotStatus;
    delete additionalFields.teleopRobotStatus;
    delete additionalFields.endgameRobotStatus;
    delete additionalFields.startPosition; // Already processed into auto.startPosition
    
    Object.assign(result, additionalFields);

    return result;
  }
};

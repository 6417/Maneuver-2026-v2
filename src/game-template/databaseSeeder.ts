import { SCOUT_NAMES } from "@/game-template/constants";
import { gamificationDB } from '@/game-template/gamification';

export const seedDatabase = async () => {
  try {
    // Warten, bis die DB offen ist
    await gamificationDB.open();

    const existingScouts = await gamificationDB.scouts.toArray();

    if (existingScouts.length === 0 && SCOUT_NAMES.length > 0) {
      console.log("Initialisiere Scouts in ScoutGamificationDB...");

      for (const scoutName of SCOUT_NAMES) {
        // Wir nutzen 'put', um Dubletten anhand des Namens zu vermeiden
        await gamificationDB.scouts.put({
          name: scoutName, // Das ist dein Primärschlüssel laut Schema!
          stakes: 0,
          stakesFromPredictions: 0,
          totalPredictions: 0,
          correctPredictions: 0,
          currentStreak: 0,
          longestStreak: 0,
          createdAt: Date.now(), // Falls dein Type das verlangt
          lastUpdated: Date.now()
        });
      }

      console.log(`✅ ${SCOUT_NAMES.length} Scouts erfolgreich vorinstalliert.`);

      const namesToStore = SCOUT_NAMES.sort();
      localStorage.setItem('scoutsList', JSON.stringify(namesToStore));

      console.log("localStorage 'scoutsList' wurde aktualisiert.");
    }
  } catch (error) {
    console.error("❌ Fehler beim Seeding der gamificationDB:", error);
  }
};

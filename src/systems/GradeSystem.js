/**
 * GradeSystem
 * 
 * A global data store that tracks the player's grades across all mini-games
 * in the lecture hall. Instantiated once and attached to the window object
 * so every Phaser scene can read and write grades without passing references.
 * 
 * Currently tracks three mini-games:
 *   - journal:   The card ordering memory game (JournalScene)
 *   - computer:  Reserved for a future mini-game
 *   - lectern:   Reserved for a future mini-game
 * 
 * Grades are letter values: 'A', 'B', 'C', 'F' (and 'A+' for defensive support).
 * The minimum passing grade for class completion is C or higher.
 * The minimum grade to unlock "Complete Class" in the PostcardScene is B (70%+).
 */
class GradeSystem {

    /**
     * constructor
     * 
     * Initializes all grade slots to null. A null grade means the player
     * has not yet attempted that mini-game. Scenes check for null to
     * display a dash placeholder in the HUD and report card.
     */
    constructor() {
        this.grades = {
            journal:  null,   // Set by JournalScene on completion
            computer: null,   // Reserved for future mini-game
            lectern:  null    // Reserved for future mini-game
        };
    }

    /**
     * setGrade
     * 
     * Records a grade for a given mini-game. Called by the mini-game scene
     * at the end of play. Also called with null to reset a grade when the
     * player chooses to replay.
     * 
     * @param {string} gameName - Key matching a property in this.grades ('journal', etc.)
     * @param {string|null} grade - Letter grade to store, or null to reset
     */
    setGrade(gameName, grade) {
        this.grades[gameName] = grade;
    }

    /**
     * getGrade
     * 
     * Retrieves the stored grade for a given mini-game.
     * Returns null if the mini-game has not been completed yet.
     * 
     * @param {string} gameName - Key matching a property in this.grades
     * @returns {string|null} The letter grade, or null if not yet graded
     */
    getGrade(gameName) {
        return this.grades[gameName];
    }

    /**
     * allPassed
     * 
     * Checks whether every mini-game has been completed with a passing grade
     * (C or higher). Used to determine if the player can finish the class.
     * A null grade (not attempted) counts as a fail.
     * 
     * @returns {boolean} True if all grades are C or above, false otherwise
     */
    allPassed() {
        for (let key in this.grades) {
            if (!this.grades[key] || this.gradeValue(this.grades[key]) < this.gradeValue('C')) {
                return false;
            }
        }
        return true;
    }

    /**
     * gradeValue
     * 
     * Converts a letter grade to a numeric value for comparison purposes.
     * Used by allPassed() and CompletionScene to check if the player meets
     * grade thresholds (e.g. B or higher to unlock "Complete Class").
     * 
     * Scale:
     *   A+ = 5 | A = 4 | B = 3 | C = 2 | D = 1 | F = 0 | unknown = -1
     * 
     * @param {string} letter - Letter grade string
     * @returns {number} Numeric value for comparison
     */
    gradeValue(letter) {
        switch(letter) {
            case 'A+': return 5;   // Defensive — not currently assigned but supported
            case 'A':  return 4;
            case 'B':  return 3;
            case 'C':  return 2;
            case 'D':  return 1;
            case 'F':  return 0;
            default:   return -1;  // Null or unrecognized grade treated as below F
        }
    }
}

// Instantiate a single global instance accessible by all Phaser scenes.
// Scenes read and write grades via window.gradeSystem.getGrade() and setGrade().
window.gradeSystem = new GradeSystem();

class GradeSystem {
    constructor() {
        // Store grades for each mini-game
        this.grades = {
            journal: null,
            computer: null,
            lectern: null
        };
    }

    setGrade(gameName, grade) {
        this.grades[gameName] = grade;
    }

    getGrade(gameName) {
        return this.grades[gameName];
    }

    allPassed() {
        // Check if all grades exist and are C or higher
        for (let key in this.grades) {
            if (!this.grades[key] || this.gradeValue(this.grades[key]) < this.gradeValue('C')) {
                return false;
            }
        }
        return true;
    }

    gradeValue(letter) {
        // Convert letter to numeric for comparison (A=4,...F=0)
        switch(letter) {
            case 'A': return 4;
            case 'B': return 3;
            case 'C': return 2;
            case 'D': return 1;
            case 'F': return 0;
            default: return -1;
        }
    }
}

// Make a single global instance
window.gradeSystem = new GradeSystem();

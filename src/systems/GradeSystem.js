class GradeSystem {
    constructor() {
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
        for (let key in this.grades) {
            if (!this.grades[key] || this.gradeValue(this.grades[key]) < this.gradeValue('C')) {
                return false;
            }
        }
        return true;
    }
    gradeValue(letter) {
        switch(letter) {
            case 'A+': return 5;
            case 'A':  return 4;
            case 'B':  return 3;
            case 'C':  return 2;
            case 'D':  return 1;
            case 'F':  return 0;
            default:   return -1;
        }
    }
}
window.gradeSystem = new GradeSystem();

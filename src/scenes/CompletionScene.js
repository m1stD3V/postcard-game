class CompletionScene extends Phaser.Scene {
    constructor() {
        super("CompletionScene");
    }

    create(data) {
        const grade = window.gradeSystem.getGrade('journal');
        const accuracy = data?.accuracy ?? null;
        const fromLectureHall = data?.fromLectureHall ?? false;
        const canComplete = grade && window.gradeSystem.gradeValue(grade) >= window.gradeSystem.gradeValue('B');

        // --- Cream paper background ---
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xf5f0e8, 0xf5f0e8, 0xe8e0cc, 0xe8e0cc, 1);
        bg.fillRect(0, 0, 960, 540);
        bg.lineStyle(1, 0xc8bfa0, 0.3);
        for (let y = 0; y < 540; y += 20) {
            bg.beginPath();
            bg.moveTo(0, y);
            bg.lineTo(960, y);
            bg.strokePath();
        }

        // --- Report card panel ---
        const cardGfx = this.add.graphics();
        cardGfx.fillStyle(0xfdfaf3, 1);
        cardGfx.fillRoundedRect(180, 40, 600, 460, 4);
        cardGfx.lineStyle(2, 0x3a2a0a, 1);
        cardGfx.strokeRoundedRect(180, 40, 600, 460, 4);
        cardGfx.lineStyle(1, 0x3a2a0a, 0.4);
        cardGfx.strokeRoundedRect(190, 50, 580, 440, 2);

        // Header band
        cardGfx.fillStyle(0x1a1a2e, 1);
        cardGfx.fillRect(180, 40, 600, 70);
        cardGfx.lineStyle(2, 0x3a2a0a, 1);
        cardGfx.strokeRect(180, 40, 600, 70);

        // --- Header text ---
        this.add.text(480, 62, "STUDENT REPORT CARD", {
            font: 'bold 22px Georgia',
            fill: '#f5f0e8',
            letterSpacing: 4
        }).setOrigin(0.5);
        this.add.text(480, 96, "Academic Performance Assessment", {
            font: 'italic 13px Georgia',
            fill: '#c8bfa0'
        }).setOrigin(0.5);

        // --- Divider ---
        cardGfx.lineStyle(1, 0x3a2a0a, 0.5);
        cardGfx.beginPath();
        cardGfx.moveTo(210, 130);
        cardGfx.lineTo(750, 130);
        cardGfx.strokePath();

        // --- Student info row ---
        this.add.text(210, 145, "Subject:", {
            font: 'bold 13px Georgia', fill: '#3a2a0a'
        });
        this.add.text(310, 145, "Journal & Memory Studies", {
            font: '13px Georgia', fill: '#3a2a0a'
        });
        this.add.text(560, 145, "Term:", {
            font: 'bold 13px Georgia', fill: '#3a2a0a'
        });
        this.add.text(610, 145, "Current", {
            font: '13px Georgia', fill: '#3a2a0a'
        });

        cardGfx.lineStyle(1, 0x3a2a0a, 0.2);
        cardGfx.beginPath();
        cardGfx.moveTo(210, 168);
        cardGfx.lineTo(750, 168);
        cardGfx.strokePath();

        // --- Grade table header ---
        this.add.text(210, 182, "Assessment", {
            font: 'bold 13px Georgia', fill: '#3a2a0a'
        });
        this.add.text(510, 182, "Accuracy", {
            font: 'bold 13px Georgia', fill: '#3a2a0a'
        });
        this.add.text(650, 182, "Grade", {
            font: 'bold 13px Georgia', fill: '#3a2a0a'
        });

        cardGfx.lineStyle(1, 0x3a2a0a, 0.6);
        cardGfx.beginPath();
        cardGfx.moveTo(210, 200);
        cardGfx.lineTo(750, 200);
        cardGfx.strokePath();

        // --- Grade row ---
        this.add.text(210, 214, "Card Ordering Exercise", {
            font: '14px Georgia', fill: '#3a2a0a'
        });
        this.add.text(510, 214, accuracy !== null ? `${accuracy}%` : '-', {
            font: '14px Georgia', fill: '#3a2a0a'
        });
        this.add.text(650, 214, grade ?? '-', {
            font: 'bold 14px Georgia', fill: '#3a2a0a'
        });

        cardGfx.lineStyle(1, 0x3a2a0a, 0.15);
        cardGfx.beginPath();
        cardGfx.moveTo(210, 236);
        cardGfx.lineTo(750, 236);
        cardGfx.strokePath();

        // --- Final grade box ---
        cardGfx.lineStyle(1.5, 0x3a2a0a, 0.8);
        cardGfx.strokeRoundedRect(530, 300, 190, 100, 4);
        this.add.text(625, 318, "FINAL GRADE", {
            font: 'bold 11px Georgia',
            fill: '#3a2a0a',
            letterSpacing: 2
        }).setOrigin(0.5);
        cardGfx.lineStyle(1, 0x3a2a0a, 0.4);
        cardGfx.beginPath();
        cardGfx.moveTo(540, 332);
        cardGfx.lineTo(710, 332);
        cardGfx.strokePath();

        const finalLabel = accuracy !== null
            ? `${accuracy}%,  ${grade}`
            : (grade ?? 'N/A');
        this.add.text(625, 368, finalLabel, {
            font: 'bold 28px Georgia',
            fill: '#1a1a2e'
        }).setOrigin(0.5);

        // --- Teacher comment ---
        this.add.text(210, 310, "Comments:", {
            font: 'bold 13px Georgia', fill: '#3a2a0a'
        });
        this.add.text(210, 330, this.getComment(grade), {
            font: 'italic 13px Georgia',
            fill: '#3a2a0a',
            wordWrap: { width: 290 }
        });

        // --- Signature line ---
        cardGfx.lineStyle(1, 0x3a2a0a, 0.5);
        cardGfx.beginPath();
        cardGfx.moveTo(210, 440);
        cardGfx.lineTo(430, 440);
        cardGfx.strokePath();
        this.add.text(210, 446, "Instructor Signature", {
            font: '11px Georgia', fill: '#8a7a5a'
        });

        // --- Buttons ---
        // Always show "Return to Lecture Hall"
        this.drawButton(480, 496, "Return to Lecture Hall", () => {
            this.scene.start('LectureHallScene');
        });

        // If arrived via journal completion, also show Replay
        if (!fromLectureHall) {
            this.drawButton(270, 496, "Replay Journal", () => {
                window.gradeSystem.setGrade('journal', null);
                this.scene.start('JournalScene');
            });
        }

        // "Complete Class" gated at 70% (grade B or higher)
        if (canComplete) {
            this.drawButton(fromLectureHall ? 270 : 690, 496, "Complete Class", () => {
                this.scene.start('PostcardScene');
            });
        } else {
            this.add.text(fromLectureHall ? 270 : 690, 496,
                "Complete Class\n(70% required)", {
                font: 'italic 12px Georgia',
                fill: '#9a7a5a',
                align: 'center'
            }).setOrigin(0.5);
        }
    }

    getComment(grade) {
        switch(grade) {
            case 'A': return "Excellent retention and recall. Student demonstrates outstanding sequential memory skills.";
            case 'B': return "Good performance overall. Student shows solid understanding of ordering concepts.";
            case 'C': return "Satisfactory effort. Student is encouraged to practice memory and recall techniques.";
            case 'F': return "Student did not meet the minimum standard. A retake is strongly recommended.";
            default:  return "No result recorded yet. Complete the journal mini-game to receive a grade.";
        }
    }

    drawButton(cx, cy, label, callback) {
        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(0x1a1a2e, 1);
        btnGfx.fillRoundedRect(cx - 110, cy - 18, 220, 36, 6);

        this.add.text(cx, cy, label, {
            font: 'bold 14px Georgia',
            fill: '#f5f0e8'
        }).setOrigin(0.5);

        this.add.rectangle(cx, cy, 220, 36, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btnGfx.clear();
                btnGfx.fillStyle(0x3a3a5e, 1);
                btnGfx.fillRoundedRect(cx - 110, cy - 18, 220, 36, 6);
            })
            .on('pointerout', () => {
                btnGfx.clear();
                btnGfx.fillStyle(0x1a1a2e, 1);
                btnGfx.fillRoundedRect(cx - 110, cy - 18, 220, 36, 6);
            })
            .on('pointerdown', callback);
    }
}

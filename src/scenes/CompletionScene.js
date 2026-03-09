class CompletionScene extends Phaser.Scene {
    constructor() {
        super("CompletionScene");
    }

    create() {
        const grade = window.gradeSystem.getGrade('journal');

        // Background
        this.add.rectangle(480, 270, 960, 540, 0x222222);

        // Title
        this.add.text(480, 150, "Journal Completed!", { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);

        // Grade display
        this.add.text(480, 250, `Grade: ${grade}`, { font: '28px Arial', fill: grade==='A+'?'#00ff00':'#ff0000' }).setOrigin(0.5);

        // Instructions / message
        this.add.text(480, 330, "Good job! You can replay the mini-game or return to the lecture hall.", 
            { font: '20px Arial', fill: '#fff', wordWrap: { width: 600 }, align: 'center' }).setOrigin(0.5);

        // Replay Journal button
        const redoBtn = this.add.rectangle(380, 420, 200, 50, 0xffffff).setStrokeStyle(2, 0x000000);
        const redoText = this.add.text(380, 420, "Replay Journal", { font:'20px Arial', fill:'#000' }).setOrigin(0.5);

        redoBtn.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            // Reset journal grade
            window.gradeSystem.setGrade('journal', undefined);
            this.scene.start('JournalScene');
        });

        // Return to Lecture Hall button
        const lectureBtn = this.add.rectangle(580, 420, 200, 50, 0xffffff).setStrokeStyle(2, 0x000000);
        const lectureText = this.add.text(580, 420, "Return to Lecture", { font:'20px Arial', fill:'#000' }).setOrigin(0.5);

        lectureBtn.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.scene.start('LectureHallScene');
        });
    }
}

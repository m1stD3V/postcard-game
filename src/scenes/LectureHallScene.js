class LectureHallScene extends Phaser.Scene {
    constructor() {
        super("LectureHallScene");
    }

    create() {
        // Placeholder classroom
        this.add.rectangle(480, 270, 960, 540, 0x444444);

        // Player
        this.player = this.physics.add.sprite(200, 300, null).setSize(32,32).setTint(0x00ff00);

        // Journal interactable
        this.journal = this.physics.add.sprite(600, 300, null).setSize(48,48).setTint(0xffff00);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey("E");

        // Grade board
        this.gradeText = this.add.text(10, 10, this.getGradeText(), { font: '16px Arial', fill: '#fff' });

        // "Press E" text
        this.pressEText = this.add.text(this.journal.x, this.journal.y - 40, "Press E", { font:'16px Arial', fill:'#fff' }).setOrigin(0.5);
        this.pressEText.setVisible(false);
    }

    update() {
        this.player.setVelocity(0);
        if(this.cursors.left.isDown) this.player.setVelocityX(-200);
        if(this.cursors.right.isDown) this.player.setVelocityX(200);
        if(this.cursors.up.isDown) this.player.setVelocityY(-200);
        if(this.cursors.down.isDown) this.player.setVelocityY(200);

        // Show "Press E" if player near journal
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.journal.x, this.journal.y
        );
        this.pressEText.setVisible(distance < 50);

        // Interact
        if(distance < 50 && Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.scene.start('JournalScene');
        }
    }

    getGradeText() {
        const grade = window.gradeSystem.getGrade('journal') || '-';
        return `Journal: ${grade}`;
    }
}

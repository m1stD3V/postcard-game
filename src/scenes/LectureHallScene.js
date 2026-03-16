class LectureHallScene extends Phaser.Scene {
    constructor() {
        super("LectureHallScene");
    }

    preload() {
        this.load.tilemapTiledJSON("lectureHall", "assets/LectureHall.tmj");
        this.load.image("A5", "assets/images/A5.png");
        this.load.image("Inside_C", "assets/images/Inside_C.png");
    }

    create() {
        // --- Tilemap ---
        const map = this.make.tilemap({ key: "lectureHall" });
        const tilesA5 = map.addTilesetImage("floor", "A5");
        const tilesInsideC = map.addTilesetImage("classroom", "Inside_C");

        const floorLayer   = map.createLayer("Floor", tilesA5, 0, 0);
        const decorLayer   = map.createLayer("Decorations", tilesInsideC, 0, 0);
        const journalLayer = map.createLayer("Journal", tilesInsideC, 0, 0);

        // --- Decorations collision ---
        decorLayer.setCollisionByExclusion([-1]);

        // --- Find journal tile and place interactable sprite on it ---
        let journalTile = null;
        journalLayer.forEachTile(tile => {
            if (tile.index !== -1) journalTile = tile;
        });

        const journalX = journalTile
            ? journalLayer.tileToWorldX(journalTile.x) + 24
            : 600;
        const journalY = journalTile
            ? journalLayer.tileToWorldY(journalTile.y) + 24
            : 300;

        // --- Player ---
        this.player = this.physics.add.sprite(200, 300, null)
            .setSize(32, 32)
            .setTint(0x00ff00)
            .setVisible(true);

        // --- Journal interactable ---
        this.journal = this.physics.add.sprite(journalX, journalY, null)
            .setSize(48, 48)
            .setTint(0xffff00)
            .setVisible(false);

        // --- Camera ---
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        // --- Physics world bounds ---
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.setCollideWorldBounds(true);

        // --- Player vs Decorations collider ---
        this.physics.add.collider(this.player, decorLayer);

        // --- Input ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey("E");
        this.keyTab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        // --- UI (fixed to camera) ---
        this.gradeText = this.add.text(10, 10, this.getGradeText(), {
            font: '16px Arial',
            fill: '#fff'
        }).setScrollFactor(0);

        // Tab hint
        this.add.text(10, 32, "[TAB] View Report Card", {
            font: '13px Arial',
            fill: '#cccccc'
        }).setScrollFactor(0);

        this.pressEText = this.add.text(
            this.journal.x,
            this.journal.y - 40,
            "Press E",
            { font: '16px Arial', fill: '#fff' }
        ).setOrigin(0.5);
        this.pressEText.setVisible(false);
    }

    update() {
        this.player.setVelocity(0);
        if (this.cursors.left.isDown)  this.player.setVelocityX(-200);
        if (this.cursors.right.isDown) this.player.setVelocityX(200);
        if (this.cursors.up.isDown)    this.player.setVelocityY(-200);
        if (this.cursors.down.isDown)  this.player.setVelocityY(200);

        // Show "Press E" if player near journal
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.journal.x, this.journal.y
        );
        this.pressEText.setVisible(distance < 50);

        // Interact with journal
        if (distance < 50 && Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.scene.start('JournalScene');
        }

        // Tab — open report card
        if (Phaser.Input.Keyboard.JustDown(this.keyTab)) {
            this.scene.start('CompletionScene', {
                fromLectureHall: true,
                accuracy: window.gradeSystem.getGrade('journal') ? null : null
            });
        }
    }

    getGradeText() {
        const grade = window.gradeSystem.getGrade('journal') || '-';
        return `Journal: ${grade}`;
    }
}

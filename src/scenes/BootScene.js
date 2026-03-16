class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        // --- Loading bar ---
        const barBg = this.add.graphics();
        barBg.fillStyle(0x3a2a0a, 1);
        barBg.fillRoundedRect(280, 250, 400, 20, 6);

        const bar = this.add.graphics();

        this.add.text(480, 220, "Loading...", {
            font: 'italic 18px Georgia',
            fill: '#b8975a'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            bar.clear();
            bar.fillStyle(0xb8975a, 1);
            bar.fillRoundedRect(280, 250, 400 * value, 20, 6);
        });

        this.load.audio("bgm",      "assets/audio/bgm.mp3");
        this.load.audio("bookOpen", "assets/audio/bookOpen.mp3");
        this.load.audio("chime",    "assets/audio/chime.mp3");
        this.load.audio("click",    "assets/audio/click.mp3");
        this.load.audio("tear",     "assets/audio/tear.mp3");
    }

    create() {
        this.scene.start("StartScene");
    }
}

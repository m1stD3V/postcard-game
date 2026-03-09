class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("lecturehall", "assets/images/lecturehall.png");
        this.load.image("journal", "assets/images/journal.png");

        this.load.image("cardBack", "assets/images/cards/cardBack.png");
        this.load.image("card1", "assets/images/cards/card1.png");
        this.load.image("card2", "assets/images/cards/card2.png");
        this.load.image("card3", "assets/images/cards/card3.png");
        this.load.image("card4", "assets/images/cards/card4.png");

        this.load.audio("flip", "assets/audio/flip.wav");
        this.load.audio("match", "assets/audio/match.wav");
        this.load.audio("mismatch", "assets/audio/mismatch.wav");
        this.load.audio("bgm", "assets/audio/bgm.mp3");
    }

    create() {
        this.scene.start("LectureHallScene");
    }
}

/**
 * BootScene
 * 
 * The very first scene Phaser runs. Responsible for preloading all shared
 * assets that every other scene depends on — primarily audio. Displays a
 * loading bar so the player isn't staring at a blank screen while large
 * audio files decode.
 * 
 * Once loading is complete, hands off immediately to StartScene.
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    /**
     * preload
     * 
     * Runs automatically before create(). All assets loaded here are cached
     * globally and available to every scene for the rest of the game's lifetime.
     * 
     * A progress bar is drawn using Phaser Graphics and updated on each
     * 'progress' event fired by the Loader as files complete.
     */
    preload() {
        // --- Loading bar background (static dark track) ---
        const barBg = this.add.graphics();
        barBg.fillStyle(0x3a2a0a, 1);
        barBg.fillRoundedRect(280, 250, 400, 20, 6);

        // --- Loading bar fill (updates as files load) ---
        const bar = this.add.graphics();

        // --- Loading label ---
        this.add.text(480, 220, "Loading...", {
            font: 'italic 18px Georgia',
            fill: '#b8975a'
        }).setOrigin(0.5);

        // Update the bar width proportionally as each file finishes loading.
        // 'value' is a 0-1 float representing overall load progress.
        this.load.on('progress', (value) => {
            bar.clear();
            bar.fillStyle(0xb8975a, 1);
            bar.fillRoundedRect(280, 250, 400 * value, 20, 6);
        });

        // --- Audio assets ---
        // All audio is loaded here so it's available globally across all scenes.
        // bgm loops throughout the lecture hall gameplay.
        this.load.audio("bgm",      "assets/audio/bgm.mp3");

        // Plays when the player opens the journal or views the report card.
        this.load.audio("bookOpen", "assets/audio/bookOpen.mp3");

        // Plays when the player achieves a perfect round in the journal mini-game.
        this.load.audio("chime",    "assets/audio/chime.mp3");

        // Plays when a card snaps into a drop zone in the journal mini-game.
        this.load.audio("click",    "assets/audio/click.mp3");

        // Plays when the envelope tears open on the start screen.
        this.load.audio("tear",     "assets/audio/tear.mp3");
    }

    /**
     * create
     * 
     * Called automatically after all assets in preload() have finished loading.
     * Immediately transitions to StartScene to begin the game experience.
     */
    create() {
        this.scene.start("StartScene");
    }
}

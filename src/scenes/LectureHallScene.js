/**
 * LectureHallScene
 * 
 * The main explorable environment of the game. The player controls a cat
 * character navigating a top-down lecture hall built from a Tiled JSON tilemap.
 * 
 * The player can:
 *   - Walk around the room using arrow keys (blocked by furniture via collision)
 *   - Approach the journal on the lectern and press E to start the mini-game
 *   - Press TAB at any time to view their current report card
 * 
 * Uses: Arcade Physics, Tilemap System, Camera System, Animation Manager (via Player),
 *       Sound Manager (BGM), and Phaser Text objects for HUD.
 */
class LectureHallScene extends Phaser.Scene {
    constructor() {
        super("LectureHallScene");
    }

    /**
     * preload
     * 
     * Loads all assets specific to this scene. The cat spritesheet is loaded
     * here rather than BootScene because the Player prefab is only used here.
     * Tilemap and tileset images are also loaded here since they are only
     * needed in this scene.
     */
    preload() {
        // Tiled JSON map file describing layer structure and tile placement
        this.load.tilemapTiledJSON("lectureHall", "assets/LectureHall.tmj");

        // Floor tileset (A5 — RPG Maker MV indoor floor tiles, 48x48px)
        this.load.image("A5", "assets/images/A5.png");

        // Decoration/object tileset (Inside_C — RPG Maker MV furniture, 48x48px)
        this.load.image("Inside_C", "assets/images/Inside_C.png");

        // Cat spritesheet used by the Player prefab (48x48px frames, 12 columns wide)
        this.load.spritesheet('cat', 'assets/images/Cats1.png', {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    /**
     * create
     * 
     * Builds the full lecture hall scene:
     *   - Constructs the tilemap with three layers (Floor, Decorations, Journal)
     *   - Enables collision on the Decorations layer (desks, furniture)
     *   - Locates the journal tile and places an invisible physics sprite on it
     *   - Spawns the Player prefab and wires up camera follow
     *   - Starts the BGM loop
     *   - Sets up keyboard input and HUD text
     */
    create() {
        // --- Tilemap setup ---
        // Build the map from the preloaded Tiled JSON file
        const map = this.make.tilemap({ key: "lectureHall" });

        // Register tilesets — first arg must match the name set in Tiled
        const tilesA5 = map.addTilesetImage("floor", "A5");
        const tilesInsideC = map.addTilesetImage("classroom", "Inside_C");

        // Create the three tile layers in draw order (bottom to top)
        const floorLayer   = map.createLayer("Floor", tilesA5, 0, 0);
        const decorLayer   = map.createLayer("Decorations", tilesInsideC, 0, 0);
        const journalLayer = map.createLayer("Journal", tilesInsideC, 0, 0);

        // Enable collision on every non-empty tile in the Decorations layer
        // (desks, chairs, and other furniture block player movement)
        decorLayer.setCollisionByExclusion([-1]);

        // --- Journal tile detection ---
        // Scan the Journal layer to find the tile marking the journal's location.
        // This drives the placement of the invisible interactable physics sprite.
        let journalTile = null;
        journalLayer.forEachTile(tile => {
            if (tile.index !== -1) journalTile = tile;
        });

        // Convert tile coordinates to world pixel coordinates and center on the tile
        const journalX = journalTile
            ? journalLayer.tileToWorldX(journalTile.x) + 24   // +24 = half of 48px tile
            : 600;                                              // Fallback if no tile found
        const journalY = journalTile
            ? journalLayer.tileToWorldY(journalTile.y) + 24
            : 300;

        // --- Player ---
        // Instantiate the Player prefab which handles physics, animation, and movement
        this.player = new Player(this, 200, 300);

        // --- Journal interactable sprite ---
        // Invisible physics body placed exactly on the journal tile.
        // Used for proximity detection — the player must walk close and press E.
        this.journal = this.physics.add.sprite(journalX, journalY, null)
            .setSize(48, 48)
            .setTint(0xffff00)
            .setVisible(false);

        // --- Camera ---
        // Constrain camera to the map dimensions so it never shows empty space
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Camera smoothly follows the player as they move around
        this.cameras.main.startFollow(this.player);

        // --- Physics world bounds ---
        // Match the physics world to the map size so the player can't walk off the edge
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // --- Collisions ---
        // Register collision between the player and all collideable decoration tiles
        this.physics.add.collider(this.player, decorLayer);

        // --- BGM ---
        // Start background music looping at low volume.
        // Guard prevents restarting if the scene is re-entered (e.g. returning from journal).
        if (!this.sound.get('bgm')?.isPlaying) {
            this.sound.play('bgm', { loop: true, volume: 0.4 });
        }

        // --- Input ---
        this.cursors = this.input.keyboard.createCursorKeys();

        // E key — interact with the journal when in range
        this.keyE = this.input.keyboard.addKey("E");

        // TAB key — open the report card from anywhere in the hall
        this.keyTab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        // --- HUD (fixed to camera, not affected by camera scroll) ---

        // Displays the player's current journal grade in the top-left corner
        this.gradeText = this.add.text(10, 10, this.getGradeText(), {
            font: '16px Arial',
            fill: '#fff'
        }).setScrollFactor(0);

        // Hint reminding the player they can view their report card
        this.add.text(10, 32, "[TAB] View Report Card", {
            font: '13px Arial',
            fill: '#cccccc'
        }).setScrollFactor(0);

        // "Press E" prompt shown above the journal when the player is in range
        this.pressEText = this.add.text(
            this.journal.x,
            this.journal.y - 40,
            "Press E",
            { font: '16px Arial', fill: '#fff' }
        ).setOrigin(0.5);
        this.pressEText.setVisible(false);
    }

    /**
     * update
     * 
     * Called every frame. Delegates player movement to the Player prefab,
     * checks proximity to the journal for interaction, and listens for
     * TAB to open the report card.
     */
    update() {
        // Pass cursor state to Player — handles velocity, animation, and flip
        this.player.update(this.cursors);

        // Calculate distance between player and journal interactable
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.journal.x, this.journal.y
        );

        // Show "Press E" prompt only when the player is close enough to interact
        this.pressEText.setVisible(distance < 50);

        // E key — open the journal mini-game if in range
        if (distance < 50 && Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.sound.play('bookOpen', { volume: 0.6 });
            this.scene.start('JournalScene');
        }

        // TAB key — open the report card from anywhere in the hall
        // Passes fromLectureHall: true so CompletionScene adjusts its button layout
        if (Phaser.Input.Keyboard.JustDown(this.keyTab)) {
            this.sound.play('bookOpen', { volume: 0.6 });
            this.scene.start('CompletionScene', {
                fromLectureHall: true,
                accuracy: window.gradeSystem.getGrade('journal') ? null : null
            });
        }
    }

    /**
     * getGradeText
     * 
     * Returns a formatted string for the HUD grade display.
     * Shows a dash if no grade has been recorded yet.
     * 
     * @returns {string} e.g. "Journal: B" or "Journal: -"
     */
    getGradeText() {
        const grade = window.gradeSystem.getGrade('journal') || '-';
        return `Journal: ${grade}`;
    }
}

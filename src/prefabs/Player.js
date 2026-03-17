/**
 * Player
 * 
 * The player-controlled character. Extends Phaser's Arcade Sprite to get
 * built-in physics support. Uses a black cat spritesheet with directional
 * walk animations managed by Phaser's Animation Manager.
 */
class Player extends Phaser.Physics.Arcade.Sprite {

    /**
     * @param {Phaser.Scene} scene - The scene this player belongs to
     * @param {number} x - Starting x position in world coordinates
     * @param {number} y - Starting y position in world coordinates
     */
    constructor(scene, x, y) {
        // Initialize the sprite with the preloaded 'cat' spritesheet, starting on frame 0
        super(scene, x, y, 'cat', 0);

        // Register this sprite with the scene's display and physics systems
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Prevent the player from walking outside the world bounds
        this.setCollideWorldBounds(true);

        // Use a small 10x10 collision box so the player can navigate tight spaces
        this.setSize(10, 10);

        // Offset the collision box to sit at the cat's feet rather than its center
        this.setOffset(19, 30);

        // Scale the sprite up so it's visible at 48px tile size
        this.setScale(1.5);

        // Track the last direction moved so the sprite faces correctly when idle
        this.lastDirection = 'down';

        // Register all walk animations with the scene's Animation Manager
        this.createAnimations(scene);
    }

    /**
     * createAnimations
     * 
     * Registers directional walk animations using the Animation Manager.
     * Each animation pulls frames from the cat spritesheet by index.
     * Guards prevent duplicate registration if the scene is restarted.
     * 
     * Spritesheet layout (48x48 tiles, 12 columns wide):
     *   Row 4 (frames 48-50): walk down
     *   Row 5 (frames 60-62): walk up
     *   Row 6 (frames 72-74): walk left (also used for right, flipped)
     * 
     * @param {Phaser.Scene} scene - Used to access the global Animation Manager
     */
    createAnimations(scene) {
        const anims = scene.anims;

        // Walk down — row 4 of the spritesheet
        if (!anims.exists('cat-walk-down')) {
            anims.create({
                key: 'cat-walk-down',
                frames: anims.generateFrameNumbers('cat', { start: 48, end: 50 }),
                frameRate: 8,
                repeat: -1  // Loop indefinitely while moving
            });
        }

        // Walk up — row 5 of the spritesheet
        if (!anims.exists('cat-walk-up')) {
            anims.create({
                key: 'cat-walk-up',
                frames: anims.generateFrameNumbers('cat', { start: 60, end: 62 }),
                frameRate: 8,
                repeat: -1
            });
        }

        // Walk left — row 6 of the spritesheet
        if (!anims.exists('cat-walk-left')) {
            anims.create({
                key: 'cat-walk-left',
                frames: anims.generateFrameNumbers('cat', { start: 72, end: 74 }),
                frameRate: 8,
                repeat: -1
            });
        }

        // Walk right — reuses the left animation with setFlipX applied at runtime
        if (!anims.exists('cat-walk-right')) {
            anims.create({
                key: 'cat-walk-right',
                frames: anims.generateFrameNumbers('cat', { start: 72, end: 74 }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    /**
     * update
     * 
     * Called every frame from LectureHallScene.update().
     * Reads cursor key state and sets velocity and animation accordingly.
     * Horizontal movement is checked first, then vertical, allowing
     * diagonal movement. When no key is held, the sprite freezes on its
     * last frame and faces the last direction moved.
     * 
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors - Arrow key input object
     */
    update(cursors) {
        const speed = 160;
        let moving = false;

        // Reset velocity each frame so the player stops when no key is held
        this.setVelocity(0);

        // --- Horizontal movement ---
        if (cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.play('cat-walk-left', true);
            this.setFlipX(true);          // Mirror the sprite to face left
            this.lastDirection = 'left';
            moving = true;
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed);
            this.play('cat-walk-right', true);
            this.setFlipX(false);         // Natural orientation faces right
            this.lastDirection = 'right';
            moving = true;
        }

        // --- Vertical movement ---
        if (cursors.up.isDown) {
            this.setVelocityY(-speed);
            this.play('cat-walk-up', true);
            this.lastDirection = 'up';
            moving = true;
        } else if (cursors.down.isDown) {
            this.setVelocityY(speed);
            this.play('cat-walk-down', true);
            this.lastDirection = 'down';
            moving = true;
        }

        // --- Idle state ---
        if (!moving) {
            // Keep facing the last direction the player was moving
            this.setFlipX(this.lastDirection === 'left');
            // Stop the animation on the current frame
            this.stop();
        }
    }
}

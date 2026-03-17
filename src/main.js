/* Name: Ernie Jennison
   Title: Uni is Fun
   Approx Hours: 32

   Got assistance for precise placement of phaser drawing functions from AI, just to ensure
   visual fidelity and quality. All systems and ideas are of my own creation.

=============================================================
  POSTCARD GAME — Phaser 3 Major Components Used
=============================================================

1. PHYSICS SYSTEM (Arcade Physics)
   - Player and journal use arcade physics bodies
   - Collision detection between player and decoration tiles
   - World bounds and velocity-based movement
   - See: LectureHallScene.js, Player.js

2. TILEMAP SYSTEM
   - Tiled JSON map loaded and rendered with multiple layers
   - Floor, Decorations, and Journal layers
   - Tile-based collision via setCollisionByExclusion
   - See: LectureHallScene.js

3. ANIMATION MANAGER
   - Spritesheet-based animations for the cat player
   - Walk animations in four directions using generateFrameNumbers
   - See: Player.js

4. TWEEN MANAGER
   - Envelope flap open animation on StartScene
   - Postcard slide-out animation on StartScene
   - Camera fade in/out transitions between all scenes
   - Postcard flip transition in PostcardScene
   - See: StartScene.js, PostcardScene.js, CompletionScene.js

5. CAMERA SYSTEM
   - Camera follows the player through the lecture hall
   - Camera bounds set to tilemap dimensions
   - Camera fade in/out used for scene transitions
   - See: LectureHallScene.js, PostcardScene.js

6. TIMER SYSTEM (Time/DelayedCall)
   - Memorization countdown per round in JournalScene
   - Delayed transition between rounds after submission
   - See: JournalScene.js

=============================================================
*/
window.onload = function() {
    window.gradeSystem = new GradeSystem();
    const config = {
        type: Phaser.AUTO,
        width: 960,
        height: 540,
        backgroundColor: '#222222',
        physics: {
            default: 'arcade',
            arcade: { debug: false }
        },
        scene: [BootScene, StartScene, LectureHallScene, JournalScene, CompletionScene, PostcardScene, CreditsScene]
    };
    const game = new Phaser.Game(config);
};

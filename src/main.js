// Name: Ernie Jennison
// Title: Uni is Fun
// Approx Hours: 32
// Got assistance for precise placement of phaser drawing functions from AI, just to ensure
// visual fidelity and quality. All systems and ideas are of my own creation.
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

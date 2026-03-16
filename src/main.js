window.onload = function() {
    // Make sure the grade system exists globally
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
        // Add CompletionScene here
        scene: [BootScene, LectureHallScene, JournalScene, CompletionScene, PostcardScene]
    };

    const game = new Phaser.Game(config);
};

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

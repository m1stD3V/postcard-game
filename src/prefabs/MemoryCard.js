class MemoryCard extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, "cardBack");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.frontTexture = texture;
        this.isFlipped = false;

        this.setInteractive();
        this.on('pointerdown', () => this.flip());
    }

    flip() {
        if(this.isFlipped) return;
        this.setTexture(this.frontTexture);
        this.isFlipped = true;
        this.scene.sound.play("flip");
    }
}

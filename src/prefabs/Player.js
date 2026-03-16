class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cat', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setSize(10, 10);        // very small collision box
        this.setOffset(19, 30);      // positioned at feet
        this.setScale(1.5);
        this.lastDirection = 'down';

        this.createAnimations(scene);
    }

    createAnimations(scene) {
        const anims = scene.anims;

        if (!anims.exists('cat-walk-down')) {
            anims.create({
                key: 'cat-walk-down',
                frames: anims.generateFrameNumbers('cat', { start: 48, end: 50 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!anims.exists('cat-walk-up')) {
            anims.create({
                key: 'cat-walk-up',
                frames: anims.generateFrameNumbers('cat', { start: 60, end: 62 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!anims.exists('cat-walk-left')) {
            anims.create({
                key: 'cat-walk-left',
                frames: anims.generateFrameNumbers('cat', { start: 72, end: 74 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!anims.exists('cat-walk-right')) {
            anims.create({
                key: 'cat-walk-right',
                frames: anims.generateFrameNumbers('cat', { start: 72, end: 74 }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    update(cursors) {
        const speed = 160;
        let moving = false;

        this.setVelocity(0);

        if (cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.play('cat-walk-left', true);
            this.setFlipX(true);
            this.lastDirection = 'left';
            moving = true;
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed);
            this.play('cat-walk-right', true);
            this.setFlipX(false);
            this.lastDirection = 'right';
            moving = true;
        }

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

        if (!moving) {
            this.setFlipX(this.lastDirection === 'left');
            this.stop();
        }
    }
}

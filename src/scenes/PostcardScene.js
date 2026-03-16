class PostcardScene extends Phaser.Scene {
    constructor() {
        super("PostcardScene");
    }

    create() {
        // --- Postcard FRONT (the game world summary) ---
        this.drawFront();

        // Flip starts on click or after a short prompt
        this.add.text(480, 515, "Click anywhere to flip", {
            font: 'italic 13px Georgia',
            fill: '#8a7a5a'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => this.flipCard());
    }

    drawFront() {
        // Postcard front — warm card background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xf5e6c8, 0xf5e6c8, 0xe8d5a3, 0xe8d5a3, 1);
        bg.fillRect(0, 0, 960, 540);

        // Card border
        const card = this.add.graphics();
        card.lineStyle(6, 0xb8975a, 1);
        card.strokeRect(20, 20, 920, 500);
        card.lineStyle(2, 0xc8a96e, 0.6);
        card.strokeRect(30, 30, 900, 480);

        // "POSTCARD" label top center
        this.add.text(480, 48, "P O S T C A R D", {
            font: 'bold 13px Georgia',
            fill: '#8a6a2a',
            letterSpacing: 6
        }).setOrigin(0.5);

        // Decorative top rule
        const rule = this.add.graphics();
        rule.lineStyle(1, 0xb8975a, 0.8);
        rule.beginPath();
        rule.moveTo(60, 66);
        rule.lineTo(900, 66);
        rule.strokePath();

        // Grade summary in center of front
        const grade = window.gradeSystem.getGrade('journal') ?? '-';
        this.add.text(480, 200, "You completed the class!", {
            font: 'bold 32px Georgia',
            fill: '#3a2a0a'
        }).setOrigin(0.5);

        this.add.text(480, 260, "Journal & Memory Studies", {
            font: 'italic 18px Georgia',
            fill: '#5a3e1b'
        }).setOrigin(0.5);

        // Grade badge
        const badge = this.add.graphics();
        badge.fillStyle(0x1a1a2e, 1);
        badge.fillCircle(480, 360, 55);
        badge.lineStyle(3, 0xb8975a, 1);
        badge.strokeCircle(480, 360, 55);

        this.add.text(480, 348, "GRADE", {
            font: 'bold 11px Georgia',
            fill: '#c8bfa0',
            letterSpacing: 2
        }).setOrigin(0.5);
        this.add.text(480, 374, grade, {
            font: 'bold 36px Georgia',
            fill: '#f5f0e8'
        }).setOrigin(0.5);

        // Decorative corner flourishes
        [
            [40, 40], [920, 40], [40, 500], [920, 500]
        ].forEach(([x, y]) => {
            this.add.text(x, y, "✦", {
                font: '14px Georgia',
                fill: '#b8975a'
            }).setOrigin(0.5);
        });
    }

    flipCard() {
        // Phase 1: squeeze to nothing (simulate rotating to 90°)
        this.tweens.add({
            targets: this.cameras.main,
            scaleX: 0,   // Phaser cameras don't have scaleX natively,
            duration: 300,
            ease: 'Sine.easeIn',
            onUpdate: (tween) => {
                const progress = tween.progress;
                // Simulate horizontal squeeze by masking with a shrinking rect
                this.cameras.main.setViewport(
                    480 * progress,
                    0,
                    960 * (1 - progress),
                    540
                );
            },
            onComplete: () => {
                // Clear everything and draw the back
                this.children.removeAll(true);
                this.drawBack();

                // Phase 2: expand from nothing (simulate rotating from 90°)
                this.cameras.main.setViewport(480, 0, 0, 540);
                this.tweens.add({
                    targets: {},
                    duration: 350,
                    ease: 'Sine.easeOut',
                    onUpdate: (tween) => {
                        const progress = tween.progress;
                        this.cameras.main.setViewport(
                            480 * (1 - progress),
                            0,
                            960 * progress,
                            540
                        );
                    },
                    onComplete: () => {
                        // Restore full viewport
                        this.cameras.main.setViewport(0, 0, 960, 540);
                    }
                });
            }
        });
    }

    drawBack() {
        // --- Postcard back ---
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xf5f0e8, 0xf5f0e8, 0xede5cc, 0xede5cc, 1);
        bg.fillRect(0, 0, 960, 540);

        // Outer border
        const card = this.add.graphics();
        card.lineStyle(6, 0xb8975a, 1);
        card.strokeRect(20, 20, 920, 500);
        card.lineStyle(2, 0xc8a96e, 0.6);
        card.strokeRect(30, 30, 900, 480);

        // "POSTCARD" label
        this.add.text(480, 48, "P O S T C A R D", {
            font: 'bold 13px Georgia',
            fill: '#8a6a2a',
            letterSpacing: 6
        }).setOrigin(0.5);

        // Top rule
        card.lineStyle(1, 0xb8975a, 0.8);
        card.beginPath();
        card.moveTo(60, 66);
        card.lineTo(900, 66);
        card.strokePath();

        // Centre divider (postcard back convention)
        card.lineStyle(1.5, 0xb8975a, 0.9);
        card.beginPath();
        card.moveTo(490, 75);
        card.lineTo(490, 510);
        card.strokePath();

        // --- LEFT SIDE: message ---
        // Ruled lines for message area
        card.lineStyle(1, 0xc8bfa0, 0.5);
        for (let y = 100; y < 500; y += 28) {
            card.beginPath();
            card.moveTo(50, y);
            card.lineTo(470, y);
            card.strokePath();
        }

        // Message text — handwritten style via italic Georgia
        const message = [
            "Sup buddy,",
            "",
            "I know school has been rough, and you are",
            "coming up on college applications so I thought",
            "I would send you a little something. You know",
            "I might have complained about how hard college",
            "is, but there are some fun parts like",
            "programming this little game for ya. It is",
            "hard work, but there are also super dope",
            "classes like the one I am taking right now",
            "that let you have some fun along the way.",
            "Stand strong, and I know you can do it bud!",
        ];

        message.forEach((line, i) => {
            this.add.text(58, 82 + i * 28, line, {
                font: `${i === 0 ? 'bold ' : ''}15px Georgia`,
                fontStyle: 'italic',
                fill: '#2a1a0a'
            });
        });

        // --- RIGHT SIDE: stamp + address lines ---

        // Stamp box (top right)
        card.lineStyle(1.5, 0xb8975a, 1);
        card.strokeRect(820, 78, 80, 95);
        card.lineStyle(1, 0xb8975a, 0.4);
        // Perforated stamp edge effect
        for (let sx = 820; sx <= 900; sx += 8) {
            card.beginPath(); card.arc(sx, 78,  3, 0, Math.PI * 2); card.strokePath();
            card.beginPath(); card.arc(sx, 173, 3, 0, Math.PI * 2); card.strokePath();
        }
        for (let sy = 78; sy <= 173; sy += 8) {
            card.beginPath(); card.arc(820, sy, 3, 0, Math.PI * 2); card.strokePath();
            card.beginPath(); card.arc(900, sy, 3, 0, Math.PI * 2); card.strokePath();
        }
        this.add.text(860, 125, "✉", {
            font: '28px Georgia', fill: '#b8975a'
        }).setOrigin(0.5);
        this.add.text(860, 158, "STAMP", {
            font: '9px Georgia', fill: '#8a6a2a', letterSpacing: 1
        }).setOrigin(0.5);

        // Address lines
        const addrLines = [
            "TO:",
            "",
            "_______________________",
            "",
            "_______________________",
            "",
            "_______________________",
        ];
        addrLines.forEach((line, i) => {
            this.add.text(510, 220 + i * 28, line, {
                font: `${i === 0 ? 'bold ' : ''}14px Georgia`,
                fill: i === 0 ? '#3a2a0a' : '#b8975a'
            });
        });

        // Postmark circle (decorative)
        card.lineStyle(1.5, 0xb8975a, 0.5);
        card.strokeCircle(600, 130, 40);
        card.strokeCircle(600, 130, 34);
        this.add.text(600, 118, "CLASS OF", {
            font: 'bold 9px Georgia', fill: '#b8975a', letterSpacing: 1
        }).setOrigin(0.5);
        this.add.text(600, 132, "2025", {
            font: 'bold 14px Georgia', fill: '#b8975a'
        }).setOrigin(0.5);
        this.add.text(600, 148, "DELIVERED", {
            font: 'bold 9px Georgia', fill: '#b8975a', letterSpacing: 1
        }).setOrigin(0.5);

        // Corner flourishes
        [
            [40, 40], [920, 40], [40, 500], [920, 500]
        ].forEach(([x, y]) => {
            this.add.text(x, y, "✦", {
                font: '14px Georgia', fill: '#b8975a'
            }).setOrigin(0.5);
        });
    }
}

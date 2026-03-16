class CreditsScene extends Phaser.Scene {
    constructor() {
        super("CreditsScene");
    }

    create() {
        // --- Background ---
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xf5f0e8, 0xf5f0e8, 0xe8e0cc, 0xe8e0cc, 1);
        bg.fillRect(0, 0, 960, 540);
        bg.lineStyle(1, 0xc8bfa0, 0.3);
        for (let y = 0; y < 540; y += 20) {
            bg.beginPath();
            bg.moveTo(0, y);
            bg.lineTo(960, y);
            bg.strokePath();
        }

        // --- Credits card ---
        const cardGfx = this.add.graphics();
        cardGfx.fillStyle(0xfdfaf3, 1);
        cardGfx.fillRoundedRect(100, 20, 760, 500, 4);
        cardGfx.lineStyle(2, 0x3a2a0a, 1);
        cardGfx.strokeRoundedRect(100, 20, 760, 500, 4);
        cardGfx.lineStyle(1, 0x3a2a0a, 0.4);
        cardGfx.strokeRoundedRect(110, 30, 740, 480, 2);

        // Header band
        cardGfx.fillStyle(0x1a1a2e, 1);
        cardGfx.fillRect(100, 20, 760, 60);
        cardGfx.lineStyle(2, 0x3a2a0a, 1);
        cardGfx.strokeRect(100, 20, 760, 60);

        this.add.text(480, 50, "C R E D I T S", {
            font: 'bold 22px Georgia',
            fill: '#f5f0e8',
            letterSpacing: 6
        }).setOrigin(0.5);

        // Divider
        cardGfx.lineStyle(1, 0x3a2a0a, 0.4);
        cardGfx.beginPath();
        cardGfx.moveTo(120, 92);
        cardGfx.lineTo(840, 92);
        cardGfx.strokePath();

        // --- Credits entries ---
        const credits = [
            { role: "Game Design",         name: "Ernie Jennison",  url: null },
            { role: "Programming",         name: "Ernie Jennison",  url: null },
            { role: "Level Design",        name: "Ernie Jennison",  url: null },
            { role: "Writing & Narrative", name: "Ernie Jennison",  url: null },
            { role: "Sound Design 1",      name: "youtube.com/watch?v=IYE1nqvAzu4",    url: "https://www.youtube.com/watch?v=IYE1nqvAzu4" },
            { role: "Sound Design 2",      name: "youtube.com/watch?v=xyPSeHWKB0g",    url: "https://www.youtube.com/watch?v=xyPSeHWKB0g" },
            { role: "Sound Design 3",      name: "youtube.com/watch?v=nUsHboYC5zc",    url: "https://www.youtube.com/watch?v=nUsHboYC5zc" },
            { role: "Sound Design 4",      name: "youtube.com/watch?v=VUQfT3gNT3g",    url: "https://www.youtube.com/watch?v=VUQfT3gNT3g" },
            { role: "Art & Assets 1",      name: "kamisama887.itch.io/lorenz-fries-school-horror", url: "https://kamisama887.itch.io/lorenz-fries-school-horror" },
            { role: "Art & Assets 2",      name: "chemicalbunny.itch.io/lps-shorthair-cat-sprites", url: "https://chemicalbunny.itch.io/lps-shorthair-cat-sprites" },
            { role: "Built With",          name: "Phaser 3  ·  Tiled Map Editor",      url: null },
        ];

        const rowH = 36;
        const startY = 100;

        credits.forEach((entry, i) => {
            const rowY = startY + i * rowH;

            // Alternating row tint
            if (i % 2 === 0) {
                cardGfx.fillStyle(0xf5ead0, 0.3);
                cardGfx.fillRect(112, rowY, 736, rowH);
            }

            // Role label
            this.add.text(125, rowY + 10, entry.role, {
                font: 'bold 13px Georgia',
                fill: '#3a2a0a'
            });

            // Name / link
            const nameText = this.add.text(400, rowY + 10, entry.name, {
                font: `${entry.url ? 'italic' : ''} 13px Georgia`,
                fill: entry.url ? '#1a3a8a' : '#1a1a2e'
            });

            if (entry.url) {
                const url = entry.url;
                nameText.setInteractive({ useHandCursor: true })
                    .on('pointerover', () => nameText.setStyle({ fill: '#4a6aff' }))
                    .on('pointerout',  () => nameText.setStyle({ fill: '#1a3a8a' }))
                    .on('pointerdown', () => window.open(url, '_blank'));

                cardGfx.lineStyle(1, 0x1a3a8a, 0.6);
                cardGfx.beginPath();
                cardGfx.moveTo(400, rowY + 26);
                cardGfx.lineTo(400 + nameText.width, rowY + 26);
                cardGfx.strokePath();
            }

            // Row divider
            cardGfx.lineStyle(1, 0x3a2a0a, 0.08);
            cardGfx.beginPath();
            cardGfx.moveTo(120, rowY + rowH);
            cardGfx.lineTo(840, rowY + rowH);
            cardGfx.strokePath();
        });

        // Footer
        this.add.text(480, 508, "Made with ♥ — Ernie Jennison · 2026", {
            font: 'italic 11px Georgia',
            fill: '#8a7a5a'
        }).setOrigin(0.5);

        // --- Back button ---
        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(0x1a1a2e, 1);
        btnGfx.fillRoundedRect(370, 522, 220, 32, 6);

        this.add.text(480, 538, "← Back to Start", {
            font: 'bold 13px Georgia',
            fill: '#f5f0e8'
        }).setOrigin(0.5);

        this.add.rectangle(480, 538, 220, 32, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btnGfx.clear();
                btnGfx.fillStyle(0x3a3a5e, 1);
                btnGfx.fillRoundedRect(370, 522, 220, 32, 6);
            })
            .on('pointerout', () => {
                btnGfx.clear();
                btnGfx.fillStyle(0x1a1a2e, 1);
                btnGfx.fillRoundedRect(370, 522, 220, 32, 6);
            })
            .on('pointerdown', () => this.scene.start('StartScene'));
    }
}

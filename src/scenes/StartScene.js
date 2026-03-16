class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    create() {
        this.drawBackground();
        this.drawEnvelope();
        this.drawControls();
        this.drawButtons();
    }

    drawBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xd4c5a9, 0xd4c5a9, 0xb8a882, 0xb8a882, 1);
        bg.fillRect(0, 0, 960, 540);
        bg.lineStyle(1, 0xa08060, 0.15);
        for (let y = 0; y < 540; y += 8) {
            bg.beginPath();
            bg.moveTo(0, y);
            bg.lineTo(960, y);
            bg.strokePath();
        }
    }

    drawEnvelope() {
        const ex = 580, ey = 240;
        const ew = 460, eh = 300;
        const el = ex - ew / 2;
        const et = ey - eh / 2;

        const env = this.add.graphics();
        env.fillStyle(0xfdf6e3, 1);
        env.fillRect(el, et, ew, eh);
        env.lineStyle(2, 0xb8975a, 1);
        env.strokeRect(el, et, ew, eh);

        // Left fold
        const foldColor = 0xf0e6c8;
        env.fillStyle(foldColor, 1);
        env.fillTriangle(el, et, el, et + eh, ex, ey);
        env.lineStyle(1, 0xb8975a, 0.5);
        env.strokeTriangle(el, et, el, et + eh, ex, ey);

        // Right fold
        env.fillStyle(foldColor, 1);
        env.fillTriangle(el + ew, et, el + ew, et + eh, ex, ey);
        env.lineStyle(1, 0xb8975a, 0.5);
        env.strokeTriangle(el + ew, et, el + ew, et + eh, ex, ey);

        // Bottom fold
        env.fillStyle(0xe8dcc0, 1);
        env.fillTriangle(el, et + eh, el + ew, et + eh, ex, ey);
        env.lineStyle(1, 0xb8975a, 0.5);
        env.strokeTriangle(el, et + eh, el + ew, et + eh, ex, ey);

        // Flap
        this.flapGraphics = this.add.graphics();
        this.envelopeBounds = { el, et, ew, eh, ex, ey };
        this.drawFlap(this.flapGraphics, 0);
    }

    drawFlap(gfx, openAmount) {
        const { el, et, ew, eh, ex } = this.envelopeBounds;
        gfx.clear();
        const closedTipY = et + eh * 0.45;
        const openTipY   = et - eh * 0.35;
        const tipY = Phaser.Math.Linear(closedTipY, openTipY, openAmount);
        gfx.fillStyle(0xf5ead0, 1);
        gfx.fillTriangle(el, et, el + ew, et, ex, tipY);
        gfx.lineStyle(1.5, 0xb8975a, 1);
        gfx.strokeTriangle(el, et, el + ew, et, ex, tipY);
    }

    drawControls() {
        const cx = 200, cy = 240;
        const cw = 280, ch = 260;

        const gfx = this.add.graphics();
        gfx.fillStyle(0xfdf6e3, 0.92);
        gfx.fillRoundedRect(cx - cw / 2, cy - ch / 2, cw, ch, 6);
        gfx.lineStyle(1.5, 0xb8975a, 0.9);
        gfx.strokeRoundedRect(cx - cw / 2, cy - ch / 2, cw, ch, 6);

        // Header stripe
        gfx.fillStyle(0x1a1a2e, 1);
        gfx.fillRoundedRect(cx - cw / 2, cy - ch / 2, cw, 30, 6);
        gfx.fillRect(cx - cw / 2, cy - ch / 2 + 16, cw, 14);

        this.add.text(cx, cy - ch / 2 + 15, "H O W  T O  P L A Y", {
            font: 'bold 11px Georgia',
            fill: '#f5f0e8',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Ruled lines
        gfx.lineStyle(1, 0xb8c8e8, 0.4);
        for (let ly = cy - ch / 2 + 48; ly < cy + ch / 2 - 10; ly += 22) {
            gfx.beginPath();
            gfx.moveTo(cx - cw / 2 + 12, ly);
            gfx.lineTo(cx + cw / 2 - 12, ly);
            gfx.strokePath();
        }

        const controls = [
            { key: "Arrow Keys", desc: "Move around" },
            { key: "E",          desc: "Interact" },
            { key: "TAB",        desc: "View Report Card" },
        ];

        controls.forEach((c, i) => {
            const y = cy - ch / 2 + 52 + i * 44;

            const kgfx = this.add.graphics();
            kgfx.fillStyle(0x1a1a2e, 1);
            kgfx.fillRoundedRect(cx - cw / 2 + 14, y - 10, 80, 22, 4);

            this.add.text(cx - cw / 2 + 54, y + 1, c.key, {
                font: 'bold 10px Georgia',
                fill: '#f5f0e8'
            }).setOrigin(0.5);

            this.add.text(cx - cw / 2 + 104, y + 1, c.desc, {
                font: 'italic 13px Georgia',
                fill: '#3a2a0a'
            });
        });

        // Hint at bottom
        this.add.text(cx, cy + ch / 2 - 22,
            "Find the journal to start the mini-game!", {
            font: 'italic 11px Georgia',
            fill: '#8a6a2a',
            align: 'center',
            wordWrap: { width: cw - 24 }
        }).setOrigin(0.5);
    }

    drawButtons() {
        this.drawButton(400, 490, "▶  Play", () => this.startGame());
        this.drawButton(620, 490, "Credits", () => this.scene.start('CreditsScene'));
    }

    drawButton(cx, cy, label, callback) {
        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(0x1a1a2e, 1);
        btnGfx.fillRoundedRect(cx - 100, cy - 20, 200, 40, 8);
        this.add.text(cx, cy, label, {
            font: 'bold 16px Georgia',
            fill: '#f5f0e8'
        }).setOrigin(0.5);
        this.add.rectangle(cx, cy, 200, 40, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btnGfx.clear();
                btnGfx.fillStyle(0x3a3a5e, 1);
                btnGfx.fillRoundedRect(cx - 100, cy - 20, 200, 40, 8);
            })
            .on('pointerout', () => {
                btnGfx.clear();
                btnGfx.fillStyle(0x1a1a2e, 1);
                btnGfx.fillRoundedRect(cx - 100, cy - 20, 200, 40, 8);
            })
            .on('pointerdown', callback);
    }

    startGame() {
        this.sound.play('tear', { volume: 0.7 });
        this.input.enabled = false;
        const flapTween = { value: 0 };
        this.tweens.add({
            targets: flapTween,
            value: 1,
            duration: 600,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                this.drawFlap(this.flapGraphics, flapTween.value);
            },
            onComplete: () => {
                this.slidePostcard();
            }
        });
    }

    slidePostcard() {
        const { el, et, ew } = this.envelopeBounds;
        const cardGfx = this.add.graphics();
        const cardW = ew - 60;
        const cardH = 160;
        const cardX = el + 30;
        const slideTarget = { y: et + 40 };

        const cardLabel = this.add.text(cardX + cardW / 2, slideTarget.y + cardH / 2, "P O S T C A R D", {
            font: 'bold 18px Georgia',
            fill: '#8a6a2a',
            letterSpacing: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: slideTarget,
            y: et - cardH - 20,
            duration: 800,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                cardGfx.clear();
                cardGfx.fillStyle(0xfdfaf3, 1);
                cardGfx.fillRoundedRect(cardX, slideTarget.y, cardW, cardH, 6);
                cardGfx.lineStyle(2, 0xb8975a, 1);
                cardGfx.strokeRoundedRect(cardX, slideTarget.y, cardW, cardH, 6);
                cardLabel.y = slideTarget.y + cardH / 2;
            },
            onComplete: () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('LectureHallScene');
                });
            }
        });
    }
}

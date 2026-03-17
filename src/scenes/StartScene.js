/**
 * StartScene
 * 
 * The title/start screen of the game. Presents the player with an envelope
 * containing the postcard — the central metaphor of the entire experience.
 * 
 * Layout:
 *   - Left side: "How To Play" card explaining controls
 *   - Right side: An illustrated envelope with animated flap
 *   - Bottom: Play and Credits buttons
 * 
 * When the player clicks Play:
 *   1. A tear sound plays
 *   2. The envelope flap animates open (Tween Manager)
 *   3. A postcard slides out from inside the envelope (Tween Manager)
 *   4. The camera fades to black (Camera System)
 *   5. LectureHallScene begins
 * 
 * Uses: Tween Manager (flap + slide animations), Camera System (fadeOut),
 *       Phaser Graphics, Phaser Text, Sound Manager.
 */
class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    /**
     * create
     * 
     * Draws all visual elements of the start screen in layered order:
     * background → envelope → controls card → buttons.
     */
    create() {
        this.drawBackground();
        this.drawEnvelope();
        this.drawControls();
        this.drawButtons();
    }

    /**
     * drawBackground
     * 
     * Fills the screen with a warm tan gradient and overlays subtle
     * horizontal texture lines to evoke aged paper or a corkboard.
     */
    drawBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xd4c5a9, 0xd4c5a9, 0xb8a882, 0xb8a882, 1);
        bg.fillRect(0, 0, 960, 540);

        // Subtle horizontal lines give the background a paper texture
        bg.lineStyle(1, 0xa08060, 0.15);
        for (let y = 0; y < 540; y += 8) {
            bg.beginPath();
            bg.moveTo(0, y);
            bg.lineTo(960, y);
            bg.strokePath();
        }
    }

    /**
     * drawEnvelope
     * 
     * Draws a realistic envelope centered on the right half of the screen.
     * The envelope body has four triangular fold sections (left, right, bottom,
     * and the animated top flap). The flap is drawn on a separate Graphics
     * object so it can be redrawn each frame during the open animation.
     * 
     * Stores envelope dimensions in this.envelopeBounds for use by
     * drawFlap() and slidePostcard().
     */
    drawEnvelope() {
        // Envelope center, width, and height
        const ex = 580, ey = 240;
        const ew = 460, eh = 300;
        const el = ex - ew / 2;  // Left edge
        const et = ey - eh / 2;  // Top edge

        // Envelope body — cream fill with gold border
        const env = this.add.graphics();
        env.fillStyle(0xfdf6e3, 1);
        env.fillRect(el, et, ew, eh);
        env.lineStyle(2, 0xb8975a, 1);
        env.strokeRect(el, et, ew, eh);

        // Left fold — triangle pointing to envelope center
        const foldColor = 0xf0e6c8;
        env.fillStyle(foldColor, 1);
        env.fillTriangle(el, et, el, et + eh, ex, ey);
        env.lineStyle(1, 0xb8975a, 0.5);
        env.strokeTriangle(el, et, el, et + eh, ex, ey);

        // Right fold — triangle pointing to envelope center
        env.fillStyle(foldColor, 1);
        env.fillTriangle(el + ew, et, el + ew, et + eh, ex, ey);
        env.lineStyle(1, 0xb8975a, 0.5);
        env.strokeTriangle(el + ew, et, el + ew, et + eh, ex, ey);

        // Bottom fold — slightly darker triangle
        env.fillStyle(0xe8dcc0, 1);
        env.fillTriangle(el, et + eh, el + ew, et + eh, ex, ey);
        env.lineStyle(1, 0xb8975a, 0.5);
        env.strokeTriangle(el, et + eh, el + ew, et + eh, ex, ey);

        // Flap is a separate Graphics object so it can be redrawn during animation
        this.flapGraphics = this.add.graphics();

        // Store bounds for reuse in drawFlap() and slidePostcard()
        this.envelopeBounds = { el, et, ew, eh, ex, ey };

        // Draw the flap in its closed position (openAmount = 0)
        this.drawFlap(this.flapGraphics, 0);
    }

    /**
     * drawFlap
     * 
     * Redraws the envelope's top flap triangle at a given open amount.
     * Called once on setup (closed) and then every tween frame during animation.
     * 
     * The flap tip Y position is linearly interpolated between closed and open
     * using Phaser.Math.Linear, giving a smooth fold-open effect.
     * 
     * @param {Phaser.GameObjects.Graphics} gfx - The Graphics object to draw on
     * @param {number} openAmount - 0 = fully closed, 1 = fully open
     */
    drawFlap(gfx, openAmount) {
        const { el, et, ew, eh, ex } = this.envelopeBounds;
        gfx.clear();

        // Interpolate flap tip between closed (pointing down) and open (above envelope)
        const closedTipY = et + eh * 0.45;
        const openTipY   = et - eh * 0.35;
        const tipY = Phaser.Math.Linear(closedTipY, openTipY, openAmount);

        gfx.fillStyle(0xf5ead0, 1);
        gfx.fillTriangle(el, et, el + ew, et, ex, tipY);
        gfx.lineStyle(1.5, 0xb8975a, 1);
        gfx.strokeTriangle(el, et, el + ew, et, ex, tipY);
    }

    /**
     * drawControls
     * 
     * Draws a "How To Play" card on the left side of the screen.
     * Styled to match the journal and report card aesthetic — parchment
     * fill, dark header band, ruled lines, and dark key badge labels.
     * 
     * Lists the three controls the player needs to know:
     *   Arrow Keys — move, E — interact, TAB — view report card.
     * A hint at the bottom points the player toward the journal.
     */
    drawControls() {
        const cx = 200, cy = 240;
        const cw = 280, ch = 260;

        // Card background and border
        const gfx = this.add.graphics();
        gfx.fillStyle(0xfdf6e3, 0.92);
        gfx.fillRoundedRect(cx - cw / 2, cy - ch / 2, cw, ch, 6);
        gfx.lineStyle(1.5, 0xb8975a, 0.9);
        gfx.strokeRoundedRect(cx - cw / 2, cy - ch / 2, cw, ch, 6);

        // Dark header stripe — matches button and report card header style
        gfx.fillStyle(0x1a1a2e, 1);
        gfx.fillRoundedRect(cx - cw / 2, cy - ch / 2, cw, 30, 6);
        gfx.fillRect(cx - cw / 2, cy - ch / 2 + 16, cw, 14);

        this.add.text(cx, cy - ch / 2 + 15, "H O W  T O  P L A Y", {
            font: 'bold 11px Georgia',
            fill: '#f5f0e8',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Ruled lines across the card body
        gfx.lineStyle(1, 0xb8c8e8, 0.4);
        for (let ly = cy - ch / 2 + 48; ly < cy + ch / 2 - 10; ly += 22) {
            gfx.beginPath();
            gfx.moveTo(cx - cw / 2 + 12, ly);
            gfx.lineTo(cx + cw / 2 - 12, ly);
            gfx.strokePath();
        }

        // Control entries — each has a dark key badge and a description label
        const controls = [
            { key: "Arrow Keys", desc: "Move around" },
            { key: "E",          desc: "Interact" },
            { key: "TAB",        desc: "View Report Card" },
        ];

        controls.forEach((c, i) => {
            const y = cy - ch / 2 + 52 + i * 44;

            // Dark pill badge for the key name
            const kgfx = this.add.graphics();
            kgfx.fillStyle(0x1a1a2e, 1);
            kgfx.fillRoundedRect(cx - cw / 2 + 14, y - 10, 80, 22, 4);

            this.add.text(cx - cw / 2 + 54, y + 1, c.key, {
                font: 'bold 10px Georgia',
                fill: '#f5f0e8'
            }).setOrigin(0.5);

            // Description to the right of the badge
            this.add.text(cx - cw / 2 + 104, y + 1, c.desc, {
                font: 'italic 13px Georgia',
                fill: '#3a2a0a'
            });
        });

        // Hint at the bottom of the card pointing toward the objective
        this.add.text(cx, cy + ch / 2 - 22,
            "Find the journal to start the mini-game!", {
            font: 'italic 11px Georgia',
            fill: '#8a6a2a',
            align: 'center',
            wordWrap: { width: cw - 24 }
        }).setOrigin(0.5);
    }

    /**
     * drawButtons
     * 
     * Places the Play and Credits buttons below the envelope.
     * Play triggers the envelope open animation.
     * Credits navigates to CreditsScene.
     */
    drawButtons() {
        this.drawButton(400, 490, "▶  Play", () => this.startGame());
        this.drawButton(620, 490, "Credits", () => this.scene.start('CreditsScene'));
    }

    /**
     * drawButton
     * 
     * Reusable helper that draws a dark rounded button with hover state.
     * Uses an invisible Rectangle as the interactive hit area layered over
     * the Graphics background, which is redrawn on hover/unhover.
     * 
     * @param {number} cx - Center x of the button
     * @param {number} cy - Center y of the button
     * @param {string} label - Text displayed on the button
     * @param {function} callback - Called when the button is clicked
     */
    drawButton(cx, cy, label, callback) {
        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(0x1a1a2e, 1);
        btnGfx.fillRoundedRect(cx - 100, cy - 20, 200, 40, 8);

        this.add.text(cx, cy, label, {
            font: 'bold 16px Georgia',
            fill: '#f5f0e8'
        }).setOrigin(0.5);

        // Invisible hit area sits on top as the actual interactive target
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

    /**
     * startGame
     * 
     * Triggered when the player clicks Play. Plays the tear sound effect,
     * disables input to prevent double-clicks, then uses the Tween Manager
     * to animate the envelope flap opening by interpolating openAmount from
     * 0 to 1 and redrawing the flap each frame.
     * 
     * On completion, calls slidePostcard() to continue the animation sequence.
     */
    startGame() {
        // Tear sound plays as the envelope flap opens
        this.sound.play('tear', { volume: 0.7 });

        // Disable all input so the player can't interrupt the animation
        this.input.enabled = false;

        // Animate the flap from closed (0) to open (1) over 600ms
        const flapTween = { value: 0 };
        this.tweens.add({
            targets: flapTween,
            value: 1,
            duration: 600,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                // Redraw the flap at the current interpolated open amount
                this.drawFlap(this.flapGraphics, flapTween.value);
            },
            onComplete: () => {
                this.slidePostcard();
            }
        });
    }

    /**
     * slidePostcard
     * 
     * The second half of the Play animation. After the flap opens, a postcard
     * slides upward out of the envelope using the Tween Manager. The card is
     * drawn and redrawn each frame at the interpolated Y position.
     * 
     * Once the card clears the top of the envelope, the camera fades to black
     * and LectureHallScene begins.
     */
    slidePostcard() {
        const { el, et, ew } = this.envelopeBounds;

        // Create the postcard graphic that slides out
        const cardGfx = this.add.graphics();
        const cardW = ew - 60;
        const cardH = 160;
        const cardX = el + 30;

        // Start the card just inside the envelope opening
        const slideTarget = { y: et + 40 };

        // "POSTCARD" label sits centered on the sliding card
        const cardLabel = this.add.text(
            cardX + cardW / 2,
            slideTarget.y + cardH / 2,
            "P O S T C A R D", {
            font: 'bold 18px Georgia',
            fill: '#8a6a2a',
            letterSpacing: 6
        }).setOrigin(0.5);

        // Slide the card upward out of the envelope over 800ms
        this.tweens.add({
            targets: slideTarget,
            y: et - cardH - 20,    // Final position: fully above the envelope
            duration: 800,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                // Redraw card at current Y position each frame
                cardGfx.clear();
                cardGfx.fillStyle(0xfdfaf3, 1);
                cardGfx.fillRoundedRect(cardX, slideTarget.y, cardW, cardH, 6);
                cardGfx.lineStyle(2, 0xb8975a, 1);
                cardGfx.strokeRoundedRect(cardX, slideTarget.y, cardW, cardH, 6);
                cardLabel.y = slideTarget.y + cardH / 2;
            },
            onComplete: () => {
                // Fade to black then start the main game scene
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('LectureHallScene');
                });
            }
        });
    }
}

/**
 * PostcardScene
 * 
 * The final scene of the game — the "flip" of the playable postcard.
 * Reached only after the player achieves a grade of B or higher (70%+).
 * 
 * The scene has two sides:
 * 
 *   FRONT — A celebratory postcard face showing the player's grade in a
 *            badge, the course name, and a completion message. The player
 *            clicks anywhere to flip to the back.
 * 
 *   BACK  — A handwritten message from the developer to their little brother,
 *           styled as a real postcard back with a stamp, postmark, address
 *           field, ruled lines, and a centre divider. A Replay button resets
 *           the grade and returns to StartScene.
 * 
 * The "flip" transition uses Phaser's Camera System — a parchment-tone
 * fade out clears the front, then a fade in reveals the back, simulating
 * the card being physically turned over.
 * 
 * Uses: Camera System (fadeIn/fadeOut), Phaser Graphics, Phaser Text,
 *       Phaser Input (pointerdown), Sound Manager.
 */
class PostcardScene extends Phaser.Scene {
    constructor() {
        super("PostcardScene");
    }

    /**
     * create
     * 
     * Fades the scene in from a parchment tone, draws the postcard front,
     * and waits for the player to click anywhere to trigger the flip.
     */
    create() {
        // Fade in from parchment color — matches the card background so it feels
        // like the card is materializing rather than appearing from black
        this.cameras.main.fadeIn(600, 245, 236, 204);

        this.drawFront();

        // Flip prompt — sits below the card border
        this.flipPrompt = this.add.text(480, 515, "Click anywhere to flip", {
            font: 'italic 13px Georgia',
            fill: '#8a7a5a'
        }).setOrigin(0.5);

        // Listen for a single click anywhere to trigger the card flip
        this.input.once('pointerdown', () => this.flipCard());
    }

    /**
     * drawFront
     * 
     * Renders the front face of the postcard using Phaser Graphics and Text.
     * Shows a warm parchment background, double border, "POSTCARD" header,
     * completion message, course name, and a grade badge circle.
     * Corner flourishes add a decorative postcard feel.
     */
    drawFront() {
        // Warm parchment gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xf5e6c8, 0xf5e6c8, 0xe8d5a3, 0xe8d5a3, 1);
        bg.fillRect(0, 0, 960, 540);

        // Double border — thick outer, thin inner
        const card = this.add.graphics();
        card.lineStyle(6, 0xb8975a, 1);
        card.strokeRect(20, 20, 920, 500);
        card.lineStyle(2, 0xc8a96e, 0.6);
        card.strokeRect(30, 30, 900, 480);

        // "POSTCARD" label at the top center
        this.add.text(480, 48, "P O S T C A R D", {
            font: 'bold 13px Georgia',
            fill: '#8a6a2a',
            letterSpacing: 6
        }).setOrigin(0.5);

        // Decorative rule below the header label
        const rule = this.add.graphics();
        rule.lineStyle(1, 0xb8975a, 0.8);
        rule.beginPath();
        rule.moveTo(60, 66);
        rule.lineTo(900, 66);
        rule.strokePath();

        // Read the player's final grade from the global grade system
        const grade = window.gradeSystem.getGrade('journal') ?? '-';

        // Completion message
        this.add.text(480, 200, "You completed the class!", {
            font: 'bold 32px Georgia',
            fill: '#3a2a0a'
        }).setOrigin(0.5);

        // Course subtitle
        this.add.text(480, 260, "Journal & Memory Studies", {
            font: 'italic 18px Georgia',
            fill: '#5a3e1b'
        }).setOrigin(0.5);

        // Grade badge — dark circle with gold border displaying the letter grade
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
        [[40, 40], [920, 40], [40, 500], [920, 500]].forEach(([x, y]) => {
            this.add.text(x, y, "✦", { font: '14px Georgia', fill: '#b8975a' }).setOrigin(0.5);
        });
    }

    /**
     * flipCard
     * 
     * Simulates flipping the postcard by fading the camera out to a parchment
     * tone, destroying all front-side game objects, drawing the back, then
     * fading back in. The matching fade color makes the transition feel like
     * a physical card turn rather than a hard scene cut.
     */
    flipCard() {
        // Fade to parchment (not black) to feel like a card turning
        this.cameras.main.fadeOut(400, 245, 236, 204);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Destroy all front-side objects before drawing the back
            this.children.removeAll(true);
            this.drawBack();

            // Fade back in to reveal the back of the postcard
            this.cameras.main.fadeIn(500, 245, 236, 204);
        });
    }

    /**
     * drawBack
     * 
     * Renders the back face of the postcard — styled as a real postcard back
     * with a centre divider separating the message area from the address area.
     * 
     * Left side:
     *   - Horizontal ruled lines
     *   - Handwritten-style personal message from the developer to their sibling
     * 
     * Right side:
     *   - Perforated stamp box with envelope icon
     *   - Double-circle postmark reading "CLASS OF 2026"
     *   - "TO: Little Bro" address field with ruled lines
     * 
     * Bottom right:
     *   - Replay button that resets the grade and returns to StartScene
     */
    drawBack() {
        // Slightly cooler parchment tone for the back of the card
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xf5f0e8, 0xf5f0e8, 0xede5cc, 0xede5cc, 1);
        bg.fillRect(0, 0, 960, 540);

        // Double border — matches front side
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

        // Top rule below header
        card.lineStyle(1, 0xb8975a, 0.8);
        card.beginPath();
        card.moveTo(60, 66);
        card.lineTo(900, 66);
        card.strokePath();

        // Centre vertical divider — separates message (left) from address (right)
        card.lineStyle(1.5, 0xb8975a, 0.9);
        card.beginPath();
        card.moveTo(490, 75);
        card.lineTo(490, 510);
        card.strokePath();

        // --- LEFT SIDE: message area ---

        // Horizontal ruled lines for the message area
        card.lineStyle(1, 0xc8bfa0, 0.5);
        for (let y = 100; y < 500; y += 28) {
            card.beginPath();
            card.moveTo(50, y);
            card.lineTo(470, y);
            card.strokePath();
        }

        // Personal message — italic Georgia simulates handwritten style.
        // First line is bolded as a salutation, rest is regular italic.
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

        // --- RIGHT SIDE top: stamp and postmark ---

        // Stamp box with perforated dot border effect
        card.lineStyle(1.5, 0xb8975a, 1);
        card.strokeRect(510, 80, 68, 85);
        card.lineStyle(1, 0xb8975a, 0.4);
        for (let sx = 510; sx <= 578; sx += 7) {
            card.beginPath(); card.arc(sx, 80,  2.5, 0, Math.PI * 2); card.strokePath();
            card.beginPath(); card.arc(sx, 165, 2.5, 0, Math.PI * 2); card.strokePath();
        }
        for (let sy = 80; sy <= 165; sy += 7) {
            card.beginPath(); card.arc(510, sy, 2.5, 0, Math.PI * 2); card.strokePath();
            card.beginPath(); card.arc(578, sy, 2.5, 0, Math.PI * 2); card.strokePath();
        }
        this.add.text(544, 118, "✉", {
            font: '22px Georgia', fill: '#b8975a'
        }).setOrigin(0.5);
        this.add.text(544, 150, "STAMP", {
            font: '8px Georgia', fill: '#8a6a2a', letterSpacing: 1
        }).setOrigin(0.5);

        // Double-circle postmark to the right of the stamp
        card.lineStyle(1.5, 0xb8975a, 0.6);
        card.strokeCircle(650, 122, 38);
        card.strokeCircle(650, 122, 32);
        this.add.text(650, 110, "CLASS OF", {
            font: 'bold 8px Georgia', fill: '#b8975a', letterSpacing: 1
        }).setOrigin(0.5);
        this.add.text(650, 122, "2026", {
            font: 'bold 14px Georgia', fill: '#b8975a'
        }).setOrigin(0.5);
        this.add.text(650, 136, "DELIVERED", {
            font: 'bold 8px Georgia', fill: '#b8975a', letterSpacing: 1
        }).setOrigin(0.5);

        // --- RIGHT SIDE: address field ---
        this.add.text(510, 190, "TO:", {
            font: 'bold 13px Georgia', fill: '#3a2a0a'
        });
        this.add.text(510, 212, "Little Bro", {
            font: 'italic 17px Georgia', fill: '#2a1a0a'
        });

        // Ruled address lines below the recipient name
        card.lineStyle(1, 0xb8975a, 0.5);
        [244, 272, 300, 328].forEach(y => {
            card.beginPath();
            card.moveTo(510, y);
            card.lineTo(880, y);
            card.strokePath();
        });

        // Corner flourishes — match the front side
        [[40, 40], [920, 40], [40, 500], [920, 500]].forEach(([x, y]) => {
            this.add.text(x, y, "✦", { font: '14px Georgia', fill: '#b8975a' }).setOrigin(0.5);
        });

        // --- Replay button (bottom right) ---
        // Resets the grade and sends the player back to the start screen
        const btnGfx = this.add.graphics();
        btnGfx.fillStyle(0x1a1a2e, 1);
        btnGfx.fillRoundedRect(760, 488, 150, 36, 6);

        this.add.text(835, 506, "Replay", {
            font: 'bold 14px Georgia',
            fill: '#f5f0e8'
        }).setOrigin(0.5);

        // Invisible hit area over the button
        this.add.rectangle(835, 506, 150, 36, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btnGfx.clear();
                btnGfx.fillStyle(0x3a3a5e, 1);
                btnGfx.fillRoundedRect(760, 488, 150, 36, 6);
            })
            .on('pointerout', () => {
                btnGfx.clear();
                btnGfx.fillStyle(0x1a1a2e, 1);
                btnGfx.fillRoundedRect(760, 488, 150, 36, 6);
            })
            .on('pointerdown', () => {
                // Clear the grade so the player starts fresh
                window.gradeSystem.setGrade('journal', null);

                // Fade to black before transitioning back to StartScene
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('StartScene');
                });
            });
    }
}

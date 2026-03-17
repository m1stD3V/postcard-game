/**
 * JournalScene
 * 
 * The core mini-game of the postcard experience. Presents the player with a
 * memory and ordering challenge across three rounds of increasing difficulty.
 * 
 * Gameplay loop per round:
 *   1. A shuffled sequence of numbered index cards is displayed on the left page
 *   2. The player has a limited time to memorize the order
 *   3. Cards are hidden and a shuffled set appears for the player to drag into
 *      the correct order on the right page's drop zones
 *   4. The player submits their answer and receives visual feedback
 *   5. After all three rounds, accuracy is calculated and a grade is assigned
 * 
 * Round progression:
 *   Round 1 — 3 cards, 3 seconds to memorize
 *   Round 2 — 5 cards, 2.5 seconds to memorize
 *   Round 3 — 7 cards, 2 seconds to memorize
 * 
 * Grading:
 *   90%+ = A | 70%+ = B | 50%+ = C | below 50% = F
 * 
 * Uses: Phaser Timer (delayedCall), Phaser Input (drag events), Phaser Graphics,
 *       Phaser Text, and the global Sound Manager.
 */
class JournalScene extends Phaser.Scene {
    constructor() {
        super("JournalScene");
    }

    /**
     * create
     * 
     * Initializes round tracking state and draws the static journal background.
     * Immediately begins the first round.
     */
    create() {
        this.currentRound = 0;   // Tracks which round the player is on (0-indexed)
        this.totalCorrect = 0;   // Running total of correctly placed cards across all rounds
        this.totalCards = 0;     // Running total of cards attempted across all rounds

        // Configuration for each round: how many cards and how long to memorize
        this.roundConfigs = [
            { cardCount: 3, memorizeTime: 3000 },
            { cardCount: 5, memorizeTime: 2500 },
            { cardCount: 7, memorizeTime: 2000 },
        ];

        // Draw the persistent journal background (pages, spine, ruled lines)
        this.drawBackground();

        // Begin the first round
        this.startRound();
    }

    /**
     * drawBackground
     * 
     * Draws the static open journal spread using Phaser Graphics.
     * This includes the parchment background, left and right pages with
     * ruled lines and red margin lines, and the centre spine.
     * Only called once — round elements are layered on top each round.
     */
    drawBackground() {
        // Warm parchment gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xf5e6c8, 0xf5e6c8, 0xe8d5a3, 0xe8d5a3, 1);
        bg.fillRect(0, 0, 960, 540);

        // Subtle horizontal texture lines across the full background
        bg.lineStyle(1, 0xc8a96e, 0.15);
        for (let y = 0; y < 540; y += 6) {
            bg.beginPath();
            bg.moveTo(0, y);
            bg.lineTo(960, y);
            bg.strokePath();
        }

        const pageMargin = 40;
        const pageWidth = 420;
        const pageHeight = 440;
        const pageY = 50;

        // --- Left page (memorization area) ---
        const leftPage = this.add.graphics();
        leftPage.fillStyle(0xfdf3dc, 1);
        leftPage.fillRoundedRect(pageMargin, pageY, pageWidth, pageHeight, 6);
        leftPage.lineStyle(2, 0xb8975a, 0.8);
        leftPage.strokeRoundedRect(pageMargin, pageY, pageWidth, pageHeight, 6);

        // Red margin line
        leftPage.lineStyle(1, 0xe8a0a0, 0.7);
        leftPage.beginPath();
        leftPage.moveTo(pageMargin + 60, pageY + 10);
        leftPage.lineTo(pageMargin + 60, pageY + pageHeight - 10);
        leftPage.strokePath();

        // Horizontal ruled lines
        leftPage.lineStyle(1, 0xb8c8e8, 0.5);
        for (let ly = pageY + 40; ly < pageY + pageHeight - 20; ly += 24) {
            leftPage.beginPath();
            leftPage.moveTo(pageMargin + 10, ly);
            leftPage.lineTo(pageMargin + pageWidth - 10, ly);
            leftPage.strokePath();
        }

        // --- Right page (drop zone area) ---
        const rightPageX = 960 - pageMargin - pageWidth;
        const rightPage = this.add.graphics();
        rightPage.fillStyle(0xfdf3dc, 1);
        rightPage.fillRoundedRect(rightPageX, pageY, pageWidth, pageHeight, 6);
        rightPage.lineStyle(2, 0xb8975a, 0.8);
        rightPage.strokeRoundedRect(rightPageX, pageY, pageWidth, pageHeight, 6);

        // Red margin line
        rightPage.lineStyle(1, 0xe8a0a0, 0.7);
        rightPage.beginPath();
        rightPage.moveTo(rightPageX + 60, pageY + 10);
        rightPage.lineTo(rightPageX + 60, pageY + pageHeight - 10);
        rightPage.strokePath();

        // Horizontal ruled lines
        rightPage.lineStyle(1, 0xb8c8e8, 0.5);
        for (let ly = pageY + 40; ly < pageY + pageHeight - 20; ly += 24) {
            rightPage.beginPath();
            rightPage.moveTo(rightPageX + 10, ly);
            rightPage.lineTo(rightPageX + pageWidth - 10, ly);
            rightPage.strokePath();
        }

        // --- Centre spine (divides left and right pages) ---
        const spine = this.add.graphics();
        spine.fillRect(475, pageY, 10, pageHeight);
        spine.lineStyle(2, 0x8b6914, 0.6);
        spine.beginPath();
        spine.moveTo(475, pageY);
        spine.lineTo(475, pageY + pageHeight);
        spine.strokePath();
        spine.beginPath();
        spine.moveTo(485, pageY);
        spine.lineTo(485, pageY + pageHeight);
        spine.strokePath();
    }

    /**
     * startRound
     * 
     * Clears all game objects from the previous round, then sets up the current
     * round by generating a new shuffled card order and displaying the memorization
     * cards on the left page. Uses Phaser's Timer (delayedCall) to hide the cards
     * after the memorization window and transition to the drag phase.
     */
    startRound() {
        // Destroy all game objects from the previous round
        if (this.roundElements) {
            this.roundElements.forEach(e => e.destroy());
        }
        this.roundElements = [];

        const config = this.roundConfigs[this.currentRound];
        const cardCount = config.cardCount;

        // Generate a shuffled array of numbers (e.g. [3, 1, 2] for 3 cards)
        this.originalOrder = Phaser.Utils.Array.Shuffle(
            Array.from({ length: cardCount }, (_, i) => i + 1)
        );

        // Round counter label
        const roundLabel = this.add.text(480, 18,
            `Round ${this.currentRound + 1} of 3`, {
            font: 'bold 18px Georgia',
            fill: '#5a3e1b'
        }).setOrigin(0.5);
        this.roundElements.push(roundLabel);

        // Instruction prompt shown during memorization phase
        this.instructionText = this.add.text(250, 68,
            `Memorize this order! (${config.memorizeTime / 1000}s)`, {
            font: 'italic 16px Georgia',
            fill: '#5a3e1b'
        }).setOrigin(0.5);
        this.roundElements.push(this.instructionText);

        // Show the cards to memorize on the left page
        this.showMemorizeCards(cardCount);

        // After the memorization window, hide cards and begin the drag phase
        this.time.delayedCall(config.memorizeTime, () => {
            this.memCards.forEach(c => c.forEach(e => e.destroy()));
            this.instructionText.setText("Arrange the cards in order!");
            this.createDraggableCards(cardCount);
        });
    }

    /**
     * showMemorizeCards
     * 
     * Renders the sequence of numbered index cards on the left page
     * in a grid layout during the memorization phase.
     * Cards are arranged in rows of up to 4 columns.
     * 
     * @param {number} cardCount - Number of cards to display this round
     */
    showMemorizeCards(cardCount) {
        this.memCards = [];
        const startX = 80;
        const startY = 160;
        const cardW = 54;
        const cardH = 72;
        const cols = Math.min(cardCount, 4);
        const hGap = (340 / cols);

        for (let i = 0; i < cardCount; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx = startX + col * hGap + hGap / 2;
            const cy = startY + row * 100;

            const elements = this.drawIndexCard(cx, cy, cardW, cardH, `${this.originalOrder[i]}`);
            this.memCards.push(elements);
            elements.forEach(e => this.roundElements.push(e));
        }
    }

    /**
     * drawIndexCard
     * 
     * Draws a single styled index card using Phaser Graphics and returns
     * the graphics and text objects as an array for later destruction.
     * Cards have a shadow, body, blue header stripe, and ruled lines.
     * 
     * @param {number} cx - Center x position of the card
     * @param {number} cy - Center y position of the card
     * @param {number} w - Card width in pixels
     * @param {number} h - Card height in pixels
     * @param {string} label - Number displayed on the card
     * @returns {Array} [graphics, text] — the two Phaser objects making up the card
     */
    drawIndexCard(cx, cy, w, h, label) {
        const card = this.add.graphics();

        // Drop shadow
        card.fillStyle(0xb8975a, 0.3);
        card.fillRoundedRect(cx - w / 2 + 3, cy - h / 2 + 3, w, h, 4);

        // Card body
        card.fillStyle(0xfffef5, 1);
        card.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 4);
        card.lineStyle(1.5, 0xc8a96e, 1);
        card.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 4);

        // Blue header stripe (index card style)
        card.fillStyle(0x4a90c4, 0.25);
        card.fillRect(cx - w / 2 + 2, cy - h / 2 + 2, w - 4, 14);

        // Ruled lines on card body
        card.lineStyle(1, 0xb8c8e8, 0.6);
        for (let ly = cy - h / 2 + 22; ly < cy + h / 2 - 6; ly += 12) {
            card.beginPath();
            card.moveTo(cx - w / 2 + 6, ly);
            card.lineTo(cx + w / 2 - 6, ly);
            card.strokePath();
        }

        // Number label centered on the card
        const text = this.add.text(cx, cy + 4, label, {
            font: 'bold 20px Georgia',
            fill: '#3a2a0a'
        }).setOrigin(0.5);

        return [card, text];
    }

    /**
     * createDraggableCards
     * 
     * Sets up the drag phase of the round. Creates:
     *   - Drop zones on the right page (numbered target slots)
     *   - Draggable cards on the left page (shuffled from the original order)
     * 
     * Each draggable card uses an invisible Rectangle as a hit area layered
     * over the visual card. Drag events move both the hit area and its
     * associated graphics/text in sync. Cards snap to the nearest drop zone
     * within a threshold distance, or return to their origin if no zone is close.
     * 
     * If a drop zone is already occupied, the existing card is swapped back
     * to the dragged card's previous zone.
     * 
     * @param {number} cardCount - Number of cards to create for this round
     */
    createDraggableCards(cardCount) {
        this.draggableCards = [];
        this.dropZones = [];
        this.dropZoneGraphics = [];

        const cardW = 54;
        const cardH = 72;
        const rightPageX = 500;
        const rightPageW = 420;
        const cols = Math.min(cardCount, 4);
        const hGap = rightPageW / cols;

        // Instruction label above the drop zone area
        const dropLabel = this.add.text(710, 68, "Drop zone", {
            font: 'italic 16px Georgia',
            fill: '#5a3e1b'
        }).setOrigin(0.5);
        this.roundElements.push(dropLabel);

        // --- Create drop zones on the right page ---
        for (let i = 0; i < cardCount; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const zx = rightPageX + col * hGap + hGap / 2;
            const zy = 160 + row * 100;

            // Zone outline and fill
            const zoneGfx = this.add.graphics();
            zoneGfx.lineStyle(2, 0xb8975a, 0.8);
            zoneGfx.strokeRoundedRect(zx - cardW / 2, zy - cardH / 2, cardW, cardH, 4);
            zoneGfx.fillStyle(0xe8d5a3, 0.4);
            zoneGfx.fillRoundedRect(zx - cardW / 2, zy - cardH / 2, cardW, cardH, 4);

            // Zone position number label
            const zLabel = this.add.text(zx, zy - cardH / 2 + 8, `${i + 1}`, {
                font: '11px Georgia',
                fill: '#9a7a3a'
            }).setOrigin(0.5);

            this.roundElements.push(zoneGfx);
            this.roundElements.push(zLabel);
            this.dropZoneGraphics.push(zoneGfx);

            // Store zone data including its current occupant (null = empty)
            this.dropZones.push({ x: zx, y: zy, index: i, gfx: zoneGfx, occupied: null });
        }

        // --- Create draggable cards on the left page ---
        // Shuffle the order so they don't appear in the memorized sequence
        const shuffled = Phaser.Utils.Array.Shuffle([...this.originalOrder]);
        const srcCols = Math.min(cardCount, 4);
        const srcHGap = 340 / srcCols;

        for (let i = 0; i < cardCount; i++) {
            const col = i % srcCols;
            const row = Math.floor(i / srcCols);
            const cx = 80 + col * srcHGap + srcHGap / 2;
            const cy = 160 + row * 100;

            // Invisible rectangle is the actual draggable hit area
            const hitArea = this.add.rectangle(cx, cy, cardW, cardH, 0x000000, 0)
                .setInteractive({ draggable: true });

            // Draw the visual card beneath the hit area
            const cardElements = this.drawIndexCard(cx, cy, cardW, cardH, `${shuffled[i]}`);
            cardElements.forEach(e => this.roundElements.push(e));
            this.roundElements.push(hitArea);

            let cardGfx = cardElements[0];
            let cardText = cardElements[1];

            // Store the card's number value and current drop zone on the hit area
            hitArea.setData('number', shuffled[i]);
            hitArea.setData('droppedZone', null);

            // --- Drag event: move card and graphics, highlight nearest zone ---
            hitArea.on('drag', (pointer, dragX, dragY) => {
                // Move hit area and visual elements together
                hitArea.x = dragX; hitArea.y = dragY;
                cardGfx.x = dragX - cx; cardGfx.y = dragY - cy;
                cardText.x = dragX; cardText.y = dragY + 4;

                // Reset all drop zone highlights
                this.dropZones.forEach(z => {
                    z.gfx.clear();
                    z.gfx.fillStyle(0xe8d5a3, 0.4);
                    z.gfx.fillRoundedRect(z.x - cardW / 2, z.y - cardH / 2, cardW, cardH, 4);
                    z.gfx.lineStyle(2, 0xb8975a, 0.8);
                    z.gfx.strokeRoundedRect(z.x - cardW / 2, z.y - cardH / 2, cardW, cardH, 4);
                });

                // Highlight the nearest zone if within snapping threshold
                let nearest = this.getNearestZone(dragX, dragY, 60);
                if (nearest) {
                    nearest.gfx.clear();
                    nearest.gfx.fillStyle(0xd4a843, 0.5);
                    nearest.gfx.fillRoundedRect(nearest.x - cardW / 2, nearest.y - cardH / 2, cardW, cardH, 4);
                    nearest.gfx.lineStyle(2, 0xd4a843, 1);
                    nearest.gfx.strokeRoundedRect(nearest.x - cardW / 2, nearest.y - cardH / 2, cardW, cardH, 4);
                }
            });

            // --- Drag end event: snap to zone or return to origin ---
            hitArea.on('dragend', () => {
                const nearest = this.getNearestZone(hitArea.x, hitArea.y, 60);
                const prevZone = hitArea.getData('droppedZone');

                // Free the previously occupied zone
                if (prevZone !== null) {
                    this.dropZones[prevZone].occupied = null;
                }

                if (nearest) {
                    // If zone is occupied, swap the existing card back to this card's origin
                    if (nearest.occupied !== null) {
                        const other = nearest.occupied;
                        if (prevZone !== null) {
                            const prevZ = this.dropZones[prevZone];
                            other.x = prevZ.x; other.y = prevZ.y;
                            other.getData('gfx').x = prevZ.x - other.getData('originX');
                            other.getData('gfx').y = prevZ.y - other.getData('originY');
                            other.getData('txt').x = prevZ.x;
                            other.getData('txt').y = prevZ.y + 4;
                            other.setData('droppedZone', prevZone);
                            this.dropZones[prevZone].occupied = other;
                        } else {
                            other.setData('droppedZone', null);
                        }
                    }

                    // Snap this card to the target zone
                    hitArea.x = nearest.x; hitArea.y = nearest.y;
                    cardGfx.x = nearest.x - cx; cardGfx.y = nearest.y - cy;
                    cardText.x = nearest.x; cardText.y = nearest.y + 4;
                    hitArea.setData('droppedZone', nearest.index);
                    nearest.occupied = hitArea;

                    // Play click sound on successful snap
                    this.sound.play('click', { volume: 0.5 });

                    // Restore the zone's default appearance
                    nearest.gfx.clear();
                    nearest.gfx.fillStyle(0xe8d5a3, 0.4);
                    nearest.gfx.fillRoundedRect(nearest.x - cardW / 2, nearest.y - cardH / 2, cardW, cardH, 4);
                    nearest.gfx.lineStyle(2, 0xb8975a, 0.8);
                    nearest.gfx.strokeRoundedRect(nearest.x - cardW / 2, nearest.y - cardH / 2, cardW, cardH, 4);
                } else {
                    // No zone in range — snap the card back to its starting position
                    hitArea.x = cx; hitArea.y = cy;
                    cardGfx.x = 0; cardGfx.y = 0;
                    cardText.x = cx; cardText.y = cy + 4;
                    hitArea.setData('droppedZone', null);
                }
            });

            // Store references on the hit area for use during swap logic
            hitArea.setData('gfx', cardGfx);
            hitArea.setData('txt', cardText);
            hitArea.setData('originX', cx);
            hitArea.setData('originY', cy);

            this.draggableCards.push(hitArea);
        }

        // --- Submit button ---
        const submitGfx = this.add.graphics();
        submitGfx.fillStyle(0x5a3e1b, 1);
        submitGfx.fillRoundedRect(390, 488, 180, 36, 8);

        const submitText = this.add.text(480, 506, "Submit Order", {
            font: 'bold 16px Georgia',
            fill: '#fdf3dc'
        }).setOrigin(0.5);

        const submitHit = this.add.rectangle(480, 506, 180, 36, 0x000000, 0)
            .setInteractive()
            .on('pointerover', () => { submitGfx.clear(); submitGfx.fillStyle(0x7a5e2b, 1); submitGfx.fillRoundedRect(390, 488, 180, 36, 8); })
            .on('pointerout',  () => { submitGfx.clear(); submitGfx.fillStyle(0x5a3e1b, 1); submitGfx.fillRoundedRect(390, 488, 180, 36, 8); })
            .on('pointerdown', () => this.checkOrder());

        this.roundElements.push(submitGfx, submitText, submitHit);

        // SPACE bar also submits the current order
        this.input.keyboard.once('keydown-SPACE', () => this.checkOrder());
    }

    /**
     * getNearestZone
     * 
     * Finds the closest drop zone to a given point within a distance threshold.
     * Used during drag and dragend events to determine snap targets.
     * 
     * @param {number} x - X coordinate to check from
     * @param {number} y - Y coordinate to check from
     * @param {number} threshold - Maximum distance in pixels to consider
     * @returns {object|null} The nearest drop zone object, or null if none in range
     */
    getNearestZone(x, y, threshold) {
        let nearest = null;
        let minDist = threshold;
        this.dropZones.forEach(z => {
            const dist = Phaser.Math.Distance.Between(x, y, z.x, z.y);
            if (dist < minDist) { nearest = z; minDist = dist; }
        });
        return nearest;
    }

    /**
     * checkOrder
     * 
     * Evaluates the player's submitted card arrangement against the original order.
     * Each drop zone is checked — correct placements flash green, incorrect flash red.
     * Plays a chime sound if the entire round was answered perfectly.
     * 
     * After a short delay, advances to the next round or ends the game.
     * Uses Phaser's Timer (delayedCall) to pause before transitioning.
     */
    checkOrder() {
        const cardCount = this.roundConfigs[this.currentRound].cardCount;
        let roundCorrect = 0;

        this.dropZones.forEach((zone, i) => {
            const card = zone.occupied;
            const correct = card && card.getData('number') === this.originalOrder[i];
            if (correct) roundCorrect++;

            // Flash green for correct, red for incorrect
            zone.gfx.clear();
            zone.gfx.fillStyle(correct ? 0x5cb85c : 0xd9534f, 0.6);
            zone.gfx.fillRoundedRect(zone.x - 27, zone.y - 36, 54, 72, 4);
            zone.gfx.lineStyle(2, correct ? 0x3a7a3a : 0x9a2a2a, 1);
            zone.gfx.strokeRoundedRect(zone.x - 27, zone.y - 36, 54, 72, 4);
        });

        // Play chime for a perfect round
        if (roundCorrect === cardCount) {
            this.sound.play('chime', { volume: 0.6 });
        }

        // Accumulate totals for final accuracy calculation
        this.totalCorrect += roundCorrect;
        this.totalCards += cardCount;

        // Wait briefly so the player can see the feedback, then advance
        this.time.delayedCall(1200, () => {
            this.currentRound++;
            if (this.currentRound < 3) {
                this.startRound();
            } else {
                this.endGame();
            }
        });
    }

    /**
     * endGame
     * 
     * Called after all three rounds are complete. Calculates the player's
     * overall accuracy, assigns a letter grade, saves it to the global
     * GradeSystem, and transitions to CompletionScene with the accuracy value.
     * 
     * Grading scale:
     *   90%+ = A | 70%+ = B | 50%+ = C | below 50% = F
     */
    endGame() {
        // Clean up the last round's elements
        if (this.roundElements) {
            this.roundElements.forEach(e => e.destroy());
        }

        // Calculate accuracy as a 0-1 float
        const accuracy = this.totalCorrect / this.totalCards;

        let grade;
        if      (accuracy >= 0.9) grade = 'A';
        else if (accuracy >= 0.7) grade = 'B';
        else if (accuracy >= 0.5) grade = 'C';
        else                      grade = 'F';

        // Save the grade globally so CompletionScene and LectureHallScene can read it
        window.gradeSystem.setGrade('journal', grade);

        // Pass accuracy as a rounded percentage to the CompletionScene report card
        this.scene.start('CompletionScene', { accuracy: Math.round(accuracy * 100) });
    }
}

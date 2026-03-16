class JournalScene extends Phaser.Scene {
    constructor() {
        super("JournalScene");
    }
    create() {
        this.currentRound = 0;
        this.totalCorrect = 0;
        this.totalCards = 0;
        this.roundConfigs = [
            { cardCount: 3, memorizeTime: 3000 },
            { cardCount: 5, memorizeTime: 2500 },
            { cardCount: 7, memorizeTime: 2000 },
        ];
        this.drawBackground();
        this.startRound();
    }
    drawBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xf5e6c8, 0xf5e6c8, 0xe8d5a3, 0xe8d5a3, 1);
        bg.fillRect(0, 0, 960, 540);
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
        const leftPage = this.add.graphics();
        leftPage.fillStyle(0xfdf3dc, 1);
        leftPage.fillRoundedRect(pageMargin, pageY, pageWidth, pageHeight, 6);
        leftPage.lineStyle(2, 0xb8975a, 0.8);
        leftPage.strokeRoundedRect(pageMargin, pageY, pageWidth, pageHeight, 6);
        leftPage.lineStyle(1, 0xe8a0a0, 0.7);
        leftPage.beginPath();
        leftPage.moveTo(pageMargin + 60, pageY + 10);
        leftPage.lineTo(pageMargin + 60, pageY + pageHeight - 10);
        leftPage.strokePath();
        leftPage.lineStyle(1, 0xb8c8e8, 0.5);
        for (let ly = pageY + 40; ly < pageY + pageHeight - 20; ly += 24) {
            leftPage.beginPath();
            leftPage.moveTo(pageMargin + 10, ly);
            leftPage.lineTo(pageMargin + pageWidth - 10, ly);
            leftPage.strokePath();
        }
        const rightPageX = 960 - pageMargin - pageWidth;
        const rightPage = this.add.graphics();
        rightPage.fillStyle(0xfdf3dc, 1);
        rightPage.fillRoundedRect(rightPageX, pageY, pageWidth, pageHeight, 6);
        rightPage.lineStyle(2, 0xb8975a, 0.8);
        rightPage.strokeRoundedRect(rightPageX, pageY, pageWidth, pageHeight, 6);
        rightPage.lineStyle(1, 0xe8a0a0, 0.7);
        rightPage.beginPath();
        rightPage.moveTo(rightPageX + 60, pageY + 10);
        rightPage.lineTo(rightPageX + 60, pageY + pageHeight - 10);
        rightPage.strokePath();
        rightPage.lineStyle(1, 0xb8c8e8, 0.5);
        for (let ly = pageY + 40; ly < pageY + pageHeight - 20; ly += 24) {
            rightPage.beginPath();
            rightPage.moveTo(rightPageX + 10, ly);
            rightPage.lineTo(rightPageX + pageWidth - 10, ly);
            rightPage.strokePath();
        }
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
    startRound() {
        if (this.roundElements) {
            this.roundElements.forEach(e => e.destroy());
        }
        this.roundElements = [];
        const config = this.roundConfigs[this.currentRound];
        const cardCount = config.cardCount;
        this.originalOrder = Phaser.Utils.Array.Shuffle(
            Array.from({ length: cardCount }, (_, i) => i + 1)
        );
        const roundLabel = this.add.text(480, 18,
            `Round ${this.currentRound + 1} of 3`, {
            font: 'bold 18px Georgia',
            fill: '#5a3e1b'
        }).setOrigin(0.5);
        this.roundElements.push(roundLabel);
        this.instructionText = this.add.text(250, 68,
            `Memorize this order! (${config.memorizeTime / 1000}s)`, {
            font: 'italic 16px Georgia',
            fill: '#5a3e1b'
        }).setOrigin(0.5);
        this.roundElements.push(this.instructionText);
        this.showMemorizeCards(cardCount);
        this.time.delayedCall(config.memorizeTime, () => {
            this.memCards.forEach(c => c.forEach(e => e.destroy()));
            this.instructionText.setText("Arrange the cards in order!");
            this.createDraggableCards(cardCount);
        });
    }
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
    drawIndexCard(cx, cy, w, h, label) {
        const card = this.add.graphics();
        card.fillStyle(0xb8975a, 0.3);
        card.fillRoundedRect(cx - w / 2 + 3, cy - h / 2 + 3, w, h, 4);
        card.fillStyle(0xfffef5, 1);
        card.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 4);
        card.lineStyle(1.5, 0xc8a96e, 1);
        card.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 4);
        card.fillStyle(0x4a90c4, 0.25);
        card.fillRect(cx - w / 2 + 2, cy - h / 2 + 2, w - 4, 14);
        card.lineStyle(1, 0xb8c8e8, 0.6);
        for (let ly = cy - h / 2 + 22; ly < cy + h / 2 - 6; ly += 12) {
            card.beginPath();
            card.moveTo(cx - w / 2 + 6, ly);
            card.lineTo(cx + w / 2 - 6, ly);
            card.strokePath();
        }
        const text = this.add.text(cx, cy + 4, label, {
            font: 'bold 20px Georgia',
            fill: '#3a2a0a'
        }).setOrigin(0.5);
        return [card, text];
    }
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
        const dropLabel = this.add.text(710, 68, "Drop zone", {
            font: 'italic 16px Georgia',
            fill: '#5a3e1b'
        }).setOrigin(0.5);
        this.roundElements.push(dropLabel);
        for (let i = 0; i < cardCount; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const zx = rightPageX + col * hGap + hGap / 2;
            const zy = 160 + row * 100;
            const zoneGfx = this.add.graphics();
            zoneGfx.lineStyle(2, 0xb8975a, 0.8);
            zoneGfx.strokeRoundedRect(zx - cardW / 2, zy - cardH / 2, cardW, cardH, 4);
            zoneGfx.fillStyle(0xe8d5a3, 0.4);
            zoneGfx.fillRoundedRect(zx - cardW / 2, zy - cardH / 2, cardW, cardH, 4);
            const zLabel = this.add.text(zx, zy - cardH / 2 + 8, `${i + 1}`, {
                font: '11px Georgia',
                fill: '#9a7a3a'
            }).setOrigin(0.5);
            this.roundElements.push(zoneGfx);
            this.roundElements.push(zLabel);
            this.dropZoneGraphics.push(zoneGfx);
            this.dropZones.push({ x: zx, y: zy, index: i, gfx: zoneGfx, occupied: null });
        }
        const shuffled = Phaser.Utils.Array.Shuffle([...this.originalOrder]);
        const srcCols = Math.min(cardCount, 4);
        const srcHGap = 340 / srcCols;
        for (let i = 0; i < cardCount; i++) {
            const col = i % srcCols;
            const row = Math.floor(i / srcCols);
            const cx = 80 + col * srcHGap + srcHGap / 2;
            const cy = 160 + row * 100;
            const hitArea = this.add.rectangle(cx, cy, cardW, cardH, 0x000000, 0)
                .setInteractive({ draggable: true });
            const cardElements = this.drawIndexCard(cx, cy, cardW, cardH, `${shuffled[i]}`);
            cardElements.forEach(e => this.roundElements.push(e));
            this.roundElements.push(hitArea);
            let cardGfx = cardElements[0];
            let cardText = cardElements[1];
            hitArea.setData('number', shuffled[i]);
            hitArea.setData('droppedZone', null);
            hitArea.on('drag', (pointer, dragX, dragY) => {
                hitArea.x = dragX; hitArea.y = dragY;
                cardGfx.x = dragX - cx; cardGfx.y = dragY - cy;
                cardText.x = dragX; cardText.y = dragY + 4;
                this.dropZones.forEach(z => {
                    z.gfx.clear();
                    z.gfx.fillStyle(0xe8d5a3, 0.4);
                    z.gfx.fillRoundedRect(z.x - cardW / 2, z.y - cardH / 2, cardW, cardH, 4);
                    z.gfx.lineStyle(2, 0xb8975a, 0.8);
                    z.gfx.strokeRoundedRect(z.x - cardW / 2, z.y - cardH / 2, cardW, cardH, 4);
                });
                let nearest = this.getNearestZone(dragX, dragY, 60);
                if (nearest) {
                    nearest.gfx.clear();
                    nearest.gfx.fillStyle(0xd4a843, 0.5);
                    nearest.gfx.fillRoundedRect(nearest.x - cardW / 2, nearest.y - cardH / 2, cardW, cardH, 4);
                    nearest.gfx.lineStyle(2, 0xd4a843, 1);
                    nearest.gfx.strokeRoundedRect(nearest.x - cardW / 2, nearest.y - cardH / 2, cardW, cardH, 4);
                }
            });
            hitArea.on('dragend', () => {
                const nearest = this.getNearestZone(hitArea.x, hitArea.y, 60);
                const prevZone = hitArea.getData('droppedZone');
                if (prevZone !== null) {
                    this.dropZones[prevZone].occupied = null;
                }
                if (nearest) {
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
                    hitArea.x = nearest.x; hitArea.y = nearest.y;
                    cardGfx.x = nearest.x - cx; cardGfx.y = nearest.y - cy;
                    cardText.x = nearest.x; cardText.y = nearest.y + 4;
                    hitArea.setData('droppedZone', nearest.index);
                    nearest.occupied = hitArea;
                    nearest.gfx.clear();
                    nearest.gfx.fillStyle(0xe8d5a3, 0.4);
                    nearest.gfx.fillRoundedRect(nearest.x - cardW / 2, nearest.y - cardH / 2, cardW, cardH, 4);
                    nearest.gfx.lineStyle(2, 0xb8975a, 0.8);
                    nearest.gfx.strokeRoundedRect(nearest.x - cardW / 2, nearest.y - cardH / 2, cardW, cardH, 4);
                } else {
                    hitArea.x = cx; hitArea.y = cy;
                    cardGfx.x = 0; cardGfx.y = 0;
                    cardText.x = cx; cardText.y = cy + 4;
                    hitArea.setData('droppedZone', null);
                }
            });
            hitArea.setData('gfx', cardGfx);
            hitArea.setData('txt', cardText);
            hitArea.setData('originX', cx);
            hitArea.setData('originY', cy);
            this.draggableCards.push(hitArea);
        }
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
        this.input.keyboard.once('keydown-SPACE', () => this.checkOrder());
    }
    getNearestZone(x, y, threshold) {
        let nearest = null;
        let minDist = threshold;
        this.dropZones.forEach(z => {
            const dist = Phaser.Math.Distance.Between(x, y, z.x, z.y);
            if (dist < minDist) { nearest = z; minDist = dist; }
        });
        return nearest;
    }
    checkOrder() {
        const cardCount = this.roundConfigs[this.currentRound].cardCount;
        let roundCorrect = 0;
        this.dropZones.forEach((zone, i) => {
            const card = zone.occupied;
            const correct = card && card.getData('number') === this.originalOrder[i];
            if (correct) roundCorrect++;
            zone.gfx.clear();
            zone.gfx.fillStyle(correct ? 0x5cb85c : 0xd9534f, 0.6);
            zone.gfx.fillRoundedRect(zone.x - 27, zone.y - 36, 54, 72, 4);
            zone.gfx.lineStyle(2, correct ? 0x3a7a3a : 0x9a2a2a, 1);
            zone.gfx.strokeRoundedRect(zone.x - 27, zone.y - 36, 54, 72, 4);
        });
        this.totalCorrect += roundCorrect;
        this.totalCards += cardCount;
        this.time.delayedCall(1200, () => {
            this.currentRound++;
            if (this.currentRound < 3) {
                this.startRound();
            } else {
                this.endGame();
            }
        });
    }
    endGame() {
        if (this.roundElements) {
            this.roundElements.forEach(e => e.destroy());
        }
        const accuracy = this.totalCorrect / this.totalCards;
        let grade;
        if      (accuracy >= 0.9) grade = 'A';
        else if (accuracy >= 0.7) grade = 'B';
        else if (accuracy >= 0.5) grade = 'C';
        else                      grade = 'F';
        window.gradeSystem.setGrade('journal', grade);
        this.scene.start('CompletionScene', { accuracy: Math.round(accuracy * 100) });
    }
}

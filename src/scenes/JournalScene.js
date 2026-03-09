class JournalScene extends Phaser.Scene {
    constructor() {
        super("JournalScene");
    }

    create() {
        // Display original order text
        this.instructionText = this.add.text(480, 50, "Memorize this order!", { font: '20px Arial', fill: '#fff' }).setOrigin(0.5);

        // Original order cards
        this.originalOrder = [1, 2, 3];
        this.cardPositions = [
            { x: 300, y: 200 },
            { x: 400, y: 200 },
            { x: 500, y: 200 }
        ];

        this.originalCards = [];
        for (let i = 0; i < 3; i++) {
            const rect = this.add.rectangle(this.cardPositions[i].x, this.cardPositions[i].y, 50, 50, 0xffffff);
            const text = this.add.text(this.cardPositions[i].x, this.cardPositions[i].y, this.originalOrder[i], { font: '24px Arial', fill: '#000' }).setOrigin(0.5);
            this.originalCards.push({ rect, text });
        }

        // After 2s, hide original cards and update instruction
        this.time.delayedCall(2000, () => {
            this.originalCards.forEach(c => { c.rect.destroy(); c.text.destroy(); });
            this.instructionText.setText("Arrange the cards in the same order!").setY(50);
            this.createDraggableCards();
        });
    }

    createDraggableCards() {
        this.draggableCards = [];
        this.dropZones = [];

        const dropX = [300, 400, 500];
        const dropY = 400;

        // Drop zones
        for (let i = 0; i < 3; i++) {
            const zone = this.add.rectangle(dropX[i], dropY, 50, 50, 0x888888).setStrokeStyle(2, 0xffffff);
            zone.setData('index', i);
            this.dropZones.push(zone);
        }

        // Shuffle cards
        const shuffled = Phaser.Utils.Array.Shuffle([1,2,3]);
        for (let i = 0; i < 3; i++) {
            const card = this.add.rectangle(200 + i * 100, 300, 50, 50, 0xffffff).setStrokeStyle(2, 0x000000);
            const text = this.add.text(card.x, card.y, shuffled[i], { font: '24px Arial', fill: '#000' }).setOrigin(0.5);

            card.setData('number', shuffled[i]);
            card.setInteractive({ draggable: true });
            this.input.setDraggable(card);

            card.on('drag', (pointer, dragX, dragY) => {
                card.x = dragX; card.y = dragY;
                text.x = dragX; text.y = dragY;

                // Highlight nearest drop zone
                let nearest = null;
                let minDist = 100;
                this.dropZones.forEach(zone=>{
                    const dist = Phaser.Math.Distance.Between(card.x, card.y, zone.x, zone.y);
                    if(dist < minDist){ nearest = zone; minDist = dist; }
                });
                this.dropZones.forEach(z=>z.setFillStyle(0x888888));
                if(nearest) nearest.setFillStyle(0xaaaa00);
            });

            card.on('dragend', ()=>{
                let nearest = null;
                let minDist = 100;
                this.dropZones.forEach(zone=>{
                    const dist = Phaser.Math.Distance.Between(card.x, card.y, zone.x, zone.y);
                    if(dist < minDist){ nearest = zone; minDist = dist; }
                });
                if(nearest){
                    card.x = nearest.x; card.y = nearest.y;
                    text.x = nearest.x; text.y = nearest.y;
                    card.setData('droppedIndex', nearest.getData('index'));
                } else {
                    card.setData('droppedIndex', undefined);
                }
                this.dropZones.forEach(z=>z.setFillStyle(0x888888));
            });

            this.draggableCards.push({rect: card, text: text});
        }

        this.add.text(480, 500, "Press SPACE to submit", { font:'16px Arial', fill:'#fff' }).setOrigin(0.5);
        this.input.keyboard.once('keydown-SPACE', ()=>this.checkOrder());
    }

    checkOrder(){
        let success = true;
        this.draggableCards.forEach(c=>{
            const idx = c.rect.getData('droppedIndex');
            if(idx===undefined || c.rect.getData('number')!==this.originalOrder[idx]){
                success = false;
            }
        });

        // Color drop zones green/red for feedback
        this.dropZones.forEach((zone,i)=>{
            const card = this.draggableCards.find(c=>c.rect.getData('droppedIndex')===i);
            if(card){
                zone.setFillStyle(card.rect.getData('number')===this.originalOrder[i]?0x00ff00:0xff0000);
            } else zone.setFillStyle(0xff0000);
        });

        const grade = success?'A+':'F';
        window.gradeSystem.setGrade('journal', grade);

        this.time.delayedCall(1000, ()=>this.scene.start('CompletionScene'));
    }
}

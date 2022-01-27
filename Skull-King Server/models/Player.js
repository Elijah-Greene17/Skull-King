const Box = require('./Box');

class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.score = 0;
        this.boxes = [];
    }

    addBox(box) {
        this.boxes.push(box);
    }

    modifyBid(bidIncrement, round) {
        this.boxes[round - 1].modifyBid(bidIncrement);
    }
}

module.exports = Player;

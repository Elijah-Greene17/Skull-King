const Box = require('./Box');

class Player {
    constructor(name){
        this.name = name;
        this.score = 0;
        this.boxes = [];
    }

    addBox(box){
        this.boxes.push(box);
    }
}

module.exports = Player;

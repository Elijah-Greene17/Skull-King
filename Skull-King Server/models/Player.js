const Box = require('./Box');

class Player {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.score = 0;
        this.boxes = [];
    }

    addBox(box){
        this.boxes.push(box);
    }
    
}

module.exports = Player;

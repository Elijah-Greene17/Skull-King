const Box = require('./Box');

class Player {
    constructor(name){
        this.name = name;
        this.score = 0;
        this.boxes = [];
    }
}

module.exports = Player;

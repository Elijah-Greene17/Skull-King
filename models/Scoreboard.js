const Box = require('./Box');

class ScoreBoard {
    constructor(players){
        this.players = players;
        this.roundCount = 10;

        for (var i = 0; i < this.roundCount; i++){
            players.forEach(player => {
                player.addBox(new Box(i))
            });
        }
    }

}

module.exports = ScoreBoard
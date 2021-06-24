const Player = require('./Player');

class Session {

    constructor(id){
        this.id = id
        this.players = [];
    }

    addPlayer(player){
        this.players.push(player);
        console.log("Player added!");
        console.log(this.players)
    }

}

module.exports = Session;
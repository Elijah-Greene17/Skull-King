const Scoreboard = require('./Scoreboard');

class Session {

    constructor(id){
        this.id = id
        this.players = [];
        this.scoreboard = null;
        this.isOpen = true;
    }

    addPlayer(player){
        this.players.push(player);
        console.log("Player added!");
        console.log(this.players);
    }

    startGame(){
        this.scoreboard = new Scoreboard(this.players);
        console.log(this.scoreboard);
        this.isOpen = false;
    }

}

module.exports = Session;
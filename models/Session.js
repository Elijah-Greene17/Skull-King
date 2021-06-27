const Scoreboard = require('./Scoreboard');
const Player = require('./Player');

class Session {

    constructor(id){
        this.id = id;
        this.idTracker = 0;
        this.players = [];
        this.scoreboard = null;
        this.isOpen = true;
        this.currentRound = 0;
    }

    addPlayer(name){
        const player = new Player(this.idTracker++, name)
        this.players.push(player);

        console.log("Player added!");
        console.log(this.players);
    }

    startGame(){
        this.scoreboard = new Scoreboard(this.players);
        this.currentRound++;
        console.log(this.scoreboard);
        this.isOpen = false;
    }

    convertToJson(){
        var json = {
            "id": this.id,
            "players": this.players,
            "scoreBoard": this.scoreboard,
            "currentRound": this.currentRound,
            "isOpen": this.isOpen
        }
        return json;
    }

    getPlayer(playerId){
        var rightPlayer = null
        this.players.forEach(player => {
            console.log("EG 1: " + player.id + " EG 2: " + playerId);
            if (player.id == playerId){
                console.log("EG 3: " + "Yup " + player.id + player.name + player.score);
                rightPlayer = player;
            } 
        });
        return rightPlayer;
    }
    
    setBid(playerId, bid){
        var player = this.getPlayer(playerId);
        player.boxes[this.currentRound-1].bid = bid;
    }

    bidsAreIn(){
        var bidsAreIn = true;
        this.players.forEach(player => {
            if (player.boxes[this.currentRound-1].bid == null){
                bidsAreIn = false
            }
        });
        return bidsAreIn;
    }

    achievedBid(playerId, bonus){
        var player = this.getPlayer(playerId);
        var bid = player.boxes[this.currentRound-1].bid;
        var points = 0;
        if (bid == 0){
            points = this.currentRound * 10;
        } else {
            points = bid * 20;
        }
        player.boxes[this.currentRound-1].points += points + bonus;
    }

    failedBid(playerId, tricks){
        var player = this.getPlayer(playerId);
        var bid = player.boxes[this.currentRound-1].bid;
        var points = 0;
        if (bid == 0) {
            points = this.currentRound * -10;
        } else {
            points = Math.abs(bid-tricks) * -10;
        }
        player.boxes[this.currentRound-1].points += points;
    }

}

module.exports = Session;
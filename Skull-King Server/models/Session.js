const Scoreboard = require('./Scoreboard');
const Player = require('./Player');

class Session {
    constructor(id) {
        this.id = id;
        this.idTracker = 0;
        this.players = [];
        this.admin = null;
        this.scoreboard = null;
        this.isOpen = true;
        this.currentRound = 0;
    }

    addPlayer(name) {
        console.log('Add Player');
        const player = new Player(this.idTracker++, name);
        console.log(
            'Player ID: ' + player.id + ', Player Name: ' + player.name
        );
        this.players.push(player);
        if (this.players.length == 1) {
            this.admin = player.id;
        }

        console.log('Player added!');
        console.log(this.players);
        return player.id;
    }

    removePlayer(playerId) {
        this.players = this.players.filter((player) => player.id != playerId);
        this.admin = this.players[0].id;
    }

    startGame() {
        this.scoreboard = new Scoreboard(this.players);
        this.currentRound++;
        console.log(this.scoreboard);
        this.isOpen = false;
    }

    convertToJson() {
        var json = {
            id: this.id,
            players: this.players,
            admin: this.admin,
            scoreBoard: this.scoreboard,
            currentRound: this.currentRound,
            isOpen: this.isOpen,
        };
        return json;
    }

    getPlayer(playerId) {
        var rightPlayer = null;
        this.players.forEach((player) => {
            console.log('EG 1: ' + player.id + ' EG 2: ' + playerId);
            if (player.id == playerId) {
                console.log(
                    'EG 3: ' + 'Yup ' + player.id + player.name + player.score
                );
                rightPlayer = player;
            }
        });
        return rightPlayer;
    }

    setBid(playerId, bid) {
        var player = this.getPlayer(playerId);
        player.boxes[this.currentRound - 1].bid = bid;
    }

    bidsAreIn() {
        var bidsAreIn = true;
        this.players.forEach((player) => {
            if (player.boxes[this.currentRound - 1].bid == null) {
                bidsAreIn = false;
            }
        });
        return bidsAreIn;
    }

    modifyBid(playerId, bidIncrement) {
        const player = this.getPlayer(playerId);
        player.modifyBid(bidIncrement, this.currentRound);
    }

    achievedBid(playerId, bonus) {
        const player = this.getPlayer(playerId);
        const box = player.boxes[this.currentRound - 1];
        const bid = box.bid;
        var points = 0;
        if (bid == 0) {
            points = this.currentRound * 10;
        } else {
            points = bid * 20;
        }

        // Handle Rascal Wager
        if (box.wager != null) {
            points += box.wager;
        }

        box.points += points + bonus;
        player.score += points + bonus;
    }

    failedBid(playerId, tricks) {
        const player = this.getPlayer(playerId);
        const box = player.boxes[this.currentRound - 1];
        var bid = box.bid;
        var points = 0;
        if (bid == 0) {
            points = this.currentRound * -10;
        } else {
            points = Math.abs(bid - tricks) * -10;
        }

        // Handle Rascal Wager
        if (box.wager != null) {
            points -= box.wager;
        }

        box.points += points;
        player.score += points;
    }

    scoresAreCalculated() {
        var scoresAreCalculated = true;
        players.forEach((player) => {
            var points = player.boxes[this.currentRound - 1].points;
            if (points == 0) {
                scoresAreCalculated = false;
            }
        });
        return scoresAreCalculated;
    }
}

module.exports = Session;

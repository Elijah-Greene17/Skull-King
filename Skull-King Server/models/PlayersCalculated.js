class PlayersCalculated {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    clearPlayers() {
        this.players = [];
    }
}

module.exports = PlayersCalculated;

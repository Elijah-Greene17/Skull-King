class Box {
    constructor(roundNumber) {
        this.roundNumber = roundNumber;
        this.bid = null;
        this.points = 0;
        this.bonus = 0;
        this.wager = null;
    }

    modifyBid(bidIncrement) {
        this.bid = parseInt(this.bid) + parseInt(bidIncrement);
    }

    setWager(wager) {
        this.wager = wager;
    }
}

module.exports = Box;

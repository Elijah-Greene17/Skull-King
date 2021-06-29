class Box {
    constructor(roundNumber){
        this.roundNumber = roundNumber;
        this.bid = null;
        this.points = 0;
        this.bonus = 0;
    }

    modifyBid(bidIncrement){
        this.bid += bidIncrement;
    }
}

module.exports = Box;
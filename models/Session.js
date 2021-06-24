class Session {

    constructor(){
        this.id = '234567';
        this.players = [];
    }

    addPlayer(player){
        this.players.push(player);
        console.log("Player added!");
        console.log(this.players)
    }

}
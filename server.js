const express = require('express');
const app = express();
app.use(express.json())
const Lobby = require('./models/Lobby');
const Player = require('./models/Player');

var lobby = new Lobby('FamDamily');

// Ping Test
app.get('/', (req, res) => {
    console.log('Ping')
    res.send("Ping");
});

// Initiate new game
/**
 * param: id (Int)
 */
app.post('/newGame', (req, res) => {
    const name = req.body.name;
    const id = lobby.createSession();
    const session =  lobby.getSession(id);

    // TODO: Make not case sensitive
    if (name == 'Michaela') name = 'Hortense';
    session.addPlayer(name);
    
    const jsonSession = session.convertToJson();
    res.json(jsonSession);
});

// Attempt to join an existing game
/**
 * param: id (Int)
 * param: name (String)
 */
app.post('/joinGame', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const session = lobby.getSession(id)

    // TODO: Make not case sensitive
    if (name == 'Michaela') name = 'Hortense';
    if (session != null && session.isOpen){
        session.addPlayer(name);
        const jsonSession = session.convertToJson();
        res.json(jsonSession);
    } else if (session == null){
        const errorJson = {"error": "Session with Id "+id+" does not exist"}
        res.json(errorJson);
    } else {
        const errorJson = {"error": "Game with that Id "+id+" has already started'"}
        res.json(errorJson);
    }
    
});


// Start the game
/**
 * param: id (Int)
 */
app.post('/start', (req, res) => {
    const id = req.body.id;
    const session = lobby.getSession(id);
    session.startGame();

    const jsonSession = session.convertToJson();
    res.json(jsonSession);
});

// Input Bids
/**
 * param: gameId (Int)
 * param: playerId (Int)
 * param: bid (Int)
 */
app.post('/bid', (req, res) => {
    const playerId = req.body.playerId;
    const gameId = req.body.gameId;
    const bid = req.body.bid;

    const session = lobby.getSession(gameId);
    session.setBid(playerId, bid);
    //const jsonSession = session.convertToJson();
    //res.json(jsonSession);
    if (session.bidsAreIn()){
        res.json({"bids" : "are in"});
    } else {
        res.json({"bids" : "are not in yet"});
    }

    
});

//TODO: Implement Harry
//TODO: Implement Rascal

// Calculate Scores
/**
 * param: playerId (Int)
 * param: gameId (Int)
 * param: bidAchieved (bool)
 * param: tricks (Int)
 * param: bonusPoints (Int)
 */
app.post('/calculate', (req, res) => {
    //TODO: Test the Shit out of this: Set up Postman Collection Runner
    const playerId = req.body.playerId;
    const gameId = req.body.gameId;
    const bidAchieved = req.body.bidAchieved;
    const tricks = req.body.tricks;
    const bonus = req.body.bonusPoints;

    const session = lobby.getSession(gameId);
    
    if(bidAchieved){
        session.achievedBid(playerId, bonus);
        const jsonSession = session.convertToJson();
        res.json(jsonSession);
    } else {
        session.failedBid(playerId, tricks);
        const jsonSession = session.convertToJson();
        res.json(jsonSession);
    }
    

});

app.listen(3001, () => {
    console.log("Server is running");
});

const express = require('express');
const app = express();
app.use(express.json());
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
 * param: name (String)
 */
app.post('/newGame', (req, res) => {
    var name = req.body.name;
    console.log("name: " + name);
    const id = lobby.createSession();
    const session = lobby.getSession(id);
    console.log("Session: " + session)

    if (name.toLowerCase() == 'michaela') name = 'HORTENSE';
    if (name.toLowerCase() == 'bridget') name = 'Devil in da skies';
    session.addPlayer(name);
    
    const jsonSession = session.convertToJson();
    res.json(jsonSession);
});

// Attempt to join an existing game
/**
 * param: gameId (String)
 * param: name (String)
 */
app.post('/joinGame', (req, res) => {
    const gameId = req.body.gameId;
    var name = req.body.name;
    const session = lobby.getSession(gameId)

    if (name.toLowerCase() == 'michaela') name = 'HORTENSE';
    if (name.toLowerCase() == 'bridget') name = 'Devil in disguise';
    if (session != null && session.isOpen){
        var id = session.addPlayer(name);
        const jsonSession = session.convertToJson();
        res.json(jsonSession);
    } else if (session == null){
        res.statusCode = 404;
        const errorJson = {"error": "Session with Id "+gameId+" does not exist"}
        res.json(errorJson);
    } else {
        res.statusCode = 404;
        const errorJson = {"error": "Game with Id "+gameId+" has already started"}
        res.json(errorJson);
    }
    
});

// Remove a player from the specified Session
/**
 * param: gameId (String)
 * param: playerId (Int)
 */
app.post('/removePlayer', (req, res) => {
    const gameId = req.body.gameId;
    const playerId = req.body.playerId;
    const session = lobby.getSession(gameId);

    session.removePlayer(playerId);

    const jsonSession = session.convertToJson();
    res.json(jsonSession);
});


// Start the game
/**
 * param: gameId (String)
 */
app.post('/start', (req, res) => {
    const gameId = req.body.gameId;
    const session = lobby.getSession(gameId);
    session.startGame();

    const jsonSession = session.convertToJson();
    res.json(jsonSession);
});

// Input Bids
/**
 * param: gameId (String)
 * param: playerId (Int)
 * param: bid (Int)
 */
app.post('/bid', (req, res) => {
    const playerId = req.body.playerId;
    const gameId = req.body.gameId;
    const bid = req.body.bid;

    const session = lobby.getSession(gameId);
    session.setBid(playerId, bid);
    const jsonSession = session.convertToJson();
    res.json(jsonSession);

});

// Checks to see if All bids are in
/**
 * param: gameId (String)
 */
app.post('/areBidsIn', (req, res) => {
    const gameId = req.body.gameId;
    const session = lobby.getSession(gameId);

    const bidsAreIn = session.bidsAreIn();
    res.json({
        "bidsAreIn": bidsAreIn
    });
});

// Implement Harry
/**
 * param: gameId (String)
 * param: playerId (Int)
 * param: modifyBid (Int) //will be +1 or -1
 */
app.post('/harry', (req, res) => {
    const gameId = req.body.gameId;
    const playerId = req.body.playerId;
    const bidIncrement = req.body.modifyBid;

    const session = lobby.getSession(gameId);
    session.modifyBid(playerId, bidIncrement);

    const jsonSession = session.convertToJson();
    res.json(jsonSession);
});


//TODO: Implement Rascal
/**
 * param: gameId (String)
 * param: playerId (Int)
 * param: wager (Int)
 */
app.post('/rascal', (req, res) => {
    const gameId = req.body.gameId;
    const playerId = req.body.playerId;
    const wager = req.body.wager;

    const session = lobby.getSession(gameId);
    const player = session.getPlayer(playerId);
    const box = player.boxes[session.currentRound-1];
    box.setWager(wager);

    const jsonSession = session.convertToJson();
    res.json(jsonSession);
});

// TODO; Find out if Harry or Rascal Implemenntation is better

// Calculate Scores
/**
 * param: playerId (Int)
 * param: gameId (String)
 * param: bidAchieved (bool)
 * param: tricks (Int)
 * param: bonusPoints (Int)
 */
app.post('/calculate', (req, res) => {
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
        console.log(jsonSession);
    } else {
        session.failedBid(playerId, tricks);
        const jsonSession = session.convertToJson();
        res.json(jsonSession);
        console.log(jsonSession);
    }


});

// Check to see if everyones scores are calculated
/**
 * param: gameId (String)
 */
app.post('/isRoundOver', (req, res) => {
    const gameId = req.body.gameId;

    const session = lobby.getSession(gameId);

    var roundIsOver = session.scoresAreCalculated();
    var gameIsOver = roundIsOver && session.currentRound == 10;

    if(roundIsOver){
        session.currentRound++;
    }

    res.json({
        "roundIsOver": roundIsOver,
        "gameIsOver": gameIsOver
    });

    if (gameIsOver){
        lobby.deleteSession(gameId);
    }

});

app.listen(3001, () => {
    console.log("Server is running");
});

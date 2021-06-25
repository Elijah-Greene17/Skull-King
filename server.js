const express = require('express');
const app = express();
app.use(express.json())
const Player = require('./models/Player');
const Lobby = require('./models/Lobby');

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
    var player = new Player(name);
    session.addPlayer(player);
    
    // TODO: Send Back JSON with session data
    res.send('newGame started with id ' + id);
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
    var player = new Player(name)
    if (session != null && session.isOpen){
        session.addPlayer(player);
        res.send('joinGame');
    } else if (session == null){
        res.send('Session with Id '+id+' does not exist');
    } else {
        res.send('Game with that Id '+id+' has already started');
    }
    
});


// Start the game
/**
 * param: id (Int)
 */
app.get('/start', (req, res) => {
    const id = req.body.id;
    const session = lobby.getSession(id);
    session.startGame();

    //TODO: Send Back JSON with Session
    res.send('Game Started');
})


app.listen(3001, () => {
    console.log("Server is running");
});

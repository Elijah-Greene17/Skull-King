const express = require('express');
const app = express();
app.use(express.json())
const Player = require('./models/Player');
const Lobby = require('./models/Lobby');

var lobby = new Lobby('FamDamily');

app.get('/', (req, res) => {
    console.log('Ping')
    res.send("Success");
});

app.post('/newGame', (req, res) => {
    var name = req.body.name;

    // TODO: Make not case sensitive
    if (name == 'Michaela') name = 'Hortense';

    var player = new Player(name);
    const id = lobby.createSession();
    lobby.getSession(id).addPlayer(player);
    
    res.send('newGame');
});

app.post('/joinGame', (req, res) => {
    var id = req.body.id;
    var name = req.body.name;

    // TODO: Make not case sensitive
    if (name == 'Michaela') name = 'Hortense';

    var player = new Player(name)

    const session = lobby.getSession(id)
    if (session != null && session.isOpen){
        session.addPlayer(player);
        res.send('joinGame');
    } else if (session == null){
        res.send('Id does not exist');
    } else {
        res.send('Game with that Id has already started');
    }
    
});

app.get('/start', (req, res) => {
    var id = req.body.id;
    lobby.getSession(id).startGame();
    res.send('Game Started');
})


app.listen(3001, () => {
    console.log("Server is running");
});

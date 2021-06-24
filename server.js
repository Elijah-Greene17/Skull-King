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
    if (name == 'Bridget') name = 'Satan';
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
    if (name == 'Bridget') name = 'Satan';
    if (name == 'Michaela') name = 'Hortense';

    //TEST THIS

    var player = new Player(name)
    lobby.getSession(id).addPlayer(player);
    res.send('joinGame');
});

app.get('/start', (req, res) => {

})


app.listen(3001, () => {
    console.log("Server is running");
});

const express = require('express');
const app = express();

const Player = require('./models/Player');

var sessions = []
var count = 0

app.get('/', (req, res) => {
    count++;
    res.send("Count: " + count);
});

app.get('/newGame', (req, res) => {
    var player = new Player('Elijah');
    var session = Session();
    session.addPlayer(player);

    sessions.push(session);
    
});

app.get('/joinGame', (req, res) => {
    var player = Player('Mitchell')
    sessions[0].addPlayer(player);
});


app.listen(3001, () => {
    console.log("Server is running");
});
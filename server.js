const express = require('express');
const app = express();
const Player = require('./models/Player');
const Session = require('./models/Session');

var sessions = [];
var count = 0;

app.get('/', (req, res) => {
    count++;
    res.send("Count: " + count);
});

app.get('/newGame', (req, res) => {
    var player = new Player('Elijah');
    var session = new Session();
    session.addPlayer(player);

    sessions.push(session);
    
    res.send('newGame');
});

app.get('/joinGame', (req, res) => {
    var player = new Player('Mitchell')
    sessions[0].addPlayer(player);
    res.send('joinGame');
});


app.listen(3001, () => {
    console.log("Server is running");
});
const express = require('express');
var cors = require('cors');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});
const Lobby = require('./models/Lobby');
const Player = require('./models/Player');

var lobby = new Lobby('FamDamily');

// Basic HTTP requests
app.get('/', (req, res) => {
    console.log('Ping');
    //res.json({ status: 'success' });
    res.send('Ping');
});

app.get('/idExists/:id', (req, res) => {
    console.log('idExists: ', req.params.id);
    console.log(lobby);
    res.json({ idExists: lobby.getSession(req.params.id) !== null });
});

app.post('/createNewGame', (req, res) => {
    let name = req.body.name;
    console.log('name: ' + name);
    const gameId = lobby.createSession();
    const session = lobby.getSession(gameId);
    console.log('Session: ' + session.id);

    // if (name.toLowerCase() == 'michaela') name = 'HORTENSE';
    // if (name.toLowerCase() == 'bridget') name = 'Devil in da skies';
    // const playerId = session.addPlayer(name);

    res.json({ id: gameId });
});

// Socket Connection for player loading
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('pingSocket', (msg) => {
        console.log('Socket Pinged: ' + msg);
        socket.emit('pingClient', 'Hello from Server!');
    });

    // Assign to room
    socket.on('joinRoom', (gameId) => {
        console.log('User joining room ', gameId);
        socket.join(gameId);
        const players = lobby.getSession(gameId).players;
        io.in(gameId).emit('message', 'cool game');
        io.in(gameId).emit('setPlayerList', players);
    });

    /*
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message2: ' + msg);
        io.emit('chat message', msg);
    })
    */

    // Attempt to create a game
    /**
     * param: name (String)
     */
    // socket.on('newGame', (data) => {
    //     let name = data.name;
    //     console.log('name: ' + name);
    //     const gameId = lobby.createSession();
    //     const session = lobby.getSession(gameId);
    //     console.log('Session: ' + session.id);

    //     if (name.toLowerCase() == 'michaela') name = 'HORTENSE';
    //     if (name.toLowerCase() == 'bridget') name = 'Devil in da skies';
    //     const playerId = session.addPlayer(name);

    //     socket.emit('gameCreated', {
    //         gameId: gameId,
    //         playerId: playerId,
    //         host: session.admin,
    //         playerList: session.players.map((i) => {
    //             return i.name;
    //         }),
    //     });
    // });

    // Attempt to join an existing game
    /**
     * param: gameId (String)
     * param: name (String)
     */
    socket.on('joinGame', (data) => {
        const gameId = data.gameId;
        let name = data.name;
        const session = lobby.getSession(gameId);

        console.log('User joining room ', gameId);
        socket.join(gameId);

        if (name.toLowerCase() == 'michaela') name = 'HORTENSE';
        if (name.toLowerCase() == 'bridget') name = 'Devil in disguise';
        if (session != null && session.isOpen) {
            let playerId = session.addPlayer(name, socket.id);

            io.in(gameId).emit('gameJoined', {
                gameId: gameId,
                playerId: playerId,
                host: session.admin,
                playerList: session.players.map((player) => {
                    return player;
                }),
            });

            socket.emit('setPlayerId', playerId);
        } else {
            var errorJson;
            if (session == null) {
                errorJson = {
                    error: 'Session with Id ' + gameId + ' does not exist',
                };
            } else {
                errorJson = {
                    error: 'Game with Id ' + gameId + ' has already started',
                };
            }

            socket.emit('gameJoined', errorJson);
        }
    });

    // Remove a player from the specified Session
    /**
     * param: gameId (String)
     * param: playerId (Int)
     */
    socket.on('removePlayer', (req) => {
        const gameId = req.gameId;
        const playerId = req.playerId;
        const session = lobby.getSession(gameId);

        session.removePlayer(playerId);

        const jsonSession = session.convertToJson();
        io.emit('removePlayer', jsonSession);
    });

    // Start the game
    /**
     * param: gameId (String)
     */
    socket.on('start', (req) => {
        const gameId = req.gameId;
        const session = lobby.getSession(gameId);
        session.startGame();

        const jsonSession = session.convertToJson();
        io.emit('start', jsonSession);
    });

    // Input Bids
    /**
     * param: gameId (String)
     * param: playerId (Int)
     * param: bid (Int)
     */
    socket.on('bid', (req) => {
        const playerId = req.playerId;
        const gameId = req.gameId;
        const bid = req.bid;

        const session = lobby.getSession(gameId);
        session.setBid(playerId, bid);
        const jsonSession = session.convertToJson();
        io.emit('bid', jsonSession);
    });

    // Checks to see if All bids are in
    /**
     * param: gameId (String)
     */
    socket.on('areBidsIn', (req) => {
        const gameId = req.gameId;
        const session = lobby.getSession(gameId);

        const bidsAreIn = session.bidsAreIn();
        io.emit('bid', {
            bidsAreIn: bidsAreIn,
        });
    });

    // Implement Harry
    /**
     * param: gameId (String)
     * param: playerId (Int)
     * param: modifyBid (Int) //will be +1 or -1
     */
    socket.on('harry', (req) => {
        const gameId = req.gameId;
        const playerId = req.playerId;
        const bidIncrement = req.modifyBid;

        const session = lobby.getSession(gameId);
        session.modifyBid(playerId, bidIncrement);

        const jsonSession = session.convertToJson();
        io.emit('harry', jsonSession);
    });

    //TODO: Implement Rascal
    /**
     * param: gameId (String)
     * param: playerId (Int)
     * param: wager (Int)
     */
    socket.on('rascal', (req) => {
        const gameId = req.gameId;
        const playerId = req.playerId;
        const wager = req.wager;

        const session = lobby.getSession(gameId);
        const player = session.getPlayer(playerId);
        const box = player.boxes[session.currentRound - 1];
        box.setWager(wager);

        const jsonSession = session.convertToJson();
        io.emit('rascal', jsonSession);
    });

    // TODO Find out if Harry or Rascal Implemenntation is better

    // TODO: Fix call to calculate from tricks instead of bidAchieved
    // Calculate Scores
    /**
     * param: playerId (Int)
     * param: gameId (String)
     * param: bidAchieved (bool)
     * param: tricks (Int)
     * param: bonusPoints (Int)
     */
    socket.on('calculate', (req) => {
        const playerId = req.playerId;
        const gameId = req.gameId;
        const bidAchieved = req.bidAchieved;
        const tricks = req.tricks;
        const bonus = req.bonusPoints;

        const session = lobby.getSession(gameId);

        if (bidAchieved) {
            session.achievedBid(playerId, bonus);
            const jsonSession = session.convertToJson();
            io.emit(jsonSession);
            console.log(jsonSession);
        } else {
            session.failedBid(playerId, tricks);
            const jsonSession = session.convertToJson();
            io.emit(jsonSession);
            console.log('calculate', jsonSession);
        }
    });

    // Check to see if everyones scores are calculated
    /**
     * param: gameId (String)
     */
    socket.on('isRoundOver', (req) => {
        const gameId = req.gameId;

        const session = lobby.getSession(gameId);

        var roundIsOver = session.scoresAreCalculated();
        var gameIsOver = roundIsOver && session.currentRound == 10;

        if (roundIsOver) {
            session.currentRound++;
        }

        io.emit('isRoundOver', {
            roundIsOver: roundIsOver,
            gameIsOver: gameIsOver,
        });

        if (gameIsOver) {
            lobby.deleteSession(gameId);
        }
    });

    socket.on('disconnect', () => {
        const session = lobby.getSessionBySocketId(socket.id);
        const player = session.getPlayerBySocketId(socket.id);

        if (player != null) {
            session.removePlayer(player.id);
            const jsonSession = session.convertToJson();
            io.emit('removePlayer', jsonSession);
            if (session.players.length === 0) {
                lobby.deleteSession(session.id);
            }
        }
    });

    // socket.on('chat message', (msg) => {
    //     console.log('message2: ' + msg)
    //     io.emit('chat message', msg)
    // })
});

// Run the server
server.listen(3001, () => {
    console.log('Server is running');
});

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
    //res.json({ status: 'success' });
    res.send('Ping');
});

app.get('/idExists/:id', (req, res) => {
    res.json({ idExists: lobby.getSession(req.params.id) !== null });
});

app.post('/createNewGame', (req, res) => {
    let name = req.body.name;
    const gameId = lobby.createSession();
    const session = lobby.getSession(gameId);

    // if (name.toLowerCase() == 'michaela') name = 'HORTENSE';
    // if (name.toLowerCase() == 'bridget') name = 'Devil in da skies';
    // const playerId = session.addPlayer(name);

    res.json({ id: gameId });
});

app.get('/admin/getSessionInfo/:gameId', (req, res) => {
    console.log('getsessioninfo ', req.params.gameId);
    const gameId = req.params.gameId;
    const session = lobby.getSession(gameId);
    res.json(session);
});

app.get('/updateLeaderBoard/:gameId', (req) => {
    const gameId = req.params.gameId;

    const session = lobby.getSession(gameId);
    const data = {
        players: session.playersCalculated,
    };
    io.emit('leaderboard', data);
})

// Socket Connection for player loading
io.on('connection', (socket) => {
    socket.on('pingSocket', (msg) => {
        socket.emit('pingClient', 'Hello from Server!');
    });

    // Assign to room
    socket.on('joinRoom', (gameId) => {
        socket.join(gameId);
        // const players = lobby.getSession(gameId).players;
        // io.in(gameId).emit('message', 'cool game');
        // io.in(gameId).emit('setPlayerList', players);
    });

    // Attempt to join an existing game
    /**
     * param: gameId (String)
     * param: name (String)
     */
    socket.on('joinGame', (data) => {
        const gameId = data.gameId;
        let name = data.name;
        const session = lobby.getSession(gameId);

        socket.join(gameId);

        if (name.toLowerCase() == 'michaela') name = 'HORTENSE';
        if (name.toLowerCase() == 'bridget') name = 'Devil in disguise';
        if (session != null && (session.isOpen || data.override)) {
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
        io.in(gameId).emit('removePlayer', jsonSession);
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
        io.in(gameId).emit('start', jsonSession);
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

        if (session.bidsAreIn()) {
            const jsonSession = session.convertToJson();
            io.in(gameId).emit('bidsAreIn', jsonSession);
        }
        // const jsonSession = session.convertToJson();
        // io.emit('bid', jsonSession);
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
     * param: bidIncrement (Int) //will be +1 or -1
     */
    socket.on('harry', (req) => {
        console.log('harry');
        const gameId = req.gameId;
        const playerId = req.playerId;
        const bidIncrement = req.bidIncrement;

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
     * param: bonus (Int)
     */
    socket.on('calculate', (req) => {
        const playerId = req.playerId;
        const gameId = req.gameId;
        const tricks = req.tricks;
        const bonus = req.bonus;

        const session = lobby.getSession(gameId);

        currentRound = session.getCurrentRound();
        const player = session.getPlayer(playerId);
        const pBid = parseInt(player.boxes[currentRound - 1].bid);

        if (tricks == pBid) {
            session.achievedBid(playerId, bonus);
        } else {
            session.failedBid(playerId, tricks);
        }

        session.playersCalculated.addPlayer(player);

        //const jsonSession = session.convertToJson();
        const data = {
            players: session.playersCalculated,
        };

        io.emit('leaderboard', data);
    });

    // Check to see if everyones scores are calculated
    /**
     * param: gameId (String)
     */
    socket.on('isRoundOver', (req) => {
        console.log('EG Is round over', req.gameId);
        const gameId = req.gameId;

        const session = lobby.getSession(gameId);
        console.log('EG Session: ', session);

        var roundIsOver = session.scoresAreCalculated();
        var gameIsOver = roundIsOver && session.currentRound == 2;
        if (roundIsOver) {
            session.currentRound++;
            session.playersCalculated.clearPlayers();
        }

        io.emit('isRoundOver', {
            roundIsOver: roundIsOver,
            gameIsOver: gameIsOver,
            scoreBoard: session.scoreboard,
        });

        if (gameIsOver) {
            lobby.deleteSession(gameId);
        }
    });

    socket.on('disconnect', () => {
        const session = lobby.getSessionBySocketId(socket.id);
        let player = null;
        if (session) {
            player = session.getPlayerBySocketId(socket.id);
        }

        // if (player != null) {
        //     session.removePlayer(player.id);
        //     const jsonSession = session.convertToJson();
        //     io.emit('removePlayer', jsonSession);
        // }
    });
});

// Run the server
server.listen(process.env.PORT || 3001, () => {
    console.log('Server is running');
});

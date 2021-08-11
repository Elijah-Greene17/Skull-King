const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')

app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
      origin: '*',
    }
  })

const Lobby = require('./models/Lobby')
const Player = require('./models/Player')

let lobby = new Lobby('FamDamily')

// Socket Connection for player loading
io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('pingSocket', (msg) => {
        console.log('Socket Pinged: ' + msg)
    })

    // Initiate new game
    /**
     * param: name (String)
     */
    socket.on('newGame', (req) => {
        let name = req.name
        console.log("name: " + name)
        const gameId = lobby.createSession()
        const session = lobby.getSession(gameId)
        console.log("Session: " + session.id)

        if (name.toLowerCase() == 'michaela') name = 'HORTENSE'
        if (name.toLowerCase() == 'bridget') name = 'Devil in da skies'
        const playerId = session.addPlayer(name)
        
        //const jsonSession = session.convertToJson()
        io.emit('newGame', {
            "gameId": gameId,
            "playerId": playerId,
            "host": session.admin
        })
    })

    // Attempt to join an existing game
    /**
     * param: gameId (String)
     * param: name (String)
     */
    socket.on('joinGame', (req) => {
        console.log("Join Game")
        const gameId = req.gameId
        let name = req.name
        const session = lobby.getSession(gameId)

        if (name.toLowerCase() == 'michaela') name = 'HORTENSE'
        if (name.toLowerCase() == 'bridget') name = 'Devil in disguise'
        if (session != null && session.isOpen){
            let playerId = session.addPlayer(name)

            io.emit('joinGame', {
                playerId: playerId,
                gameId: gameId,
                host: session.admin,
                players: playerList = session.players.map((i) => { return i.name })
            })

        } else if (session == null){
            const errorJson = {"error": "Session with Id "+gameId+" does not exist"}
            io.emit("error", errorJson)
        } else {
            const errorJson = {"error": "Game with Id "+gameId+" has already started"}
            io.emit("error", errorJson)
        }
        
    })

    // Remove a player from the specified Session
    /**
     * param: gameId (String)
     * param: playerId (Int)
     */
    socket.on('removePlayer', (req) => {
        const gameId = req.gameId
        const playerId = req.playerId
        const session = lobby.getSession(gameId)

        session.removePlayer(playerId)

        const jsonSession = session.convertToJson()
        io.emit('removePlayer', jsonSession)
    })


    // Start the game
    /**
     * param: gameId (String)
     */
    socket.on('start', (req) => {
        const gameId = req.gameId
        const session = lobby.getSession(gameId)
        session.startGame()

        const jsonSession = session.convertToJson()
        io.emit('start', jsonSession)
    })

    // Input Bids
    /**
     * param: gameId (String)
     * param: playerId (Int)
     * param: bid (Int)
     */
    socket.on('bid', (req) => {
        const playerId = req.playerId
        const gameId = req.gameId
        const bid = req.bid

        const session = lobby.getSession(gameId)
        session.setBid(playerId, bid)
        const jsonSession = session.convertToJson()
        io.emit('bid', jsonSession)

    })

    // Checks to see if All bids are in
    /**
     * param: gameId (String)
     */
    socket.on('areBidsIn', (req) => {
        const gameId = req.gameId
        const session = lobby.getSession(gameId)

        const bidsAreIn = session.bidsAreIn()
        io.emit('bid', {
            "bidsAreIn": bidsAreIn
        })
    })

    // Implement Harry
    /**
     * param: gameId (String)
     * param: playerId (Int)
     * param: modifyBid (Int) //will be +1 or -1
     */
    socket.on('harry', (req) => {
        const gameId = req.gameId
        const playerId = req.playerId
        const bidIncrement = req.modifyBid

        const session = lobby.getSession(gameId)
        session.modifyBid(playerId, bidIncrement)

        const jsonSession = session.convertToJson()
        io.emit('harry', jsonSession)
    })


    //TODO: Implement Rascal
    /**
     * param: gameId (String)
     * param: playerId (Int)
     * param: wager (Int)
     */
    socket.on('rascal', (req) => {
        const gameId = req.gameId
        const playerId = req.playerId
        const wager = req.wager

        const session = lobby.getSession(gameId)
        const player = session.getPlayer(playerId)
        const box = player.boxes[session.currentRound-1]
        box.setWager(wager)

        const jsonSession = session.convertToJson()
        io.emit('rascal', jsonSession)
    })

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
        const playerId = req.playerId
        const gameId = req.gameId
        const bidAchieved = req.bidAchieved
        const tricks = req.tricks
        const bonus = req.bonusPoints

        const session = lobby.getSession(gameId)
        
        if(bidAchieved){
            session.achievedBid(playerId, bonus)
            const jsonSession = session.convertToJson()
            io.emit(jsonSession)
            console.log(jsonSession)
        } else {
            session.failedBid(playerId, tricks)
            const jsonSession = session.convertToJson()
            io.emit(jsonSession)
            console.log('calculate', jsonSession)
        }


    })

    // Check to see if everyones scores are calculated
    /**
     * param: gameId (String)
     */
    socket.on('isRoundOver', (req) => {
        const gameId = req.gameId

        const session = lobby.getSession(gameId)

        var roundIsOver = session.scoresAreCalculated()
        var gameIsOver = roundIsOver && session.currentRound == 10

        if(roundIsOver){
            session.currentRound++
        }

        io.emit('isRoundOver', {
            "roundIsOver": roundIsOver,
            "gameIsOver": gameIsOver
        })

        if (gameIsOver){
            lobby.deleteSession(gameId)
        }

    })

    app.post('/pingClient', (req, res) => {
        io.emit("pingClient", {msg: "Hi Client!"})
        res.send('Success')
    })

    /*
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('chat message', (msg) => {
        console.log('message2: ' + msg)
        io.emit('chat message', msg)
    })
    */

})

// Run the server
server.listen(3001, () => {
    console.log("Server is running")
})

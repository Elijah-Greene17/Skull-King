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

var lobby = new Lobby('FamDamily')

// Socket Connection for player loading
io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('pingSocket', (msg) => {
        console.log('Socket Pinged: ' + msg)
    })

    /*
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message2: ' + msg);
        io.emit('chat message', msg);
    })
    */

    socket.on('newGame', (data) => {
        let name = data.name
        console.log("name: " + name)
        const gameId = lobby.createSession()
        const session = lobby.getSession(gameId)
        console.log("Session: " + session)

        if (name.toLowerCase() == 'michaela') name = 'HORTENSE'
        if (name.toLowerCase() == 'bridget') name = 'Devil in da skies'
        const playerId = session.addPlayer(name)

        socket.emit("gameCreated", {
            gameId : gameId,
            playerId : playerId,
            host : session.admin,
            playerList : session.players.map((i) => { return i.name })
        })
    })

    // Attempt to join an existing game
    /**
     * param: gameId (String)
     * param: name (String)
     */
    socket.on('joinGame', (data) => {
        const gameId = data.gameId
        var name = data.name
        const session = lobby.getSession(gameId)

        if (name.toLowerCase() == 'michaela') name = 'HORTENSE'
        if (name.toLowerCase() == 'bridget') name = 'Devil in disguise'
        if (session != null && session.isOpen) {
            var playerId = session.addPlayer(name)
            
            socket.emit("gameJoined", {
                gameId : gameId,
                playerId : playerId,
                host : session.admin,
                playerList : session.players.map((i) => { return i.name })
            })
        } else {
            var errorJson
            if (session == null) {
                errorJson = {"error": "Session with Id "+gameId+" does not exist"}
            } else {
                errorJson = {"error": "Game with Id "+gameId+" has already started"}
            }

            socket.emit("gameJoined", errorJson)
        }
    })
})

// Run the server
server.listen(3001, () => {
    console.log("Server is running")
})

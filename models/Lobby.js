const Session = require('./Session');

class Lobby {
    constructor(name){
        //TODO: Find better way to generate id without needing to restart server
        this.sessionCount = 0;

        this.name = name;
        this.sessions = [];
    }
    
    createSession(){
        this.sessionCount++;
        var id = this.sessionCount;
        this.sessions.push(new Session(id));
        console.log()
        return id;
    }

    getSession(id){
        const result = this.sessions.filter(session => session.id === id);
        if (result.length > 0){
            return result[0];
        }
        else{
            return null;
        }

    }
}

module.exports = Lobby;
const Session = require('./Session');

class Lobby {
    constructor(name){
        this.name = name;
        this.sessions = [];
    }
    
    createSession(){
        var id = ""
        var idExists = false;
        do {
            id = this.generateSessionId();
            if (this.getSession(id) != null){
                idExists = true;
            }
        } while (idExists)

        this.sessions.push(new Session(id));
        return id;
    }

    getSession(id){
        const result = this.sessions.filter(session => session.id == id);
        if (result.length > 0){
            return result[0];
        }
        else{
            return null;
        }
    }

    //TODO: Implement this if not implemented
    deleteSession(id){
        this.sessions = this.sessions.filter(session => session.id != id);
    }

    generateSessionId(){
        var generatedId = "";
        for (var i = 0; i < 4; i++){
            const number = Math.floor(Math.random() * (36 - 1) + 1);
            if (number > 9){
                generatedId = generatedId + String.fromCharCode(number + 55);
            }
            else {
                generatedId = generatedId + String(number);
            }
        }
        console.log(generatedId);
        return generatedId;
    }
}

module.exports = Lobby;
//
//  Socket.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 8/10/21.
//

import Foundation
import SocketIO

struct Socket {
    
    let manager = SocketManager(socketURL: URL(string: "http://localhost:3001")!, config: [.log(true), .compress])
    var socket: SocketIOClient?
    
    init() {
        
        socket = manager.defaultSocket
        
        socket?.on(clientEvent: .connect) {data, ack in
            print("EG socket connected")
        }
        
        // Client Listener
        socket?.on("pingClient") {data, ack in
            print("EG client pinged: \(data[0])")
        }
        
        socket?.on("error") {data, ack in
            let myData = data[0]
            print(myData)
        }
        
        socket?.on("newGame") {data, ack in
            let myData = data[0]
            print("EG newGame Created: \(myData)")
        }
        
        socket?.on("joinGame") {data, ack in
            let myData = data[0]
            print("EG joined Game: \(myData)")
        }
 
        
        socket!.connect()
    }
    
    func emitNewGame(){
        socket?.emit("newGame", ["name": "Elijah"])
    }
    
}

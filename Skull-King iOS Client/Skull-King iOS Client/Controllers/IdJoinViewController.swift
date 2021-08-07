//
//  IdJoinViewController.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/28/21.
//

import UIKit
import SocketIO

class IdJoinViewController: UIViewController {
    
    let manager = SocketManager(socketURL: URL(string: "192.168.1.24:3001")!, config: [.log(true), .compress])
    var socket: SocketIOClient?

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        // Testing Socket.io
        socket = manager.defaultSocket
        
        socket?.on(clientEvent: .connect) {data, ack in
            print("EG socket connected")
        }
        
        // Client Listener
        socket?.on("pingClient") {data, ack in
            print("EG client pinged: \(data[0])")
        }
 
        
        socket!.connect()
        
        
    }

    @IBAction func goPressed(_ sender: UIButton) {
        socket?.emit("pingSocket", "Test")
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}

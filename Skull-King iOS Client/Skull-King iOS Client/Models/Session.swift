//
//  Session.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/27/21.
//

import Foundation

struct Session: Codable {
    
    let id: String
    let players: [Player]
    let currentRound: Int
    let isOpen: Bool
    
    
    
    // TODO: Debug This!
    static func parseJsonToSession(data: Data) -> Session?{
        let decoder = JSONDecoder()
        do {
            let decodedData = try decoder.decode(Session.self, from: data)
            return decodedData
        } catch {
            print("There was an error while attempting to decode the json data")
            return nil
        }
        
    }
}

struct Player: Codable {
    let id: Int
    let name: String
    let score: Int
    let boxes: [Box]
}

struct Box: Codable {
    let bid: Int
    let points: Int
    let bonus: Int
}

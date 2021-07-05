//
//  GameData.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 7/4/21.
//

import Foundation

struct GameData: Codable {
    var playerId: Int?
    var gameId: String?
    var error: String?
    
    
    static func parseJsonToGameData(data: Data) -> GameData?{
        let decoder = JSONDecoder()
        do {
            print(data)
            let decodedData = try decoder.decode(GameData.self, from: data)
            print(decodedData)
            return decodedData
        } catch let error as NSError{
            print("There was an error while attempting to decode the json data: \(error)")
            return nil
        }
        
    }
}

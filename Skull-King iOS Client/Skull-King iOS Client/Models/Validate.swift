//
//  Validate.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 8/11/21.
//

import Foundation

struct Validate: Codable {
    var isValid: String?
    
    static func parseJsonToValidate(data: Data) -> Validate?{
        let decoder = JSONDecoder()
        print(data)
        do {
            let decodedData = try decoder.decode(Validate.self, from: data)
            print(decodedData)
            return decodedData
        } catch let error as NSError{
            print("There was an error while attempting to decode the json data: \(error)")
            return nil
        }
        
    }
}

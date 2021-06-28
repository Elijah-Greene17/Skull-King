//
//  Rest.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/27/21.
//

import Foundation

struct HTTP {
    
    static func get(url sendUrl: String) {
        let url = URL(string: sendUrl)!
        var request = URLRequest(url: url)
        
        request.httpMethod = "GET"

        let task = URLSession.shared.dataTask(with: request) {(data, response, error) in
            guard let data = data else { return }
            let dataString = String(data: data, encoding: .utf8)!
            print(dataString)
        }

        task.resume()
    }
    
    static func post(url sendUrl: String, json: [String: Any]) -> Data?{
        
        var responseJson: Data?
        
        let url = URL(string: sendUrl)!
        var request = URLRequest(url: url)
        
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let jsonData = try? JSONSerialization.data(withJSONObject: json, options: [])
        request.httpBody = jsonData
        
        let group = DispatchGroup()
        group.enter()

        let task = URLSession.shared.dataTask(with: request) {(data, response, error) in

            if let error = error {
                // Handle HTTP request error
                print("An error occured: \(error)")
            } else if let data = data {
                // Handle HTTP request response
                print("There is data!")
                responseJson = data
            } else {
                // Handle unexpected error
                print("There was an unexpected error")
                responseJson = nil
            }
            group.leave()

        }

        task.resume()
        
        group.wait()
        
        return responseJson
    }
    
    
    
    
}

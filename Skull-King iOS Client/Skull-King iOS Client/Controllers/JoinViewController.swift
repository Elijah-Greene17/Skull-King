//
//  JoinViewController.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/28/21.
//

import UIKit

class JoinViewController: UIViewController {

    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
    }
    
    @IBAction func createGameBtn(_ sender: UIButton) {
        //Set up Request info
        let json: [String:Any] = [
            "name": "Elijah"
        ]
        
        if let data = HTTP.post(url: "http://localhost:3001/newGame", json: json){
            if let parsedData = Session.parseJsonToSession(data: data) {
                print("Yooooo \(parsedData)")
            }
        }
    }
    
    @IBAction func joinGameBtn(_ sender: UIButton) {
        
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

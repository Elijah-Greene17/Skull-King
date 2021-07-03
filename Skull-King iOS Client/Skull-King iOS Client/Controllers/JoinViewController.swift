//
//  JoinViewController.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/28/21.
//

import UIKit

class JoinViewController: UIViewController {

    var session: Session?
    
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
                session = parsedData
            }
        }
        
        
        self.performSegue(withIdentifier: "createGameSegue", sender: self)
    }
    
    @IBAction func joinGameBtn(_ sender: UIButton) {
        
        self.performSegue(withIdentifier: "joinGameSegue", sender: self)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "createGameSegue" {
            let destinationVC = segue.destination as! StartViewController
            destinationVC.bmiValue =
        }
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

//
//  JoinViewController.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/28/21.
//

import UIKit

class JoinViewController: UIViewController {

    var session: Session?
    var gameData: GameData?
    var name: String?
    var gameId: String?
    
    @IBOutlet weak var greetingLabel: UILabel!
    @IBOutlet weak var errorLabel: UILabel!
    @IBOutlet weak var gameIdTextField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        errorLabel.isHidden = true
        
        greetingLabel.text = "Ahoy, \(name ?? "Matey")!"
        
    }
    
    @IBAction func createGameBtn(_ sender: UIButton) {
        //Set up Request info
        let json: [String:Any] = [
            "name": name ?? "Matey"
        ]
        
        getGameData(json: json)
        
        self.performSegue(withIdentifier: "goToStartScreen", sender: self)
    }
    
    @IBAction func joinGameBtn(_ sender: UIButton) {
        
        
        let json: [String:Any] = [
            "name": name ?? "Matey",
            "gameId": gameId!
        ]
        
        getGameData(json: json)
        
        self.performSegue(withIdentifier: "goToStartScreen", sender: self)
    }
    
    func getGameData(json: [String:Any]) {
        if let data = HTTP.post(url: "http://localhost:3001/newGame", json: json){
            if let parsedData = GameData.parseJsonToGameData(data: data) {
                print("Yooooo \(parsedData)")
                gameData = parsedData
            }
        }
    }
    
    func submitGameId(){
        if gameIdTextField.text == "" {
            errorLabel.text = "Please enter a Game ID"
            errorLabel.isHidden = false
        } else {
            gameId = gameIdTextField.text
        }
        
    }
    
    // Send data to next view
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "goToStartScreen" {
            let destinationVC = segue.destination as! StartViewController
            destinationVC.gameData = gameData
            
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

extension JoinViewController: UITextFieldDelegate {
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        submitGameId()
        return true
    }
    
    
    
}

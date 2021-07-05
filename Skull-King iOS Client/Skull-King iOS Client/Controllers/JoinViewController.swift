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
        
        // Initialize the delegate
        gameIdTextField.delegate = self
        
        greetingLabel.text = "Ahoy, \(name ?? "Matey")!"
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow(sender:)), name: UIResponder.keyboardWillShowNotification, object: nil);

        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide(sender:)), name: UIResponder.keyboardWillHideNotification, object: nil);

        
    }
    
    @IBAction func createGameBtn(_ sender: UIButton) {
        //Set up Request info
        let json: [String:Any] = [
            "name": name ?? "Matey"
        ]
        
        getGameData(json: json, type: "newGame")
        
        self.performSegue(withIdentifier: "goToStartScreen", sender: self)
    }
    
    @IBAction func joinGameBtn(_ sender: UIButton) {
        
        submitGameId()
        
        //Set up Request info
        let json: [String:Any] = [
            "name": name ?? "Matey",
            "gameId": gameId!
        ]
        
        getGameData(json: json, type: "joinGame")
        
        if gameData?.error != nil {
            errorLabel.text = "Invalid Game ID"
            errorLabel.isHidden = false
        }
        else {
            self.performSegue(withIdentifier: "goToStartScreen", sender: self)
        }
        
    }
    
    func getGameData(json: [String:Any], type: String) {
        if let data = HTTP.post(url: "http://localhost:3001/\(type)", json: json){
            if let parsedData = GameData.parseJsonToGameData(data: data) {
                print("Yooooo \(parsedData)")
                gameData = parsedData
            }
        }
    }
    
    func submitGameId() -> Bool{
        if gameIdTextField.text == "" {
            errorLabel.text = "Please enter a Game ID"
            errorLabel.isHidden = false
            return false
        } else {
            gameId = gameIdTextField.text?.uppercased()
            return true
        }
        
    }
    
    // Send data to next view
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "goToStartScreen" {
            let destinationVC = segue.destination as! StartViewController
            destinationVC.gameData = gameData
            
        }
    }
    
    @objc func keyboardWillShow(sender: NSNotification) {
         self.view.frame.origin.y = -200 // Move view 150 points upward
    }

    @objc func keyboardWillHide(sender: NSNotification) {
         self.view.frame.origin.y = 0 // Move view to original position
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
        gameIdTextField.endEditing(true)
        return true
    }
    
    
    
}

//
//  ViewController.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/27/21.
//

import UIKit

class IntroViewController: UIViewController {

    var name: String?
    
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var errorLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Initially hide the error message
        errorLabel.isHidden = true
        
        // Initialize the delegate
        nameTextField.delegate = self
        
        // Tap outside the keyboard to Dismiss it
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIInputViewController.dismissKeyboard))
        view.addGestureRecognizer(tap)
        
        // Do any additional setup after loading the view.
        /*
        let socket = SocketIOClient(socketURL: "localhost:3001")
        socket.on("important message") {data, ack in
            println("Message for you! \(data?[0])")
            ack?("I got your message, and I'll send my response")
            socket.emit("response", "Hello!")
        }
        socket.connect()
         */
        
        
    }

    @IBAction func playButtonPressed(_ sender: UIButton) {
        submitName()
    }
    
    
    
    func submitName() {
        name = nameTextField.text
        
        if (name == ""){
            errorLabel.isHidden = false
        } else {
            //nameTextField.endEditing(true)
            dismissKeyboard()
            self.performSegue(withIdentifier: "goToMenu", sender: self)
        }
    }
    
    @objc func dismissKeyboard() {
        nameTextField.endEditing(true)
    }
    
    
    // Send data to next view
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "goToMenu" {
            let destinationVC = segue.destination as! JoinViewController
            destinationVC.name = name ?? ""
        }
    }
    
    
}

extension IntroViewController: UITextFieldDelegate {
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        submitName()
        return true
    }
    
    
    
}

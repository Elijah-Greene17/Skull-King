//
//  ViewController.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/27/21.
//

import UIKit

class IntroViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
    }

    @IBAction func playButtonPressed(_ sender: UIButton) {
        //self.performSegue(withIdentifier: "goToResults", sender: self)
        self.performSegue(withIdentifier: "menuSegue", sender: self)
    }
    
}


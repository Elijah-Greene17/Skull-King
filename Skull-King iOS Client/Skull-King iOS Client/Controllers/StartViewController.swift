//
//  StartViewController.swift
//  Skull-King iOS Client
//
//  Created by Elijah Greene on 6/28/21.
//

import UIKit

class StartViewController: UIViewController {
    
    var gameData: GameData?

    @IBOutlet weak var gameIdLabel: UILabel!
    @IBOutlet weak var waitingText: UILabel!
    @IBOutlet weak var startButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        gameIdLabel.text = gameData?.gameId
        
        if gameData?.host == gameData?.playerId {
            startButton.isHidden = false
            waitingText.isHidden = true
        } else {
            startButton.isHidden = true
            waitingText.isHidden = false
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

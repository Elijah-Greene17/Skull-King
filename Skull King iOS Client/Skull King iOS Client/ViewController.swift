//
//  ViewController.swift
//  Skull King iOS Client
//
//  Created by Elijah Greene on 6/23/21.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var countLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        
        let url = URL(string: "http://localhost:3001/")!

        let task = URLSession.shared.dataTask(with: url) {(data, response, error) in
            guard let data = data else { return }
            print(String(data: data, encoding: .utf8)!)
        }

        task.resume()
    }


}


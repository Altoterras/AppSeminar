using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class Title : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {

	}

    //GUI絵画
    private void OnGUI()
    {
        GUI.Label(new Rect(0, 0, 100, 20), "さいころコロコロ");
    }
}

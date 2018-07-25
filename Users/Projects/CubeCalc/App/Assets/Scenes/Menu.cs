using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Menu : MonoBehaviour {

    private enum Child
    {
        RETRY,
        NEXT,
        PREV,
        CREDIT,
    }

    public bool _titleMode;
    public bool _ingameMode;
    public static bool _soundOnOff;
	[SerializeField] public Scene _scene;


    public void onGameSceneOpen()
    {
        SceneManager.LoadScene("Ingame");
    }

    public void OnMenuOpenButton()
	{
		gameObject.SetActive(true);
	}

	public void OnMenuCloseButton()
	{
		gameObject.SetActive(false);
	}

	public void OnRetryButton()
	{
		_scene.RetryStage();
	}

	public void OnNextButton()
	{
		_scene.Debug_NextStage();
	}

	public void OnPrevButton()
	{
		_scene.Debug_PrevStage();
	}

    public void OnCreditButton()
    {

    }

    public void OnSoundButton()
    {
        _soundOnOff = false;
        // リスナーのボリュームを 0 に設定
        //AudioListener.volume = 0f;
    }

    void OnValueChanged(bool value)
    {
        //if (offGraphic != null)
        //{
        //    offGraphic.enabled = !value;
        //}
    }

    // Use this for initialization
    void Start () {
        if (_titleMode)
        {
            transform.GetChild(0).GetChild((int)Child.RETRY).gameObject.SetActive(false);
        }
        else {
            transform.GetChild(0).GetChild((int)Child.CREDIT).gameObject.SetActive(false); 
        }

    }

    // Update is called once per frame
    void Update()
    {
        /*
        if (SceneManager.GetActiveScene().name == "Title")
        {
            foreach (Transform child in transform)
            {
                if (child.name == "NextButton")
                {
                    //                    GameObject.Destroy(child.gameObject);
                    child.gameObject.SetActive(false);
                }
            }
        }
        */
    }
}

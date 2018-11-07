using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class Menu : MonoBehaviour {

    private enum Child
    {
        STAGE,
        SOUND,
        CREDIT,
        TITLE,
    }

    public bool _titleMode;
    public bool _ingameMode;
    public static bool _soundOnOff;
    public Text _stgNo;
    [SerializeField] public Scene _scene;
	[SerializeField] public Dice _dice;


// 複数のSceneでIngameSceneへの遷移を使用するようになったら復活させる
//    public void onGameSceneOpen()
//    {
//        SceneManager.LoadScene("Ingame");
//    }

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
        gameObject.SetActive(false);
    }

	public void OnNextButton()
	{
		_scene.Debug_NextStage();
        _stgNo.text = string.Format("{0}",_scene.StageInfo());

    }

	public void OnPrevButton()
	{
		_scene.Debug_PrevStage();
        _stgNo.text = string.Format("{0}", _scene.StageInfo());
    }

    //　Menuと関係ない処理のため、後で切り出すこと
    public void OnSwitchButton()
    {
        _dice.SwchFlg();
    }

    public void OnSoundButton()
    {
        _soundOnOff = false;
        // リスナーのボリュームを 0 に設定
        //AudioListener.volume = 0f;
    }

    public void OnCreditButton()
    {

    }

    public void OnReturnToTitleButton()
    {
        SceneManager.LoadScene("Title");
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
            transform.GetChild(0).GetChild((int)Child.STAGE).gameObject.SetActive(false);
            transform.GetChild(0).GetChild((int)Child.TITLE).gameObject.SetActive(false);
        }
        else {
            transform.GetChild(0).GetChild((int)Child.CREDIT).gameObject.SetActive(false);
            _stgNo.text = string.Format("{0}", _scene.StageInfo());
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

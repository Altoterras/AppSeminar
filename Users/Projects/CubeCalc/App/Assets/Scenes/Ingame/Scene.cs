﻿using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class Scene : MonoBehaviour
{
	//====
	// 定数・型定義

	enum State
	{
		RUN,
		CLEAR,
	}

	//====
	// フィールド変数

	public GameObject _floorBlockPrehab;
	public Dice _dice;

	private Stage _stage;
	private int _clearNum;
	private int _valuePrev;
	private int _valueCur;
	private int _valueResult;
	private State _stat;
	private float _secStat;
	private string _msgDuty;
	private string _msgMsg;
    private int _stageMax = 2;
    private int _stageCnt = 0;
    private int _diceX;
    private int _diceZ;
	private int _moveCnt = 0;   //手数カウント
	private int _govCnt;        //ゲームオーバー条件　20160518mori
	private string _clearCom;    //クリア条件比較条件格納　20160518mori
	private string _clearStr;

	// 画面表示 20160203mori
	public Text _scoreText; // Text 用変数
	public Text _scoreText2;    //手数用変数
	public Text _clearText;		//クリア条件表示用
	private Color _ccoler = new Color(Random.value, Random.value, Random.value, 1.0f);

	// 計算値保存用配列 20161019mori
	private int[] myNum;

	//====
	// メソッド

	// 初期化処理
	void Start ()
	{
		_stage = new Stage();
        Restart();
	}

	// 再開処理
	void Restart()
	{
		//初期値設定
		_valuePrev = 0;
		_valueCur = 0;
		_valueResult = 0;
		_moveCnt = 0;
		_msgDuty = "+";
		_msgMsg = "Answer try to be RES >= " + _clearNum;

        // ステージを読み込む
        if (_stageCnt >= _stageMax) { _stageCnt = 1; } else { _stageCnt++; }
        _stage.Load(_floorBlockPrehab, _stageCnt, ref _diceX, ref _diceZ);
		_govCnt = _stage.getgovCnt();   //ゲームオーバー条件を取得 20160518mori
		_clearNum = _stage.getclearCnt();       //クリア条件を取得　20160518mori
		_clearCom = _stage.getclearOperator();  //クリア条件2を取得　20160525mori

		//20161019 mori
		myNum = new int[_govCnt];

		// クリア条件表示
		switch (_clearCom[0])
		{
			case '=':
				_clearStr = "と一致させてください。";
				break;
			case '+':
				_clearStr = "より大きくしてください。";
				break;
			case '-':
				_clearStr = "より小さくしてください。";
				break;
		}
		
		// ダイスの設定
		_dice.transform.position = new Vector3(_diceX, 0.0f, _diceZ);   //　位置補正
        _dice.transform.rotation = Quaternion.Euler(-90, -180, 0);      //　回転補正(上１、正面２)
        _dice.validMovingDirection = ValidMovingDirection;  // サイコロの移動可否確認関数
		_dice.onStop = OnDiceStop;  // 停止イベントハンドラを設定する
		_dice.active = true;

		_stat = State.RUN;
		_secStat = 0.0f;
	}

	// Update is called once per frame
	void Update ()
	{
		_secStat += Time.deltaTime;

		// 次のステージへの処理
		if (_stat == State.CLEAR)
		{
			_msgMsg = "Clear! ... " + (int)_secStat + " / 3";
			if (_secStat >= 3.0f)
			{
				_stage.Unload();
				Restart();
			}
		}


	}

	// GUI 処理
	void OnGUI()
	{
		// デバッグ表示
		GUI.Label (new Rect (10, 50, Screen.width - 20, Screen.height - 60), string.Format ("RES = {0} {1} {2} = {3}\n{4}\nPOS = [{5}][{6}]\nIDX = [{7}][{8}]", _valuePrev, _msgDuty, _valueCur, _valueResult, _msgMsg, _dice.transform.position.x, _dice.transform.position.z, _stage.PosXToIndexX(Mathf.Round(_dice.transform.position.x)), _stage.PosZToIndexY(Mathf.Round(_dice.transform.position.z))));

		// 表示処理
		if (_stat == State.CLEAR)
		{
			_dice.active = false;

			//_scoreText.fontSize = 50;
			//_scoreText.color = _ccoler;
			//_scoreText.alignment = TextAnchor.MiddleCenter;
			//_scoreText.text = _msgMsg;
			_clearText.text = _msgMsg;
		}
		else
		{
//			_scoreText.text = string.Format("合計：{0}", _valueResult);
//			_scoreText.text = string.Format("{0} {1} {2} = {3}\n{4}手目", _valuePrev, _msgDuty, _valueCur, _valueResult, _moveCnt);
			_scoreText.text = string.Format("{0} {1} {2} = {3}", _valuePrev, _msgDuty, _valueCur, _valueResult);
//			_scoreText.text = string.Format("{0}", _valueResult);
			_scoreText2.text = string.Format("{0}/{1}手目", _moveCnt, _govCnt);
			_clearText.text = string.Format("{0}{1}", _clearNum, _clearStr);
		}
	}

    // サイコロの移動可否確認関数
    public bool ValidMovingDirection(Vector3 pos)
	{
		return _stage.ValidMovingDirection (pos);
	}

	// サイコロが停止したときのイベントハンドラ
	private void OnDiceStop(int value)
	{
		//20161207 mori 座標格納クラス（ゲームオーバー手数分用意）
		Position[] plist = new Position[_govCnt];	//20170118 ←ここでは配列を定義しただけ
		plist[_moveCnt] = new Position();           //20170118 ←こちらで実際に格納するクラスをNewする
		plist[_moveCnt].xposi = (int)_dice.transform.position.x;
		plist[_moveCnt].yposi = (int)_dice.transform.position.z;

		Debug.Log("現在のX座標：" + (int)_dice.transform.position.x);
		Debug.Log("現在のY座標：" + (int)_dice.transform.position.z);
		Debug.Log("現在の手数：" + _moveCnt);
		Debug.Log("ポジションクラスに格納したX座標：" + plist[_moveCnt].xposi);
		Debug.Log("ポジションクラスに格納したY座標：" + plist[_moveCnt].yposi);

		//20170118 戻ったか確認


		// 計算結果を配列に保存 20161019mori
		myNum[_moveCnt] = _valueResult;
		Debug.Log("配列[" + _moveCnt + "]の値：" + myNum[_moveCnt]);

		_moveCnt++;
		Stage.Cell cell = _stage.GetCellFromPosition (_dice.transform.position);
		if (cell != null)
		{
			switch (cell._duty)
			{
			case Stage.Cell.Duty.Null:
			case Stage.Cell.Duty.Equal:
				break;
			default:
				_valuePrev = _valueResult;
				_valueCur = value;
				switch (cell._duty)
				{
				case Stage.Cell.Duty.Plus:
					_msgDuty = "+";
					_valueResult += value;
					break;
				case Stage.Cell.Duty.Minus:
					_msgDuty = "-";
					_valueResult -= value;
					break;
				case Stage.Cell.Duty.Mult:
					_msgDuty = "*";
					_valueResult *= value;
					break;
				case Stage.Cell.Duty.Div:
					_msgDuty = "/";
					_valueResult /= value;
					break;
				}

					// クリア判定
					//switch (_clearCom.ToString())
					switch (_clearCom[0])
					{
						case '=':
							//"イコール判定"
							if (_valueResult == _clearNum)
							{
								_stat = State.CLEAR;
							}
							break;
						case '+':
							//"プラス判定"
							if (_valueResult >= _clearNum)
							{
								_stat = State.CLEAR;
							}
							break;
						case '-':
							//"マイナス判定"
							if (_valueResult <= _clearNum)
							{
								_stat = State.CLEAR;
							}
							break;
					}
					_secStat = 0.0f;
					_msgMsg = "Clear!";
					break;
			}
		}

		//20160907mori
//		Vector3 lastMove;
//		lastMove = _dice.getlastMove();
//		if (lastMove == Vector3.forward) {
//			Debug.Log("↑");
//		}

	}
}

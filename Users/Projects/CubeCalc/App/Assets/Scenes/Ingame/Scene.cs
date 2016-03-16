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

	// 画面表示 20160203mori
	public Text _scoreText; // Text 用変数
	private Color _ccoler = new Color(Random.value, Random.value, Random.value, 1.0f);

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
		_clearNum = (int)Random.Range(0, 1000);
		_valuePrev = 0;
		_valueCur = 0;
		_valueResult = 0;
		_msgDuty = "+";
		_msgMsg = "Answer try to be RES >= " + _clearNum;

		_stage.Load(_floorBlockPrehab);

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
		GUI.Label (new Rect (10, 50, Screen.width - 20, Screen.height - 60), string.Format ("RES = {0} {1} {2} = {3}\n{4}", _valuePrev, _msgDuty, _valueCur, _valueResult, _msgMsg));

		// 表示処理
		if (_stat == State.CLEAR)
		{
			_dice.active = false;
			_scoreText.fontSize = 50;
			_scoreText.color = _ccoler;
			_scoreText.alignment = TextAnchor.MiddleCenter;
			//
			_scoreText.text = _msgMsg;
		}
		else
		{
			_scoreText.text = string.Format("合計：{0}", _valueResult);
		}
    }

    // サイコロの移動可否確認関数
    public bool ValidMovingDirection(Vector3 dir)
	{
		return _stage.ValidMovingDirection (_dice.transform.position, dir);
	}

	// サイコロが停止したときのイベントハンドラ
	private void OnDiceStop(int value)
	{
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
				if (_valueResult >= _clearNum)
				{
					_stat = State.CLEAR;
					_secStat = 0.0f;
					_msgMsg = "Clear!";
				}

				break;
			}
		}
	}
}

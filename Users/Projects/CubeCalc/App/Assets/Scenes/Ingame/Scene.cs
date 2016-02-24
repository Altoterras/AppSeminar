﻿using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class Scene : MonoBehaviour
{
	enum State
	{
		STAT_RUN,
		STAT_CLEAR,
	}

	public GameObject _floorBlockPrehab;
	public Dice _dice;

	private Stage _stage;
	private int _valuePrev = 0;
	private int _valueCur = 0;
	private int _valueResult = 0;
	private State _stat = State.STAT_RUN;
	private string _msgDuty = "+";
	private string _msgMsg = "Answer try to be RES >= 1000";

	// 画面表示 20160203mori
	private Color _ccoler = new Color(Random.value, Random.value, Random.value, 1.0f);
	public Text _scoreText; // Text 用変数

    // 初期化処理
    void Start ()
	{
		_stage = new Stage ();
		_stage.Load (_floorBlockPrehab);

		_dice.validMovingDirection = ValidMovingDirection;	// サイコロの移動可否確認関数
		_dice.onStop = OnDiceStop;  // 停止イベントハンドラを設定する

		_stat = State.STAT_RUN;
	}

	// Update is called once per frame
	void Update ()
	{
	
	}

	// GUI 処理
	void OnGUI()
	{
		// デバッグ表示
		GUI.Label (new Rect (10, 50, Screen.width - 20, Screen.height - 60), string.Format ("RES = {0} {1} {2} = {3}\n{4}", _valuePrev, _msgDuty, _valueCur, _valueResult, _msgMsg));

		// 20151028mori 追加
		if (_stat == State.STAT_CLEAR)
		{
			// 20151104mori 追加
			_scoreText.fontSize = 50;
			_scoreText.color = _ccoler;
			_scoreText.alignment = TextAnchor.MiddleCenter;
			//
			_scoreText.text = _msgMsg;
		}
		else {
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
				if (_valueResult >= 1000)
				{
					_stat = State.STAT_CLEAR;
					_msgMsg = "Clear!!";
				}

				break;
			}
		}
	}
}

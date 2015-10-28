using UnityEngine;
using System.Collections;

public class Scene : MonoBehaviour
{
	public GameObject _floorBlockPrehab;
	public Dice _dice;

	private Stage _stage;
	private int _valuePrev = 0;
	private int _valueCur = 0;
	private int _valueResult = 0;
	private string _msgDuty = "+";
	private string _msgMsg = "Answer try to be RES >= 1000";

	// 初期化処理
	void Start ()
	{
		_stage = new Stage ();
		_stage.Load (_floorBlockPrehab);

		// 停止イベントハンドラを設定する
		_dice.onStop = OnDiceStop;
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
					_msgMsg = "Clear!!";
				}

				break;
			}
		}
	}
}

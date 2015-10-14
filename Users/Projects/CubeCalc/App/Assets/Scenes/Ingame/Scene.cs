using UnityEngine;
using System.Collections;

public class Scene : MonoBehaviour
{
	public GameObject _floorBlockPrehab;
	public Dice _dice;

	private class Cell
	{
		public enum Duty
		{
			Null,
			Plus,
			Minus,
			Mult,
			Div,
			Equal,
		}

		public GameObject _go;
		public Duty _duty;
	}
	private Cell[][] _cells;

	private int _numCellX = 10;
	private int _numCellY = 10;

	private int _valuePrev = 0;
	private int _valueCur = 0;
	private int _valueResult = 0;
	private string _msgDuty = "+";
	private string _msgMsg = "Answer try to be RES <= 1000";

	// 初期化処理
	void Start ()
	{
		_cells = new Cell[_numCellX][];
		for (int i = 0; i < _numCellX; i++)
		{
			_cells[i] = new Cell[_numCellY];
			for (int j = 0; j < _numCellY; j++)
			{
				_cells[i][j] = new Cell();

				GameObject go = (GameObject)Instantiate (_floorBlockPrehab, new Vector3(i - (_numCellX * 0.5f), -1.0f, j - (_numCellY * 0.5f)), transform.rotation);

				/*
				// 適当な色テスト
				go.renderer.material.color = (((i + j) & 0x1) == 0) ? Color.gray : Color.black;

				// 適当なテクスチャテスト
				go.renderer.material.mainTexture =  Resources.Load("Floor/plus") as Texture2D;
				*/

				_cells[i][j]._go = go;
				_cells[i][j]._duty = (Random.value < 0.5f) ? (Cell.Duty)Random.Range ((int)Cell.Duty.Null, (int)Cell.Duty.Equal) : Cell.Duty.Null;

				// 床テクスチャの読み込み
				string texname = "";
				switch(_cells[i][j]._duty)
				{
				case Cell.Duty.Null:	texname = "normal";		break;
				case Cell.Duty.Plus:	texname = "plus";		break;
				case Cell.Duty.Minus:	texname = "minus";		break;
				case Cell.Duty.Mult:	texname = "mult";		break;
				case Cell.Duty.Div:		texname = "div";		break;
				case Cell.Duty.Equal:	texname = "equal";		break;
				}
				_cells[i][j]._go.renderer.material.mainTexture = Resources.Load("Floor/" + texname) as Texture2D;
			}
		}

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
		Vector3 pos = _dice.getPosition ();
		int ix = PosXToIndexX(pos.x);
		int iy = PosZToIndexY(pos.z);
		if ((0 <= ix) && (ix < _numCellX) && (0 <= iy) && (iy < _numCellY))
		{
			switch(_cells[ix][iy]._duty)
			{
			case Cell.Duty.Null:
			case Cell.Duty.Equal:
				break;
			default:
				_valuePrev = _valueResult;
				_valueCur = value;
				switch(_cells[ix][iy]._duty)
				{
				case Cell.Duty.Plus:
					_msgDuty = "+";
					_valueResult += value;
					break;
				case Cell.Duty.Minus:
					_msgDuty = "-";
					_valueResult -= value;
					break;
				case Cell.Duty.Mult:
					_msgDuty = "*";
					_valueResult *= value;
					break;
				case Cell.Duty.Div:
					_msgDuty = "/";
					_valueResult /= value;
					break;
				}

				// クリア判定
				if(_valueResult >= 1000)
				{
					_msgMsg = "Clear!!";
				}

				break;
			}
		}

	}

	private int PosXToIndexX(float x)
	{
		return (int)(x + (_numCellX * 0.5f));
	}
	
	private int PosZToIndexY(float z)
	{
		return (int)(z + (_numCellY * 0.5f));
	}
}

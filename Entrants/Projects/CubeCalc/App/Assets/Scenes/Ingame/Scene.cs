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

	private int _valueCurrent;
	private int _valueResult = 100;

	// Use this for initialization
	void Start ()
	{

		int numX = 10;
		int numY = 10;

		_cells = new Cell[numX][];
		for (int i = 0; i < numX; i++)
		{
			_cells[i] = new Cell[numY];
			for (int j = 0; j < numY; j++)
			{
				_cells[i][j] = new Cell();

				GameObject go = (GameObject)Instantiate (_floorBlockPrehab, new Vector3(i - 5.0f, -1.0f, j - 5.0f), transform.rotation);

				/*
				// 適当な色テスト
				go.renderer.material.color = (((i + j) & 0x1) == 0) ? Color.gray : Color.black;

				// 適当なテクスチャテスト
				go.renderer.material.mainTexture =  Resources.Load("Floor/plus") as Texture2D;
				*/

				_cells[i][j]._go = go;
				_cells[i][j]._duty = (Cell.Duty)Random.Range ((int)Cell.Duty.Null, (int)Cell.Duty.Equal);

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
		_dice.onStop = onDiceStop;
	}
	
	// Update is called once per frame
	void Update ()
	{
	
	}
	// GUI 処理
	void OnGUI()
	{
		// デバッグ表示
		GUI.Label (new Rect (10, 50, Screen.width - 20, Screen.height - 60), string.Format ("value={0}\nresult={1}", _valueCurrent, _valueResult));
	}

	// サイコロが停止したときのイベントハンドラ
	private void onDiceStop(int value)
	{
		_valueCurrent += value;
	}
}

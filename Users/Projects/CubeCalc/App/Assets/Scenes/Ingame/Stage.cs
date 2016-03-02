//------------------------------------------------------------------------------
// <auto-generated>
//     このコードはツールによって生成されました。
//     ランタイム バージョン:4.0.30319.42000
//
//     このファイルへの変更は、以下の状況下で不正な動作の原因になったり、
//     コードが再生成されるときに損失したりします。
// </auto-generated>
//------------------------------------------------------------------------------
using UnityEngine;
using System.Xml;

public class Stage
{
	public class Cell
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

	public Stage ()
	{



	}

	public bool Load(GameObject floorBlockPrehab)
	{
		XmlDocument xdoc = new XmlDocument();		        // XMLオブジェクトを生成
 //		xdoc.Load("http://hakuhou.space/__tmp__/test.xml");	// XMLファイルを読み込む
		TextAsset textAsset = Resources.Load("Stages/n001") as TextAsset;
		xdoc.LoadXml(textAsset.text);

		// 全部配列
		XmlNodeList nodeListText = xdoc.SelectNodes("stage");	// テキストの配列の読み込み
			
		// 表示
		Debug.Log("ORG: " + nodeListText[0].InnerText);





		_numCellX = 0;
		_numCellY = 0;

		string[] lines = nodeListText [0].InnerText.Split ('\n');
		for (int il = 0; il < lines.Length; il++)
		{
			string line = lines[il];
			int cnt = 0;
			foreach(char c in line)
			{
				if(c != '\r') { cnt++; }
			}
			if(cnt <= 0) { continue; }

			_numCellY++;
			if(_numCellX < cnt) { _numCellX = cnt; }
		}

		
		_cells = new Cell[_numCellX][];
		for (int i = 0; i < _numCellX; i++)
		{
			_cells [i] = new Cell[_numCellY];
			for (int j = 0; j < _numCellY; j++)
			{
				_cells [i] [j] = new Cell ();
				_cells[i][j]._go = (GameObject)UnityEngine.Object.Instantiate (floorBlockPrehab, new Vector3(i - (_numCellX / 2), -1.0f, j - (_numCellY / 2)), Quaternion.identity);
			}
		}
		
		{
			int j = 0;
			for (int il = 0; il < lines.Length; il++)
			{
				string line = lines[il];

				int i = 0;
				foreach(char c in line)
				{
					if(c == '\r') { continue; }

					Cell cell = _cells [i] [j];
					Debug.Log(string.Format("[{0}][{1}] c={2}, {3}", i, j, c, (int)c));
				

					switch(c)
					{
					case '+':	cell._duty = Cell.Duty.Plus;	break;
					case '-':	cell._duty = Cell.Duty.Minus;	break;
					case '*':	cell._duty = Cell.Duty.Mult;	break;
					case '/':	cell._duty = Cell.Duty.Div;		break;
					default:	cell._duty = Cell.Duty.Null;	break;
					}
					
					// 床テクスチャの読み込み
					string texname = "";
					switch(cell._duty)
					{
					case Cell.Duty.Null:	texname = "normal";		break;
					case Cell.Duty.Plus:	texname = "plus";		break;
					case Cell.Duty.Minus:	texname = "minus";		break;
					case Cell.Duty.Mult:	texname = "mult";		break;
					case Cell.Duty.Div:		texname = "div";		break;
					case Cell.Duty.Equal:	texname = "equal";		break;
					}
					cell._go.GetComponent<Renderer>().material.mainTexture = Resources.Load("Floor/" + texname) as Texture2D;

					i++;
				}

				if(i > 0 ) { j++; }
			}
		}		
		
		
		
		
		
#if false
		_cells = new Cell[_numCellX][];
		for (int i = 0; i < _numCellX; i++)
		{
			_cells[i] = new Cell[_numCellY];
			for (int j = 0; j < _numCellY; j++)
			{
				_cells[i][j] = new Cell();
				
				GameObject go = (GameObject)UnityEngine.Object.Instantiate (floorBlockPrehab, new Vector3(i - (_numCellX * 0.5f), -1.0f, j - (_numCellY * 0.5f)), Quaternion.identity);
				
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
				_cells[i][j]._go.GetComponent<Renderer>().material.mainTexture = Resources.Load("Floor/" + texname) as Texture2D;
			}
		}
#endif

		return true;
	}
	
	public bool ValidMovingDirection(Vector3 pos, Vector3 dir)
	{
		pos += dir;
		int ix = PosXToIndexX (pos.x);
		int iy = PosZToIndexY (pos.z);
		if ((0 <= ix) && (ix < _numCellX) && (0 <= iy) && (iy < _numCellY))
		{
			return true;
		}

		return false;
	}
	
	public Cell GetCellFromPosition(Vector3 pos)
	{
		int ix = PosXToIndexX (pos.x);
		int iy = PosZToIndexY (pos.z);
		if ((0 <= ix) && (ix < _numCellX) && (0 <= iy) && (iy < _numCellY))
		{
			return _cells[ix][iy];
		}

		return null;
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


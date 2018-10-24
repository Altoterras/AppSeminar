using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO; //System.IO.FileInfo, System.IO.StreamReader, System.IO.StreamWriter
using System; //Exception
using System.Text; //Encoding

public class SaveSys : MonoBehaviour {

	//========================================================================
	// 定数

	private static readonly string SAVE_FILE_PATH = Application.dataPath + "/save.dat";

	private static readonly string ENCRYPT_KEY = "c6eahbq9sjuawhvdr9kvhpsm5qv393ga";
	private static readonly int ENCRYPT_PASSWORD_COUNT = 16;
	private static readonly string PASSWORD_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private static readonly int PASSWORD_CHARS_LENGTH = PASSWORD_CHARS.Length;

	//========================================================================

	//====
	// フィールド変数
	private int _csnum;     //クリアステージ数
	private int[] _hscore;  //ハイスコア
//	private int[][] _hscore;  //ハイスコア

	private string _content;
	
	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
		
	}

	// クリア済みステージ数
	public int CsNum
	{
		get { return _csnum; }
		set	{ _csnum = value; }
	}
	// ハイスコア
	public int[] HScore
	{
		get { return _hscore; }
		set { _hscore = value; }
	}


	// クリアステージ数を更新
	public void CsnumUpd (int csn) {
//		Debug.Log("旧ステージ数：" + _csnum);
		if (csn > _csnum) {
			_csnum = csn;
		}
//		Debug.Log("ステージ数更新：" + _csnum);
	}

	// ハイスコア保存
	public void HScoreSave(int stn, int hsc)
	{
//		Debug.Log("旧ハイスコア：" + _hscore[stn]);
		if (_hscore[stn] > hsc) {
			// 手数がハイスコア（最小手数）より少ない場合、ハイスコアを更新
			_hscore[stn] = hsc;
			this.SaveFile();
		}
//		Debug.Log("ハイスコア更新：" + _hscore[stn]);
	}

	// 外部ファイル読み込み
	public void ReadFile()
	{
		//↓1017次回ここから　ファイル読み込みを全体読み込みに
		string _fsflg = "0";
		int i = 1;

		// FileReadTest.txtファイルを読み込む
		FileInfo fi = new FileInfo(Application.dataPath + "/" + "FileReadTest.txt");

		// 一行毎読み込み
		StreamReader sr = new StreamReader(fi.OpenRead(), Encoding.UTF8);

		//クリアステージ数読み込み
		_csnum = int.Parse(sr.ReadLine());  
		_content = sr.ReadLine();

/*
		for (i = 0 ; _content == "eof" ; i++ ) {
			if (_fsflg == "1") {
				// ハイスコア読み込み
				_hscore[i] = int.Parse(_content);
			}
			_content = sr.ReadLine();
			if (_content == "HStart") { _fsflg = "1"; _content = sr.ReadLine(); 
		}
*/

		while (true) {
			if (_content == "eof")
			{
				//ファイルを最後まで読み終わった場合
				break;
			}
			if (_fsflg == "1") {
				// ハイスコア読み込み
				_hscore[i] = int.Parse(_content);
				i++;
			}
			_content = sr.ReadLine();
			if (_content == "HStart") { _fsflg = "1"; _content = sr.ReadLine(); }
		}
	}
	
	// 外部ファイル保存
	public void SaveFile()
	{
		FileInfo fi = new FileInfo(Application.dataPath + "/" + "FileReadTest.txt");
		Debug.Log("save!");
		// ファイル書き出し
		// 現在のフォルダにsaveData.csvを出力する(決まった場所に出力したい場合は絶対パスを指定してください)
		// 引数説明：第1引数→ファイル出力先, 第2引数→ファイルに追記(true)or上書き(false), 第3引数→エンコード
		//		StreamWriter sw = new StreamWriter(Application.dataPath + "/" + "FileReadTest.txt", false, Encoding.GetEncoding("Shift_JIS"));
		StreamWriter sw = new StreamWriter(fi.OpenWrite(), Encoding.UTF8);
		StreamReader sr = new StreamReader(fi.OpenRead(), Encoding.UTF8);
		//sw = fi.AppendText();
		//クリアステージ数読み込み
		//		_csnum = int.Parse(sw.WriteLine());
		//		_content = sr.ReadLine();
		sw.WriteLine("aaaaaaa");

		// ハイスコア格納まで読み飛ばし
		/*
				// データ出力
				for (int i = 0; i < 3; i++)
				{
					string[] str = { "tatsu", "" + (i + 1) };
					string str2 = string.Join(",", str);
					sw.WriteLine(str2);
				}
		*/
		// StreamWriterを閉じる
		sw.Close();



	}

	// シリアライズ

	// デシリアライズ

}

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
	private int _csnum;		//クリアステージ数
	private int[] _hscore;  //ハイスコア

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


	// 外部ファイル読み込み
	public void ReadFile()
	{
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
		// World.Load();
	}
	
	// 外部ファイル保存
	public void SaveFile()
	{
		// World.Save()
	}

	// シリアライズ

	// デシリアライズ

	}

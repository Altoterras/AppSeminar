using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// 共通変数クラス
public static class World {

	//====
	// フィールド変数

	private static int _stageMax = 3; // ステージ最大数
	private static int _stageCnt = 0; // ステージNo
	private static　int _csNum; //クリアステージ数
	private static int[] _hScore;  //ハイスコア

	//====
	// プロパティ

	public static int StageMax
	{
		get
		{
			return _stageMax;
		}

		set
		{
			_stageMax = value;
		}
	}

	public static int StageCnt
	{
		get
		{
			return _stageCnt;
		}

		set
		{
			_stageCnt = value;
		}
	}

	public static int CsNum
	{
		get
		{
			return _csNum;
		}

		set
		{
			_csNum = value;
		}
	}

	public static int[] Hscore
	{
		get
		{
			return _hScore;
		}

		set
		{
			_hScore = value;
		}
	}


	// クリアステージ数を更新
	public static void CsnumUpd(int csn)
	{
		//		Debug.Log("旧ステージ数：" + _csnum);
		if (csn > _csNum)
		{
			_csNum = csn;
		}
		//		Debug.Log("ステージ数更新：" + _csnum);
	}

	// ハイスコア保存
	public static void HScoreSave(int stn, int hsc)
	{
		int i = stn;
		//		Debug.Log("旧ハイスコア：" + _hscore[i]);
		if (_hScore[i] > hsc)
		{
			// 手数がハイスコア（最小手数）より少ない場合、ハイスコアを更新
			_hScore[i] = hsc;
		}
		//		Debug.Log("ハイスコア更新：" + _hscore[i]);
	}

	// ワールドクラスにセーブデータをロード
	public static void Load()
	{

	}

	// ワールドクラスからセーブデータに書き込み
	public static void Save()
	{

	}
}

package com.learmens.danmen1;

import java.util.Locale;

/**
 * 品物テーブル
 *
 */
public class ArticleTable
{
	//======================================================================
	// 定数

	// 実行種別
	public enum ActionType
	{
		KIND_SEL,		// 選択画面
		KIND_UNCUT,		// 未切断
		KIND_VCUT,		// 縦切り
		KIND_HCUT,		// 横切り
		KIND_CIRCLE		// 回し切り
	}

	//======================================================================
	// メソッド
	
	// 画像リソース ID を取得する
	public static int getImageResourceId(int sid)
	{
		DanmenData dm = DanmenData.getInstance();
		int resId = dm.getImageResourceId(String.format(Locale.JAPANESE, "%1$04d", sid));
		return resId;
	}
	
	// 音声のリソース ID を取得する
	public static int getVoiceResourceId(int sid)
	{
		DanmenData dm = DanmenData.getInstance();
		int resId = dm.getMediaResourceId(String.format(Locale.JAPANESE, "%1$04d", sid));
		return resId;
	}
	
	// 最初の状態 ID を取得する
	public static int getFirstStateId(int aid, ActionType type)
	{
		int state;
		switch(type)
		{
		default:
		case KIND_SEL:
			state = 0;
			break;
		case KIND_UNCUT:
			state = 1;
			break;
		case KIND_VCUT:		// 縦切り
			state = 2;
			break;
		case KIND_HCUT:		// 横切り
			state = 3;
			break;
		case KIND_CIRCLE:	// 回し切り
			state = 4;
			break;
		}
		return aid * 100 + state;
	}

	// 次の状態 ID を取得する
	public static int getNextStateId(int sid, ActionType type)
	{
		int column = 0;
		switch(type)
		{
		case KIND_VCUT:		// 縦切り時の画像
			column = DanmenData.Columns.VIRTICAL;
			break;
		case KIND_HCUT:		// 横切り時の画像
			column = DanmenData.Columns.HORIZONTAL;
			break;
		case KIND_CIRCLE:	// 回し切り時の画像
			column = DanmenData.Columns.ROUND;
			break;
		default:
			break;
		}
		if(column == 0)
		{
			return 0;
		}
		DanmenData dm = DanmenData.getInstance();
		String strSid = dm.getNextStateId(String.format(Locale.JAPANESE, "%1$04d", sid), column);
		if(strSid == null)
		{
			return 0;
		}
		return Integer.parseInt(strSid);
	}
		
	// 種類数を取得する
	public static int getArticleKindCount()
	{
		return DanmenData.getInstance().getArticleCount();
	}
}

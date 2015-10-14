package com.example.tourismapp;

public class ResortTable
{
	//======================================================================
	// 定数
	
	public static final int NUM_ARTICLE = 10;

	public enum Kind
	{
		KIND_SEL,		//SELECT
		//KIND_GET,       //スタンプ取得
		//KIND_RESULT,	  //結果画面
	}

	//======================================================================
	// メソッド
	
	public static int GetImageResourceId(Kind kind,int index)
	{
//		return 0;
		
		switch (kind)
		{
		case KIND_SEL:		// SelectActivityの画像
			switch(index)
			{
			case 0: return R.drawable.button_resort1;
			case 1:	return R.drawable.button_resort2;
			case 2: return R.drawable.button_resort3;
			case 3: return R.drawable.button_resort4;
			case 4: return R.drawable.button_resort5;
			case 5: return R.drawable.button_resort5;
			case 6: return R.drawable.button_resort;
			case 7: return R.drawable.button_resort;
			case 8: return R.drawable.button_resort;
			case 9: return R.drawable.button_resort;
			}
			break;
		default:
			break;
		}
		//err
		return 0;
	}
}


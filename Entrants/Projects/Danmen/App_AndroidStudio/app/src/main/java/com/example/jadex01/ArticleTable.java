package com.example.jadex01;

public class ArticleTable
{
	//======================================================================
	// 定数
	
	public static final int NUM_ARTICLE = 5;

	public enum Kind
	{
		KIND_SEL,		//SELECT
		KIND_ACT,       //ACTION
		KIND_UNCUT,		//未切断
		KIND_VCUT,		//縦切り
		KIND_HCUT		//横切り
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
			/*
			case 0: return R.drawable.kiwi_s;	
			case 1:	return R.drawable.apple_s;	
			case 2: return R.drawable.tomato_s;	
			case 3: return R.drawable.piment_s;	
			case 4: return R.drawable.avocado_s;
			*/
			case 0: return R.drawable.kiwi_ss;
			case 1:	return R.drawable.apple_ss;
			case 2: return R.drawable.tomato_ss;
			case 3: return R.drawable.piment_ss;
			case 4: return R.drawable.avocado_ss;
			}
			break;
		case KIND_UNCUT:	// 未切断時の画像
			switch(index)
			{
			case 0: return R.drawable.kiwi_u;	
			case 1:	return R.drawable.apple_u;	
			case 2: return R.drawable.tomato_u;	
			case 3: return R.drawable.piment_u;	
			case 4: return R.drawable.avocado_u;	
			}
			break;
		case KIND_VCUT:		// 縦切り時の画像
			switch(index)
			{
			case 0: return R.drawable.kiwi_v;	
			case 1:	return R.drawable.apple_v;	
			case 2: return R.drawable.tomato_v;	
			case 3: return R.drawable.piment_v;	
			case 4: return R.drawable.avocado_v;	
			}
			break;
		case KIND_HCUT:		// 横切り時の画像
			switch(index)
			{
			case 0: return R.drawable.kiwi_h;	
			case 1:	return R.drawable.apple_h;	
			case 2: return R.drawable.tomato_h;	
			case 3: return R.drawable.piment_h;	
			case 4: return R.drawable.avocado_h;	
			}
			break;
		default:
			break;
		}
		//err
		return 0;
	}
	
	public static int GetVoiceResourceId(Kind kind, int index)
	{
		switch (kind)
		{
		case KIND_SEL:		// SelectActivity
			switch(index)
			{
			case 0: return R.raw.kiwi;	      //キウイ
			case 1:	return R.raw.apple;	      //りんご
			case 2: return R.raw.tomato;      //トマト	
			case 3: return R.raw.piment;      //ピーマン	
			case 4: return R.raw.avocado;	  //アボカド
			}
			break;
		default:
			break;
		}
		//err
		return 0;
	}
}

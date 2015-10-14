package jp.co.altoterras.fortune;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

public class ResultActivity extends Activity
{
	//======================================================================
	// 変数
	
	private TextView _txtviewResult;

	//======================================================================
	// メソッド
	
	/**
	 * 乱数による★付け
	 * 
	 */
	private void randomStars(char[] carr, Random rand)
	{
		for(int i = 0; i < 5; i++)
		{
			carr[i] = 0;
		}
		
		char star = getResources().getString(R.string.star_text).charAt(0);
		int r = rand.nextInt();
		switch(r & 7)
		{
		case 0:
		case 1:
			carr[0] = carr[1] = carr[2] = carr[3] = carr[4] = star;
			break;
		case 2:
		case 3:
			carr[0] = carr[1] = carr[2] = carr[3] = star;
			break;
		case 4:
		case 5:
			carr[0] = carr[1] = carr[2] = star;
			break;
		case 6:
			carr[0] = carr[1] = star;
			break;
		default:
			carr[0] = star;
			break;
		}
	}
	
	/**
	 * 結果表示の更新
	 * 
	 */
	protected void updateResult(int year, int month, int day)
	{
		String strFmt = getResources().getString(R.string.result_template_text);
		
		// 乱数の作成
		Random rand = new Random();
		Calendar calNow  = new GregorianCalendar();
		long rseed = calNow.get(Calendar.YEAR) + calNow.get(Calendar.MONTH) + 1 + calNow.get(Calendar.DAY_OF_MONTH) + year + month + day;
		rand.setSeed(rseed);
		
		// 乱数による★付け
		char[] carrTotal = new char[5];
		char[] carrRomance = new char[5];
		char[] carrMoney = new char[5];
		char[] carrWork = new char[5];
		randomStars(carrTotal, rand);
		randomStars(carrRomance, rand);
		randomStars(carrMoney, rand);
		randomStars(carrWork, rand);

		// テキストフィールドに設定
		String strRes = String.format(
			strFmt,
			year, month, day,
			carrTotal[0], carrTotal[1], carrTotal[2], carrTotal[3], carrTotal[4],
			carrRomance[0], carrRomance[1], carrRomance[2], carrRomance[3], carrRomance[4],
			carrMoney[0], carrMoney[1], carrMoney[2], carrMoney[3], carrMoney[4],
			carrWork[0], carrWork[1], carrWork[2], carrWork[3], carrWork[4]	);
		_txtviewResult.setText(strRes);
	}

	/**
	 * 作成イベントハンドラ
	 * 
	 */
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_result);

		// 変数と GUI リソースの関連付け
		_txtviewResult = (TextView)this.findViewById(R.id.textViewResult);
		
		// 結果の設定
		Intent intent = getIntent();
		int year = intent.getIntExtra("YEAR", 0);
		int month = intent.getIntExtra("MONTH", 0);
		int day = intent.getIntExtra("DAY", 0);
		updateResult(year, month, day);
	}

}

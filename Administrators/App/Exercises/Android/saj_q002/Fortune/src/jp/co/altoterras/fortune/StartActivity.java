package jp.co.altoterras.fortune;

import android.app.Activity;
//import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.ImageButton;

public class StartActivity extends Activity implements View.OnClickListener
{
	//======================================================================
	// 変数

	private ImageButton _imgbtnStart;

	//======================================================================
	// メソッド

	/**
	 * 作成イベントハンドラ
	 * 
	 */
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_start);

		// 変数と GUI リソースの関連付け
		_imgbtnStart = (ImageButton)this.findViewById(R.id.imageButtonStart);
		_imgbtnStart.setOnClickListener(this);
	}

	/**
	 * オプションメニュー作成イベントハンドラ
	 * 
	 */
	@Override
	public boolean onCreateOptionsMenu(Menu menu)
	{
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_start, menu);
		return true;
	}

	/**
	 * クリック イベントハンドラ
	 * 
	 */
	@Override
	public void onClick(View view)
	{
		if(view == _imgbtnStart)
		{
			Intent intent = new Intent(this, jp.co.altoterras.fortune.FortuneInputActivity.class);
			startActivity(intent);
		}
	}

}

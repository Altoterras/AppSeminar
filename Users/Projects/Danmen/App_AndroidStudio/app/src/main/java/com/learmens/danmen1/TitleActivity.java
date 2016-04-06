package com.learmens.danmen1;

import android.os.Build;
import android.os.Bundle;
import android.annotation.SuppressLint;
import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
//import android.content.res.Configuration;
//import android.view.Menu;
import android.view.View;
import android.widget.ImageButton;

/**
 *	タイトルアクティビティ
 *
 */
public class TitleActivity extends Activity implements View.OnClickListener
{
	//======================================================================
	// 変数
	
	private ImageButton _buttonStart;
	private ImageButton _buttonManual;
	
	//======================================================================
	// メソッド
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_title);
		hideActionBar();
		
		// csv クラスの初期化
		DanmenData.init(this.getApplicationContext());
		
		//タイトルコール
		MediaPlayerEx.play(this, R.raw.title);
		
		//はじめるボタン
		_buttonStart = (ImageButton)this.findViewById(R.id.buttonStart);
		_buttonStart.setOnClickListener(this);
		
		//つかいかたボタン
		_buttonManual = (ImageButton)this.findViewById(R.id.buttonManual);
		_buttonManual.setOnClickListener(this);
	}
	
	@SuppressLint("NewApi")
	private void hideActionBar()
	{
		if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB)
		{
			ActionBar actionBar = getActionBar();
			if(actionBar != null) { actionBar.hide(); }
		}
	}

	/*
	@Override
	public boolean onPrepareOptionsMenu(Menu menu)
	{
		return false;	// メニューは出さない
	}
	@Override
	public boolean onCreateOptionsMenu(Menu menu)
	{
		//getMenuInflater().inflate(R.menu.title, menu);
		//return true;
		return false;
	}
	*/

	@Override
	public void onClick(View view)
	{
		Intent intent = null;
		if (view == _buttonStart)	// はじめるボタン
		{
			intent = new Intent(this.getApplicationContext(), SelectActivity.class);
		}
		else if (view == _buttonManual)	// つかいかたボタン
		{
			intent = new Intent(this.getApplicationContext(), ManualActivity.class);
		}
		// 移動する
		if (intent != null)
		{
			intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
			this.startActivity(intent);
		}
	}
}

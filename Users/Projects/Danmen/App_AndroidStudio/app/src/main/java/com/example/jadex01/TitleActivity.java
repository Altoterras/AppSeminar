package com.example.jadex01;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.ImageButton;

/*---------------------------------------------------------------------*//**
 *	タイトルアクティビティ
 *
**//*---------------------------------------------------------------------*/
public class TitleActivity extends Activity implements View.OnClickListener {
	
	//======================================================================
	// 変数
	
	private ImageButton _buttonStart;
	private ImageButton _buttonManual;
	
	//======================================================================
	// メソッド
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_title);
		
		//タイトルコール
		MediaPlayerEx.play(this, R.raw.title);
		//MediaPlayer mp = MediaPlayer.create(this, R.raw.title);
		/*
		MediaPlayer mp = new MediaPlayer();
		Uri uri = Uri.parse(new StringBuffer("android.resource://").append(getPackageName()).append("/").append(R.raw.title).toString());
		try {
			
			mp.setDataSource(this.getApplicationContext(), uri);
			// 音量
			mp.setAudioStreamType(AudioManager.STREAM_NOTIFICATION);
			// 初期化
			mp.setLooping(false);
			mp.prepare();
			mp.seekTo(0);
			// 開始
			mp.start();
			
		} catch (IOException ex) {
			ex.printStackTrace();
		} finally {
			if (mp != null) {
				mp = null;
			}
		}
		*/
		
		//はじめるボタン
		_buttonStart = (ImageButton)this.findViewById(R.id.buttonStart);
		_buttonStart.setOnClickListener(this);
		//つかいかたボタン
		_buttonManual = (ImageButton)this.findViewById(R.id.buttonManual);
		_buttonManual.setOnClickListener(this);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.title, menu);
		return true;
	}

	@Override
	public void onClick(View view) {
		
		if (view == _buttonStart)  {	//はじめるボタン
			Intent intent = new Intent(this, com.example.jadex01.SelectActivity.class);
			startActivity(intent);
		}
		else if (view == _buttonManual)  {	//つかいかたボタン
			Intent intent = new Intent(this, com.example.jadex01.ManualActivity.class);
			startActivity(intent);
		}

	}
	
}

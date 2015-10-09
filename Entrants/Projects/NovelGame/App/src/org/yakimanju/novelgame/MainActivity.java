package org.yakimanju.novelgame;

import jp.co.appSeminar.example.novelgame.R;
import android.annotation.SuppressLint;
import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.webkit.*;

public class MainActivity extends Activity implements View.OnClickListener{

	@SuppressLint("SetJavaScriptEnabled")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

	    WebView wvMain = (WebView)findViewById(R.id.webviewMain);
	    WebSettings websettings = wvMain.getSettings();
	    websettings.setJavaScriptEnabled(true);
	    wvMain.setWebViewClient(new WebViewClient()); 	// 標準ブラウザに行かないようにする
	    //wvMain.loadUrl("file:///android_asset/_index.html");
	    //wvMain.loadUrl("http://www.yahoo.co.jp/");	}
		wvMain.loadUrl("file:///android_asset/index.html");
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.title, menu);
		return true;
	}

	@Override
	public void onClick(View arg0) {
		// TODO 自動生成されたメソッド・スタブ
		Intent intent = null;//new Intent(this, com.example.jadex01.SelectActivity.class);
		startActivity(intent);
	}

}

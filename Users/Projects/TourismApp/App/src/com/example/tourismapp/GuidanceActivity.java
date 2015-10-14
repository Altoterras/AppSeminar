package com.example.tourismapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.webkit.*;
import android.widget.ImageButton;

/*---------------------------------------------------------------------*//**
 *	タイトルアクティビティ
 *
**//*---------------------------------------------------------------------*/
public class GuidanceActivity extends Activity implements View.OnClickListener {
	
	//======================================================================
	// 変数
	
	private ImageButton _buttonBack;
	
	//======================================================================
	
	@Override
	  protected void onCreate(Bundle savedInstanceState) {
	    super.onCreate(savedInstanceState);
	    setContentView(R.layout.activity_guidance);
	    
	    // QRコード読取りからの引渡し情報を取得
	    String uri = this.getIntent().getStringExtra(this.getClass().toString());
	    
	    if (uri == null) {
	    	// 初期値
	    	uri = "file:///android_asset/test.html";
	    	
	    }
	    
	    //以下2行を追加
	    WebView webView1 = (WebView)findViewById(R.id.webviewGuidance);
	    webView1.loadUrl(uri);
	    
		//戻るボタン
		_buttonBack = (ImageButton)this.findViewById(R.id.buttonBack);
		_buttonBack.setOnClickListener(this);	     
	}
	  
		@Override
		public void onClick(View view) {
			
			if (view == _buttonBack)  {	//戻るボタン
				//Intent intent = new Intent(this, com.example.tourismapp.@@@@Activity.class);
				//startActivity(intent);
				finish();
			}
		}
}

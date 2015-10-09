package com.example.tourismapp;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.ImageButton;

import com.example.tourismapp.TourData;

/*---------------------------------------------------------------------*//**
 *	タイトルアクティビティ
 *
**//*---------------------------------------------------------------------*/
public class TitleActivity extends Activity implements View.OnClickListener  {
	
	//======================================================================
	// 変数

	private ImageButton _buttonEnter;
	private ImageButton _buttonQRCode;
	
	//======================================================================

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_title);
		
		// データのインスタンス化
		TourData tourdata = TourData.getInstance(this.getApplicationContext());
		
		//はじめるボタン
		_buttonEnter = (ImageButton)this.findViewById(R.id.buttonEnter);
		_buttonEnter.setOnClickListener(this);
		
		// QRコード読取起動
		_buttonQRCode = (ImageButton)this.findViewById(R.id.buttonQrcode);
		_buttonQRCode.setOnClickListener(this);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.title, menu);
		return true;
	}
	
	@Override
	public void onClick(View view) {
		
		if (view == _buttonEnter)  {	//はじめるボタン
			Intent intent = new Intent(this.getApplicationContext(), 
						com.example.tourismapp.SelectActivity.class);
			startActivity(intent);
		}
		else if (view.equals(_buttonQRCode))  {	// QRコード読取ボタン
			//Intent intent = new Intent(this.getApplicationContext(),
			//						com.example.tourismapp.ZxingActivity.class);
            Intent intent = new Intent(this, com.example.tourismapp.qrcode.QrcodeActivity.class);
            startActivity(intent);
		}

	}

}



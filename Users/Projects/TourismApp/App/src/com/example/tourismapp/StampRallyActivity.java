package com.example.tourismapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

/*---------------------------------------------------------------------*//**
 *	スタンプラリーアクティビティ
 *
**//*---------------------------------------------------------------------*/
public class StampRallyActivity extends Activity implements View.OnClickListener  {

	//======================================================================
	// 変数
	
	private ImageButton _buttonStamp;	
	
	//======================================================================

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_stamprally);
		//はじめるボタン
		_buttonStamp = (ImageButton)this.findViewById(R.id.buttonStamp);
		_buttonStamp.setOnClickListener(this);
	}
	
	@Override
	public void onClick(View view) {
		
		if (view == _buttonStamp)  {	//はじめるボタン
            //Intent intent = new Intent(this, com.example.tourismapp.ZxingActivity.class);
            Intent intent = new Intent(this, com.example.tourismapp.qrcode.QrcodeActivity.class);
            startActivity(intent);
		}
/*		else if (view == _button@@@@@)  {	//つかいかたボタン
			Intent intent = new Intent(this, com.example.tourismapp.@@@@Activity.class);
			startActivity(intent);
		}
*/
	}
	
}

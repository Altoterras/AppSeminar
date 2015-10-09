package com.example.jadex01;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

public class ManualActivity extends Activity implements View.OnClickListener{
	//======================================================================
	// メソッド
	
	@Override
	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_manual);
		// ボタン設定
		ImageButton buttonReturn = (ImageButton)this.findViewById(R.id.buttonReturnTitle);
		buttonReturn.setOnClickListener(this);
		
	}
	
	@Override
	public void onClick(View view){
		if (view == this.findViewById(R.id.buttonReturnTitle)){
			Intent intent = new Intent(this, com.example.jadex01.TitleActivity.class);
			startActivity(intent);
		}
	}
}

package com.learmens.danmen1;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

/**
 * 使い方アクティビティ
 *
 */
public class ManualActivity extends Activity implements View.OnClickListener
{
	//======================================================================
	// メソッド
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_manual);
		// ボタン設定
		ImageButton buttonReturn = (ImageButton)this.findViewById(R.id.buttonReturnTitle);
		buttonReturn.setOnClickListener(this);		
	}
	
	@Override
	public void onClick(View view)
	{
		if (view == this.findViewById(R.id.buttonReturnTitle))
		{
			this.finish();
		}
	}
}

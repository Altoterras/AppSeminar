package org.yakimanju.chiikuapp1;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
//import android.widget.ImageButton;

public class TitleActivity extends Activity implements View.OnClickListener {
	
	//=======================================================
	// ïœêî
	
	private Button _btnStart;
	private Button _btnManual;
	
	//=======================================================
	// ÉÅÉ\ÉbÉh	
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_title);
		
		_btnStart = (Button)this.findViewById(R.id.btnStart);
		_btnStart.setOnClickListener(this);
		
		_btnManual = (Button)this.findViewById(R.id.btnManual);
		_btnManual.setOnClickListener(this);
		
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.title, menu);
		return true;
	}

	@Override
	public void onClick(View view) {
		
		if (view == _btnStart)
		{	
			/*
			Intent intent = new Intent(this, org.yakimanju.chiikuapp1.MainMenuActivity.class);
			startActivity(intent);
			*/
		}
		
		if (view == _btnManual)
		{	
			/*
			Intent intent = new Intent(this, org.yakimanju.chiikuapp1.ResultActivity.class);
			startActivity(intent);
			*/
		}

	}
	
}

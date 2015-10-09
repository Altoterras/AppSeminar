package com.example.jadex01test;

import com.example.jadex01.R;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.Button;

public class TitleActivity extends Activity implements View.OnClickListener {
	
	private Button _buttonStart;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_title);
		
		_buttonStart = (Button)this.findViewById(R.id.buttonStart);
		_buttonStart.setOnClickListener(this);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.title, menu);
		return true;
	}

	@Override
	public void onClick(View view) {
		// TODO Auto-generated method stub
		if (view == _buttonStart)  {
			Intent intent = new Intent(this, com.example.jadex01test.SelectActivity.class);
			startActivity(intent);
		}
	}

	
}

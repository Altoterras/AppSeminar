package com.example.tourismapp;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ImageButton;
import android.widget.Toast;

public class ResultActivity extends Activity {

	
	public static final String STAMP_PARAMETER = "com.example.tourismapp.StampParameter";
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// TODO  rename
		setContentView(R.layout.activity_result);
		
		String param = this.getIntent().getStringExtra(ResultActivity.STAMP_PARAMETER);
		
		Toast.makeText(getApplicationContext(), "PRM: " + param, Toast.LENGTH_LONG).show();
	}
	
}

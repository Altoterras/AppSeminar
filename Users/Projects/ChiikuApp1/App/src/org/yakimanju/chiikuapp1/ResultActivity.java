package org.yakimanju.chiikuapp1;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;

public class ResultActivity extends Activity implements View.OnClickListener {
	
	//=======================================================
	// ïœêî
	
	private Button _btnTest;
	
	//=======================================================
	// ÉÅÉ\ÉbÉh
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_result);
		
		_btnTest = (Button)this.findViewById(R.id.button1);
		_btnTest.setOnClickListener(this);	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.title, menu);
		return true;
	}

	@Override
	public void onClick(View view) {
		
		if (view == _btnTest)
		{	
			Intent intent = new Intent(this, org.yakimanju.chiikuapp1.ResultActivity.class);
			startActivity(intent);
		}

	}
	
}
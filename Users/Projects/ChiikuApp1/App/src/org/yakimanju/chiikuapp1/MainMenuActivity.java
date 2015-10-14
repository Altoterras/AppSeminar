package org.yakimanju.chiikuapp1;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.Button;

public class MainMenuActivity extends Activity implements View.OnClickListener {
	
	//=======================================================
	// ïœêî
	
	private Button _btnGame;
	
	//=======================================================
	// ÉÅÉ\ÉbÉh
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_mainmenu);
		
		_btnGame = (Button)this.findViewById(R.id.button1);
		_btnGame.setOnClickListener(this);	}

//	@Override
//	public boolean onCreateOptionsMenu(Menu menu) {
//		getMenuInflater().inflate(R.menu.title, menu);
//		return true;
//	}

	@Override
	public void onClick(View view) {
		
		if (view == _btnGame)
		{	
			Intent intent = new Intent(this, org.yakimanju.chiikuapp1.IngameActivity.class);
			startActivity(intent);
		}

	}
	
}
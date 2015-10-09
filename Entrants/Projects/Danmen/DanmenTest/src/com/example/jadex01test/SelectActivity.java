package com.example.jadex01test;

import com.example.jadex01test.HorizontalScrollExView;
import com.example.jadex01.R;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;

public class SelectActivity extends Activity implements View.OnClickListener {
	
	private Button 			_buttonReturn;
	private ImageButton[]	_imgbtnArticles;
	private final int		NUM_ARTICLE = 2;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_select);
		
		_buttonReturn = (Button)this.findViewById(R.id.buttonReturnTitle);
		_buttonReturn.setOnClickListener(this);
		
		HorizontalScrollExView hsev = (HorizontalScrollExView) findViewById(R.id.hsvArticleSelect);
		_imgbtnArticles = new ImageButton[NUM_ARTICLE];
		for(int i = 0; i < NUM_ARTICLE; i++)
		{
			_imgbtnArticles[i] = new ImageButton(this);
			int rid = 0;
			switch(i)
			{
			case 0:	rid = R.drawable.kiwi_s;	break;
			case 1:	rid = R.drawable.apple_s;	break;
			}
			if(rid == 0)	{	break;	}
			_imgbtnArticles[i].setImageResource(rid);
			_imgbtnArticles[i].setOnClickListener(this);
			hsev.addChildScrolledView(_imgbtnArticles[i]);
		}
	}

	@Override
	public void onClick(View view) {
		// TODO Auto-generated method stub
		
		if (view == _buttonReturn)
		{
			Intent intent = new Intent(this, com.example.jadex01test.TitleActivity.class);
			startActivity(intent);
		}
		else if(view instanceof ImageButton)
		{
			for(int i = 0; i < NUM_ARTICLE; i++)
			{
				if(_imgbtnArticles[i] == view)
				{
					///Log.d("Danmen", "*** 1 ***");
					Intent intent = new Intent(this, com.example.jadex01test.ActionActivity.class);
					startActivity(intent);
					break;
				}
			}
		}
	}

}

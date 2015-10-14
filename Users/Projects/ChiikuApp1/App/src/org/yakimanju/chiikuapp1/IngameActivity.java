package org.yakimanju.chiikuapp1;

import java.io.IOException;
import java.io.InputStream;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

public class IngameActivity extends Activity implements View.OnClickListener {
	
	//=======================================================
	// 変数
	
	private ImageButton _btnRight;
	private ImageButton _btnLeft;
	private ImageView _imageSamplel;
	private ImageView _imageAnswer;
	public InputStream is;
	public Bitmap bm;
	
	private static final String MATRIX_FILE_NAME = "chiiku_mtx.csv";
	
	//=======================================================
	// メソッド
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_ingame);
		
		_imageSamplel = (ImageView) findViewById(R.id.imageSamplel);
		
		_imageAnswer = (ImageView) findViewById(R.id.imageAnswer);
		
		try{
			is = getResources().getAssets().open("image/figure_circleblack.png");
			bm = BitmapFactory.decodeStream(is);
			_imageSamplel.setImageBitmap(bm);
		} catch (IOException e) {
		    /* 例外処理 */
			Log.v("ChiikuApp1", e.getMessage());
		}
		_btnRight = (ImageButton)this.findViewById(R.id.btnRight);
		_btnRight.setOnClickListener(this);
		
		_btnLeft = (ImageButton)this.findViewById(R.id.btnLeft);
		_btnLeft.setOnClickListener(this);
		}
		
//	@Override
//	public boolean onCreateOptionsMenu(Menu menu) {
//		getMenuInflater().inflate(R.menu.title, menu);
//		return true;
//	}

	@Override
	public void onClick(View view) {
		
		if (view == _btnLeft)
		{	
			try{
				is = getResources().getAssets().open("image/maru.png");
				bm = BitmapFactory.decodeStream(is);
				_imageAnswer.setImageBitmap(bm);
				_imageAnswer.setVisibility(View.VISIBLE);
			} catch (IOException e) {
			    /* 例外処理 */
				Log.v("ChiikuApp1", e.getMessage());
			}
		}
		if (view == _btnRight)
		{	
			
			try{
				is = getResources().getAssets().open("image/batu.png");
				bm = BitmapFactory.decodeStream(is);
				_imageAnswer.setImageBitmap(bm);
				_imageAnswer.setVisibility(View.VISIBLE);
			} catch (IOException e) {
			    /* 例外処理 */
				Log.v("ChiikuApp1", e.getMessage());
			}
		}
	}
}
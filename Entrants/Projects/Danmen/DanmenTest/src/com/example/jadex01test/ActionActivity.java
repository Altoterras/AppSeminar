package com.example.jadex01test;

import com.example.jadex01.R;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;

public class ActionActivity extends Activity implements View.OnClickListener {
	
	private Button _buttonCut;
	private Button _buttonReturn;
	private float _xTouchStart;
	private float _yTouchStart;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_action);
		
		_buttonCut = (Button)this.findViewById(R.id.buttonCut);
		_buttonCut.setOnClickListener(this);
		
		_buttonReturn = (Button)this.findViewById(R.id.buttonReturnSelect);
		_buttonReturn.setOnClickListener(this);
		
	}

	@Override
	public void onClick(View view) {
		// TODO Auto-generated method stub
		if (view == _buttonCut){
			
		}
		
		if (view == _buttonReturn){
			Intent intent = new Intent(this, com.example.jadex01test.SelectActivity.class);
			startActivity(intent);
		}
	}

	@Override 
	public boolean onTouchEvent(MotionEvent event)
	{
		switch(event.getAction())
		{
		// タッチした
		case MotionEvent.ACTION_DOWN:
			{
				_xTouchStart = event.getX();	// タッチの開始 X 座標 
				_yTouchStart = event.getY();	// タッチの開始 Y 座標
			}
			break;
			
		// タッチが離れた
		case MotionEvent.ACTION_UP:
			{
				final float DIST_NEAR = 0.001f;		// 非常に近いと判定する距離定数値
				final float DIST_DETECT = 100.0f;	// 移動したとみなす距離定数値

				float xEnd = event.getX();		// タッチの終了 X 座標 
				float yEnd = event.getY();		// タッチの終了 Y 座標
				
				float xDif = xEnd - _xTouchStart;	// X 座標の差
				float yDif = yEnd - _yTouchStart;	// Y 座標の差

				// 十分に移動している時のみ
				float distancesq = (xDif * xDif) + (yDif * yDif);	// 移動距離の２乗
				if(distancesq >= (DIST_DETECT * DIST_DETECT))
				{
					boolean vertical = false;		// 縦か横か（初期値は横） 
					float slope = 0.0f;				// 傾き
					
					if((xDif * xDif) < (DIST_NEAR * DIST_NEAR))
					{
						vertical = true;	// 縦である
					}
					else
					{
						slope = yDif / xDif;	// 傾きを計算
						if((slope >= 1.0f) || (slope <= -1.0f))
						{
							vertical = true;	// 縦である
						}
					}
	
					AlertDialog.Builder dlg;
					dlg = new AlertDialog.Builder(this);
					dlg.setMessage((vertical ? "縦斬りです" : "横斬りです") + "\n\nxStart=" + _xTouchStart + ", yStart=" + _yTouchStart + ", xEnd=" + xEnd + ", yEnd=" + yEnd + ", slope=" + slope);
					dlg.show();
				}
			}
			break;
		}
		
		return super.onTouchEvent(event);
	}
	/*
	//▼▼▼　2013/09/04 作成途中 ▼▼▼
	@Override 
	public boolean onTouchEvent(MotionEvent event) {

		switch ( event.getAction() ) {
		//タッチした
		case MotionEvent.ACTION_DOWN:
			//タッチした際のx座標
			int x = (int) event.getX();
			//タッチした際のy座標
			int y = (int) event.getY();
			//    
			//処理：ダイアログを表示します。
			AlertDialog.Builder alertDialog=new AlertDialog.Builder(ActionActivity.this);    
			//タイトルを設定する
			alertDialog.setTitle("タイトルです");    
			//メッセージ内容を設定する
			alertDialog.setMessage("X座標：" + String.valueOf(x) + ", Y座標" + String.valueOf(y));    
			//確認ボタン処理を設定する
			alertDialog.setPositiveButton("OK",new DialogInterface.OnClickListener() {
			    public void onClick(DialogInterface dialog,int whichButton) {
			        setResult(RESULT_OK);
			    }
			});
			alertDialog.create();
			alertDialog.show();
			    
			break;

		//タッチしたまま移動
		//case MotionEvent.ACTION_MOVE:
		//	break;

		//タッチが離れた
		//case MotionEvent.ACTION_UP:
		//	break;

		//タッチがキャンセルされた
		//case MotionEvent.ACTION_CANCEL:
		//	break;
	    }
			
		return super.onTouchEvent(event);
	} 
	//▲▲▲　2013/09/04 作成途中 ▲▲▲
	*/
}

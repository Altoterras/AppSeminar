package com.example.jadex01;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;

public class ActionActivity extends Activity implements View.OnClickListener
{
	//======================================================================
	// 変数

	// ボタン
	private ImageButton _buttonRedo;
	private ImageButton _buttonReturn;
	// 画面タッチ開始位置
	private float _xTouchStart;
	private float _yTouchStart;
	// SelectActivity からの引数
	private int _imgIdx;
	// 切断制御区分
	private int _cutflg = 0;

	//======================================================================
	// メソッド
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_action);
		
		// コントロール変数とインスタンスの関連付け
		_buttonRedo = (ImageButton)this.findViewById(R.id.buttonRedo);
		_buttonRedo.setOnClickListener(this);
		_buttonRedo.setVisibility(View.INVISIBLE);	// 初期状態は復活ボタンを非表示に
		_buttonReturn = (ImageButton)this.findViewById(R.id.buttonReturnSelect);		
		_buttonReturn.setOnClickListener(this);
		
		// SelectActivity から image_idx を受け取る
		Intent intent = getIntent();
		_imgIdx = intent.getIntExtra("image_idx", 0);

		// イメージを設定
		ImageView img = (ImageView)this.findViewById(R.id.imageviewAction);
		int rid = 0;
		rid = ArticleTable.GetImageResourceId(ArticleTable.Kind.KIND_UNCUT, _imgIdx);
		img.setImageResource(rid);
	}

	@Override
	public void onClick(View view)
	{
		if (view == _buttonRedo)
		{
			MediaPlayerEx.play(this, R.raw.again);
			
			ImageView img = (ImageView) findViewById(R.id.imageviewAction);
			int rid = 0;
			rid = ArticleTable.GetImageResourceId(ArticleTable.Kind.KIND_UNCUT, _imgIdx);
			img.setImageResource(rid);
			_cutflg = 0;
			_buttonRedo.setVisibility(View.INVISIBLE);	// 復活ボタンを非表示に
		}
		else if (view == _buttonReturn)
		{
			Intent intent = new Intent(this, com.example.jadex01.SelectActivity.class);
			startActivity(intent);
		}
	}

	@Override 
	public boolean onTouchEvent(MotionEvent event)
	{
		if (_cutflg == 0)	// 画像が切断されていない

			switch ( event.getAction() )
			{
			// タッチした
			case MotionEvent.ACTION_DOWN:
				{
					_xTouchStart = event.getX();	// タッチの開始 X 座標を保存 	
					_yTouchStart = event.getY();	// タッチの開始 Y 座標を保存
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
						// 縦斬りか横斬りかを判定
						boolean vertical = false;		// 縦か横か（初期値は横） 
						if((xDif * xDif) < (DIST_NEAR * DIST_NEAR))
						{
							vertical = true;	// 縦である		※１※
						}
						else
						{
							float slope = yDif / xDif;	// 傾きを計算
							if((slope >= 1) || (slope <= -1))
							{
								vertical = true;	// 縦である
							}
						}
						/*
						AlertDialog.Builder dlg;
						dlg = new AlertDialog.Builder(this);
						dlg.setMessage((vertical ? "縦斬りです" : "横斬りです") + "\n\nxStart=" + _xTouchStart + ", yStart=" + _yTouchStart + ", xEnd=" + xEnd + ", yEnd=" + yEnd + ");
						dlg.show();
						 */				
						
						// 音声再生
						MediaPlayerEx.play(this, R.raw.cutting_01);
						
						// イメージを戻す
						ImageView img = (ImageView)this.findViewById(R.id.imageviewAction);
						int rid = 0;
						if (vertical == true)
						{
							rid = ArticleTable.GetImageResourceId(ArticleTable.Kind.KIND_VCUT, _imgIdx);
						}
						else
						{
							rid = ArticleTable.GetImageResourceId(ArticleTable.Kind.KIND_HCUT, _imgIdx);
						}
						if(rid != 0)
						{
							img.setImageResource(rid);
							_cutflg = 1;
							_buttonRedo.setVisibility(View.VISIBLE);	// 復活ボタンを表示
						}
					}
				}
				break;

			// タッチしたまま移動した
			//case MotionEvent.ACTION_MOVE:
			//	break;
				
			// タッチがキャンセルされた
			//case MotionEvent.ACTION_CANCEL:
			//	break;
	    }
			
		return super.onTouchEvent(event);
	}
}

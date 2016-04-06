package com.learmens.danmen1;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;

/**
 *	アクションアクティビティ
 *
 */
public class ActionActivity extends Activity implements View.OnClickListener
{
	//======================================================================
	// 定数
	
	// カットフラグの値
	private static final int CF_NULL = 0;
	private static final int CF_V = 1;
	private static final int CF_H = 2;
	private static final int CF_C = 3;

	//======================================================================
	// 変数

	// ボタン
	private ImageButton _buttonRedo;
	private ImageButton _buttonReturn;
	// 画面タッチ開始位置
	private float _xTouchStart;
	private float _yTouchStart;
	// 画面タッチひとつ前の位置
	private float _xTouchPrev;
	private float _yTouchPrev;
	// 画面タッチ最少・最大位置
	private float _xTouchMin;
	private float _yTouchMin;
	private float _xTouchMax;
	private float _yTouchMax;
	// トータルタッチ長さ
	private float _lengthTouchTotal;

	// SelectActivity からの引数
	private int _aid;		// 現在の品物 ID
	private int _sid;	// 現在のステート ID
	// 切断制御区分
	private int _cutflg = CF_NULL;					// 0:未切断、1:縦、2:横、3:まわし切り

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
		_aid = intent.getIntExtra("article_id", 0);
		_sid = ArticleTable.getFirstStateId(_aid, ArticleTable.ActionType.KIND_UNCUT);

		// イメージを設定
		ImageView img = (ImageView)this.findViewById(R.id.imageviewAction);
		int rid = ArticleTable.getImageResourceId(_sid);
		img.setImageResource(rid);
	}

	@Override
	public void onClick(View view)
	{
		if (view == _buttonRedo)
		{
			_cutflg = CF_NULL;
			_sid = ArticleTable.getFirstStateId(_aid, ArticleTable.ActionType.KIND_UNCUT);

			ImageView img = (ImageView) findViewById(R.id.imageviewAction);
			int rid = ArticleTable.getImageResourceId(_sid);
			img.setImageResource(rid);
			
			_buttonRedo.setVisibility(View.INVISIBLE);	// 復活ボタンを非表示に
			MediaPlayerEx.play(this, R.raw.again);
		}
		else if (view == _buttonReturn)
		{
			this.finish();
		}
	}

	@Override 
	public boolean onTouchEvent(MotionEvent event)
	{
		if (_cutflg == CF_NULL || _cutflg == CF_C)	// 画像が切断されていない 回転切りの後に指を離していない
		{
			switch ( event.getAction() )
			{
			// タッチした
			case MotionEvent.ACTION_DOWN:
				{
					_xTouchStart = event.getX();	// タッチの開始  X 座標を保存 	
					_yTouchStart = event.getY();	// タッチの開始  Y 座標を保存
					_xTouchPrev = event.getX();		// ひとつ前の  X 座標を保存 	
					_yTouchPrev = event.getY();		// ひとつ前の  Y 座標を保存
					_xTouchMin = _yTouchMin = Float.MAX_VALUE;	// 最小座標を初期化
					_xTouchMax = _yTouchMax = Float.MIN_VALUE;	// 最大座標を初期化
					_lengthTouchTotal = 0.0f;
				}
				break;
			
			// タッチが移動した
			case MotionEvent.ACTION_MOVE:
				{
		            //まわし切り判定
					if (_cutflg != CF_C)
					{
						final float DIST_NEAR = 400.0f;		// 近いと判定する距離定数値
						final float DIST_DETECT = 900.0f;	// 移動したとみなす距離定数値
						final float DIST_WIDTH = 300.0f;	// 円判定に必要な最小最大幅
						
						// 最小位置最大位置を保存
						if(_xTouchMin > event.getX()) { _xTouchMin = event.getX(); }
						if(_yTouchMin > event.getY()) { _yTouchMin = event.getY(); }
						if(_xTouchMax < event.getX()) { _xTouchMax = event.getX(); }
						if(_yTouchMax < event.getY()) { _yTouchMax = event.getY(); }
						
						// 移動距離を加算
						float xd = event.getX() - _xTouchPrev;
						float yd = event.getY() - _yTouchPrev;
						_lengthTouchTotal += (float)Math.sqrt((xd * xd) + (yd * yd));

						// 次回計算用に現在位置を保存
						_xTouchPrev = event.getX();			//  X 座標を保存	
						_yTouchPrev = event.getY();			//  Y 座標を保存
				
						// 開始位置との差
						xd = _xTouchPrev - _xTouchStart;	// X 座標の差
						yd = _yTouchPrev - _yTouchStart;	// Y 座標の差
						float distancesq = (xd * xd) + (yd * yd);	// 移動距離の２乗
						
						// 最小最大幅
						float wx = _xTouchMax - _xTouchMin;
						float wy = _yTouchMax - _yTouchMin;
						
						//System.out.println("_lengthTouchTotal=" + _lengthTouchTotal + ", distance=" + Math.sqrt(distancesq) + ", wx=" + wx + ", wy=" + wy);
						// 十分に移動　かつ　座標が近似値を通過したばあい、まわし切りとみなす
						if (_lengthTouchTotal >= (DIST_DETECT) &&
							(distancesq < (DIST_NEAR * DIST_NEAR)) &&
							(wx >= DIST_WIDTH) &&
							(wy >= DIST_WIDTH) )
						{
							_cutflg = CF_C;		//　まわし切りである
						}
					}
					//else System.out.println("_cutflg=" + _cutflg); // 回転が成功すれば3が表示
				}
				break;

			// タッチが離れた
			case MotionEvent.ACTION_UP:
				{
					if (_cutflg != CF_C)				//　まわし切り判定されていない場合、縦横切り判断を行う
					{
						final float DIST_NEAR = 0.001f;		// 非常に近いと判定する距離定数値
						final float DIST_DETECT = 100.0f;	// 移動したとみなす距離定数値
						float xd = event.getX() - _xTouchStart;	// X 座標の差
						float yd = event.getY() - _yTouchStart;	// Y 座標の差
						
						// 十分に移動している時のみ
						float distancesq = (xd * xd) + (yd * yd);	// 移動距離の２乗
						if(distancesq >= (DIST_DETECT * DIST_DETECT))
						{
							// 縦斬りか横斬りかを判定
							if((xd * xd) < (DIST_NEAR * DIST_NEAR))	// slope の分母 xd が 0 になってゼロディバイドになるのを防止
							{
								_cutflg = CF_V;		//　縦である
							}
							else
							{
								float slope = yd / xd;
								if((slope >= 1) || (slope <= -1))
								{
									_cutflg = CF_V;		// 縦である
								}
								else
								{
									_cutflg = CF_H;		// 横である
								}
							}
							/*
							AlertDialog.Builder dlg;
							dlg = new AlertDialog.Builder(this);
							dlg.setMessage((vertical ? "縦斬りです" : "横斬りです") + "\n\nxStart=" + _xTouchStart + ", yStart=" + _yTouchStart + ", xEnd=" + xEnd + ", yEnd=" + yEnd + ");
							dlg.show();
							*/				
						}
					}
					
					if(_cutflg != CF_NULL)	// カット判定に成功した
					{
						// フラグ判定
						int sidNext = 0;
						if (_cutflg == CF_V)
						{
							sidNext = ArticleTable.getNextStateId(_sid, ArticleTable.ActionType.KIND_VCUT);
						}
						else if (_cutflg == CF_H)
						{
							sidNext = ArticleTable.getNextStateId(_sid, ArticleTable.ActionType.KIND_HCUT);
						}
						else if (_cutflg == CF_C)
						{
							sidNext = ArticleTable.getNextStateId(_sid, ArticleTable.ActionType.KIND_CIRCLE);
						}
						if(sidNext != 0)
						{
							_sid = sidNext;
							_cutflg = CF_NULL;

							// イメージを変更
							ImageView img = (ImageView)this.findViewById(R.id.imageviewAction);
							int rid = ArticleTable.getImageResourceId(sidNext);
							img.setImageResource(rid);
							
							// カット音再生
							MediaPlayerEx.play(this, R.raw.cutting_01);
							
							// 次が無いようであれば復活ボタンを表示
							if(	(ArticleTable.getNextStateId(_sid, ArticleTable.ActionType.KIND_VCUT) == 0) &&
								(ArticleTable.getNextStateId(_sid, ArticleTable.ActionType.KIND_HCUT) == 0) &&
								(ArticleTable.getNextStateId(_sid, ArticleTable.ActionType.KIND_CIRCLE) == 0) )
							{
								_buttonRedo.setVisibility(View.VISIBLE);	// 復活ボタンを表示
							}
						}
					}
				}
				break;

			// タッチがキャンセルされた
			case MotionEvent.ACTION_CANCEL:
				_cutflg = CF_NULL;
				break;
			}
		}
		return super.onTouchEvent(event);
	}
}

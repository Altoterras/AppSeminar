package com.example.jadex01test;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.TextView;

/*---------------------------------------------------------------------*//**
 *	水平スクロールバー拡張クラス
 *
**//*---------------------------------------------------------------------*/
public class HorizontalScrollExView extends HorizontalScrollView implements View.OnTouchListener
{
	//======================================================================
	// 変数
	
	private int _paddingBetween = 0;	// ビュー間のパディング値
	private int _paddingEnds = 0;		// 両端のパディング値

	private LinearLayout _llChild = null;
	private boolean _isTouching = false;

	//======================================================================
	// メソッド
	
	/*-----------------------------------------------------------------*//**
		コンストラクタ
	 **//*-----------------------------------------------------------------*/
	public HorizontalScrollExView(Context context)
	{
		super(context);
		create();
	}
	
	/*-----------------------------------------------------------------*//**
		コンストラクタ
	**//*-----------------------------------------------------------------*/
	public HorizontalScrollExView(Context context, AttributeSet attrs, int defStyle)
	{
		super(context, attrs, defStyle);
		create();
	}
	
	/*-----------------------------------------------------------------*//**
		コンストラクタ
	**//*-----------------------------------------------------------------*/
	public HorizontalScrollExView(Context context, AttributeSet attrs)
	{
		super(context, attrs);
		create();
	}

	/*-----------------------------------------------------------------*//**
		ビュー間のパディング値の設定
	**//*-----------------------------------------------------------------*/
	public void setBetweenPaggind(int pad)
	{
		_paddingBetween = pad;
	}
	
	/*-----------------------------------------------------------------*//**
		両端のパディング値の設定
	**//*-----------------------------------------------------------------*/
	public void setEndsPaggind(int pad)
	{
		_paddingEnds = pad;
	}
	
	/*-----------------------------------------------------------------*//**
		作成処理
	**//*-----------------------------------------------------------------*/
	public void create()
	{
		this.setOnTouchListener(this);
		
		_llChild = new LinearLayout(this.getContext());
		this.addView(_llChild);

		_paddingBetween = 50;	// ビュー間のパディング値
		_paddingEnds = getResources().getDisplayMetrics().widthPixels / 2;		// 両端のパディング値
	}
		
	/*-----------------------------------------------------------------*//**
		スクロール対象として並べる任意のビューを追加する
	**//*-----------------------------------------------------------------*/
	public void addChildScrolledView(View view)
	{
		///view.setBackgroundResource(R.drawable.border_style_2);
		
		int cnt = _llChild.getChildCount();
		if(cnt <= 0)		// 最初のビュー追加
		{
			// 左端のパディングを追加
			TextView tvLeft = new TextView(this.getContext());
			tvLeft.setWidth(_paddingEnds);
			_llChild.addView(tvLeft, 0);
			// 子の追加
			_llChild.addView(view, 1);
			// 右端のパディングを追加
			TextView tvRight = new TextView(this.getContext());
			tvRight.setWidth(_paddingEnds);
			_llChild.addView(tvRight, 2);
		}
		else if(cnt <= 1)	// 有り得ない子の数
		{
			Log.println(Log.ASSERT, "HScrlView", "*** assertion failed ***");
		}
		else
		{
			// 画像間のパディングを追加
			TextView tv = new TextView(this.getContext());
			tv.setWidth(_paddingBetween);
			///tv.setBackgroundResource(R.drawable.border_style_1);
			_llChild.addView(tv, cnt - 1);
			// 子の追加
			_llChild.addView(view, cnt);
		}
	}
	
	/*-----------------------------------------------------------------*//**
		対象のビューをセンターにスクロールさせる
	**//*-----------------------------------------------------------------*/
	private void scrollToAnyCenter()
	{
		int xwk = - this.getScrollX();
		final int xc = this.getWidth() / 2;
		int xScrollMinDist = -1;
		float distsqMin = Float.MAX_VALUE;
		for(int iv = 0; iv < _llChild.getChildCount(); iv++)
		{
			View viewWk = _llChild.getChildAt(iv);
			xwk += viewWk.getWidth() / 2;

			///Log.d("HScrlView", String.format("scrollToAnyCenter - iv=%d, view=(%d)%s", iv, (viewWk instanceof ImageView) ? 1 : 0, viewWk.getClass().getName()));
			if((iv & 1) != 0)	// 奇数インデックスが対象である（偶数インデックスはパディング）	//if(viewWk instanceof ImageView)
			{
				float distsq = (xwk - xc) * (xwk - xc);
				if(distsq < distsqMin)
				{
					distsqMin = distsq;
					xScrollMinDist = this.getScrollX() + xwk - xc;
				}
			}

			xwk += viewWk.getWidth() / 2;
		}
		
		if(xScrollMinDist != -1)
		{
			this.scrollTo(xScrollMinDist, 0);
		}
	}
	
	/*-----------------------------------------------------------------*//**
		スクロールイベントハンドラ
	**//*-----------------------------------------------------------------*/
	@Override
	protected void onScrollChanged(int x, int y, int oldx, int oldy)
	{
		super.onScrollChanged(x, y, oldx, oldy);
		
		if(!_isTouching)
		{
			scrollToAnyCenter();
		}
		///Log.d("HScrlView", "onScrollChanged");
	}
	
	/*-----------------------------------------------------------------*//**
		タッチイベントハンドラ
	**//*-----------------------------------------------------------------*/
	@Override
	public boolean onTouch(View view, MotionEvent event)
	{
		switch(event.getAction())
		{
		case MotionEvent.ACTION_DOWN:
			if(!_isTouching)
			{
				_isTouching = true;
			}
			///Log.d("HScrlView", "onTouch - MotionEvent.ACTION_DOWN");
			break;
		case MotionEvent.ACTION_UP:
		case MotionEvent.ACTION_CANCEL:
			if(_isTouching)
			{
				_isTouching = false;
				//scrollToAnyCenter();
			}
			///Log.d("HScrlView", "onTouch - MotionEvent.ACTION_UP / ACTION_CANCEL");
			break;
		}
		return false;
	}
}
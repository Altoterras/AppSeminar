package com.example.jadex01;

import java.util.ArrayList;
import java.util.List;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.GridView;

/*---------------------------------------------------------------------*//**
 *	セレクトアクティビティ
 *
**//*---------------------------------------------------------------------*/
public class SelectActivity extends Activity implements View.OnClickListener
{
	//======================================================================
	// クラス
	
	/*---------------------------------------------------------------------*//**
	 *	コンポーネントで使うイメージボタンパラメータ
	 *
	**//*---------------------------------------------------------------------*/
	public static class BitmapButonParameter
	{
		public int _index = -1;
		public View _view = null;
	}
	
	/*---------------------------------------------------------------------*//**
	 *	コンポーネントで使うイメージボタンアダプタ
	 *
	**//*---------------------------------------------------------------------*/
	public static class BitmapButonAdapter extends ArrayAdapter<BitmapButonParameter>
	{
		//======================================================================
		// 変数
	 
	    private int _resourceId;

		//======================================================================
		// メソッド
 
	    public BitmapButonAdapter(Context context, int resource, List<BitmapButonParameter> objects)
	    {
	    	super(context, resource, objects);
	        _resourceId = resource;
	    }
	 
	    @Override
	    public View getView(int position, View convertView, ViewGroup parent)
	    {
			if (convertView == null)
			{
				LayoutInflater inflater = (LayoutInflater) getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
				convertView = inflater.inflate(_resourceId, null);
			}
	 
			BitmapButonParameter param = getItem(position);
			ImageButton button = (ImageButton)convertView;
			button.setImageResource(ArticleTable.GetImageResourceId(ArticleTable.Kind.KIND_SEL, param._index));
			button.setOnClickListener((View.OnClickListener)parent.getContext());
			param._view = (param._view == null) ? convertView : param._view;

			return convertView;
	    }
	}
	
	//======================================================================
	// 変数
	
	private GridView		_gridvSelect;
	private ImageButton		_buttonReturn;
//	private ImageButton[]	_imgbtnArticles;

	//======================================================================
	// メソッド
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_select);
		
		// コントロール変数とインスタンスの関連付け
		_gridvSelect = (GridView)this.findViewById(R.id.gridviewArticleSelect);
		_buttonReturn = (ImageButton)this.findViewById(R.id.buttonReturn);
		_buttonReturn.setOnClickListener(this);
		
		// 水平スクロールビューにアイテムを設定する
		/*
		HorizontalScrollExView hsev = (HorizontalScrollExView) findViewById(R.id.hsvArticleSelect);
		_imgbtnArticles = new ImageButton[NUM_ARTICLE];
		for(int i = 0; i < NUM_ARTICLE; i++)
		{
			_imgbtnArticles[i] = new ImageButton(this);
			int rid = 0;
			rid = ArticleTable.GetImageResourceId(ArticleTable.Kind.KIND_SEL, i);
			if(rid == 0)	{	break;	}
			_imgbtnArticles[i].setImageResource(rid);
			_imgbtnArticles[i].setOnClickListener(this);
			hsev.addChildScrolledView(_imgbtnArticles[i]);
		}
		*/
		
		// グリッドビューにアイテムを設定する
        ArrayList<BitmapButonParameter> list = new ArrayList<BitmapButonParameter>();
		for(int i = 0; i < ArticleTable.NUM_ARTICLE; i++)
		{
			BitmapButonParameter param = new BitmapButonParameter();
			param._index = i;
			list.add(param);
		}
		BitmapButonAdapter adapter = new BitmapButonAdapter(getApplicationContext(), R.layout.item_image_button, list);
        _gridvSelect.setAdapter(adapter);
        _gridvSelect.setNumColumns(3);
        _gridvSelect.setVerticalSpacing(40);
	}

	@Override
	public void onClick(View view)
	{
		if (view == _buttonReturn)
		{
			Intent intent = new Intent(this, com.example.jadex01.TitleActivity.class);
			startActivity(intent);
		}
		else if(view instanceof ImageButton)
		{
			// 水平スクロールビューの該当ボタンからクリックされたボタンを判定し、次のアクティビティに移行する
			/*
			for(int i = 0; i < NUM_ARTICLE; i++)
			{
				if(_imgbtnArticles[i] == view)
				{
					///Log.d("Danmen", "*** 1 ***");
					
					int vid = 0;
					vid = ArticleTable.GetVoiceResourceId(ArticleTable.Kind.KIND_SEL, i);
					MediaPlayer mp = MediaPlayer.create(this, vid);
					mp.start();
					
					Intent intent = new Intent(this, com.example.jadex01.ActionActivity.class);
					intent.putExtra("image_id", i);
					startActivity(intent);
					break;
				}
			}
			*/

			// グリッドビューの該当ボタンからクリックされたボタンを判定し、次のアクティビティに移行する
			BitmapButonAdapter adapter = (BitmapButonAdapter)_gridvSelect.getAdapter();
			for(int i = 0; i < adapter.getCount(); i++)
			{
				BitmapButonParameter param = adapter.getItem(i);
				if(param._view == view)
				{
					int vid = ArticleTable.GetVoiceResourceId(ArticleTable.Kind.KIND_SEL, param._index);
					MediaPlayerEx.play(this, vid);
					
					Intent intent = new Intent(this, com.example.jadex01.ActionActivity.class);
					intent.putExtra("image_idx", param._index);
					startActivity(intent);
					break;
				}
			}
		}
	}


}

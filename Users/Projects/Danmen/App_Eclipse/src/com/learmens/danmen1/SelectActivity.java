package com.learmens.danmen1;

import java.util.ArrayList;
import java.util.List;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.GridView;
import android.widget.ImageView;

/**
 *	品物選択アクティビティ
 *
 */
public class SelectActivity extends Activity implements View.OnClickListener, OnItemClickListener
{
	//======================================================================
	// クラス
	
	/*---------------------------------------------------------------------*//**
	 *	コンポーネントで使うイメージボタンパラメータ
	 *
	**//*---------------------------------------------------------------------*/
	public static class GridViewImageParameter
	{
		public int _aid = -1;
	}
	
	/*---------------------------------------------------------------------*//**
	 *	GridView コンポーネントで使うイメージアダプタ
	 *
	**//*---------------------------------------------------------------------*/
	public static class GridViewImageAdapter extends ArrayAdapter<GridViewImageParameter>
	{
		//======================================================================
		// 変数
	 
	    private int _resourceId;

		//======================================================================
		// メソッド
 
	    public GridViewImageAdapter(Context context, int resource, List<GridViewImageParameter> objects)
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
			
			GridViewImageParameter param = getItem(position);
			ImageView img = (ImageView)convertView;
			int sid = ArticleTable.getFirstStateId(param._aid, ArticleTable.ActionType.KIND_SEL);
			img.setImageResource(ArticleTable.getImageResourceId(sid));
			
			return convertView;
	    }
	}
	
	//======================================================================
	// 変数
	
	private GridView		_gridvSelect;
	private ImageButton		_buttonReturn;

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
		
		// グリッドビューにアイテムを設定する
        ArrayList<GridViewImageParameter> list = new ArrayList<GridViewImageParameter>();
		System.out.println("ArticleTable.getArticleKindCount()=" + ArticleTable.getArticleKindCount());
		for(int i = 0; i < ArticleTable.getArticleKindCount(); i++)
		{
			GridViewImageParameter param = new GridViewImageParameter();
			param._aid = i + 1;
			list.add(param);
		}
		GridViewImageAdapter adapter = new GridViewImageAdapter(getApplicationContext(), R.layout.gridview_item_image, list);
        _gridvSelect.setAdapter(adapter);
        _gridvSelect.setNumColumns(3);
        _gridvSelect.setVerticalSpacing(40);
        _gridvSelect.setOnItemClickListener(this);
	}

	@Override
	public void onClick(View view)
	{
		if (view == _buttonReturn)
		{
			this.finish();
		}
	}

	@Override
	public void onItemClick(AdapterView<?> parent, View v, int position, long id)
	{
		GridViewImageParameter param = (GridViewImageParameter)_gridvSelect.getAdapter().getItem(position);
		
		// 切るものの名前
		int sid = ArticleTable.getFirstStateId(param._aid, ArticleTable.ActionType.KIND_SEL);
		int vid = ArticleTable.getVoiceResourceId(sid);
		MediaPlayerEx.play(this, vid);
		
		// 次のアクティビティ
		Intent intent = new Intent(this.getApplicationContext(), ActionActivity.class);
		
		// 引数引渡し
		intent.putExtra("article_id", param._aid);
		this.startActivity(intent);
	}

}

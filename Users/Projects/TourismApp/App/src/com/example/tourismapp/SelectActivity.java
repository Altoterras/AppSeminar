package com.example.tourismapp;

import java.util.ArrayList;
import java.util.List;

import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.GridView;
import android.widget.ImageButton;


/*---------------------------------------------------------------------*//**
 *	セレクトアクティビティ
 *
**//*---------------------------------------------------------------------*/
public class SelectActivity extends Activity implements View.OnClickListener  {
	
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
	    
	    // ResortTableよりイメージを取得
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
			button.setImageResource(ResortTable.GetImageResourceId(ResortTable.Kind.KIND_SEL, param._index));
			button.setOnClickListener((View.OnClickListener)parent.getContext());
			param._view = (param._view == null) ? convertView : param._view;

			return convertView;
	    }
	}
	
	//======================================================================
	// 変数
	
	//private ImageButton _buttonEnter;
	private GridView		_gridvSelect;
	//private ImageButton		_buttonReturn;

	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_select);

		// データのインスタンス化
		TourData tourdata = TourData.getInstance(this.getApplicationContext());
		
		// コントロール変数とインスタンスの関連付け
		_gridvSelect = (GridView)this.findViewById(R.id.gridviewStampSelect);
		
		// グリッドビューにアイテムを設定する
        ArrayList<BitmapButonParameter> list = new ArrayList<BitmapButonParameter>();
		for(int i = 0; i < ResortTable.NUM_ARTICLE; i++)
		{
			
			// QRコード取得済みチェック
			if (tourdata.checkFinished(String.valueOf(i + 1)))
			{	
				BitmapButonParameter param = new BitmapButonParameter();
				param._index = i;
				list.add(param);
			}
		}
		
		// ゼロ件の場合
		if (list.isEmpty()) 
		{
			// list.add(???);
		}
		
		BitmapButonAdapter adapter = new BitmapButonAdapter(getApplicationContext(), R.layout.item_image_button, list);
        _gridvSelect.setAdapter(adapter);
        //_gridvSelect.setNumColumns(1);  --観光地が増えた場合、グリッド列を増やす
        _gridvSelect.setVerticalSpacing(40);
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	}

	//メニューボタンオプション使用時
//	@Override
//	public boolean onCreateOptionsMenu(Menu menu) {
//		// Inflate the menu; this adds items to the action bar if it is present.
//		getMenuInflater().inflate(R.menu.title, menu);
//		return true;
//	}
	
	@Override
	public void onClick(View view)
	{
    //　戻るボタン
/*	if (view == _buttonReturn)
	{
		Intent intent = new Intent(this, com.example.jadex01.TitleActivity.class);
		startActivity(intent);
	}
	else*/ if(view instanceof ImageButton)
		{
			// グリッドビューの該当ボタンからクリックされたボタンを判定し、次のアクティビティに移行する
			BitmapButonAdapter adapter = (BitmapButonAdapter)_gridvSelect.getAdapter();
			for(int i = 0; i < adapter.getCount(); i++)
			{
				BitmapButonParameter param = adapter.getItem(i);
				if(param._view == view)
				{

					Intent intent = new Intent(this, com.example.tourismapp.GuidanceActivity.class);

					// データのインスタンス化
					TourData tourdata = TourData.getInstance(this.getApplicationContext());
	
					// 引渡し
					intent.putExtra(com.example.tourismapp.GuidanceActivity.class.toString(),
							tourdata.getResortInfo(String.valueOf(param._index + 1))[TourData.TOURLIST_URI]);
					
					startActivity(intent);
					/*StampRallyActivity
					Intent intent = new Intent(this, com.example.tourismapp.TitleActivity.class);
					intent.putExtra("image_idx", param._index);
					startActivity(intent);
					*/
					break;
				}
			}
		}
	}

}
package jp.co.altoterras.fortune;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.ImageButton;

public class FortuneInputActivity extends Activity implements View.OnClickListener
{
	//======================================================================
	// 変数

	private DatePicker _datepickCondition;
	private Button _buttonDo;
	private ImageButton _imgbtnDo;
	
	//======================================================================
	// メソッド

	/**
	 * 作成イベントハンドラ
	 */
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_fortune_input);
		
		// 変数と GUI リソースの関連付け
		_datepickCondition = (DatePicker)this.findViewById(R.id.datePickerCondition);
		_buttonDo = (Button)this.findViewById(R.id.buttonDo);
		_buttonDo.setOnClickListener(this);
	}

	/**
	 * クリック イベントハンドラ
	 * 
	 */
	@Override
	public void onClick(View view)
	{
		if((view == _buttonDo) || (view == _imgbtnDo))
		{
			/*
			 *  【問１】【問２】の回答をここに書きましょう
			 */
		}
	}
}

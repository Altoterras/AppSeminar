package com.example.tourismapp;

import java.util.List;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.PlanarYUVLuminanceSource;
import com.google.zxing.Reader;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;

import android.app.Activity;
import android.content.Intent;
import android.hardware.Camera;
import android.hardware.Camera.AutoFocusCallback;
import android.hardware.Camera.PreviewCallback;
import android.hardware.Camera.Size;
import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Toast;

public class ZxingActivity extends Activity{
	
	private SurfaceView mSurfaceView;
	private Camera mCamera;
	private String _text = "";
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// setContentView(R.layout.zxing);
		
		mSurfaceView = new SurfaceView(this);
		mSurfaceView.setOnClickListener(onClickListener);
		setContentView(mSurfaceView);
		
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		SurfaceHolder holder = mSurfaceView.getHolder();
		holder.addCallback(callback);
	}
	
	private SurfaceHolder.Callback callback = new SurfaceHolder.Callback() {
		@Override
		public void surfaceCreated(SurfaceHolder holder) {
			// 生成されたとき
			mCamera = Camera.open();
			try {
				// プレビューをセットする
				mCamera.setPreviewDisplay(holder);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		@Override
		public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
			// 変更されたとき
			Camera.Parameters parameters = mCamera.getParameters();
			List<Camera.Size> previewSizes = parameters.getSupportedPreviewSizes();
			Camera.Size previewSize = previewSizes.get(0);
			parameters.setPreviewSize(previewSize.width, previewSize.height);
			// width, heightを変更する
			mCamera.setParameters(parameters);
			mCamera.startPreview();
		}
		@Override
		public void surfaceDestroyed(SurfaceHolder holder) {
			// 破棄されたとき
			mCamera.release();
			mCamera = null;
		}
	};
	
	private OnClickListener onClickListener = new OnClickListener() {
		@Override
		public void onClick(View v) {
			// オートフォーカス
			if (mCamera != null) {
				mCamera.autoFocus(autoFocusCallback);
			}
		}
	};
	
	private AutoFocusCallback autoFocusCallback = new AutoFocusCallback() {
		@Override
		public void onAutoFocus(boolean success, Camera camera) {
			camera.autoFocus(null);
			if (success) {
				// 現在のプレビューをデータに変換
				camera.setOneShotPreviewCallback(previewCallback);
			}
		}
	};
	
	private PreviewCallback previewCallback = new PreviewCallback() {
		@Override
		public void onPreviewFrame(byte[] data, Camera camera) {
			// 読み込む範囲
			int previewWidth = camera.getParameters().getPreviewSize().width;
			int previewHeight = camera.getParameters().getPreviewSize().height;
			 
			// プレビューデータから BinaryBitmap を生成 
			PlanarYUVLuminanceSource source = new PlanarYUVLuminanceSource(
					data, previewWidth, previewHeight, 0, 0, previewWidth, previewHeight, false);
			BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
			
			// 内部データ
			TourData tourdata = TourData.getInstance(ZxingActivity.this.getApplicationContext());
			
			// バーコードを読み込む
			Reader reader = new MultiFormatReader();
			Result result = null;
			try {
				result = reader.decode(bitmap);
				//String text = result.getText();
				_text = result.getText();
				
				// 表示
				//Toast.makeText(getApplicationContext(), "GET:data" + _text, Toast.LENGTH_SHORT).show();
				
				// 読み込んだ内容を確認
				if (tourdata.containsTourId(_text))
				{
					String Id = tourdata.decode(_text);
					
					// 内部データに保存
					tourdata.setDataValue(Id, TourData.TOUR_FINISHED);
					
					// CSVデータ取得
					String[] list = tourdata.getResortInfo(Id);
					
					if (list != null) {
						
						// 遷移
						Intent intent = new Intent(ZxingActivity.this.getApplicationContext(),
								com.example.tourismapp.GuidanceActivity.class);
						// 引渡し
						intent.putExtra(com.example.tourismapp.GuidanceActivity.class.toString(),
										list[TourData.TOURLIST_URI]);
						// 遷移実行
						startActivity(intent);

						Toast.makeText(getApplicationContext(), 
								"GET:qrcode=" + list[1], Toast.LENGTH_LONG).show();
						// 完了
						ZxingActivity.this.finish();
						
					}
					
				}
			} catch (com.google.zxing.FormatException e) {
				Toast.makeText(getApplicationContext(), e.getClass().getName(), Toast.LENGTH_SHORT).show();
			} catch (com.google.zxing.ChecksumException e) {
				Toast.makeText(getApplicationContext(), e.getClass().getName(), Toast.LENGTH_SHORT).show();
			} catch (com.google.zxing.NotFoundException e) {
				Toast.makeText(getApplicationContext(), e.getClass().getName(), Toast.LENGTH_SHORT).show();
			} finally {}
		}
	};

}

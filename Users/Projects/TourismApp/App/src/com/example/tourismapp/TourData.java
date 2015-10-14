package com.example.tourismapp;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.StringTokenizer;

import android.content.Context;

class TourData{
	
	// 呼び出し元から連携必須
	private static Context _base = null;

	/** QRコード取得済み	 */
	static final String TOUR_UNFINISHED = "0";
	
	/** QRコード未取得	 */
	static final String TOUR_FINISHED = "1";

	// csv配列Index
	public static final int TOURLIST_ID = 0;
	public static final int TOURLIST_NAME = 1;
	public static final int TOURLIST_URI = 2;
	
	// SingletonHolder
	private static class TourDataHolder {
		
		private static final TourData instance = new TourData();
		
	}
	
	/** 保存データ(result.dat / 内部保持の読み書き用ファイル)	*/
	private HashMap<String, String> _data = new HashMap<String, String>(){
		{
			// 未取得で初期化
			for (int i = 0; i < 10; i++){
				put(String.valueOf(i + 1), TOUR_UNFINISHED);
			}
		}
	};
	
	/** 観光データ(tour.csv / 内部保持の読み取り専用CSVファイル)	*/
	private HashMap<String, String[]> _tourlist = new HashMap<String, String[]>();

	/** 保存データファイル名	*/
	private static final String RESULT_FILE_NAME = "result.dat";
	
	private TourData(){
		
		boolean installed = false;
		String file[] = TourData._base.fileList();
		
		// 既存ファイルチェック
		for (int i = 0; i < file.length; i++) {
			
			if (TourData.RESULT_FILE_NAME.equals(file[i])) {
				installed = true;
				break;
			}
			
		}
		
		if (installed) {

			// データ用ファイルの読込み
			readDataFile(TourData.RESULT_FILE_NAME);
			
		} else {

			// データ用ファイルの新規作成
			writeDataFile(TourData.RESULT_FILE_NAME);
			
		}
		
		// 内部CSVデータの読込み (Id, Name)
		readCsvFile();
		
	}

	/**
	 * 
	 * @param base コンテキスト
	 * @return 単一インスタンス
	 */
	static TourData getInstance(Context base){

		if (TourData._base == null) {
			TourData._base = base;
		}
		
		return TourDataHolder.instance;
	}
	
	/**
	 * データを保存する
	 * 
	 * @param id
	 * @param value
	 */
	void setDataValue(String id, String value){
		
		// 存在するIDのみを処理
		if (this._data.containsKey(id)){
			
			// クラス内に保存
			this._data.put(id, value);
			
			// ファイルに書出し
			this.writeDataFile(TourData.RESULT_FILE_NAME);
		}
	}

	/**
	 * 保存データを1件取得する
	 * 
	 * @param id
	 * @return id があれば対応するフラグ
	 */
	String getDataValue(String id){
		
		if (this._data.containsKey(id)){
			
			// 現時点の値
			return this._data.get(id);
			
		} else {
			
			// 存在しないID
			return null;
			
		}
	}
	
	/**
	 * 
	 * @param id
	 * @return
	 */
	boolean checkFinished(String id){
		
		return TourData.TOUR_FINISHED.equals(getDataValue(id));
		
	}


	/**
	 * 
	 * QRコードをデコードした結果が、<BR>
	 * キーに含まれるかどうかチェック
	 * @param qrcode
	 * @return
	 */
	boolean containsTourId(String qrcode){
		
		if (qrcode != null && qrcode.length() > 0){
			return TourData.this._data.containsKey(decode(qrcode));
		} else {
			return false;
		}
		
	}
	
	/**
	 * すべてのデータを取得する
	 * 
	 * @param id
	 * @return id があれば対応するフラグ
	 */
	String[] getAllDataValue(){
		
		String[] alldata = new String[this._data.size()];
		
		for (int i = 0; i < alldata.length; i++){
			alldata[i] = this._data.get(String.valueOf(i + 1));
		}
		
		return alldata;
	}
	
	/**
	 * 観光地のレコードを1件取得する
	 * @param id
	 * @return
	 */
	String[] getResortInfo(String id){

		if (this._tourlist.containsKey(id)){
			
			// IDに対応する観光地の情報
			return this._tourlist.get(id);
			
		} else {
			
			// 存在しないID
			return null;
			
		}
	}
	
	private final String Decoder = "com.example.tourismapp.TourData.Id=";
	
	String decode(String qrdata){
		String str = "";
		
		if (qrdata != null && qrdata.startsWith(this.Decoder)) {
			str = qrdata.substring(this.Decoder.length());
		}
		
		return str;
	}
	
	private void readDataFile(String filename){
		
		InputStream in = null;
		BufferedReader br = null;
		
		String data = null;
		
		try {
			
			// FileNotFound
			in = TourData._base.openFileInput(filename);
			
			// UnsupportedEncoding
			br = new BufferedReader(new InputStreamReader(in, "UTF-8"));
			
			// データ読込み
			while ((data = br.readLine()) != null) {
				
				for (int i = 0; i < data.length(); i++){
				
					// Mapに取り込み
					this._data.put(String.valueOf(i + 1), String.valueOf(data.charAt(i)));
					
				}
				
				// 一行処理で終了
				break;
			}
			
		} catch (UnsupportedEncodingException ex) {
			ex.printStackTrace();
		} catch (FileNotFoundException ex){
			ex.printStackTrace();
		} catch (IOException ex){
			ex.printStackTrace();
		} finally {

			try {if (br != null) {br.close();}
			} catch (IOException ex){}

			try {if (in != null) {in.close();}
			} catch (IOException ex){}
			
		}
		
	}
	
	private void writeDataFile(String filename){
		
		OutputStream out = null;
		BufferedWriter bw = null;
		
		try {
			
			out = TourData._base.openFileOutput(filename, Context.MODE_PRIVATE);
			
			// UnsupportedEncordingEx
			bw = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"), 50);
			
			// Mapを書き込み
			for (int i = 0; i < this._data.size(); i++) {
				// IOEx
				bw.write(this._data.get(String.valueOf(i + 1)));
			}
			// IOEx
			bw.flush();

		} catch (Exception ex){
			
			if (ex instanceof UnsupportedEncodingException ||
				ex instanceof FileNotFoundException ||
				ex instanceof IOException) {
				ex.printStackTrace();
				throw new RuntimeException(ex);
			} else {
				ex.printStackTrace();
				throw new RuntimeException(ex);
			}
			
		} finally {

			try {if (bw != null) {bw.close();}
			} catch (IOException ex){}

			try {if (out != null) {out.close();}
			} catch (IOException ex){}
			
		}
	}
	
	private void readCsvFile(){
		
		// res/raw/tour.csv
		InputStream in = TourData._base.getResources().openRawResource(R.raw.tour);
		BufferedReader br = null;
		
		StringTokenizer token = null;
		String data = null;
		
		try {
			
			// UnsupportedEncoding
			br = new BufferedReader(new InputStreamReader(in, "UTF-8"));
			
			// データ読込み
			while ((data = br.readLine()) != null) {
				
				// 1行を分割
				token = new StringTokenizer(data, ",");
				
				String[] record = new String[token.countTokens()];
				
				for (int i = 0; token.hasMoreTokens(); i++){
					
					// 列ごとに格納
					record[i] = token.nextToken();
					
				}
				
				// データ格納
				if (record.length >= 2) {
					
					this._tourlist.put(record[0], record);
					
				}
				
			}
			
		} catch (Exception ex){
			
			// 強制終了
			throw new RuntimeException(ex);
			
		} finally {

			try {if (br != null) {br.close();}
			} catch (IOException ex){}

			try {if (in != null) {in.close();}
			} catch (IOException ex){}
			
		}
	}
}

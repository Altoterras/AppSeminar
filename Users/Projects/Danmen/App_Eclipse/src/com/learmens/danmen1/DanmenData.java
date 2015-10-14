package com.learmens.danmen1;

import java.io.IOException;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import android.content.Context;
import android.content.res.AssetManager;

/**
 * 断面データ
 *
 */
public final class DanmenData{
	
	// 呼び出し元から連携必須
	private static Context _base = null;

	// csv配列Index
	static class Columns{
		public static final int STATEID = 0;
		public static final int IMGFILE = 1;
		public static final int VIRTICAL = 2;
		public static final int HORIZONTAL = 3;
		public static final int ROUND = 4;
		public static final int MEDIAFILE = 5;
	}
	
	// SingletonHolder
	private static class DanmenDataHolder {
		
		private static final DanmenData instance = new DanmenData();
		
	}
	
	/** 断面遷移マトリクスデータ	*/
	private HashMap<String, String[]> _matrix = new HashMap<String, String[]>();
	
	/** 品物の種類数	*/
	private int _countArticle = 0;

	/** 内部保持の読み取り専用CSVファイル名	*/
	private static final String MATRIX_FILE_NAME = "danmen_mtx.csv";
	
	/**
	 * シングルトン コンストラクタ
	 * 
	 */
	private DanmenData(){
		
		// 内部CSVデータの読込み (Id, Filename, VerticalId, HorizontalId, ??? ...)
		_matrix = readCsvFile(MATRIX_FILE_NAME);
	}
	
	/**
	 * 初期化
	 * 
	 * @param base コンテキスト
	 * @return 単一インスタンス
	 */
	static void init(Context base){

		DanmenData._base = base;
	}

	/**
	 * シングルトンインスタンスを取得する
	 *
	 */
	static DanmenData getInstance(){

		if (DanmenData._base != null) {
			return DanmenDataHolder.instance;
		} else {
			// 初期化されていない
			throw new IllegalStateException(DanmenData.class.getName() + ":初期化エラー");
		}
		
	}
	
	/**
	 * stateId に対応するファイルリソースを取得する
	 * 
	 * @param stateId 状態 ID
	 * @return aid があれば対応するリソース ID
	 */
	int getImageResourceId(String stateId){
		
		if (this._matrix.containsKey(stateId)){
			
			String[] line = this._matrix.get(stateId);
			if(Columns.IMGFILE >= line.length)
			{
				return 0;
			}

			// ファイル名をリソースIDに変換
			return _base.getResources().getIdentifier(
					line[Columns.IMGFILE],
					"drawable", 
					_base.getPackageName());
			
		} else {
			
			// 存在しない  stateId
			return 0;
			//throw new IllegalStateException(DanmenData.class.getName() + ":指定の state id の品物がない");
			
		}
	}

	/**
	 * stateId に対応するファイルリソースを取得する
	 * 
	 * @param stateId
	 * @return stateId があれば対応するリソース
	 */
	int getMediaResourceId(String stateId){
		
		if (this._matrix.containsKey(stateId)){
			
			String[] line = this._matrix.get(stateId);
			if(Columns.MEDIAFILE >= line.length)
			{
				return 0;
			}
			
			// ファイル名をリソースIDに変換
			return _base.getResources().getIdentifier(
					line[Columns.MEDIAFILE],
					"raw", 
					_base.getPackageName());
			
		} else {
			
			// 存在しない stateId
			return 0;
			//throw new IllegalStateException(DanmenData.class.getName() + ":指定の state id の品物がない");
			
		}
	}
	
	/**
	 * stateId に対応する品物の、次の状態 ID を取得する
	 * 
	 * @param stateId 状態 ID
	 * @return stateId があれば対応する状態 ID
	 */
	String getNextStateId(String stateId, int column){
		
		if (this._matrix.containsKey(stateId)){
			
			String[] line = this._matrix.get(stateId);
			if(column >= line.length)
			{
				return null;
			}
			
			return line[column];
			
		} else {
			
			// 存在しない aid
			return null;
			//throw new IllegalStateException(DanmenData.class.getName() + ":指定の state id の品物がない");
			
		}
	}

	/**
	 * CSV ファイルを読み込む
	 * @param filename ファイル名
	 * @return ハッシュマップ
	 */
	private HashMap<String, String[]> readCsvFile(String filename){
		
		HashMap<String, String[]> map = new HashMap<String, String[]>();
		InputStream in = null;
		BufferedReader br = null;
		
		String data = null;
		
		try {
			
			// FileNotFoundEx
			in = DanmenData._base.getResources().getAssets().open(filename, AssetManager.ACCESS_STREAMING);
			// UnsupportedEncoding
			br = new BufferedReader(new InputStreamReader(in, "UTF-8"));
			
			// データ読込み
			while ((data = br.readLine()) != null) {
				
				// 1行を分割
				String[] record = data.split(",");
				
				// データ格納
				if (record.length > 1) {
					
					map.put(record[0], record);
				
				}
			
			}
		
		} catch (Exception ex){
			
			ex.printStackTrace();
			// 強制終了
			throw new RuntimeException(ex);
			
		} finally {

			try {if (br != null) {br.close();}
			} catch (IOException ex){}

			try {if (in != null) {in.close();}
			} catch (IOException ex){}
			
		}
		
		return map;
	}

	/**
	 * 品物種類のカウント
	 * 
	 * @return
	 */
	int getArticleCount(){
		
		if(_countArticle == 0) {	// 初めてのカウント取得
			// 種類数をカウント
			int count = 0;
			if (this._matrix != null && this._matrix.size() != 0) {
				// 種類ごとにカウント(末尾が00)
				for (String[] line: this._matrix.values()) {
					if(Columns.STATEID >= line.length) { continue; }
					String aid = line[Columns.STATEID];
					if(aid.length() < 4) { continue; }
					String idtail = aid.substring(2, 4);
					if ("00".equals(idtail)) {
						count++;
					}
				}
			}
			_countArticle = count;
		}
		
		return _countArticle;
	}
	
}

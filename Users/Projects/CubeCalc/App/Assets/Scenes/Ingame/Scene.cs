using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class Scene : MonoBehaviour
{
	//====
	// 定数・型定義

	enum State
	{
		RUN,
		CLEAR,
	}

	//====
	// フィールド変数

	public GameObject _floorBlockPrehab;
	public Dice _dice;
    public Effect _effect;

    private Stage _stage;
	private int _clearNum;
	private int _valuePrev;		//計算結果退避
	private int _valueCur;		//現在のサイコロの値
	private int _valueResult;	//計算結果
	private State _stat;
	private float _secStat;
	private string _msgDuty;
	private string _msgMsg;
    private int _stageMax = 2;
    private int _stageCnt = 0;
    private int _diceX;
    private int _diceZ;
	private int _moveCnt;   //手数カウント
	private int _moveCntMax;	//MAX配列サイズ格納
	private int _govCnt;        //ゲームオーバー条件　20160518mori
	private string _clearCom;    //クリア条件比較条件格納　20160518mori
	private string _clearStr;

	// 画面表示 20160203mori
	public Text _scoreText; // Text 用変数
	public Text _scoreText2;    //手数用変数
	public Text _clearText;		//クリア条件表示用

	public Step[] _slist;		//座標格納クラス

	//====
	// メソッド

	// ステージ再挑戦
	public void RetryStage()
	{
		// Restart で _stageCnt++ しているので、キャンセルしている．
		// コンフリクトを避けるためにこのような処理をしているが，
		// Restart の中で _stageCnt++ はやらない方が良いだろう…．
		// 後に要整理．
		// by r-kishi
		_stageCnt--;
		Restart();
	}

	// 強制的に次のステージへ（デバッグ用）
	public void Debug_NextStage()
	{
        _stage.Unload();
        Restart();
	}

	// 強制的に次のステージへ（デバッグ用）
	public void Debug_PrevStage()
	{
		_stageCnt -= 2;
        _stage.Unload();
        Restart();
	}

	// 初期化処理
	void Start ()
	{
		_stage = new Stage();
        _effect = new Effect();
        //_dice._effect.ef();

        Restart();
	}

	// 再開処理
	void Restart()
	{
		//初期値設定
		_valuePrev = 0;
		_valueCur = 0;
		_valueResult = 0;
		_moveCnt = 0;
		_moveCntMax = 0;
		_msgDuty = "+";
		_msgMsg = "Answer try to be RES >= " + _clearNum;

		// ステージを読み込む
		if (_stageCnt >= _stageMax) { _stageCnt = 1; } else { _stageCnt++; }
        _stage.Load(_floorBlockPrehab, _stageCnt, ref _diceX, ref _diceZ);
		_govCnt = _stage.getgovCnt();   //ゲームオーバー条件を取得 20160518mori
		_clearNum = _stage.getclearCnt();       //クリア条件を取得　20160518mori
		_clearCom = _stage.getclearOperator();  //クリア条件2を取得　20160525mori

		// クリア条件表示
		switch (_clearCom[0])
		{
			case '=':
				_clearStr = "と一致させてください。";
				break;
			case '+':
				_clearStr = "より大きくしてください。";
				break;
			case '-':
				_clearStr = "より小さくしてください。";
				break;
		}
		
		// ダイスの設定
		_dice.transform.position = new Vector3(_diceX, 0.0f, _diceZ);   //　位置補正
        _dice.transform.rotation = Quaternion.Euler(-90, -180, 0);      //　回転補正(上１、正面２)
        _dice.validMovingDirection = ValidMovingDirection;  // サイコロの移動可否確認関数
		_dice.onStop = OnDiceStop;  // 停止イベントハンドラを設定する
		_dice.active = true;

		_stat = State.RUN;
		_secStat = 0.0f;

		//ステップ情報格納クラス（ゲームオーバー手数分用意）
		_slist = new Step[_govCnt];      //20170118 ←ここでは配列を定義しただけ
		_slist[_moveCnt] = new Step();   //20170118 ←こちらで実際に格納するクラスをNewする
		_slist[_moveCnt].xposi = (int)_dice.transform.position.x;
		_slist[_moveCnt].zposi = (int)_dice.transform.position.z;
		_slist[_moveCnt].ans = _valueResult;
		_slist[_moveCnt].prev = _valuePrev;
		_slist[_moveCnt].dnum = _valueCur;
		_slist[_moveCnt].duty = _msgDuty;
        //_dice._effect.ef();

    }

	// Update is called once per frame
	void Update ()
	{
		_secStat += Time.deltaTime;

		// 次のステージへの処理
		if (_stat == State.CLEAR)
		{
            //_effect.ef();
			_msgMsg = "Clear! ... " + (int)_secStat + " / 3";
            if (_secStat >= 3.0f)
			{
                //_effect.CleaEffect();
                _stage.Unload();
				Restart();
			}
		}

        if (_govCnt < _moveCnt)
        {
            _msgMsg = "GAMEOVER! ... " + (int)_secStat + " / 3";
            if (_secStat >= 3.0f)
            {
                //_effect.CleaEffect();
                _stage.Unload();
                Restart();
            }
        }


	}

	// GUI 処理
	void OnGUI()
	{
		// デバッグ表示
		GUI.Label (new Rect (10, 50, Screen.width - 20, Screen.height - 60), string.Format ("RES = {0} {1} {2} = {3}\n{4}\nPOS = [{5}][{6}]\nIDX = [{7}][{8}]", _valuePrev, _msgDuty, _valueCur, _valueResult, _msgMsg, _dice.transform.position.x, _dice.transform.position.z, _stage.PosXToIndexX(Mathf.Round(_dice.transform.position.x)), _stage.PosZToIndexY(Mathf.Round(_dice.transform.position.z))));

		// 表示処理
		if (_stat == State.CLEAR)
		{
            _effect.CleaEffect();
            _dice.active = false;
            //_secStat += Time.deltaTime;
            //if (_secStat <= 3.0f) {
                //_effect.ef();
                //_effect.ef();
                //GameObject obj = GameObject.Find("Particle System");
                //ParticleSystem particle = obj.GetComponent<ParticleSystem>();
                //particle.Play();
            //}
               

            //_scoreText.fontSize = 50;
            //_scoreText.color = _ccoler;
            //_scoreText.alignment = TextAnchor.MiddleCenter;
            //_scoreText.text = _msgMsg;
            _clearText.text = _msgMsg;
		}
		else
		{
			_scoreText.text = string.Format("{0} {1} {2} = {3}", _valuePrev, _msgDuty, _valueCur, _valueResult);
			_scoreText2.text = string.Format("{0}/{1}手目", _moveCnt, _govCnt);
			_clearText.text = string.Format("{0}{1}", _clearNum, _clearStr);
		}
	}

    // サイコロの移動可否確認関数
    public bool ValidMovingDirection(Vector3 pos)
	{
		return _stage.ValidMovingDirection (pos);
	}

	public enum moveType {
		undo,redo,go
	}

	// サイコロが停止したときのイベントハンドラ
	private void OnDiceStop(int value)
	{
		moveType _mtype = moveType.go;
		if (_moveCnt > 0)
		{
			//2手目から判定
			if (_dice.transform.position.x.Equals(_slist[_moveCnt - 1].xposi) && _dice.transform.position.z.Equals(_slist[_moveCnt - 1].zposi))
			{
				_mtype = moveType.undo;  //元に戻す
			}
			if (_moveCnt < _moveCntMax && _dice.transform.position.x.Equals(_slist[_moveCnt + 1].xposi) && _dice.transform.position.z.Equals(_slist[_moveCnt + 1].zposi))
			{
				_mtype = moveType.redo;  //やり直す
			}
		}
		// サイコロ移動判定
		switch (_mtype)
		{
			case moveType.undo:
				// UNDO(元に戻す)の場合
				_moveCnt--;
				if (_moveCnt > 0)
				{
					_valuePrev = _slist[_moveCnt].prev;
				} else {
					_valuePrev = 0;
				}			
				_msgDuty = _slist[_moveCnt].duty;
				_valueCur = _slist[_moveCnt].dnum;
				_valueResult = _slist[_moveCnt].ans;
				break;
			case moveType.redo:
				// REDO(やり直し)の場合
				_moveCnt++;
				_valuePrev = _slist[_moveCnt].prev;
				_msgDuty = _slist[_moveCnt].duty;
				_valueCur = _slist[_moveCnt].dnum;
				_valueResult = _slist[_moveCnt].ans;
				break;
			//		} else {
			case moveType.go:
				// 移動した場合
				_moveCnt++;
				if (_moveCnt < _moveCntMax)
				{
					// MAX配列までの値をクリア
					for (int i = _moveCntMax ; i > _moveCnt ; i--) {
						Debug.Log(i + "クリア");
						_slist[i] = null;
					}
				}
				// MAX配列サイズ更新
				_moveCntMax = _moveCnt;

				_slist[_moveCnt] = new Step();
			_slist[_moveCnt].xposi = (int)_dice.transform.position.x;
			_slist[_moveCnt].zposi = (int)_dice.transform.position.z;

			Stage.Cell cell = _stage.GetCellFromPosition(_dice.transform.position);		// 現在止まっているステージを取得

			if (cell != null) {
				switch (cell._duty)
				{
					case Stage.Cell.Duty.Null:
					case Stage.Cell.Duty.Equal:
						break;
					default:
						_valuePrev = _slist[_moveCnt - 1].ans;	//計算前の値を退避　計算描画にて使用
						_valueCur = value;						//現在のサイコロの値を退避　計算描画にて使用
						switch (cell._duty)
						{
							case Stage.Cell.Duty.Plus:
								_msgDuty = "+";
								_valueResult += value;
								break;
							case Stage.Cell.Duty.Minus:
								_msgDuty = "-";
								_valueResult -= value;
								break;
							case Stage.Cell.Duty.Mult:
								_msgDuty = "*";
								_valueResult *= value;
								break;
							case Stage.Cell.Duty.Div:
								_msgDuty = "/";
								_valueResult /= value;
								break;
						}
						break;
				}
			}

			// 計算結果を配列に保存
			_slist[_moveCnt].prev = _valuePrev;
			_slist[_moveCnt].duty = _msgDuty;
			_slist[_moveCnt].dnum = _valueCur;
			_slist[_moveCnt].ans = _valueResult;

			//クリア判定
			switch (_clearCom[0])
			{
				case '=':
					//"イコール判定"
					if (_valueResult == _clearNum)
					{
						_stat = State.CLEAR;
					}
					break;
				case '+':
					//"プラス判定"
					if (_valueResult >= _clearNum)
					{
						_stat = State.CLEAR;
					}
					break;
				case '-':
					//"マイナス判定"
					if (_valueResult <= _clearNum)
					{
						_stat = State.CLEAR;
					}
					break;
			}
			_secStat = 0.0f;

			break;
		}
	}
}

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Dice : MonoBehaviour
{
	//====
	// 定数・型定義

	public delegate bool validMovingDirectionFunc(Vector3 dir);
	public delegate void onStopEvent(int value);

	//====
	// フィールド変数
	
	private const float MOVE_SEC = 0.5f;
	private const float MOVE_SPD = 1.0f / MOVE_SEC;
	private const float ROT_SPD = 90.0f / MOVE_SEC;
	private const float SCALE_DICE = 1.0f;

	private float _cntMove;
	private Vector3 _dirMove;
	private Vector3 _rotMove;
	private validMovingDirectionFunc _validMovingDirectionFunc;
	private onStopEvent _onStopFunc;

	private int _value = 0;	
	private Vector3 _localHitNormalized;
	private float _validMargin = 0.45F;

	private bool _active = true;

	//20160907mori
	private Vector3 lastMove;
	private Vector3 lastPos;

	private float speed = 5.0f; //加速度センサー
	private Vector3 _accDice;
	private bool swchFlg;

	private SoundManager smg;

	//====
	// プロパティ

	public int value { get { return _value; } }
	public bool active { get { return _active; } set { _active = value; } }
	public validMovingDirectionFunc validMovingDirection { set { _validMovingDirectionFunc = value; } }
	public onStopEvent onStop { set { _onStopFunc = value; } }

	//デバッグ表示用
	public int kx;
	public int kz;
	private GUIStyle style;
	public GUIStyleState styleState;

	// サイコロSE
	AudioSource audioSource;
	public List<AudioClip> audioClip = new List<AudioClip>();


	//====
	// メソッド

	// 開始処理
	void Start ()
	{
		audioSource = gameObject.AddComponent<AudioSource>();
	}
	
	// 毎フレーム処理
	void Update ()
	{
		if(!_active) { return; }

		// サイコロの値チェック
		if(CheckLocalHit()) { AcquireValue (); }

		Vector3 dir = Vector3.zero;
		Vector3 rot = Vector3.zero;


		if (dir.sqrMagnitude > 1)
		{
			dir.Normalize();
		}

		dir *= Time.deltaTime;

		// ターゲット端末の縦横の表示に合わせてremapする
		if (dir == Vector3.right) { rot = Vector3.back; }
		if (dir == Vector3.left) { rot = Vector3.forward; }
		if (dir == Vector3.forward) { rot = Vector3.right; }
		if (dir == Vector3.back) { rot = Vector3.left; }

		// 傾きによる操作
		if (swchFlg == true) {

		_accDice = Input.acceleration;

		float flx = Mathf.Round(_accDice.x);
		float fly = Mathf.Round(_accDice.y);
		float flz = _accDice.z;

		//端末が表向きの場合
		if (flz <= 0) {
			//右に傾けた場合
			if (flx == 1.0f)
			{
				dir = Vector3.right;
				rot = Vector3.back;
			}
			//左に傾けた場合
			else if (flx == -1.0f)
			{
				dir = Vector3.left;
				rot = Vector3.forward;
			}

			//上に傾けた場合
			if (fly == 1.0f)
			{
				dir = Vector3.forward;
				rot = Vector3.right;
			}
			//下に傾けた場合
			else if (fly == -1.0f)
			{
				dir = Vector3.back;
				rot = Vector3.left;
			}
		}
		} else
		{
			// タッチパネルによる操作
			if (Input.touchCount > 0)
			{
				Touch touch = Input.GetTouch(0);
				if (((Screen.height / 4) <= touch.position.y) && (touch.position.y <= (Screen.height / 4 * 3)))
				{
					if (touch.position.x <= (Screen.width / 2))
					{
						dir = Vector3.left;
						rot = Vector3.forward;
					}
					else {
						dir = Vector3.right;
						rot = Vector3.back;
					}
				}
				if (((Screen.width / 4) <= touch.position.x) && (touch.position.x <= (Screen.width / 4 * 3)))
				{
					if (touch.position.y <= (Screen.height / 2))
					{
						dir = Vector3.back;
						rot = Vector3.left;
					}
					else {
						dir = Vector3.forward;
						rot = Vector3.right;
					}
				}
			}
		}

		// キーボードによる操作
		if (Input.GetKey ("right")) {
			dir = Vector3.right;
			rot = Vector3.back;
		}
		if (Input.GetKey ("left")) {
			dir = Vector3.left;
			rot = Vector3.forward;
		}
		if (Input.GetKey ("up")) {
			dir = Vector3.forward;
			rot = Vector3.right;
		}
		if (Input.GetKey ("down")) {
			dir = Vector3.back;
			rot = Vector3.left;
		}
		if((dir != Vector3.zero) && (rot != Vector3.zero))
		{
			Vector3 pos = transform.position + dir * SCALE_DICE;
			if ((_validMovingDirectionFunc == null) || _validMovingDirectionFunc(pos))
			{
				Move(dir, rot);
			}
		}

		if (_cntMove > 0.0f) {
			_cntMove -= Time.deltaTime;

			// 回転アニメーション終了判定
			if (_cntMove < 0.0f)
			{
				audioSource.PlayOneShot(audioClip[0]);  // SE再生
				_cntMove = 0.0f;

				// 直角補正
				this.transform.eulerAngles = new Vector3(AdjustRightAngle(this.transform.eulerAngles.x), AdjustRightAngle(this.transform.eulerAngles.y), AdjustRightAngle(this.transform.eulerAngles.z));
				// 位置補正
				this.transform.position = new Vector3((int)Mathf.Round(this.transform.position.x * SCALE_DICE), 0.0f, (int)Mathf.Round(this.transform.position.z * SCALE_DICE));
				// onStopEvent デリゲートでイベントをコールする
				if (_onStopFunc != null)
				{
					_onStopFunc(_value);
				}
/*
				//20160907mori　移動方向
				lastMove = dir;
				//20161116mori `現在の座標を取得
				lastPos = new Vector3(this.transform.position.x,this.transform.position.y,this.transform.position.z);
*/
			}
			else
			{
				// 平行移動
				this.transform.Translate(_dirMove * MOVE_SPD * SCALE_DICE * Time.deltaTime, Space.World);
				// 回転
				this.transform.Rotate(_rotMove, ROT_SPD * SCALE_DICE * Time.deltaTime, Space.World);
				// 床めり込み防止
				const float JUMP_HIGH = 0.5f;
				this.transform.position = new Vector3(this.transform.position.x, JUMP_HIGH * Mathf.Sin(Mathf.PI * _cntMove / MOVE_SEC), this.transform.position.z);
			}
		}
	}

	// GUI 処理
	void OnGUI()
	{
		// デバッグ表示
		GUI.Label (new Rect (10, 10, Screen.width - 20, Screen.height - 20), string.Format ("pos=[{0}, {1}, {2}]\nrot=[{3}, {4}, {5}]", this.transform.position.x, this.transform.position.y, this.transform.position.z, this.transform.eulerAngles.x, this.transform.eulerAngles.y, this.transform.eulerAngles.z));

		//デバッグ表示
		style = new GUIStyle();
		style.fontSize = 30;
		styleState.textColor = Color.green;
		style.normal = styleState;

		//デバッグ表示
		GUI.Label(new Rect(10, 300, Screen.width - 20, Screen.height - 60), string.Format("accelerationX = {0} accelerationY = {1} accelerationZ = {2}\nSwitchFLG = {3}", System.Math.Round(_accDice.x,2), System.Math.Round(_accDice.y,2), System.Math.Round(_accDice.z,2), swchFlg), style);

	}

	// 移動を開始する
	void Move(Vector3 dir, Vector3 rot) {
		if (_cntMove > 0.0f) {
			// 移動中
			return;
		}
		// 移動開始
		_cntMove = MOVE_SEC;
		_dirMove = dir;
		_rotMove = rot;
	}

	// 直角補正
	float AdjustRightAngle(float ang)
	{
		/*
		// まず　-180 から +180 の範囲に角度をおさめる
		while (ang > 180.0f) { ang -= 360.0f; }
		while (ang < -180.0f) { ang += 360.0f; }
		*/

		// 直角の整数倍の角度に調整する
		if(ang > 0.0f)
		{
			for (float w = 0.0f; w < 1800.0f; w += 90.0f)
			{
				if(((w - 45.0f) <= ang) && (ang < (w + 45.0f)))
				{
					return w;
				}
			}
		}
		else
		{
			for (float w = -90.0f; w > -1800.0f; w -= 90.0f)
			{
				if(((w - 45.0f) <= ang) && (ang < (w + 45.0f)))
				{
					return w;
				}
			}
		}
		return 0.0f;
	}

	// - - - -
	// サイコロの値チェックメソッド

	// ヒットチェック
	protected bool CheckLocalHit()
	{
		// create a Ray from straight above this Die , moving downwards
		Ray ray = new Ray(transform.position + (new Vector3(0, 2, 0) * transform.localScale.magnitude), Vector3.up * -1);
		RaycastHit hit = new RaycastHit();
		// cast the ray and validate it against this die's collider
		if (GetComponent<Collider>().Raycast(ray, out hit, 3 * transform.localScale.magnitude))
		{
			// we got a hit so we determine the local normalized vector from the die center to the face that was hit.
			// because we are using local space, each die side will have its own local hit vector coordinates that will always be the same.
			_localHitNormalized = transform.InverseTransformPoint(hit.point.x, hit.point.y, hit.point.z).normalized;
			return true;
		}
		// in theory we should not get at this position!
		return false;
	}

	// サイコロの値の取得
	protected void AcquireValue()
	{
		// value = 0 -> undetermined or invalid
		_value = 0;
		float delta = 1;
		// start with side 1 going up.
		int side = 1;
		Vector3 testHitVector;
		// check all sides of this die, the side that has a valid hitVector and smallest x,y,z delta (if more sides are valid) will be the closest and this die's value
		do
		{
			// get testHitVector from current side, HitVector is a overriden method in the dieType specific Die subclass
			// eacht dieType subclass will expose all hitVectors for its sides,
			testHitVector = HitVector(side);
			if (testHitVector != Vector3.zero)
			{
				// this side has a hitVector so validate the x,y and z value against the local normalized hitVector using the margin.
				if (ValidHitMargin(_localHitNormalized.x, testHitVector.x) &&
				    ValidHitMargin(_localHitNormalized.y, testHitVector.y) &&
				    ValidHitMargin(_localHitNormalized.z, testHitVector.z))
				{
					// this side is valid within the margin, check the x,y, and z delta to see if we can set this side as this die's value
					// if more than one side is within the margin (especially with d10, d12, d20 ) we have to use the closest as the right side
					float nDelta = Mathf.Abs(_localHitNormalized.x - testHitVector.x) + Mathf.Abs(_localHitNormalized.y - testHitVector.y) + Mathf.Abs(_localHitNormalized.z - testHitVector.z);
					if (nDelta < delta)
					{
						_value = side;
						delta = nDelta;
					}
				}
			}
			// increment side
			side++;
			// if we got a Vector.zero as the testHitVector we have checked all sides of this die
		} while (testHitVector != Vector3.zero);
	}

	// ヒットベクトルの取得
	protected Vector3 HitVector(int side)
	{
		switch (side)
		{
		case 1: return new Vector3(0F, 0F, 1F);
		case 2: return new Vector3(0F, -1F, 0F);
		case 3: return new Vector3(-1F, 0F, 0F);
		case 4: return new Vector3(1F, 0F, 0F);
		case 5: return new Vector3(0F, 1F, 0F);
		case 6: return new Vector3(0F, 0F, -1F);
		}
		return Vector3.zero;
	}

	// ヒットマージンチェック
	protected bool ValidHitMargin(float t, float v)
	{
		return (t > (v - _validMargin) && t < (v + _validMargin));
	}


	//20160907mori 移動方向を取得
	public Vector3 getlastMove() {
		return lastMove;
	}

	//20161116mori 座標取得
	public Vector3 getlastPos()
	{
		return lastPos;
	}

	public void SwchFlg()
	{
		if (swchFlg == false)
		{
			swchFlg = true;
			
		}
		else {
			swchFlg = false;
		}
	}


}

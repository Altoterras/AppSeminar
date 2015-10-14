﻿using UnityEngine;
using System.Collections;

public class Dice : MonoBehaviour
{
	//====
	// 型定義

	public delegate void onStopEvent(int value);
	
	//====
	// フィールド変数
	
	private const float MOVE_SEC = 0.5f;
	private const float MOVE_SPD = 1.0f / MOVE_SEC;
	private const float ROT_SPD = 90.0f / MOVE_SEC;
	private const float SCALE_DICE = 0.5f;

	private float _cntMove;
	private Vector3 _dirMove;
	private Vector3 _rotMove;
	private onStopEvent _onStop;

	private int _value = 0;	
	private Vector3 _localHitNormalized;
	private float _validMargin = 0.45F;

	//====
	// プロパティ

	public int value { get { return _value; } }
	public onStopEvent onStop { set { _onStop = value; } }
	
	//====
	// メソッド

	// 開始処理
	void Start ()
	{
	}
	
	// 毎フレーム処理
	void Update ()
	{
		// サイコロの値チェック
		if(checkLocalHit()) { acquireValue (); }

		// タッチパネルによる操作
		if (Input.touchCount > 0) {
			Touch touch = Input.GetTouch(0);
			if(((Screen.height / 4) <= touch.position.y) && (touch.position.y <= (Screen.height / 4 * 3)))
			{
				if(touch.position.x <= (Screen.width / 2)) {
					Move(Vector3.left, Vector3.forward);
				} else {
					Move(Vector3.right, Vector3.back);
				}
			}
			if(((Screen.width / 4) <= touch.position.x) && (touch.position.x <= (Screen.width / 4 * 3)))
			{
				if(touch.position.y <= (Screen.height / 2)) {
					Move(Vector3.back, Vector3.left);
				} else {
					Move(Vector3.forward, Vector3.right);
				}
			}
		}
		// キーボードによる操作
		if (Input.GetKey ("right")) {
			Move(Vector3.right, Vector3.back);
		}
		if (Input.GetKey ("left")) {
			Move(Vector3.left, Vector3.forward);
		}
		if (Input.GetKey ("up")) {
			Move(Vector3.forward, Vector3.right);
		}
		if (Input.GetKey ("down")) {
			Move(Vector3.back, Vector3.left);
		}

		if (_cntMove > 0.0f) {
			_cntMove -= Time.deltaTime;

			// 回転アニメーション終了判定
			if(_cntMove < 0.0f) {
				_cntMove = 0.0f;

				// 直角補正
				this.transform.eulerAngles = new Vector3(adjustRightAngle(this.transform.eulerAngles.x), adjustRightAngle(this.transform.eulerAngles.y), adjustRightAngle(this.transform.eulerAngles.z));
				// 位置補正
				this.transform.position = new Vector3(Mathf.Round(this.transform.position.x), 0.0f, Mathf.Round(this.transform.position.z));

				// onStopEvent デリゲートでイベントをコールする
				if(_onStop != null)
				{
					_onStop(_value);
				}
			}

			// 平行移動
			this.transform.Translate(_dirMove * MOVE_SPD * SCALE_DICE * Time.deltaTime, Space.World);
			// 回転
			this.transform.Rotate(_rotMove, ROT_SPD * SCALE_DICE * Time.deltaTime, Space.World);
			// 床めり込み防止
			const float JUMP_HIGH = 0.5f;
			this.transform.position = new Vector3(this.transform.position.x, JUMP_HIGH * Mathf.Sin(Mathf.PI * _cntMove / MOVE_SEC), this.transform.position.z);
		}
	}

	// GUI 処理
	void OnGUI()
	{
		// デバッグ表示
		GUI.Label (new Rect (10, 10, Screen.width - 20, Screen.height - 20), string.Format ("pos=[{0}, {1}, {2}]\nrot=[{3}, {4}, {5}]", this.transform.position.x, this.transform.position.y, this.transform.position.z, this.transform.eulerAngles.x, this.transform.eulerAngles.y, this.transform.eulerAngles.z));
	}

	// 移動を開始する
	void Move(Vector3 dir, Vector3 rot) {
		if (_cntMove > 0.0f) {
			return;
		}
		_cntMove = MOVE_SEC;
		_dirMove = dir;
		_rotMove = rot;
	}

	// 直角補正
	float adjustRightAngle(float ang)
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

	protected bool checkLocalHit()
	{
		// create a Ray from straight above this Die , moving downwards
		Ray ray = new Ray(transform.position + (new Vector3(0, 2, 0) * transform.localScale.magnitude), Vector3.up * -1);
		RaycastHit hit = new RaycastHit();
		// cast the ray and validate it against this die's collider
		if (collider.Raycast(ray, out hit, 3 * transform.localScale.magnitude))
		{
			// we got a hit so we determine the local normalized vector from the die center to the face that was hit.
			// because we are using local space, each die side will have its own local hit vector coordinates that will always be the same.
			_localHitNormalized = transform.InverseTransformPoint(hit.point.x, hit.point.y, hit.point.z).normalized;
			return true;
		}
		// in theory we should not get at this position!
		return false;
	}

	protected void acquireValue()
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
			testHitVector = hitVector(side);
			if (testHitVector != Vector3.zero)
			{
				// this side has a hitVector so validate the x,y and z value against the local normalized hitVector using the margin.
				if (valid(_localHitNormalized.x, testHitVector.x) &&
				    valid(_localHitNormalized.y, testHitVector.y) &&
				    valid(_localHitNormalized.z, testHitVector.z))
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

	protected Vector3 hitVector(int side)
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

	protected bool valid(float t, float v)
	{
		return (t > (v - _validMargin) && t < (v + _validMargin));
	}

	public Vector3 getPosition()
	{
		return this.transform.position;
	}
}
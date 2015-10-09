////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ソフトウェア キーボード ボタン クラス
 *	
**//*---------------------------------------------------------------------*/
var SoftkbdBtn = function()
{
	//======================================================================
	// SoftkbdBtn メンバ変数

	this._rect = new JAFW.Rect();
	this._name = "";
	this._onPush = false;
	this._onRelease = false;
	this._onRepeat = false;

	this._swOnCur = false;
	this._swOnPrev = false;
	this._cntOn = 0;
};

SoftkbdBtn.prototype =
{
	//======================================================================
	// SoftkbdBtn メソッド
	
	/*-----------------------------------------------------------------*//**
		セット
	**//*-----------------------------------------------------------------*/
	set : function(x, y, w, h, name)
	{
		this._rect._v[0] = x;
		this._rect._v[1] = y;
		this._rect._v[2] = w;
		this._rect._v[3] = h;
		this._name = name;
	},
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ソフトウェア キーボード クラス
 *	
**//*---------------------------------------------------------------------*/
var Softkbd = function(xBase, yBase)
{
	//======================================================================
	// Softkbd メンバ変数

	this._xBase = xBase;
	this._yBase = yBase;
	this._arrBtn = new Array(Softkbd.NUM_KEY);
	
	// ボタン作成
	for(var i = 0; i < Softkbd.NUM_KEY; i++)
	{
		this._arrBtn[i] = new SoftkbdBtn();
	}
	var s = 60;
	this._arrBtn[Softkbd.KEY_LEFT	].set( 0 * s,  1 * s, s, s, "←");
	this._arrBtn[Softkbd.KEY_UP		].set( 1 * s,  0 * s, s, s, "↑");
	this._arrBtn[Softkbd.KEY_RIGHT	].set( 2 * s,  1 * s, s, s, "→");
	this._arrBtn[Softkbd.KEY_DOWN	].set( 1 * s,  2 * s, s, s, "↓");
	this._arrBtn[Softkbd.KEY_SPACE	].set( 3.5 * s,  1 * s, s * 2, s, "SHOT");
	this._arrBtn[Softkbd.KEY_ESC	].set( 6 * s,  1 * s, s, s, "ESC");
};

//======================================================================
// Softkbd 定数

Softkbd.KEY_LEFT = 0;		// ← 
Softkbd.KEY_UP = 1;			// ↑ 
Softkbd.KEY_RIGHT = 2;		// → 
Softkbd.KEY_DOWN = 3;		// ↓ 
Softkbd.KEY_SPACE = 4;		// Space 
Softkbd.KEY_ESC = 5;		// Esc 
Softkbd.NUM_KEY = 6;

Softkbd.prototype = 
{
	//======================================================================
	// Softkbd メソッド

	/*-----------------------------------------------------------------*//**
		フレーム更新
	**//*-----------------------------------------------------------------*/
	updateFrame : function(mouse, kbd, frameDelta, ufctx)
	{
		for(var i = 0; i < Softkbd.NUM_KEY; i++)
		{
			// 状態の更新
			this._arrBtn[i]._swOnPrev = this._arrBtn[i]._swOnCur;
			if(this._arrBtn[i]._cntOn >= 0)
			{
				this._arrBtn[i]._cntOn += frameDelta;
			}
			
			// マウスクリック判定
			if((mouse._xClick != null) && (mouse._yClick != null) && this._arrBtn[i]._rect.isPointIn(mouse._xClick - this._xBase, mouse._yClick - this._yBase))
			{
				this._arrBtn[i]._swOnCur = true;
				if((this._arrBtn[i]._cntOn < 0) || (this._arrBtn[i]._cntOn >= 3))
				{
					this._arrBtn[i]._cntOn = 0;
				}
			}
			else
			{
				this._arrBtn[i]._swOnCur = false;
				this._arrBtn[i]._cntOn = -1;
			}
			
			// フレームのフラグの更新
			this._arrBtn[i]._onPush = (this._arrBtn[i]._swOnCur && !this._arrBtn[i]._swOnPrev);
			this._arrBtn[i]._onRelease = (!this._arrBtn[i]._swOnCur && this._arrBtn[i]._swOnPrev);
			this._arrBtn[i]._onRepeat = (this._arrBtn[i]._cntOn == 0);
		}
		
		// キーボード入力除法に伝達	
		if(this._arrBtn[Softkbd.KEY_LEFT]._onRepeat)	{	kbd._onkey[JAFW.KeybordIf.KEYCODE_LEFT] = true;		}
		if(this._arrBtn[Softkbd.KEY_UP]._onPush)		{	kbd._onkey[JAFW.KeybordIf.KEYCODE_UP] = true;		}
		if(this._arrBtn[Softkbd.KEY_RIGHT]._onRepeat)	{	kbd._onkey[JAFW.KeybordIf.KEYCODE_RIGHT] = true;	}
		if(this._arrBtn[Softkbd.KEY_DOWN]._onPush)		{	kbd._onkey[JAFW.KeybordIf.KEYCODE_DOWN] = true;		}
		if(this._arrBtn[Softkbd.KEY_SPACE]._onRepeat)	{	kbd._onkey[JAFW.KeybordIf.KEYCODE_SPACE] = true;	}
		if(this._arrBtn[Softkbd.KEY_ESC]._onRelease)	{	kbd._onkey[JAFW.KeybordIf.KEYCODE_ESC] = true;		}
	},

	/*-----------------------------------------------------------------*//**
		フレーム描画
	**//*-----------------------------------------------------------------*/
	drawFrame : function(dfctx)
	{
		for(var i = 0; i < Softkbd.NUM_KEY; i++)
		{
			if(this._arrBtn[i]._swOnCur)	{	dfctx._ctx2d.fillStyle = 'rgb(255, 255, 63)';	}
			else							{	dfctx._ctx2d.fillStyle = 'rgb(191, 191, 191)';	}
			dfctx._ctx2d.beginPath();
			dfctx._ctx2d.fillRect(this._xBase + this._arrBtn[i]._rect._v[0], this._yBase + this._arrBtn[i]._rect._v[1], this._arrBtn[i]._rect._v[2] - 1, this._arrBtn[i]._rect._v[3] - 1);
		}
		dfctx._ctx2d.font = "12px Arial";
		dfctx._ctx2d.fillStyle = 'rgb(0, 0, 0)';
		for(var i = 0; i < Softkbd.NUM_KEY; i++)
		{
			var w = dfctx._ctx2d.measureText(this._arrBtn[i]._name).width;
			dfctx._ctx2d.fillText(this._arrBtn[i]._name, this._xBase + this._arrBtn[i]._rect._v[0] + ((this._arrBtn[i]._rect._v[2] - 1 - w) / 2), this._yBase + this._arrBtn[i]._rect._v[1] + ((this._arrBtn[i]._rect._v[3] - 1) / 2) + 3);
		}
	},
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	アプリケーションクラス
 *	
**//*---------------------------------------------------------------------*/
var App = function(nameCanvas, width, height)
{
	JAFW.AppBody.call(this, nameCanvas, width, height);

	//======================================================================
	// App メンバ変数

	this._softkbd = new Softkbd(30, App.PADDING_TOP_STAGE + 30);
	this._isDebug = true;
};
App.prototype = new JAFW.AppBody();

//==========================================================================
// App 定数

App.PADDING_LEFT_STAGE = 90;
App.PADDING_TOP_STAGE = 30;
App.PADDING_RIGHT_STAGE = 30;
App.PADDING_BOTTOM_STAGE = 120;

//==========================================================================
// App メソッド

/*---------------------------------------------------------------------*//**
	開始処理
**//*---------------------------------------------------------------------*/
App.prototype.start = function()
{
	JAFW.AppBody.prototype.start.call(this);

	// 開始処理
	this.startApp();
};

/*---------------------------------------------------------------------*//**
	開始処理
**//*---------------------------------------------------------------------*/
App.prototype.startApp = function()
{
};

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
App.prototype.updateFrame = function(frameDelta, ufctx)
{
	JAFW.AppBody.prototype.updateFrame.call(this, frameDelta, ufctx);
	
	// ソフトウェアキーボードの更新
	this._softkbd.updateFrame(this._mouse, this._kbd, frameDelta, ufctx);
	
	if(this._kbd._onkey[JAFW.KeybordIf.KEYCODE_LEFT] || this._kbd._onkey[JAFW.KeybordIf.KEYCODE_RIGHT])
	{
	}
	if(this._kbd._onkey[JAFW.KeybordIf.KEYCODE_UP] || this._kbd._onkey[JAFW.KeybordIf.KEYCODE_DOWN])
	{
	}
	if(this._kbd._onkey[JAFW.KeybordIf.KEYCODE_ESC])
	{
	}
	if(this._kbd._onkey[JAFW.KeybordIf.KEYCODE_PAGEUP])
	{
	}
	if(this._kbd._onkey[JAFW.KeybordIf.KEYCODE_PAGEDOWN])
	{
	}
	if(this._kbd._onkey[JAFW.KeybordIf.KEYCODE_SPACE])
	{
	}
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
App.prototype.drawFrame = function(dfctx)
{
	var x, y, w, h;
	dfctx._ctx2d.clearRect(0, 0, this.WIDTH, this.HEIGHT);
	dfctx._ctx2d.lineWidth = 1;
	
	dfctx._ctx2d.font = "italic 20px 'Times New Roman'";
	dfctx._ctx2d.fillStyle = 'rgb(127, 127, 127)';
	dfctx._ctx2d.fillText("SCORE: ", App.PADDING_LEFT_STAGE, App.PADDING_TOP_STAGE - 10);
	
	// ソフトウェアキーボード描画
	this._softkbd.drawFrame(dfctx);
	
	// test
	if(this._isDebug)
	{
		// test
		dfctx._ctx2d.font = "italic 20px 'Times New Roman'";
		dfctx._ctx2d.fillStyle = 'rgb(127, 127, 127)';
		switch(this._cntFrame & 3)
		{
		case 0:	dfctx._ctx2d.fillText("|", 10, 10);		break;
		case 1:	dfctx._ctx2d.fillText("/", 10, 10);		break;
		case 2:	dfctx._ctx2d.fillText("-", 10, 10);		break;
		case 3:	dfctx._ctx2d.fillText("\\", 10, 10);	break;
		}
		
		// 表示領域表示
		dfctx._ctx2d.font = "italic 20px 'Times New Roman'";
		dfctx._ctx2d.fillStyle = 'rgb(127, 127, 127)';
		dfctx._ctx2d.strokeStyle = 'rgb(127, 127, 127)';
		dfctx._ctx2d.lineWidth = 2;
		dfctx._ctx2d.beginPath();
		dfctx._ctx2d.moveTo(0, 714);
		dfctx._ctx2d.lineTo(this.WIDTH, 714);
		dfctx._ctx2d.closePath();
		dfctx._ctx2d.stroke();
		dfctx._ctx2d.fillText("iPhone - DEFAULT (y=714)", 0, 714);
		dfctx._ctx2d.beginPath();
		dfctx._ctx2d.moveTo(0, 763);
		dfctx._ctx2d.lineTo(this.WIDTH, 763);
		dfctx._ctx2d.closePath();
		dfctx._ctx2d.stroke();
		dfctx._ctx2d.fillText("iPad - DEFAULT (y=763)", 0, 763);
		dfctx._ctx2d.beginPath();
		dfctx._ctx2d.moveTo(0, 835);
		dfctx._ctx2d.lineTo(this.WIDTH, 835);
		dfctx._ctx2d.closePath();
		dfctx._ctx2d.stroke();
		dfctx._ctx2d.fillText("iPhone - MAX (y=835)", 0, 835);
		dfctx._ctx2d.beginPath();
		dfctx._ctx2d.moveTo(0, 853);
		dfctx._ctx2d.lineTo(this.WIDTH, 853);
		dfctx._ctx2d.closePath();
		dfctx._ctx2d.stroke();
		dfctx._ctx2d.fillText("App - MAX (y=854)", 0, 854);
		
		// プレビュー音領域表示
		dfctx._ctx2d.strokeRect(this.X_PVSND_RANGE, this.Y_PVSND_RANGE, this.W_PVSND_RANGE, this.H_PVSND_RANGE);
	}
};


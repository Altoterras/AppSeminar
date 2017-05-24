////////////////////////////////////////////////////////////////////////////
// デバックパラメータ取得

// ロード用
var loadBtn = 0;
var loadOpen = 0;
var loadLv = 1;
//起動時にセーブデータ読み込み
if (localStorage.getItem('molcolsaveData')) {
  var loadData = JSON.parse(localStorage.getItem('molcolsaveData'));
  var clearLv = Object.keys(loadData).length;
}

// デバック用
var dbgmode = 0;
var getparam = getQueryString();
function getQueryString() {
	if (1 < document.location.search.length) {
		var query = document.location.search.substring(1);	// 最初の1文字 (?記号) を除いた文字列を取得する
		var parameters = query.split('&');					// クエリの区切り記号 (&記号) で文字列を配列に分割する
		var result = new Object();
		for (var i = 0; i < parameters.length; i++) {
			var element = parameters[i].split('=');	// パラメータ名と値に分割する
			var paramName = decodeURIComponent(element[0]);
			var paramValue = decodeURIComponent(element[1]);
			result[paramName] = decodeURIComponent(paramValue);	// パラメータ名をキーとして連想配列に追加する
		}
		return result;
	}
	return null;
}

if (getparam != null) {
	if(getparam.dbgmode !=null) {
		dbgmode = getparam.dbgmode;
	}
}

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ステージ クラス
 *
**//*---------------------------------------------------------------------*/
var Stage = function(widthStage, heightStage)
{
	//======================================================================
	// Stage メンバ変数

	this.WIDTH = widthStage;
	this.HEIGHT = heightStage;

	this._flags = 0;
};

Stage.prototype =
{
	//======================================================================
	// Stage 定数

	F_GRAVITY : 0x00000001,			// 重力ありフラグ
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	要素クラス
 *
**//*---------------------------------------------------------------------*/
var Element = function(src)
{
	//======================================================================
	// Element メンバ変数

	if(src === undefined)	// デフォルトコンストラクタ
	{
		this._pos = new Vector2();
		this._vel = new Vector2();
		this._r = 0;
		this._col = new Color();
		this._cntUnionAnim = 0;
		this._elmAnimStart = null;
		this._elmAnimEnd = null;
		this._flags = 0;
	}
	else					// コピーコンストラクタ
	{
		this._pos = new Vector2(src._pos);
		this._vel = new Vector2(src._vel);
		this._r = src._r;
		this._col = new Color(src._col);
		this._cntUnionAnim = src._cntUnionAnim;
		this._elmAnimStart = src._elmAnimStart;
		this._elmAnimEnd = src._elmAnimEnd;
		this._flags = src._flags;
	}
};

Element.prototype =
{
	//======================================================================
	// Element 定数

	F_UNION_DELETE : 0x00000001,	// 合体後削除フラグ
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	キャノン クラス
 *
**//*---------------------------------------------------------------------*/
var Cannon = function(widthStage, numColShell)
{
	//======================================================================
	// Cannon メンバ変数

	// カラーテーブル作成
	this.COL_TABLE = [ new Color(), new Color(), new Color(), new Color() ];
	this.COL_TABLE[0]._r = 191;
	this.COL_TABLE[1]._g = 191;
	this.COL_TABLE[2]._b = 191;
	for(var i = 0; i < this.NUM_COL_TABLE; i++)
	{
		this.COL_TABLE[i]._a = 255;
	}

	this._x = widthStage * 0.5;
	this._colidx = 0;
	this._col = this.COL_TABLE[this._colidx];
	this._arrShell = new Array(10);
	this._arrCntCol = new Array(this.NUM_COL_TABLE);

	// 残弾数セット
	for(var i = 0; i < this.NUM_COL_TABLE; i++)
	{
		this._arrCntCol[i] = numColShell;
	}
};

Cannon.prototype =
{
	//======================================================================
	// Cannon 定数

	NUM_COL_TABLE : 4,
	COLIDX_BLACK : 3,
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	演出クラス
 *
**//*---------------------------------------------------------------------*/
var Perform = function()
{
	//======================================================================
	// Perform メンバ変数

	this._pos = new Vector2();
	this._r = 0;
	this._msg = 0;
	this._cntAnim = 0;
	this._cntAnimMax = 0;
	this._flags = 0;
};

Perform.prototype =
{
	//======================================================================
	// Perform 定数

	F_GAME_START : 0x000001,
	F_CLEAR_ELM : 0x000002,
	F_CLEAR_LV : 0x000004,
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ソフトウェア キーボード ボタン クラス
 *
**//*---------------------------------------------------------------------*/
var SoftkbdBtn = function()
{
	//======================================================================
	// SoftkbdBtn メンバ変数

	this._rect = new Rect();
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
	this._arrBtn = new Array(this.NUM_KEY);

	// ボタン作成
	for(var i = 0; i < this.NUM_KEY; i++)
	{
		this._arrBtn[i] = new SoftkbdBtn();
	}
	var s = 60;
	this._arrBtn[this.KEY_LEFT	].set( 0 * s,  1 * s, s, s, "←");
	this._arrBtn[this.KEY_UP	].set( 1 * s,  0 * s, s, s, "↑");
	this._arrBtn[this.KEY_RIGHT	].set( 2 * s,  1 * s, s, s, "→");
	this._arrBtn[this.KEY_DOWN	].set( 1 * s,  2 * s, s, s, "↓");
	this._arrBtn[this.KEY_SPACE	].set( 3.5 * s,  1 * s, s * 2, s, "SHOT");
	this._arrBtn[this.KEY_ESC	].set( 6 * s,  1 * s, s, s, "ESC");
	this._arrBtn[this.KEY_PREV	].set( 3.5 * s, 2.55 * s, s / 2, s / 2.5, "←");
	this._arrBtn[this.KEY_NEXT	].set( 5 * s, 2.55 * s, s / 2, s / 2.5, "→");
	this._arrBtn[this.KEY_LOAD	].set( 6 * s,  2.55 * s, s * 1, s / 2.5, "LOAD");
};


Softkbd.prototype =
{
	//======================================================================
	// Softkbd 定数

	KEY_LEFT : 0,		// ←
	KEY_UP : 1,			// ↑
	KEY_RIGHT : 2,		// →
	KEY_DOWN : 3,		// ↓
	KEY_SPACE : 4,		// Space
	KEY_ESC : 5,		// Esc
  KEY_PREV : 6,		// Prev
  KEY_NEXT : 7,		// Next
  KEY_LOAD : 8,		// Load
	NUM_KEY : 9,

	//======================================================================
	// Softkbd メソッド

	/*-----------------------------------------------------------------*//**
		フレーム更新
	**//*-----------------------------------------------------------------*/
	updateFrame : function(mouse, kbd, frameDelta)
	{
		for(var i = 0; i < this.NUM_KEY; i++)
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

		// キーボード入力情報に伝達
		if(this._arrBtn[this.KEY_LEFT]._onRepeat)	{	kbd._onkey[KeybordIf.prototype.KEYCODE_LEFT] = true;	}
		if(this._arrBtn[this.KEY_UP]._onPush)		{	kbd._onkey[KeybordIf.prototype.KEYCODE_UP] = true;		}
		if(this._arrBtn[this.KEY_RIGHT]._onRepeat)	{	kbd._onkey[KeybordIf.prototype.KEYCODE_RIGHT] = true;	}
		if(this._arrBtn[this.KEY_DOWN]._onPush)		{	kbd._onkey[KeybordIf.prototype.KEYCODE_DOWN] = true;	}
		if(this._arrBtn[this.KEY_SPACE]._onRepeat)	{	kbd._onkey[KeybordIf.prototype.KEYCODE_SPACE] = true;	}
		if(this._arrBtn[this.KEY_ESC]._onRelease)	{	kbd._onkey[KeybordIf.prototype.KEYCODE_ESC] = true;		}
    if(this._arrBtn[this.KEY_PREV]._onRelease) {
      if (loadLv > 1) {
        loadLv--;
        //console.log(loadData[loadLv]);
      }
    }
    if(this._arrBtn[this.KEY_NEXT]._onRelease) {
      if (loadLv < clearLv) {
        loadLv++;
        //console.log(loadData[loadLv]);
      }
    }
		if(this._arrBtn[this.KEY_LOAD]._onRelease) {
      loadBtn = 1;   }
      //kbd._onkey[KeybordIf.prototype.KEYCODE_LOAD] = true;   }
	},

	/*-----------------------------------------------------------------*//**
		フレーム描画
	**//*-----------------------------------------------------------------*/
	drawFrame : function(ctx)
	{ var img = new Image();
		img.src = 'img/btn01.png'
		for(var i = 0; i < this.NUM_KEY; i++)
		{
			if(this._arrBtn[i]._swOnCur)	{ctx.drawImage(img, this._xBase + this._arrBtn[i]._rect._v[0], this._yBase + this._arrBtn[i]._rect._v[1], (this._arrBtn[i]._rect._v[2] - 1)*0.8, (this._arrBtn[i]._rect._v[3] - 1)*0.8);}
			else							{ctx.drawImage(img, this._xBase + this._arrBtn[i]._rect._v[0], this._yBase + this._arrBtn[i]._rect._v[1], this._arrBtn[i]._rect._v[2] - 1, this._arrBtn[i]._rect._v[3] - 1);}
			ctx.beginPath();
					}
		ctx.font = "12px Nico Moji";
		ctx.fillStyle = 'rgb(255, 255, 255)';
		for(var i = 0; i < this.NUM_KEY; i++)
		{
			var w = ctx.measureText(this._arrBtn[i]._name).width;
			if(this._arrBtn[i]._swOnCur){ctx.fillText(this._arrBtn[i]._name, this._xBase + this._arrBtn[i]._rect._v[0] + (((this._arrBtn[i]._rect._v[2] - 1 - w)*0.8) / 2), this._yBase + this._arrBtn[i]._rect._v[1] + (((this._arrBtn[i]._rect._v[3] - 1)*0.8)/ 2) + 3, w*0.8);}
else{ctx.fillText(this._arrBtn[i]._name, this._xBase + this._arrBtn[i]._rect._v[0] + ((this._arrBtn[i]._rect._v[2] - 1 - w) / 2), this._yBase + this._arrBtn[i]._rect._v[1] + ((this._arrBtn[i]._rect._v[3] - 1) / 2) + 3);}
		}
	},
};

////////////////////////////////////////////////////////////////////////////


/*---------------------------------------------------------------------*//**
 *	ゲームクラス
 *
**//*---------------------------------------------------------------------*/

var Game = function(width, height)
{
	GameBody.call(this, width, height);

	//======================================================================
	// Game メンバ変数

	var widthStage = width - this.PADDING_LEFT_STAGE - this.PADDING_RIGHT_STAGE;
	var heightStage = height - this.PADDING_TOP_STAGE - this.PADDING_BOTTOM_STAGE;
	if(widthStage > heightStage)		{	widthStage = heightStage;	}
	else if(widthStage < heightStage)	{	heightStage = widthStage;	}
	this._stage = new Stage(widthStage, heightStage);
	this._arrElm = new Array(this.LV_MAX);
	this._cannon = new Cannon(widthStage, this.NUM_INIT_SHELL);
	this._softkbd = new Softkbd(30, this.PADDING_TOP_STAGE + this._stage.HEIGHT + 30);
	this._score = 0;
	this._arrPfm = new Array(this.LV_MAX);
	this._lv =1;

	// デバッグ機能によるレベル直指定
	if (dbgmode === "1") {
		if(getparam.LEVEL != null) {
			this._lv = Number(getparam.LEVEL);
		}
	}

	this._esc = 0;
	this._velMax = this.VEL_MAX_DEFAULT;
  	// セーブ用の変数を定義
	this._saveData = new Object;
	this._saveData['1'] = {
		"_score": 0,
		"_cannon": [this.NUM_INIT_SHELL, this.NUM_INIT_SHELL, this.NUM_INIT_SHELL, this.NUM_INIT_SHELL]
	};

	this.lvData = new Object;
};
  Game.prototype = new GameBody();

//==========================================================================
// Game 定数

Game.prototype.FPS_STD = 60;
Game.prototype.GRAVITY = 0.98;

Game.prototype.R_ELM_DEFAULT_MIN = 20;
Game.prototype.R_ELM_DEFAULT_MAX = 40;
Game.prototype.R_SHELL = 3;
Game.prototype.R_CLEAR_ELM_ANIM_INC = 3;

Game.prototype.VEL_MAX_DEFAULT = 50;
Game.prototype.VEL_STAGE_COL_FRICTION = 2.0;	// ステージ跳ね返り時の摩擦係数
Game.prototype.VEL_STAGE_COL_RANDOM = 2;		// ステージ跳ね返り時の速度乱数
Game.prototype.VEL_INIT_SHELL = 700;
Game.prototype.VEL_ELM_COL_RATIO_SELF = 0.5;
Game.prototype.VEL_ELM_COL_RATIO_ANOT = 0.5;
Game.prototype.ELAST_ELM_COL = 1.0;				// 球同士跳ね返り係数

Game.prototype.PADDING_LEFT_STAGE = 90;
Game.prototype.PADDING_TOP_STAGE = 30;
Game.prototype.PADDING_RIGHT_STAGE = 30;
Game.prototype.PADDING_BOTTOM_STAGE = 120;

Game.prototype.COLOR_NEAR = 50;
Game.prototype.COLOR_INIT = 127;
Game.prototype.COLOR_RATIO_ELM = 1.0;//0.8;
Game.prototype.COLOR_RATIO_SHELL = 1.0;//0.2;
Game.prototype.COLOR_UNION_ALPHA = 127;

Game.prototype.X_CANNON_MOVE = 10;
Game.prototype.X_CANNON_MOVE_SHIFT = 20;
Game.prototype.X_CANNON_MOVE_CTRL = 2;

Game.prototype.FRAME_UNION_ANIM = 10;
Game.prototype.FRAME_GAME_START = 60;
Game.prototype.FRAME_CLEAR_ELM_ANIM = 60;
Game.prototype.FRAME_CLEAR_LV_ANIM = 180;

Game.prototype.SCORE_FROM_R = 1;
Game.prototype.SCORE_SHELL_MAX = 999;
Game.prototype.NUM_INIT_SHELL = 50;

Game.prototype.LV_MAX = 20;

//==========================================================================
// Game メソッド





/*---------------------------------------------------------------------*//**
	開始処理
**//*---------------------------------------------------------------------*/

Game.prototype.start = function()
{
	GameBody.prototype.start.call(this);

	// レベル開始
	this.startLv();
}



/*---------------------------------------------------------------------*//**
	レベル開始
**//*---------------------------------------------------------------------*/
Game.prototype.startLv = function()
{
	// 弾丸数初期化
	for(var i = 0; i < this._cannon.NUM_COL_TABLE; i++)
	{
		this._cannon._arrCntCol[i] = this.NUM_INIT_SHELL;
		
		// デバッグ機能による弾数直指定
		if (dbgmode === "1") {
			if(getparam.bullet != null){
				this._cannon._arrCntCol[i] = Number(getparam.bullet);
			}
		}
	}

	// レベル 21 以上は最大速度変更
	this._velMax = this.VEL_MAX_DEFAULT;
	if(this._lv > 20)
	{
		this._velMax += this.VEL_MAX_DEFAULT * (this._lv * 0.025);
	}

	// 要素配置
	for(var i = 0; i < this._arrElm.length; i++)
	{
		if(this._arrElm[i] === undefined)	{	continue;	}
		delete this._arrElm[i];
	}
	for(var i = 0; (i < this._arrElm.length) && (i < this._lv); i++)
	{
		var radius = this.R_ELM_DEFAULT_MIN + (Math.random() * (this.R_ELM_DEFAULT_MAX - this.R_ELM_DEFAULT_MIN));
		this._arrElm[i] = new Element();
		this._arrElm[i]._vel._v[0] = ((Math.random() * 2.0) - 1.0) * this._velMax;
		this._arrElm[i]._vel._v[1] = ((Math.random() * 2.0) - 1.0) * this._velMax;
		this._arrElm[i]._r = radius;
		this._arrElm[i]._col._r = Math.round(Math.random() * 255);
		this._arrElm[i]._col._g = Math.round(Math.random() * 255);
		this._arrElm[i]._col._b = Math.round(Math.random() * 255);
		this._arrElm[i]._col._a = 255;

		for(var cnt = 0; cnt < 100; cnt++)
		{
			this._arrElm[i]._pos._v[0] = radius + (Math.random() * (this._stage.WIDTH - (radius * 2)));
			this._arrElm[i]._pos._v[1] =radius + (Math.random() * (this._stage.HEIGHT - (radius * 2)));

			// 重複回避
			var ok = true;
			for(var j = 0; j < i; j++)
			{
				var vDif = this._arrElm[j]._pos.sub(this._arrElm[i]._pos);
				var distSq = vDif.lengthSq();
				var rSq = (this._arrElm[i]._r + this._arrElm[j]._r) * (this._arrElm[i]._r + this._arrElm[j]._r);
				if(distSq < rSq)
				{
					ok = false;
					break;
				}
			}
			if(ok)	{	break;	}
		}
	}

	// 開始演出
	if(this._lv <= 1)
	{
		this._arrPfm[0] = new Perform();
		this._arrPfm[0]._pos._v[0] = this._stage.WIDTH / 2;
		this._arrPfm[0]._pos._v[1] = this._stage.HEIGHT / 2;
		this._arrPfm[0]._r = 0;
		this._arrPfm[0]._msg = 'GAME START!';
		this._arrPfm[0]._cntAnim = this._arrPfm[0]._cntAnimMax = this.FRAME_GAME_START;
		this._arrPfm[0]._flags = Perform.prototype.F_GAME_START;
	}

	/* test1 * /
	if(this._lv >= 2)
	{
		this._arrElm[0]._vel._v[0] = 0;
		this._arrElm[0]._vel._v[1] = this._velMax;
		this._arrElm[0]._pos._v[0] = this._stage.WIDTH / 2;
		this._arrElm[0]._pos._v[1] = 100;
		this._arrElm[1]._vel._v[0] = 0;
		this._arrElm[1]._vel._v[1] = - this._velMax;
		this._arrElm[1]._pos._v[0] = this._stage.WIDTH / 2 + 20;
		this._arrElm[1]._pos._v[1] = 200;
	}
	/* test2 * /
	if(this._lv >= 1)
	{
		this._arrElm[0]._vel._v[0] = 0;
		this._arrElm[0]._vel._v[1] = 0;
		this._arrElm[0]._pos._v[0] = this._stage.WIDTH / 2;
		this._arrElm[0]._pos._v[1] = 100;
	}
	/**/
}

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
Game.prototype.updateFrame = function(frameDelta)
{
	GameBody.prototype.updateFrame.call(this, frameDelta);

	// ソフトウェアキーボードの更新
	this._softkbd.updateFrame(this._mouse, this._kbd, frameDelta);

	// 要素更新
	var cntValidElm = 0;
	for(var i = 0; i < this._arrElm.length; i++)
	{
		if(this._arrElm[i] === undefined)	{	continue;	}
		cntValidElm++;

		// アニメーション処理
		if((this._arrElm[i]._cntUnionAnim > 0) && (this._arrElm[i]._elmAnimStart != null) && (this._arrElm[i]._elmAnimEnd != null))
		{
			this._arrElm[i]._cntUnionAnim -= frameDelta;	// アニメーションフレームカウンタ更新
			var ratioStart = this._arrElm[i]._cntUnionAnim / this.FRAME_UNION_ANIM;
			var ratioEnd = 1.0 - ratioStart;
			this._arrElm[i]._pos = this._arrElm[i]._elmAnimStart._pos.multScalar(ratioStart).add(this._arrElm[i]._elmAnimEnd._pos.multScalar(ratioEnd));
			this._arrElm[i]._r = (this._arrElm[i]._elmAnimStart._r * ratioStart) + (this._arrElm[i]._elmAnimEnd._r * ratioEnd);
			this._arrElm[i]._col._r = (this._arrElm[i]._elmAnimStart._col._r * ratioStart) + (this._arrElm[i]._elmAnimEnd._col._r * ratioEnd);
			this._arrElm[i]._col._g = (this._arrElm[i]._elmAnimStart._col._g * ratioStart) + (this._arrElm[i]._elmAnimEnd._col._g * ratioEnd);
			this._arrElm[i]._col._b = (this._arrElm[i]._elmAnimStart._col._b * ratioStart) + (this._arrElm[i]._elmAnimEnd._col._b * ratioEnd);
			if(this._arrElm[i]._cntUnionAnim <= 0)
			{
				// アニメーション終了
				this._arrElm[i]._cntUnionAnim = 0;
				this._arrElm[i]._col._a = 255;
				this._arrElm[i]._elmAnimStart = null;
				this._arrElm[i]._elmAnimEnd = null;
				if(this._arrElm[i]._flags & Element.prototype.F_UNION_DELETE)
				{
					delete this._arrElm[i];
				}
			}
			continue;
		}

		// 色が白になったらクリア
		if(	(this._arrElm[i]._col._r >= 245) &&
			(this._arrElm[i]._col._g >= 245) &&
			(this._arrElm[i]._col._b >= 245)	)
		{
			// スコアを上げる
			var score = Math.round(this.SCORE_FROM_R * this._arrElm[i]._r * this._arrElm[i]._r * 0.05);
			if(score > this.SCORE_SHELL_MAX)
			{
				score = this.SCORE_SHELL_MAX;
			}
			this._score += score;
			// 演出をセット
			for(var j = 0; j < this._arrPfm.length; j++)
			{
				if(this._arrPfm[j] === undefined)
				{
					this._arrPfm[j] = new Perform();
					this._arrPfm[j]._pos.copy(this._arrElm[i]._pos);
					this._arrPfm[j]._r = this._arrElm[i]._r;
					this._arrPfm[j]._msg = "" + score;
					this._arrPfm[j]._cntAnim = this._arrPfm[j]._cntAnimMax = this.FRAME_CLEAR_ELM_ANIM;
					this._arrPfm[j]._flags = Perform.prototype.F_CLEAR_ELM;
					break;
				}
			}
			// 消滅
			delete this._arrElm[i];
			// 残弾数を増やす
			for(var i = 0; i < this._cannon.NUM_COL_TABLE; i++)
			{
				this._cannon._arrCntCol[i] += score;
				if(this._cannon._arrCntCol[i] > this.SCORE_SHELL_MAX)
				{
					this._cannon._arrCntCol[i] = this.SCORE_SHELL_MAX;
				}
			}
			continue;
		}

		// 速度による位置更新
		this._arrElm[i]._pos._v[0] += this._arrElm[i]._vel._v[0] / this.FPS_STD * frameDelta;
		this._arrElm[i]._pos._v[1] += this._arrElm[i]._vel._v[1] / this.FPS_STD * frameDelta;
		// 自然落下重力
		if(this._stage._flags & Stage.prototype.F_GRAVITY)
		{
			this._arrElm[i]._vel._v[1] += this.GRAVITY;
		}

		// 跳ね返り
		if((this._arrElm[i]._pos._v[0] + this._arrElm[i]._r) > this._stage.WIDTH)
		{
			this._arrElm[i]._pos._v[0] = this._stage.WIDTH - this._arrElm[i]._r;
			this._arrElm[i]._vel._v[0] = - this._arrElm[i]._vel._v[0] * this.VEL_STAGE_COL_FRICTION;
			if(this._arrElm[i]._vel._v[0] < - this._velMax)	{	this._arrElm[i]._vel._v[0] = - this._velMax;	}
			this._arrElm[i]._vel._v[1] += ((Math.random() * 2.0) - 1.0) * this.VEL_STAGE_COL_RANDOM;
		}
		else if((this._arrElm[i]._pos._v[0] - this._arrElm[i]._r) < 0)
		{
			this._arrElm[i]._pos._v[0] = this._arrElm[i]._r;
			this._arrElm[i]._vel._v[0] = - this._arrElm[i]._vel._v[0] * this.VEL_STAGE_COL_FRICTION;
			if(this._arrElm[i]._vel._v[0] > this._velMax)	{	this._arrElm[i]._vel._v[0] = this._velMax;		}
			this._arrElm[i]._vel._v[1] += ((Math.random() * 2.0) - 1.0) * this.VEL_STAGE_COL_RANDOM;
		}
		if((this._arrElm[i]._pos._v[1] + this._arrElm[i]._r) > this._stage.HEIGHT)
		{
			this._arrElm[i]._pos._v[1] = this._stage.HEIGHT - this._arrElm[i]._r;
			this._arrElm[i]._vel._v[1] = - this._arrElm[i]._vel._v[1] * this.VEL_STAGE_COL_FRICTION;
			if(this._arrElm[i]._vel._v[1] < - this._velMax)	{	this._arrElm[i]._vel._v[1] = - this._velMax;	}
			this._arrElm[i]._vel._v[0] += ((Math.random() * 2.0) - 1.0) * this.VEL_STAGE_COL_RANDOM;
		}
		else if((this._arrElm[i]._pos._v[1] - this._arrElm[i]._r) < 0)
		{
			this._arrElm[i]._pos._v[1] = this._arrElm[i]._r;
			this._arrElm[i]._vel._v[1] = - this._arrElm[i]._vel._v[1] * this.VEL_STAGE_COL_FRICTION;
			if(this._arrElm[i]._vel._v[1] > this._velMax)	{	this._arrElm[i]._vel._v[1] = this._velMax;		}
			this._arrElm[i]._vel._v[0] += ((Math.random() * 2.0) - 1.0) * this.VEL_STAGE_COL_RANDOM;
		}

		// 衝突
		for(var j = i + 1; j < this._arrElm.length; j++)
		{
			if(this._arrElm[j] === undefined)	{	continue;	}

			var vDif = this._arrElm[j]._pos.sub(this._arrElm[i]._pos);
			var distSq = vDif.lengthSq();
			var rSq = (this._arrElm[i]._r + this._arrElm[j]._r) * (this._arrElm[i]._r + this._arrElm[j]._r);

			if(distSq < rSq)	// 衝突した
			{
				// 注視ベクトル
				var vAim = vDif.normalize();
				// 衝突点
				var vColPos = new Vector2();
				vColPos._v[0] = this._arrElm[i]._pos._v[0] + (vAim._v[0] * this._arrElm[i]._r);
				vColPos._v[1] = this._arrElm[i]._pos._v[1] + (vAim._v[1] * this._arrElm[i]._r);
				// 合計半径
				var rSum = this._arrElm[i]._r + this._arrElm[j]._r;

				// 色が近ければくっつく、色が遠ければ跳ね返る
				if(	(rSum < (this._stage.WIDTH / 4)) && (rSum < (this._stage.HEIGHT / 4)) &&	// ただし、ステージサイズの 25% の半径まで
					( ((this._arrElm[i]._col._r - this.COLOR_NEAR) <= this._arrElm[j]._col._r) && (this._arrElm[j]._col._r < (this._arrElm[i]._col._r + this.COLOR_NEAR)) ) &&
					( ((this._arrElm[i]._col._g - this.COLOR_NEAR) <= this._arrElm[j]._col._g) && (this._arrElm[j]._col._g < (this._arrElm[i]._col._g + this.COLOR_NEAR)) ) &&
					( ((this._arrElm[i]._col._b - this.COLOR_NEAR) <= this._arrElm[j]._col._b) && (this._arrElm[j]._col._b < (this._arrElm[i]._col._b + this.COLOR_NEAR)) )	)
				{
					// 合体アニメーションへ
					this._arrElm[i]._vel.copy(this._arrElm[i]._vel.add(this._arrElm[j]._vel).multScalar(0.5));
					this._arrElm[i]._col._a = this.COLOR_UNION_ALPHA;
					this._arrElm[i]._elmAnimStart = new Element(this._arrElm[i]);
					this._arrElm[i]._elmAnimEnd = new Element();
					this._arrElm[i]._elmAnimEnd._pos.copy(vColPos);
					this._arrElm[i]._elmAnimEnd._col._r = (this._arrElm[i]._col._r + this._arrElm[j]._col._r) * 0.5;
					this._arrElm[i]._elmAnimEnd._col._g = (this._arrElm[i]._col._g + this._arrElm[j]._col._g) * 0.5;
					this._arrElm[i]._elmAnimEnd._col._b = (this._arrElm[i]._col._b + this._arrElm[j]._col._b) * 0.5;
					this._arrElm[i]._elmAnimEnd._col._a = this.COLOR_UNION_ALPHA;;
					this._arrElm[i]._elmAnimEnd._r = rSum;
					this._arrElm[i]._cntUnionAnim = this.FRAME_UNION_ANIM;
					// 片方消滅
					this._arrElm[j]._flags |= Element.prototype.F_UNION_DELETE;
					this._arrElm[j]._col._a = this.COLOR_UNION_ALPHA;
					this._arrElm[j]._elmAnimStart = new Element(this._arrElm[j]);
					this._arrElm[j]._elmAnimEnd = new Element(this._arrElm[i]._elmAnimEnd);
					this._arrElm[j]._cntUnionAnim = this.FRAME_UNION_ANIM;
				}
				else	// 跳ね返り
				{
					// 離れる
					this._arrElm[i]._pos._v[0] = vColPos._v[0] - (vAim._v[0] * this._arrElm[i]._r * 1.01);
					this._arrElm[i]._pos._v[1] = vColPos._v[1] - (vAim._v[1] * this._arrElm[i]._r * 1.01);
					this._arrElm[j]._pos._v[0] = vColPos._v[0] + (vAim._v[0] * this._arrElm[j]._r * 1.01);
					this._arrElm[j]._pos._v[1] = vColPos._v[1] + (vAim._v[1] * this._arrElm[j]._r * 1.01);

					// 接線ベクトル
					var vTan = new Vector2();
					vTan._v[0] = vAim._v[1];
					vTan._v[1] = - vAim._v[0];
					// アフィン行列
					var mtxAffine = new Matrix22();
					mtxAffine._m[0][0] = vTan._v[0];
					mtxAffine._m[1][0] = vTan._v[1];
					mtxAffine._m[0][1] = vAim._v[0];
					mtxAffine._m[1][1] = vAim._v[1];
					// アフィン逆行列
					var mtxAffineInv = mtxAffine.inverse();

					// 速度ベクトルのアフィン変換
					var vIa = mtxAffine.multVector(this._arrElm[i]._vel);
					var vJa = mtxAffine.multVector(this._arrElm[j]._vel);
					// 速度合成処理
					var vIaBk = new Vector2(vIa);
					var vJaBk = new Vector2(vJa);
					var mI = this._arrElm[i]._r * this._arrElm[i]._r;
					var mJ = this._arrElm[j]._r * this._arrElm[j]._r;
					vIa._v[1] = ((vJaBk._v[1] - vIaBk._v[1]) * (1.0 + this.ELAST_ELM_COL) / ((mI / mJ) + 1.0)) + vIaBk._v[1];
					vJa._v[1] = ((vIaBk._v[1] - vJaBk._v[1]) * (1.0 + this.ELAST_ELM_COL) / ((mJ / mI) + 1.0)) + vJaBk._v[1];
					// 速度ベクトルのアフィン逆変換
					this._arrElm[i]._vel.copy(mtxAffineInv.multVector(vIa));
					this._arrElm[j]._vel.copy(mtxAffineInv.multVector(vJa));
				}
				break;
			}
		}
	}

	// レベルクリア
	if(cntValidElm <= 0)
	{
		// 演出をセット
		for(var j = 0; j < this._arrPfm.length; j++)
		{
			if(this._arrPfm[j] === undefined)
			{
				this._arrPfm[j] = new Perform();
				this._arrPfm[j]._pos._v[0] = this._stage.WIDTH / 2;
				this._arrPfm[j]._pos._v[1] = this._stage.HEIGHT / 2;
				this._arrPfm[j]._r = 0;
				this._arrPfm[j]._msg = 'LV ' + this._lv + " CLEAR!";
				this._arrPfm[j]._cntAnim = this._arrPfm[j]._cntAnimMax = this.FRAME_CLEAR_LV_ANIM;
				this._arrPfm[j]._flags = Perform.prototype.F_CLEAR_LV;
				break;
			}
		}

		// 次のレベルへ
		this._lv++;

		// オートセーブ機能　データの読み込み（デバッグモードのときは保存しない）
		if (!dbgmode){

			// 初期でデータを読み込んでいるときは、不要なので削除予定
			if(JSON.parse(localStorage.getItem('molcolsaveData'))) {
				this._saveData = JSON.parse(localStorage.getItem('molcolsaveData'))
			}
			// 削除予定終わり

			// 現在のレベルとデータの追加
			this.lvData._score = this._score;
			this.lvData._cannon = this._cannon._arrCntCol;
			this._saveData[this._lv] = this.lvData;
			// ローカルへの保存
			localStorage.removeItem("molcolsaveData");
			localStorage.setItem('molcolsaveData', JSON.stringify(this._saveData));
		}

		//次のステージの開始
		this.startLv();
	}

  //ロード　ステージクリア時にセーブデータ更新
  if (localStorage.getItem('molcolsaveData')) {
    loadData = JSON.parse(localStorage.getItem('molcolsaveData'));
    clearLv = Object.keys(loadData).length;
  }
  if (loadBtn === 1) {
    if (localStorage.getItem('molcolsaveData')) {
      this._lv = loadLv;
      this._score = loadData['' + loadLv]._score;
      console.log(loadData[clearLv]);
    }
    else {
      this._lv = 1;
      this._score = 0;
    }
    loadBtn = 0;
    this.startLv();
  }

	// キャノンの更新
	if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_LEFT] || this._kbd._onkey[KeybordIf.prototype.KEYCODE_RIGHT])
	{
		// キャノンの位置移動
		if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_LEFT])
		{
			if(this._kbd._shift)		{	this._cannon._x -= this.X_CANNON_MOVE_SHIFT;	}
			else if(this._kbd._ctrl)	{	this._cannon._x -= this.X_CANNON_MOVE_CTRL;		}
			else						{	this._cannon._x -= this.X_CANNON_MOVE;			}
			if(this._cannon._x < 0)						{	this._cannon._x = 0;						}
		}
		if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_RIGHT])
		{
			if(this._kbd._shift)		{	this._cannon._x += this.X_CANNON_MOVE_SHIFT;	}
			else if(this._kbd._ctrl)	{	this._cannon._x += this.X_CANNON_MOVE_CTRL;		}
			else						{	this._cannon._x += this.X_CANNON_MOVE;			}
			if(this._cannon._x >= this._stage.WIDTH)	{	this._cannon._x = this._stage.WIDTH - 1;	}
		}
	}
	if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_UP] || this._kbd._onkey[KeybordIf.prototype.KEYCODE_DOWN])
	{
		// キャノンの色変更
		if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_UP])
		{
			this._cannon._colidx--;
			if(this._cannon._colidx < 0)
			{
				this._cannon._colidx = this._cannon.NUM_COL_TABLE - 1;
			}
		}
		if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_DOWN])
		{
			this._cannon._colidx++;
			if(this._cannon._colidx >= this._cannon.NUM_COL_TABLE)
			{
				this._cannon._colidx = 0;
			}
		}
		this._cannon._col = this._cannon.COL_TABLE[this._cannon._colidx];
	}
	if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_ESC])
	{
		// 弾丸補充
		if(this._score > 0)
		{
			var moveScore = this._score;
			if(moveScore > this.NUM_INIT_SHELL)
			{
				moveScore = this.NUM_INIT_SHELL;
			}
			for(var i = 0; i < this._cannon.NUM_COL_TABLE; i++)
			{
				this._cannon._arrCntCol[i] += moveScore;
				if(this._cannon._arrCntCol[i] > this.SCORE_SHELL_MAX)
				{
					this._cannon._arrCntCol[i] = this.SCORE_SHELL_MAX;
				}
			}
			this._score -= moveScore;
			this._esc++;
		}
	}
	if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_PAGEUP])
	{
		this._lv++;
		this.startLv();
	}
	if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_PAGEDOWN])
	{
		this._lv--;
		if(this._lv < 0)			{	this._lv = 0;			}
		this.startLv();
	}
	if(this._kbd._onkey[KeybordIf.prototype.KEYCODE_SPACE])
	{
		// 新規弾丸作成
		if(	(this._cannon._colidx == Cannon.prototype.COLIDX_BLACK) ||	// 黒弾丸は無条件に OK
			(this._cannon._arrCntCol[this._cannon._colidx] >= 1) )		// 残弾数がある
		{
			for(var i = 0; i < this._cannon.NUM_COL_TABLE; i++)
			{
				if(this._cannon._arrShell[i] === undefined)
				{
					this._cannon._arrShell[i] = new Element();
					this._cannon._arrShell[i]._pos._v[0] = this._cannon._x;
					this._cannon._arrShell[i]._pos._v[1] = this._stage.HEIGHT;
					this._cannon._arrShell[i]._vel._v[1] = - this.VEL_INIT_SHELL;
					this._cannon._arrShell[i]._r = this.R_SHELL;
					this._cannon._arrShell[i]._col = this._cannon._col;
					this._cannon._arrCntCol[this._cannon._colidx]--;
					break;
				}
			}
		}
	}

	// 弾丸の更新
	for(var i = 0; i < this._cannon._arrShell.length; i++)
	{
		if(this._cannon._arrShell[i] === undefined)	{	continue;	}

		// 速度による位置更新
		this._cannon._arrShell[i]._pos._v[0] += this._cannon._arrShell[i]._vel._v[0] / this.FPS_STD * frameDelta;
		this._cannon._arrShell[i]._pos._v[1] += this._cannon._arrShell[i]._vel._v[1] / this.FPS_STD * frameDelta;

		// ステージ外処理
		if(this._cannon._arrShell[i]._pos._v[1] < 0)
		{
			// 弾丸消滅
			delete this._cannon._arrShell[i];
			continue;
		}

		// 衝突
		for(var j = 0; j < this._arrElm.length; j++)
		{
			if(this._arrElm[j] === undefined)	{	continue;	}

			var vDif = this._arrElm[j]._pos.sub(this._cannon._arrShell[i]._pos);
			var distSq = vDif.lengthSq();
			var rSq = this._arrElm[j]._r * this._arrElm[j]._r;

			if(distSq <= rSq)	// 衝突した
			{
				var eI, eJ, rrI, rrJ;

				// 注視ベクトル
				var vAim = vDif.normalize();
				// 合計半径
				var rSum = this._cannon._arrShell[i]._r + this._arrElm[j]._r;

				// 色の合成
				rrI = this._cannon._arrShell[i]._r / rSum * 2.0 * this.COLOR_RATIO_SHELL;
				rrJ = this._arrElm[j]._r / rSum * 2.0 * this.COLOR_RATIO_ELM;
				if(rrJ > 1.0)	{	rrJ = 1.0;	}
				eI = this._cannon._arrShell[i]._col._r * rrI;
				eJ = this._arrElm[j]._col._r * rrJ;
				this._arrElm[j]._col._r = eI + eJ - (eI * eJ / 255.0);
				if(this._arrElm[j]._col._r > 255)	{	this._arrElm[j]._col._r = 255;	}
				eI = this._cannon._arrShell[i]._col._g * rrI;
				eJ = this._arrElm[j]._col._g * rrJ;
				this._arrElm[j]._col._g = eI + eJ - (eI * eJ / 255.0);
				if(this._arrElm[j]._col._g > 255)	{	this._arrElm[j]._col._g = 255;	}
				eI = this._cannon._arrShell[i]._col._b * rrI;
				eJ = this._arrElm[j]._col._b * rrJ;
				this._arrElm[j]._col._b = eI + eJ - (eI * eJ / 255.0);
				if(this._arrElm[j]._col._b > 255)	{	this._arrElm[j]._col._b = 255;	}

				// 接線ベクトル
				var vTan = new Vector2();
				vTan._v[0] = vAim._v[1];
				vTan._v[1] = - vAim._v[0];
				// アフィン行列
				var mtxAffine = new Matrix22();
				mtxAffine._m[0][0] = vTan._v[0];
				mtxAffine._m[1][0] = vTan._v[1];
				mtxAffine._m[0][1] = vAim._v[0];
				mtxAffine._m[1][1] = vAim._v[1];
				// アフィン逆行列
				var mtxAffineInv = mtxAffine.inverse();

				// 速度ベクトルのアフィン変換
				var vIa = mtxAffine.multVector(this._cannon._arrShell[i]._vel);
				var vJa = mtxAffine.multVector(this._arrElm[j]._vel);
				// 速度合成処理
				var mI = this._cannon._arrShell[i]._r * this._cannon._arrShell[i]._r;
				var mJ = this._arrElm[j]._r * this._arrElm[j]._r;
				vJa._v[1] = ((vIa._v[1] - vJa._v[1]) * (1.0 + this.ELAST_ELM_COL) / ((mJ / mI) + 1.0)) + vJa._v[1];
				if(vJa._v[1] < - this._velMax)		{	vJa._v[1] = - this._velMax;	}
				else if(vJa._v[1] > this._velMax)	{	vJa._v[1] = this._velMax;	}
				// 速度ベクトルのアフィン逆変換
				this._arrElm[j]._vel.copy(mtxAffineInv.multVector(vJa));

				// 弾丸消滅
				delete this._cannon._arrShell[i];
				break;
			}
		}
	}

	// 演出を更新
	for(var i = 0; i < this._arrPfm.length; i++)
	{
		if(this._arrPfm[i] === undefined)	{	continue;	}

		this._arrPfm[i]._r += this.R_CLEAR_ELM_ANIM_INC;

		// アニメーションフレームカウンタ更新
		this._arrPfm[i]._cntAnim -= frameDelta;
		if(this._arrPfm[i]._cntAnim <= 0)
		{
			delete this._arrPfm[i];
		}
	}
}

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
Game.prototype.drawFrame = function()
{
	var x, y, w, h;
	var img = new Image();
	img.src = 'img/desert.jpg'

	this._ctx.drawImage(img, 0, 0, this.WIDTH, this.HEIGHT);
	this._ctx.clearRect(this.PADDING_LEFT_STAGE, this.PADDING_TOP_STAGE, this._stage.WIDTH, this._stage.HEIGHT);
	this._ctx.clearRect(10,260,70,130);
	this._ctx.lineWidth = 1;

	// スコアとレベル表示
	this._ctx.font = "italic 20px 'Nico Moji";
	this._ctx.fillStyle = 'rgb(127, 127, 127)';
	this._ctx.strokeStyle = 'rgb(255, 255, 255)';
	///this._ctx.fillText("SCORE: " + this._score + ",  LV: " + this._lv + " / " + this.LV_MAX + ((this._esc == 0) ? "" : (", ESC: " + this._esc)), this.PADDING_LEFT_STAGE, this.PADDING_TOP_STAGE - 10);
	this._ctx.fillText("SCORE: " + this._score + ",  LV: " + this._lv + " / " + this.LV_MAX, this.PADDING_LEFT_STAGE, this.PADDING_TOP_STAGE - 10);
	this._ctx.strokeText("SCORE: " + this._score + ",  LV: " + this._lv + " / " + this.LV_MAX, this.PADDING_LEFT_STAGE, this.PADDING_TOP_STAGE - 10);


  // ロード　レベル選択値
  this._ctx.font = 'bold 14px Nico Moji';
  this._ctx.lineWidth = 4;
  this._ctx.strokeStyle = '#000';
  this._ctx.strokeText("LV: " + loadLv,272, 588);
  this._ctx.fillText("LV: " + loadLv, 272, 588);








	// ステージ枠描画
	this._ctx.strokeStyle = 'rgb(63, 63, 63)';
	this._ctx.strokeRect(this.PADDING_LEFT_STAGE, this.PADDING_TOP_STAGE, this._stage.WIDTH, this._stage.HEIGHT);

	// 要素描画
	for(var i = 0; i < this._arrElm.length; i++)
	{
		if(this._arrElm[i] === undefined)			{	continue;	}
		this._ctx.beginPath();
		this._ctx.fillStyle = 'rgba(' + Math.round(this._arrElm[i]._col._r) + ', ' + Math.round(this._arrElm[i]._col._g) + ', ' + Math.round(this._arrElm[i]._col._b) + ', ' + (this._arrElm[i]._col._a / 255.0) + ')';
		this._ctx.arc(this.PADDING_LEFT_STAGE + this._arrElm[i]._pos._v[0], this.PADDING_TOP_STAGE + this._arrElm[i]._pos._v[1], this._arrElm[i]._r, 0, 2 * Math.PI, true);
		this._ctx.fill();
		this._ctx.beginPath();
		this._ctx.strokeStyle = 'rgba(191, 191, 191, 255)';
		this._ctx.arc(this.PADDING_LEFT_STAGE + this._arrElm[i]._pos._v[0], this.PADDING_TOP_STAGE + this._arrElm[i]._pos._v[1], this._arrElm[i]._r, 0, 2 * Math.PI, true);
		this._ctx.stroke();
	}

	// 弾丸描画
	for(var i = 0; i < this._cannon._arrShell.length; i++)
	{
		if(this._cannon._arrShell[i] === undefined)	{	continue;	}
		this._ctx.beginPath();
		this._ctx.fillStyle = 'rgba(' + Math.round(this._cannon._arrShell[i]._col._r) + ', ' + Math.round(this._cannon._arrShell[i]._col._g) + ', ' + Math.round(this._cannon._arrShell[i]._col._b) + ', ' + (this._cannon._arrShell[i]._col._a / 255) + ')';
		this._ctx.arc(this.PADDING_LEFT_STAGE + this._cannon._arrShell[i]._pos._v[0], this.PADDING_TOP_STAGE + this._cannon._arrShell[i]._pos._v[1], this._cannon._arrShell[i]._r, 0, 2 * Math.PI, true);
		this._ctx.fill();
	}

	// キャノン描画
var img = new Image();
img.src = 'img/tank.png';

	this._ctx.fillStyle = 'rgb(' + this._cannon._col._r + ', ' + this._cannon._col._g + ', ' + this._cannon._col._b + ')';
	x = this.PADDING_LEFT_STAGE + this._cannon._x;
	y = this.PADDING_TOP_STAGE + this._stage.HEIGHT;
	this._ctx.beginPath();
	this._ctx.moveTo(x, y);
	this._ctx.drawImage(img, x-10, y+2, 20, 30);
	this._ctx.closePath();
	this._ctx.fill();
	// Chrome bug ?
	this._ctx.lineWidth = 2;
	this._ctx.strokeStyle = 'rgb(' + this._cannon._col._r + ', ' + this._cannon._col._g + ', ' + this._cannon._col._b + ')';
	this._ctx.stroke();
	this._ctx.lineWidth = 1;
	x = this.PADDING_LEFT_STAGE / 6;
	w = this.PADDING_LEFT_STAGE - (x * 2);
	h = 25;
	y = this.PADDING_TOP_STAGE + this._stage.HEIGHT - (this._cannon.NUM_COL_TABLE * (h + (h / 4)));


	for(var i = 0; i < this._cannon.NUM_COL_TABLE; i++)
	{
		if(i == this._cannon._colidx)
		{
			this._ctx.beginPath();
			this._ctx.fillStyle = 'rgb(239, 239, 239)';
			this._ctx.fillRect(x, y, w, h);
			var r = Math.round(this._cntFrame) & 255;
			if(r > 127)	{	r = 255 - r;	}
			var g = Math.round(this._cntFrame + 85) & 127;
			if(g > 63)	{	g = 127 - g;	}
			var b = Math.round(this._cntFrame + 170) & 63;
			if(b > 31)	{	b = 63 - b;	}
			this._ctx.strokeStyle = 'rgb(' + (r * 2) + ', ' + (g * 4) + ', ' + (b * 8) + ')';
  			this._ctx.strokeRect(x, y, w, h);
		}
		this._ctx.beginPath();
		this._ctx.fillStyle = 'rgb(' + this._cannon.COL_TABLE[i]._r + ', ' + this._cannon.COL_TABLE[i]._g + ', ' + this._cannon.COL_TABLE[i]._b + ')';
		this._ctx.arc(x + this.R_SHELL + 5, y + (h / 2), this.R_SHELL, 0, 2 * Math.PI, true);
		this._ctx.fill();
		this._ctx.font = "18px 'context.rect";
		if(i == Cannon.prototype.COLIDX_BLACK)	{	this._ctx.fillText("∞", x + this.R_SHELL + 15, y + (h / 2) + 5);	}
		else									{	this._ctx.fillText("" + this._cannon._arrCntCol[i], x + this.R_SHELL + 15, y + (h / 2) + 5);	}
  		y += h + (h / 4);
	}

	// 演出描画
	for(var i = 0; i < this._arrPfm.length; i++)
	{
		if(this._arrPfm[i] === undefined)	{	continue;	}
		var a = this._arrPfm[i]._cntAnim / this._arrPfm[i]._cntAnimMax;
		var n = (this._arrPfm[i]._flags & Perform.prototype.F_CLEAR_LV) ? 3 : 1;
		for(var j = 0; j < n; j++)
		{
			this._ctx.beginPath();
			this._ctx.strokeStyle = 'rgba(191, 191, 191, ' + (a / (j + 1)) + ')';
			this._ctx.arc(this.PADDING_LEFT_STAGE + this._arrPfm[i]._pos._v[0], this.PADDING_TOP_STAGE + this._arrPfm[i]._pos._v[1], this._arrPfm[i]._r / (j + 1), 0, 2 * Math.PI, true);
			this._ctx.stroke();
		}
		this._ctx.font = "20px Nico Moji";
		this._ctx.fillStyle = 'rgba(255, 0, 0, ' + a + ')';
		w = this._ctx.measureText(this._arrPfm[i]._msg).width;
		this._ctx.fillText(this._arrPfm[i]._msg, this.PADDING_LEFT_STAGE + this._arrPfm[i]._pos._v[0] - (w / 2), this.PADDING_TOP_STAGE + this._arrPfm[i]._pos._v[1]);
	}

	// ソフトウェアキーボード描画
	this._softkbd.drawFrame(this._ctx);
};

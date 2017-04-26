//==========================================================================
// 定数

var LOGIC_SPF = 60.0;

//==========================================================================
// グローバル変数

var g_jafw_game = null;
var g_jafw_lastFrameTime = 0;
var g_jafw_frameDelta = 0;

//==========================================================================
// グローバル関数

/*---------------------------------------------------------------------*//**
	アニメーションフレーム更新 API ラッパー
**//*---------------------------------------------------------------------*/
window.requestAnimFrame = (function()
{
	return	window.requestAnimationFrame		||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			window.oRequestAnimationFrame		||
			window.msRequestAnimationFrame		||
			function(callback)
			{
				window.setTimeout(callback, 1000 / LOGIC_SPF);
			};
})();

/*---------------------------------------------------------------------*//**
	アニメーションフレーム更新関数
**//*---------------------------------------------------------------------*/
function updateFrame()
{
	// フレーム進行度を計算する
	var now = +new Date();
	var delta = (now - g_jafw_lastFrameTime) * 0.001;
	g_jafw_lastFrameTime = now;
	g_jafw_frameDelta = delta * LOGIC_SPF;
	
	g_jafw_game.drawFrame();
	g_jafw_game.updateFrame(g_jafw_frameDelta);

	window.requestAnimFrame(updateFrame);
}

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	キーボード入力情報クラス
 *	
**//*---------------------------------------------------------------------*/
var KeybordIf = function()
{
	//======================================================================
	// Keybord メンバ変数
	
	this._onkey = new Array(255);
	this._shift = false;
	this._ctrl = false;
	this._onkeyLast = new Array(255);
	this._shiftLast = false;
	this._ctrlLast = false;
};

KeybordIf.prototype =
{
	//======================================================================
	// KeybordIf 定数
	
	KEYCODE_BS : 8,			// BackSpace
	KEYCODE_TAB : 9,		// Tab
	KEYCODE_ESC : 27,		// Esc
	KEYCODE_SPACE : 32,		// Space
	KEYCODE_INSERT : 45,	// Insert
	KEYCODE_DELETE : 46,	// Delete
	KEYCODE_PAGEUP : 33,	// PageUp
	KEYCODE_PAGEDOWN : 34,	// PageDown
	KEYCODE_END : 35,		// End
	KEYCODE_HOME : 36,		// Home
	KEYCODE_LEFT : 37,		// ←
	KEYCODE_UP : 38,		// ↑
	KEYCODE_RIGHT : 39,		// →
	KEYCODE_DOWN : 40,		// ↓

	//======================================================================
	// KeybordIf メソッド
	
	/*-----------------------------------------------------------------*//**
		フレーム更新
	**//*-----------------------------------------------------------------*/
	updateFrame : function()
	{
		for(var i = 0; i < 255; i++)
		{
			this._onkey[i] = this._onkeyLast[i];
			this._shift = this._shiftLast;
			this._ctrl = this._ctrlLast;
			this._onkeyLast[i] = false;
			this._shiftLast = false;
			this._ctrlLast = false;
		}
	},
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	マウス入力情報クラス
 *	
**//*---------------------------------------------------------------------*/
var MouseIf = function()
{
	//======================================================================
	// MouseIf メンバ変数
	
	this._xClick = null;
	this._yClick = null;
	this._xClickLast = null;
	this._yClickLast = null;
};

MouseIf.prototype =
{
	//======================================================================
	// KeybordIf メソッド
	
	/*-----------------------------------------------------------------*//**
		フレーム更新
	**//*-----------------------------------------------------------------*/
	updateFrame : function()
	{
		this._xClick = this._xClickLast;
		this._yClick = this._yClickLast;
	},
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ゲーム本体クラス
 *	
**//*---------------------------------------------------------------------*/
var GameBody = function(width, height)
{
	//======================================================================
	// GameBody メンバ変数

	this.WIDTH = width;
	this.HEIGHT = height;
	
	this._ctx = null;
	this._cntFrame = 0;
	this._kbd = new KeybordIf();
	this._mouse = new MouseIf();
};

GameBody.prototype =
{
	//======================================================================
	// GameBody メソッド
	
	/*-----------------------------------------------------------------*//**
		開始
	**//*-----------------------------------------------------------------*/
	start : function()
	{
		g_jafw_game = this;
		
		// キャンバスの 2D 描画コンテキストを得る
		var canvas = document.getElementById('game_canvas');
		if(canvas && (typeof(canvas.getContext) === 'function'))
		{
			var ctx = canvas.getContext('2d');
			if(ctx)
			{
				this._ctx = ctx;
			}
		}
		
		// UI イベントハンドラの設定
		document.onkeydown = function(e)
		{
			var keycode, shift, ctrl;
			if(e != null)		// Mozilla and Opera 
			{ 
				keycode = e.which; 
				shift = (typeof e.modifiers == 'undefined') ? e.shiftKey : e.modifiers & Event.SHIFT_MASK; 
				ctrl = (typeof e.modifiers == 'undefined') ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK; 
			
			}
			else				// Internet Explorer 
			{ 
				keycode = event.keyCode; 
				shift = event.shiftKey;
				ctrl = event.ctrlKey; 
			}
			g_jafw_game.onKeydown(keycode, shift, ctrl);
		};
		canvas.onmousedown = function(e)
		{
			var x, y;
			if(document.all === undefined)	// Mozilla and Opera 
			{ 
				x = e.layerX;
				y = e.layerY;
			}
			else							// Internet Explorer 
			{ 
				x = event.offsetX;
				y = event.offsetY;
			}
			g_jafw_game.onMouseDown(x, y);
			//alert("!1! x=" + x + ",y=" + y);
		};
		canvas.onmouseup = function(e)
		{
			//alert("!2! x=" + g_jafw_game._mouse._xClickLast + ",y=" + g_jafw_game._mouse._yClickLast);
			g_jafw_game.onMouseUp();
		};
		canvas.ontouchstart = function(e)
		{
			var x = e.touches[0].pageX;
			var y = e.touches[0].pageY;
			g_jafw_game.onMouseDown(x, y);
			//alert("!1! x=" + x + ",y=" + y);
		};
		canvas.ontouchend = function(e)
		{
			//alert("!2! x=" + g_jafw_game._mouse._xClickLast + ",y=" + g_jafw_game._mouse._yClickLast);
			g_jafw_game.onMouseUp();
		};
		
		// タイマー設定
		g_jafw_lastFrameTime = +new Date();
		window.requestAnimFrame(updateFrame);
	},
	
	/*-----------------------------------------------------------------*//**
		フレーム更新
	**//*-----------------------------------------------------------------*/
	updateFrame : function(frameDelta)
	{
		// フレームカウンタをインクリメント
		this._cntFrame += frameDelta;

		// キーボード・マウスの状態の更新
		this._kbd.updateFrame();
		this._mouse.updateFrame();
	},
	
	/*-----------------------------------------------------------------*//**
		フレーム描画
	**//*-----------------------------------------------------------------*/
	drawFrame : function()
	{
		// Sample
		this._ctx.clearRect(0, 0, _width, _height);
		var anim = +new Date() & 0xffffff;
		this._ctx.fillStyle = "#" + anim.toString(16);
		this._ctx.font = "30px Arial";
		this._ctx.fillText("Hello World! " + this._ctx.fillStyle, 0, 30);
	},
	
	/*-----------------------------------------------------------------*//**
		マウスボタン押し イベント ハンドラ
	**//*-----------------------------------------------------------------*/
	onMouseDown : function(x, y)
	{
		this._mouse._xClickLast = x;
		this._mouse._yClickLast = y;
	},
	
	/*-----------------------------------------------------------------*//**
		マウスボタン離し イベント ハンドラ
	**//*-----------------------------------------------------------------*/
	onMouseUp : function()
	{
		this._mouse._xClickLast = null;
		this._mouse._yClickLast = null;
	},
	
	/*-----------------------------------------------------------------*//**
		キーボード イベント ハンドラ
	**//*-----------------------------------------------------------------*/
	onKeydown : function(keycode, shift, ctrl)
	{
		if((0 < keycode) && (keycode <= 255))
		{
			this._kbd._onkeyLast[keycode] = true;
		}
		if(shift)
		{
			this._kbd._shiftLast = true;
		}
		if(ctrl)
		{
			this._kbd._ctrlLast = true;
		}
	},
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ベクトルクラス
 *	
**//*---------------------------------------------------------------------*/
var Vector2 = function(src)
{
	//======================================================================
	// Vector2 メンバ変数

	if(src === undefined)	// デフォルトコンストラクタ
	{
		this._v = [ 0.0, 0.0 ];
	}
	else					// コピーコンストラクタ
	{
		this._v = [ src._v[0], src._v[1] ];
	}
};

Vector2.prototype =
{
	//======================================================================
	// Matrix2 メソッド
	
	/*-----------------------------------------------------------------*//**
		セット
	**//*-----------------------------------------------------------------*/
	set : function(x, y)
	{
		this._v[0] = x;
		this._v[0] = y;
	},

	/*-----------------------------------------------------------------*//**
		コピー
	**//*-----------------------------------------------------------------*/
	copy : function(v)
	{
		this._v[0] = v._v[0];
		this._v[1] = v._v[1];
	},

	/*-----------------------------------------------------------------*//**
		長さ取得
	**//*-----------------------------------------------------------------*/
	length : function()
	{
		return Math.sqrt((this._v[0] * this._v[0]) + (this._v[1] * this._v[1]));
	},

	/*-----------------------------------------------------------------*//**
		長さの二乗値の取得
	**//*-----------------------------------------------------------------*/
	lengthSq : function()
	{
		return (this._v[0] * this._v[0]) + (this._v[1] * this._v[1]);
	},

	/*-----------------------------------------------------------------*//**
		加算
	**//*-----------------------------------------------------------------*/
	add : function(v2)
	{
		var vr = new Vector2();
		vr._v[0] = this._v[0] + v2._v[0];
		vr._v[1] = this._v[1] + v2._v[1];
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		減算
	**//*-----------------------------------------------------------------*/
	sub : function(v2)
	{
		var vr = new Vector2();
		vr._v[0] = this._v[0] - v2._v[0];
		vr._v[1] = this._v[1] - v2._v[1];
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		スカラー値乗算
	**//*-----------------------------------------------------------------*/
	multScalar : function(s)
	{
		var vr = new Vector2();
		vr._v[0] = this._v[0] * s;
		vr._v[1] = this._v[1] * s;
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		スカラー値除算
	**//*-----------------------------------------------------------------*/
	divScalar : function(s)
	{
		var vr = new Vector2();
		vr._v[0] = this._v[0] / s;
		vr._v[1] = this._v[1] / s;
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		正規化
	**//*-----------------------------------------------------------------*/
	normalize : function()
	{
		var vr = new Vector2();
		var length = this.length();
		if(length > 0.0)
		{
			var inv = 1.0 / length;
			vr._v[0] = this._v[0] * inv;
			vr._v[1] = this._v[1] * inv;
		}
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		内積
	**//*-----------------------------------------------------------------*/
	dot : function(v2)
	{
		return (this._v[0] * v2._v[0]) + (this._v[1] * v2._v[1]);
	},
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	行列クラス
 *	
**//*---------------------------------------------------------------------*/
var Matrix22 = function(src)
{
	//======================================================================
	// Matrix2 メンバ変数

	if(src === undefined)	// デフォルトコンストラクタ
	{
		this._m = [ [ 0.0, 0.0 ], [ 0.0, 0.0 ] ];
	}
	else					// コピーコンストラクタ
	{
		this._m = [ [ src._m[0][0], src._m[0][1] ], [ src._m[1][0], src._m[1][1] ] ];
	}
};

Matrix22.prototype =
{
	//======================================================================
	// Matrix2 メソッド

	/*-----------------------------------------------------------------*//**
		行列の掛け算
	**//*-----------------------------------------------------------------*/
	mult : function(m2)
	{
		var mr = new Matrix22();
		mr._m[0][0] = (this._m[0][0] * m2._m[0][0]) + (this._m[0][1] * m2._M[1][0]);
		mr._m[0][1] = (this._m[0][0] * m2._m[0][1]) + (this._m[0][1] * m2._m[1][1]);
		mr._m[1][0] = (this._m[1][0] * m2._m[0][0]) + (this._m[1][1] * m2._m[1][0]);
		mr._m[1][1] = (this._m[1][0] * m2._m[0][1]) + (this._m[1][1] * m2._m[1][1]);
		return mr;
	},

	/*-----------------------------------------------------------------*//**
		ベクトルの掛け算
	**//*-----------------------------------------------------------------*/
	multVector : function(v)
	{
		var vr = new Vector2();
		vr._v[0] = (this._m[0][0] * v._v[0]) + (this._m[1][0] * v._v[1]);
		vr._v[1] = (this._m[0][1] * v._v[0]) + (this._m[1][1] * v._v[1]);
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		逆行列
	**//*-----------------------------------------------------------------*/
	inverse : function(v)
	{
		var mr = new Matrix22();
		var d = (this._m[0][0] * this._m[1][1]) - (this._m[0][1] * this._m[1][0]);
		if(d != 0)
		{
			d = 1.0 / d;
			mr._m[0][0] = this._m[1][1] * d;
			mr._m[0][1] = - this._m[0][1] * d;
			mr._m[1][0] = - this._m[1][0] * d;
			mr._m[1][1] = this._m[0][0] * d;
		}
		return mr;
	},
}

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	矩形クラス
 *	
**//*---------------------------------------------------------------------*/
var Rect = function(src)
{
	//======================================================================
	// Rect メンバ変数

	if(src === undefined)	// デフォルトコンストラクタ
	{
		this._v = [ 0.0, 0.0, 0.0, 0.0 ];
	}
	else					// コピーコンストラクタ
	{
		this._v = [ src._v[0], src._v[1], src._v[2], src._v[3] ];
	}
};

Rect.prototype =
{
	//======================================================================
	// Rect メソッド
	
	/*-----------------------------------------------------------------*//**
		セット
	**//*-----------------------------------------------------------------*/
	set : function(x, y, w, h)
	{
		this._v[0] = x;
		this._v[0] = y;
		this._v[1] = w;
		this._v[1] = h;
	},
	
	/*-----------------------------------------------------------------*//**
		矩形内座標テスト
	**//*-----------------------------------------------------------------*/
	isPointIn : function(x, y)
	{
		return (this._v[0] <= x) && (x < (this._v[0] + this._v[2])) && (this._v[1] <= y) && (y < (this._v[1] + this._v[3]));
	},
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	色クラス
 *	
**//*---------------------------------------------------------------------*/
var Color = function(src)
{
	//======================================================================
	// Color メンバ変数

	if(src === undefined)	// デフォルトコンストラクタ
	{
		this._r = 0;
		this._g = 0;
		this._b = 0;
		this._a = 0;
	}
	else					// コピーコンストラクタ
	{
		this._r = src._r;
		this._g = src._g;
		this._b = src._b;
		this._a = src._a;
	}
};

Color.prototype =
{
	//======================================================================
	// Color メソッド
	
	/*-----------------------------------------------------------------*//**
		セット
	**//*-----------------------------------------------------------------*/
	set : function(r, g, b, a)
	{
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = a;
	},
};


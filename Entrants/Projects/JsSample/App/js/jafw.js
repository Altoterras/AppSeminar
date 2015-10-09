var JAFW = {};

//==========================================================================
// 定数

JAFW.LOGIC_SPF = 60.0;

//==========================================================================
// グローバル変数

JAFW._app = null;
JAFW._lastFrameTime = 0;
JAFW._frameDelta = 0;

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
				window.setTimeout(callback, 1000 / JAFW.LOGIC_SPF);
			};
})();

/*---------------------------------------------------------------------*//**
	アニメーションフレーム更新関数
**//*---------------------------------------------------------------------*/
JAFW.updateFrame = function()
{
	// フレーム進行度を計算する
	var now = +new Date();
	var delta = (now - JAFW._lastFrameTime) * 0.001;
	JAFW._lastFrameTime = now;
	JAFW._frameDelta = delta * JAFW.LOGIC_SPF;
	
	var dfctx = new JAFW.DrawFrameContext();
	dfctx._ctx2d = JAFW._app._ctx2d;
	JAFW._app.drawFrame(dfctx);

	var ufctx = new JAFW.UpdateFrameContext();
	ufctx._app = JAFW._app;
	ufctx._frameDelta = JAFW._frameDelta;
	JAFW._app.updateFrame(ufctx);

	window.requestAnimFrame(JAFW.updateFrame);
}

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ゲーム本体クラス
 *	
**//*---------------------------------------------------------------------*/
JAFW.AppBody = function(nameCanvas, width, height)
{
	//======================================================================
	// AppBody メンバ変数

	this.CANVAS_NAME = nameCanvas;
	this.WIDTH = width;
	this.HEIGHT = height;
	
	this._ctx2d = null;
	this._cntFrame = 0;
	this._kbd = new JAFW.KeybordIf();
	this._mouse = new JAFW.MouseIf();
};

JAFW.AppBody.prototype =
{
	//======================================================================
	// AppBody メソッド
	
	/*-----------------------------------------------------------------*//**
		開始
	**//*-----------------------------------------------------------------*/
	start : function()
	{
		JAFW._app = this;
		
		// キャンバスの 2D 描画コンテキストを得る
		var canvas = document.getElementById(this.CANVAS_NAME);
		if(canvas && (typeof(canvas.getContext) === 'function'))
		{
			var ctx = canvas.getContext('2d');
			if(ctx)
			{
				this._ctx2d = ctx;
			}
		}
		
		// UI イベントハンドラの設定
		document.onkeydown = function(e)
		{
			var keycode, shift, ctrl;
			if(window.event === undefined)			// Mozilla and Opera 
			{ 
				keycode = e.which; 
				shift = (typeof e.modifiers == 'undefined') ? e.shiftKey : e.modifiers & Event.SHIFT_MASK; 
				ctrl = (typeof e.modifiers == 'undefined') ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK; 
			
			}
			else									// Internet Explorer 
			{ 
				keycode = window.event.keyCode; 
				shift = window.event.shiftKey;
				ctrl = window.event.ctrlKey; 
			}
			JAFW._app.onKeydown(keycode, shift, ctrl);
		};
		canvas.onmousedown = function(e)
		{
			var x, y;
			if(window.event === undefined)			// Mozilla and Opera 
			{ 
				x = e.layerX - canvas.offsetLeft;
				y = e.layerY - canvas.offsetTop;
			}
			else									// Internet Explorer 
			{ 
				x = window.event.offsetX;
				y = window.event.offsetY;
			}
			JAFW._app.onMouseDown(x, y);
			///alert("!1! x=" + x + ",y=" + y);
		};
		canvas.onmousemove = function(e)
		{
			var x, y;
			if(window.event === undefined)	///window.document.all === undefined)	// Mozilla and Opera 
			{ 
				x = e.layerX - canvas.offsetLeft;
				y = e.layerY - canvas.offsetTop;
			}
			else									// Internet Explorer 
			{ 
				x = window.event.offsetX;
				y = window.event.offsetY;
			}
			JAFW._app.onMouseMove(x, y);
		};
		canvas.onmouseup = function(e)
		{
			//alert("!2! x=" + JAFW._app._mouse._xClickLast + ",y=" + JAFW._app._mouse._yClickLast);
			JAFW._app.onMouseUp();
		};
		canvas.ontouchstart = function(e)
		{
			var x = e.touches[0].pageX;
			var y = e.touches[0].pageY;
			JAFW._app.onMouseDown(x, y);
			//alert("!1! x=" + x + ",y=" + y);
		};
		canvas.ontouchend = function(e)
		{
			//alert("!2! x=" + JAFW._app._mouse._xClickLast + ",y=" + JAFW._app._mouse._yClickLast);
			JAFW._app.onMouseUp();
		};
		
		// タイマー設定
		JAFW._lastFrameTime = +new Date();
		window.requestAnimFrame(JAFW.updateFrame);
	},
	
	/*-----------------------------------------------------------------*//**
		フレーム更新
	**//*-----------------------------------------------------------------*/
	updateFrame : function(ufctx)
	{
		// フレームカウンタをインクリメント
		this._cntFrame += ufctx._frameDelta;

		// キーボード・マウスの状態の更新
		this._kbd.updateFrame(ufctx);
		this._mouse.updateFrame(ufctx);
	},
	
	/*-----------------------------------------------------------------*//**
		フレーム描画
	**//*-----------------------------------------------------------------*/
	drawFrame : function(dfctx)
	{
		// Sample
		dfctx._ctx2d.clearRect(0, 0, this.WIDTH, this.HEIGHT);
		var anim = +new Date() & 0xffffff;
		dfctx._ctx2d.fillStyle = "#" + anim.toString(16);
		dfctx._ctx2d.font = "30px Arial";
		dfctx._ctx2d.fillText("Hello World! " + dfctx._ctx2d.fillStyle, 0, 30);
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
		this._mouse._xMoveLast = null;
		this._mouse._yMoveLast = null;
	},
	
	/*-----------------------------------------------------------------*//**
		マウス移動 イベント ハンドラ
	**//*-----------------------------------------------------------------*/
	onMouseMove : function(x, y)
	{
		this._mouse._xMoveLast = x;
		this._mouse._yMoveLast = y;
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
JAFW.Vector2 = function(s)
{
	//======================================================================
	// Vector2 メンバ変数

	if(s === undefined)	// デフォルトコンストラクタ
	{
		this._v = [ 0.0, 0.0 ];
	}
	else				// コピーコンストラクタ
	{
		this._v = [ s._v[0], s._v[1] ];
	}
};

JAFW.Vector2.prototype =
{
	//======================================================================
	// Matrix2 メソッド
	
	/*-----------------------------------------------------------------*//**
		コピー
	**//*-----------------------------------------------------------------*/
	copy : function(s)
	{
		this._v[0] = s._v[0];
		this._v[1] = s._v[1];
	},

	/*-----------------------------------------------------------------*//**
		セット
	**//*-----------------------------------------------------------------*/
	set : function(x, y)
	{
		this._v[0] = x;
		this._v[1] = y;
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
		var vr = new JAFW.Vector2();
		vr._v[0] = this._v[0] + v2._v[0];
		vr._v[1] = this._v[1] + v2._v[1];
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		減算
	**//*-----------------------------------------------------------------*/
	sub : function(v2)
	{
		var vr = new JAFW.Vector2();
		vr._v[0] = this._v[0] - v2._v[0];
		vr._v[1] = this._v[1] - v2._v[1];
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		スカラー値乗算
	**//*-----------------------------------------------------------------*/
	multScalar : function(s)
	{
		var vr = new JAFW.Vector2();
		vr._v[0] = this._v[0] * s;
		vr._v[1] = this._v[1] * s;
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		スカラー値除算
	**//*-----------------------------------------------------------------*/
	divScalar : function(s)
	{
		var vr = new JAFW.Vector2();
		vr._v[0] = this._v[0] / s;
		vr._v[1] = this._v[1] / s;
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		正規化
	**//*-----------------------------------------------------------------*/
	normalize : function()
	{
		var vr = new JAFW.Vector2();
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
JAFW.Matrix22 = function(s)
{
	//======================================================================
	// Matrix2 メンバ変数

	if(s === undefined)	// デフォルトコンストラクタ
	{
		this._m = [ [ 0.0, 0.0 ], [ 0.0, 0.0 ] ];
	}
	else					// コピーコンストラクタ
	{
		this._m = [ [ s._m[0][0], s._m[0][1] ], [ s._m[1][0], s._m[1][1] ] ];
	}
};

JAFW.Matrix22.prototype =
{
	//======================================================================
	// Matrix2 メソッド

	/*-----------------------------------------------------------------*//**
		コピー
	**//*-----------------------------------------------------------------*/
	copy : function(s)
	{
		for(var i = 0; i < 2; i++)
		{
			for(var j = 0; j < 2; j++)
			{
				this._m[i][j] = s._m[i][j];
			}
		}
	},

	/*-----------------------------------------------------------------*//**
		行列の掛け算
	**//*-----------------------------------------------------------------*/
	mult : function(m2)
	{
		var mr = new JAFW.Matrix22();
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
		var vr = new JAFW.Vector2();
		vr._v[0] = (this._m[0][0] * v._v[0]) + (this._m[1][0] * v._v[1]);
		vr._v[1] = (this._m[0][1] * v._v[0]) + (this._m[1][1] * v._v[1]);
		return vr;
	},

	/*-----------------------------------------------------------------*//**
		逆行列
	**//*-----------------------------------------------------------------*/
	inverse : function(v)
	{
		var mr = new JAFW.Matrix22();
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
JAFW.Rect = function(src_or_x, y, w, h)
{
	//======================================================================
	// Rect メンバ変数

	if(src_or_x === undefined)		// デフォルトコンストラクタ
	{
		this._v = [ 0.0, 0.0, 0.0, 0.0 ];
	}
	else if(y === undefined)		// コピーコンストラクタ
	{
		this._v = [ src_or_x._v[0], src_or_x._v[1], src_or_x._v[2], src_or_x._v[3] ];
	}
	else if((w !== undefined) && (h !== undefined))
	{
		this._v = [ src_or_x, y, w, h ];
	}
};

JAFW.Rect.prototype =
{
	//======================================================================
	// Rect メソッド
	
	/*-----------------------------------------------------------------*//**
		アクセサ
	**//*-----------------------------------------------------------------*/
	x : function() { return this._v[0]; },
	y : function() { return this._v[1]; },
	w : function() { return this._v[2]; },
	h : function() { return this._v[3]; },
	setX : function(v) { this._v[0] = v; },
	setY : function(v) { this._v[1] = v; },
	setW : function(v) { this._v[2] = v; },
	setH : function(v) { this._v[3] = v; },
	
	/*-----------------------------------------------------------------*//**
		コピー
	**//*-----------------------------------------------------------------*/
	copy : function(s)
	{
		this._v[0] = s._v[0];
		this._v[1] = s._v[1];
		this._v[2] = s._v[2];
		this._v[3] = s._v[3];
	},
	
	/*-----------------------------------------------------------------*//**
		セット
	**//*-----------------------------------------------------------------*/
	set : function(x, y, w, h)
	{
		this._v[0] = x;
		this._v[1] = y;
		this._v[2] = w;
		this._v[3] = h;
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
JAFW.Color = function(s)
{
	//======================================================================
	// Color メンバ変数

	if(s === undefined)	// デフォルトコンストラクタ
	{
		this._r = 0;
		this._g = 0;
		this._b = 0;
		this._a = 0;
	}
	else				// コピーコンストラクタ
	{
		this.copy(s);
	}
};

JAFW.Color.prototype =
{
	//======================================================================
	// Color メソッド
	
	/*-----------------------------------------------------------------*//**
		コピー
	**//*-----------------------------------------------------------------*/
	copy : function(s)
	{
		this._r = s._r;
		this._g = s._g;
		this._b = s._b;
		this._a = s._a;
	},
	
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

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	updateFrame コンテキスト
 *	
**//*---------------------------------------------------------------------*/
JAFW.UpdateFrameContext = function()
{
	//======================================================================
	// UpdateFrameContext メンバ変数
	
	this._app = null;
	this._frameDelta = 0;
	this._reacted = false;
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	drawFrame コンテキスト
 *	
**//*---------------------------------------------------------------------*/
JAFW.DrawFrameContext = function()
{
	//======================================================================
	// DrawContext メンバ変数
	
	this._ctx2d = null;
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	キーボード入力情報クラス
 *	
**//*---------------------------------------------------------------------*/
JAFW.KeybordIf = function()
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

//==========================================================================
// KeybordIf 定数

JAFW.KeybordIf.KEYCODE_BS = 8;			// BackSpace
JAFW.KeybordIf.KEYCODE_TAB = 9;			// Tab
JAFW.KeybordIf.KEYCODE_ESC = 27;		// Esc
JAFW.KeybordIf.KEYCODE_SPACE = 32;		// Space
JAFW.KeybordIf.KEYCODE_INSERT = 45;		// Insert
JAFW.KeybordIf.KEYCODE_DELETE = 46;		// Delete
JAFW.KeybordIf.KEYCODE_PAGEUP = 33;		// PageUp
JAFW.KeybordIf.KEYCODE_PAGEDOWN = 34;	// PageDown
JAFW.KeybordIf.KEYCODE_END = 35;		// End
JAFW.KeybordIf.KEYCODE_HOME = 36;		// Home
JAFW.KeybordIf.KEYCODE_LEFT = 37;		// ←
JAFW.KeybordIf.KEYCODE_UP = 38;			// ↑
JAFW.KeybordIf.KEYCODE_RIGHT = 39;		// →
JAFW.KeybordIf.KEYCODE_DOWN = 40;		// ↓

JAFW.KeybordIf.prototype =
{
	//======================================================================
	// KeybordIf メソッド
	
	/*-----------------------------------------------------------------*//**
		フレーム更新
	**//*-----------------------------------------------------------------*/
	updateFrame : function(ufctx)
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
JAFW.MouseIf = function()
{
	//======================================================================
	// MouseIf メンバ変数
	
	this._xClick = null;
	this._yClick = null;
	this._xMove = null;
	this._yMove = null;
	this._xClickLast = null;
	this._yClickLast = null;
	this._xMoveLast = null;
	this._yMoveLast = null;
};

JAFW.MouseIf.prototype =
{
	//======================================================================
	// KeybordIf メソッド
	
	/*-----------------------------------------------------------------*//**
		フレーム更新
	**//*-----------------------------------------------------------------*/
	updateFrame : function(ufctx)
	{
		this._xClick = this._xClickLast;
		this._yClick = this._yClickLast;
		this._xMove = this._xMoveLast;
		this._yMove = this._yMoveLast;
		this._xClickLast = null;
		this._yClickLast = null;
	},
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	テキスト描画クラス
 *	
**//*---------------------------------------------------------------------*/
JAFW.TextDraw = function()
{
	//======================================================================
	// TextDraw メンバ変数
	
	this._txtarr = null;
}

//==========================================================================
// TextDraw メソッド

/*---------------------------------------------------------------------*//**
	クリア
**//*---------------------------------------------------------------------*/
JAFW.TextDraw.prototype.clear = function()
{
	this._txtarr = null;
};

/*---------------------------------------------------------------------*//**
	内容の有効性確認
**//*---------------------------------------------------------------------*/
JAFW.TextDraw.prototype.isAvailable = function()
{
	return this._txtarr != null;
};

/*---------------------------------------------------------------------*//**
	テキストの設定
**//*---------------------------------------------------------------------*/
JAFW.TextDraw.prototype.setText = function(dfctx, txt, width)
{
	var len = txt.length; 

	this._txtarr = new Array();

	if(len <= 0) {	return;	}

	var line = "";
	for(var i = 0; i < len; i++)
	{
		var c = txt.charAt(i);
		if(c == '\n')
		{
			this._txtarr.push(line);
			line = "";
			continue;
		}

		var tm = dfctx._ctx2d.measureText(line + c);
		if(tm.width <= width)	// 現在の描画設定で描画したときの幅を取得
		{
			line += c;
		}
		else
		{
			this._txtarr.push(line);
			line = c;
	    }
	}

	// 残り
	if(line.length > 0)
	{
		this._txtarr.push(line);
	}
};

/*---------------------------------------------------------------------*//**
	描画
**//*---------------------------------------------------------------------*/
JAFW.TextDraw.prototype.drawFillText = function(dfctx, x, y, lineheihgt)
{
	if(this._txtarr == null)	{	return;	}
	
	for(var i = 0; i < this._txtarr.length; i++)
	{
		y += lineheihgt;
		dfctx._ctx2d.fillText(this._txtarr[i], x, y);
	}
}

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	パネルクラス
 *	
**//*---------------------------------------------------------------------*/
JAFW.Panel = function(s)
{
	//======================================================================
	// Panel メンバ変数

	if(s === undefined)	// デフォルトコンストラクタ
	{
		this._img = new Image();
		this._rectLoc = new JAFW.Rect();
		this._offset = new JAFW.Vector2();
		this._z = 0;
		this._scale = 1;
		this._alpha = 1;				// 0.0 透明 ～ 1.0 不透明
		this._flags = JAFW.Panel.F_AVAILABLE | JAFW.Panel.F_DRAW | JAFW.Panel.F_NOIMAGE | JAFW.Panel.F_AUTOFADE;
		this._fcntFadeMax = 30;
		this._fcntFade = this._fcntFadeMax;
		this.onclick = null;
		this.ondraw = null;
	}
	else				// コピーコンストラクタ
	{
		this._img = new Image();
		this._rectLoc = new JAFW.Rect();
		this._offset = new JAFW.Vector2();
		this.copy(s);
	}
};

//==========================================================================
// Panel 定数

// フラグ
JAFW.Panel.F_AVAILABLE	= 0x00000001;	// 有効フラグ
JAFW.Panel.F_DRAW		= 0x00000002;	// 表示フラグ
JAFW.Panel.F_NOIMAGE	= 0x00000100;	// 画像なしフラグ
JAFW.Panel.F_AUTOFADE	= 0x00010000;	// 自動フェードフラグ

//==========================================================================
// Panel メソッド

/*-----------------------------------------------------------------*//**
	コピー
**//*-----------------------------------------------------------------*/
JAFW.Panel.prototype.copy = function(s)
{
	this._img.src = s._img.src;
	this._rectLoc.copy(s._rectLoc);
	this._offset.copy(s._offset);
	this._z = s._z;
	this._scale = s._scale;
	this._alpha = s._alpha;
	this._flags = s._flags;
	this._fcntFadeMax = s._fcntFadeMax;
	this._fcntFade = s._fcntFade;
	this.onclick = s.onclick;
	this.ondraw = s.ondraw;
};

/*---------------------------------------------------------------------*//**
	セット
**//*---------------------------------------------------------------------*/
JAFW.Panel.prototype.set = function(imgsrc, rect)
{
	// 矩形を設定
	this._rectLoc.copy(rect);

	// 画像を設定
	this.setImage(imgsrc);
}

/*---------------------------------------------------------------------*//**
	画像設定
**//*---------------------------------------------------------------------*/
JAFW.Panel.prototype.setImage = function(imgsrc)
{
	if(this._img.src == imgsrc)
	{
		return;
	}

	// イメージ読み込みハンドラ設定
	if(imgsrc != "")
	{
		var ownthis = this;
		var listener = function()
		{
			// 有効な画像である
			ownthis._flags &= ~JAFW.Panel.F_NOIMAGE;
			
			// 矩形の幅と高さが 0 の場合は画像から取得する
			if(ownthis._rectLoc.w() < 0)	{	ownthis._rectLoc._v[2] = this.width;	}
			if(ownthis._rectLoc.h() < 0)	{	ownthis._rectLoc._v[3] = this.height;	}
			
			// イベントハンドラを削除
			if(this.removeEventListener)	{	this.removeEventListener("load", listener, false);	}
			else if(this.detachEvent)		{	this.detachEvent("onload", listener);				}
		};
		if(this._img.addEventListener)	{	this._img.addEventListener("load", listener, false);	}
		else if(this._img.attachEvent)	{	this._img.attachEvent("onload", listener);				}
	}
	else
	{
		this._flags |= JAFW.Panel.F_NOIMAGE;
	}

	// 画像の URI を設定
	this._img.src = imgsrc;
};

/*---------------------------------------------------------------------*//**
	有効／無効判定
**//*---------------------------------------------------------------------*/
JAFW.Panel.prototype.isAvailabled = function()
{
	return (this._flags & JAFW.Panel.F_AVAILABLE) != 0;
}

/*---------------------------------------------------------------------*//**
	表示／非表示判定
**//*---------------------------------------------------------------------*/
JAFW.Panel.prototype.isShown = function()
{
	return (this._flags & JAFW.Panel.F_DRAW) != 0;
}

/*---------------------------------------------------------------------*//**
	有効化（表示／非表示）
**//*---------------------------------------------------------------------*/
JAFW.Panel.prototype.show = function(isShow)
{
	if(this._flags & JAFW.Panel.F_AVAILABLE)
	{
		if(!isShow)
		{
			this._flags &= ~JAFW.Panel.F_AVAILABLE;
			
			if(!(this._flags & JAFW.Panel.F_AUTOFADE))
			{
				this._flags &= ~JAFW.Panel.F_DRAW;
			}
		}
	}
	else
	{
		if(isShow)
		{
			this._flags |= JAFW.Panel.F_AVAILABLE;
			
			if(!(this._flags & JAFW.Panel.F_AUTOFADE))
			{
				this._flags |= JAFW.Panel.F_DRAW;
			}
		}
	}
}

/*-----------------------------------------------------------------*//**
	フレーム更新 - フェード処理
**//*-----------------------------------------------------------------*/
JAFW.Panel.prototype.updateFrameFade = function(ufctx)
{
	if(this._flags & JAFW.Panel.F_AVAILABLE)
	{
		// フェードイン
		if(this._fcntFade < this._fcntFadeMax)
		{
			this._fcntFade += ufctx._frameDelta;
			if(this._fcntFade > this._fcntFadeMax)
			{
				this._fcntFade = this._fcntFadeMax;
			}
			this._alpha = this._fcntFade / this._fcntFadeMax;
		}
		// 表示フラグ制御
		if(!(this._flags & JAFW.Panel.F_DRAW))
		{
			this._flags |= JAFW.Panel.F_DRAW;
		}
	}
	else
	{
		// フェードアウト
		if(this._fcntFade > 0)
		{
			this._fcntFade -= ufctx._frameDelta;
			if(this._fcntFade < 0)
			{
				this._fcntFade = 0;
			}
			this._alpha = this._fcntFade / this._fcntFadeMax;
		}
		// 表示フラグ制御
		if((this._flags & JAFW.Panel.F_DRAW) && (this._fcntFade <= 0))
		{
			this._flags &= ~JAFW.Panel.F_DRAW;
		}
	}
}

/*-----------------------------------------------------------------*//**
	フレーム更新
**//*-----------------------------------------------------------------*/
JAFW.Panel.prototype.updateFrame = function(ufctx)
{
	if(this._flags & JAFW.Panel.F_AUTOFADE)
	{
		// 自動フェード
		this.updateFrameFade(ufctx);
	}
};

/*---------------------------------------------------------------------*//**
	描画
**//*---------------------------------------------------------------------*/
JAFW.Panel.prototype.drawFrame = function(dfctx)
{
	if(!(this._flags & JAFW.Panel.F_DRAW) || (this._alpha == 0))	{	return;	}
	
	// アルファ値設定
	var alphaOld = dfctx._ctx2d.globalAlpha;
	if(this._alpha != 1)
	{
		dfctx._ctx2d.globalAlpha = this._alpha;
	}
	
	// オフセット平行移動設定
	if((this._offset._v[0] != 0) || (this._offset._v[1] != 0))
	{
		dfctx._ctx2d.translate(this._offset._v[0], this._offset._v[1]);
	}

	// イメージ描画
	if(this.ondraw != null)
	{
		this.ondraw(this, dfctx);
	}
 	else if(!(this._flags & JAFW.Panel.F_NOIMAGE))
	{
		if((this._rectLoc.w() < 0) || (this._rectLoc.h() < 0))
		{
			// 描画しない dfctx._ctx2d.drawImage(this._img, this._rectLoc.x(), this._rectLoc.y());
		}
		else if(this._scale != 1)	// 等倍以外
		{
			dfctx._ctx2d.drawImage(this._img, this._rectLoc.x(), this._rectLoc.y(), this._rectLoc.w() * this._scale, this._rectLoc.h() * this._scale);
		}
		else	// 等倍
		{
			dfctx._ctx2d.drawImage(this._img, this._rectLoc.x(), this._rectLoc.y(), this._rectLoc.w(), this._rectLoc.h());
		}
	}
	
	// オフセット平行移動を戻す
	if((this._offset._v[0] != 0) || (this._offset._v[1] != 0))
	{
		dfctx._ctx2d.translate(- this._offset._v[0], - this._offset._v[1]);
	}

	// アルファ値を戻す
	if(this._alpha != 1)
	{
		dfctx._ctx2d.globalAlpha = alphaOld;
	}
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ボタンクラス
 *	
**//*---------------------------------------------------------------------*/
JAFW.PanelButton = function(s)
{
	//======================================================================
	// PanelButton メンバ変数

	if(s === undefined)	// デフォルトコンストラクタ
	{
		this._rectHit = new JAFW.Rect();
		this._paramOnClick = null;
		this._statCur = JAFW.PanelButton.STAT_NORMAL;		// 現在の状態
		this._statLock = JAFW.PanelButton.STAT_NULL;		// 状態ロック
		this.ondrawNormal = null;
		this.ondrawHover = null;
		this.ondrawActive = null;
	}
	else				// コピーコンストラクタ
	{
		this._rectHit = new JAFW.Rect();
		this.copy(s);
	}
};
JAFW.PanelButton.prototype = new JAFW.Panel();

//======================================================================
// PanelButton 定数

JAFW.PanelButton.STAT_NULL = 0;
JAFW.PanelButton.STAT_NORMAL = 1;
JAFW.PanelButton.STAT_HOVER = 2;
JAFW.PanelButton.STAT_ACTIVE = 3;

//======================================================================
// PanelButton メソッド

/*-----------------------------------------------------------------*//**
	コピー
**//*-----------------------------------------------------------------*/
JAFW.PanelButton.prototype.copy = function(s)
{
	// 親クラスをコール
	Panel.prototype.copy.call(this, s);

	this._rectHit.copy(s._rectHit);
	this._paramOnClick = s._paramOnClick;
	this._statCur = s._statCur;
	this._statLock = s._statLock;
	this.ondrawNormal = s.ondrawNormal;
	this.ondrawHover = s.ondrawHover;
	this.ondrawActive = s.ondrawActive;
};

/*-----------------------------------------------------------------*//**
	セット
**//*-----------------------------------------------------------------*/
JAFW.PanelButton.prototype.set = function(imgsrcNormal, rect)
{
	// インスタンス毎に別メモリにするための再生成
	this._rectLoc = new JAFW.Rect();
	this._img = new Image();
	
	// 親クラスをコール
	JAFW.Panel.prototype.set.call(this, imgsrcNormal, rect);

	// 矩形を設定
	this._rectHit.copy(rect);

	// イメージ読み込みハンドラ設定
	if(imgsrcNormal != "")
	{
		var ownthis = this;
		var listener = function()
		{
			// 有効な画像である
			ownthis._flags &= ~JAFW.Panel.F_NOIMAGE;
			
			// 当たり矩形の幅と高さがマイナス値の場合は画像から取得する
			if(ownthis._rectHit.w() < 0)	{	ownthis._rectHit._v[2] = this.width;	}
			if(ownthis._rectHit.h() < 0)	{	ownthis._rectHit._v[3] = this.height;	}
			
			// イベントハンドラを削除
			if(this.removeEventListener)	{	this.removeEventListener("load", listener, false);	}
			else if(this.detachEvent)		{	this.detachEvent("onload", listener);				}
		};
		if(this._img.addEventListener)	{	this._img.addEventListener("load", listener, false);	}
		else if(this._img.attachEvent)	{	this._img.attachEvent("onload", listener);				}
	}
	else
	{
		this._flags |= JAFW.Panel.F_NOIMAGE;
	}

	// 画像の URI を設定
	this._img.src = imgsrcNormal;
};

/*-----------------------------------------------------------------*//**
	フレーム更新
**//*-----------------------------------------------------------------*/
JAFW.PanelButton.prototype.updateFrame = function(ufctx)
{
	JAFW.Panel.prototype.updateFrame.call(this, ufctx);

	if(!(this._flags & JAFW.Panel.F_AVAILABLE))	{	return;	}

	// ボタンの挙動
	var move = (ufctx._app._mouse._xMove != null) && (ufctx._app._mouse._yMove != null) && this._rectHit.isPointIn(ufctx._app._mouse._xMove, ufctx._app._mouse._yMove);
	var click = (ufctx._app._mouse._xClick != null) && (ufctx._app._mouse._yClick != null) && this._rectHit.isPointIn(ufctx._app._mouse._xClick, ufctx._app._mouse._yClick);
	if(click && (this.onclick != null))
	{
		this.onclick(this, ufctx, this._paramOnClick);
	}
	if(move)
	{
		this._statCur = JAFW.PanelButton.STAT_HOVER;
	}
	else if(click)
	{
		this._statCur = JAFW.PanelButton.STAT_ACTIVE;
	}
	else
	{
		this._statCur = JAFW.PanelButton.STAT_NORMAL;
	}

	// 描画メソッドの切り替え
	var stat = (this._statLock != JAFW.PanelButton.STAT_NULL) ? this._statLock : this._statCur;
	if((stat == JAFW.PanelButton.STAT_ACTIVE) && (this.ondrawActive != null))
	{
		this.ondraw = this.ondrawActive;
	}
	else if((stat == JAFW.PanelButton.STAT_HOVER) && (this.ondrawHover != null))
	{
		this.ondraw = this.ondrawHover;
	}
	else if(this.ondrawNormal != null)
	{
		this.ondraw = this.ondrawNormal;
	}
};

/*-----------------------------------------------------------------*//**
	移動
**//*-----------------------------------------------------------------*/
JAFW.PanelButton.prototype.move = function(x, y)
{
	this._rectLoc._v[0] = x;
	this._rectLoc._v[1] = y;
	this._rectHit._v[0] = x;
	this._rectHit._v[1] = y;
}

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	メッセージパネルクラス
 *	
**//*---------------------------------------------------------------------*/
JAFW.MessagePanel = function()
{
	//======================================================================
	// MessagePanel メンバ変数
	
	this._txt = "";
	this._dtxt = new JAFW.TextDraw();
	this._fontproperty = "normal medium sans-serif";
	this._xPadding = 24;
	this._yPadding = 16;

	this._imgLt = new Image();
	this._imgT = new Image();
	this._imgRt = new Image();
	this._imgLc = new Image();
	this._imgC = new Image();
	this._imgRc = new Image();
	this._imgLb = new Image();
	this._imgB = new Image();
	this._imgRb = new Image();
	this._wBgImg = 48;
	this._hBgImg = 48;
	this._bgdraw = true;
};
JAFW.MessagePanel.prototype = new JAFW.Panel();

//==========================================================================
// MessagePanel メソッド

/*---------------------------------------------------------------------*//**
	背景画像の設定
**//*---------------------------------------------------------------------*/
JAFW.MessagePanel.prototype.setBackgroundImage = function(srcLt, srcT, srcRt, srcLc, srcC, srcRc, srcLb, srcB, srcRb)
{
	this._imgLt.src = srcLt;
	this._imgT.src = srcT;
	this._imgRt.src = srcRt;
	this._imgLc.src = srcLc;
	this._imgC.src = srcC;
	this._imgRc.src = srcRc;
	this._imgLb.src = srcLb;
	this._imgB.src = srcB;
	this._imgRb.src = srcRb;
};

/*---------------------------------------------------------------------*//**
	テキストの設定
**//*---------------------------------------------------------------------*/
JAFW.MessagePanel.prototype.setText = function(txt)
{
	this._txt = txt;
	this._dtxt.clear();
}

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
JAFW.MessagePanel.prototype.drawFrame = function(dfctx)
{
	if(!(this._flags & JAFW.Panel.F_DRAW) || (this._alpha == 0))	{	return;	}

	var alphaOld = dfctx._ctx2d.globalAlpha;

	// 背景描画
	if(this._bgdraw)
	{
		var x, y, xm, ym;
		
		xm = this._rectLoc.x() + this._rectLoc.w() - this._wBgImg;
		ym = this._rectLoc.y() + this._rectLoc.h() - this._hBgImg;
		
		if(this._alpha != 1)	{	dfctx._ctx2d.globalAlpha = this._alpha;	}	// フェードによるアルファを設定
	
		// 上辺
		x = this._rectLoc.x();
		y = this._rectLoc.y();
		dfctx._ctx2d.drawImage(this._imgLt, x, y);
		for(x = this._rectLoc.x() + this._wBgImg; x < xm - this._wBgImg; x += this._wBgImg)
		{
			dfctx._ctx2d.drawImage(this._imgT, x, y);
		}
		dfctx._ctx2d.drawImage(this._imgT, 0, 0, xm - x, this._hBgImg, x, y, xm - x, this._hBgImg);
		dfctx._ctx2d.drawImage(this._imgRt, xm, y);

		// 左辺
		x = this._rectLoc.x();
		for(y = this._rectLoc.y() + this._hBgImg; y < ym - this._hBgImg; y += this._hBgImg)
		{
			dfctx._ctx2d.drawImage(this._imgLc, x, y);
		}
		dfctx._ctx2d.drawImage(this._imgLc, 0, 0, this._wBgImg, ym - y, x, y, this._wBgImg, ym - y);

		// 右辺
		x = xm;
		for(y = this._rectLoc.y() + this._hBgImg; y < ym - this._hBgImg; y += this._hBgImg)
		{
			dfctx._ctx2d.drawImage(this._imgRc, x, y);
		}
		dfctx._ctx2d.drawImage(this._imgRc, 0, 0, this._wBgImg, ym - y, x, y, this._wBgImg, ym - y);

		// 下辺
		x = this._rectLoc.x();
		y = ym;
		dfctx._ctx2d.drawImage(this._imgLb, x, y);
		for(x = this._rectLoc.x() + this._wBgImg; x < xm - this._wBgImg; x += this._wBgImg)
		{
			dfctx._ctx2d.drawImage(this._imgB, x, y);
		}
		dfctx._ctx2d.drawImage(this._imgB, 0, 0, xm - x, this._hBgImg, x, y, xm - x, this._hBgImg);
		dfctx._ctx2d.drawImage(this._imgRb, xm, y);
		
		// 中
		for(x = this._rectLoc.x() + this._wBgImg; x < xm - this._wBgImg; x += this._wBgImg)
		{
			for(y = this._rectLoc.y() + this._hBgImg; y < ym - this._hBgImg; y += this._hBgImg)
			{
				dfctx._ctx2d.drawImage(this._imgC, x, y);
			}
			if(ym > y)
			{
				dfctx._ctx2d.drawImage(this._imgC, 0, 0, this._wBgImg, ym - y, x, y, this._wBgImg, ym - y);
			}
		}
		if(xm > x)
		{
			for(y = this._rectLoc.y() + this._hBgImg; y < ym - this._hBgImg; y += this._hBgImg)
			{
				dfctx._ctx2d.drawImage(this._imgC, 0, 0, xm - x, this._hBgImg, x, y, xm - x, this._hBgImg);
			}
			if(ym > y)
			{
				dfctx._ctx2d.drawImage(this._imgC, 0, 0, xm - x, ym - y, x, y, xm - x, ym - y);
			}
		}
	
		if(this._alpha != 1)	{	dfctx._ctx2d.globalAlpha = alphaOld;	}	// アルファを戻す
	}
	
	// テスト
	/** /
	if(true)
	{
		dfctx._ctx2d.strokeStyle = 'rgb(255, 0, 0)';
		dfctx._ctx2d.lineWidth = 1;
		dfctx._ctx2d.beginPath();
		dfctx._ctx2d.moveTo(this._rectLoc.x(), this._rectLoc.y());
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._rectLoc.w(), this._rectLoc.y());
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._rectLoc.w(), this._rectLoc.y() + this._rectLoc.h());
		dfctx._ctx2d.lineTo(this._rectLoc.x(), this._rectLoc.y() + this._rectLoc.h());
		dfctx._ctx2d.lineTo(this._rectLoc.x(), this._rectLoc.y());
		dfctx._ctx2d.moveTo(this._rectLoc.x() + this._wBgImg, this._rectLoc.y() + this._hBgImg);
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._rectLoc.w() - this._wBgImg, this._rectLoc.y() + this._hBgImg);
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._rectLoc.w() - this._wBgImg, this._rectLoc.y() + this._rectLoc.h() - this._hBgImg);
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._wBgImg, this._rectLoc.y() + this._rectLoc.h() - this._hBgImg);
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._wBgImg, this._rectLoc.y() + this._hBgImg);
		dfctx._ctx2d.closePath();
		dfctx._ctx2d.stroke();
		dfctx._ctx2d.strokeStyle = 'rgb(255, 255, 0)';
		dfctx._ctx2d.beginPath();
		dfctx._ctx2d.moveTo(this._rectLoc.x() + this._xPadding, this._rectLoc.y() + this._yPadding);
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._rectLoc.w() - this._xPadding, this._rectLoc.y() + this._yPadding);
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._rectLoc.w() - this._xPadding, this._rectLoc.y() + this._rectLoc.h() - this._yPadding);
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._xPadding, this._rectLoc.y() + this._rectLoc.h() - this._yPadding);
		dfctx._ctx2d.lineTo(this._rectLoc.x() + this._xPadding, this._rectLoc.y() + this._yPadding);
		dfctx._ctx2d.closePath();
		dfctx._ctx2d.stroke();
	}
	/**/
	
	// 親クラスによるパネル描画
	JAFW.Panel.prototype.drawFrame.call(this, dfctx);
	
	// テキスト描画
	if(this._txt != "")
	{
		if(this._alpha != 1)	{	dfctx._ctx2d.globalAlpha = this._alpha;	}	// フェードによるアルファを設定
		
		dfctx._ctx2d.font = this._fontproperty;
		dfctx._ctx2d.fillStyle = 'rgb(255, 255, 255)';
		if(!this._dtxt.isAvailable())
		{
			this._dtxt.setText(dfctx, this._txt, this._rectLoc.w() - this._xPadding - this._xPadding);		// テキスト描画に設定
		}
		this._dtxt.drawFillText(dfctx, this._rectLoc.x() + this._xPadding, this._rectLoc.y() + this._yPadding, 18);

		if(this._alpha != 1)	{	dfctx._ctx2d.globalAlpha = alphaOld;	}	// アルファを戻す
	}
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	パネルタスクシステム
 *	
**//*---------------------------------------------------------------------*/
JAFW.PanelTaskSys = function()
{
	//======================================================================
	// UiTaskSys メンバ変数

	this._arrPanels = new Array();
};

//======================================================================
// PanelTaskSys メソッド

/*-----------------------------------------------------------------*//**
	パネル登録
**//*-----------------------------------------------------------------*/
JAFW.PanelTaskSys.prototype.registerPanel = function(panel)
{
	this._arrPanels.push(panel);
	this._arrPanels.sort(function(a, b){ return (a._z > b._z) ? 1 : (a._z == b._z) ? 0 : -1; });
};

/*-----------------------------------------------------------------*//**
	パネル登録解除
**//*-----------------------------------------------------------------*/
JAFW.PanelTaskSys.prototype.unregisterPanel = function(panel)
{
	for(var i = 0; i < this._arrPanels.length; i++)
	{
		if(this._arrPanels[i] == panel)
		{
			delete this._arrPanels[i];
			return;
		}
	}
};

/*-----------------------------------------------------------------*//**
	フレーム更新
**//*-----------------------------------------------------------------*/
JAFW.PanelTaskSys.prototype.updateFrame = function(ufctx)
{
	for(var i = this._arrPanels.length - 1; i >= 0; i--)
	{
		if(this._arrPanels[i] !== undefined)
		{
			this._arrPanels[i].updateFrame(ufctx);
		}
	}
};

/*-----------------------------------------------------------------*//**
	描画
**//*-----------------------------------------------------------------*/
JAFW.PanelTaskSys.prototype.drawFrame = function(dfctx)
{
	for(var i = 0; i < this._arrPanels.length; i++)
	{
		if(this._arrPanels[i] !== undefined)
		{
			this._arrPanels[i].drawFrame(dfctx);
		}
	}
};

////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------*//**
 *	ユーティリティクラス
 *	
**//*---------------------------------------------------------------------*/
JAFW.Utils = {};

//======================================================================
// UTILS メソッド

/*---------------------------------------------------------------------*//**
	近似値判定
**//*---------------------------------------------------------------------*/
JAFW.Utils.isNear = function(f1, f2, d)
{
	return ((f2 - d) <= f1) && (f1 <= (f2 + d));
};

/*-----------------------------------------------------------------*//**
	GET パラメータを連想配列で得る
**//*-----------------------------------------------------------------*/
JAFW.Utils.analyzeGetParameter = function()
{
	var query = window.location.search.substring(1);
	var kvarr = query.split('&');
	var kvMap = new Object();
	for(var i = 0; i < kvarr.length; i++)
	{
		var kv = kvarr[i].split('=');
		if(kv.length >= 2)
		{
			var key = decodeURIComponent(kv[0]);
			var value = decodeURIComponent(kv[1]);
			kvMap[key] = value;
		}
	}
	
	return kvMap;
};

/*-----------------------------------------------------------------*//**
	POST を送信
**//*-----------------------------------------------------------------*/
JAFW.Utils.submitPost = function(url, kvMap)
{
	var form = window.document.createElement('form');
	window.document.body.appendChild(form);
	for(var key in kvMap)
	{
		var input = window.document.createElement('input');
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', key);
		input.setAttribute('value', kvMap[key]);
		form.appendChild(input);
	}
	form.setAttribute('action', url);
	form.setAttribute('method', 'post');
	form.submit();
};

/*-----------------------------------------------------------------*//**
	有効なイメージかを簡易的にパスから判定する
**//*-----------------------------------------------------------------*/
JAFW.Utils.isValidImage = function(img)
{
	if(img == null)		{	return false;	}
	if(img.src == null)	{	return false;	}
	var len = img.src.length;
	if(len == 0)		{	return false;	}
	
	// Firefox は src に "" を入れても勝手にパスが入ってしまうので、拡張子で判定
	var iext = img.src.lastIndexOf(".");
	if(iext == -1)		{	return false;	}
	var ext = img.src.substring(iext);
	switch(ext)
	{
	case ".gif":
	case ".jpg":
	case ".png":
	case ".bmp":
		return true;
	default:
		return false;
	}
};

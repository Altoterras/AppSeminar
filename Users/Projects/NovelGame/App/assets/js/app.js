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
				window.setTimeout(callback, 1000 / EFW.LOGIC_SPF);
			};
})();

////////////////////////////////////////////////////////////////////////////
// EFW ブロック

var EFW = {};

//==========================================================================
// 定数

EFW.LOGIC_SPF = 60.0;

//==========================================================================
// 変数

EFW._lastFrameTime = 0;
EFW._app = null;

//==========================================================================
// メソッド

/*---------------------------------------------------------------------*//**
	アニメーションフレーム更新関数
**//*---------------------------------------------------------------------*/
EFW.updateAnimFrame = function()
{
	// フレーム進行度を計算する
	var now = +new Date();
	var delta = (now - EFW._lastFrameTime) * 0.001;
	EFW._lastFrameTime = now;
	var frameDelta = delta * EFW.LOGIC_SPF;
	
	// フレーム更新処理
	EFW._app.drawFrame();
	EFW._app.updateFrame(frameDelta);

	window.requestAnimFrame(EFW.updateAnimFrame);
};

/*---------------------------------------------------------------------*//**
	開始
**//*---------------------------------------------------------------------*/
EFW.start = function(nameCanvas)
{
	EFW._app = new EFW.App();
	EFW._app.start(nameCanvas);

	// タイマー設定
	EFW._lastFrameTime = +new Date();
	window.requestAnimFrame(EFW.updateAnimFrame);
};

////////////////////////////////////////////////////////////////////////////
// EFW.App クラス

/*---------------------------------------------------------------------*//**
	App コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.App = function()
{
	this.SCENE_TEST_1 = 0;
	this.SCENE_TEST_2 = 1;
	this.SCENE_GAME = 2;

	this._ctx2d = null;
	this._cntFrame = 0;

	this._scnmng = new EFW.SceneManager();

	this._ms = new EFW.MouseInfo();
};

/*---------------------------------------------------------------------*//**
	開始
**//*---------------------------------------------------------------------*/
EFW.App.prototype.start = function(nameCanvas)
{
	// キャンバスの 2D 描画コンテキストを得る
	var canvas = document.getElementById(nameCanvas);
	if(canvas && (typeof(canvas.getContext) === 'function'))
	{
		var ctx = canvas.getContext('2d');
		if(ctx)
		{
		}
			this._ctx2d = ctx;
	}

	// イベントハンドラ登録
	var own = this;
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
		//EFW.App.prototype.onKeydown.call(own, keycode, shift, ctrl);
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
		own._ms.onMouseDown(x, y);
	};
	canvas.onmouseup = function(e)
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
		own._ms.onMouseUp(x, y);
	};
	canvas.onmousemove = function(e)
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
		own._ms.onMouseMove(x, y);
	};
	
	// シーン登録
	this._scnmng.register(new EFW.SceneTest1());
	this._scnmng.register(new EFW.SceneTest2());
	this._scnmng.register(new EFW.SceneGame());
	
	// 最初のシーンの設定
	this._scnmng.changeScene(this.SCENE_TEST_1);
};

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.App.prototype.updateFrame = function(frameDelta)
{
	var ufctx = new EFW.UpdateFrameContext(this, frameDelta);

	// Debug
	var divDebug = document.getElementById('contents_debug');
	/*
	switch(this._cntFrame & 3)
	{
	case 0:	divDebug.innerHTML = '|';	break;
	case 1:	divDebug.innerHTML = '/';	break;
	case 2:	divDebug.innerHTML = '-';	break;
	case 3:	divDebug.innerHTML = '\\';	break;
	}
	*/
	
	if(this._ms._xClick != null && this._ms._yClick != null && this._ms._isClicked)
	{
		// マウスボタンが押された場合
		divDebug.innerHTML = "マウスクリックした　X=" + this._ms._xClick  + ", Y=" + this._ms._yClick;
	}
	else if(this._ms._xClick != null && this._ms._yClick != null && !this._ms._isClicked)
	{
		// マウスボタンが離された場合
		divDebug.innerHTML = "マウスボタンを離した　X=" + this._ms._xClick  + ", Y=" + this._ms._yClick;
	}
	else if(this._ms._xMove != null && this._ms._yMove != null && this._ms._isClicked)
	{
		// マウスドラッグ中の場合
		divDebug.innerHTML = "マウスドラッグ中　X=" + this._ms._xMove  + ", Y=" + this._ms._yMove;
	}
	this._ms.updateFrame(frameDelta);

	// シーンフレーム更新
	this._scnmng.updateFrame(ufctx);
	
	this._cntFrame++;
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.App.prototype.drawFrame = function()
{
	var dfctx = new EFW.DrawFrameContext(this._ctx2d);

	// 画面クリア
	this._ctx2d.clearRect(0, 0, 700, 700);
	
	// シーンフレーム描画
	this._scnmng.drawFrame(dfctx);
};

////////////////////////////////////////////////////////////////////////////
// ユーティリティ関数群

EFW.Utils = {};

/*-----------------------------------------------------------------*//**
	有効なイメージかを簡易的にパスから判定する
**//*-----------------------------------------------------------------*/
EFW.Utils.isValidImage = function(img)
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

////////////////////////////////////////////////////////////////////////////
// EFW.UpdateFrameContext クラス

/*---------------------------------------------------------------------*//**
 *	UpdateFrameContext クラス
 *	
**//*---------------------------------------------------------------------*/
EFW.UpdateFrameContext = function(app, frameDelta)
{
	//======================================================================
	// フィールド変数

	this._app = app;
	this._frameDelta = frameDelta;
	this._parent = null;
};

////////////////////////////////////////////////////////////////////////////
// EFW.DrawFrameContext クラス

/*---------------------------------------------------------------------*//**
 *	DrawFrameContext クラス
 *	
**//*---------------------------------------------------------------------*/
EFW.DrawFrameContext = function(ctx2d)
{
	//======================================================================
	// フィールド変数

	this._ctx2d = ctx2d;
};

////////////////////////////////////////////////////////////////////////////
// EFW.Rect クラス

/*---------------------------------------------------------------------*//**
 *	矩形クラス
 *	
**//*---------------------------------------------------------------------*/
EFW.Rect = function(src_or_x, y, w, h)
{
	//======================================================================
	// フィールド変数

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

EFW.Rect.prototype =
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
// EFW.MouseInfo マウス操作クラス

/*---------------------------------------------------------------------*//**
	MouseInfo コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.MouseInfo = function()
{
	// MouseIf メンバ変数
	this._xClick = null;		// 現フレームのマウスクリック位置 X 座標
	this._yClick = null;		// 現フレームのマウスクリック位置 Y 座標
	this._xMove = null;		// 現フレームのマウス移動位置 X 座標
	this._yMove = null;		// 現フレームのマウス移動位置 Y 座標
	this._xClickLast = null;	// ブラウザからの最終マウスクリック位置 X 座標
	this._yClickLast = null;	// ブラウザからの最終マウスクリック位置 Y 座標
	this._xMoveLast = null;		// ブラウザからの最終マウス移動位置 X 座標
	this._yMoveLast = null;		// ブラウザからの最終マウス移動位置 Y 座標
	this._isClicked = false;	// クリック中かどうか
	this._reacted = false;		// 反応したかフラグ
};

/*-----------------------------------------------------------------*//**
	マウスボタン 押下処理
**//*-----------------------------------------------------------------*/
EFW.MouseInfo.prototype.onMouseDown = function(x, y)
{
	this._xClickLast = x;
	this._yClickLast = y;
	this._isClicked = true;
};

/*-----------------------------------------------------------------*//**
	マウスボタン 押上処理
**//*-----------------------------------------------------------------*/
EFW.MouseInfo.prototype.onMouseUp = function(x, y)
{
	this._xClickLast = x;
	this._yClickLast = y;
	this._isClicked = false;
};

/*-----------------------------------------------------------------*//**
	マウスボタン 移動処理
**//*-----------------------------------------------------------------*/
EFW.MouseInfo.prototype.onMouseMove = function(x, y)
{
	this._xMoveLast = x;
	this._yMoveLast = y;
};

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.MouseInfo.prototype.updateFrame = function(frameDelta)
{
	this._xClick = this._xClickLast;
	this._yClick = this._yClickLast;
	this._xMove = this._xMoveLast;
	this._yMove = this._yMoveLast;
	
	this._xClickLast = null;
	this._yClickLast = null;
	this._xMoveLast = null;
	this._yMoveLast = null;
	
	this._reacted = false;
}

////////////////////////////////////////////////////////////////////////////
// EFW.FrameObjManager クラス

/*---------------------------------------------------------------------*//**
	FrameObjManager コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.FrameObjManager = function()
{
	this._arrFrameObj = new Array();
}

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.FrameObjManager.prototype.updateFrame = function(ufctx)
{
	for(var i = 0; i < this._arrFrameObj.length; i++)
	{
		this._arrFrameObj[i].updateFrame(ufctx);
	}
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.FrameObjManager.prototype.drawFrame = function(dfctx)
{
	for(var i = 0; i < this._arrFrameObj.length; i++)
	{
		this._arrFrameObj[i].drawFrame(dfctx);
	}
};

/*---------------------------------------------------------------------*//**
	シーン登録
**//*---------------------------------------------------------------------*/
EFW.FrameObjManager.prototype.register = function(frameobj)
{
	/*
	var idxTail = this._arrFrameObj.length;
	this._arrFrameObj[idxTail] = frameobj;
	*/
	this._arrFrameObj.push(frameobj);
};

////////////////////////////////////////////////////////////////////////////
// EFW.Scene クラス

/*---------------------------------------------------------------------*//**
	Scene コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.Scene = function(parent)
{
	this._fomng = null;
	this._parent = parent ? parent : null;
};

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.Scene.prototype.updateFrame = function(ufctx)
{
	if(this._fomng != null)
	{
		this._fomng.updateFrame(ufctx);
	}
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.Scene.prototype.drawFrame = function(dfctx)
{
	if(this._fomng != null)
	{
		this._fomng.drawFrame(dfctx);
	}
};

/*---------------------------------------------------------------------*//**
	シーン開始時に呼ばれる
**//*---------------------------------------------------------------------*/
EFW.Scene.prototype.begin = function(frameDelta)
{
};

/*---------------------------------------------------------------------*//**
	シーン終了時に呼ばれる
**//*---------------------------------------------------------------------*/
EFW.Scene.prototype.end = function(frameDelta)
{
};

////////////////////////////////////////////////////////////////////////////
// EFW.SceneManager クラス

/*---------------------------------------------------------------------*//**
	SceneManager コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.SceneManager = function()
{
	this._arrScene = new Array();
	this._sidxCur = -1;	// 現在のシーンインデックス
}

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.SceneManager.prototype.updateFrame = function(ufctx)
{
	if((this._sidxCur < 0) || (this._arrScene.length <= this._sidxCur)) { return; }
	this._arrScene[this._sidxCur].updateFrame(ufctx);
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.SceneManager.prototype.drawFrame = function(dfctx)
{
	if((this._sidxCur < 0) || (this._arrScene.length <= this._sidxCur)) { return; }
	this._arrScene[this._sidxCur].drawFrame(dfctx);
};

/*---------------------------------------------------------------------*//**
	シーン登録
**//*---------------------------------------------------------------------*/
EFW.SceneManager.prototype.register = function(scene)
{
	/*
	var sidxTail = this._arrScene.length;
	this._arrScene[sidxTail] = scene;
	*/
	this._arrScene.push(scene);
};

/*-----------------------------------------------------------------*//**
	シーン変更
**//*-----------------------------------------------------------------*/
EFW.SceneManager.prototype.changeScene = function(sceneidx)
{
	// シーンの終了メソッドを呼ぶ
	if((0 <= this._sidxCur) && (this._sidxCur < this._arrScene.length))
	{
		this._arrScene[this._sidxCur].end();
	}
	
	// 現在のシーンインデックスの変更
	this._sidxCur = sceneidx;
	
	// シーンの開始メソッドを呼ぶ
	if((0 <= this._sidxCur) && (this._sidxCur < this._arrScene.length))
	{
		this._arrScene[this._sidxCur].begin();
	}
}

////////////////////////////////////////////////////////////////////////////
// EFW.Clickable クラス

/*---------------------------------------------------------------------*//**
	Clickable コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.Clickable = function()
{
	this._rect = new EFW.Rect();
	this._func = null;
	this._img = new Image();
	this._txt = "";
	this._paramFunc = "";
};

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.Clickable.prototype.updateFrame = function(ufctx)
{
	if(! ufctx._app._ms._reacted && ufctx._app._ms._isClicked && this._rect.isPointIn(ufctx._app._ms._xClick, ufctx._app._ms._yClick))
	{
		if(this._func != null)
		{
			this._func(this, ufctx);
		}
		ufctx._app._ms._reacted = true;
	}
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.Clickable.prototype.drawFrame = function(dfctx)
{
	if(EFW.Utils.isValidImage(this._img))
	{
		dfctx._ctx2d.drawImage(this._img, this._rect.x(), this._rect.y(), this._rect.w(), this._rect.h());
	}
	
	if(this._txt != "")
	{
		var w = dfctx._ctx2d.measureText(this._txt).width;
		dfctx._ctx2d.fillText(this._txt, this._rect.x() + ((this._rect.w() - w) / 2), this._rect.y() + (this._rect.h() / 2));
	}
};

////////////////////////////////////////////////////////////////////////////
// EFW.MessagePanel クラス

/*---------------------------------------------------------------------*//**
	MessagePanel コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.MessagePanel = function()
{
	this._message = "";
	this._cntMsgShow = 0;
};

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.MessagePanel.prototype.updateFrame = function(frameDelta)
{
	this._cntMsgShow += frameDelta;
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.MessagePanel.prototype.drawFrame = function(ctx2d)
{
	var left = 35;
	var right = 360;
	var top = 180;
	
	var x = left;
	var y = top;
	var INC_CHAR_FRAME = 5;		// 次の文字の表示が開始するフレーム数
	var INC_ALPHA = 0.02;		// 文字表示開始時のアルファ増加値
	for(var i = 0; i < this._message.length; i++)
	{
		var alpha = this._cntMsgShow - (i * INC_CHAR_FRAME);
		if(alpha < 0)	{	break;	}
		alpha *= INC_ALPHA;
		var c = this._message.charAt(i);
		var w = ctx2d.measureText(c).width;
		if(c == '\n')
		{
			x = right;
		}
		else
		{
			if(alpha >= 1)
			{
				ctx2d.fillText(c, x, y);
			}
			else
			{
				ctx2d.globalAlpha = alpha;
				ctx2d.fillText(c, x, y);
				ctx2d.globalAlpha = 1;
			}
			x += w;
		}
		if(x >= right)
		{
			x = left;
			y += 12;	//ctx2d.measureText(c).height;
		}
	}
};

/*---------------------------------------------------------------------*//**
	リセット
**//*---------------------------------------------------------------------*/
EFW.MessagePanel.prototype.reset = function(msg)
{
	this._message = msg;
	this._cntMsgShow = 0;
}

////////////////////////////////////////////////////////////////////////////
// EFW.ClickableScene クラス

/*---------------------------------------------------------------------*//**
	ClickableScene コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.ClickableScene = function(parent, mngr, imgsrc)
{
	this._parent = parent ? parent : null;
	this._fomng = new EFW.FrameObjManager();
	this._scnmngr = mngr;
	this._img = new Image();
	this._img.src = imgsrc;
}

EFW.ClickableScene.prototype = new EFW.Scene();

/*---------------------------------------------------------------------*//**
	Clickable 登録
**//*---------------------------------------------------------------------*/
EFW.ClickableScene.prototype.addClickable = function(x, y, w, h, scnidx)
{
	var ccb = new EFW.Clickable();
	var own = this;
	ccb._rect.set(x, y, w, h);
	ccb._func = function()
		{
			var scnidxNew = ccb._paramFunc;
			own._scnmngr.changeScene(scnidxNew);
		}
	ccb._paramFunc = scnidx;
	this._fomng.register(ccb);
	return ccb;
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.ClickableScene.prototype.drawFrame = function(dfctx)
{
	if(EFW.Utils.isValidImage(this._img))
	{
		dfctx._ctx2d.drawImage(this._img, 0, 0);
	}
	
	EFW.Scene.prototype.drawFrame.call(this, dfctx);	// call parent method
}


////////////////////////////////////////////////////////////////////////////
// EFW.SceneTest1 クラス

/*---------------------------------------------------------------------*//**
	SceneTest1 コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.SceneTest1 = function()
{
	this._ctx2d = null;
	this._cntFrame = 0;
	this._img1 = new Image();
	this._img1.src = "./img/back-01.jpg";
	this._img2 = new Image();
	this._img2.src = "./img/character01.png";
	this._img3 = new Image();
	this._img3.src = "./img/frame.png";
	
	this._img4 = new Image();
	this._img4.src = "./img/ura.jpg";
	
	this._msgp = new EFW.MessagePanel();

	this._fomng = new EFW.FrameObjManager();
};

EFW.SceneTest1.prototype = new EFW.Scene();

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.SceneTest1.prototype.updateFrame = function(ufctx)
{
	this._msgp.updateFrame(ufctx._frameDelta);
	
	this._fomng.updateFrame(ufctx);
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.SceneTest1.prototype.drawFrame = function(dfctx)
{
	dfctx._ctx2d.drawImage(this._img4, 0, 0);
	dfctx._ctx2d.drawImage(this._img1, 0, 0);
	dfctx._ctx2d.drawImage(this._img2, 0, 0);
	dfctx._ctx2d.drawImage(this._img3, 0, 150);
//	dfctx._ctx2d.drawImage(this._img4, 500, 0);
//	dfctx._ctx2d.drawImage(this._img4,this._ms._xMoveLast, this._ms._yMoveLast);
	
	dfctx._ctx2d.font = "italic bold 12px sans-serif";
	dfctx._ctx2d.fillStyle = "#ffffff";
	this._msgp.drawFrame(dfctx._ctx2d);

	this._fomng.drawFrame(dfctx);
};

/*---------------------------------------------------------------------*//**
	シーン開始時に呼ばれる
**//*---------------------------------------------------------------------*/
EFW.SceneTest1.prototype.begin = function()
{
	this._msgp.reset("SceneTest1: あいうえお");
	
	var ccbl1 = new EFW.Clickable();
	ccbl1._rect.set(50, 100, 100, 50);
	ccbl1._img.src = "./img/dummy_red.png";
	ccbl1._txt = "> scene2";
	ccbl1._func = function(ccb, ufctx) { ufctx._app._scnmng.changeScene(ufctx._app.SCENE_TEST_2); }
	var ccbl2 = new EFW.Clickable();
	ccbl2._rect.set(200, 100, 100, 50);
	ccbl2._img.src = "./img/dummy_red.png";
	ccbl2._txt = "> game";
	ccbl2._func = function(ccb, ufctx) { ufctx._app._scnmng.changeScene(ufctx._app.SCENE_GAME); }
	this._fomng.register(ccbl1);
	this._fomng.register(ccbl2);
};

////////////////////////////////////////////////////////////////////////////
// EFW.SceneTest2 クラス

/*---------------------------------------------------------------------*//**
	SceneTest2 コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.SceneTest2 = function()
{
	this._msgp = new EFW.MessagePanel();
	this._smPics = new EFW.SceneManager();
	this._fomng = new EFW.FrameObjManager();
};

EFW.SceneTest2.prototype = new EFW.Scene();

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.SceneTest2.prototype.updateFrame = function(ufctx)
{
	this._msgp.updateFrame(ufctx._frameDelta);
	this._fomng.updateFrame(ufctx);
	this._smPics.updateFrame(ufctx);
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.SceneTest2.prototype.drawFrame = function(dfctx)
{
	dfctx._ctx2d.font = "italic bold 12px sans-serif";
	dfctx._ctx2d.fillStyle = "#000000";
	this._msgp.drawFrame(dfctx._ctx2d);
	
	this._smPics.drawFrame(dfctx);
	this._fomng.drawFrame(dfctx);
};

/*---------------------------------------------------------------------*//**
	シーン開始時に呼ばれる
**//*---------------------------------------------------------------------*/
EFW.SceneTest2.prototype.begin = function()
{
	this._msgp.reset("SceneTest2: かきくけこ");

	var ccbl1 = new EFW.Clickable();
	ccbl1._rect.set(150, 300, 100, 50);
	ccbl1._img.src = "./img/dummy_red.png";
	ccbl1._txt = "> scene1";
	ccbl1._func = function(cbb, ufctx) { ufctx._app._scnmng.changeScene(ufctx._app.SCENE_TEST_1); }
	this._fomng.register(ccbl1);

	var scnPic1 = new EFW.ClickableScene(this, this._smPics, './img/sample01.png');
	scnPic1.addClickable(100, 80, 160, 120, 1);
	var scnPic2 = new EFW.ClickableScene(this, this._smPics, './img/sample02.png');
	scnPic2.addClickable(450, 200, 80, 210, 2);
	var scnPic3 = new EFW.ClickableScene(this, this._smPics, './img/s001-001.jpg');
	scnPic3.addClickable(450, 200, 80, 210, 0);
//	var scnPic4 = new EFW.ClickableScene(this, this._smPics, './img/s001-011.jpg');
//	var scnPic5 = new EFW.ClickableScene(this, this._smPics, './img/s001-012.jpg');
//	var scnPic6 = new EFW.ClickableScene(this, this._smPics, './img/s001-013.jpg');
	this._smPics.register(scnPic1);
	this._smPics.register(scnPic2);
	this._smPics.register(scnPic3);
//	this._smPics.register(scnPic4);
//	this._smPics.register(scnPic5);
//	this._smPics.register(scnPic6);
	this._smPics.changeScene(0);
};

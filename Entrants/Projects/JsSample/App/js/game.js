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
	
	//X
};


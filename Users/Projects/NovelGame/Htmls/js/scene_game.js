////////////////////////////////////////////////////////////////////////////
// EFW.SceneGame クラス

/*---------------------------------------------------------------------*//**
	SceneGame コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.SceneGame = function()
{
	this.SCENE_ACT_1 = 0;
	this.SCENE_ACT_2 = 1;
	this.SCENE_ACT_3 = 2;
	this.SCENE_ACT_4 = 3;
	this.SCENE_ACT_5 = 4;
	this.SCENE_ACT_6 = 5;
	this.SCENE_ACT_7 = 6;

	this._scnmng = new EFW.SceneManager();
};

EFW.SceneGame.prototype = new EFW.Scene();

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.SceneGame.prototype.updateFrame = function(ufctx)
{
	this._scnmng.updateFrame(ufctx);
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.SceneGame.prototype.drawFrame = function(dfctx)
{
	dfctx._ctx2d.font = "italic bold 12px sans-serif";
	dfctx._ctx2d.fillStyle = "#000000";
	dfctx._ctx2d.fillText("GameScne", 0, 12);
	
	this._scnmng.drawFrame(dfctx);
};

/*---------------------------------------------------------------------*//**
	シーン開始時に呼ばれる
**//*---------------------------------------------------------------------*/
EFW.SceneGame.prototype.begin = function()
{
	this._scnmng.register(new EFW.SceneGameAct1(this));
//	this._scnmng.register(new EFW.SceneGameAct2(this));
	this._scnmng.changeScene(this.SCENE_ACT_1);
};

////////////////////////////////////////////////////////////////////////////
// EFW.SceneGameAct1 クラス

/*---------------------------------------------------------------------*//**
	SceneGameAct1 コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.SceneGameAct1 = function(parent)
{
	this._parent = parent;
	this._smPics = new EFW.SceneManager();
	this._fomng = new EFW.FrameObjManager();
};

EFW.SceneGameAct1.prototype = new EFW.Scene();

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.SceneGameAct1.prototype.updateFrame = function(ufctx)
{
	this._fomng.updateFrame(ufctx);
	this._smPics.updateFrame(ufctx);
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.SceneGameAct1.prototype.drawFrame = function(dfctx)
{
/*
	dfctx._ctx2d.drawImage(this._img1, 0, 0);	//0924
	
	dfctx._ctx2d.font = "italic bold 12px sans-serif";
	dfctx._ctx2d.fillStyle = "#000000";
	dfctx._ctx2d.fillText("GameScne - Act1 -", 0, 112);
*/	
	this._smPics.drawFrame(dfctx);
	this._fomng.drawFrame(dfctx);
};

/*---------------------------------------------------------------------*//**
	シーン開始時に呼ばれる
**//*---------------------------------------------------------------------*/
EFW.SceneGameAct1.prototype.begin = function()
{
	var own = this;
	
	var scnPic1 = new EFW.ClickableScene(this, this._smPics, './img/s001-001.jpg');
	scnPic1.addClickable(70, 680, 210, 210, own._parent.SCENE_ACT_2);
	scnPic1.addClickable(639, 789, 100, 40, own._parent.SCENE_ACT_6);
	var scnPic2 = new EFW.ClickableScene(this, this._smPics, './img/s001-021.jpg');
	scnPic2.addClickable(137, 308, 690, 690, own._parent.SCENE_ACT_3);
	var scnPic3 = new EFW.ClickableScene(this, this._smPics, './img/s001-022.jpg');
	scnPic3.addClickable(445, 580, 70, 170, own._parent.SCENE_ACT_4);
	var scnPic4 = new EFW.ClickableScene(this, this._smPics, './img/s001-023.jpg');
	scnPic4.addClickable(354, 407, 250, 200, own._parent.SCENE_ACT_5);
	var scnPic5 = new EFW.ClickableScene(this, this._smPics, './img/s001-024.jpg');
	scnPic5.addClickable(354, 407, 250, 200, own._parent.SCENE_ACT_1);
	var scnPic6 = new EFW.ClickableScene(this, this._smPics, './img/s001-011.jpg');
	scnPic6.addClickable(257, 418, 450, 485, own._parent.SCENE_ACT_7);
	var scnPic7 = new EFW.ClickableScene(this, this._smPics, './img/s001-012.jpg');
	scnPic7.addClickable(357, 689, 30, 30, own._parent.SCENE_ACT_1);

	this._smPics.register(scnPic1);
	this._smPics.register(scnPic2);
	this._smPics.register(scnPic3);
	this._smPics.register(scnPic4);
	this._smPics.register(scnPic5);
	this._smPics.register(scnPic6);
	this._smPics.register(scnPic7);
	
	this._smPics.changeScene(own._parent.SCENE_ACT_1);

/*
	var ccbl1 = new EFW.Clickable();
	ccbl1._rect.set(300, 300, 100, 50);
	ccbl1._img.src = "./img/dummy_red.png";
	ccbl1._txt = "> next";
	ccbl1._func = function(ufctx) { own._parent._scnmng.changeScene(own._parent.SCENE_ACT_2); }
	this._fomng.register(ccbl1);
*/
};

////////////////////////////////////////////////////////////////////////////
// EFW.SceneGameAct2 クラス

/*---------------------------------------------------------------------*//**
	SceneGameAct2 コンストラクタ
**//*---------------------------------------------------------------------*/
EFW.SceneGameAct2 = function(parent)
{
	this._parent = parent;
	this._fomng = new EFW.FrameObjManager();
	
	this._img1 = new Image();					//0924
	this._img1.src = "./img/s001-021.jpg";		//0924
	this._fomng = new EFW.FrameObjManager();
};

EFW.SceneGameAct2.prototype = new EFW.Scene();

/*---------------------------------------------------------------------*//**
	フレーム更新
**//*---------------------------------------------------------------------*/
EFW.SceneGameAct2.prototype.updateFrame = function(ufctx)
{
	EFW.Scene.prototype.updateFrame.call(this, ufctx);	// call parent method
};

/*---------------------------------------------------------------------*//**
	フレーム描画
**//*---------------------------------------------------------------------*/
EFW.SceneGameAct2.prototype.drawFrame = function(dfctx)
{
	dfctx._ctx2d.drawImage(this._img1, 0, 0);	//0924
	
	dfctx._ctx2d.font = "italic bold 12px sans-serif";
	dfctx._ctx2d.fillStyle = "#000000";
	dfctx._ctx2d.fillText("GameScne - Act2 -", 0, 112);
	
	EFW.Scene.prototype.drawFrame.call(this, dfctx);	// call parent method
};

/*---------------------------------------------------------------------*//**
	シーン開始時に呼ばれる
**//*---------------------------------------------------------------------*/
EFW.SceneGameAct2.prototype.begin = function()
{
	var own = this;
	var ccbl1 = new EFW.Clickable();
	ccbl1._rect.set(80, 1000, 100, 50);
	ccbl1._img.src = "./img/dummy_red.png";
	ccbl1._txt = "> prev";
	ccbl1._func = function(ufctx) { own._parent._scnmng.changeScene(own._parent.SCENE_ACT_1); }
	this._fomng.register(ccbl1);
	
	var ccbl2 = new EFW.Clickable();
	ccbl2._rect.set(137, 308, 690, 690);
	ccbl2._img.src = "./img/dummy_red.png";
	ccbl2._txt = "> next";
	ccbl2._func = function(ufctx) { own._parent._scnmng.changeScene(own._parent.SCENE_ACT_3); }
	this._fomng.register(ccbl2);
};

window.onload = function () {
    var el = document.getElementById('game_canvas');
    var width = 1080;
    var height = 1920;
    game(el, width, height);
    // game.start();
};

function game (el, width, height) {
    var canvas = el;
    if (canvas && canvas.getContext) {
        var step = 0;
        var lastFrameTime = Date.now();
        var ctx = canvas.getContext('2d');
        var setCanvasSize = function () {
            var docuW = window.innerWidth;
            var docuH = window.innerHeight;
            var orgAspect = width / height;
            var newAspect = docuW / docuH;
            if (orgAspect < newAspect) {
                canvas.height = docuH;
                canvas.width = (docuH / height) * width;
            }
            else {
                canvas.width = docuW;
                canvas.height = (docuW / width) * height;
            }
            var scale = canvas.height / height;
            ctx.scale(scale, scale);
        };
        var updateFrame = function () {
            if (!ctx) {
                return;
            }
            // フレーム差分を計算する
            var now = Date.now();
            var delta = (now - lastFrameTime) * 0.001 * 60.0; // ミリ秒から秒へ（* 0.001）、秒からフレームへ（* 60.0）
            lastFrameTime = now;
            step += delta * 5;
            ctx.fillStyle = 'rgba(255, 125, 0, .8)';
            // ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
            ctx.fillRect(0, 0, width, height);
            // ctx.clearRect(width * .05, width * .05, width * .9, width * .9);
            // 次のフレームへ
            window.requestAnimationFrame(updateFrame);
        };
        setCanvasSize();
        window.addEventListener("resize", function () {
            setCanvasSize();
        }, false);
        updateFrame();
    }
    else {
        console.log('errors');
    }
};
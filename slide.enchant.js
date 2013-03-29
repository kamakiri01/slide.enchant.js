/**
 * @fileOverview slide.encahant.js
 * @version 0.2.2
 * @require enchant.js v0.6.2+
 * @author kamakiri01
 *
 * @description
 * Library for making slide-view UI in enchant.js.
*/

//CONFIG PARAMS

/**
 * 設定プロパティ
 * スライド全体の背景色、移動一回にかかるフレーム数、全体のFPS、
 * 切り替えのイージングのタイプなどを指定
*/
var SLIDE_BACKGROUNDCOLOR = "#f0f0f0";
var SLIDE_SPEED = 10;
var SLIDE_TYPE = enchant.Easing.QUAD_EASEINOUT;
var SLIDE_FRAMELATE = 20;

/**
 * slide.enchant.jsの使用する変数
*/
var slideIndex = 0;
var slides = [];


/**
 * Sceneの拡張スライドクラス
*/
var Slide = enchant.Class.create(enchant.CanvasScene, {
	initialize:function(){
		enchant.CanvasScene.call(this);
        this.backgroundColor = SLIDE_BACKGROUNDCOLOR;
	}
});


/**
 * Sceneの拡張としてDOMを利用したスライドクラス
*/
var DSlide = enchant.Class.create(enchant.DOMScene, {
	initialize:function(){
		enchant.DOMScene.call(this);
        this.backgroundColor = SLIDE_BACKGROUNDCOLOR;
	}
});


/**
 * Sceneの拡張としてWebGLを利用した3Dスライドクラス
 *
 * FrameSlide内で行うことを推奨
*/

/**
 * トップページ風レイアウトのスライドクラス
*/
var TitleSlide = enchant.Class.create(Slide, {
	initialize:function(title, subtitle){
		Slide.call(this);

		//タイトルの生成
        this._title = createLabel(64, title);
		this.addChild(this._title);
//        this._title._boundWidth *= 0.8;
//        console.log(this._title._splitText);
//        console.log("b "+this._title._boundWidth);
//
        //折り返す文量の場合は左寄せする、それ以外は中央寄せ
        if(this._title.getMetrics(title).width < enchant.Core.instance.width){
            this._title.x = enchant.Core.instance.width/2 - this._title._boundWidth/2;
        }else{
            this._title.x = 0;
        }
		this._title.y = (enchant.Core.instance.height) / 2;
        this._title.width = enchant.Core.instance.width * 0.8;
//        console.log(this._title.getMetrics(title));

        //サブタイトルの生成
		if(subtitle == undefined) subtitle = "";
		this._subtitle = createLabel(32, subtitle);
		this.addChild(this._subtitle);
		this._subtitle.color = '#a0a0a0';
        this._subtitle.x = this._title.x + this._title._boundWidth /2;
		this._subtitle.y = this._title.y + this._title._boundHeight *1.5;
	},
	title:{
		get:function(){
			return this._title.text;
		},
		set:function(title){
			this._title.text = title;
		}
	},
	subtitle:{
		get:function(){
			return this._subtitle.text;
		},
		set:function(subtitle){
			this._subtitle.text = subtitle;
		}
	}
});


/**
 * 列挙型表示のスライドクラス
*/
var ItemSlide = enchant.Class.create(Slide, {
	initialize:function(title, items){
		Slide.call(this);
		this._title = createLabel(48, title);
		this.addChild(this._title);
//        this._title._boundWidth *= 0.8;
        if(this._title.getMetrics(title).width < enchant.Core.instance.width){
//           this._title.x = enchant.Core.instance.width * 0.2 - this._title._boundWidth/2; //左寄せのみする場合
            this._title.x = enchant.Core.instance.width/2 - this._title._boundWidth/2;
        }else{
            this._title.x = 0;
        }
		this._title.y = enchant.Core.instance.height * 0.05;
		this._items = [];
        if(items != undefined){
            for(var i = 0; i < items.length; i++){
                var item = createLabel(32, "" + items[i]);
                item.x = enchant.Core.instance.width * 0.1;
                item.width = enchant.Core.instance.width * 0.8;
                item.y = this._title.y + this._title._boundHeight * 1.5 +i * (enchant.Core.instance.height - this._title.y - this._title._boundHeight *1.5) / items.length;
                this._items.push(item);
                this.addChild(item);
            }
        }
	}
});


/**
 * iframeを表示するスライドクラス
 * フレーム内でキー操作を受ける場合は下記をフレーム内enchant()と同じ層に追加する

window.addEventListener('message', function (e, origin) {
    try {
        var jdata = eval(e.data);
        if (jdata.act == "keydown") {
            enchant.Game.instance.dispatchEvent("keydown");
            var button = enchant.Game.instance._keybind[jdata.value];
            var evt = new enchant.Event(button + "buttondown");
            enchant.Game.instance.dispatchEvent(evt);
        } else if (jdata.act == "keyup") {
            enchant.Game.instance.dispatchEvent("keyup");
            var button = enchant.Game.instance._keybind[jdata.value];
            var evt = new enchant.Event(button + "buttonup");
            enchant.Game.instance.dispatchEvent(evt);
        }
    } catch (e) {
        console.log('bad call: ' + e);
    }
});

*/
var FrameSlide = enchant.Class.create(DSlide, {
	initialize:function(url, width, height){
		DSlide.call(this);
		width = width | enchant.Core.instance.width;
		height = height | enchant.Core.instance.height;
		var sprite = new Sprite(width, height);
        sprite._element = document.createElement('div');

		var iframe = document.createElement('iframe');
		iframe.setAttribute('src', url);
		iframe.setAttribute('width', width + 'px');
		iframe.setAttribute('height', height + 'px');
        iframe.setAttribute('text-align', 'center');
        iframe.setAttribute('align', 'center');
		this._frame = iframe;
		sprite._element.appendChild(iframe);
//            sprite.x = enchant.Core.instance.width/2 ;//- sprite.width/2;

        //シーン開始時にフレームを読み込む
		this.addEventListener('enter', function(){
			this.addChild(sprite);
//            this.addKeyEvent();
//            this.eval(this.messageListener);
		});

        //シーンを離れたらフレームを終了する
		this.addEventListener('transitionexit', function(){
            this.removeKeyEvent();
//			this.removeChild(sprite);
		});
	},

    //フレーム内にキーイベントを送る
    addKeyEvent:function(){
        this._onkeydown = function(e){
            console.log(this.onkeydown._target.getAttribute("src"));
            var frame = this.onkeydown._target;
            frame.contentWindow.postMessage("({value : "+e.keyCode+", type: 'event', act: 'keydown'})","*");
        };
        window.onkeydown = this._onkeydown;
        window.onkeydown._target = this._frame;

        this._onkeyup = function(e){
            var frame = this.onkeydown._target;
            frame.contentWindow.postMessage("({value : "+e.keyCode+", type: 'event', act: 'keyup'})", "*");
        }
        window.onkeyup = this._onkeyup;
    },
    removeKeyEvent:function(){
    },
	eval:function(javascript){
		this._frame.contentWindow.eval(javascript);
	},
    messageListener:"javascript:console.log('messageListenerOnload'+ enchant.Core.instance.width);window.addEventListener('message', function (e, origin) { console.log('keydown');try {var jdata = eval(e.data);if (jdata.act == 'keydown') {enchant.Game.instance.dispatchEvent('keydown'); var button = enchant.Game.instance._keybind[jdata.value];var evt = new enchant.Event(button + 'buttondown');enchant.Game.instance.dispatchEvent(evt);} else if (jdata.act == 'keyup') {enchant.Game.instance.dispatchEvent('keyup');var button = enchant.Game.instance._keybind[jdata.value];var evt = new enchant.Event(button + 'buttonup');enchant.Game.instance.dispatchEvent(evt);}} catch (e) {console.log('bad call: ' + e);}});"
    

});


/**
 * コードをハイライト表示するスライドクラス
 * ※未完成
*/
var CodeSlide = enchant.Class.create(FrameSlide, {
	initialize:function(url, width, height){
		FrameSlide.call(this,'../code/demo/complete.html?' + url, width, height);
	}
});


/**
 * 画像を表示するスライドクラス
*/
var ImageSlide = enchant.Class.create(Slide, {
	initialize:function(image, title){
		Slide.call(this);

        if(title != undefined){
            this._title = createLabel(48, title);
            this.addChild(this._title);
            this._title.x = enchant.Core.instance.width/2 - this._title._boundWidth/2;
            this._title.y = enchant.Core.instance.height * 0.05;
        }
//        enchant.Core.instance.preload(image);
		var sprite = new Sprite(enchant.Core.instance.assets[image].width, enchant.Core.instance.assets[image].height);
		sprite.image = enchant.Core.instance.assets[image];
        sprite.x = enchant.Core.instance.width/2 - sprite.width /2
        sprite.y = this._title._boundHeight *1.5;
		this.addChild(sprite);
    },
});


/**
 * ラベル生成メソッド
*/
function createLabel(size, text, color){
	var label = new Label();
	label.width = enchant.Core.instance.width * 0.9;    //ラベルの描画幅を折り返してもはみ出さない範囲で最大化
	label.font = size + 'px bold sans';
    label.text = text;
    
    if(color != undefined){
        label.color = color;
    };
//    label.updateBoundArea();  //widthのsetterで呼ばれているが再読する
	return label;
}


/**
 * 数式スプライト生成メソッド
 * エスケープ文字を含んだTeX形式の数式スプライトを生成する
 * 
 * @example
 * "E=\\pm\\frac{m}{\\sqrt{1-\\frac{v^2}{c^2}}}c^2"
*/
function createFormula(latex, size, color){
    var _size;
    var _color;

    if(size != undefined){
        _size = size;
    }else{
        _size = 40;
    };

    if(color != undefined){
        _color = color;
    }else{
        _color = "000000ff";
    };

    var googleAPICode = 
        'http://chart.apis.google.com/chart?cht=tx&chf=bg,s,ffffff00'
        +'&chco=' + _color 
        +'&chs=' + _size 
        +'&chl=' + encodeURIComponent(latex);

    var img = document.createElement('img');
    img.src = googleAPICode;
    
    var sprite = new LazySprite(img);
    return sprite;
}


/*
 * 外部ファイル等読み込み時間を要する画像を非同期読み込みして
 * スプライトに利用する
 * */
var LazySprite = enchant.Class.create(enchant.Sprite, {
    initialize:function(img){
        enchant.Sprite.call(this, 1, 1);
        
        this._sImg = img;
        this._sWidth;
        this._sheight;
        this._sImg.parent = this;

        this._sImg.onload = function(){
            var _width = this.width;
            var _height = this.height;
            
            this.parent.width = _width;
            this.parent.height = _height;
            
            var o = {};
            o._element = this;
            this.parent.image = new Surface(_width, _height);
            this.parent.image.draw(o, 0, 0, _width, _height);
//            this.image.context.drawImage(img,0, 0, _width, _height);
        };
    },
    loadComp:function(){
        this.image = new Surface();
    }
});


/**
 * スライドを戻す
*/
enchant.Core.prototype.prev = function(){
    if(slideIndex > 0){
        slideIndex--;
        var s = slides[slideIndex];
        if(typeof s == "function"){
//                s(Core.instance.currentScene);//戻り先が関数の場合、処理を呼ばずにさらに前のスライドを呼ぶ
                this.prev();
        }else{
            Core.instance.currentScene.tl.moveTo(Core.instance.width, 0, SLIDE_SPEED, SLIDE_TYPE).then(function(){
                s = slides[slideIndex];//連打対策としてpushのタイミングで挿入を期待される番号のスライドを再取得
                Core.instance.popScene();
                s.x = - Core.instance.width;
                Core.instance.pushScene(s);
                s.tl.moveTo(0, 0, SLIDE_SPEED, SLIDE_TYPE);
            })
        }
        console.log("slideindex:" + slideIndex);
        return true;
    }
    return false;
}


/**
 * スライドを進める
*/
enchant.Core.prototype.next = function(){
    if(slideIndex + 1 < slides.length){
        slideIndex++;
        var s = slides[slideIndex];
        if(typeof s == "function"){
            s(Core.instance.currentScene);
        }else{
            Core.instance.currentScene.tl.moveTo(-Core.instance.width, 0, SLIDE_SPEED, SLIDE_TYPE).then(function(){
                s = slides[slideIndex];
                Core.instance.popScene();
                s.x = Core.instance.width;
                Core.instance.pushScene(s);
                s.tl.moveTo(0, 0, SLIDE_SPEED, SLIDE_TYPE);
            });
        }
    
        console.log("slideIndex:" + slideIndex);
        return true;
    }
    console.log("slideIndex:" + slideIndex);
    return false;
}
/*
ocument.body.addEventListener('mousedown', function(){
    	enchant.Core.instance.next();
    });
*/

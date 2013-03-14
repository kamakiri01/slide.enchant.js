/**
 * @fileOverview slide.encahant.js
 * @version 0.2.1
 * @require enchant.js v0.6.2+
 * @author kamakiri_ys
 *
 * @description
 * Library for making slide-view UI in enchant.js.
*/
//var code = "javascript:console.log('messageListenerOnload'+ enchant.Core.instance.width);window.addEventListener('message', function (e, origin) { console.log('keydown');try {var jdata = eval(e.data);if (jdata.act == 'keydown') {enchant.Game.instance.dispatchEvent('keydown'); var button = enchant.Game.instance._keybind[jdata.value];var evt = new enchant.Event(button + 'buttondown');enchant.Game.instance.dispatchEvent(evt);} else if (jdata.act == 'keyup') {enchant.Game.instance.dispatchEvent('keyup');var button = enchant.Game.instance._keybind[jdata.value];var evt = new enchant.Event(button + 'buttonup');enchant.Game.instance.dispatchEvent(evt);}} catch (e) {console.log('bad call: ' + e);}});";
//CONFIG PARAMS

var SLIDE_BACKGROUNDCOLOR = "#f0f0f0";
var SLIDE_SPEED = 10;
var SLIDE_TYPE = enchant.Easing.QUAD_EASEINOUT;
var SLIDE_FRAMELATE = 20;


//表示しているスライドのページ番号
var slideIndex = 0;

//スライドクラスのリスト
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
 * ラベル生成メソッド
*/
function createLabel(size, text){
	var label = new Label();
	label.width = enchant.Core.instance.width * 0.9;//ラベルの描画幅を折り返してもはみ出さない範囲で最大化
	label.font = size + 'px bold sans';
    label.text = text;
//    label.updateBoundArea();//widthのsetterで呼ばれているが再読する
	return label;
}


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
        enchant.Core.instance.preload(image);
		var sprite = new Sprite(enchant.Core.instance.assets[image].width, enchant.Core.instance.assets[image].height);
		sprite.image = enchant.Core.instance.assets[image];
        sprite.x = enchant.Core.instance.width/2 - sprite.width /2
        sprite.y = this._title._boundHeight *1.5;
		this.addChild(sprite);
    },
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
//サンプル
enchant();
window.onload = function(){
    var game = new Core(640, 480);
    game.fps = SLIDE_FRAMELATE;
    game.preload('chara1.png','icon0.png','13A.jpg');

   	game.addEventListener('rightbuttondown', function(){
   		this.next();
   	});
   	game.addEventListener('leftbuttondown', function(){
   		this.prev();
   	});
    game.onload = function(){
    	slides.push(new TitleSlide('slide.enchant.js', 'v0.6.3対応<br>with tl.enchant.js'));
    	slides.push(new TitleSlide('enchant.jsでプレゼンツールを作りました。'));
    	slides.push(new TitleSlide('kondoさんに感謝', '元はkondoさん作'));
    	slides.push(new ItemSlide('こんなレイアウトができます', ['TitleSlide','ItemSlide', 'FrameSlide', 'ImageSlide', 'etc...']));
    	slides.push(new TitleSlide('TitleSlide', '表紙向けレイアウト'));
    	slides.push(new TitleSlide('タイトル', 'サブタイトル<br>サブタイトル2'));
    	slides.push(new TitleSlide('ItemSlide', '列挙レイアウト'));
    	slides.push(new ItemSlide('タイトル', ['要素１', '要素２', '要素３']));
    	slides.push(new ItemSlide('要素が多い場合', ['要素１', '要素２', '要素３', '要素４', '要素５', '要素６', '要素７', '要素８']));
        slides.push(new ItemSlide('吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。'));
    	slides.push(new TitleSlide('FrameSlide',['iframe埋め込み']));
    	slides.push(new FrameSlide('http://r.jsgames.jp/games/2620/', 320,320));
    	slides.push(new TitleSlide('ImageSlide'));
    	slides.push(new ImageSlide("13A.jpg", 'ローカルの画像を表示'));
    	slides.push(new TitleSlide('スライドにenchant.jsの処理を後付できる'));
    	slides.push((function(scene){
            var s = new Slide();
    		for(var i = 0; i < 20; i++){
	    		var sprite = new Sprite(32, 32);
	    		sprite.image = game.assets['chara1.png'];
	    		sprite.scaleX = 2;
	    		sprite.scaleY = 2;
	    		sprite.x = -32 * sprite.scaleX - 400 * Math.random();
	    		sprite.y = Core.instance.height * Math.random();
	    		sprite.chara = Math.floor(3 * Math.random()) * 5;
	    		sprite.offset = Math.floor(Math.random() * 3);
	    		sprite.vx = 3 + 5 * Math.random();
                sprite.parentScene = scene;
	    		sprite.addEventListener('enterframe', function(){
	    			this.x += this.vx * sprite.scaleY;
	    			this.frame = [0, 1, 0, 2][(this.age + this.offset) % 4] + this.chara;
	    			if(this.x > game.width){
	    				this.parentScene.removeChild(this);
	    			}
	    		});
                sprite.addEventListener(enchant.Event.EXIT, function(){
                    console.log("now!");
                });
	    		scene.addChild(sprite);
    		}
    	}) );
        slides.push((function(scene){
            var view = new ItemSlide("スライド自体をゲームっぽくもできる");
            var sprite = new Sprite(32,32);
            sprite.image = game.assets['chara1.png'];
            sprite.scaleX = 2;
            sprite.scaleY = 2;
            sprite.x = Game.instance.width *0.1;
            sprite.y = Core.instance.height /2;
            view.addChild(sprite);
            sprite.addEventListener('enterframe', function(){
                if(game.input.up){
                    this.y-=8;
                }else if(game.input.down){
                    this.y+=8;
                }
                if(this.age % 10 == 0){
                    var b = new Sprite(16,16);
                    b.image = game.assets['icon0.png'];b.frame = 16;
                    b.x = sprite.x;b.y = sprite.y;
                    view.addChild(b);
                    b.onenterframe = function(){this.x+=15;if(this.x>enchant.Core.instance.width){view.removeChild(this)}}

                }
            });
            return view;
        })());
    	slides.push(new ItemSlide('今後の予定', ['3D対応しない(Frame使って下さい)', '数式、グラフ表示(自分が本当に必要だった機能)','', 'あとは使うとき作る']));
    	slides.push(new TitleSlide('おわり'));
	    game.pushScene(slides[0]);
    };
    game.start();
    
    document.body.addEventListener('mousedown', function(){
    	game.next();
    });
};


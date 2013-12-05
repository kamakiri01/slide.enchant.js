/**
 * @fileOverview slide.encahant.js
 * @version 0.3.0
 * @require enchant.js v0.6.3+
 * @author kamakiri01
 *
 * @description
 * Library for making slide-view in enchant.js.
*/

/**
 * スライドオブジェクト
*/
var SLIDE = {};
//デフォルト設定
SLIDE.SLIDE_BACKGROUNDCOLOR = '#f0f0f0'; //背景色
SLIDE.SLIDE_SPEED = 10; //ページめくり速度
SLIDE.SLIDE_TYPE = enchant.Easing.QUAD_EASEINOUT; //ページめくりのタイプ
SLIDE.SLIDE_FRAMELATE = 20; //全体のフレームレート
SLIDE.slideIndex = 0; //表示中のスライド番号
SLIDE.slides = []; //スライドを格納する配列
SLIDE.currentBindView = null; //作成中のスライドへのエイリアス

/**
 * スライドのプリミティブクラス
*/
SLIDE.Slide = enchant.Class.create(enchant.CanvasScene, {
	initialize:function(){
		enchant.CanvasScene.call(this);
        this.backgroundColor = SLIDE.SLIDE_BACKGROUNDCOLOR;
        this.layoutIndex = [];
	}
});

/**
 * スライドのプリミティブクラス
*/
SLIDE.DSlide = enchant.Class.create(enchant.DOMScene, {
	initialize:function(){
		enchant.DOMScene.call(this);
        this.backgroundColor = SLIDE.SLIDE_BACKGROUNDCOLOR;
        this.layoutIndex = [];
	}
});

/**
 * トップページ風レイアウトのスライドクラス
 * @param {String} title スライド中央の文言
 * @param {String} subtitle title下の文言
 * @param {Number} scale 文字の大きさ（任意）
 *
*/
SLIDE.TitleSlide = enchant.Class.create(SLIDE.Slide, {
	initialize:function(title, subtitle, scale){
		SLIDE.Slide.call(this);
        var _scaleNum = scale,
            _subtitleText = subtitle;
        if(_scaleNum === undefined){
            _scaleNum = 1;
        }
		if(_subtitleText === undefined) {
            _subtitleText = '';
        }
        this._title = SLIDE.createLabel(64 * _scaleNum, title);
		this.addChild(this._title);
        //折り返す文量の場合は左寄せする、それ以外は中央寄せ
        if(this._title.getMetrics(title).width < enchant.Core.instance.width){
            this._title.x = enchant.Core.instance.width/2 - this._title._boundWidth/2;
        }else{
            this._title.x = 10;
        }
		this._title.y = (enchant.Core.instance.height) / 2;
        this._title.width = enchant.Core.instance.width * 0.8;

		this._subtitle = SLIDE.createLabel(32 * _scaleNum, _subtitleText);
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
 * @param {String} title スライド上段の文言
 * @param {String[]} items 列挙される文言の配列
 * @param {Number} scale  文字の大きさ（任意）
*/
SLIDE.ItemSlide = enchant.Class.create(SLIDE.Slide, {
	initialize:function(title, items, scale){
		SLIDE.Slide.call(this);
        var _scaleNum = scale;
        if(_scaleNum === undefined){
            _scaleNum = 1;
        }
		this._title = SLIDE.createLabel(48 * _scaleNum, title);
		this.addChild(this._title);
        if(this._title.getMetrics(title).width < enchant.Core.instance.width){
            this._title.x = enchant.Core.instance.width/2 - this._title._boundWidth/2;
        }else{
            this._title.x = 10;
        }
		this._title.y = enchant.Core.instance.height * 0.05;
		this._items = [];
        if(items !== undefined){
            for(var i = 0; i < items.length; i++){
                var item = SLIDE.createLabel(32 * _scaleNum, '' + items[i]);
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
*/
/*
window.addEventListener('message', function (e, origin) {
    try {
        var jdata = eval(e.data);
        if (jdata.act == 'keydown') {
            enchant.Game.instance.dispatchEvent('keydown');
            var button = enchant.Game.instance._keybind[jdata.value];
            var evt = new enchant.Event(button + 'buttondown');
            enchant.Game.instance.dispatchEvent(evt);
        } else if (jdata.act == 'keyup') {
            enchant.Game.instance.dispatchEvent('keyup');
            var button = enchant.Game.instance._keybind[jdata.value];
            var evt = new enchant.Event(button + 'buttonup');
            enchant.Game.instance.dispatchEvent(evt);
        }
    } catch (e) {
        console.log('bad call: ' + e);
    }
});
*/

/*
 * frameを表示するスライドクラス
 * @param {String} url フレーム内ページのURL
 * @param {Number} width フレーム横サイズ
 * @param {Number} height フレーム縦サイズ
 */
SLIDE.FrameSlide = enchant.Class.create(SLIDE.DSlide, {
	initialize:function(url, width, height){
		DSlide.call(this);
		width = width;// | enchant.Core.instance.width;
		height = height;// | enchant.Core.instance.height;
		var sprite = new Sprite(width, height);
        sprite._element = document.createElement('div');
        //フレームDOMの作成
		var iframe = document.createElement('iframe');
		iframe.setAttribute('src', url);
		iframe.setAttribute('width', width + 'px');
		iframe.setAttribute('height', height + 'px');
        iframe.setAttribute('text-align', 'center');
        iframe.setAttribute('align', 'center');
		this._frame = iframe;
		sprite._element.appendChild(iframe);
        //シーン開始時にフレームを読み込む
		this.addEventListener('enter', function(){
			this.addChild(sprite);
		});
        //シーンを離れたらフレームを終了する
		this.addEventListener('transitionexit', function(){
            this.removeKeyEvent();
		});
	},
/*
    //フレーム内にキーイベントを送る
    addKeyEvent:function(){
        this._onkeydown = function(e){
            console.log(this.onkeydown._target.getAttribute('src'));
            var frame = this.onkeydown._target;
            frame.contentWindow.postMessage('({value : '+e.keyCode+', type: 'event', act: 'keydown'})','*');
        };
        window.onkeydown = this._onkeydown;
        window.onkeydown._target = this._frame;

        this._onkeyup = function(e){
            var frame = this.onkeydown._target;
            frame.contentWindow.postMessage('({value : '+e.keyCode+', type: 'event', act: 'keyup'})', '*');
        }
        window.onkeyup = this._onkeyup;
    },
    removeKeyEvent:function(){
    },
	eval:function(javascript){
		this._frame.contentWindow.eval(javascript);
	},
    messageListener:'javascript:console.log('messageListenerOnload'+ enchant.Core.instance.width);window.addEventListener('message', function (e, origin) { console.log('keydown');try {var jdata = eval(e.data);if (jdata.act == 'keydown') {enchant.Game.instance.dispatchEvent('keydown'); var button = enchant.Game.instance._keybind[jdata.value];var evt = new enchant.Event(button + 'buttondown');enchant.Game.instance.dispatchEvent(evt);} else if (jdata.act == 'keyup') {enchant.Game.instance.dispatchEvent('keyup');var button = enchant.Game.instance._keybind[jdata.value];var evt = new enchant.Event(button + 'buttonup');enchant.Game.instance.dispatchEvent(evt);}} catch (e) {console.log('bad call: ' + e);}});"

*/
})

/**
 * 画像を表示するスライドクラス
 * @param {String} image スライド中央に表示する画像のassets名
 * @param {String} title スライド上段の文言
*/
SLIDE.ImageSlide = enchant.Class.create(SLIDE.Slide, {
	initialize:function(image, title){
		SLIDE.Slide.call(this);

        if(title !== undefined){
            this._title = SLIDE.createLabel(48, title);
            this.addChild(this._title);
            this._title.x = 
                enchant.Core.instance.width/2 - this._title._boundWidth/2;
            this._title.y = enchant.Core.instance.height * 0.05;
        }
		var sprite = new Sprite(enchant.Core.instance.assets[image].width, 
            enchant.Core.instance.assets[image].height);
		sprite.image = enchant.Core.instance.assets[image];
        sprite.x = enchant.Core.instance.width/2 - sprite.width /2;
        sprite.y = this._title._boundHeight *1.5;
		this.addChild(sprite);
    },
});

/*
 * --------------------------------------------------------------
 *  メソッド
 * --------------------------------------------------------------
 */
/*
 * スライド操作系メソッド
 */

/**
 * 表示中のスライドを1つ戻す
*/
enchant.Core.prototype.prev = function(){
    SLIDE.showPrevSlide();
};
SLIDE.showPrevSlide = function(){
    if(SLIDE.slideIndex > 0){
        SLIDE.slideIndex -= 1;
        var s = SLIDE.slides[SLIDE.slideIndex];
        if(typeof s == 'function'){
            //関数の場合戻りではスライドが出るまで再帰して飛ばす
            enchant.Core.instance.prev();
        }else{
            Core.instance.currentScene.tl.moveTo(Core.instance.width, 0, SLIDE.SLIDE_SPEED, SLIDE.SLIDE_TYPE).then(function(){
                s = SLIDE.slides[SLIDE.slideIndex];//連打対策としてpushのタイミングで挿入を期待される番号のスライドを再取得
                Core.instance.popScene();
                s.x = - Core.instance.width;
                Core.instance.pushScene(s);
                s.tl.moveTo(0, 0, SLIDE.SLIDE_SPEED, SLIDE.SLIDE_TYPE);
            });
        }
        console.log('SLIDE.slideindex:' + SLIDE.slideIndex);
        return true;
    }
    return false;
};

/**
 * 表示中のスライドを1つ進める
*/
enchant.Core.prototype.next = function(){
    SLIDE.showNextSlide(); 
};
SLIDE.showNextSlide = function(){
    if(SLIDE.slideIndex + 1 < SLIDE.slides.length){
        SLIDE.slideIndex++;
        var s = SLIDE.slides[SLIDE.slideIndex];
        if(typeof s == 'function'){
            s(Core.instance.currentScene);
        }else{
            Core.instance.currentScene.tl.moveTo(- Core.instance.width, 0, SLIDE.SLIDE_SPEED, SLIDE.SLIDE_TYPE).then(function(){
                s = SLIDE.slides[SLIDE.slideIndex];
                Core.instance.popScene();
                s.x = Core.instance.width;
                Core.instance.pushScene(s);
                s.tl.moveTo(0, 0, SLIDE.SLIDE_SPEED, SLIDE.SLIDE_TYPE);
            });
        }
        console.log('SLIDE.slideIndex:' + SLIDE.slideIndex);
        return true;
    }
    console.log('SLIDE.slideIndex:' + SLIDE.slideIndex);
    return false;
};

/*
 * UIイベントをcoreインスタンスに付与する
 * enchant.Core.instanceで同等動作が行えるので引数は不要になるかもしれない
 * @param {enchant.Core} core Coreインスタンス
 * @param {String} bg 背景色、または背景画像の指定
 * @param {Number} transitionSpeed スライドの遷移速度
 * @param {String} transitonType 遷移の挙動を指定
*/
SLIDE.slideSetup = function(setConf){
    if(setConf.bg === undefined){
        SLIDE.SLIDE_BACKGROUNDCOLOR = '#f0f0f0';
    }else{
        if(setConf.bg[0] === '#'){
            SLIDE.SLIDE_BACKGROUNDCOLOR = setConf.bg;
        }else{
            SLIDE.SLIDE_BACKGRONDIMAGE = setConf.bg;
        }
    }
    if(setConf.transitionSpeed === undefined){
        SLIDE.SLIDE_SPEED = 10;
    }else{
        SLIDE.SLIDE_SPEED = setConf.transitionSpeed;
    }
    if(setConf.transitonType === undefined){
        SLIDE.SLIDE_TYPE = enchant.Easing.QUAD_EASEINOUT;
    }else{
        SLIDE.SLIDE_TYPE = setConf.transitonType;
    }
    enchant.Core.instance.addEventListener('rightbuttondown', function(){
        this.next();
    });
    enchant.Core.instance.addEventListener('leftbuttondown', function(){
        this.prev();
    });
    document.body.addEventListener('mousedown', function(){
        enchant.Core.instance.next();
    });
};

/*
 * スライドレイアウト系メソッド
 */
/*
 * 編集中のスライドを指定する
 * レイアウト用ラッパーメソッドが参照する
 * @param {SLIDE.Slide} view レイアウト関数が参照するviewｗを指定
 */
SLIDE.bindView = function(view){
    SLIDE.currentBindView = view;
};

/*
 * Entityのセンタリングを行う。オプションで調整値を適用
 * @param {enchant.Entity} entity 座標補正するEntity
 * @param {Number} ax 横方向の補正値（任意）
 */
SLIDE.aligned_center = function(entity, ax){
    var x = 0;
    if(ax !== undefined){
        x += ax;
    }
    if(entity._boundWidth !== undefined){
        var entityBoundWidth = entity._boundWidth;
        entity.addEventListener('enterframe', function(){
            entity.x = enchant.Core.instance.width/2 - entityBoundWidth/2 + x;
            this.removeEventListener('enterframe', arguments.callee);
        });
    }else{
        //LazySprite対応
        entity.addEventListener('enterframe', function(){
            this.x = enchant.Core.instance.width/2 -this._width/2 + x;
            this.removeEventListener('enterframe', arguments.callee);
        });
    }
};

/*
 * Entityの左寄せを行う。オプションで調整値を適用
 * @param {enchant.Entity} entity 座標補正するEntity
 * @param {Number} ax 横方向の補正値（任意）
 */
SLIDE.aligned_left = function(entity, ax){
    var x = 0;
    if(ax !== undefined){
        x += ax;
    }
    entity.addEventListener('enterframe', function(){
        this.x =  5 + x;
        this.removeEventListener('enterframe', arguments.callee);
    });
};

/*
 * Entityの右寄せを行う。オプションで調整値を適用
 * @param {enchant.Entity} entity 座標補正するEntity
 * @param {Number} ax 横方向の補正値（任意）
 */
SLIDE.aligned_right = function(entity, ax){
    var x = 0;
    if(ax !== undefined){
        x += ax;
    }
    if(entity._boundWidth !== undefined){
        var entityBoundWidth = entity._boundWidth;
        entity.addEventListener('enterframe', function(){
            entity.x = enchant.Core.instance.width - entity._boundWidth - x;
            this.removeEventListener('enterframe', arguments.callee);
        });
    }else{
        //LazySprite対応
        entity.addEventListener('enterframe', function(){
            this.x = enchant.Core.instance.width - this._width + x;
            this.removeEventListener('enterframe', arguments.callee);
        });
    }
};

/*
 * alignに従って座標を付与
 * @param {enchant.Entity} entity 座標補正するEntity
 * param {String} align 寄せる方向
 */
SLIDE.aligner = function(entity, align){
    switch(align){
        case 'left':
            SLIDE.aligned_left(entity);
            break;
        case 'right':
            SLIDE.aligned_right(entity);
            break;
        default:
            SLIDE.aligned_center(entity);
            break;
    }
};

/*
 * 上から順に重複を避けてスプライトを配置
 * view.layoutIndexにリニア配置要素を登録する
 */
SLIDE.linearLayoutAdder = function(sprite, view){
    var index = view.layoutIndex;
    if(index.length === 0){
        if(view._title){
            sprite.y = view._title.y + view._title._boundHeight * 1.5;
        }else{
            sprite.y = enchant.Core.instance.height * 0.05;
        }
    }else{
        var h = index.length;
        var hsum = index[h-1].y + index[h-1]._boundHeight;
        var margin = 5;
        if(sprite._textSize>0){
            margin = sprite._textSize/10;
        }
        sprite.y = hsum + margin;//default margin
    }
    view.addChild(sprite);
    view.layoutIndex.push(sprite);
};

/*
 * スプライト生成系メソッド
 */

/**
 * ラベル生成メソッド
 * @param {Number} size 文字サイズ
 * @param {text} text 文言の内容
 * @param {String} color 文字色(任意）
*/
SLIDE.createLabel = function(size, text, color){
	var label = new Label();
	label.width = enchant.Core.instance.width * 0.9;    //ラベルの描画幅を折り返してもはみ出さない範囲で最大化
	label.font = size + 'px bold sans';
    label._textSize = size;
    label.text = text;
    if(color !== undefined){
        label.color = color;
    }
	return label;
};

/**
 * 数式スプライト生成メソッド(ネットワーク接続必須)
 * エスケープ文字を含んだTeX形式の数式スプライトを生成する
 * @param {String} latex Tex記法の数式
 * @param {Number} size 文字サイズ（任意）
 * @param {String} color 文字食（任意）
 * 
 * @example
 * "E=\\pm\\frac{m}{\\sqrt{1-\\frac{v^2}{c^2}}}c^2"
*/
SLIDE.createFormula = function(latex, size, color){
    var _size, _color;

    if(size !== undefined){
        _size = size;
    }else{
        _size = 40;
    }
    if(color !== undefined){
        _color = color;
    }else{
        _color = '000000ff';
    }
    var googleAPICode = 
        'http://chart.apis.google.com/chart?cht=tx&chf=bg,s,ffffff00' +
        '&chco=' + _color +
        '&chs=' + _size +
        '&chl=' + encodeURIComponent(latex);
    var img = document.createElement('img');
    img.src = googleAPICode;
    var sprite = new SLIDE.LazySprite(img);
    return sprite;
};

/*
 * 外部ファイル等読み込み時間を要する画像を非同期読み込みして
 * スプライトに利用する
 * @param {String}
 * */
SLIDE.LazySprite = enchant.Class.create(enchant.Sprite, {
    initialize:function(img){
        enchant.Sprite.call(this, 1, 1);
        this._sImg = img;
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
            this.parent.addEventListener('enterframe', function(){
            });
        };
    }
});

/*
 * 文字列を生成して配置する。
 * createLabelとlinearLayoutAdderのラッパー
 * @param {String} str 挿入する文言
 * @param {Number} size 文字サイズ
 * @param {String} align レイアウト補正（任意）
 */
SLIDE.addParagraph = function(str, size, align){
    if(SLIDE.currentBindView === null){
        throw new Error('view is not bound.');
    }
    var p = SLIDE.createLabel(size, str);
    SLIDE.aligner(p, align);
    SLIDE.linearLayoutAdder(p, SLIDE.currentBindView);
};

/*
 * 画像を生成して配置する。事前にpreloadが必要
 * new Sprite()とlinearLayoutAdderのラッパー
 * @param {String} assetName 挿入する画像名
 * @param {String} align レイアウト補正（任意）
 */
SLIDE.addNewImage = function(assetName, align){
    if(SLIDE.currentBindView === null){
        throw new Error('view is not bound.');
    }
    var s = new Sprite(enchant.Core.instance.assets[image].width, 
            enchant.Core.instance.assets[image].height);
    s.image = enchant.Core.instance.assets[image];
    SLIDE.aligner(s, align);
    SLIDE.linearLayoutAdder(s, SLIDE.currentBindView);
};

SLIDE.addNewLazyImage = function(url, align){};


/*
 * 互換性エイリアス
 */
var Slide = SLIDE.Slide;
var DSlide = SLIDE.DSlide;
var TitleSlide = SLIDE.TitleSlide;
var ItemSlide = SLIDE.ItemSlide;
var FrameSlide = SLIDE.FrameSlide;
var ImageSlide = SLIDE.ImageSlide;


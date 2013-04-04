
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
    	slides.push(new TitleSlide('slide.enchant.js', 'v0.6.3対応<br>with enchant.js'));

        
        slides.push(new TitleSlide('enchant.jsでプレゼンツールを作りました。'));
    	slides.push(new TitleSlide('kondoさんに感謝', '元はkondoさん作'));
    	slides.push(new ItemSlide('こんなレイアウトができます', ['TitleSlide','ItemSlide', 'FrameSlide', 'ImageSlide', 'etc...']));
    	slides.push(new TitleSlide('TitleSlide', '表紙向けレイアウト'));
    	slides.push(new TitleSlide('タイトル', 'サブタイトル<br>サブタイトル2'));
    	slides.push(new TitleSlide('ItemSlide', '列挙レイアウト'));
    	slides.push(new ItemSlide('タイトル', ['要素１', '要素２', '要素３']));
    	slides.push(new ItemSlide('要素が多い場合', ['要素１', '要素２', '要素３', '要素４', '要素５', '要素６', '要素７', '要素８']));
        slides.push(new ItemSlide('吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。'));
        slides.push(new ItemSlide('羅生門', ['ある日の暮方の事である。一人の下人が、羅生門の下で雨やみを待っていた。広い門の下には、この男のほかに誰もいない。ただ、所々丹塗の剥はげた、大きな円柱に、蟋蟀が一匹とまっている。羅生門が、朱雀大路にある以上は、この男のほかにも、雨やみをする市女笠や揉烏帽子が、もう二三人はありそうなものである。それが、この男のほかには誰もいない。']));
    	slides.push(new TitleSlide('FrameSlide',['iframe埋め込み']));
    	slides.push(new FrameSlide('http://r.jsgames.jp/games/2620/', 320,320));
    	slides.push(new TitleSlide('ImageSlide'));
    	slides.push(new ImageSlide("13A.jpg", 'ローカルの画像を表示'));
    	slides.push(new TitleSlide('便利な機能'));
        slides.push((function(scene){
            var view = new ItemSlide("TeX記述で数式を生成",['googleChartAPIを利用(ネット必須)<br>'+
                'ローカル完結したいときは普通にスプライトを使う']);
            var f = createFormula("E=\\pm\\frac{m}{\\sqrt{1-\\frac{v^2}{c^2}}}c^2", 160);
            f.x = 250;
            f.y = 300;
            f.scaleX=1;
            f.scaleY=1;
            view.addChild(f);
         
            return view;
        })());
        slides.push((function(){
        
            var slide = new ItemSlide('配列からグラフ生成',['jqplotを利用(ローカルでもOK)']);
            var graphData = [
                 [3,7,9,1,4,6,8,2,5],
                 [4,8,6,3,6,3,5,7,9]];
 
            var cs = createPlot(graphData,  {title: 'グラフ'});
            cs.x = 5;
            cs.y = 5;
            centering(cs, 0, 60);
            slide.addChild(cs);

            return slide;
        })());
    	slides.push(new TitleSlide('ゲームエンジン<br>だからできること'));
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
    	slides.push(new ItemSlide('今後の予定', ['3D対応しない(Frame使って下さい)', '数式(対応)、グラフ表示(自分が本当に必要だった機能)<br>→jqplotに対応','', 'あとは使うとき作る']));
    	slides.push(new TitleSlide('おわり'));
	    game.pushScene(slides[0]);
    };
    game.start();
    
    document.body.addEventListener('mousedown', function(){
    	enchant.Core.instance.next();
    });
};


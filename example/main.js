//サンプル
var DIR_STR = './sampleImages/';
var IMAGE_BEAR = DIR_STR + 'chara1.png';
var IMAGE_ICON = DIR_STR + 'icon0.png';
var IMAGE_13 = DIR_STR + '13A.jpg';

enchant();
window.onload = function(){
    var core = new Core(640, 480);
    core.fps = 20;
    core.preload(IMAGE_BEAR, IMAGE_ICON, IMAGE_13);
    SLIDE.slideSetup({
        'core': core,
        'bg': '#f0f0f0',
        'transitionSpeed': 10,
        'transitonType': enchant.Easing.QUAD_EASEINOUT
        });
    core.onload = function(){
        var slides = SLIDE.slides;
        slides.push(new TitleSlide('slide.enchant.js','for v0.6.3 later<br>with enchant.js'));
        slides.push(new TitleSlide('enchant.jsで<br>プレゼンツール。'));
        slides.push(new ItemSlide('こんなレイアウトができます', ['TitleSlide','ItemSlide', 'FrameSlide', 'ImageSlide', 'etc...']));
        slides.push(new TitleSlide('TitleSlide', '表紙向けレイアウト'));
        slides.push(new TitleSlide('タイトル', 'サブタイトル<br>サブタイトル2'));
        slides.push(new TitleSlide('ItemSlide', '列挙レイアウト'));
        slides.push(new ItemSlide('タイトル', ['要素１', '要素２', '要素３']));
        slides.push(new ItemSlide('要素が多い場合', ['要素１', '要素２', '要素３', '要素４', '要素５', '要素６', '要素７', '要素８']));
        slides.push(new ItemSlide('吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。'));
        slides.push(new ItemSlide('羅生門', ['ある日の暮方の事である。一人の下人が、羅生門の下で雨やみを待っていた。広い門の下には、この男のほかに誰もいない。ただ、所々丹塗の剥はげた、大きな円柱に、蟋蟀が一匹とまっている。羅生門が、朱雀大路にある以上は、この男のほかにも、雨やみをする市女笠や揉烏帽子が、もう二三人はありそうなものである。それが、この男のほかには誰もいない。']));
        slides.push(new TitleSlide('ImageSlide'));
        slides.push(new ImageSlide(IMAGE_13, 'ローカルの画像を表示'));
        slides.push(new TitleSlide('FrameSlide',['iframe埋め込み']));
        slides.push(new FrameSlide('./index.html', 320,480));
        slides.push(new TitleSlide('便利な機能 <br>extension.<br>slide.enchant.js'));
        slides.push((function(){
            var view = new ItemSlide('TeX記述で数式を生成',[]);
            SLIDE.bindView(view);
            SLIDE.addParagraph('googleChartAPIを利用(ネット必須)' +
                '<br>ローカル完結したいときは普通にスプライトを使う', 30);
            var f = createFormula('E=\\pm\\frac{m}{\\sqrt{1-\\frac{v^2}{c^2}}}c^2', 160, 'center');
            SLIDE.linearLayoutAdder(f, view);
            SLIDE.aligned_center(f);
            console.log(f);
            f.y = 250;
            return view;
        })());
        slides.push(new TitleSlide('ゲームエンジン<br>だからできること'));
        slides.push(new TitleSlide('スライドにenchant.jsの処理を付加'));
        slides.push((function(scene){
            var game = enchant.Core.instance;
            for(var i = 0; i < 20; i++){
                var sprite = new Sprite(32, 32);
                sprite.image = game.assets[IMAGE_BEAR];
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
                scene.addChild(sprite);
            }
        }));
        slides.push((function(){
            var view = new ItemSlide('レイアウト自由度',
                ['テンプレートに上書も自由' ,
                'レイアウトの自動調整もできる',
                '拡張性:たぶんある']);
            SLIDE.bindView(view);
            for(var i=0;i<8;i++){
                SLIDE.addParagraph('test'+ (i+1), 50-i*5, 'right');
            }
            return view;
        })());
        slides.push(new SLIDE.TitleSlide('おわり'));

        core.pushScene(slides[0]);
    };
    core.start();
};


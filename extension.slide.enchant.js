/*
 * Current this func,
 * if using in hosting, this func will burn.
 * use direct filesystem.
 */


/*
 * privent div #id confricting 
 * for createPlot.
 */
SLIDE.counter = function(){
    var i = 0;
    return function() {
        i = i + 1;
        return i;
    };
}
var chartNum = SLIDE.counter();        
function createPlot(plotarray, options){
    /*
     * plotting div must be "appendChild" 
     * because of jqplotToImageStr and jqplotToImageElem call "offset()".
     * 
     */
    var plot = document.createElement('div');
    var num = chartNum();
    plot.setAttribute('id', 'chart' + num);
    document.getElementById('enchant-stage').appendChild(plot);

    var plotdata = $('#chart'+num).jqplot('chart'+num, plotarray, options);
    /*
     *same this method.
     *
     var imgData = $('#chart').jqplotToImageStr({});
     var img = document.createElement('img');
     img.src = imgData;
     */
    var imgElement = $('#chart' + num).jqplotToImageElem();
    var spr = new LazySprite(imgElement);
    $('#chart' + num).hide();
    return spr;
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
}

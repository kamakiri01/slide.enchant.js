/*
 * Current this func,
 * if using in hosting, this func will burn.
 * use direct filesystem.
 */

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

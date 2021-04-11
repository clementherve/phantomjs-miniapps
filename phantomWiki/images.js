const page = require('webpage').create();
const system = require('system');
const fs = require("fs");

const url = system.args[1];
const fname = system.args[2];


page.settings.userAgent = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36";

page.open(url);

page.onLoadFinished = function(e) {

    page.includeJs('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',function() {

        var images = page.evaluate(function() {
            var images = [];
            function getImgDimensions($i) {
                return {
                    top : $i.offset().top,
                    left : $i.offset().left,
                    width : $i.width(),
                    height : $i.height()
                }
            }
            $('img').each(function() {
                var img = getImgDimensions($(this));
                images.push(img);
            });

            return images;
        });

        images.forEach(function(imageObj, index, array){
            page.clipRect = imageObj;
            page.render(fname + '/' + index + '.png')
        });

        phantom.exit();
    });    
};
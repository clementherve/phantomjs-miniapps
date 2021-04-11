const page = require('webpage').create();
const system = require('system');

const url = system.args[1];
const fname = system.args[2];

if (url == undefined || fname == undefined) {
	console.log("Usage: phantomjs url name");
	phantom.exit(1);
}

page.settings.userAgent = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36";

// changing virtual browser windows size
page.viewportSize = { width: 1920, height: 1080 };

// specifying the size of the screenshot (portion of the page)
page.clipRect = { top: 0, left: 0, width: 1920, height: 1080 };

page.open(url);

page.onLoadFinished = (e) => {
    window.setTimeout(function () {
        page.render("static/" + fname + ".png");
        phantom.exit();
    }, 200);
}



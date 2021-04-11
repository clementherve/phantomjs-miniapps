const page = require('webpage').create();
const sizeof = require('object-sizeof');
const fs = require('fs');
const system = require('system');


const url = system.args[1];
const fname = system.args[2];

if (url == undefined || fname == undefined) {
	console.log("Usage: phantomjs url name");
	phantom.exit(1);
}

const responses = {
	"siteurl": url,
	"loadtime": 0,
	"repaints": 0,
	"requests": 0,
	"contentweight": 0,
	"urls": [],
	"performance": null
}

function timing () {
	const pt = page.evaluate(function(){ return window.performance.timing; });
	const origin = pt.connectEnd;

	responses["performance"] = {
		"html": (pt.responseEnd - origin)/1000,
		"dom": (pt.domContentLoadedEventEnd - pt.domContentLoadedEventStart)/1000,
		"cssom": (pt.domContentLoadedEventEnd - pt.domLoading)/1000,
		"crp": (pt.domComplete - origin)/1000 // pt.domLoading
	}
}


page.clearMemoryCache()
page.settings.userAgent = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36";
page.viewportSize = { width: 1920, height: 1080 };

responses.loadtime = Date.now();
page.open(url);


page.onRepaintRequested = function() {
	responses.repaints++;
};


page.onResourceReceived = function(res) {
	
	if (res.bodySize != null) {
		responses.requests++;
		responses.urls.push({
			"url": res.url,
			"size": res.bodySize/1000	
		});
	}
	
};

page.onLoadFinished = function() {
	timing()
	responses.loadtime = (Date.now() - responses.loadtime)/1000;
	fs.write("static/" + fname + ".json", JSON.stringify(responses));
	phantom.exit();
}
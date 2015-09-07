var canvas = require('canvas');
var jsdom = require('jsdom');
var C2S = require('canvas2svg-conradirwin');
var loaderUtils = require('loader-utils');

module.exports = function (source) {
    "use strict";

    if (this.cacheable) {
        this.cacheable();
    }

    var query = loaderUtils.parseQuery(this.query);

    var width = query.width || 32,
        height = query.height || width,
        duration = query.duration || 166,
        interval = query.interval || 16.6,
        nFrames = Math.ceil(duration / interval);

    var document = jsdom.jsdom("<html>");
    var ctx = new C2S({
        width: (1 + nFrames) * width,
        height: height,
        document: document
    });

    var Func = this.exec(source);
    var icon = new Func(duration, width, height);
    var n = 0;

    while (n < nFrames) {
      icon.render(ctx, (n * interval));
      ctx.translate(width, 0);

      n += 1;
    }

    icon.render(ctx, duration);

    return "module.exports = " + JSON.stringify(ctx.getSvg().outerHTML) + ";";
};

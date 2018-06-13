var exports = module.exports = {};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

exports.generateApp = function(app, vars){
    console.log(vars)
    var app = JSON.stringify(app);
    console.log(typeof app);
    for (var i in vars){
        app = app.replaceAll("$"+i, vars[i]);
        console.log("$"+i, vars[i])
    }
    return JSON.parse(app);
};
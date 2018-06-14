var yaml = require('write-yaml');
var express = require('express');
var readYaml = require('js-yaml');
var exec = require('child_process').exec, child;
var fs = require('fs');
var functions = require('./functions.js');
var apps = {};
var server = express();
var compose = null;
var bodyParser = require('body-parser')
 

fs.readdirSync("./applications").forEach(file => {
  apps[file.replace(".json", "")] = require("./applications/"+file);
  console.log("Loaded "+ file)
})

var data = {};

try {
    data = require("./data.json");
} catch(err){
    console.log("Save not found, Creating");
    fs.writeFileSync('./data.json', JSON.stringify({}));
}

console.log(apps)

/*fs.readFile('./docker-compose.yml', "utf8", function (err, data) {
    if (err == "Error: ENOENT: no such file or directory, open './docker-compose.yml'"){
        console.log("Docker Compose not found, Creating");
        compose = {version: "3", services: {}};
        yaml('docker-compose.yml', compose, function(err) {
            if (err){throw err;}
        });
    }
    
});*/

try {

    var imported = fs.readFileSync('./docker-compose.yml', "utf8");
    compose = readYaml.safeLoad((imported));

} catch (err) {
    console.log(err);
    console.log("Docker Compose not found, Creating");
    compose = {
        version: "3",
        services: {}
    };
    yaml('docker-compose.yml', compose, function (err) {
        if (err) {
            throw err;
        }
    });
}


var launchApp = function(name, app, vars){
    data[name] = {app: app, vars: vars, date: Math.floor(Date.now() / 1000)};
    compose.services[name] = functions.generateApp(apps[app]["docker-compose"], vars);
    /*exec('docker-compose up -d '+name,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });*/
};

yaml('docker-compose.yml', compose, function(err) {
    if (err){throw err;}
});

fs.writeFileSync('./data.json', JSON.stringify(data));

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

server.use( bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

server.post('/api/create', function(req, res) {
    
    var newApp = JSON.parse(req.body.data);
    
    var newAppVars = JSON.parse(JSON.stringify(newApp));
    
    delete newAppVars.id;
    delete newAppVars.name;
    
    console.log(newApp);
    
    launchApp(newApp.name, newApp.id, newAppVars);
    res.send(newApp.name+" "+ newApp.id)
    
    yaml('docker-compose.yml', compose, function(err) {
        if (err){throw err;}
    });
    
    fs.writeFileSync('./data.json', JSON.stringify(data));
});

server.get("/api/apps.json", function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(apps));
});

server.use('/', express.static('serve'))

server.listen(8080, function(){
    console.log("Server Started");
});

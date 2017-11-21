/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

// Authentication module.
var auth = require('http-auth');
var basic = auth.basic({
	realm: "auth-db",
	file: __dirname + "/public/data/passwords"
});

var app = express();

var db;

var Cloudant;
var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'projects_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}

function initDBConnection() {

    console.log("db:"+db);

    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
    }

    console.log("db:"+db);

    Cloudant = require('cloudant');
    cloudant = Cloudant(dbCredentials.url);
  
    console.log("db:"+db);

    // check if DB exists if not create

    console.log("db:"+db);
    console.log(db);
    
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();

app.get('/aboutus', routes.aboutus);
app.get('/convinced', routes.convinced);
app.get('/process', routes.process);
app.get('/references', routes.references);
app.get('/welcome', routes.welcome);
app.get('/index', routes.index);

function sanitizeInput(str) {
    return String(str).replace(/&(?!amp;|lt;|gt;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


app.use(auth.connect(basic));
app.get('/arcsdb', routes.arcsdb);

//animals routes

app.post('/api/arcs_projects_db', function(request, response) {
    
    console.log("Adding a project...");

    var id;
    var name = request.body.name;
    var valueAnimal = request.body.valueAnimal;
    var valueLegs = request.body.valueLegs;

    console.log(request.body.name);
    console.log(request.user);

    if (id === undefined) {
        // Generated random id
        id = '';
    }
    
    db.insert({
        name: name,
        valueAnimal: valueAnimal,
        valueLegs: valueLegs,
            }, id, function(err, doc) {
        if (err) {
            console.log(err);
            response.sendStatus(500);
        } else
            response.sendStatus(200);
            response.end();
    });    
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
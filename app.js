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
    //project information
    var p_name = request.body.p_name;
    var p_category = request.body.p_category;
    var p_start = request.body.p_start;
    var p_end = request.body.p_end;
    //customer information
    var c_name = request.body.c_name;
    var c_industry = request.body.c_industry;
    var c_adr1 = request.body.c_adr1;
    var c_adr2 = request.body.c_adr2;
    var c_city = request.body.c_city;
    var c_zip = request.body.input-c_zip;
    var c_state = request.body.c_state;
    var c_country = request.body.c_country;
    var c_lat = request.body.c_lat;
    var c_lng = request.body.c_lng;
    //utilities (used programs) information
    var u_all = request.body.u_all;
    //(customer) satisfaction information and additional comments
    var s_stars = request.body.s_stars;
    var s_comments = request.body.s_comments;

    console.log(request.body.name);
    console.log(request.user);

    if (id === undefined) {
        // Generated random id
        id = '';
    }
    
    db.insert({
        name: name,
        //project information
        p_name: p_name,
        p_category: p_category,
        p_start: p_start,
        p_end: p_end,
        //customer information
        c_name: c_name,
        c_industry: c_industry,
        c_adr1: c_adr1,
        c_adr2: c_adr2,
        c_city: c_city,
        c_zip: c_zip,
        c_state: c_state,
        c_country: c_country,
        c_lat: c_lat,
        c_lng: c_lng,
        //utilities (used programs) information
        u_all: u_all,
        //(customer) satisfaction information and additional comments
        s_stars: s_stars,
        s_comments: s_comments,
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
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

function createResponseData(
    id, 
    name, 
    //project information
    p_name,
    p_category,
    p_startm,
    p_starty,
    p_endm,
    p_endy,
    p_desc,
    //customer information
    c_name,
    c_industry,
    c_adr1,
    c_adr2,
    c_city,
    c_zip,
    c_state,
    c_country,
    //utilities (used programs) information
    u_all,
    //(customer) satisfaction information and additional comments
    s_stars,
    s_comments) {
 
    var responseData = {
        id: id,
        name: sanitizeInput(name),
        p_name: sanitizeInput(p_name),
        p_category: sanitizeInput(p_category),
        p_startm: sanitizeInput(p_startm),
        p_starty: sanitizeInput(p_starty),
        p_endm: sanitizeInput(p_endm),
        p_endy: sanitizeInput(p_endy),
        p_desc: sanitizeInput(p_desc),
        //customer information
        c_name: sanitizeInput(c_name),
        c_industry: sanitizeInput(c_industry),
        c_adr1: sanitizeInput(c_adr1),
        c_adr2: sanitizeInput(c_adr2),
        c_city: sanitizeInput(c_city),
        c_zip: sanitizeInput(c_zip),
        c_state: sanitizeInput(c_state),
        c_country: sanitizeInput(c_country),
        //utilities (used programs) information
        u_all: sanitizeInput(u_all),
        //(customer) satisfaction information and additional comments
        s_stars: sanitizeInput(s_stars),
        s_comments: sanitizeInput(s_comments)
    };

    return responseData;
}



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
    var p_startm = request.body.p_startm;
    var p_starty = request.body.p_starty;
    var p_endm = request.body.p_endm;
    var p_endy = request.body.p_endy;
    var p_desc = request.body.p_desc;
    //customer information
    var c_name = request.body.c_name;
    var c_industry = request.body.c_industry;
    var c_adr1 = request.body.c_adr1;
    var c_adr2 = request.body.c_adr2;
    var c_city = request.body.c_city;
    var c_zip = request.body.c_zip;
    var c_state = request.body.c_state;
    var c_country = request.body.c_country;
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
        p_startm: p_startm,
        p_starty: p_starty,
        p_endm: p_endm,
        p_endy: p_endy,
        p_desc: p_desc,
        //customer information
        c_name: c_name,
        c_industry: c_industry,
        c_adr1: c_adr1,
        c_adr2: c_adr2,
        c_city: c_city,
        c_zip: c_zip,
        c_state: c_state,
        c_country: c_country,
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


app.get('/api/arcs_projects_db', function(request, response) {
        
    console.log("get projects");
   
    var projectList = [];
    var i = 0;
    db.list(function(err, body) {
        if (!err) {
            var len = body.rows.length;
            console.log('total # of project -> ' + len);
            if (len == 0) {
                // push sample data
                // save doc
                var docName = 'simple_doc';
                var docDesc = 'A simple Document';
                db.insert({
                    name: docName,
                    value: 'A sample Document'
                }, '', function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Document : ' + JSON.stringify(doc));
                        var responseData = createResponseData(
                            doc.id,
                            docName,
                            docDesc, []);
                        projectList.push(responseData);
                        response.write(JSON.stringify(projectList));
                        console.log(JSON.stringify(projectList));
                        console.log('ending response...');
                        response.end();
                    }
                    });
            } else {
                body.rows.forEach(function(document) {
                    db.get(document.id, {
                        revs_info: true
                    }, function(err, doc) {
                        if (!err) {
                            var responseData = createResponseData(
                                            doc._id,
                                            doc.name,
                                            //project information
                                            doc.p_name,
                                            doc.p_category,
                                            doc.p_startm,
                                            doc.p_starty,
                                            doc.p_endm,
                                            doc.p_endy,
                                            doc.p_desc,
                                            //customer information
                                            doc.c_name,
                                            doc.c_industry,
                                            doc.c_adr1,
                                            doc.c_adr2,
                                            doc.c_city,
                                            doc.c_zip,
                                            doc.c_state,
                                            doc.c_country,
                                            //utilities (used programs) information
                                            doc.u_all,
                                            //(customer) satisfaction information and additional comments
                                            doc.s_stars,
                                            doc.s_comments
                                        );
                            projectList.push(responseData);
                            i++;
                            if (i >= len) {
                                response.write(JSON.stringify(projectList));
                                console.log('ending response...');
                                response.end();
                            }
                        } else {
                            console.log(err);
                        }
                    });
                });
            }
        } else {
            console.log(err);
        }
    });        
});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
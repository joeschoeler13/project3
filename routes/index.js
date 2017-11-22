
/*
 * Get all pages
 */

exports.aboutus = function(req, res){
  res.render('aboutus.html', { title: 'ARCSolutions - About Us' });
};

exports.convinced = function(req, res){
  res.render('convinced.html', { title: 'ARCSolutions - Contact Us' });
};

exports.index = function(req, res){
  res.render('index.html', { title: 'Cloudant Boiler Plate' });
};

exports.process = function(req, res){
  res.render('process.html', { title: 'ARCSolutions - A Project Process' });
};

exports.references = function(req, res){
  res.render('references.html', { title: 'ARCSolutions - Our References' });
};

exports.welcome = function(req, res){
  res.render('welcome.html', { title: 'ARCSolutions - Welcome' });
};

exports.arcsdb = function(req, res){
  var user = req.user;
  res.render('arcsdb.html', { u: user, title: 'Projects Database Backend' });
};
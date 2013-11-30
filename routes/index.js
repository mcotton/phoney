
/*
 * ROUTES
 */

var request = require('request');

 
//      GET /
exports.index = function(req, res){
  res.render('index', { user: req.user, title: 'Express' })
};

exports.gettingstarted = function(req, res){
  res.render('gettingstarted', { user: req.user, message: req.flash('error'), title: 'Express' })
};


exports.about = function(req, res){
  res.render('about', { user: req.user, title: 'Express' })
};


exports.contacts = function(req, res){
  res.render('contacts', { user: req.user, title: 'Express' })
};
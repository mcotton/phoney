
/*
 * ROUTES
 */

var request = require('request');

 
exports.bydate = function(req, res){
  var path = req.params.id || 'outbound-dial'
  res.render('phone/phone_backbone', { user: req.user, path: path, title: 'Express' })
};

exports.bycaller = function(req, res){
  res.render('phone/phone_calls_by_caller', { user: req.user, path: '', title: 'Express' })
};

exports.byreceiver = function(req, res){
  res.render('phone/phone_calls_by_receiver', { user: req.user, path: '', title: 'Express' })
};

exports.bydirection = function(req, res){
  res.render('phone/phone_calls_by_direction', { user: req.user, path: '', title: 'Express' })
};

exports.bystatus = function(req, res){
  res.render('phone/phone_calls_by_status', { user: req.user, path: '', title: 'Express' })
};

exports.search = function(req, res){
  res.render('phone/phone_caller_details', { user: req.user, path: '', title: 'Express' })
};

exports.callerdetail = function(req, res){
  res.render('phone/phone_caller_detail', { user: req.user, id: req.params.id, path: '', title: 'Express' })
};

exports.byareacode = function(req, res){
  res.render('phone/phone_calls_by_area_code', { user: req.user, path: '', title: 'Express' })
};

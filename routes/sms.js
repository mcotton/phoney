
/*
 * ROUTES
 */

var request = require('request');

 
exports.bydate = function(req, res){
  res.render('sms/sms_by_date', { user: req.user, title: 'Express' })
};

exports.bycaller = function(req, res){
  res.render('sms/sms_by_caller', { user: req.user, title: 'Express' })
};

exports.byreceiver = function(req, res){
  res.render('sms/sms_by_receiver', { user: req.user, title: 'Express' })
};

exports.search = function(req, res){
  res.render('sms/sms_search', { user: req.user, title: 'Express' })
};

exports.callerdetail = function(req, res){
  res.render('sms/sms_caller_detail', { user: req.user, id: req.params.id, title: 'Express' })
};

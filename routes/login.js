
/*
 * ROUTES
 */

var request = require('request');

// To make it nicer on my mac, 
// Check if growl is loaded or
// alias it to console.log
try { debug = require('growl') }
catch (e) { debug = console.log }

var config = require('../couchdb/config.js').config;
if(config) console.log('Found config module - routes/login.js');

var connection = require('nano')(config.connection_string);
var db = connection.use(config.database);



/*
 *      User Login/Logout authentication stuff
 */
 
//      GET /account
exports.account = function(req, res){
  res.render('account', { user: req.user });
};

//      GET /auth
exports.auth = function(req, res){
    if(!!req.param('AccountSid')) {
        debug('could not find req.params ', req.params)
        //res.redirect('/account');
        //res.render('account', { user: req.user });
    }

    debug('DEBUG: req.params = ', req.param('AccountSid'), req.param('state'));

    db.get(req.param('state'), function(err, data) {
        
        data.twilio_sid = req.param('AccountSid');
        data.twilio_auth = '8ca2e65eb343b274d912c241aeb98d55';
        data.twilio_version = '/2010-04-01';
        
        db.insert(data, data._id, function(err, doc)  {
            if (err)  console.log(err)
            if (!err) {
                debug(req.user.username + " updated at " + new Date());
                //res.redirect('/account');
                res.render('account', { user: req.user });
            }
        });
    });

};

//      GET /deauth
exports.deauth = function(req, res){
  res.render('deauth', { user: req.user });
};

//      GET /login
exports.login = function(req, res){
  res.render('login', { user: req.user, message: req.flash('error') });
};

//      POST /login
exports.post_login = function(req, res) {
    res.redirect('/');
    // Here is my jump in point to udate the user document with the successful login details
    debug(req.user.username + " logged in at " + new Date());
};

//      GET /logout
exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

//      POST /update
exports.update_account = function(req, res) {
    res.redirect('/account');
    // Here is my jump in point to udate the user document with the successful login details
    
    //console.log(req.body);
    
    db.get(req.user.id, function(err, data) {
        
        data.username = req.body.username;
        data.password = req.body.password;
        data.email = req.body.email;
        data.twilio_sid = req.body.twilio_sid;
        data.twilio_auth = req.body.twilio_auth;
        data.twilio_APIversion = req.body.twilio_version;
        
        db.insert(data, data._id, function(err, doc)  {
            if (err)  console.log(err)
            if (!err) debug(req.user.username + " updated at " + new Date());
        });
                
    });
    
};

//      POST /signup
exports.signup = function(req, res) {
    // Here is my jump in point to udate the user document with the successful login details
    
    //console.log(users)
    //console.log(users.indexOf(req.body.s_username))
    
    var list_of_users = []
    
    for (var i in users) {
      list_of_users.push(users[i].username)
      }

    //console.log(list_of_users)
    
    if(list_of_users.indexOf(req.body.s_username) > -1)  {
        debug('Failed creating username ' + req.body.s_username + ', name exists')
        req.flash('error', 'Pick another username, that is already taken')
        res.redirect('/gettingstarted');
        
    } else {
        
        res.redirect('/account');
                
        var data = {};
        data.id = req.body.s_username;
        data.username = req.body.s_username;
        data.password = req.body.s_password;
        data.email = req.body.s_email;
        data.created = new Date();
        data.phone = { calls: [], total: 0 };
        data.sms = { sms_messages: [], total: 0 };
        data.rec = { recordings: [], total: 0 };
        data.twilio_APIversion = '/2010-04-01';
        data.twilio_versions = '/2010-04-01';
        
        db.insert(data, function(err, doc)  {
            if(err)  console.log(err)
            if(!err) debug(req.body.s_username + " created at " + new Date());
        });
    }          
};

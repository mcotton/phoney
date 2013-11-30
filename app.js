
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    apiroutes = require('./routes/api'),
    loginroutes = require('./routes/login'),
    phoneroutes = require('./routes/phone'),
    smsroutes = require('./routes/sms'),
    worker = require('./routes/worker'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy,
    fs = require('fs'),
    follow = require('follow'),
    config = require('./couchdb/config.js').config;
    
if(config) console.log('Found config module - app.js');

// You'll need to input your own connection string.
var connection = require('nano')(config.connection_string);
var db = connection.use(config.database);

// The local users.json file adds to entries, if it didn't load
// create the array with empty objects
//if (!users) users = [{},{}];

// var users = [];
reload_users_from_CouchDB();

  
function reload_users_from_CouchDB() {
    db.view('all_users','all_users',function(err, body) {
        users = [];
        if (err) console.log(err);
        if (!err) {
            console.log('Found CouchDB design document');
            body.rows.forEach(function(doc) {
          
            // Pull User object out of the Couch
            // and add it to the users array.
            // This won't scale very well.
            doc.id = doc._id;
            users.push(doc.value)
            console.log('Importing user: \t' + doc.value.username)
            })
        // console.log("Users after CouchDB view:");
        // console.log(users);
        }
    })
}

// Follow the CouchDB _changes feed and update the users array
// You'll need to input your own connection string.
var feedObj = { db:config.connection_string + "/" + config.database, 
                include_docs:true,
                heartbeat: 5000 };
                
follow(feedObj, function(error, change) {
  if(error) { console.log(error); }
  if(!error)  {
    console.log("Updating from CouchDB changes feed");
    reload_users_from_CouchDB();
  }
})


// This is a really bad way of doing things.  It is the slowest, leaast effecient thing to do
function findById(id, fn) {
  var found_it = false;
  for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            found_it = true;
            //console.log('found what I was looking for, id ' + users[i].id)
            fn(null,users[i]);
        }
    }
    if (!found_it) {
        fn(new Error('User ' + id + ' does not exist'));
  }
}

// Helper function for passport
function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Helper function for passport
passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unkown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

 

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  //app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'put your secret in here' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes

// routes/apiroutes.js
app.get('/api/v1/sms', ensureAuthenticated, apiroutes.sms);
app.get('/api/v1/sms/by_date', ensureAuthenticated, apiroutes.sms_by_date);
app.get('/api/v1/sms/by_caller', ensureAuthenticated, apiroutes.sms_by_caller);
app.get('/api/v1/sms/by_receiver', ensureAuthenticated, apiroutes.sms_by_receiver);
app.get('/api/v1/sms/search/:id', ensureAuthenticated,apiroutes.sms_search);
app.get('/api/v1/phone', ensureAuthenticated, worker.phone);
app.get('/api/v1/phone/by_date/:id', ensureAuthenticated, apiroutes.phone_calls_by_date);
app.get('/api/v1/phone/calls_by_caller', ensureAuthenticated, apiroutes.phone_calls_by_caller);
app.get('/api/v1/phone/calls_by_receiver', ensureAuthenticated, apiroutes.phone_calls_by_receiver);
app.get('/api/v1/phone/calls_by_direction', ensureAuthenticated, apiroutes.phone_calls_by_direction);
app.get('/api/v1/phone/calls_by_status', ensureAuthenticated, apiroutes.phone_calls_by_status);
app.get('/api/v1/phone/search/:id', ensureAuthenticated, apiroutes.phone_search);
app.get('/api/v1/phone/by_sid/:id', ensureAuthenticated, apiroutes.by_sid);
app.get('/api/v1/recording', ensureAuthenticated, apiroutes.recording);
app.post('/api/v1/sms/reply/:id', ensureAuthenticated, apiroutes.reply);
app.get('/api/v1/phone/calls_by_area_code', ensureAuthenticated, apiroutes.phone_calls_by_area_code);
app.get('/api/v1/getAreaCode/:id', ensureAuthenticated, apiroutes.getAreaCode);


// routes/index.js
app.get('/', routes.index);
app.get('/gettingstarted', routes.gettingstarted);
app.get('/about', routes.about);
app.get('/contacts', routes.contacts);


// routes/login.js
app.get('/account', ensureAuthenticated, loginroutes.account);
app.get('/login', loginroutes.login);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), loginroutes.post_login);
app.get('/logout', loginroutes.logout);
app.post('/update', ensureAuthenticated, loginroutes.update_account);
app.post('/signup', loginroutes.signup);


// routes/phone.js
app.get('/phone/bydate/:id', ensureAuthenticated, phoneroutes.bydate);
app.get('/phone/bydate', ensureAuthenticated, phoneroutes.bydate);
app.get('/phone/bycaller', ensureAuthenticated, phoneroutes.bycaller);
app.get('/phone/byreceiver', ensureAuthenticated, phoneroutes.byreceiver);
app.get('/phone/bydirection', ensureAuthenticated, phoneroutes.bydirection);
app.get('/phone/bystatus', ensureAuthenticated, phoneroutes.bystatus);
app.get('/phone/search', ensureAuthenticated, phoneroutes.search);
app.get('/phone/callerdetail/:id', ensureAuthenticated, phoneroutes.callerdetail);
app.get('/phone/byareacode', ensureAuthenticated, phoneroutes.byareacode);


// routes/sms.js
app.get('/sms/bydate', ensureAuthenticated, smsroutes.bydate);
app.get('/sms/bycaller', ensureAuthenticated, smsroutes.bycaller);
app.get('/sms/byreceiver', ensureAuthenticated, smsroutes.byreceiver);
app.get('/sms/search', ensureAuthenticated, smsroutes.search);
app.get('/sms/callerdetail/:id', ensureAuthenticated, smsroutes.callerdetail);


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}



/*
 * ROUTES
 */

var request = require('request');

// To make it nicer on my mac, 
// Check if growl is loaded or
// alias it to console.log
/*
try { debug = require('growl') }
catch (e) { debug = console.log }
*/

var debug = console.log;

var config = require('../couchdb/config.js').config;
if(config) console.log('Found config module - routes/api.js');

var connection = require('nano')(config.connection_string);
var db = connection.use(config.database);


function makeBaseURL(u) {
    return 'https://' + u.twilio_sid + ':' + u.twilio_auth +'@api.twilio.com/' + u.twilio_APIversion;
}


function saveToTheCouch(user, body, opt) {
    db.get(user._id, function(err, data)  {
        if(err) console.log(err);
        if(!err) {
            switch(opt) {
                case 'phone': data.phone = body; break;
                case 'sms': data.sms = body; break;
                case 'rec': data.rec = body; break;
            } 
        
        // Toss in the current timestamp
        var curr_date = new Date();
        data.last_update = curr_date.toString();
        debug(data.last_update);
        
        db.insert(data, data._id, function(err, doc)  {
            if (err)  console.log(err)
        });
        }
    });
};


/*
 *      API stuff
 */


//      GET /api/v1/phone
exports.phone = function(req, res){
  request.get(makeBaseURL(req.user) + '/Accounts/' + req.user.twilio_sid + '/Calls.json',
  function(e,r,b) {
    if (e) console.log(e);
    body = JSON.parse(b);
    res.json(body);

    // cache this data into CouchDB
    debug('Refreshing phone records for...  ' + req.user.username);
    saveToTheCouch(req.user, body, 'phone');

  });
};

//      GET /api/v1/phone/by_date/:id
exports.phone_calls_by_date = function(req, res){
    if(req.user.twilio_sid) {
        db.view('phone','by_date', {key: req.user.twilio_sid }, function(err, body) {
            if (err) console.log(err);
            if (!err) {
                debug('Found CouchDB phone/by_date document');
                res.json(body);
            
                // cache this data into CouchDB
                debug('looking up phone records for...  ' + req.user.username);
                //saveToTheCouch(req.user, body, 'phone');
            
            }
        })
    } else {
        debug('could\'t find a twilio_sid for this user');
    }

}

exports.phone_calls_by_caller = function(req, res){
    db.view('phone','fromSplits', {group: true}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB phone/fromSplits document');
            //console.log(body);
            res.json(body);
        }
    })
}

exports.phone_calls_by_receiver = function(req, res){
    db.view('phone','toSplits', {group: true}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB phone/toSplits document');
            //console.log(body);
            res.json(body);
        }
    })
}

exports.phone_calls_by_direction = function(req, res){
    db.view('phone','by_direction', {group: true}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB phone/by_direction document');
            //console.log(body);
            res.json(body);
        }
    })
}

exports.phone_calls_by_status = function(req, res){
    db.view('phone','by_status', {group: true}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB phone/by_status document');
            //console.log(body);
            res.json(body);
        }
    })
}

exports.phone_search = function(req, res) {
  db.view('phone','whole_conversation_by_number', {key: [req.user.twilio_sid, req.params.id]}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB phone/whole_conversation_by_number view');
            //console.log(body);
            debug(req.params.id);
            res.json(body);
        }
    })
 
 
};

exports.phone_calls_by_area_code = function(req, res){
    db.view('phone','by_area_code', {group: true}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB phone/by_area_code document');
            //console.log(body);
            res.json(body);
        }
    })
}

exports.by_sid = function(req, res) {
  db.view('phone','by_sid', {key: req.params.id}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB phone/by_sid view');
            //console.log(body);
            debug(req.params.id);
            res.json(body);
        }
    })
 
 
};



//      GET /api/v1/sms
exports.sms = function(req, res){
  request.get(makeBaseURL(req.user) + '/Accounts/' + req.user.twilio_sid + '/SMS/Messages.json',
  function(e,r,b) {
    if (e) {
        console.log('ERROR: ', e);
        res.end();
    }
    else {
        body = JSON.parse(b);
        res.json(body);
        //console.log(body)
       
        // cache this data into CouchDB
        debug('Refreshing SMS records for...  ' + req.user.username);
        saveToTheCouch(req.user, body, 'sms');
    }
  });
};

//      GET /api/v1/sms/by_date
exports.sms_by_date = function(req, res){
    db.view('sms','by_date', {key: req.user.twilio_sid }, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB sms/by_date document');
            res.json(body);
            
            // cache this data into CouchDB
            debug('looking up sms records for...  ' + req.user.username);
            //saveToTheCouch(req.user, body, 'sms');
            
        }
    })
}

exports.sms_by_caller = function(req, res){
    db.view('sms','fromSplits', {group: true}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB sms/fromSplits document');
            //console.log(body);
            res.json(body);
        }
    })
}

exports.sms_by_receiver = function(req, res){
    db.view('sms','toSplits', {group: true}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB sms/toSplits document');
            //console.log(body);
            res.json(body);
        }
    })
}

exports.sms_search = function(req, res) {
  db.view('sms','whole_conversation_by_number', {key: [req.user.twilio_sid, req.params.id]}, function(err, body) {
        if (err) console.log(err);
        if (!err) {
            debug('Found CouchDB sms/whole_conversation_by_number view');
            //console.log(body);
            //console.log(req.params.id);
            res.json(body);
        }
    })
 
 
};


//      POST /api/v1/sms/reply
exports.reply = function(req, res) {
    
    debug(req.user.username + ' called /api/vi/sms/reply/' + req.params.id);
    res.json();
    
    
    
    /*
    request.get(makeBaseURL(req.user) + '/Accounts/' + req.user.twilio_sid + '/Calls.json', function(e,r,b) {
        if (e) console.log(e);
        body = JSON.parse(b);
        res.json(body);

        

  });
  */
};

//      GET /api/v1/recording
exports.recording = function(req, res){
  request.get(makeBaseURL(req.user) + '/Accounts/' + req.user.twilio_sid + '/Recordings.json',
  function(e,r,b) {
    if (e) console.log(e);
    body = JSON.parse(b);
    res.json(body);

    //cache this data into CouchDB
    debug('looking up recording records for... ' + req.user.username);
    saveToTheCouch(req.user, body, 'rec');
  });
};

exports.getAreaCode = function(req, res) {
    // Looking up area codes on the server-side to skip JSONP
    if(req.params.id) {
        
        request("http://www.allareacodes.com/api/1.0/api.json?npa=" 
                + req.params.id 
                + "&tracking_email=admin%40subtlecontrols.com&tracking_url=http://www.localhost.com",
                function(err, response, body) {
                    if(body)  {
                        
                        //console.log(body)
                        data = JSON.parse(body)
                        debug(data.area_codes[0].area_code + ' is located in ' 
                                                           + data.area_codes[0].state)
                        res.send(data.area_codes[0].area_code + ' is located in ' 
                                                              + data.area_codes[0].state)
                    }
                    else {
	                    debug('body didn\'t contain anything')
                    }
                    
                    
                })
    }
    if(!req.params.id) debug('ERROR: /api/v1/getAreaCode did not include :id')
}


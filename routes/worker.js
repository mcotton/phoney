

var request = require('request');

// To make it nicer on my mac, 
// Check if growl is loaded or
// alias it to console.log
try { debug = require('growl') }
catch (e) { debug = console.log }

var config = require('../couchdb/config.js').config;
if(config) console.log('Found config module - routes/worker.js');

var connection = require('nano')(config.connection_string);
var db = connection.use(config.database);




exports.phone = function(req, res) {

    var u = req.user;
    
    debug('Starting')
    debug(u.phone.total + ' total calls from Twilio')
    if(u.phone && u.phone.calls) debug(u.phone.calls.length + ' calls are currently stored')
    
    if(u.phone.total <= u.phone.calls.length) {
        
        debug('All data has been previously fetched, reseting user.phone.next_page_uri')
        debug('Removing all calls and re-fetching them')
        u.phone.calls = []
        u.phone.next_page_uri = '/2010-04-01/Accounts/' + u.twilio_sid + '/Calls.json'
    }
    
    if(u.phone.total == -1) {
        u.phone.calls_startURL = makeURL(u, '/2010-04-01/Accounts/' + u.twilio_sid + '/Calls.json')
    
        debug('Fetching first set of data')
        fetchData(u, u.phone.calls_startURL)
    
    
    } else {
    
        debug('Fetching next page of data')
        debug(makeURL(u, u.phone.next_page_uri))
        fetchData(u, makeURL(u, u.phone.next_page_uri))
    
    }
    
}



function makeURL(u, str) {
     return 'https://' + u.twilio_sid + ':' + u.twilio_auth +'@api.twilio.com' + str;
 }

function fetchData(u, _url) { 
     request({ url: _url, json: true }, function(e,r,b) {
         if(e) { debug('ERROR in fetchData(): ' + e) 
                 debug('saving to CouchDB')
                 saveToTheCouch(u, u.phone, 'phone')
         } else {
             debug('running fetchData()')
             
             u.phone.calls_total =  b.total
             u.phone.next_page_uri = b.next_page_uri
             u.phone.calls_num_pages = b.num_pages
             u.phone.call_start = b.start
             u.phone.call_end = b.end
             u.phone.calls = u.phone.calls.concat(b.calls) 
             
             if(u.phone.calls_total > u.phone.calls.length) {
                 
                 debug('There are more calls to fetch')
                 fetchData(u, makeURL(u, u.phone.next_page_uri))
                 
             }
             else {
             
                 debug('There are no more calls to fetch')
                 u.phone.next_page_uri = makeURL(u, '/2010-04-01/Accounts/' + u.twilio_sid + '/Calls.json')
            
                 debug('ending fetchData()')
                 debug('saving to CouchDB')
                 saveToTheCouch(u, u.phone, 'phone')
                 
             }
             
         }
     }) 
     
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

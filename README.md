phoney
==============

Node project to analyze account information from twilio



CouchDB connection
==============

You'll need to put in your own credentials in couchdb/config.js

    exports.config = {
    
        connection_string: 'https://<user>:<pass>@<database_url>',
        database: 'subtle-users',
        
        test_database: 'test',
        testing_url: 'http://<url>:3000',
        test_user: '<username>',
        test_pass: '<password>'
    
    }



You'll also need to make the CouchDB views from couchdb/

 - _design/all_users
 - _design/phone
 - _design/sms


    
users
==============
It doesn't matter where it is getting the users object from (local file, CouchDB, redis, memcache, etc) it just matters that the object has the correct propoerties.  The current version uses CouchDB and when it changes it reloads the whole user object into memory again.  Previously it used a local users.json file.


    { "Model":
        [{
            "id"                  :   1,
            "username"            :   "",
            "password"            :   "",
            "email"               :   "",
            "twilio_sid"          :   "",
            "twilio_auth"         :   "",
            "twilio_APIversion"   :   "\/2010-04-01"
        }]
    } 
    
    
sessions
==============

Put a real secret phrase here

      app.use(express.session({ secret: '<your secrect phrase goes here>' }));
      

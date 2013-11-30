// Run with nodeunit
// >nodeunit test

var config = require('../couchdb/config.js').config;
    
if(config) console.log('Found config module');

var connection = require('nano')(config.connection_string);
var db = connection.use(config.database);


var Browser = require('zombie');
    browser = new Browser();

exports.client_side_testing = {
        connect_to_localhost:   function(test) {
           test.expect(1);
           
           browser.visit(config.testing_url, function() {
               
               test.ok(browser.success);
               test.done();
               
           })
           
        },
        
        sign_out:   function(test) {
          test.expect(1);
          
          browser.visit(config.testing_url + '/logout', function() {
              
              test.ok(browser.success);
              test.done();
          });
            
        },
        
        find_sign_in_form:   function(test) {
           test.expect(3);
           
           browser.visit(config.testing_url + '/login', function() {

               test.ok(browser.query('#login_userform'));
               test.ok(browser.query('#login_passform'));
               test.ok(browser.query('#login_submit'));
               test.done();
                                             
           });
           
        },
        
        sign_in:    function(test) {
            test.expect(1);
            
            browser.visit(config.testing_url + '/login', function(e, b) {
                b.fill('#login_userform', config.test_user)
                b.fill('#login_passform', config.test_pass)
                b.pressButton('#login_submit', function() { console.log(browser.errors) });
                
                test.ok(true);
                test.done();
            });
        }
        
}
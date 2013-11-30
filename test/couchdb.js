// Run with nodeunit
// >nodeunit test

var config = require('../couchdb/config.js').config;
    
if(config) console.log('Found config module');

var connection = require('nano')(config.connection_string);
var db = connection.use(config.test_database);




exports.connection_to_couchdb = {
        remove_old_database:   function(test) {
           test.expect(1);
           
           connection.db.destroy(config.test_database, function() {
                
                test.ok(true, 'test db was destroyed');
                test.done();
               
           })       
        },
        
        create_new_database:    function(test) {
            test.expect(1);
            connection.db.create(config.test_database, function() {
                
                test.ok(true, 'test db was created');
                test.done();
                
            })    
            
        },
        
        insert_document:   function(test) {
           test.expect(1);
           
           testdb = connection.use(config.test_database);
           testdb.insert({crazy: true}, 'test_doc', function(err, body) {
                        
               test.ok(!err, 'Document inserted without error');
               test.done();
                        
            });
        },
        
        get_and_update_document:    function(test)  {
            test.expect(3);
            
            testdb.get('test_doc', function(err, doc) {
                
                test.ok(!err, 'Document retreieved without error');
                test.ok(doc.crazy, 'Document grabed document param');
                
                doc.crazy = false;
                
                testdb.insert(doc, doc._id, function(err, body) {
                    
                    test.ok(!err, 'Document inserted without error');
                    test.done();
                });  
            })   
        },
        
        get_document_and_verify_update:    function(test)  {
            test.expect(3);
            
            testdb.get('test_doc', function(err, doc) {
                
                test.ok(!err, 'Document retreieved without error');
                test.notEqual(doc.crazy, 'Document grabed document param');
                                
                testdb.insert(doc, doc._id, function(err, body) {
                    
                    test.ok(!err, 'Document inserted without error');
                    test.done();
                });  
            })   
        },
        
}
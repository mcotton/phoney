/* Author:

*/

$(document).ready(function() {
/*
    $('#load_calls').click(function()  {
        var target = $('#phone_list');
        $.get('/api/v1/phone.json', function(data) {
            _.forEach(data.calls, function(item) {
                if(item.direction === 'outbound-dial') {
                    target.append('<li class=' + item.status 
                                               + '>' + item.from_formatted 
                                               + ' called ' 
                                               + item.to_formatted
                                               + ' for '
                                               + item.duration 
                                               + ' seconds </li>');
                }         
            });    
        });
    });


    $('#load_smss').click(function()  {
        var target = $('#sms_list');
        $.get('/api/v1/sms.json', function(data) {
            _.forEach(data.sms_messages, function(item) {
                target.append('<li class=' + item.status + '>' + item.body + '</li>');
            });    
        });
    });
    
    
    $('#load_recordings').click(function()  {
        var target = $('#recording_list');
        $.get('/api/v1/recording.json', function(data) {
            _.forEach(data.recordings, function(item) {
                target.append('<li><a href=http://api.twilio.com/' 
                    + item.api_version + '/Accounts/' 
                    + item.account_sid + '/Recordings/'
                    + item.sid + '>' + item.date_created + '</a>');
            });    
        });
    }); 
*/
    
    $('.dropdown-toggle').dropdown()
    
    $('#loadingDiv')
    .hide()  // hide it initially
    .ajaxStart(function() {
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    });
    
    $('#refresh-phone').click(function(e) {
        e.preventDefault();
        $.get('/api/v1/phone', function(data) {})
        
    })
    
    $('#refresh-sms').click(function(e) {
        e.preventDefault();
        $.get('/api/v1/sms', function(data) {})
        
    })
    

});




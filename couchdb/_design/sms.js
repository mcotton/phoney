{
   "_id": "_design/sms",
   "_rev": "31-c0df32db5be9a3b8f9b488cedf62bd55",
   "language": "javascript",
   "views": {
       "toSplits": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n    emit([doc.twilio_sid,\n          doc.sms.sms_messages[i].to], 1);\n  }\n}",
           "reduce": "function(k,v,r) {\n   return sum(v);\n}"
       },
       "fromSplits": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n    emit([doc.twilio_sid,\n          doc.sms.sms_messages[i].from], 1);\n  }\n}",
           "reduce": "function(k,v,r) {\n   return sum(v);\n}"
       },
       "by_user_detail": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n    emit(doc.sms.sms_messages[i].from, doc.sms.sms_messages[i].body);\n  }\n}"
       },
       "from_user_detail": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n    emit(doc.sms.sms_messages[i].from, doc.sms.sms_messages[i].body);\n  }\n}"
       },
       "to_user_detail": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n    emit(doc.sms.sms_messages[i].to, [doc.sms.sms_messages[i].body, doc.sms.sms_messages[i].date_created]);\n  }\n}"
       },
       "conversation": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n\n    emit( [doc.sms.sms_messages[i].from,\n           doc.sms.sms_messages[i].to],\n\n          [doc.sms.sms_messages[i].body, \n           doc.sms.sms_messages[i].date_created]);\n  }\n}"
       },
       "conversation_to": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n    \n    emit( doc.sms.sms_messages[i].to, \n\n [doc.sms.sms_messages[i].body, \n  doc.sms.sms_messages[i].date_created]);\n  }\n}"
       },
       "conversation_from": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n\n    emit( doc.sms.sms_messages[i].from, \n\n [doc.sms.sms_messages[i].body, \n  doc.sms.sms_messages[i].date_created]);\n  }\n}"
       },
       "testing": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n\n    emit(doc.sms.sms_messages[i].from, doc.sms.sms_messages[i].body);\n    emit(doc.sms.sms_messages[i].to, doc.sms.sms_messages[i].body);\n\n  }\n}"
       },
       "whole_conversation_by_number": {
           "map": "function(doc) {\n  for(i=0;i < doc.sms.sms_messages.length; i++) {\n\n    emit([doc.twilio_sid, doc.sms.sms_messages[i].from], doc.sms.sms_messages[i].body);\n    emit([doc.twilio_sid, doc.sms.sms_messages[i].to], doc.sms.sms_messages[i].body);\n\n  }\n}"
       }
   }
}
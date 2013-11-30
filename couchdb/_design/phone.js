{
   "_id": "_design/phone",
   "_rev": "52-4f87a5726a682f90e7a3b905c5b35da4",
   "language": "javascript",
   "views": {
       "toSplits": {
           "map": "function(doc) {\n  for(i=0;i < doc.phone.calls.length; i++) {\n    if(doc.phone.calls[i].direction === 'outbound-dial')\n      emit([doc.twilio_sid,\n            doc.phone.calls[i].to_formatted,\n            doc.phone.calls[i].to_formatted], 1);\n  }\n}",
           "reduce": "function(k,v,r) {\n   return sum(v);\n}"
       },
       "fromSplits": {
           "map": "function(doc) {\n  for(i=0;i < doc.phone.calls.length; i++) {\n    emit([doc.twilio_sid,\n          doc.phone.calls[i].from_formatted,\n          doc.phone.calls[i].from], 1);\n  }\n}",
           "reduce": "function(k,v,r) {\n   return sum(v);\n}"
       },
       "details_from_caller": {
           "map": "function(doc) {\n  for(i=0;i < doc.phone.calls.length; i++) {\n    if(doc.phone.calls[i].direction == 'inbound') {\n      emit(doc.phone.calls[i].from_formatted, \n          [doc.phone.calls[i].date_created,\n           doc.phone.calls[i].to_formatted,\n           doc.phone.calls[i].duration,\n           doc.phone.calls[i].price,\n           doc.phone.calls[i].direction]);\n     } \n  }\n}"
       },
       "whole_conversation_by_number": {
           "map": "function(doc) {\n  for(i=0;i < doc.phone.calls.length; i++) {\n\n    emit([doc.twilio_sid, doc.phone.calls[i].from], [doc.phone.calls[i].start_time, doc.phone.calls[i].duration]);\n    emit([doc.twilio_sid, doc.phone.calls[i].to], [doc.phone.calls[i].start_time, doc.phone.calls[i].duration]);\n\n \n  }\n}"
       },
       "by_area_code": {
           "map": "function(doc) {\n  for(i=0;i < doc.phone.calls.length; i++) {\n    if(doc.phone.calls[i].direction == 'inbound') {\n      emit([doc.twilio_sid, doc.phone.calls[i].from.slice(2,5)], 1);\n     } \n  }\n}",
           "reduce": "function(k,v,r) {\n   return sum(v);\n}"
       },
       "by_date": {
           "map": "function(doc) {\n    emit(doc.twilio_sid, doc.phone.calls);\n    \n}"
       },
       "by_status": {
           "map": "function(doc) {\n  for(i=0;i < doc.phone.calls.length; i++) {\n    emit([doc.twilio_sid, doc.phone.calls[i].status], 1);\n  }\n}",
           "reduce": "function(k,v,r) {\n   return sum(v);\n}"
       },
       "by_direction": {
           "map": "function(doc) {\n  for(i=0;i < doc.phone.calls.length; i++) {\n    emit([doc.twilio_sid, doc.phone.calls[i].direction], 1);\n  }\n}",
           "reduce": "function(k,v,r) {\n   return sum(v);\n}"
       },
       "by_sid": {
           "map": "function(doc) {\n  for(i=0;i < doc.phone.calls.length; i++) {\n      emit(doc.phone.calls[i].sid,doc.phone.calls[i]);\n  }\n}"
       }
   }
}
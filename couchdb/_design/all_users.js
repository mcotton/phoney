{
   "_id": "_design/all_users",
   "_rev": "10-941a193759e38eeb15f87d5234c3e3cd",
   "language": "javascript",
   "views": {
       "all_users": {
           "map": "function(doc) {\n  emit(doc.username, doc);\n}"
       },
       "calls_per_user": {
           "map": "function(doc) {\n  emit(doc.username, doc.phone.total);\n}"
       },
       "list_of_users": {
           "map": "function(doc) {\n  emit(doc.username, null);\n}"
       },
       "calls_vs_length": {
           "map": "function(doc) {\n  emit(doc.username, [doc.phone.total, doc.phone.calls.length]);\n}"
       }
   }
}
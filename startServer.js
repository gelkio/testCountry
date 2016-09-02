var fs = require("fs");
var http = require('http');
var nano = require('nano')('http://localhost:5984');
var ocurrence_db = nano.db.use('occurrence_db');

const server = http.createServer((req,res) => {
    
    res.setHeader('Content-Type', 'text/json');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, {'Content-Type': 'text/plain'});

    var result = [];
    ocurrence_db.view('country', 'country', {group: true}, function(error, body){
        if(!error){
            body.rows.forEach(function(doc) {
                var key = new String(doc.key);
                var attributes = key.split(",");
                var resultRecord = {name: attributes[0],
                                   country: attributes[1],
                                   count: doc.value};
                result.push(resultRecord);
            });
            res.write(JSON.stringify(result));
            res.end();
        }
    });
}).listen(9090);
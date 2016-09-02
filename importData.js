var fs = require("fs");
var http = require('http');
var nano = require('nano')('http://localhost:5984');

nano.db.create('occurrence_db', function(err, body) {
  if (!err) {
    console.log('database occurrence_db created!');
  }
});

var ocurrence_db = nano.db.use('occurrence_db');

/*
* Generates a unique identifier
*/
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

/*
* Recursive function that gets the occurrences for the first element of the array species
* @Param array species Array with the names of the species to process
* @Param int index Index of the currently specie in process 
* @Param int page Page of the ocurrences retrived
*/
function getOccurrences(species, index, page){
    if(species.length >= index ){
        var currentSpecie = species[index];
        var offset = page*30;
        var options = {
            host: 'api.gbif.org',
            path: '/v1/occurrence/search?offset='+offset+'&limit=30&q='+encodeURIComponent(currentSpecie.name)
        };
        console.log("url: ", options.path);
        http.request(options, function(response){
            var content = '';
            response.on('data', function(chunk){
                content += chunk;
            });
            response.on('end', function(){
                var contentObject = JSON.parse(content);
                
                currentSpecie.occurrences = currentSpecie.occurrences.concat(contentObject.results);

                if(contentObject.endOfRecords){
                    ocurrence_db.insert(currentSpecie, guid(), function(error, body){
                        if(error){
                            console.log("Can't insert specie: ", currentSpecie.name, error);
                        }else{
                            console.log("Specie inserted: ", currentSpecie.name);
                        }
                    });
                    getOccurrences(species, index+1, 0);
                }else{                 
                    getOccurrences(species, index, page+1);
                }
            });
        }).end();
    }else{
        
    }
};



var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('taxon.csv')
});

var skip = false;
var species = [];
lineReader.on('line', function (line) {
  if(!skip){ //skip first line
      var record = line.split(",");
      var specie = {"id":record[0],
                    "name":record[1],
                    "kingdom":record[2],
                    "phylum":record[3],
                    "class":record[4],
                    "order":record[5],
                    "family":record[6],
                    "genus":record[7],
                    "specific":record[8],
                    "range":record[9],
                    "author":record[10],
                    "comunName":record[11],
                    "occurrences": [] };
      console.log('Scientific name:', record[1]);  
      species.push(specie);
  }
  skip = false;
}).on('close', function(){
    console.log("species size:", species.length, species);
    getOccurrences(species, 0, 0);
});
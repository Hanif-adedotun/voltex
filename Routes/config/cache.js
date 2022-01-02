//This file is to change the storage option of vm to use in-memory storage instead of file-based storage
var cache = require('memory-cache');
var time = new Date();

// function (write)
function write({key, data}){
 var d = JSON.stringify(data);
//  Turns tha data into a string to store it without errors
 cache.put(key, d);
 //Caches the data

 console.log("User loaded to cache");
}

// function (get)
function get(key){
     var data = cache.get(key);
     if(!data){
          return null;
     }
     //Turns the string object back into an object
     var obj = JSON.parse(data);
     return  obj;
}


// function (get)
function clear(key){
//clear the data in the storage
     cache.clear(key);
     console.log("User cleared");
}

var _export = {
     write: write,
     read: get,
     clear: clear
}

module.exports = _export;
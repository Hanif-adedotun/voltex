var MongoClient = require('mongodb').MongoClient;
const keys = require('../config/keys');
const url = keys.mongodb.url;
const ObjectId = require('mongodb').ObjectId;


//function (connect_insert): insert a data into the mongodb atlas database
//@params (database) the name of the database to insert into
//@params (collection) the table to insert data into
//@params (data) the form data to be inserted
var connect_insert = (database, collection, data) =>{
     return new Promise(function(resolve, reject){
          MongoClient.connect(url,{
               useNewUrlParser: true,
               useUnifiedTopology: true,
               // useFindAndModify: true,
               // useCreateIndex: true
             },async function(err, db) {
            if (err) throw err;
            var dbo = db.db(database);
            
            await dbo.collection(collection).insertOne(data, function(err, res) {
              if (err) {reject(false);};
              console.log(`${data.key} is inserted`);
              db.close();
              resolve(true);
             
            });
          });
     });
     
}

 //function (connect_find): gets  data from the mongodb atlas database
//@params (database) the name of the database to get data from
//@params (collection) the table to get data from
var connect_find = async (database, collection, keyVal) =>{
     var res;
     try{
     MongoClient.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     },async function(err, db) {
          if (err) {return err;}
          var dbo = db.db(database);
          var query = {key: String(keyVal)};
          await dbo.collection(collection).find(query).toArray(async function(err, result) {
            if (err) {return err; };
   
          //   console.log('Mongodb data from mongodb.js: '+JSON.stringify(result));
          db.close();
          res = result;
          return result;
            
          });
        }); 
     if(res) {return res; }
     }catch(e) {
          console.log(e);
             return e;
        } 
}
var connect_find_new = async (database, collection, keyVal) =>{
     const client = await MongoClient.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     }).catch(err => {console.log(err);})

     if(!client){return null;}

     try{
          var dbo = client.db(database);
          var query = {key: String(keyVal)};

          let res = await dbo.collection(collection).find(query).toArray();
          // console.log(res);
          return res;
     }catch(e){console.log(e)}
     finally{
          client.close();
     }
}
 //function (delete_data): deletes a row from the database
//@params (database) the name of the database to get data from
//@params (collection) the table to get data from
//@params (id) the unique id of the data you want to delete
var delete_data = async (database, collection, id)=>{
     var res = false;
     return new Promise(function(resolve, reject){
          MongoClient.connect(url, {
               useUnifiedTopology: true,
               useNewUrlParser: true
          },async function(err, db) {

          if (err) { reject(MongoClient); throw err;}
          var dbo = db.db(database);
          var myquery = { _id: new ObjectId(id) };

          await dbo.collection(collection).deleteOne(myquery, function(err, obj) {
               if (err) { reject(MongoClient); throw err;};
               console.log('Deleted data: '+id+' from MongoDB');
               res = true;
               db.close();
               resolve(res);
               });
          });
     });
}
const mongo ={
     insert : connect_insert,
     find: connect_find,
     find_new: connect_find_new,
     delete: delete_data
}
module.exports = mongo;
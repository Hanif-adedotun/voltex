var mysql = require('mysql');
const keys = require('../config/keys');

//connection details to the database
//@param {host} is the server hosting mysql 
//@param {username} username of client 
//@param {password} password of client 
var DBdetails = {
    host: keys.mysql.host,
    username: keys.mysql.username,
    password: keys.mysql.password
};


//The default table field names, for creation and retreival of values
var Table= {
    tablename: keys.mysql.Table.tablename,
    url: keys.mysql.Table.url,
    nameoftable: keys.mysql.Table.nameoftable,
    uniqueID : keys.mysql.Table.uniqueID,
    userid: keys.mysql.Table.userID
};

//function (createDatabse) create database on mySql with name given beforeRetry
//@param {databaseName} the name given to the function to create a database with
var createDatabse = (databaseName) =>{
      String(databaseName);
      var con = mysql.createConnection({
        host: DBdetails.host,
        user: DBdetails.username,
        password: DBdetails.password,
      });
        con.connect(function(err){
            if(err) throw err;
            console.log('Mysql databse: Connected');

            con.query('CREATE DATABASE '+ databaseName, function(err, result){
                if(err) {
                    console.log('Database exits or ' + err);
                    return false;
                };

                console.log('Datadase created');
                return true;
            });
        });
}
    
//function (createUserTable) create user table to store the name and other related values to the database for easy retreival
//@param {dbname} the name of the databse already created
var createUserTable = (dbname)=>{
    var con = mysql.createConnection({
        host: DBdetails.host,
        user: DBdetails.username,
        password: DBdetails.password,
        database: dbname
      });
    con.connect(function(err){
        if(err) {console.error(err); return false;};
        console.log('Mysql: Connected');
        var sql = `CREATE TABLE ${Table.tablename} (${Table.url} VARCHAR(255), ${Table.nameoftable} VARCHAR(255), ${Table.uniqueID} VARCHAR(255), ${Table.userid}  VARCHAR(128) NOT NULL)`;
        con.query(sql, function(err, result){
            if(err) {console.error(err); return false;};
            console.log('Table created');
            return true;
        });
    });
}

//function (addToUserTable) to add a new user to the table with its important details_
// @param {dbname} name of the database
// @param {url} url of the client's static page
// @param {name} table name of the user table
// @param {id} 16 letters unique id used to identify and secure a table
// @param {userid} user id used to register, e.x google id

var addToUserTable = (dbname, url, name, id, userid) =>{
    var con = mysql.createConnection({
        host: DBdetails.host,
        user: DBdetails.username,
        password: DBdetails.password,
        database: dbname
      });
      con.connect(function(err, results){
          if (err){
            console.error(err);
            return false ;
          } 
          console.log('Mysql: Connected');
          var records = [
              [url, name, id, userid]
          ];
          var sql = `INSERT INTO ${Table.tablename} (${Table.url}, ${Table.nameoftable}, ${Table.uniqueID}, ${Table.userid}) VALUES ?`;
          con.query(sql, [records], function(err, result){
              if (err) {
                  console.error(err);
                  return false;
              };
              console.log('Inserted!');
              return true;
          });
      });
}

//function (getfromtable) gets either the whole table or a specified row using params
// @param {dbname} name of the database
// @param {table} table name of the user table
// @param {params} parameters for specified retreival
var getfromtable = (dbname, table, params=false) =>{
    var dbResults;
    return new Promise(function(resolve, reject){
        var con = mysql.createConnection({
            host: DBdetails.host,
            user: DBdetails.username,
            password: DBdetails.password,
            database: dbname
          });
    
           con.connect(function(err, results){
            if (err) {
                console.error('Connection Error: '+err);
                dbResults = null;
                reject(con);
            }
            console.log('Mysql: Connected');
    
            // 
            var sql = (params) ? `SELECT * FROM  ${table} ${params}` :  `SELECT * FROM  ${table}`;
            //  `SELECT * FROM  ${table} ${params}` ;
       
    
            con.query(sql, function(err, result){
                if (err) {
                    console.log('Error getting to db: '+err);
                    dbResults = null;
                    reject(con);
                }
                console.log('Mysql: Fields are selected!');
                dbResults =  result;
                resolve(dbResults);
            });
        });
    
    })

}
//function (updateTable) to add a new user to the table with its important details
// @param {dbname} name of the database
/// @param {userId} the id of the user, used to identify the unique field to edit 
// @param {urlValue} the new url value to replace with the old url value
var updateTable = ({dbname, userId, urlValue}) =>{
    return new Promise(function(resolve, reject){
        var con = mysql.createConnection({
            host: DBdetails.host,
            user: DBdetails.username,
            password: DBdetails.password,
            database: dbname
        });
        con.connect(function(err, results){
            if (err){
                console.error(err);
                reject(con);
                return false ;
            } 
            console.log('Mysql: Connected');
        
            var sql = `UPDATE ${Table.tablename} SET ${Table.url} = '${urlValue}' WHERE ${Table.userid}=${userId}`;

            con.query(sql, function(err, result){
                if (err) {
                    console.error(err);
                    reject(con);
                    return false;
                };
                console.log('Updated Url value!');
                resolve('Updated Url');
                return true;
            });
        });
    })
}

//An object to export the functions 
var database = {
    createDatabse: createDatabse,
    createUserTable: createUserTable,
    addToUserTable: addToUserTable,
    getfromtable: getfromtable,
    editfield: updateTable
};

 module.exports = database; 
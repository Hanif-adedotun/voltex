const express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
const url = require('url');
const util = require('util');

const keys = require('./config/keys');
var DB = require('./Database/database');
const { json } = require('body-parser');
var path = require('path');
const querystring = require('querystring');
const formidableMiddleware = require('express-formidable');

//To parse images
const mul = require('multer');
// const helpers = require('./helpers');
// const storage = mul.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'uploads/');
//         //uploads url can bring an error, confirm it
//     },
//     filename: function(req, file, cb){
//         cb(null, file.filename+'-'+Date.now()+ path.extname(file.originalname));

//     }

// })
//mongodb
const mongo = require('./Database/mongodb');

// support parsing of application/json type post data
router.use(bodyParser.json());

//Different static page views using pug
const pug = require('pug');
const compileView = pug.compileFile(path.join(__dirname +'/config/backend.pug'));

//support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ extended: true }));


// @params {Address} is /api/middlewear/data


//Create the table names so as to access them easily throughout the file
var dummyTable = {
    databse: keys.mysql.database,
    table: keys.mysql.Table.tablename,
    key: keys.mysql.Table.uniqueID,
    url: keys.mysql.Table.url
}


//Router (POST method) {/api/middlewear/data/:dbname/:key}
//To post the results to the database from the users form backend_page
//@params(dbname) is the name of the user id from Google
//@params(key) is the unique 8 character key given to the user
router.route('/:dbname/:key').get((req, res) =>{
    res.status(401).send(compileView({
        pageTitle: '401-Unauthorized access',
        error: true,
        text: 'Invalid header, Check the method used to send data',
      }))
      
   

}).post((req, res) =>{
    req.setMaxListeners(10);//This sets the maximum api requests at once to 10 requests

    const params = ` WHERE ${keys.mysql.Table.userID} ='${req.params.dbname}'`
    DB.getfromtable(dummyTable.databse, dummyTable.table, params).then(
        function(result){

            const key = result[0].uniqueid;
            const page_url = result[0].url;
           
            // console.log('Expected inputs were: ' + key + ' ' + page_url);
            // console.log('Given inputs were: ' + req.params.key + ' ' + req.headers.origin);
            if(req.params.key === key && req.body['user-url']  === page_url){
                //This is a security feature, where after gettin the user id, it has to have the same unique key and it must come from the expected page url
                //if the query parameters are safe and confirmed send a page to show loading 
                var tablres = {
                    key:  key, //key,
                    db_values: {}    
                };
                
                //reconfigure the parsing and sending of data 
                switch(req.headers["content-type"]){
                    default: parsedata(req.body);
                    break;
                    case "application/x-www-form-urlencoded": parsedata(req.body, true);
                    break;
                    case "multipart/form-data": parsemult(req.body);
                    break;
                    case "text/plain": parsedata(req.body);//check for how to parse text/plain data
                    break;
                }
//passport
                //If files are included in the data sent use a different middleware
                function parsemult(){
                    // let upload = mul({storage: storage, fileFilter: helpers.imageFilter}).single('passport');
                    // upload(req, res, function(err){
                    //     if (req.fileValidationError) {
                    //         throw err(req.fileValidationError);
                    //     }
                    //     else if (!req.file) {
                    //         return console.log('Please select an image to upload');
                    //     }
                    //     else if (err instanceof multer.MulterError) {
                    //         return res.send(err);
                    //     }
                    //     else if (err) {
                    //         return res.send(err);
                    //     }
                       
                    // })
                    res.send('This function is still in progress')
                }
                
                //function (parsedata) to parse the user form data and add it to mongodb database
                //@param (data) this is the body of the form sent to the api
                //@param (type) if set to true it parse the data not used for plain text
                //If it is just plain text use a normal data
                async function parsedata(data, type){
                    if(type){
                        querystring.parse(data);
                    }
                        for (var field in data){ 
                            field = field.toLowerCase();
                            var forbidden = ['done', 'user-url', 'submit', 'send' ];
                            //To avoid sending a send button value to the database
                            if(!forbidden.includes(field)){
                                if(!str || data[field] === ''){
                                    console.log('Empty field: '+data[field]);
                                    tablres.db_values[field] = 'null';
                                }else{
                                    tablres.db_values[field] = data[field];
                                }
                            }              
                        }
                        
                        console.log(Object(tablres));
                                            

                        // String newFileName = "my-image";
                        // File imageFile = new File("/users/victor/images/image.png");
                        // GridFS gfsPhoto = new GridFS(db, "photo");
                        // GridFSInputFile gfsFile = gfsPhoto.createFile(imageFile);
                        // gfsFile.setFilename(newFileName);
                        // gfsFile.save();

                        //Insert the data into the database
                        //mongo.insert(name of database, name of collection, data to insert)
                        if(tablres.db_values){
                            await mongo.insert(keys.mongodb.db.name, keys.mongodb.db.collection, Object(tablres)).then(function(respon){
                                if(respon){
                                    // console.log(respon);
                                    // res.status(200).sendFile(path.join(__dirname +'/config/backend_page.html'));
                                     res.status(200).redirect(req.body['user-url']);
                                }

                            }).catch(function(err){
                                console.log('Could not add, Error: ' + err)
                                res.status(500).send(compileView({
                                    pageTitle: 'Voltex Middlewear',
                                    error: true,
                                    text: 'Could not add to database',
                                  }))
                            });
                             
                        }
                                          
                }
                
            }else{
                res.status(404).send(compileView({
                    pageTitle: '404-Not found',
                    error: true,
                    four: '404',
                    text: 'You are not authorized to view this page, please check your form parameters and try again.'
                }));
                //res.sendFile(path.join(__dirname +'/config/404page.html'));
            }

    }).catch(function(err){
    console.log('Error: ' + err);


    var serverRes = {
      status: 404,
      data: 'Internal server error!'
    }

    res.status(500).send(JSON.stringify(serverRes.data));
    });
    
});

module.exports = router;
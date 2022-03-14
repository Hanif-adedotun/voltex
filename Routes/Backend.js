const express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
// const url = require('url');
// const util = require('util');

const keys = require('./config/keys');
const DB = require('./Database/database');
const firebase = require('./Database/firebase');
// const { json } = require('body-parser');
var path = require('path');
const querystring = require('querystring');
// const formidableMiddleware = require('express-formidable');

//To parse images
const mul = require('multer');

//mongodb
const mongo = require('./Database/mongodb');

// support parsing of application/json type post data
router.use(bodyParser.json());

//Different static page views using pug
const pug = require('pug');
const compileView = pug.compileFile(path.join(__dirname +'/config/backend.pug'));

//support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ extended: true }));


// @params {Address} is /api/data
const storage = require('./config/bucket');
router.route('/test/url').get(async (req, res) => {
    let data = await storage.url("app");
    res.json(data);
})


const mail = require('./config/mail');

router.route('/mail').get((req, res) => {
    
    let data = mail.show('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
    res.send(data);

}).post(async (req, res) => {
    let data = await mail.send({
        to:'hanif.adedotun@gmail.com', 
        subject: 'Voltex Mail', 
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    })
    res.json(data);
})


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
      
   

}).post(async (req, res)=>{
    req.setMaxListeners(100);//This sets the maximum api requests at once to 100 requests
    const userID = req.params.userid;
    let data = await firebase.read(userID);
    
    let d = data[0].tables.filter((item) => item.uniqueID == req.params.uniqueID)
    
    const uniqueID = d[0].uniqueID, url = d[0].url;

    if(req.params.uniqueID === uniqueID && req.body['user-url']  === url){
        var tablres = {
            key:  uniqueID, //key,
            db_values: {}    
        }

        //reconfigure the parsing and sending of data 
        switch(req.headers["content-type"]){
            default: parsedata(req.body);
            break;
            case "application/x-www-form-urlencoded": parsedata(req.body);
            break;
            case "multipart/form-data": parsemult(req.body);
            break;
            case "text/plain": parsedata(req.body);//check for how to parse text/plain data
            break;
        }

        //If files are included in the data sent use a different middleware
        function parsemult(){
            res.send('This function is still in progress')
        }

         //function (parsedata) to parse the user form data and add it to mongodb database
         //@param (data) this is the body of the form sent to the api
         //@param (type) if set to true it parse the data not used for plain text
         //If it is just plain text use a normal data
                async function parsedata(data){
                    for (var field in data){ 
                        // field = field.toLowerCase();
                        var forbidden = ['done', 'user-url', 'submit', 'send' ];
                        //To avoid sending a send button value to the database
                        if(!forbidden.includes(field.toLowerCase())){
                            if(data[field] === ''){
                                tablres.db_values[field] = 'null';
                            }else{
                                tablres.db_values[field] = data[field];
                            }
                        }              
                    }
                    
                    // console.log(Object(tablres));
                            //   res.json(tablres);        

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
                                pageTitle: 'Voltex',
                                error: true,
                                text: 'Could not add to database, try again later',
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
    
});
    

module.exports = router;
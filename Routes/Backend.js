const express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
// const url = require('url');
// const util = require('util');

const keys = require('./config/keys');
const firebase = require('./Database/firebase');
// const { json } = require('body-parser');
var path = require('path');
const querystring = require('querystring');
// const formidableMiddleware = require('express-formidable');

//To parse images
const multer = require('multer');
const fs = require("fs");
//mongodb
const mongo = require('./Database/mongodb');

// support parsing of application/json type post data
router.use(bodyParser.json());

//Different static page views using pug
const pug = require('pug');
const compileView = pug.compileFile(path.join(__dirname +'/config/backend.pug'));

//support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ limit: "50MB", extended: true}));
// router.use(bodyParser.raw({type: "multipart/form-data", limit: "10000kb", strict: false}));

// @params {Address} is /api/data
const storage = require('./config/bucket');
const upload = multer({
    dest: "./files"
})
router.route('/test/bucket').get(async (req, res) => {
    let data = await storage.url("backend/hanif (3).jpg");
    res.json(data);
}).post(upload.single("image"), async (req, res)=>{
   try{
       console.log(req.file);
    //    {
    //   fieldname: 'image',
    //  originalname: 'hanif (3).jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: './files',
    //   filename: 'f87693490f917332f9458a77982ccead',
    //    path: 'files\\f87693490f917332f9458a77982ccead',
    //     size: 740928
    //    }
    const tempPath = req.file.path;
    const name = req.file.originalname;
    const targetPath = path.join(__dirname, `./files/${name}`);

    // let response = await storage.upload("backend/", tempPath, name);
    res.json({'1':req.body , '2': req.file});
    
    
    // fs.rename(tempPath, targetPath, async (err) => {
    //     if (err) return handleError(err, res);

    //     // res
    //     //   .status(200)
    //     //   .contentType("text/plain")
    //     //   .end("File uploaded!");
    //     let response = await storage.upload("backend/", targetPath, name);
    //     res.json(response);
    //   });
    }catch(e){
        res
        .status(500)
        .contentType("text/plain")
        .end("Unable to add file" + e);
    }

    // fs.unlink(filePath, (e) => {
    //     if(e){console.log(e)};
    //     console.log("Deleted successfully");
    // });
});


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
router.route('/:userid/:uniqueID').get((req, res) =>{
    res.status(401).send(compileView({
        pageTitle: '401-Unauthorized access',
        error: true,
        text: 'Invalid header, Check the method used to send data',
      }))
      
   

}).post(upload.single("file"), async (req, res)=>{
    req.setMaxListeners(100);//This sets the maximum api requests at once to 100 requests
    console.log(req.body);
                    
    const userID = req.params.userid;
    let data = await firebase.read(userID);
    
    let d = data[0].tables.filter((item) => item.uniqueID == req.params.uniqueID)
    
    const uniqueID = d[0].uniqueID, url = d[0].url;
    // res.send(uniqueID + url + req.body['user-url']);
   
    if(req.params.uniqueID === uniqueID && req.body['user-url']  === url){
        var tablres = {
            key:  uniqueID, //key,
            db_values: {}    
        }

        
        
        return;


         //function (parsedata) to parse the user form data and add it to mongodb database
         //@param (data) this is the body of the form sent to the api
         //@param (type) if set to true it parse the data not used for plain text
         //If it is just plain text use a normal data

            for (var field in req.body){ 
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

            // If there is a file, add it to the database
            if(req.file){
                console.log("There is a file");
    
                    try{
                        console.log(req.file);
                     const tempPath = req.file.path;
                     const name = req.file.originalname;
                     const targetPath = path.join(__dirname, `./files/${name}`);
                 
                     await storage.upload("backend/", tempPath, name);
                     tablres.db_values["file"] = name;
                    
                     
                     }catch(e){
                        res.status(500).send(compileView({
                            pageTitle: 'Voltex',
                            error: true,
                            text: 'Could not add to database, try again later',
                          }))
                     }
                     
            }
            
            
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
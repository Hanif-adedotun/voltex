const express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const path = require('path');

//Mysql
var usersDB = require('./Database/database');
const keys = require('../Routes/config/keys');
const { json } = require('body-parser');

//MongoDB
const mongo = require('./Database/mongodb')

//Test save to config
const ncon = require('./config/nconfig');


//Random number generator
//Using the cryptocurrence hashing method
const crypto = require('crypto');

// support parsing of application/json type post data
router.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ extended: true }));


//Pug view for html
const pug = require('pug');
const emailhtml = pug.compileFile(path.join(__dirname+'/config/emailbody.pug'));
// @params {Address} is /api/users

//create empty variables for the users options
// var users = null, userImage = null, dbname = null;

//Router (GET method) {/api/users/login/profile}
//if the user is signed in, give the user properties to 
router.get('/login/profile', async (req, res)=>{
  // console.log(JSON.stringify(req.user));
  var user = usekey = await ncon.readFile();
  // console.log("user session check "+JSON.stringify(req.session.user));
  console.log("user",req.user);
  if(user){   
    res.status(200).json({authenticate: true, user:user});
  }else{
    ncon.refresh();
    res.status(404).json({authenticate: false,user: null});
  }
});


//Router (GET method) {/api/users/login/dashboard}
// To get both the current user details and the user stored form in the mongodb if any
router.get('/login/dashboard', async (req, res) => {
  var serverRes, usekey;
  //get dashboard from its database
    usekey = await ncon.readFile();

    const dummyTable = {
      databse: (usekey) ? usekey.id : null,
      table: keys.mysql.Table.tablename
    }
  
    if(!dummyTable.databse){
      console.log('User id '+ dummyTable.databse);
      serverRes = {
        status: 400,
        data: 'Log into databse'
      }
      res.status(404).json(serverRes);
      return;
    }


    usersDB.getfromtable(keys.mysql.database, dummyTable.table,` WHERE ${keys.mysql.Table.userID} ='${dummyTable.databse}'`).then(async function(dbResult){
      
      var tableresult = await Object(dbResult);
      
      // console.log('Test table '+JSON.stringify(tableresult));

      if(!tableresult[0]){
        console.error('User file not available');
  
        serverRes = {
          status: 404,
          data: 'Empty database'
        }
        res.status(404).json(serverRes);
        return;
      }

      const uniqueid = tableresult[0].uniqueid;
      const action_url = `${keys.backend.path}/${dummyTable.databse}/${uniqueid}`;

      
      await mongo.find(keys.mongodb.db.name, keys.mongodb.db.collection, uniqueid).then(db_res => {    
      // console.log(uniqueid);
      // console.log('Testing data from users.js :'+db_res[0].key);
     
        serverRes = {
          status: 200,
          action_url: action_url,
          data: tableresult,
          table: db_res
        }
        res.status(200).json(serverRes);
        return;
    });          

    }).catch(function(err){
      console.log('Fetch retrieval error '+ err);

      serverRes = {
        status: 500,
        data: 'Server Error'
      }
      res.status(500).json(serverRes);
      return;
    });    
    
});

//Router (GET method) {/api/users/delete/:id}
//(:id) is the id of the file to delete form mongodb
// To delete a field from the table in Mongodb 
router.route('/delete/:id').delete( async (req, res) =>{

var resp;
    await mongo.delete(keys.mongodb.db.name, keys.mongodb.db.collection, req.params.id).then(del => {
      resp = {
        code: 200,
        deleted: true,
      }
      res.status(200).json(resp);

    }).catch(function(err){
      resp = {
        code: 500,
        deleted: false,
      }
      console.log(err);
      res.status(500).json(resp);
    })
        
})


//Router (GET method) {/api/users/generateId}
// To generate a 8 character string  containing number and letters to whcich whill be used in the unique link to secure the frontend form
router.route('/generateId').get((req, res) => {
    //This function is to generate a unique id and sends it to the user
    //{return} num as a string
    function Generate(){
        let num = crypto.randomBytes(8).toString('hex');
        return num;
    }
    res.json(Generate());
});

//Router (POST method) {/api/users/createDB}
//This api is to parse the data of the form when creating a new table 
//Using the express validator package
//Returns a list of errors if there are errors or null if they are not
router.route('/createDB')
  .post([
    body('htmlUrl', 'Invalid Url').isURL({ protocols: ['http','https'] , allow_protocol_relative_urls: true, require_host: false, allow_underscores: true, require_valid_protocol: true, require_port: false, require_protocol: false}),
    body('dbname', 'Enter a valid Name, must be less than 15 characters').isString().isLength({ max: 15, min: 1}),
    body('uniqueId', 'Generate Unique ID').isAlphanumeric().isLength({ max: 16, min: 1})
      
    ],async function(req, res){
  
      // console.log(req.body.htmlUrl);
  
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {  
          
          var idnum = new Array();
           for (let i = 0; i <  errors.array().length; i++) {
            idnum.push(i);
          }
          // console.log(idnum);
          
          return res.status(400).json({ errors: errors.array() , id: idnum});
        }else{
          try {

            var usekey = await ncon.readFile();
          
            const Table = {
              databse: (usekey) ? usekey.id : null
            }
            if(Table.databse){
              usersDB.addToUserTable(keys.mysql.database, req.body.htmlUrl, req.body.dbname, req.body.uniqueId, Table.databse);
            }
            return res.status(200).json({errors: null});

          } catch (error) {

            console.log('Error adding to database:'+error);
            return res.status(500).json(null);

          }
         
        }
});

//Router (POST method) {/api/users/editVal}
//{input} (req.body.inputUrl) is the new url value
//This api contacte mysql to edit the url value of the user page
//First of all validates the string with the body-validate package, if any errors, returns an error to the user
//Uses a promise based request to the database, the returns a confirmation string to indicate if the url has been edited
router.route('/editVal').post(
[
  body('inputUrl', 'Invalid Url value').isURL({ protocols: ['http','https'] , allow_protocol_relative_urls: true, require_host: false, allow_underscores: true, require_valid_protocol: false, require_port: false, require_protocol: false})

], async function(req, res){
  const errors = validationResult(req);
        
  //(usekey) gets the current user details
  //Get the id to identify the row to edit in the database
    var usekey = await ncon.readFile();

    var userID =  (usekey) ? usekey.id : null;

    // console.log('Current user id: '+ userID);
    // console.log(req.body.inputUrl);
    
        if (!errors.isEmpty()) {  
          
          var idnum = new Array();
           for (let i = 1; i <=  errors.array().length; i++) {
            idnum.push(i);
          }
          
          return res.status(400).json({ errors: errors.array() , id: idnum});
        }else{

          usersDB.editfield({dbname: keys.mysql.database, userId: userID, urlValue: req.body.inputUrl}).then(function(reply){
            
            if(reply){
              return res.status(200).json({errors: null, edited: true});
            }else{
              return res.status(400).json({errors: [{msg: 'Server Error: Unable to Update value'}], edited: false});
            }
            //Code to tell Mysql to edit value
            
         
          }).catch(function(err){
            // throw err;
            return res.status(500).json({errors: [{msg: 'Server Error: Unable to Update value'}], edited: false});
          })

        }
});
  
//Router (POST method) {/api/users/sendmail}
//Input by the frontend:
//{req.body.to} the email address to send email to
//{req.body.subject} the subject of the email about to be sent
//{req.body.html} the html body of the email, but a different html body is used
router.route('/sendmail').post((req, res) => {

  var nodemailer = require('nodemailer');
 
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
          ciphers:'SSLv3'
        },
         auth: {
           user: keys.email.user,
           pass: keys.email.password
         }
    });

    var mailOptions = {
         from: keys.email.user,
         to: `${req.body.to}, abdulmgj007@gmail.com`,
         subject: req.body.subject,
         html: emailhtml({
          body: `This is the dynamic view rendered from server, version 1 of our email, expect more from us in the nearest future.... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat risus justo, vel convallis sem blandit in. Suspendisse ipsum neque, sagittis a sodales eget, rhoncus vitae odio. Maecenas tristique ante augue, vitae lacinia erat tristique id. Praesent vehicula velit at orci vehicula dictum. Morbi ac efficitur diam. Integer rutrum iaculis felis, eu cursus nulla dignissim sit amet. Aliquam vel eros tortor. Curabitur a est viverra, fringilla ante sed, porta nulla. Etiam ultrices tempus enim, vitae faucibus nisl tincidunt eu. Mauris cursus rutrum nunc. Integer elementum sapien vel erat porttitor, vel vehicula ante posuere.

          Nam vel ipsum rutrum, blandit est ac, convallis tortor. Mauris egestas purus viverra, volutpat felis vitae, dapibus tortor. Nullam lobortis sem sed tempus sagittis. Curabitur et libero ut felis sodales placerat. Nulla vitae euismod ipsum, in vehicula elit. Phasellus id risus orci. Nullam purus felis, posuere vitae lectus nec, feugiat posuere turpis. Etiam a porta ipsum. Duis iaculis hendrerit ultrices. Suspendisse urna nunc, consectetur quis fermentum eu, volutpat sit amet lacus. Nulla et ipsum sit amet diam molestie pretium. Aenean non ligula elit. Nunc elementum ipsum et nulla bibendum, et scelerisque tellus condimentum.
          
          Sed et pharetra sem. Vivamus egestas efficitur fermentum. Duis sed congue eros, non congue ligula. Etiam id metus a eros consectetur semper elementum sagittis mi. Sed suscipit nisi in nibh convallis tempus. Donec semper, justo sed venenatis accumsan, tortor quam venenatis sem, quis suscipit enim enim vel nunc. Vestibulum in nibh at ligula scelerisque porttitor. Cras sodales urna vitae facilisis condimentum. Duis blandit ante quis sollicitudin vehicula. Integer sed commodo enim. Sed id finibus quam. Nam porta pellentesque facilisis.
          
          Curabitur laoreet lobortis dolor quis accumsan. Cras imperdiet, nulla ac molestie iaculis, mauris elit viverra felis, ac consequat dui magna a velit. Pellentesque iaculis pharetra sem, malesuada malesuada turpis laoreet et. Aenean et faucibus est, in sollicitudin mi. Praesent elementum sagittis felis, id eleifend ligula vulputate at. Curabitur dapibus est in diam ornare feugiat. Pellentesque dictum elit sed metus commodo, sed pretium risus egestas. Morbi congue eleifend vulputate. Mauris lorem tortor, iaculis in erat et, aliquet ultrices nisl. Suspendisse ac erat nisl. Nam nisi metus, cursus vel ipsum vel, sodales mollis ex.`
        })
    }

    transporter.sendMail(mailOptions, function(error, info){
         if (error) {
           console.log(error);
           return res.status(500).json({sent: false});
         } else {
           console.log('Email sent by nodemailer: ' + info.response);
           return res.status(200).json({sent: true});
         }
       });

})


//Router (POST method) {/api/users/test-v1}
// Test api to ensure design of email is accuaretly done
router.route('/test-v1').get((req, res) => {
return res.status(200).send(emailhtml({
  body: `This is the dynamic view rendered from server, version 1 of our email, expect more from us in the nearest future.... `
}));
})

// Firebase
var fire = require('./Database/firebase');
// userid: id of the login method
// url: the url of the database
// Tablename: the user table name
// uniqueID: identifier of the table
router.route('/firebase/add').post(async (req, res) => {
  console.log(req.body.url);
  let d = await fire.write(req.body);
  res.end(d);
});

router.route('/firebase/read/all').get(async (req, res) => {
  let data = await fire.read_all();
  res.json(data);
});

router.route('/firebase/read').get(async (req, res) => {
  let data = await fire.read(req.body.userid);
  res.json(data);
});

router.route('/firebase/update').post(async (req, res) => {
  const id = req.body.id;
  delete req.body.id;
  let data = await fire.update(id, req.body);
  res.end(JSON.stringify(data));
});

router.route('/firebase/delete').delete(async (req, res) => {
  const id = req.body.id;
  let response = await fire.delete(id);
  res.json({msg: response});
});

module.exports = router;
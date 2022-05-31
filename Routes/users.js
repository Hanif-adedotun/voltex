const express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const path = require('path');

//Mysql
const keys = require('../Routes/config/keys');

//Firebase
var firebase = require('./Database/firebase');

//MongoDB
const mongo = require('./Database/mongodb')

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
  var user = usekey = req.user;
  
  if(user){   
    res.status(200).json({authenticate: true, user:user});
  }else{
    res.status(404).json({authenticate: false,user: null});
  }
});


//Router (GET method) {/api/users/login/dashboard}
// To get both the current user details and the user stored form in the mongodb if any
router.get('/login/dashboard', async (req, res) => {
  try{
       var 
       serverRes,
       data, 
       user = req.user
       id = (user) ? user.id : null;

       // If the user is not logged in session, return 400 to client
       if(!user){
            serverRes = {
            status: 400,
            data: 'Log into databse'
            }
            res.status(404).json(serverRes);
            return;
       }

       data = await firebase.read(id);
      //  console.log("firebase.read" + JSON.stringify(data));
  
       if(data.length <= 0 || data[0].tables.length <= 0){
       serverRes = {
            status: 404,
            data: 'Empty database'
       }
            res.status(404).json(serverRes);
            return;
       }

       const unique_id = data[0].tables.map((t) => t.uniqueID);
       let action_url = new Array();
       unique_id.map( (url) => 
       action_url.push(`${keys.backend.path}/${id}/${url}`)
       )

      
       let tables = new Array();
       await Promise.all(unique_id.map(async (table, i) => {
        tables.splice(i, 0, await mongo.find_new(keys.mongodb.db.name, keys.mongodb.db.collection, table))
        //  tables.push(await mongo.find_new(keys.mongodb.db.name, keys.mongodb.db.collection, table))
       }));
      //  console.log("Server",tables);
       serverRes = {
            status: 200,
            action_url: action_url,
            data: data,
            table: tables
       }
       res.status(200).json(serverRes);
       return;
       
}catch(e){
  console.log('Fetch retrieval error '+ e);

   serverRes = {
     status: 500,
     data: 'Server Error'
   }
   res.status(500).json(serverRes);
   return;
}
})


//Router (POST method) {/api/users/createDB}
//This api is to parse the data of the form when creating a new table 
//Using the express validator package
//Returns a list of errors if there are errors or null if they are not

router.route('/createDB')
  .post([
    body('url', 'Invalid Url').isURL({ protocols: ['http','https'] , allow_protocol_relative_urls: true, require_host: false, allow_underscores: true, require_valid_protocol: true, require_port: false, require_protocol: false}),
    body('Tablename', 'Enter a valid Name, must be less than 15 characters').isString().isLength({ max: 15, min: 1}),
    body('uniqueID', 'Generate Unique ID').isAlphanumeric().isLength({ max: 16, min: 1})
      
    ],async function(req, res){
        const errors = validationResult(req);
        delete req.body.docid;

        if (!errors.isEmpty()) {  
          var err = errors.errors.map((v,i) => ({id: i, ...v}));
          return res.status(400).json({ errors: err});
        }else{

          setTimeout(() => {
            res.status(200).json({errors: null, msg: "Successfully added"});
          },1000);
          return;
          try {
               var  
               user = req.user, 
               id = (user) ? user.id : null;

               if(id){ 
                    await firebase.write(id, req.body);
                    return res.status(200).json({errors: null, msg: "Successfully added"});
               }
               
               return res.status(400).json({errors: {id:0, msg: "User not added"}});

          } catch (error) {

            console.log('Error adding to database:'+error);
            return res.status(500).json(null);

          }
         
        }
});


//Router (POST method) {/api/v2/addTable}
//This api is to parse the data of the form when creating a new table 
//Using the express validator package
//Returns a list of errors if there are errors or null if they are not
router.route('/addTable')
  .post([
    body('url', 'Invalid Url').isURL({ protocols: ['http','https'] , allow_protocol_relative_urls: true, require_host: false, allow_underscores: true, require_valid_protocol: true, require_port: false, require_protocol: false}),
    body('Tablename', 'Enter a valid Name, must be less than 15 characters').isString().isLength({ max: 15, min: 1}),
    body('uniqueID', 'Generate Unique ID').isAlphanumeric().isLength({ max: 16, min: 1})
      
    ],async function(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {  

          var err = errors.errors.map((v,i) => ({id: i, ...v}));
          return res.status(400).json({ errors: err});

        }else{
          try {

               var  
               user = req.user, 
               // Expects document id from frontend
               id = (user) ? user.id : null
               docid = req.body.docid;
               delete req.body.docid;
               
               if(id){ 
                    let  d = await firebase.add_table(docid, req.body);
                    
                    return (d) ? 
                    res.status(200).json({errors: null, msg: "Successfully added table"}) 
                    : 
                    res.status(500).json({errors: {id:0, msg: "Server Error"}});
               }

               return res.status(400).json({errors: {id:0, msg: "User not added"}});

          } catch (error) {

            console.log('Error adding to database:'+error);
            return res.status(500).json(null);

          }
         
        }
});

//Router (GET method) {/api/users/delete/:id}
//(:id) is the id of the file to delete form mongodb
// To delete a field from the table in Mongodb 
router.route('/delete/:id').delete( async (req, res) =>{

var resp;
    await mongo.delete(keys.mongodb.db.name, keys.mongodb.db.collection, req.params.id).then(del => {
      resp = {
        code: 200,
        deleted: "Deleted data successfully!",
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
    // setTimeout(() =>{
    //   resp = {
    //     code: 200,
    //     deleted: "Deleted data successfully!",
    //   }
    //   res.status(200).json(resp);
    // }, 2000)
    
        
})


//Router (GET method) {/api/users/generateId}
// To generate a 8 character string  containing number and letters to whcich whill be used in the unique link to secure the frontend form
router.route('/generateId').get( async (req, res) => {
    //This function is to generate a unique id and sends it to the user
    //{return} num as a string
     function generate(){
        return crypto.randomBytes(8).toString('hex');
      }
      let d = await firebase.get_id();

      if(!d.includes(generate())) {
        res.json(generate());
      }else{
        res.json(generate());
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
    var usekey = req.user;

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
// import mjml2html from 'mjml';
const mjml2html = require('mjml');
router.route('/sendmail').post((req, res) => {

    const htmlOutput = mjml2html(`
    <mjml>
      <mj-body font-family="sans-serif, 'Courier New', Courier, monospace">

      <mj-section full-width="full-width">
        <mj-column>
          <mj-image width="50px" src="https://firebasestorage.googleapis.com/v0/b/voltex-9b3e0.appspot.com/o/app%2Flogo.png?alt=media&token=a69bdb18-8a43-47f0-9f75-3cb6aaf7f7a5" />
        </mj-column>
      </mj-section>

      <mj-section full-width="full-width" >
        <mj-column>
          <mj-text  align="center"
                    font-size="50px"
                    color="rgba(50, 80, 157, 1)">
            Voltex
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-text  align="left"
                    font-size="25px"
                    line-height="1.4"
                    color="rgba(50, 80, 157, .8)">
                    <p>This is the dynamic view rendered from server, version 1 of our email, expect more from us in the nearest future.... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat risus justo, vel convallis sem blandit in. Suspendisse ipsum neque, sagittis a sodales eget, rhoncus vitae odio. Maecenas tristique ante augue, vitae lacinia erat tristique id. Praesent vehicula velit at orci vehicula dictum. Morbi ac efficitur diam. Integer rutrum iaculis felis, eu cursus nulla dignissim sit amet. Aliquam vel eros tortor. Curabitur a est viverra, fringilla ante sed, porta nulla. Etiam ultrices tempus enim, vitae faucibus nisl tincidunt eu. Mauris cursus rutrum nunc. Integer elementum sapien vel erat porttitor, vel vehicula ante posuere.

                    Nam vel ipsum rutrum, blandit est ac, convallis tortor. Mauris egestas purus viverra, volutpat felis vitae, dapibus tortor. Nullam lobortis sem sed tempus sagittis. Curabitur et libero ut felis sodales placerat. Nulla vitae euismod ipsum, in vehicula elit. Phasellus id risus orci. Nullam purus felis, posuere vitae lectus nec, feugiat posuere turpis. Etiam a porta ipsum. Duis iaculis hendrerit ultrices. Suspendisse urna nunc, consectetur quis fermentum eu, volutpat sit amet lacus. Nulla et ipsum sit amet diam molestie pretium. Aenean non ligula elit. Nunc elementum ipsum et nulla bibendum, et scelerisque tellus condimentum.</p>
                  
          </mj-text>
        </mj-column>
      </mj-section>

      
      <mj-section full-width="full-width" background-color="#000" padding-left="5px" padding-right="5px">
        <mj-text  align="center"
                  font-size="15px"
                  line-height="2"	
                  color="rgba(255, 255, 255, .7)">
          Voltex helps you store your frontend form responses. <br margin-top="10px"> Visit our website <a href='https://hanif-adedotun.com' css-class="color: rgba(255, 255, 255, .5); text-decoration: none;" >here</a> or reach out to us <a href='mailto:hanif.adedotun@gmail.com' >via email</a>
        </mj-text>
    </mj-section>

    <mj-section margin="0" full-width="full-width" background-color="#000" padding-left="5px" padding-right="5px">
      <mj-column>
        <mj-social>
          <mj-social-element name="twitter"></mj-social-element>
        </mj-social>
      </mj-column>
      </mj-section>

      <mj-section full-width="full-width" background-color="#000">
        <mj-text  align="center"
                  font-size="13px"
                  color="rgba(255, 255, 255, .6)">
          © 2022 Voltex. All rights reserved.
        </mj-text>
    </mj-section>

    </mj-body>
    </mjml>
  `, {keepComments: false});
  // res.send(htmlOutput.html);
  // return;

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
         to: `${req.body.to}, hanif.adedotun@gmail.com`,
         subject: req.body.subject || "Testing email",
         html: htmlOutput.html,
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

module.exports = router;
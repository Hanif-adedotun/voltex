const express = require('express');
let router = express.Router();
const keys = require('../Routes/config/keys');

// Body parser
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const path = require('path');

// support parsing of application/json type post data
router.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ extended: true }));


//Firebase
var firebase = require('./Database/firebase');

//MongoDB
const mongo = require('./Database/mongodb')


//Router (GET method) {/api/v2/login/dashboard}
// To get both the current user details and the user stored form in the mongodb if any
router.get('/login/dashboard', async (req, res) => {
     try{
          var 
          serverRes,
          data, 
          // user = req.user, 
          user =  {
               id: '1006580689899733737299',
               email: 'https://github.com/Hanif-adedotun',
               name: 'Hanif Adedotun ',
               imageUrl: 'https://avatars.githubusercontent.com/u/54331442?v=4'
          }
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

     
          if(data.length <= 0 || data[0].tables.length <= 0){
          serverRes = {
               status: 404,
               data: 'Empty database'
          }
               res.status(404).json(serverRes);
               return;
          }

          const unique_id = data[0].tables.map((t) => t.uniqueID);
          const action_url = unique_id.map( (url) => 
          `${keys.backend.path}/${id}/${url}`
          )
          
          let tables = unique_id.map( async (i) => 
               await mongo.find(keys.mongodb.db.name, keys.mongodb.db.collection, i)
          ); 

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

//Router (POST method) {/api/v2/createDB}
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
        
        if (errors.length > 0) {  

          var err = errors.map((v,i) => ({id: i, ...v}));
          return res.status(400).json({ errors: err});

        }else{
          try {

               var  
               // user = req.user, 
               user =  {
                    id: '115950407227191584229',
                    email: 'https://github.com/Hanif-adedotun',
                    name: 'Hanif Adedotun ',
                    imageUrl: 'https://avatars.githubusercontent.com/u/54331442?v=4'
               }
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
        
        if (errors.length > 0) {  

          var err = errors.map((v,i) => ({id: i, ...v}));
          return res.status(400).json({ errors: err});

        }else{
          try {

               var  
               // user = req.user, 
               // Expects document id from frontend
               user =  {
                    id: '115950407227191584229',
                    email: 'https://github.com/Hanif-adedotun',
                    name: 'Hanif Adedotun ',
                    imageUrl: 'https://avatars.githubusercontent.com/u/54331442?v=4'
               }
               id = (user) ? user.id : null
               docid = req.body.docid;

               if(id){ 
                    let  d = await firebase.add_table(req, req.body);
                    
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
module.exports = router;
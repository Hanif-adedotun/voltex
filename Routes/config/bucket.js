// Import the functions you need from the SDKs you need
var firebase = require('firebase')
const config = require('../config/keys.js');

// // Initialize Firebase
// firebase.initializeApp(config.firebase.config)

// // Data
let storage = firebase.storage();

const getImage = async (folder) =>{
     let images = new Array();
     let storageRef = storage.ref();
     //2.
     storageRef.listAll().then(async function (res) {
         //3.
          res.items.forEach((imageRef) => {
           imageRef.getDownloadURL().then((url) => {
               //4.
              images.push(url);
           });
         });
       })
       .catch(function (error) {
         console.log(error);
         return error;
       });

       return images;
}
const bucket = {
     upload: null,
     url: getImage, 
     delete: null,
} 

module.exports = bucket;
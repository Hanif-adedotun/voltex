// Import the functions you need from the SDKs you need
var firebase = require('firebase')
const config = require('../config/keys.js');

// // Initialize Firebase
// firebase.initializeApp(config.firebase.config)

// // Data
// let storage = firebase.getStorage();

const bucket = {
     upload: null,
     url: null, 
     delete: null,
} 

module.exports = bucket;
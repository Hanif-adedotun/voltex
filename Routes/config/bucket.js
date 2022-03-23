// Import the functions you need from the SDKs you need
var firebase = require('firebase')
const config = require('../config/keys.js');

// // Data
let storage = firebase.storage();

const admin = require('firebase-admin');
const cert = require('./firebase-cert.json');
admin.initializeApp({
  credential: admin.credential.cert(cert),
	storageBucket: config.firebase.config.storageBucket
});
var buck = admin.storage().bucket();

const getFile = async (file) =>{
    const options = {
      version: 'v2',
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60
    };
  
    try{
      const [url] = await buck.file(file).getSignedUrl(options);
      console.log(url);
      return(url);
  }catch(e){
    return null;
  }
}


async function uploadFile(folder, filepath, filename) {
	
  try{
      await buck.upload(filepath, {
      gzip: true,
      destination: folder+filename,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });

    // console.log(`${filename} uploaded to bucket.`);
    return `${filename} uploaded to bucket.`;

  }catch(e){
    return null;
  }
}

// filepath = '/location_of/file_to_upload';
// filename = 'name_of_the_file' //can be anything, it will be the name with which it will be uploded to the firebase storage.

const bucket = {
     upload: uploadFile,
     url: getFile, 
     delete: null,
} 

module.exports = bucket;
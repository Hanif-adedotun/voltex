// Import the functions you need from the SDKs you need
var firebase = require('firebase-admin')

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYlspvF0uu_Ubu2i6WqlgKLlipMnoTRZ8",
  authDomain: "voltex-9b3e0.firebaseapp.com",
  databaseURL: "https://voltex-9b3e0-default-rtdb.firebaseio.com",
  projectId: "voltex-9b3e0",
  storageBucket: "voltex-9b3e0.appspot.com",
  messagingSenderId: "1048360397392",
  appId: "1:1048360397392:web:a2840c0e123239ed03ff55",
  measurementId: "G-G34PEPSNP7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Data
let database = firebase.database();
// url` varchar(255) DEFAULT NULL,
//   `Tablename` varchar(255) DEFAULT NULL,
//   `uniqueid` varchar(255) NOT NULL,
//   `UserID` varchar(128) NOT NULL
// @Params data:{
//   url,
//   Tablename,
//   uniqueID
// }
var writeData = async (userid, data) => {
  return new Promise(function(resolve, reject){
    const ref = database.ref(`/users/${userid}`);
  // database.ref(`/users/${userid}`).set({
  //   url: data.url,
  //   tableName: data.Tablename,
  //   _id: data.uniqueID
  // }, function(error) {
  //   if (error) {
  //     // The write failed...
  //     console.log("Failed with error: " + error);
  //     reject("Failed to add");
  //   } else {
  //     // The write was successful...
  //     console.log("Mongodb success")
  //     resolve("successful addition");
  //   }
// })
});
}

var ReadData = (userid) =>{
  database.ref(`/users/${userid}`).once('value')
.then(function(snapshot) {
    console.log( snapshot.val() )
})
}

const realTimeDB = {
  write: writeData,
  read: ReadData
}

module.exports = realTimeDB;
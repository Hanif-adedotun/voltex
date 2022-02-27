// Import the functions you need from the SDKs you need
var firebase = require('firebase')
const config = require('../config/keys.js');
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
firebase.initializeApp(config.firebase.config)

// Data
let database = firebase.firestore();
const User = database.collection('users');
// @Params data:{
// userid: id of the login method
// url: the url of the database
// Tablename: the user table name
// uniqueID: identifier of the table
// }
var writeData = async (data) => {
  await User.add({
    url: data.url,
    Tablename: data.Tablename,
    uniqueID: data.uniqueID,
    userid: data.userid
  });
  return "Successfully added";
}

var readAll =  async() => {
  const snapshot = await User.get();
  let list = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
  return list;
}

var ReadData = async (userid) =>{
  const snapshot = await User.get();
  let list = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
  let data = list.filter((v) => v.userid == userid);
  return data;
}

var update =  async(id, data) => {
  await User.doc(id).update(data);
  return "Successfully updated ";
}

var del =  async(id) => {
  await User.doc(id).delete();
  return "Successfully Deleted";
}

const realTimeDB = {
  write: writeData,
  read_all: readAll,
  read: ReadData,
  update: update,
  delete: del
}

module.exports = realTimeDB;
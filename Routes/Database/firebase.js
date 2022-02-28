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
  try{
  await User.add({
    userid: data.userid,
    tables: [{
      url: data.url,
      tablename: data.Tablename,
      uniqueID: data.uniqueID,
    }],
  });
  
  return "Successfully added";
}catch(e){
  return e;
}
}

var writeData = async (data) => {
  try{
  await User.add({
    userid: data.userid,
    tables: [{
      url: data.url,
      tablename: data.Tablename,
      uniqueID: data.uniqueID,
    }],
  });
  
  return "Successfully added";
}catch(e){
  return e;
}
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

var updateUrl =  async(id, key,data) => {
  const k = `tables[${key}].url`;
  await User.doc(id).update({
    k: data,
  });
  return "Successfully updated Url";
}

var updateName =  async(id, key,name) => {
  const k = `tables[${key}].tablename`;
  await User.doc(id).update({
    k: name,
  });
  return "Successfully updated Name";
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
  update_name: updateName,
  delete: del
}

module.exports = realTimeDB;
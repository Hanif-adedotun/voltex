// Import the functions you need from the SDKs you need
var firebase = require('firebase')
const config = require('../config/keys.js');
const FieldValue = firebase.firestore.FieldValue;
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
var writeData = async (userid, data) => {
  try{
  await User.add({
    userid: userid,
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

// @Function addTable()
// docid: the identification of a document
// data: The data that needs to be updated
// @Returns  "Successfully added"
var addTable = async (docid, data) => {
  try{
  await User.doc(docid).update({
    tables: FieldValue.arrayUnion({
      url: data.url,
      tablename: data.Tablename,
      uniqueID: data.uniqueID,
    })
  });
  
  return "Successfully added";
}catch(e){
  console.log(e)
  return null;
}
}

// @Function readAll()
// @Returns  Object of all the users
var readAll =  async() => {
  const snapshot = await User.get();
  let list = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
  return list;
}

// @Function ReadData()
// userid: unique login ID of user
// @Returns  (Object) of the specific user
var ReadData = async (userid) =>{
  const snapshot = await User.get();
  let list = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
  let data = list.filter((v) => v.userid == String(userid));
  return data;
}

// @Function getUniqeID()
// userid: unique login ID of user
// @Returns (array) the list of all unique id of tables
var getUniqeID = async () =>{
  const snapshot = await User.get();
  let list = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
  let id = new Array();
  list.map((table) => table.tables.map((v) => id.push(v.uniqueID)))
  return id;
}

// @Function update()
// id: unique login ID of user
// data: The url that needs to be updated
// @Returns  Successfully updated 
var update =  async(docid, data) => {
  await User.doc(docid).update(data);
  return "Successfully updated ";
}

// @Function updateUrl()
// id: unique login ID of user
// key: the numerical loaction of the table to be updated
// data: The data that needs to be updated
// @Returns  Successfully updated 
var updateUrl =  async(id, key,data) => {
  const k = `tables[${key}].url`;
  await User.doc(id).update({
    k: data,
  });
  return "Successfully updated Url";
}

// @Function updateUrl()
// id: unique login ID of user
// key: the numerical loaction of the table to be updated
// name: The name that needs to be updated
// @Returns  Successfully updated 
var updateName =  async(id, key,name) => {
  const k = `tables[${key}].tablename`;
  await User.doc(id).update({
    k: name,
  });
  return "Successfully updated Name";
}

// @Function updateUrl()
// docid: unique ID of document
// @Returns  Successfully Deleted 
var del =  async(docid) => {
  await User.doc(docid).delete();
  return "Successfully Deleted";
}

const realTimeDB = {
  write: writeData,
  add_table: addTable,
  read_all: readAll,
  get_id: getUniqeID,
  read: ReadData,
  update: update,
  update_name: updateName,
  delete: del
}

module.exports = realTimeDB;
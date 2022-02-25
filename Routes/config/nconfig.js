var fs = require('fs');


//(file) is where the file will be saved to
var key = 'user';
//A file to save the current user signed in 
//Used by Passport servive Google Strategy

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// function (writeFile) used to insert the current user property to the file,  so as to always keep the user file and render easily
//@param {dataSent} {
//   id: profile.id,
//   email: profile.emails,
//   name: profile.name,
//   username: profile.displayName,
//   imageUrl: profile.photos[0].value
//  };
//@return doesn't return anything
async function wf(dataSent){
  console.log(dataSent);
  localStorage.setItem(key, JSON.stringify(dataSent));
  console.log(localStorage.getItem(key));
  // console.log(req.user);
}

// function (readfil) used to get the properties of the current user 
//@param {} no inputs
//@return user properties and converts them to an object
async function rf(){
  if(localStorage[key] == ''){
    console.log('There has been an error parsing your JSON')
    return null;
  }else{
    return JSON.parse(localStorage.getItem(key));
  }
}

// function (refreshfile) used to delete the user file, when when no user is connected
//@param {} no inputs
//@return null
async function readf(){
  localStorage.setItem(key, '');
  console.log('Empty data: No User signed in');
}

var ncon ={
     fs: {
      writeFile: wf,
      readFile: rf,
      refresh: readf
     }
    
}

module.exports = ncon.fs;



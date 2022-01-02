var fs = require('fs');

//(file) is where the file will be saved to
var file = './config.json';
//A file to save the current user signed in 
//Used by Passport servive Google Strategy


// function (writeFile) used to insert the current user property to the file,  so as to always keep the user file and render easily
//@param {dataSent} {
//   id: profile.id,
//   email: profile.emails,
//   name: profile.name,
//   username: profile.displayName,
//   imageUrl: profile.photos[0].value
//  };
//@return doesn't return anything
async function writeFile(dataSent){
  var data = JSON.stringify(dataSent);
  
await fs.writeFile(file, data, function (err) {
  
  if (err) {
    console.log('There has been an error saving your configuration data.');
    console.log(err.message);
    return;
  }
  console.log('Configuration saved successfully.')
});
}

// function (readfil) used to get the properties of the current user 
//@param {} no inputs
//@return user properties and converts them to an object
async function readfil(){
   
  try {
    if(!fs.existsSync(file)){
      return null;
    }
    
    var data = await fs.readFileSync(file), myObj;

    myObj = JSON.parse(data);
    // console.dir(myObj);
    return myObj;
  }
  catch (err) {
    console.log('There has been an error parsing your JSON')
    console.log(err);
    return null;
  }
}

// function (refreshfile) used to delete the user file, when when no user is connected
//@param {} no inputs
//@return null
async function refreshfile(){
  await fs.unlink(file, (err) => {
    if (err) {
      // console.error(err);
      return;
    }
  });
  console.log('Empty data: No User signed in');
}

var ncon ={
     fs: {
      writeFile: writeFile,
      readFile: readfil,
      refresh: refreshfile
     }
    
}

module.exports = ncon.fs;



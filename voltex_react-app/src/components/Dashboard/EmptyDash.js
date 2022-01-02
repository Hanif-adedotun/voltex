import React from 'react';
// import PropTypes from 'prop-types';
import './dashboard.css';
import '../css/bootstrap.min.css';

class Emptydash extends React.Component{
    constructor(){
        super();
        this.state = {
            // State of form inputs
            htmlUrl: [],
            dbname: '',
            uniqueId: '',
            // Response from server after submitting form
            serverRes: [],
            // To set the view to fill the form of the database
            configuredatabase: []
        };
    }
    
    // Section to handle form inputs
    //function (openConfigDB) This funtion is to change the state of the dashboard to open the form view
    //@param {event} inbuilt event emmitter variable
    openConfigDB = (event) => {
        event.preventDefault();
       this.setState({configuredatabase : 'showForm'})
    }

    
    //function (handleurl) This funtion is to handle the url input, check it if its a valid url on the frontend
    //@param {event} inbuilt event emmitter variable
    handleurl = (event) =>{//sets the state to input value
        let url = event.target.value;
        this.setState({htmlUrl: url})
        let regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        if(regex.test(url)){
             console.log("Successful match"); 
        }else{ 
            console.log("No match")
        }
     }

     //function (handledbname) This funtion is to handle the name input, check it if its a valid name 
     //@param {event} inbuilt event emmitter variable
    handledbname = (event) =>{
        let dbname = event.target.value;
        this.setState({dbname: dbname})
     };


    //function (generateID) this function is to tell the server to generate a unique 8letter string 
    //@param {event} inbuilt event emmitter variable
    //{return} then returns the value
    generateID = (event) =>{
        event.preventDefault();
        // console.log('Generating Unique ID')
        
        this.setState({uniqueId: 'Generating...'});
        //uses the fetch api to generate a unique id from our server
        fetch('/api/users/generateId', {
            method: 'GET'
        })
        .then((result) => result.json())
        .then((responseid) => {this.setState({uniqueId: responseid}) })
        .catch((error) =>{
            this.setState({uniqueId: 'Unable to generate id'});
            document.getElementById('uniqueId').style.color = 'red';
            console.error('Unable to validate error ' + error);
        });
    }
    
    //function (uploadValues) this function is to tell the server to upload the form 
    //@param {event} inbuilt event emmitter variable
    //{return} set the state
    uploadValues = (event) =>{
        event.preventDefault();
        console.log('Submitting form to server');

       const data = {
           htmlUrl: this.state.htmlUrl,
           dbname: this.state.dbname,
           uniqueId: this.state.uniqueId
        };
       
        // console.log(JSON.stringify(data));

        fetch('/api/users/createDB' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then((result) => result.json())
            .then((response) => {this.setState({serverRes: response.errors}) })
            .catch( (error) =>{console.error('Unable to validate error ' + error);});

     }

        //function (serverResponse) this function checks if the server gives out any error after the form has been submitted
        //If there are no errors, it shows a good message
        //{return} sets the state
        serverResponse = () =>{
            if(this.state.serverRes){
                // console.log(this.state.serverRes);
                return(
                    <div >
                        <ul className='form-error'>
                        {this.state.serverRes.map(error =>(
                        <li className='error-li' key={error.id}> {error.msg}</li>
                    ))}
                        </ul>
                    </div>
                );
            }else{
                window.location.reload();
                return(
                    <div className='form-good'>
                        <p className='good'>All inputs are good!</p>
                    </div>
                );
                
            }
            

        } 
    
    //function (configureDatabase) this function renders a view of the form and associate every property with their corresponding functions
    configureDatabase = () =>{
        return(
           <form action='/submit' onSubmit={this.uploadValues} className='configForm' method='post'>
               <span className='formHead'>Configure database</span>
              <p className='form-group'>
                
              <label className='control-label'>Url of your html file</label>
                  <input className='form-control' name='htmlUrl' type='text' value={this.state.htmlUrl} placeholder='Url of your HTML page' onChange={this.handleurl}/>
            </p>
            <p className='form-group'>
                <label className='control-label'>Table Name</label>
                  <input className='form-control' name='dbname' type='text' value={this.state.dbname} placeholder='Name to set table' onChange={this.handledbname}/>
            </p>
            <p className='form-group'>
                <button className="btn btn-primary" onClick={this.generateID}>Click to generate unique key</button>
                  <input className="readonly" id='uniqueId' name='uniqueId' type="text" value={this.state.uniqueId} placeholder="Unique key..." readOnly/>
            </p>   
                {this.serverResponse()}
               <button type="submit" className="btn btn-unique ">Configure</button>
           </form>
       );
    }

    //The swith to controll all the views
    renderContent(){
        switch(this.state.configuredatabase){
            default:
                case []: return (<div>
                                <p>Your Dashboard is empty!</p> 
                                <button className='btn btn-primary' onClick={this.openConfigDB}>Click to configure your database</button>
                                </div>);
                case  'showForm'  : return this.configureDatabase();
        }
    }

//Renders the switch onto the view
    render(){
        return(
            <div className='emptyDash'>
                {this.renderContent()}
             </div>
        );
    }
}



export default Emptydash;

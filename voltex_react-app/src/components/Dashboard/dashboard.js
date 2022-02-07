import React from 'react';
import './dashboard.css';

import Emptydash from './EmptyDash';
import Table from './table';
import FormUI from './form';

import {Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel} from 'react-accessible-accordion';
import {Button, Tab, Tabs} from 'react-bootstrap';
//Link
import {Link } from "react-router-dom";

//Loader
import Load from '../objects/loading';



 class Dashboard extends React.Component {
     constructor(){
         super();
         
         this.state = {
             dashboard: {
                 "data": [
                     {
                        "Tablename": "Test Table",
                        "url": "https://test.com",
                        "uniqueid": "9843948988nnsjhs",
                     }
                 ], 
                 "action_url": "https://voltex.com/673778783778/89384",
                 "table":[
                    [{
                        "_id": "5fe908dae6b4883b08317084",
                        "key": "2c59cdb53b692aeb",
                        "db_values": {
                            "say": "A greeting message",
                            "to": "Dad",
                            "num": "23"
                        }
                    },
                    {
                        "_id": "5fe909c1e2721709fc263e4b",
                        "key": "2c59cdb53b692aeb",
                        "db_values": {
                            "say": "Hello",
                            "to": "Uncle",
                            "num": "20"
                        }
                    },
                    {
                        "_id": "600545a16a9f87368cbc7636",
                        "key": "2c59cdb53b692aeb",
                        "db_values": {
                            "say": "A greeting message",
                            "to": "Uncle",
                            "num": "001"
                        }
                    }],
                 ,null],
                 "status": 200,
             },
             activeDashboard: '',
             copyText: 'copy',
            //  Table Tabs
            key: 0,

            // Form Modal state
             form: false,

             //Table.js 
             delres: '',
             delText: null,
             rotate: false,

             //Edit url
             inputUrl: '',
             editUrl: false,
             serverRes: [],
             Urledited: false,
             //Sendmail
             sent: false
         };
         
     }
     //Load the database values from the MongoDB
    //  loadDatabase = () => {
    //      this.setState({rotate: true});
    //     fetch('/api/users/login/dashboard')//fetch the data from our express server running on localhost:8080
    //      .then(res => res.json())//parse the data in json format
    //      .then(dashboard => this.setState(
    //          {dashboard}, 
    //          this.setState({rotate: false})
    //          ))
    //      .catch((error) =>{console.error('Unable to get data from database' + error);});
    //  }

     componentDidMount(){
        //  this.loadDatabase();
     }

     //function (copyUrl) to copy the unique url to clipboard
     //@param {text} the text to copy to clipboard
     //To copy the form name 
      copyUrl = (text) => {
        navigator.clipboard.writeText(text).then(function(){
            console.log('Copied: '+ text);
        }, function(err){
            console.error('Unable to copy to clipboard '+err);
        });
        //change the text of the copy button to copied
        this.setState({copyText: 'Copied to clipboard!'})

    this.interval = setInterval(() => {
        this.setState({copyText: 'Copy'});
      }, 2000);
        // document.getElementById('custom_email').disabled = true;
    }
     

    //function (uploadEditVal) To upload the text of the user to the databas
    //@param {event} the inbuilt event parameter of js
    //Sent edit url to server
    uploadEditVal = (event) =>{
        event.preventDefault();
        console.log('Submitting new Url value');

        const data = {
            inputUrl: this.state.inputUrl
        };

        fetch('/api/users/editVal' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then((result) => result.json())
            .then((response) => {this.setState({serverRes: response.errors, Urledited: response.edited})})
            .catch((error) =>{console.error('Frontend: Unable to edit value ' + error);});
        
    }

   
    //function (serverResponse) this function checks if the server gives out any error after the form has been submitted
    //If there are no errors, it shows a good message
    //{return} sets the state
    serverResponse = () =>{
        if(this.state.serverRes){
            // console.log(this.state.serverRes);
            return(
                <span >
                    <ul className='form-error'>
                {this.state.serverRes.map(error =>(
                    <li className='error-li' key={error.id}> {error.msg}</li>
                ))}
                    </ul>
                </span>
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
    


    //function (dashboard_content) to render the dashboard view to the user, with different components
     dashboard_content = () => {
       
        //table names
        const options ={
            name: this.state.dashboard.data[0].Tablename, 
            url: this.state.dashboard.data[0].url, 
            id: this.state.dashboard.data[0].uniqueid

        };

        //url to put in user form action
        const action_url = this.state.dashboard.action_url;
   
        //Changes the icons to up and down when needed
        this.changeIcon = () =>{
            var icon = document.getElementById('acc-arrow');
            var icon_down = 'glyphicon glyphicon-chevron-up small';
            var icon_up = 'glyphicon glyphicon-chevron-down small';

            if(icon.className === icon_down){
                icon.className = icon_up;
            }else{
               icon.className = icon_down;
            }
        }

        //function (editUrl) Used to edit the url of the front end page
        this.editUrl = () =>{
            console.log(this.state.editUrl);
            this.setState({editUrl: true});
        }
        

        return(
            // The section before the table itself, for the table properties
            <div className='dashboard_content'>
                 <Tabs
                    id="controlled-tab-example"
                    activeKey={this.state.key}
                    onSelect={(k) => this.setState({key: k})}
                    className="mb-3"
                >
                    {this.state.dashboard.table.map((v,i) => 

                       <Tab eventKey={i} title={"Table"+i} key={i}>
                        <Accordion allowZeroExpanded={true} className='acc' onChange={this.changeIcon}>
                        <AccordionItem>
                            <AccordionItemHeading className='acc-head'>
                                <AccordionItemButton>
                                    <span>Table details</span> <span id='acc-arrow' className='glyphicon glyphicon-chevron-down'></span>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel className='acc-body'>
                                <p><span className='acc-body-label'>Table name:</span> {options.name}</p>
                                <p><span className='acc-body-label'>Static page:</span><a href={options.url}  target='_blank' > {options.url}</a> <button id='dEdit-button' onClick={this.editUrl}><span  className='glyphicon glyphicon-pencil dEdit'></span></button></p>
                                {(this.state.editUrl === true) ? 
                                <p>
                                    <span className='acc-body-label'>
                                    <input name='inputUrl' className='inputEdit' type='text' placeholder='Type in new url' value={this.state.inputUrl} onChange={(event)=>{this.setState({inputUrl: event.target.value})}}/>
                                    </span> 
                                    <Button className='btn btn-unique' onClick={this.uploadEditVal}>Edit</Button>
                                    <Button className='btn btn-danger' onClick={() => this.setState({editUrl: false})}>Cancel</Button>
                                    <p>{this.serverResponse()}</p>
                                    {/* {(this.state.Urledited) ? <p><span className="glyphicon glyphicon-warning-danger">Unable to edit value</span></p> : ''} */}
                                    </p>: ''}
                                <p><span className='acc-body-label'>Key:</span> {options.id}</p>
                            </AccordionItemPanel>
                        </AccordionItem>
                        {/* {(this.state.editUrl) ? */}
                    </Accordion>
                    <div className='Faction'>Your form action should be <span className='unique url' id='copyurl'>{String(action_url)}</span>
                    <p><button className='btn export' data-tip data-for='copytool'  id='copyT' onClick={()=> this.copyUrl(action_url)}><span className='glyphicon glyphicon-copy'></span> {this.state.copyText}</button></p>
                    </div>

                {/* The table data  */}
                {/*
                    @param {tableName} The name of the user's table 
                    @param {table} The full table details of all the data
                    @param {delval} The function to delete the table row
                    @param {delText} *IN CONSTRUCTION* The text to display while deleting value
                    @param {loadDatabase} The function to refresh the table data from the server
                */}
                    <Table 
                    tableName={this.state.dashboard.data[0].Tablename} 
                    table={this.state.dashboard.table[i]} 
                    delval={this.tableDelete} delText={this.state.delres} 
                    loadDatabase={this.loadDatabase}
                    rotate={this.state.rotate}
                    sendmail={this.sendmail}/>
                       </Tab>
                    )}
                    <Tab eventKey="contact" title="+" onClick={() => this.setState({form: true})}>
                   Fill the form
                   <FormUI
                        show={this.state.form}
                        onHide={() => this.setState({form: false})}
                        />
                    </Tab>
                   </Tabs>
                
            
              <span className='unique'>{(this.state.sent) ? 'E-mail has been sent successfully!': ''}</span>
            </div>
        );
     }

     //function (tableDelete) function to delete a row in the table
     //@param (val) the id of the row to delete
     //Functions for child element Table.js
     tableDelete = async (val) =>{
         
         this.setState({delText: 'Deleting...'});

        await fetch(`/api/users/delete/${val}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
               },
            })
            .then(resp => resp.json()) // or res.json()
            .then(delres => {this.setState({delres: delres.deleted}); this.setState({delText: null}); console.log('Deleted document: '+ val);})
            .catch((error) =>{console.error('Unable to delete data in database' + error); this.setState({delText: 'Unable to delete'}) });
        // Note that add effect of delete button loading when delete is pressed
        this.loadDatabase();
    }
     //function (signedout) returns the signed out view  
     signedout = () =>{
        return(
            <div className='signedout'>
                <div className='s-text'>You need to Sign in to access dashboard, Go to <Link to='/profile'><span>profile</span></Link> to sign in now!</div>
            </div>
        )
     }
      //function (loading) returns the loading animation with a text of waiting
     loading = () =>{
         return(
            <div>
                <Load color=' #61dafb' type='bubbles'/> 
                <p className='unique space'>Please wait while we are checking for your table......</p>
            </div>
         )
     }
     //function (serverError) returns an error by the server 
     serverError = () =>{
         return(
             <div>
                 <p className='serverErr'>There is either a connection error or Server Error, Check your internet connection and refresh!</p>
             </div>
         )
     }
     
     //function (sendmail) This function is used to send an automatic email
     //nodemailer only works on the server side, so we have to semd a request to the server, then it sends the email automatically
     sendmail = () =>{
        const data = {
            to: 'hanif.adedotun@gmail.com',
            subject: 'Welcome to Voltex Family',
            html: `<p>Welcome Hanif to voltex middlewear mail service </p>`
        };

        fetch('/api/users/sendmail' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then((result) => result.json())
            .then((response) => {this.setState({sent: Boolean(response.sent)})})
            .catch((error) =>{console.error('Frontend: Unable to send mail'+ error);
        });
        this.interval = setInterval(() => {
            this.setState({sent: false});
            console.log(this.state.sent);
          }, 9000);
     }

     //function (renderContent) Switch for all the views of the dashboard
     renderContent(){
        // console.log('Status Server '+this.state.dashboard.status);
         switch(this.state.dashboard.status){
             default: return this.loading();

                 case 400: return this.signedout();
                 case 404: return <Emptydash />;
                 case 200: return this.dashboard_content();
                 case 500: return this.serverError();
         }
     }
    //function (render) Renders the views
      render() {
          console.log(this.state.editUrl);
        return (
            <div className='dashboard'>
            <h2>Dashboard</h2>
            {this.renderContent()}
            </div>
        );
      }
}
export default Dashboard ;
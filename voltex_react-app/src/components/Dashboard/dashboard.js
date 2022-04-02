import React from 'react';
import './dashboard.css';

import Emptydash from './EmptyDash';
import Table from './table';
import FormUI from './form';

import {Button, Tab, Tabs} from 'react-bootstrap';
import {Sliders, Plus} from 'react-bootstrap-icons';
//Link
import {Link } from "react-router-dom";

//Loader
import Settings from './settings';

// SVG
import LoginIcon from "../images/login.svg";
import Warning from "../images/illustrations/warning.svg";
import LogoAlt from "../images/logo2.png";
 class Dashboard extends React.Component {
     constructor(){
         super();
         
         this.state = {
             dashboard: [],
             activeDashboard: '',
             copyText: 'copy',
            //  Table Tabs
            key: 0,

            // Form Modal state
             form: false,
             setting: false,
             setting_data:{
                name: null, 
                url: null, 
                id: null,
                actionUrl: null,
                i:null
             },

             //Table.js 
             delres: '',
             delText: null,
             rotate: false,
             actionUrl: [],

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
     loadDatabase = () => {
         this.setState({rotate: true});
        fetch('/api/users/login/dashboard')//fetch the data from our express server running on localhost:8080
         .then(res => res.json())//parse the data in json format
         .then(dashboard => this.setState(
             {dashboard}, 
             this.setState({rotate: false}),
            this.setState({actionUrl: dashboard.action_url}),
             ))
         .catch((error) =>{console.error('Unable to get data from database' + error);});

        
     }

     componentDidMount(){
        document.title = "Dashboard - Voltex";
        // console.log( "User in local storage"+localStorage.getItem("user"));
        // console.log( "Table in local storage"+localStorage.getItem("table"));
        this.props.setKey();
        let user = localStorage.getItem("user");
        let table = localStorage.getItem("table");


         if(user && table){  
             this.setState({dashboard: JSON.parse(table), actionUrl:JSON.parse(table).action_url});
            console.log("Local storage data used"+ this.state.dashboard.status)
         }
        // setTimeout(() => this.loadDatabase(), 200);
        this.loadDatabase();
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
    


    //function (dashboard_content) to render the dashboard view to the user, with different components
     dashboard_content = () => {
    //    console.log(this.state.dashboard.data[0].userid);           
        return(
            // The section before the table itself, for the table properties
            <div className='dashboard_content'>
                 <Tabs
                    className="tab-tabs"
                    activeKey={this.state.key}
                    onSelect={(k) => {this.setState({key: k}); if (k==="+") {this.setState({form: true})}}}
                >
                    {this.state.dashboard.data[0].tables.map((v,i) => 
                       <Tab tabClassName='tab-tab' eventKey={i} title={v.tablename} key={i}>
                            <Button className='btn-setting' 
                            onClick={() => {
                                            this.setState({setting: true, setting_data:{
                                                name: v.tablename, 
                                                url: v.url, 
                                                id: v.uniqueID,
                                                actionUrl: this.state.actionUrl[i],
                                                i:i}}); 
                                            }}>
                                <Sliders height={20} width={20}/> Settings</Button>
                           <Settings
                        show={this.state.setting}
                        onHide={() => this.setState({setting: false})}
                        options={{
                            name: this.state.setting_data.name, 
                            url: this.state.setting_data.url, 
                            id: this.state.setting_data.id,
                            actionUrl: this.state.setting_data.actionUrl,
                            i: this.state.setting_data.i
                        }}
                        />
                         
                {/* The table data  */}
                {/*
                    @param {tableName} The name of the user's table 
                    @param {table} The full table details of all the data
                    @param {delval} The function to delete the table row
                    @param {delText} *IN CONSTRUCTION* The text to display while deleting value
                    @param {loadDatabase} The function to refresh the table data from the server
                */}
                      <Table 
                        tableName={v.tablename}  
                        table={this.state.dashboard.table[this.state.key]} 
                        delText={this.state.delres} 
                        loadDatabase={this.loadDatabase}
                        rotate={this.state.rotate}
                        actionUrl={this.state.dashboard.action_url[i]}
                        d={this.state.dashboard}/>
                        
                    </Tab>
                    )}
                    <Tab tabClassName='tab-tab' eventKey="+" title={<Plus height={30} width={30}/>} onClick={(e) => {e.preventDefault(); this.setState({form: true})}}>
                   Fill the form
                   {/* <FormUI
                        show={this.state.form}
                        onHide={() => {this.setState({form: false, key:0})}}
                        newTable={false}
                        docid={this.state.dashboard.data[0].id}
                        /> */}
                    </Tab>

                </Tabs>

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
        document.title = "Sign in to voltex"
        return(
            <div className='signedout'>
                <div className='signedout-cont'>
                <img src={LoginIcon} alt="Signed out Icon" className='signedout-img'/>
                <div className='s-text'>You need to Sign in to access dashboard</div>
                <Link to='/profile'><Button className='btn-setting'>Sign in now!</Button></Link>
                </div>
            </div>
        )
     }
      //function (loading) returns the loading animation with a text of waiting
     loading = () =>{
         return(
                <div className='loading'>
                    <img src={LogoAlt} alt="Voltex Logo" className='load-logo'/>
                    <p>Loading table.....</p>
                </div>
         )
     }
     //function (serverError) returns an error by the server 
     serverError = () =>{
        document.title = "Server Error"
         return(
             <div>
                  <img src={Warning} alt="Server error Icon" className='signedout-img'/>
                 <p className='serverErr'>There is either a network error or Server Error, Check your internet connection and refresh!</p>
             </div>
         )
     }
     
         //function (renderContent) Switch for all the views of the dashboard
     renderContent(){
        console.log('Status Server '+this.state.dashboard.status);
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
        return (
            <div className='dashboard'>
            {this.renderContent()}
            </div>
        );
      }
}
export default Dashboard ;
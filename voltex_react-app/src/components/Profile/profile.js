// import { request } from 'express';
import React from 'react';
import './profile.css';
import {Link} from 'react-router-dom';
//Loader
import logo from '../images/logo.png';


//Import Login Logos
import Gicon from '../images/icon/google.svg';
import Giticon from '../images/icon/github.svg';
import Facebook from '../images/icon/facebook.svg';
import SignOut from '../images/icon/sign-out.svg';

//function (gsign) Google button both for sign in and sign out
//@param {name} The text the will show in the button
//@param {github} Default is false, but if true the github button settings will be activated
var gsign = (name, icon) =>{
    return(
        <div className=  {'sign-in'}>
            <div className='content-wrapper'>
                <span className='logo-wrapper'>
                    <img id='img-login' alt={`${name} logo`} src={icon}></img>
                </span>
                <span className='text-container'> {name} </span>
            </div>
        </div>
    );
}

class Profile extends React.Component{
    constructor(){
        super();
        this.state = {
            user: [],
            authenticate: [],
            notice: ''
        };
    }

    componentDidMount(){
        fetch('/api/users/login/profile')//fetch the data from our express server running on localhost:8080
        .then(res => res.json())//parse the data in json format
        .then(response => this.setState({user: response.user, authenticate: response.authenticate}, () => {this.renderuser();}))
        .catch((error) =>{console.error('Unable to get user image' + error);});
    };
    
   
   //function (handleusersignin) to sign a user in using fetch api to the backend, then reload the page
   //@param {e} is the default event 
   handleusersignin = (e) =>{
    e.preventDefault();
    window.open('http://localhost:5000/api/auth/signin', '_self');
   }

   handlegithubsignin = (e) =>{
    e.preventDefault();
    window.open('http://localhost:5000/api/auth/github', '_self');
   }

   //function (handlesignout) to sign a user out  using fetch api to the backend, then reload the page
   //@param {e} is the default event 
   handlesignout  = (e) =>{
       e.preventDefault();
    //    alert('Sign out');
       fetch('/api/auth/logout')//fetch the data from our express server running on localhost:8080
        .then(res => res.json())//parse the data in json format
        .then(response => this.setState({authenticate: response.authenticate}, () => {console.log('User Signed out'); this.renderuser(); }))
        .catch((error) =>{console.error('Unable to sign out' + error);});
        
        localStorage.removeItem("user");
        window.location.reload();
    
   }

//function (userprofile) the view for the user when signed in
    userprofile = () =>{
        // localStorage.setItem("user", this.state.user);
        return(
            <div className='l-card'>
                <div className='l-card-d'>
                    {/* <h1>Hello {this.state.user.name}</h1> */}
                    <div className='user'>
                        <p className='img-prof-cont'><img src={this.state.user.imageUrl} alt='User icon' className='img-profile'></img></p>
                        <p>Welcome {this.state.user.name}</p>
                        <p>E-mail: {this.state.user.email}</p>
                        <p className='dash-msg'>Go to <Link className="prof-link" to='/dashboard'>Dashboard</Link> to access your tables</p>
                    </div>
                    <div className='gsign signout' onClick={this.handlesignout}>
                        {gsign('Sign out', SignOut)}
                    </div>
                </div>
            </div>
        );
    }

    //function (handlesignout) view when an account is not signed in
    notsignedin = () =>{
        localStorage.removeItem("user");
        return(
            <div className='l-card shadow' id='signin'>
                <div className='signin-container'>
                    <h2>Login</h2>
                    <div className='gsign' onClick={this.handleusersignin}>
                    {gsign('Continue With Google', Gicon)}
                    </div>
                    
                    <div className='gsign' onClick={this.handlegithubsignin}>
                    {gsign('Continue With Github', Giticon)}
                    </div>

                    <div className='gsign coming-soon'>
                    {gsign('Continue With Facebook', Facebook)}
                    </div>
                </div>
            </div>
        );
    }

    //function (renderuser) the switch button to change between views
    // Views Loading icon, signed in profile and not signed in profile
    renderuser(){       
        switch(this.state.authenticate){
            default: return (
                <div className="nav-docs-cont">
                    <div className="nav-docs">
                        <img className="nav-docs-logo" src={logo} alt="Voltex logo"/>
                        <p>Loading User...</p>
                    </div>
                </div>
            )
                case false: return this.notsignedin();
                case true: return this.userprofile();
        }
        
    }
    
    //Render the Views on the screen
    render(){
        return(
            <div className='Profile'>
                {this.renderuser()}
            </div>
        );
    }
}

export default Profile;
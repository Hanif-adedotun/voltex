// import { request } from 'express';
import React from 'react';
import '../css/bootstrap.min.css';
import './profile.css';


//Loader
import Load from '../objects/loading';


//Import Login Logos
import Gicon from '../images/icon/google.svg'
import Giticon from '../images/icon/github.svg'


//function (gsign) Google button both for sign in and sign out
//@param {name} The text the will show in the button
//@param {github} Default is false, but if true the github button settings will be activated
var gsign = (name, github=false) =>{
// var googlelogo = 'https://img.icons8.com/color/40/000000/google-logo.png';
// var gitlogo = "https://img.icons8.com/windows/40/000000/github.png";

    return(
        <div className=  {(github) ? 'github-sign-in sign-in': 'g-sign-in-button sign-in'}>
            <div className='content-wrapper'>
                <span className='logo-wrapper'>
                    <img id='logo' alt='Google logo' src={(github) ? Giticon : Gicon}></img>
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
        .then(response => this.setState({user: response.user, authenticate: response.authenticate}, () => {console.log('Profile updated'); this.renderuser();}))
        .catch((error) =>{console.error('Unable to get user image' + error);});
    };
    
   
   //function (handleusersignin) to sign a user in using fetch api to the backend, then reload the page
   //@param {e} is the default event 
   handleusersignin = (e) =>{
    e.preventDefault();
    window.open('http://localhost:8080/api/auth/signin', '_self');
   }

   handlegithubsignin = (e) =>{
    e.preventDefault();
    window.open('http://localhost:8080/api/auth/github', '_self');
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

        window.location.reload();
    
   }

//function (userprofile) the view for the user when signed in
    userprofile = () =>{
        return(
            <div>
                <h1>Hello {this.state.user.name}</h1>
                <div className='user'>
                    <p><img src={this.state.user.imageUrl} alt='User icon' className='img-circle'></img></p>
                    <p>Welcome {this.state.user.name}</p>
                    <p>E-mail: {this.state.user.email}</p>
                    <p>Go to dashboard to access your tables</p>
                </div>
                <div className='gsign' onClick={this.handlesignout}>
                    {gsign('Sign out')}
                </div>
            </div>
        );
    }

    //function (handlesignout) view when an account is not signed in
    notsignedin = () =>{
        return(
            <div>
                <h2>Seems you are not signed in, sign in now!</h2>
                <div className='gsign' onClick={this.handleusersignin}>
                 {gsign('Sign in With Google')}
                </div>
                
                <div className='gsign' onClick={this.handlegithubsignin}>
                 {gsign('Sign in With Github', true)}
                </div>
            </div>
        );
    }

    //function (renderuser) the switch button to change between views
    // Views Loading icon, signed in profile and not signed in profile
    renderuser(){
        console.log('The user profile '+String(this.state.authenticate));
        
        switch(this.state.authenticate){
            default: return <Load color='rgb(54, 123, 252)' type='bubbles'/>
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
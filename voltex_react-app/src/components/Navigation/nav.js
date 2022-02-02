import React from 'react';
import {Switch, Route, BrowserRouter as Router, NavLink} from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';
 

import './nav.css';
import Dashboard from '../Dashboard/dashboard';
import Home from '../Home/home';
import Profile from '../Profile/profile';
import About from '../about/about';

//Logo
import logo from '../images/logo.png';

let bg = "http://localhost:5000";
class navigation extends React.Component{
    
    constructor(){
        super();
        this.state = {
            imageUrl: null
        };
    }
    componentDidMount(){
        this.getImage();//Get the image initially
        // this.interval = setInterval(() => {
        //     this.getImage();
        //   }, 20000);//then check every minute 8 seconds for 
    }

    //function (getImage) get the user image from the database
    //Using fetch api to the database
        getImage = () =>{
            fetch('/api/users/login/profile')//fetch the data from our express server running on localhost:8080
            .then(res => res.json())//parse the data in json format
            .then(response => this.setState({imageUrl: response.user.imageUrl, user: response.user}))
            .catch((error) =>{console.error('Unable to get user image' + error);});
        }

        //function (defaultimage) puts the default glyphicon image if no user is connected
        defaultimage = () =>{
            return(
                <span className="glyphicon glyphicon-user g-nav"></span>
            );
        }
        //function (userImage) component for the user image sent by the server
        //@param {imgsrc} the url of the user icon sent by Google 
        userImage = (imgsrc) =>{
            return(
                <img src={imgsrc} alt='User icon' className='nav-img-circle' ></img>
            );
        }
        //function (renderImage) the switch for the views
        renderImage(){
            switch(this.state.imageUrl){
                case null: return this.defaultimage();
                default: return this.userImage(this.state.imageUrl);
            }
        }

    //function (render) Renders the views to the user
    render(){
        return(
            <Router>
             <Navbar collapseOnSelect expand="md" sticky="top" className='nav-cus shadow'>
                    <Navbar.Brand href="/"><img
                        src={logo}
                        width="45"
                        height="45"
                        className="d-inline-block align-top nav-logo"
                        alt="Voltex logo"
                    /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="/" className='nav-l'>Home</Nav.Link>
                        <Nav.Link href="/about" className='nav-l'>About</Nav.Link>
                        <Nav.Link href="/docs" className='nav-l'>Docs</Nav.Link>
                        <Nav.Link href="/dashboard" className='nav-l'>Dashboard</Nav.Link>
                    </Nav>
                    <Nav className="mr-auto">
                        <Nav.Link href="/profile" className={`nav-p ${(this.state.imageUrl) ? "img-c" : null}` } >{(this.state.imageUrl) ? this.renderImage(): "Logo"}</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
            </Navbar>
                           
                <div className='content'>
                <Switch >
                    <Route path='/' exact component={Home}/>
                    <Route path='/about' exact component={About}/>
                    <Route path='/dashboard' exact component={Dashboard}/>
                    <Route path='/profile' exact component={Profile}/>
                    <Route path='/docs' exact component={() => {
                        window.location.href = 'https://voltex.readme.io';
                        return null;
                    }} />
                </Switch>
                </div>
            </Router> 
        );
    }
}

export default navigation;
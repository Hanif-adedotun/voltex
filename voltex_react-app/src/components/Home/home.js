import React from 'react';
import './home.css';
import {Container, Row, Col, Button} from 'react-bootstrap';
import { ArrowRightShort, Clipboard} from 'react-bootstrap-icons';
import {Link} from 'react-router-dom';
import { Slide } from "react-awesome-reveal";
//All the illustrations going to be used
import H from "../images/illustrations/home_desc.svg";
import Doc from "../images/illustrations/doc.svg";
import Quick from "../images/illustrations/quick.svg";
import Setup from "../images/Setuptable.png";
import Merged from "../images/merged.gif";

//function (showTime) To get the current time and returns it in string format
//This function is to show the time, and it updates itself after every 15 seconds 
function showTime() {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();
    var meridian;
  
    if (currentHour >= 12 && currentHour < 24) {//if its betweeen 12pm and 12am, the meridian changes
        currentHour = currentHour - 12;
        if (currentHour === 0) {//if it is noon the hour changes to 12pm
            currentHour = '12';
        }
        meridian = 'pm';
    } else {
        meridian = 'am';
    }
  
    //console.log(currentMinute);
  
    if (currentMinute < 10) { //if the seconds is less than 10, it adds 0 at the begining of the minute value
        currentMinute = '0' + currentMinute;//addition of 0 
    }
    
    var Totaltime = currentHour + ' : ' + currentMinute + ' ' + meridian;
    String(Totaltime); //Converts the time to a String
   
    // console.log(Totaltime);
    return Totaltime;
  }

//function (tim) returns whether the user is online or offline
function tim () {
  // console.log('online: '+navigator.onLine);
  return String(navigator.onLine);
};

class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            time: showTime(),
            user: [],
            internet: tim(),
            //Crpto price
            key: 'price',
            prices: [],
            features: [
             [ "Give your form a storage in less than 5 minutes", Quick],
              ["Quick one-step-integration", Setup],
             [ "Works regardless of the frontend framework you are using", Merged],
            ]
        };
      }

      componentDidMount(){
        document.title = "Home - Voltex"
        this.interval = setInterval(() => {
          this.setState({internet: tim()});
        }, 1500);
      }
    
      //function (offlineText) checks if there is internet connection in the state 
      //{returns} The text that warns the user
      offlineText = () =>{
        if(this.state.internet === 'false'){
          return(
            <div className='isContainer'>
              <p className='internet_status'><span className='glyphicon glyphicon-warning-sign'></span> Seems you are not connected to the internet</p>
            </div>
          )
        }
      }


      render(){
          return(
            <div className='Home'>
              <div className="h-head">
                <h1 className="h-head-h1">Voltex</h1>
                <span>The only backend you need for your forms...</span>
              </div>

                 <Container className="h-main">
                   <Row >
                     <Col className='h-left' md={{ span: 6, order: 'first'}} xs={{ span:12, order: 'last' }}>
                       <div className="h-left-div">
                       <div className='h-head'>
                        <h1 >Quickly store your forms without having any backend</h1>
                       </div>
                       <Row>
                         <Col xs={6} className="btn-pri"><Link to="/profile"><button>Get Started <ArrowRightShort height={30} width={30}/></button></Link></Col>
                         <Col xs={6} className="btn-sec"><Link to ="/about" ><button >Learn more</button></Link></Col>
                       </Row>
                       </div>
                     </Col>
                     
                     <Col md={{ span: 6, order: 'last'}} xs={{ span:12, order: 'first' }}>
                     <Slide direction="right"><img src={H} className='h-img' alt={"opaque definition"}/></Slide>
                     </Col>
                     
                   </Row>
                 </Container>

                 <Container className="feat">
                      {this.state.features.map((f, i) =>
                        <Row className="feat-cont" key={i}>
                        <Col sm={{ span: 6, order: (i%2 === 0) ? "first":"last"}} className="feat-head-cont"><div className="feat-head">{f[0]}</div></Col>
                        <Col sm={6}><img src={f[1]} className="feat-img shadow" alt="html code form" /></Col>
                      </Row>
                      )}
                   
                  </Container>



                {/* Secondary section */}
                <Container className='alt-sec' fluid>

                  <Container className="h-docs">
                          <Row>
                            <Col xs={5} className='docs-txt'>
                              <div className='docs-c'>
                                <h1>Effective and easy to use resources</h1>
                                
                                <p className='read-more'>
                                  <Button>Read our api docs <Clipboard width={30} height={30}/></Button>
                                </p>
                              </div>
                              </Col>
                            <Col xs={7}><img  className='h-docs-img' src={Doc} alt="Document"/></Col>
                          </Row>
                  </Container>

                  <Container className="sec-advert">
                  <Row>
                    <Col className="sec-advert-text">
                    <h1>Sign up for free.</h1>
                    <h1>Connect your form right away!</h1></Col>
                    <Col sm={3} className="get-started"><Slide direction="up"><Link to ="/profile" ><Button size='medium'>Get started</Button></Link></Slide></Col>
                  </Row>
                  </Container>


                </Container>
                 
            </div>
          );
      }
}

export default Home;
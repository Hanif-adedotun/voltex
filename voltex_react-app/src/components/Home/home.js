import React from 'react';
import './home.css';
import {Container, Row, Col} from 'react-bootstrap';
//All the illustrations going to be used
import H from "../images/illustrations/home_desc.svg";


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
            prices: []
        };
      }

      componentDidMount(){
        this.cryptoPrice();
        this.interval = setInterval(() => {
          this.setState({time: showTime()});
          this.setState({internet: tim()});
        }, 1500);
        this.interval = setInterval(() => {
          this.cryptoPrice();
        }, 50000);
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

      //function (cryptoPrice), gets the current prices of crypto
      cryptoPrice = () =>{
        fetch('https://api.nomics.com/v1/currencies/ticker?key=5100e2897b3012f64449c1302a5c90c2&ids=BTC,ETH&interval=1d,30d&convert=NGN&per-page=100&page=1')//fetch the data from our express server running on localhost:8080
            .then(res => res.json())//parse the data in json format
            .then(prices => {
              this.setState({prices: prices});
              localStorage.setItem(this.state.key, JSON.stringify(prices));
          })
            .catch((error) =>{
              console.error('Unable to get prices' + error);
              this.setState({prices: (localStorage[this.state.key]) ? JSON.parse(localStorage[this.state.key]):[]})
            });
      }

      currency = (number) =>{
        var num = Number(number);
        var formatter = new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
        
          // These options are needed to round to whole numbers if that's what you want.
          //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
          //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        return formatter.format(num);
      }

      componentWillUnmount(){
        clearInterval(this.interval);
      }

      render(){
        // this.price();
          return(
            <div className='Home'>
            <header className='headGlass'>
                  <h1 className='headGlass-head'>Voltex Middlwear</h1>
                  <p className='tagline'>Quickly integrate a back-end with your frontend with just a click</p>
                  <p>Time is <span className='time'>{this.state.time}</span></p>
                  <div className='crypto'>
                    {(this.state.prices) ? 
                    Object.values(this.state.prices).map((value, index) => 
                    <div key={index} className="crypto_container">
                      <span ><img src={value.logo_url} className='crypto_logo'></img></span> 
                      <span  id='crypto_name'>{value.name}</span> 
                      <span  id='crypto_price'>{this.currency(value.price)}</span>  
                      <span  id='cryptoChange'>{(Number(value['1d'].price_change_pct) < 0) ? <span className="glyphicon glyphicon-chevron-down red">{Number(value['1d'].price_change_pct *100).toFixed(2)}%</span>: <span className="glyphicon glyphicon-chevron-up green">{Number(value['1d'].price_change_pct *100).toFixed(2)}%</span>}</span>
                    </div>
                    )
                    : 'Crypto Price Placeholder, Coming Soon....   '}
                    </div> 
                  {this.offlineText()}    
            </header>

                 <Container>
                   <Row>
                     <Col sm={6}>
                       <h2 className='h-head'>
                       Quickly store your forms without hassle.
                       </h2>
                     </Col>
                     <Col sm={6}>
                       <img src={H} alt={"opaque definition"}/>
                     </Col>
                   </Row>
                 </Container>

            

            </div>
          );
      }
}

export default Home;
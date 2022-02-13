import React from 'react';
import './css/App.css';
import './Home/home'
import Nav from './Navigation/nav';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component{
  constructor(){
    super();
    this.state = {
        time: {},
        about: ''
    };
  }

  componentDidMount(){
    // this.interval = setInterval(() => this.setState({time: showTime()}), 15000);
    console.log(window.location.pathname);
  }

  componentWillUnmount(){
    // clearInterval(this.interval);
  }

  checkLocation = () => {
    if(window.location.pathname === "/dashboard"){
      return "blue";
    }
  }

  render() {
    return (
      <div className={`App ${this.checkLocation()}`}>
        <Nav/>
      </div>
    );
  }
}



//npm run dev
export default App;


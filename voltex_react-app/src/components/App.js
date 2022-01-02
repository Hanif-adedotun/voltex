import React from 'react';
import './css/App.css';
import './Home/home'
import Nav from './Navigation/nav';


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
  }

  componentWillUnmount(){
    // clearInterval(this.interval);
  }


  render() {
    return (
      <div className="App">
        <Nav/>
      </div>
    );
  }
}



//npm run dev
export default App;


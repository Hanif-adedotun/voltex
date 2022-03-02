import React from 'react';
// import PropTypes from 'prop-types';
import './dashboard.css';
import FormUI from './form';


import EmpytSVG from '../images/illustrations/empty.svg';

class Emptydash extends React.Component{
    constructor(){
        super();
        this.state = {
            // To set the view to fill the form of the database
            form: false
        };
    }
    

    //function (handleurl) This funtion is to handle the url input, check it if its a valid url on the frontend
    //@param {event} inbuilt event emmitter variable
    // handleurl = (event) =>{//sets the state to input value
    //     let url = event.target.value;
    //     this.setState({htmlUrl: url})
    //     let regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    //     if(regex.test(url)){
    //          console.log("Successful match"); 
    //     }else{ 
    //         console.log("No match")
    //     }
    //  }

//Renders the switch onto the view
    render(){
        return(
            <div className='emptyDash'>
                    <p>Your Dashboard is empty!</p> 
                    <div>
                        <img className="empty-svg" src={EmpytSVG} alt='Empty Illlustration'/>
                    </div>
                     <button className='btn-primary' onClick={() => this.setState({form: true})}>Setup a new Table</button>

                     <FormUI
                        show={this.state.form}
                        onHide={() => this.setState({form: false})}
                        docid={null}
                        newTable={true}
                        />
             </div>
        );
    }
}



export default Emptydash;

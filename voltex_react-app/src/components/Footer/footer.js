import React from 'react';
import './footer.css';
import logo from '../images/voltex.png';


var year = new Date().getFullYear();
class footer extends React.Component{
    render(){
        return(
            <div className='footer'>
                <span>
                    <img className='footimg' src={logo} alt='Voltex logo'></img>   
                </span>
                <div className='row'>
                <div className='col-md-4 foot' id='contactLinks'>
                    <label>Contact US</label>
                    <ul>
                        <li><a href='https://github.com/Voltex-designs' >Github</a></li>
                        <li><a href='#' >twitter</a></li>
                        <li><a href='#' >Instagram</a></li>
                        <li><a href='#'>E-mail</a></li>
                    </ul>
                </div>
                <div className='col-md-4 foot' id='policies'>
                <label>Policies</label>
                    <ul>
                        <li><a href='#'>Private policies</a></li>
                        <li><a href='#'>Lincense</a></li>
                    </ul>
                </div>
                <div className='col-md-4 foot' id='site'>
                <label>Links</label>
                    <ul>
                        <li><a href='#'>Sitemap</a></li>
                        <li><a href='#'>Report problem</a></li>
                    </ul>
                </div>
                </div>
                <p className='footext'>&copy; Copyright <a href='https://hanif-adedotun.com'>Hanif Adedotun</a> {year}</p>
            
            </div>
        )
    }

}

export default footer;
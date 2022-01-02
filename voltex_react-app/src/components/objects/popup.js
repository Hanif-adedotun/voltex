import React from 'react';
import './dashboard.css';
import PropTypes from 'prop-types';
import '../css/bootstrap.min.css';

//popup
import Popup from 'reactjs-popup';

//Popup unknown if beign used in other Programs
//Pendng deleting for now

const popoup = ({primary, buttonName, message})=>{
     return(
          <Popup trigger={<button className={(primary) ? primary: 'btn btn-primary'}> {(buttonName)} </button>} modal>
              
          {close=>(
              <div className='modal'>
              <button className="close" onClick={close}> &times;</button>
              <div className="content">
              {message}
              </div>
              </div>
          )}
        </Popup>
      );
}

popoup.propTypes={
     primary: PropTypes.bool,
     buttonName: PropTypes.string.isRequired,
}

export default popoup;


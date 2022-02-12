import React from 'react';
import './dashboard.css';
import PropTypes from 'prop-types';


//popup
import Popup from 'reactjs-popup';

//Popup unknown if beign used in other Programs
//Pendng deleting for now

const popoup = ({primary, buttonName, message})=>{
     return(
          <Popup trigger={<Button className={(primary) ? primary: 'btn btn-primary'}> {(buttonName)} </Button>} modal>
              
          {close=>(
              <div className='modal'>
              <Button className="close" onClick={close}> &times;</Button>
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


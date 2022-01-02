// import React from 'react';
// import './loading.css';

// const load = ()=>{
//      return(
//      <div className='loader'>
//      </div>
//      );
// };

// export default load;
import React from 'react';
import ReactLoading from 'react-loading';
 

//Class {loader} this is a class for loading icons, for better accesebility throughout
//@param {color} Can be any color used to customise the loader
//@param {types} the types of loader that can be used, for vm it is bubbles
// blank
// balls
// bars
// bubbles
// cubes
// cylon
// spin
// spinningBubbles
// spokes
const loader = ({ type='bubbles', color='#61dafb' }) => (
    <ReactLoading type={type} color={color} className='loader' delay={1} />
    //height={'20%'} width={'20%'}
);
 
export default loader;